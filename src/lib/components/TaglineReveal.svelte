<script lang="ts">
  import { onMount } from "svelte";

  const lines = [
    ["让", "可靠", "的", "辅助驾驶", "资源", "，"],
    ["离", "中国", "玩家", "更近", "一步", "。"],
  ];
  const offsets = [0, lines[0].length];
  const total = lines.flat().length;

  let section: HTMLElement;
  let activeCount = $state(0);

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      activeCount = total;
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const start = window.innerHeight * 0.78;
      const distance = window.innerHeight * 0.45 + rect.height * 0.4;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / distance));
      activeCount = Math.min(total, Math.floor(progress * (total + 1)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  });
</script>

<section bind:this={section} class="tagline" aria-label="让可靠的辅助驾驶资源，离中国玩家更近一步。">
  <div class="container">
    <p class="tagline-label">更近的资源，更从容的旅程</p>
    <div class="tagline-text" aria-hidden="true">
      {#each lines as line, lineIndex}
        <div>
          {#each line as word, wordIndex}
            <span class:active={activeCount > offsets[lineIndex] + wordIndex}>{word}</span>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .tagline {
    display: flex;
    align-items: center;
    min-height: 80svh;
    padding-block: 96px;
    background: var(--bg-deep);
  }

  .tagline-label {
    margin: 0 0 32px;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .tagline-text {
    max-width: 680px;
    color: var(--text-h);
    font-size: 48px;
    font-weight: 600;
    line-height: 1;
  }

  .tagline-text > div {
    padding-bottom: 16px;
  }

  .tagline-text span {
    opacity: 0.3;
    transition:
      color 500ms var(--ease-out),
      opacity 500ms var(--ease-out);
  }

  .tagline-text span.active {
    color: var(--text-h);
    opacity: 1;
  }

  @media (max-width: 640px) {
    .tagline {
      min-height: 64svh;
      padding-block: 80px;
    }

    .tagline-text {
      font-size: 36px;
      line-height: 40px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tagline-text span {
      transition: opacity 200ms var(--ease-out);
    }
  }
</style>
