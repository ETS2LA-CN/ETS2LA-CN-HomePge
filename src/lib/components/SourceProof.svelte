<script lang="ts">
  import { ArrowUpRight, GitBranch, GithubLogo, ShieldCheck } from "phosphor-svelte";
  import { links } from "../content";
  import { reveal } from "../reveal";
</script>

<section class="section source-proof" use:reveal aria-labelledby="source-title">
  <div class="container proof-layout">
    <div class="proof-copy">
      <p class="section-kicker">开放来源，清楚可查</p>
      <h2 id="source-title" class="section-title">镜像让访问更方便，公开仓库让来源更透明</h2>
      <p class="section-description">本站由国内用户独立运营，并接受 ETS2LA 开发者监督。代码与发布记录均链接到公开仓库，便于核验来源和版本信息。</p>
      <div class="assurance"><ShieldCheck size={24} weight="duotone" /> 不提供经过二次封装的安装程序</div>
    </div>

    <div class="repository-list">
      <a href={links.cnbProject} target="_blank" rel="noreferrer">
        <span class="repo-icon"><GitBranch size={24} /></span>
        <span><strong>CNB 国内代码镜像</strong><small>查看国内代码与发布记录</small></span>
        <ArrowUpRight size={20} />
      </a>
      <a href={links.github} target="_blank" rel="noreferrer">
        <span class="repo-icon"><GithubLogo size={24} /></span>
        <span><strong>ETS2LA 官方 GitHub</strong><small>核验上游项目与贡献者</small></span>
        <ArrowUpRight size={20} />
      </a>
    </div>
  </div>
</section>

<style>
  .source-proof {
    background: var(--bg);
  }

  .proof-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 64px;
  }

  .proof-copy .section-title {
    font-size: 30px;
    line-height: 36px;
  }

  .assurance {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .repository-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .repository-list > a {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-dark);
    transition:
      transform 500ms var(--ease-out),
      border-color 300ms var(--ease-out);
  }

  .repository-list > a:hover {
    border-color: var(--accent);
    transform: translateX(4px);
  }

  .repository-list > a:active {
    transform: scale(0.98);
  }

  .repo-icon {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    color: var(--accent-text);
    background: var(--accent-dark);
  }

  .repository-list a > span:nth-child(2) {
    flex: 1;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--text-h);
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
  }

  small {
    color: var(--description);
    font-size: 14px;
    line-height: 20px;
  }

  @media (max-width: 800px) {
    .proof-layout {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  @media (max-width: 480px) {
    .repository-list > a {
      gap: 12px;
      padding: 16px;
    }

    .repo-icon {
      width: 40px;
      height: 40px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .repository-list > a {
      transform: none !important;
      transition-property: border-color, opacity;
      transition-duration: 200ms;
    }
  }
</style>
