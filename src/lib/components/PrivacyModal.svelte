<script lang="ts">
  import { marked } from "marked";
  import { X } from "phosphor-svelte";
  import privacyMarkdown from "../privacy.md?raw";

  type Props = {
    open: boolean;
    onclose: () => void;
  };

  let { open, onclose }: Props = $props();
  let dialog: HTMLDialogElement;

  const chineseMarkdown = privacyMarkdown
    .replace(/^---[\s\S]*?---/, "")
    .split(/^# English\s*$/m)[0]
    .replace(/^# 中文\s*/m, "")
    .replace(/^## 服务隐私政策\s*/m, "");
  const privacyHtml = marked
    .parse(chineseMarkdown, { async: false })
    .replaceAll("<a href=", '<a target="_blank" rel="noreferrer" href=');

  function closeOnBackdrop(event: MouseEvent) {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (outside) onclose();
  }

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  });
</script>

<dialog
  bind:this={dialog}
  aria-labelledby="privacy-title"
  onclose={onclose}
  onclick={closeOnBackdrop}
>
  <div class="modal-header">
    <div>
      <span>ETS2LA 中国镜像</span>
      <h2 id="privacy-title">服务隐私政策</h2>
    </div>
    <button type="button" aria-label="关闭服务隐私政策" onclick={onclose}>
      <X size={24} weight="bold" />
    </button>
  </div>
  <div class="modal-body">
    <article class="policy-content">{@html privacyHtml}</article>
  </div>
</dialog>

<style>
  dialog {
    width: calc(100% - 48px);
    max-width: 960px;
    max-height: calc(100svh - 48px);
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--accent);
    border-radius: 16px;
    color: var(--text);
    background: var(--bg-dark);
    box-shadow: 0 24px 96px rgba(0, 0, 0, 0.48);
  }

  dialog[open] {
    animation: modal-enter 500ms var(--ease-out);
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }

  .modal-header span {
    display: block;
    margin-bottom: 4px;
    color: var(--accent-text);
    font-size: 12px;
    line-height: 16px;
  }

  .modal-header h2 {
    margin: 0;
    color: var(--text-h);
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  .modal-header button {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-h);
    background: var(--surface);
    cursor: pointer;
    transition:
      transform 500ms var(--ease-out),
      background-color 300ms var(--ease-out),
      border-color 300ms var(--ease-out);
  }

  .modal-header button:hover {
    border-color: var(--accent-text);
    background: var(--accent-dark);
    transform: scale(1.04);
  }

  .modal-header button:active {
    transform: scale(0.98);
  }

  .modal-body {
    max-height: calc(100svh - 144px);
    padding: 32px;
    overflow-y: auto;
    scrollbar-color: var(--accent) var(--bg-dark);
  }

  .policy-content {
    max-width: 680px;
    margin: 0 auto;
    font-size: 16px;
    line-height: 24px;
  }

  .policy-content :global(p) {
    margin: 0 0 24px;
    text-wrap: pretty;
  }

  .policy-content :global(h3) {
    margin: 48px 0 16px;
    color: var(--text-h);
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    text-wrap: balance;
  }

  .policy-content :global(h4) {
    margin: 32px 0 12px;
    color: var(--text-h);
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    text-wrap: balance;
  }

  .policy-content :global(strong) {
    color: var(--accent-text);
    font-weight: 600;
  }

  .policy-content :global(em) {
    font-style: normal;
  }

  .policy-content :global(a) {
    color: var(--accent-text);
    text-decoration: underline;
    text-underline-offset: 4px;
    transition: color 300ms var(--ease-out);
  }

  .policy-content :global(a:hover) {
    color: var(--text-h);
  }

  .policy-content :global(ul) {
    margin: 0 0 24px;
    padding-left: 24px;
  }

  .policy-content :global(li) {
    margin-bottom: 8px;
  }

  .policy-content :global(code) {
    padding: 2px 4px;
    border-radius: 4px;
    color: var(--accent-text);
    background: var(--surface);
    font-family: inherit;
    font-size: 14px;
  }

  .policy-content :global(table) {
    display: block;
    width: max-content;
    max-width: 100%;
    margin: 0 0 24px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-spacing: 0;
    border-radius: 8px;
    font-size: 14px;
    line-height: 20px;
  }

  .policy-content :global(th),
  .policy-content :global(td) {
    min-width: 96px;
    padding: 12px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }

  .policy-content :global(th) {
    color: var(--text-h);
    background: var(--surface);
    font-weight: 600;
  }

  .policy-content :global(tr:last-child td) {
    border-bottom: 0;
  }

  .policy-content :global(th:last-child),
  .policy-content :global(td:last-child) {
    border-right: 0;
  }

  .policy-content :global(hr) {
    margin: 32px 0;
    border: 0;
    border-top: 1px solid var(--border);
  }

  @keyframes modal-enter {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    dialog {
      width: calc(100% - 32px);
      max-height: calc(100svh - 32px);
    }

    .modal-header {
      padding: 16px;
    }

    .modal-body {
      max-height: calc(100svh - 128px);
      padding: 24px 16px;
    }

    .policy-content :global(h3) {
      font-size: 20px;
      line-height: 28px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    dialog[open] {
      animation: none;
    }

    .modal-header button {
      transform: none !important;
      transition-property: background-color, border-color, opacity;
      transition-duration: 200ms;
    }
  }
</style>
