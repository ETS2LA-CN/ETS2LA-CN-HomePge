<script lang="ts">
  import { ArrowUpRight, ShieldCheck } from "phosphor-svelte";
  import { links } from "../content";
  import PrivacyModal from "./PrivacyModal.svelte";

  const year = new Date().getFullYear();
  let privacyOpen = $state(false);
</script>

<footer>
  <div class="container footer-main">
    <div class="footer-brand">
      <a href="#home" aria-label="返回首页"><img src="/logo.svg" alt="ETS2LA" width="40" height="40" /></a>
      <div>
        <strong>ETS2LA 中国镜像</strong>
        <p>面向中国用户的下载、中文文档与社区资源。</p>
      </div>
    </div>

    <nav class="footer-links" aria-label="页脚导航">
      <a href={links.releases} target="_blank" rel="noreferrer">国内镜像<ArrowUpRight size={14} /></a>
      <a href={links.docs} target="_blank" rel="noreferrer">中文文档<ArrowUpRight size={14} /></a>
      <a href={links.community} target="_blank" rel="noreferrer">KOOK 社区<ArrowUpRight size={14} /></a>
      <button type="button" aria-haspopup="dialog" onclick={() => (privacyOpen = true)}>服务隐私政策</button>
    </nav>
  </div>

  <div class="container footer-bottom">
    <p>本站由国内用户独立运营，并在 ETS2LA 开发者监督下提供服务。</p>
    <div class="legal">
      <a href={links.icp} target="_blank" rel="noreferrer">苏ICP备2025160641号-3</a>
      <a href={links.police} target="_blank" rel="noreferrer"><ShieldCheck size={14} />苏公网安备32120202010796号</a>
      <span>© 2024~{year} ETS2LA CN</span>
    </div>
  </div>
</footer>

<PrivacyModal open={privacyOpen} onclose={() => (privacyOpen = false)} />

<style>
  footer {
    padding-block: 48px 24px;
    border-top: 1px solid var(--border);
    background: var(--bg-deep);
  }

  .footer-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding-bottom: 48px;
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .footer-brand img {
    width: 40px;
    height: 40px;
  }

  strong {
    color: var(--text-h);
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
  }

  p {
    margin: 4px 0 0;
    color: var(--description);
    font-size: 14px;
    line-height: 20px;
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 24px;
  }

  .footer-links a,
  .footer-links button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    color: var(--text-l);
    background: transparent;
    font-family: inherit;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    transition: color 300ms var(--ease-out);
  }

  .footer-links a:hover,
  .footer-links button:hover,
  .legal a:hover {
    color: var(--accent-text);
  }

  .footer-bottom {
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }

  .footer-bottom > p {
    margin: 0 0 16px;
  }

  .legal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    color: var(--description);
    font-size: 12px;
    line-height: 16px;
  }

  .legal a {
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 300ms var(--ease-out);
  }

  .legal span {
    margin-left: auto;
  }

  @media (max-width: 800px) {
    .footer-main {
      align-items: flex-start;
      flex-direction: column;
    }

    .footer-links {
      justify-content: flex-start;
      gap: 16px;
    }

    .legal span {
      width: 100%;
      margin-left: 0;
    }
  }
</style>
