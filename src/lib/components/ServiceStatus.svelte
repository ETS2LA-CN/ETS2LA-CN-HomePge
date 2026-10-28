<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowClockwise, ArrowUpRight, CheckCircle, WarningCircle } from "phosphor-svelte";
  import {
    MONITOR_TAGS,
    STATUS_PAGE_URL,
    eventInScope,
    eventIsCurrent,
    eventIsUpcoming,
    getOverallStatus,
    statusLabels,
    type Monitor,
    type StatusResponse,
  } from "../status";
  import { reveal } from "../reveal";
  import MonitorCard from "./MonitorCard.svelte";
  import StatusEvents, { type EventItem } from "./StatusEvents.svelte";

  let data = $state<StatusResponse | null>(null);
  let loading = $state(true);
  let refreshing = $state(false);
  let error = $state<string | null>(null);
  let lastLoadedAt = 0;

  const monitors = $derived(
    MONITOR_TAGS.map((tag) => data?.data[tag]).filter(
      (monitor): monitor is Monitor => Boolean(monitor),
    ),
  );
  const overallStatus = $derived(getOverallStatus(monitors));
  const events = $derived<EventItem[]>(
    data
      ? [
          ...data.incidents.map((event) => ({ ...event, kind: "incident" as const })),
          ...data.maintenances.map((event) => ({ ...event, kind: "maintenance" as const })),
        ]
          .filter(eventInScope)
          .sort((a, b) => {
            const now = Date.now();
            const aUpcoming = eventIsUpcoming(a, now);
            const bUpcoming = eventIsUpcoming(b, now);
            if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
            return aUpcoming
              ? a.start_date_time - b.start_date_time
              : b.start_date_time - a.start_date_time;
          })
          .slice(0, 4)
      : [],
  );
  const currentEventCount = $derived(
    events.filter((event) => eventIsCurrent(event, Date.now())).length,
  );
  const upcomingEventCount = $derived(
    events.filter((event) => eventIsUpcoming(event, Date.now())).length,
  );
  const eventNotice = $derived(
    currentEventCount > 0
      ? `当前有 ${currentEventCount} 项相关故障或维护需要关注`
      : upcomingEventCount > 0
        ? `近期有 ${upcomingEventCount} 项相关维护计划`
        : "当前无进行中的相关故障或维护",
  );

  const overallMessages: Record<string, string> = {
    UP: "全部服务运行正常",
    DOWN: "部分服务出现异常",
    DEGRADED: "部分服务性能下降",
    MAINTENANCE: "部分服务正在维护",
    NO_DATA: "暂时无法确认服务状态",
  };

  const REFRESH_INTERVAL = 5 * 60 * 1000;

  async function loadStatus() {
    if (!data) loading = true;
    refreshing = true;
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      data = (await response.json()) as StatusResponse;
      lastLoadedAt = Date.now();
      error = null;
    } catch {
      error = data
        ? "本次刷新失败，当前展示的是上次成功获取的数据。"
        : "暂时无法获取服务状态，请检查网络后重试。";
    } finally {
      loading = false;
      refreshing = false;
    }
  }

  function formatUpdatedAt(value: string) {
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(value));
  }

  onMount(() => {
    loadStatus();
    const interval = window.setInterval(() => {
      if (!document.hidden) loadStatus();
    }, REFRESH_INTERVAL);
    const onVisibilityChange = () => {
      if (!document.hidden && Date.now() - lastLoadedAt >= REFRESH_INTERVAL) {
        loadStatus();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  });
</script>

<section id="status" class="section service-status" use:reveal aria-labelledby="status-title">
  <div class="container">
    <div class="section-heading status-heading">
      <div>
        <p class="section-kicker">实时服务状态</p>
        <h2 id="status-title" class="section-title">下载与服务是否可用，清楚可见</h2>
        <p class="section-description">状态数据来自 ETS2LA 中国镜像的 Kener 监控页，每 5 分钟自动更新。</p>
      </div>
      <a class="text-link" href={STATUS_PAGE_URL} target="_blank" rel="noreferrer">
        完整状态页<ArrowUpRight size={16} weight="bold" />
      </a>
    </div>

    {#if loading && !data}
      <div class="status-skeleton" aria-label="正在加载服务状态">
        <div class="skeleton-banner"></div>
        <div class="skeleton-grid">
          {#each [0, 1] as item}
            <div class="skeleton-card" aria-hidden="true">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line title"></div>
              <div class="skeleton-metrics"><div></div><div></div></div>
              <div class="skeleton-bars"></div>
            </div>
          {/each}
        </div>
      </div>
    {:else if !data && error}
      <div class="load-error" role="alert">
        <WarningCircle size={32} />
        <div><h3>服务状态加载失败</h3><p>{error}</p></div>
        <button class="button button-secondary" type="button" onclick={loadStatus}>
          <ArrowClockwise size={20} />重新加载
        </button>
      </div>
    {:else if data}
      <div class={`overall-banner status-${overallStatus.toLowerCase().replaceAll("_", "-")}`} aria-live="polite">
        <div>
          <span class="overall-icon">
            {#if overallStatus === "UP"}<CheckCircle size={24} weight="fill" />{:else}<WarningCircle size={24} weight="fill" />{/if}
          </span>
          <div>
            <strong>{overallMessages[overallStatus]}</strong>
            <p>{eventNotice}</p>
          </div>
        </div>
        <span class="overall-label">{statusLabels[overallStatus]}</span>
      </div>

      {#if error}
        <p class="refresh-error" role="status">{error}</p>
      {/if}

      <div class="monitor-grid">
        {#each monitors as monitor, index}
          <MonitorCard {monitor} tag={MONITOR_TAGS[index]} />
        {/each}
      </div>

      <div class="events-heading">
        <div><h3>故障与维护记录</h3><p>展示与上述服务相关的维护计划和最近事件。</p></div>
      </div>
      <StatusEvents {events} />

      <div class="status-meta">
        <span>更新于 {formatUpdatedAt(data.fetchedAt)}（北京时间）</span>
        <button type="button" disabled={refreshing} onclick={loadStatus} aria-label="立即刷新服务状态">
          <ArrowClockwise size={16} weight="bold" />{refreshing ? "正在更新" : "立即刷新"}
        </button>
      </div>
    {/if}
  </div>
</section>

<style>
  .service-status {
    background: var(--bg-dark);
  }

  .status-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    max-width: none;
  }

  .status-heading > div {
    max-width: 680px;
  }

  .status-heading .text-link {
    flex: 0 0 auto;
    margin-bottom: 8px;
  }

  .overall-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg);
  }

  .overall-banner > div {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .overall-icon {
    color: var(--accent-text);
  }

  .status-up .overall-icon { color: #35d07f; }
  .status-down .overall-icon { color: #ca3345; }
  .status-degraded .overall-icon { color: #ca9100; }

  .overall-banner strong {
    color: var(--text-h);
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
  }

  .overall-banner p {
    margin: 4px 0 0;
    color: var(--description);
    font-size: 14px;
    line-height: 20px;
  }

  .overall-label {
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-l);
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
  }

  .monitor-grid,
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .events-heading {
    margin-block: 48px 24px;
  }

  .events-heading h3 {
    margin: 0;
    color: var(--text-h);
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  .events-heading p {
    margin: 8px 0 0;
    color: var(--description);
    font-size: 14px;
    line-height: 20px;
  }

  .status-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 24px;
    color: var(--description);
    font-size: 12px;
    line-height: 16px;
  }

  .status-meta button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 0;
    border-radius: 4px;
    color: var(--accent-text);
    background: transparent;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition:
      color 300ms var(--ease-out),
      background-color 300ms var(--ease-out);
  }

  .status-meta button:hover {
    color: var(--text-h);
    background: var(--surface);
  }

  .status-meta button:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  .refresh-error {
    margin: -8px 0 24px;
    color: #ca9100;
    font-size: 14px;
    line-height: 20px;
  }

  .load-error {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 32px;
    border: 1px solid #8a2d3a;
    border-radius: 12px;
    color: #ca3345;
    background: var(--bg);
  }

  .load-error > div {
    flex: 1;
  }

  .load-error h3 {
    margin: 0;
    color: var(--text-h);
    font-size: 20px;
    line-height: 28px;
  }

  .load-error p {
    margin: 8px 0 0;
    color: var(--text-l);
    font-size: 14px;
    line-height: 20px;
  }

  .status-skeleton {
    display: grid;
    gap: 24px;
  }

  .skeleton-banner,
  .skeleton-card > *,
  .skeleton-metrics > div {
    border-radius: 8px;
    background: var(--bg);
    animation: status-pulse 1.5s var(--ease-out) infinite alternate;
  }

  .skeleton-banner {
    height: 96px;
  }

  .skeleton-card {
    display: grid;
    gap: 24px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .skeleton-line {
    height: 16px;
  }

  .skeleton-line.short { width: 96px; }
  .skeleton-line.title { width: 64%; height: 24px; }

  .skeleton-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .skeleton-metrics > div {
    height: 80px;
  }

  .skeleton-bars {
    height: 40px;
  }

  @keyframes status-pulse {
    from { opacity: 0.45; }
    to { opacity: 1; }
  }

  @media (max-width: 800px) {
    .monitor-grid,
    .skeleton-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .status-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 24px;
    }

    .overall-banner {
      align-items: flex-start;
      padding: 16px;
    }

    .overall-banner strong {
      font-size: 18px;
      line-height: 28px;
    }

    .overall-label {
      display: none;
    }

    .load-error {
      align-items: flex-start;
      flex-direction: column;
      padding: 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton-banner,
    .skeleton-card > *,
    .skeleton-metrics > div {
      animation: none;
      opacity: 0.7;
    }
  }
</style>
