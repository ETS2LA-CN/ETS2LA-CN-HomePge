export function reveal(node: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    node.classList.add("is-visible");
    return;
  }

  node.classList.add("reveal-pending");
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      node.classList.add("is-visible");
      observer.disconnect();
    },
    { threshold: 0.12 },
  );

  observer.observe(node);
  return {
    destroy() {
      observer.disconnect();
    },
  };
}
