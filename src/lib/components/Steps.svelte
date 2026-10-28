<script lang="ts">
  import { ArrowUpRight } from "phosphor-svelte";
  import { links, steps } from "../content";
  import { reveal } from "../reveal";
</script>

<section id="steps" class="section steps" use:reveal aria-labelledby="steps-title">
  <div class="container">
    <div class="section-heading">
      <p class="section-kicker">三步开始使用</p>
      <h2 id="steps-title" class="section-title">先获得安装包，再按指引完成配置</h2>
      <p class="section-description">不需要先在社区寻找文件。下载、安装和问题排查都有明确入口。</p>
    </div>

    <ol class="step-list">
      {#each steps as step}
        <li>
          <span class="number">{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>
      {/each}
    </ol>

    <a class="text-link" href={links.docs} target="_blank" rel="noreferrer">
      查看完整中文使用文档
      <ArrowUpRight size={16} weight="bold" />
    </a>
  </div>
</section>

<style>
  .steps {
    background: var(--bg-dark);
  }

  .step-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin: 0 0 32px;
    padding: 0;
    list-style: none;
  }

  li {
    position: relative;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg);
  }

  .number {
    display: block;
    margin-bottom: 48px;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  h3 {
    margin: 0;
    color: var(--text-h);
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  p {
    margin: 12px 0 0;
    color: var(--text-l);
    font-size: 16px;
    line-height: 24px;
  }

  @media (max-width: 800px) {
    .step-list {
      grid-template-columns: 1fr;
    }

    .number {
      margin-bottom: 24px;
    }
  }
</style>
