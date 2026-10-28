<script lang="ts">
  import { CheckCircle, DownloadSimple, MapTrifold } from "phosphor-svelte";
  import { links } from "../content";
</script>

<section id="home" class="hero" aria-labelledby="hero-title">
  <div class="container hero-layout">
    <div class="hero-copy">
      <p class="eyebrow"><span></span> ETS2LA 中国镜像</p>
      <h1 id="hero-title">
        <span>让每一段卡车之旅，</span>
        <span>更有把握</span>
      </h1>
      <p class="hero-description">
        ETS2LA 为 SCS 卡车模拟游戏提供车道辅助、地图等功能。通过国内镜像获取安装包，配合中文文档与国内社区，更快开始使用。
      </p>
      <a class="button" href={links.windows}>
        <DownloadSimple size={20} weight="bold" />
        免费下载 Windows 版
      </a>
      <p class="proof">
        <CheckCircle size={20} weight="fill" />
        免费开源 · 国内镜像 · 无需注册
      </p>
    </div>

    <div class="hero-visual" role="img" aria-label="ETS2LA 多层立交地图与路线导航示意图">
      <div class="visual-frame">
        <div class="visual-header">
          <span>功能概览</span>
          <span class="status"><i></i> 地图导航</span>
        </div>
        <svg class="road" viewBox="0 0 560 360" aria-hidden="true">
          <defs>
            <pattern id="map-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#313131" />
            </pattern>
          </defs>
          <rect width="560" height="360" fill="#181818" />
          <rect width="560" height="360" fill="url(#map-dots)" />

          <g fill="none" stroke="#6f8f72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M126 96 C150 48 244 36 277 70 C311 105 270 139 225 130 C184 122 168 97 142 91" />
            <path d="M272 73 C350 111 420 106 486 62" />
            <path d="M238 202 C177 242 205 302 266 300 C327 298 354 257 323 224 C306 205 276 196 251 207" />
            <path d="M87 277 C151 219 211 221 260 248" />
            <path d="M445 333 C492 318 532 322 580 310" />
          </g>

          <g fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M104 82 C188 146 282 222 362 286 C410 324 452 354 500 396" stroke="#313131" stroke-width="26" />
            <path d="M104 82 C188 146 282 222 362 286 C410 324 452 354 500 396" stroke="#6f8f72" stroke-width="1.5" transform="translate(-7 7)" />
            <path d="M104 82 C188 146 282 222 362 286 C410 324 452 354 500 396" stroke="#6f8f72" stroke-width="1.5" transform="translate(7 -7)" />
            <path d="M104 82 C188 146 282 222 362 286 C410 324 452 354 500 396" stroke="#b9877c" stroke-width="2" />

            <path d="M-30 330 C110 265 195 190 295 137 C395 84 480 58 590 22" stroke="#313131" stroke-width="42" />
            <path d="M-30 330 C110 265 195 190 295 137 C395 84 480 58 590 22" stroke="#6f8f72" stroke-width="1.5" transform="translate(0 -14)" />
            <path d="M-30 330 C110 265 195 190 295 137 C395 84 480 58 590 22" stroke="#6f8f72" stroke-width="1.5" transform="translate(0 -7)" />
            <path d="M-30 330 C110 265 195 190 295 137 C395 84 480 58 590 22" stroke="#6f8f72" stroke-width="1.5" transform="translate(0 7)" />
            <path d="M-30 330 C110 265 195 190 295 137 C395 84 480 58 590 22" stroke="#6f8f72" stroke-width="1.5" transform="translate(0 14)" />
            <path d="M-30 330 C110 265 195 190 295 137 C395 84 480 58 590 22" stroke="#b9877c" stroke-width="2.5" />
          </g>

          <g fill="#1f1f1f" stroke="#9b9b9b" stroke-width="1.5">
            <circle cx="142" cy="91" r="5" />
            <circle cx="225" cy="130" r="5" />
            <circle cx="323" cy="224" r="5" />
            <circle cx="266" cy="300" r="5" />
            <circle cx="295" cy="137" r="5" />
          </g>

          <g transform="translate(273 151) rotate(54)">
            <rect x="-7" y="-12" width="14" height="24" rx="3" fill="#35d07f" />
            <path d="M-3 -5h6v7h-6zM-4 6h8" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
          </g>

          <g fill="#bababa" font-size="10" font-family="inherit">
            <text x="130" y="82">0</text><text x="151" y="102">1</text><text x="215" y="119">2</text>
            <text x="284" y="125">0</text><text x="307" y="150">1</text><text x="338" y="220">2</text>
            <text x="253" y="288">0</text><text x="276" y="309">1</text><text x="91" y="264">2</text>
            <text x="393" y="86">0</text><text x="419" y="77">1</text><text x="448" y="66">2</text>
          </g>

          <g fill="#dadada" font-family="inherit">
            <text x="16" y="24" font-size="12">速度 86.6 km/h</text>
            <text x="16" y="44" font-size="10">位置 -8252.6, 42.4, -10650.6</text>
          </g>
        </svg>
        <div class="visual-footer">
          <div>
            <MapTrifold size={24} />
            <span>路线引导<small>立交道路与路线清晰呈现</small></span>
          </div>
          <div>
            <CheckCircle size={24} />
            <span>国内镜像<small>下载入口集中整理</small></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    display: flex;
    align-items: center;
    min-height: 100svh;
    padding-block: 96px 80px;
    overflow: hidden;
    background: var(--bg-dark);
  }

  .hero-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 48px;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 680px;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 24px;
    color: var(--accent-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .eyebrow span {
    width: 24px;
    height: 2px;
    background: var(--accent);
  }

  h1 {
    max-width: 680px;
    margin: 0;
    color: var(--text-h);
    font-size: 60px;
    font-weight: 600;
    line-height: 1;
    background: linear-gradient(90deg, #ffffff, #9b9b9b);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h1 span {
    display: block;
    padding-bottom: 8px;
  }

  .hero-description {
    max-width: 680px;
    margin: 24px 0 32px;
    color: var(--text-l);
    font-size: 18px;
    line-height: 28px;
  }

  .proof {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 16px 0 0;
    color: var(--description);
    font-size: 14px;
    line-height: 20px;
  }

  .proof :global(svg) {
    color: var(--accent-text);
  }

  .hero-visual {
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--bg);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.24);
  }

  .visual-frame {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-dark);
  }

  .visual-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    color: var(--text-l);
    font-size: 14px;
    line-height: 20px;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--accent-text);
  }

  .status i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-text);
  }

  .road {
    width: 100%;
    height: auto;
    border-block: 1px solid var(--border);
  }

  .visual-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 8px;
  }

  .visual-footer > div {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--accent-text);
    background: var(--bg);
  }

  .visual-footer span {
    color: var(--text-h);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .visual-footer small {
    display: block;
    color: var(--description);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }

  @media (max-width: 960px) {
    .hero-layout {
      grid-template-columns: 1fr;
    }

    .hero-copy {
      max-width: 680px;
    }

    .hero-visual {
      width: 100%;
      max-width: 680px;
    }
  }

  @media (max-width: 640px) {
    .hero {
      padding-block: 96px 64px;
    }

    .hero-layout {
      gap: 40px;
    }

    h1 {
      font-size: 36px;
      line-height: 40px;
    }

    .hero-description {
      font-size: 16px;
      line-height: 24px;
    }

    .visual-footer {
      grid-template-columns: 1fr;
    }

  }

  @media (max-width: 360px) {
    h1 {
      font-size: 30px;
      line-height: 36px;
    }
  }
</style>
