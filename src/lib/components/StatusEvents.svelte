<script lang="ts">
  import { ArrowUpRight, CalendarBlank, Warning } from "phosphor-svelte";
  import {
    MONITOR_TAGS,
    STATUS_PAGE_URL,
    eventDisplaySummary,
    eventDisplayTitle,
    eventIsUpcoming,
    formatEventTime,
    type StatusEvent,
  } from "../status";

  export type EventItem = StatusEvent & { kind: "incident" | "maintenance" };

  type Props = {
    events: EventItem[];
  };

  let { events }: Props = $props();

  const eventStatusLabels: Record<string, string> = {
    COMPLETED: "已完成",
    RESOLVED: "已解决",
    CANCELLED: "已取消",
    CANCELED: "已取消",
    SCHEDULED: "已计划",
    ACTIVE: "进行中",
    ONGOING: "进行中",
    IN_PROGRESS: "进行中",
    INVESTIGATING: "排查中",
    IDENTIFIED: "已定位",
    MONITORING: "观察中",
  };
</script>

<div class="event-list">
  {#if events.length === 0}
    <div class="empty-events">
      <CalendarBlank size={24} />
      <p>暂无与这些服务相关的故障、维护记录或维护计划。</p>
    </div>
  {:else}
    {#each events as event (`${event.kind}-${event.id}`)}
      {@const affectedMonitors = event.monitors?.filter((monitor) =>
        MONITOR_TAGS.includes(monitor.monitor_tag as (typeof MONITOR_TAGS)[number]),
      )}
      <article class={`event-card ${event.kind}`}>
        <div class="event-topline">
          <span class="event-kind">
            {#if event.kind === "incident"}<Warning size={16} weight="fill" />故障{:else}<CalendarBlank size={16} weight="fill" />{eventIsUpcoming(event, Date.now()) ? "维护计划" : "维护"}{/if}
          </span>
          <span class="event-status">{eventStatusLabels[event.status.toUpperCase()] ?? event.status}</span>
        </div>
        <h3>{eventDisplayTitle(event.title)}</h3>
        <p class="event-time">
          {formatEventTime(event.start_date_time)}
          {#if event.end_date_time}<span>至 {formatEventTime(event.end_date_time)}</span>{/if}
        </p>
        {#if eventDisplaySummary(event.description)}
          <p class="event-description">{eventDisplaySummary(event.description)}</p>
        {/if}
        {#if affectedMonitors && affectedMonitors.length > 0}
          <p class="event-scope">影响服务：{affectedMonitors.map((monitor) => monitor.monitor_name).join("、")}</p>
        {/if}
        <a href={`${STATUS_PAGE_URL}/${event.kind === "incident" ? "incidents" : "maintenances"}/${event.id}`} target="_blank" rel="noreferrer">
          查看事件详情<ArrowUpRight size={16} weight="bold" />
        </a>
      </article>
    {/each}
  {/if}
</div>

<style>
  .event-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .event-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg);
  }

  .event-card.incident {
    border-color: #8a2d3a;
  }

  .event-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    margin-bottom: 16px;
  }

  .event-kind {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .incident .event-kind {
    color: #ca3345;
  }

  .event-status {
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-l);
    font-size: 12px;
    line-height: 16px;
  }

  h3 {
    margin: 0;
    color: var(--text-h);
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
  }

  .event-time {
    margin: 12px 0 0;
    color: var(--description);
    font-size: 12px;
    line-height: 16px;
  }

  .event-time span {
    display: block;
    margin-top: 4px;
  }

  .event-description {
    margin: 16px 0;
    color: var(--text-l);
    font-size: 14px;
    line-height: 20px;
  }

  .event-scope {
    margin: 0 0 16px;
    color: var(--description);
    font-size: 12px;
    line-height: 16px;
  }

  .event-card > a {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    transition: color 300ms var(--ease-out);
  }

  .event-card > a:hover {
    color: var(--text-h);
  }

  .empty-events {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 32px;
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--description);
    background: var(--bg);
  }

  .empty-events p {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
  }

  @media (max-width: 800px) {
    .event-list {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .event-card {
      padding: 16px;
    }
  }
</style>
