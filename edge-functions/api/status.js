const DEFAULT_KENER_ORIGIN = "https://status.ets2la.cn";
const MONITOR_TAGS = [
  "ets2la-cn-c-backed-zong",
  "ets2la-cn-c-plugins-downloads",
];
const REQUEST_TIMEOUT = 8000;
const EVENT_WINDOW = 90 * 24 * 60 * 60;

function getKenerOrigin(env) {
  const configured =
    env?.KENER_ORIGIN ??
    (typeof process !== "undefined" ? process.env.KENER_ORIGIN : undefined);
  return (configured || DEFAULT_KENER_ORIGIN).replace(/\/+$/, "");
}

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...init.headers,
    },
  });
}

async function fetchJson(origin, path, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(`${origin}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    });
    if (!response.ok) throw new Error(`Kener returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function onRequestGet({ env } = {}) {
  const kenerOrigin = getKenerOrigin(env);
  const endTimestamp = Math.floor(Date.now() / 1000);
  const monitorPath = `/dashboard-apis/monitor-bars?tags=${MONITOR_TAGS.join(",")}&days=30`;

  try {
    const [monitors, events] = await Promise.all([
      fetchJson(kenerOrigin, monitorPath),
      fetchJson(kenerOrigin, "/dashboard-apis/events-by-month", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_ts: endTimestamp - EVENT_WINDOW,
          end_ts: endTimestamp + EVENT_WINDOW,
        }),
      }),
    ]);

    return jsonResponse(
      {
        ...monitors,
        incidents: events.incidents ?? [],
        maintenances: events.maintenances ?? [],
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=300, stale-while-revalidate=900",
        },
      },
    );
  } catch (error) {
    console.error("Kener status request failed", error);
    return jsonResponse(
      {
        error: "UPSTREAM_UNAVAILABLE",
        message: "暂时无法获取服务状态，请稍后重试。",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
