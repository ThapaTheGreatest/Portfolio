<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Prayash Thapa — applied mathematics, systems, writing, and technical projects." />
    <title>Prayash Thapa</title>
    <link rel="preload" as="image" href="assets/img/landing-poster.jpg" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="site-shell">
      <section class="hero" aria-label="Prayash Thapa landing page">
        <video
          class="hero__video"
          src="assets/video/landing.mp4"
          poster="assets/img/landing-poster.jpg"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        ></video>

        <div class="hero__shade" aria-hidden="true"></div>
        <div class="hero__grain" aria-hidden="true"></div>
        <div class="hero__scan" aria-hidden="true"></div>

        <header class="nav" aria-label="Primary navigation">
          <a class="nav__mark" href="#top" aria-label="Prayash Thapa home">PT</a>
          <nav class="nav__links">
            <a href="#work">work</a>
            <a href="#writing">writing</a>
            <a href="#system">system</a>
            <a href="mailto:youremail@example.com">contact</a>
          </nav>
        </header>

        <div class="hero__content" id="top">
          <p class="hero__eyebrow">applied mathematics / systems / media</p>
          <h1>Prayash<br />Thapa</h1>
          <p class="hero__statement">
            Building toward quantitative research through math, code, writing, and strange technical projects.
          </p>
          <div class="hero__actions" aria-label="Page sections">
            <a class="button button--primary" href="#work">enter site</a>
            <a class="button" href="#writing">read writing</a>
          </div>
        </div>

        <div class="hero__status" aria-label="Current status">
          <span>incoming applied math @ RIT</span>
          <span>arch linux</span>
          <span>quant-bound</span>
        </div>

        <button class="mute" type="button" aria-label="Toggle video playback" data-video-toggle>
          pause video
        </button>
      </section>

      <section class="panel intro" id="work">
        <div class="section-label">01 / work</div>
        <div class="intro__copy">
          <h2>Proof, not decoration.</h2>
          <p>
            This site is being rebuilt as an archive: math notes, projects, systems, essays, and experiments. No generic portfolio noise.
          </p>
        </div>
        <div class="card-grid">
          <a class="card" href="#">
            <span class="card__kicker">math</span>
            <h3>Applied math notebook</h3>
            <p>Linear algebra, probability, optimization, and the ugly work behind getting sharper.</p>
          </a>
          <a class="card" href="#">
            <span class="card__kicker">code</span>
            <h3>Systems + tools</h3>
            <p>Linux setup, Python utilities, hardware notes, and technical builds worth documenting.</p>
          </a>
          <a class="card" href="#">
            <span class="card__kicker">media</span>
            <h3>Visual experiments</h3>
            <p>Video essays, visual studies, strange design boards, and work that should not look like LinkedIn.</p>
          </a>
        </div>
      </section>

      <section class="panel split" id="writing">
        <div class="section-label">02 / writing</div>
        <div>
          <h2>Writing queue.</h2>
          <ol class="writing-list">
            <li><a href="#">Rebuilding prayashthapa.org from zero</a></li>
            <li><a href="#">Why applied mathematics</a></li>
            <li><a href="#">Learning calculus the ugly way</a></li>
            <li><a href="#">Taste, internet rot, and making things anyway</a></li>
          </ol>
        </div>
      </section>

      <section class="panel system" id="system">
        <div class="section-label">03 / system</div>
        <div class="system__grid">
          <div>
            <h2>/system</h2>
            <p>
              Current operating context. Replace this text whenever your goals change. A personal site should feel alive, not embalmed.
            </p>
          </div>
          <dl class="system__list">
            <div>
              <dt>studying</dt>
              <dd>linear algebra, probability, C++</dd>
            </div>
            <div>
              <dt>building</dt>
              <dd>prayashthapa.org v2</dd>
            </div>
            <div>
              <dt>using</dt>
              <dd>arch linux, python, davinci resolve</dd>
            </div>
            <div>
              <dt>direction</dt>
              <dd>quant research / applied math</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>

    <script src="script.js"></script>
  </body>
</html>
