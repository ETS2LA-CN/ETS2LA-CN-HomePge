<script lang="ts">
  import { ArrowUpRight, Plus } from "phosphor-svelte";
  import { faqs } from "../content";
  import { reveal } from "../reveal";
</script>

<section id="faq" class="section faq" use:reveal aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="section-heading">
      <p class="section-kicker">下载之前</p>
      <h2 id="faq-title" class="section-title">常见问题，先在这里找到答案</h2>
      <p class="section-description">关于软件、系统要求、镜像来源与兼容性的基本说明。</p>
    </div>

    <div class="faq-list">
      {#each faqs as faq}
        <details>
          <summary><span>{faq.question}</span><Plus size={20} weight="bold" /></summary>
          <div class="answer">
            <p>{faq.answer}</p>
            {#if "link" in faq}
              <a class="text-link" href={faq.link} target="_blank" rel="noreferrer">
                {faq.linkLabel}<ArrowUpRight size={16} weight="bold" />
              </a>
            {/if}
          </div>
        </details>
      {/each}
    </div>
  </div>
</section>

<style>
  .faq {
    background: var(--bg-dark);
  }

  .faq-layout {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    align-items: start;
    gap: 64px;
  }

  .section-heading {
    position: sticky;
    top: 96px;
    margin: 0;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  details {
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg);
    transition: border-color 300ms var(--ease-out);
  }

  details[open],
  details:hover {
    border-color: var(--accent);
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 24px;
    color: var(--text-h);
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary :global(svg) {
    flex: 0 0 auto;
    color: var(--accent-text);
    transition: transform 500ms var(--ease-out);
  }

  details[open] summary :global(svg) {
    transform: rotate(45deg);
  }

  .answer {
    padding: 0 24px 24px;
  }

  .answer p {
    margin: 0 0 16px;
    color: var(--text-l);
    font-size: 16px;
    line-height: 24px;
  }

  .answer p:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 800px) {
    .faq-layout {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .section-heading {
      position: static;
    }
  }

  @media (max-width: 480px) {
    summary {
      padding: 16px;
      font-size: 16px;
      line-height: 24px;
    }

    .answer {
      padding: 0 16px 16px;
    }
  }
</style>
