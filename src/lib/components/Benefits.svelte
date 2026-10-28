<script lang="ts">
  import { ArrowUpRight, BookOpen, ChatsCircle, Code, DownloadSimple } from "phosphor-svelte";
  import { features } from "../content";
  import { reveal } from "../reveal";

  const icons = {
    download: DownloadSimple,
    book: BookOpen,
    chat: ChatsCircle,
    code: Code,
  };
</script>

<section id="features" class="section benefits" use:reveal aria-labelledby="benefits-title">
  <div class="container">
    <div class="section-heading">
      <p class="section-kicker">面向中国用户</p>
      <h2 id="benefits-title" class="section-title">从下载到上路，入口都更简单</h2>
      <p class="section-description">不重复堆砌项目介绍，只把国内使用时常用的下载、文档、社区和源码入口放在清楚的位置。</p>
    </div>

    <div class="feature-grid">
      {#each features as feature}
        {@const Icon = icons[feature.icon]}
        <a class="feature-card" href={feature.link} target="_blank" rel="noreferrer">
          <div class="icon"><Icon size={24} weight="duotone" /></div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <span class="card-link">{feature.linkLabel}<ArrowUpRight size={16} weight="bold" /></span>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  .benefits {
    background: var(--bg);
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 280px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-dark);
    transition:
      transform 500ms var(--ease-out),
      border-color 300ms var(--ease-out),
      background-color 300ms var(--ease-out);
  }

  .feature-card:hover {
    border-color: var(--accent);
    background: var(--surface);
    transform: translateY(-4px);
  }

  .feature-card:active {
    transform: scale(0.98);
  }

  .icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-bottom: 24px;
    border: 1px solid var(--accent-dark);
    border-radius: 12px;
    color: var(--accent-text);
    background: var(--accent-deep);
  }

  h3 {
    margin: 0;
    color: var(--text-h);
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  p {
    margin: 12px 0 24px;
    color: var(--text-l);
    font-size: 16px;
    line-height: 24px;
  }

  .card-link {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  @media (max-width: 640px) {
    .feature-grid {
      grid-template-columns: 1fr;
    }

    .feature-card {
      min-height: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .feature-card {
      transform: none !important;
      transition-property: border-color, background-color, opacity;
      transition-duration: 200ms;
    }
  }
</style>
