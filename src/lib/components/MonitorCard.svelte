<script lang="ts">
  import { ArrowUpRight } from "phosphor-svelte";
  import {
    STATUS_PAGE_URL,
    formatDay,
    formatDayUptime,
    formatUptime,
    getDayStatus,
    statusLabels,
    type Monitor,
  } from "../status";

  type Props = {
    monitor: Monitor;
    tag: string;
  };

  let { monitor, tag }: Props = $props();

  function statusClass(status: string) {
    return status.toLowerCase().replaceAll("_", "-");
  }
</script>

<article class={`monitor-card status-${statusClass(monitor.currentStatus)}`}>
  <div class="monitor-header">
    <div>
      <span class="monitor-status"><i></i>{statusLabels[monitor.currentStatus] ?? "状态未知"}</span>
      <h3>{monitor.name}</h3>
    </div>
  </div>

  <div class="metrics">
    <div><strong>{formatUptime(monitor.uptime)}</strong><span>近 30 天可用率</span></div>
    <div><strong>{monitor.avgLatency || "暂无数据"}</strong><span>平均延迟</span></div>
  </div>

  <div class="history">
    <div class="history-label"><span>近 30 天</span><span>悬停查看每日可用率</span></div>
    <div class="history-bars" role="group" aria-label={`${monitor.name}近 30 天每日状态`}>
      {#each monitor.uptimeData as day}
        {@const status = getDayStatus(day)}
        {@const tooltip = `${formatDay(day.ts)} · ${statusLabels[status]} · 可用率 ${formatDayUptime(day)}`}
        <button
          type="button"
          class={`day-${statusClass(status)}`}
          aria-label={tooltip}
          data-tooltip={tooltip}
        ></button>
      {/each}
    </div>
    <div class="history-label"><span>{monitor.uptimeData.length > 0 ? formatDay(monitor.uptimeData[0].ts) : ""}</span><span>今天</span></div>
  </div>

  <a class="monitor-link" href={`${STATUS_PAGE_URL}/monitors/${tag}`} target="_blank" rel="noreferrer">
    查看监控详情<ArrowUpRight size={16} weight="bold" />
  </a>
</article>

<style>
  .monitor-card {
    display: flex;
    flex-direction: column;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-dark);
    transition: border-color 300ms var(--ease-out);
  }

  .monitor-card:hover {
    border-color: var(--accent);
  }

  .monitor-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .monitor-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: var(--text-l);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .monitor-status i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  .status-up .monitor-status { color: #35d07f; }
  .status-down .monitor-status { color: #ca3345; }
  .status-degraded .monitor-status { color: #ca9100; }
  .status-maintenance .monitor-status { color: var(--accent-text); }

  h3 {
    margin: 0;
    color: var(--text-h);
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
  }

  .metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-block: 24px;
  }

  .metrics > div {
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
  }

  .metrics strong,
  .metrics span {
    display: block;
  }

  .metrics strong {
    color: var(--text-h);
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  .metrics span {
    margin-top: 4px;
    color: var(--description);
    font-size: 12px;
    line-height: 16px;
  }

  .history {
    margin-bottom: 24px;
  }

  .history-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: var(--description);
    font-size: 12px;
    line-height: 16px;
  }

  .history-label:last-child {
    margin: 8px 0 0;
  }

  .history-bars {
    display: grid;
    grid-template-columns: repeat(30, minmax(0, 1fr));
    gap: 2px;
    height: 40px;
  }

  .history-bars > button {
    position: relative;
    min-width: 0;
    padding: 0;
    border: 0;
    border-radius: 2px;
    cursor: help;
  }

  .history-bars > button::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    z-index: 20;
    display: none;
    width: max-content;
    max-width: 240px;
    padding: 8px 12px;
    border: 1px solid var(--accent);
    border-radius: 8px;
    color: var(--text-h);
    background: var(--surface);
    font-size: 12px;
    line-height: 16px;
    white-space: normal;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, 4px);
  }

  .history-bars > button:hover::after,
  .history-bars > button:focus-visible::after {
    display: block;
    opacity: 1;
    transform: translate(-50%, 0);
    animation: tooltip-fade 300ms var(--ease-out);
  }

  .history-bars > button:nth-child(-n + 3)::after {
    left: 0;
    transform: translateY(4px);
  }

  .history-bars > button:nth-child(-n + 3):hover::after,
  .history-bars > button:nth-child(-n + 3):focus-visible::after {
    transform: translateY(0);
  }

  .history-bars > button:nth-last-child(-n + 3)::after {
    right: 0;
    left: auto;
    transform: translateY(4px);
  }

  .history-bars > button:nth-last-child(-n + 3):hover::after,
  .history-bars > button:nth-last-child(-n + 3):focus-visible::after {
    transform: translateY(0);
  }

  @keyframes tooltip-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .day-up { background: #01bb4e; }
  .day-down { background: #ca3345; }
  .day-degraded { background: #ca9100; }
  .day-maintenance { background: #9a6a54; }
  .day-no-data { background: #474747; }

  .monitor-link {
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    margin-top: auto;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    transition: color 300ms var(--ease-out);
  }

  .monitor-link:hover {
    color: var(--text-h);
  }

  @media (max-width: 480px) {
    .monitor-card {
      padding: 16px;
    }

    .metrics {
      gap: 8px;
    }

    .metrics > div {
      padding: 12px;
    }

    .metrics strong {
      font-size: 20px;
      line-height: 28px;
    }

    .history-bars {
      height: 32px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .history-bars > button::after {
      transform: none !important;
      animation: none;
      transition: opacity 200ms var(--ease-out);
    }
  }
</style>
