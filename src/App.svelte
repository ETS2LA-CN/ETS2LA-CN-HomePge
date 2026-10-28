<script lang="ts">
  import { onMount } from "svelte";
  import Header from "./lib/components/Header.svelte";
  import Hero from "./lib/components/Hero.svelte";
  import Benefits from "./lib/components/Benefits.svelte";
  import TaglineReveal from "./lib/components/TaglineReveal.svelte";
  import Steps from "./lib/components/Steps.svelte";
  import SourceProof from "./lib/components/SourceProof.svelte";
  import ServiceStatus from "./lib/components/ServiceStatus.svelte";
  import Faq from "./lib/components/Faq.svelte";
  import DownloadCta from "./lib/components/DownloadCta.svelte";
  import Footer from "./lib/components/Footer.svelte";

  onMount(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  });
</script>

<a class="skip-link" href="#content">跳转到主要内容</a>
<Header />
<main id="content">
  <Hero />
  <Benefits />
  <TaglineReveal />
  <Steps />
  <SourceProof />
  <ServiceStatus />
  <Faq />
  <DownloadCta />
</main>
<Footer />
