<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight } from "phosphor-svelte";
  import { links } from "../content";

  const navItems = [
    { id: "home", label: "首页" },
    { id: "features", label: "核心优势" },
    { id: "steps", label: "使用步骤" },
    { id: "status", label: "服务状态" },
    { id: "faq", label: "常见问题" },
  ];

  let menuOpen = $state(false);
  let active = $state("home");

  onMount(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) active = visible.target.id;
      },
      { rootMargin: "-16% 0px -64%", threshold: [0, 0.1, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") menuOpen = false;
    };
    window.addEventListener("keydown", onKeydown);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKeydown);
    };
  });

  $effect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  });
</script>

<header class:menu-open={menuOpen}>
  <div class="nav-shell">
    <a class="brand" href="#home" aria-label="ETS2LA 中国镜像首页" onclick={() => (menuOpen = false)}>
      <img src="/logo.svg" alt="" width="32" height="32" />
      <span>ETS2LA <small>中国镜像</small></span>
    </a>

    <nav class="desktop-nav" aria-label="主导航">
      {#each navItems as item}
        <a
          href={`#${item.id}`}
          class:active={active === item.id}
          aria-current={active === item.id ? "location" : undefined}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <a class="docs-link" href={links.docs} target="_blank" rel="noreferrer">
      中文文档
      <ArrowUpRight size={16} weight="bold" />
    </a>

    <button
      class="menu-toggle"
      type="button"
      aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
      aria-expanded={menuOpen}
      aria-controls="mobile-navigation"
      onclick={() => (menuOpen = !menuOpen)}
    >
      <span></span>
      <span></span>
    </button>
  </div>

  <nav
    id="mobile-navigation"
    class="mobile-panel"
    class:open={menuOpen}
    aria-label="移动端导航"
    aria-hidden={!menuOpen}
  >
    <div class="mobile-links">
      {#each navItems as item, index}
        <a
          class="mobile-link"
          class:active={active === item.id}
          href={`#${item.id}`}
          tabindex={menuOpen ? 0 : -1}
          style={`--delay: ${Math.min(index * 60, 400)}ms`}
          onclick={() => (menuOpen = false)}
        >
          <span>0{index + 1}</span>
          {item.label}
        </a>
      {/each}
      <a
        class="mobile-link"
        href={links.docs}
        target="_blank"
        rel="noreferrer"
        tabindex={menuOpen ? 0 : -1}
        style="--delay: 300ms"
        onclick={() => (menuOpen = false)}
      >
        <span>06</span>
        中文文档
        <ArrowUpRight size={24} />
      </a>
    </div>
    <p>免费开源 · 国内镜像 · 无需注册</p>
  </nav>
</header>

<style>
  header {
    position: fixed;
    top: 16px;
    left: 50%;
    z-index: 100;
    width: max-content;
    max-width: calc(100% - 32px);
    transform: translateX(-50%);
  }

  .nav-shell {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 64px;
    padding: 8px;
    border: 1px solid #474747;
    border-radius: 16px;
    background: rgba(39, 39, 39, 0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    color: var(--text-h);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    white-space: nowrap;
    transition: background-color 300ms var(--ease-out);
  }

  .brand:hover {
    background: #313131;
  }

  .brand img {
    width: 32px;
    height: 32px;
  }

  .brand small {
    color: var(--text-l);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }

  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .desktop-nav a,
  .docs-link {
    padding: 8px 12px;
    border-radius: 8px;
    color: var(--text-l);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
    transition:
      color 300ms var(--ease-out),
      background-color 300ms var(--ease-out);
  }

  .desktop-nav a:hover,
  .desktop-nav a.active,
  .docs-link:hover {
    color: var(--text-h);
    background: #313131;
  }

  .desktop-nav a.active {
    box-shadow: inset 0 0 0 1px var(--accent-dark);
  }

  .docs-link {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--accent-text);
  }

  .menu-toggle {
    position: relative;
    display: none;
    width: 40px;
    height: 40px;
    padding: 8px;
    border: 0;
    border-radius: 8px;
    color: var(--text-h);
    background: transparent;
    cursor: pointer;
  }

  .menu-toggle span {
    position: absolute;
    top: 18px;
    left: 10px;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
    transform: translateY(-4px);
    transition: transform 500ms var(--ease-out);
  }

  .menu-toggle span:last-child {
    transform: translateY(4px);
  }

  .menu-open .menu-toggle span:first-child {
    transform: rotate(45deg);
  }

  .menu-open .menu-toggle span:last-child {
    transform: rotate(-45deg);
  }

  .mobile-panel {
    position: fixed;
    inset: -16px -16px auto;
    display: none;
    width: 100vw;
    height: 100svh;
    padding: 96px 24px 32px;
    background: rgba(24, 24, 24, 0.98);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-24px);
    transition:
      transform 500ms var(--ease-out),
      opacity 500ms var(--ease-out),
      visibility 0s 500ms;
  }

  .mobile-panel.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    transition-delay: 0s;
  }

  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-block: 8px;
    color: var(--text-h);
    font-size: 30px;
    line-height: 36px;
    opacity: 0;
    transform: translateY(24px);
    transition:
      transform 500ms var(--ease-out),
      opacity 500ms var(--ease-out),
      color 300ms var(--ease-out);
  }

  .mobile-link span {
    color: var(--accent-text);
    font-size: 14px;
    line-height: 20px;
  }

  .mobile-link.active {
    color: var(--accent-text);
  }

  .mobile-panel.open .mobile-link {
    opacity: 1;
    transform: translateY(0);
    transition-delay: var(--delay);
  }

  .mobile-panel > p {
    position: absolute;
    bottom: 32px;
    margin: 0;
    color: var(--description);
    font-size: 14px;
    line-height: 20px;
  }

  @media (max-width: 960px) {
    .desktop-nav,
    .docs-link {
      display: none;
    }

    .menu-toggle,
    .mobile-panel {
      display: block;
    }

    .nav-shell {
      width: calc(100vw - 32px);
      justify-content: space-between;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mobile-panel,
    .mobile-link {
      transform: none;
      transition-property: opacity;
      transition-duration: 200ms;
    }

    .mobile-panel.open .mobile-link {
      transition-delay: 0ms;
    }
  }
</style>
