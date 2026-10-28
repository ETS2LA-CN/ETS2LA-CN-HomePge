export const MONITOR_TAGS = [
  "ets2la-cn-c-backed-zong",
  "ets2la-cn-c-plugins-downloads",
] as const;

export const STATUS_PAGE_URL = "https://status.ets2la.cn";

export type MonitorStatus = "UP" | "DOWN" | "DEGRADED" | "MAINTENANCE" | "NO_DATA";

export type DayStatus = {
  ts: number;
  countOfUp: number;
  countOfDown: number;
  countOfDegraded: number;
  countOfMaintenance: number;
  avgLatency: number;
  maxLatency: number;
  minLatency: number;
};

export type Monitor = {
  name: string;
  description: string;
  image: string | null;
  currentStatus: MonitorStatus | string;
  uptime: string;
  uptimeData: DayStatus[];
  avgLatency: string;
  maxLatency: string;
  minLatency: string;
};

export type EventMonitor = {
  monitor_tag: string;
  monitor_name: string;
  monitor_impact: string;
};

export type StatusEvent = {
  id: number;
  title: string;
  description: string;
  start_date_time: number;
  end_date_time: number | null;
  status: string;
  monitors?: EventMonitor[];
};

export type StatusResponse = {
  data: Record<string, Monitor>;
  missingTags: string[];
  incidents: StatusEvent[];
  maintenances: StatusEvent[];
  fetchedAt: string;
};

export const statusLabels: Record<string, string> = {
  UP: "运行正常",
  DOWN: "服务异常",
  DEGRADED: "性能下降",
  MAINTENANCE: "维护中",
  NO_DATA: "暂无数据",
};

export function getDayStatus(day: DayStatus): MonitorStatus {
  if (day.countOfDown > 0) return "DOWN";
  if (day.countOfDegraded > 0) return "DEGRADED";
  if (day.countOfMaintenance > 0) return "MAINTENANCE";
  if (day.countOfUp > 0) return "UP";
  return "NO_DATA";
}

export function getOverallStatus(monitors: Monitor[]): MonitorStatus {
  const statuses = monitors.map((monitor) => monitor.currentStatus);
  for (const status of ["DOWN", "DEGRADED", "MAINTENANCE", "UP"] as const) {
    if (statuses.includes(status)) return status;
  }
  return "NO_DATA";
}

export function formatUptime(value: string) {
  const uptime = Number(value);
  return Number.isFinite(uptime) ? `${uptime.toFixed(2)}%` : "暂无数据";
}

export function formatDayUptime(day: DayStatus) {
  const total =
    day.countOfUp + day.countOfDown + day.countOfDegraded + day.countOfMaintenance;
  if (total === 0) return "暂无数据";
  const available = day.countOfUp + day.countOfDegraded + day.countOfMaintenance;
  return `${((available / total) * 100).toFixed(2)}%`;
}

export function formatEventTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp * 1000));
}

export function formatDay(timestamp: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp * 1000));
}

export function eventDisplayTitle(title: string) {
  return title
    .replace(/[（(](?=[^（）()]*[A-Za-z])(?![^（）()]*[\u4e00-\u9fff])[^（）()]*[）)]/g, "")
    .replace(/([）)])\s*[A-Za-z][A-Za-z0-9\s,.&/-]*$/, "$1")
    .replace(/\s+[A-Za-z][A-Za-z0-9\s,.&/-]*$/, "")
    .trim();
}

export function eventDisplaySummary(description: string) {
  const chineseParagraphs = description
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/^\s*#{1,6}\s+/gm, ""))
    .filter((paragraph) => /[\u4e00-\u9fff]/.test(paragraph));
  const summary = chineseParagraphs
    .join(" ")
    .replace(/[（(](?=[^（）()]*[A-Za-z])(?![^（）()]*[\u4e00-\u9fff])[^（）()]*[）)]/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^\s*\d+\.\s*/gm, "")
    .replace(/^\s*-\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return summary.length > 240 ? `${summary.slice(0, 240)}…` : summary;
}

export function eventInScope(event: StatusEvent) {
  if (!event.monitors || event.monitors.length === 0) return true;
  return event.monitors.some((monitor) =>
    MONITOR_TAGS.includes(monitor.monitor_tag as (typeof MONITOR_TAGS)[number]),
  );
}

export function eventIsUpcoming(event: StatusEvent, now: number) {
  const inactive = ["COMPLETED", "RESOLVED", "CANCELLED", "CANCELED"];
  return !inactive.includes(event.status.toUpperCase()) && event.start_date_time * 1000 > now;
}

export function eventIsCurrent(event: StatusEvent, now: number) {
  const inactive = ["COMPLETED", "RESOLVED", "CANCELLED", "CANCELED"];
  if (inactive.includes(event.status.toUpperCase())) return false;
  if (event.start_date_time * 1000 > now) return false;
  return !event.end_date_time || event.end_date_time * 1000 >= now;
}
