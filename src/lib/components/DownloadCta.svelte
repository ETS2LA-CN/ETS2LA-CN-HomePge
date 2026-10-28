<script lang="ts">
  import { ArrowUpRight, CheckCircle, DownloadSimple } from "phosphor-svelte";
  import { links } from "../content";
  import { reveal } from "../reveal";
</script>

<section id="download" class="section download-section" use:reveal aria-labelledby="download-title">
  <div class="container">
    <div class="download-card">
      <div>
        <p class="section-kicker">免费开源，无需注册</p>
        <h2 id="download-title">准备好开始下一段旅程了吗？</h2>
        <p>从国内镜像获取最新安装包。下载前请查看发布说明，确认你的游戏版本受到支持。</p>
      </div>
      <div class="actions">
        <a class="button" href={links.windows}>
          <DownloadSimple size={20} weight="bold" />
          免费下载 Windows 版
        </a>
        <a class="button button-secondary" href={links.linux}>
          下载 Linux 版
          <ArrowUpRight size={20} weight="bold" />
        </a>
        <span><CheckCircle size={16} /> Linux 版需要 GLIBC 2.43</span>
      </div>
    </div>
  </div>
</section>

<style>
  .download-section {
    background: var(--bg-dark);
  }

  .download-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 48px;
    padding: 48px;
    border: 1px solid var(--accent);
    border-radius: 16px;
    background: var(--accent-deep);
  }

  h2 {
    max-width: 680px;
    margin: 0;
    color: var(--text-h);
    font-size: 36px;
    font-weight: 600;
    line-height: 40px;
  }

  p:not(.section-kicker) {
    max-width: 680px;
    margin: 16px 0 0;
    color: var(--text-l);
    font-size: 18px;
    line-height: 28px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .actions .button {
    width: 100%;
  }

  .actions > span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--description);
    font-size: 12px;
    line-height: 16px;
  }

  @media (max-width: 800px) {
    .download-card {
      grid-template-columns: 1fr;
      gap: 32px;
      padding: 32px;
    }

    .actions {
      align-items: flex-start;
    }

    .actions .button {
      width: fit-content;
    }
  }

  @media (max-width: 480px) {
    .download-card {
      padding: 24px;
    }

    h2 {
      font-size: 30px;
      line-height: 36px;
    }

    p:not(.section-kicker) {
      font-size: 16px;
      line-height: 24px;
    }
  }
</style>
