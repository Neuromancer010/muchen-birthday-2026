/* ==========================================================================
   祝老妈生日快乐 · 川西十二日画卷 — 电影剪辑式交互与轮放引擎
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.SITE_DATA;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let currentSlideMs = DATA.tracks[0].slideMs || 3600;
  const activeReels = [];      // { el, start, stop, next, isVisible }
  const activeHandscrolls = []; // { viewport, paused }
  const activeDecks = [];       // { el, start, stop }
  const allPhotosFlat = [];

  // ------------------------------------------------------------------------
  // 1. 英雄片头轮播 + 牛奶海尾声背景
  // ------------------------------------------------------------------------
  function initHeroSlides() {
    const container = $("#heroBackdrop");
    DATA.heroSlides.forEach((src, i) => {
      const div = document.createElement("div");
      div.className = "hero-slide" + (i === 0 ? " active" : "");
      div.style.backgroundImage = `url("${src}")`;
      container.appendChild(div);
    });
    let idx = 0;
    const slides = $$(".hero-slide", container);
    setInterval(() => {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 5800);

    const finaleBg = $("#finaleBg");
    if (finaleBg && DATA.coverPhoto) {
      finaleBg.style.backgroundImage = `url("${DATA.coverPhoto}")`;
    }
  }

  // ------------------------------------------------------------------------
  // 2. 全屏轻量 Canvas 粒子引擎（微粒秋光 / 生日金箔 / 祈愿孔明灯）
  // ------------------------------------------------------------------------
  const AmbientFX = (() => {
    const canvas = $("#ambientCanvas");
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    let speedScale = 1.0;

    const motes = [];
    const bursts = [];
    const lanterns = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initMotes() {
      const count = W < 640 ? 12 : 20;
      motes.length = 0;
      for (let i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 1.8 + Math.random() * 3.4,
          vy: 0.18 + Math.random() * 0.38,
          vx: -0.18 + Math.random() * 0.36,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.008 + Math.random() * 0.012,
          alpha: 0.18 + Math.random() * 0.36
        });
      }
    }

    function spawnBurst(cx, cy, count = 42) {
      const colors = ["#F5C562", "#E88B44", "#D95D39", "#FFF1C1", "#54C0D4"];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const spd = 2.2 + Math.random() * 5.2;
        bursts.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 2.0,
          size: 3 + Math.random() * 4,
          color: colors[i % colors.length],
          life: 1.0,
          decay: 0.014 + Math.random() * 0.012,
          rot: Math.random() * Math.PI * 2
        });
      }
    }

    function spawnLantern() {
      lanterns.push({
        x: W * (0.2 + Math.random() * 0.6),
        y: H + 30,
        vx: (Math.random() - 0.5) * 0.32,
        vy: -(0.72 + Math.random() * 0.5),
        sway: Math.random() * Math.PI * 2,
        scale: 0.78 + Math.random() * 0.42,
        alpha: 0.95
      });
    }

    function setTempo(bpm) {
      speedScale = Math.max(0.72, Math.min(1.2, bpm / 88));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (const p of motes) {
        p.sway += p.swaySpeed * speedScale;
        p.x += (p.vx + Math.sin(p.sway) * 0.32) * speedScale;
        p.y += p.vy * speedScale;
        if (p.y > H + 14) { p.y = -12; p.x = Math.random() * W; }
        if (p.x < -14) p.x = W + 12;
        if (p.x > W + 14) p.x = -12;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
        grad.addColorStop(0, "rgba(255, 224, 152, 0.95)");
        grad.addColorStop(1, "rgba(255, 200, 100, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx; b.y += b.vy; b.vy += 0.11; b.vx *= 0.985; b.rot += 0.12; b.life -= b.decay;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = b.life;
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.size / 2, -b.size * 0.3, b.size, b.size * 0.6);
        ctx.restore();
      }

      for (let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i];
        l.sway += 0.022;
        l.x += l.vx + Math.sin(l.sway) * 0.34;
        l.y += l.vy;
        if (l.y < H * 0.18) l.alpha -= 0.008;
        if (l.alpha <= 0 || l.y < -60) { lanterns.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.scale(l.scale, l.scale);
        ctx.globalAlpha = l.alpha;
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 34);
        glow.addColorStop(0, "rgba(255, 206, 108, 0.55)");
        glow.addColorStop(1, "rgba(255, 160, 60, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
        const bodyGrad = ctx.createLinearGradient(0, -18, 0, 14);
        bodyGrad.addColorStop(0, "#E36835");
        bodyGrad.addColorStop(0.55, "#F6B958");
        bodyGrad.addColorStop(1, "#FFF2C2");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(-12, -14);
        ctx.quadraticCurveTo(0, -21, 12, -14);
        ctx.lineTo(9, 12); ctx.lineTo(-9, 12); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#FFFBEA";
        ctx.beginPath(); ctx.arc(0, 9, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // 横轴长卷微速自然漂移（像徐徐展开的画卷）
      for (const hs of activeHandscrolls) {
        if (!hs.paused && hs.visible) {
          const vp = hs.viewport;
          const maxScroll = vp.scrollWidth - vp.clientWidth;
          if (maxScroll > 20) {
            vp.scrollLeft += hs.dir * 0.42 * speedScale;
            if (vp.scrollLeft >= maxScroll - 2) hs.dir = -1;
            else if (vp.scrollLeft <= 2) hs.dir = 1;
          }
        }
      }

      requestAnimationFrame(tick);
    }

    resize();
    initMotes();
    window.addEventListener("resize", () => { resize(); initMotes(); });
    requestAnimationFrame(tick);

    return { spawnBurst, spawnLantern, setTempo };
  })();

  // ------------------------------------------------------------------------
  // 3. 四曲双音轨 1.35s 平滑交叉淡入淡出音乐引擎
  // ------------------------------------------------------------------------
  const MusicEngine = (() => {
    const deckA = $("#bgmDeckA");
    const deckB = $("#bgmDeckB");
    const dock = $("#musicDock");
    const titleEl = $("#musicTitle");
    const artistEl = $("#musicArtist");
    const toggleBtn = $("#musicToggle");
    const nextBtn = $("#musicNext");
    const listBtn = $("#musicListBtn");
    const popover = $("#musicPopover");
    const trackListEl = $("#mpTrackList");
    const autoBtn = $("#btnAutoTrack");
    const toastEl = $("#musicToast");

    let activeDeck = deckA;
    let standbyDeck = deckB;
    let currentIdx = 0;
    let isPlaying = false;
    let unlocked = false;
    let autoSwitch = true;
    let toastTimer = null;
    const TARGET_VOL = 0.72;

    function applyTrackRhythm(track) {
      currentSlideMs = track.slideMs || 3600;
      document.documentElement.style.setProperty("--beat-sec", `${track.beatSec}s`);
      document.documentElement.style.setProperty("--slide-ms", `${currentSlideMs}ms`);
      document.body.dataset.mood = track.motionMood || "crisp";
      AmbientFX.setTempo(track.bpm || 80);
    }

    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2500);
    }

    function renderPlaylist() {
      trackListEl.innerHTML = "";
      DATA.tracks.forEach((tr, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mp-item" + (i === currentIdx ? " active" : "");
        btn.innerHTML = `
          <span class="mp-item-top">
            <span class="mp-item-name">${i === currentIdx && isPlaying ? "♫ " : ""}${tr.shortTitle}</span>
            <span class="mp-item-artist">${tr.artist}</span>
          </span>
          <span class="mp-item-range">${tr.chapterRange}</span>
        `;
        btn.addEventListener("click", () => {
          autoSwitch = false;
          autoBtn.classList.remove("active");
          selectTrack(i, true, `已切换：${tr.shortTitle} — ${tr.artist}`);
        });
        trackListEl.appendChild(btn);
      });
    }

    function updateUI() {
      const tr = DATA.tracks[currentIdx];
      titleEl.textContent = tr.shortTitle;
      artistEl.textContent = tr.artist;
      dock.classList.toggle("playing", isPlaying);
      applyTrackRhythm(tr);
      renderPlaylist();
    }

    function fadeVolume(audioEl, fromVol, toVol, durationMs, onDone) {
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        try { audioEl.volume = Math.max(0, Math.min(1, fromVol + (toVol - fromVol) * eased)); } catch (_) {}
        if (t < 1) requestAnimationFrame(step);
        else if (onDone) onDone();
      }
      requestAnimationFrame(step);
    }

    function startCurrent(silentToast = false) {
      const tr = DATA.tracks[currentIdx];
      if (!activeDeck.src || !activeDeck.src.endsWith(tr.src)) {
        activeDeck.src = tr.src;
      }
      activeDeck.volume = 0.02;
      const p = activeDeck.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          unlocked = true;
          isPlaying = true;
          updateUI();
          fadeVolume(activeDeck, 0.02, TARGET_VOL, 1200);
          if (!silentToast) showToast(`♫ ${tr.shortTitle} — ${tr.artist}`);
        }).catch(() => { isPlaying = false; updateUI(); });
      }
    }

    function pauseAll() {
      isPlaying = false;
      updateUI();
      fadeVolume(activeDeck, activeDeck.volume, 0, 420, () => activeDeck.pause());
      standbyDeck.pause();
    }

    function selectTrack(newIdx, forcePlay = false, toastMsg = null) {
      if (newIdx === currentIdx) {
        if (forcePlay && !isPlaying) startCurrent();
        return;
      }
      const tr = DATA.tracks[newIdx];
      currentIdx = newIdx;
      if (!isPlaying && !forcePlay) { updateUI(); return; }

      const oldDeck = activeDeck;
      const nextDeck = standbyDeck;
      activeDeck = nextDeck;
      standbyDeck = oldDeck;

      nextDeck.src = tr.src;
      nextDeck.currentTime = 0;
      nextDeck.volume = 0.01;
      const p = nextDeck.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          unlocked = true;
          isPlaying = true;
          updateUI();
          fadeVolume(nextDeck, 0.01, TARGET_VOL, 1350);
          fadeVolume(oldDeck, oldDeck.volume || TARGET_VOL, 0, 1150, () => oldDeck.pause());
          showToast(toastMsg || `♫ ${tr.shortTitle} — ${tr.artist}`);
        }).catch(() => { isPlaying = false; updateUI(); });
      }
    }

    toggleBtn.addEventListener("click", () => { if (isPlaying) pauseAll(); else startCurrent(); });
    nextBtn.addEventListener("click", () => {
      autoSwitch = false;
      autoBtn.classList.remove("active");
      const next = (currentIdx + 1) % DATA.tracks.length;
      const tr = DATA.tracks[next];
      selectTrack(next, true, `♫ ${tr.shortTitle} — ${tr.artist}`);
    });
    listBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = popover.classList.toggle("open");
      popover.setAttribute("aria-hidden", String(!open));
    });
    document.addEventListener("click", (e) => {
      if (!dock.contains(e.target) && popover.classList.contains("open")) {
        popover.classList.remove("open");
        popover.setAttribute("aria-hidden", "true");
      }
    });
    autoBtn.addEventListener("click", () => {
      autoSwitch = !autoSwitch;
      autoBtn.classList.toggle("active", autoSwitch);
      showToast(autoSwitch ? "已开启随章节自动切歌" : "已锁定当前单曲");
    });

    document.addEventListener("WeixinJSBridgeReady", () => {
      if (unlocked && !isPlaying) startCurrent(true);
    }, false);

    updateUI();

    return {
      playFromGesture() { startCurrent(); },
      onSectionVisible(sectionId) {
        if (!autoSwitch || !isPlaying || !unlocked) return;
        const targetIdx = DATA.sectionTrackMap[sectionId];
        if (typeof targetIdx === "number" && targetIdx !== currentIdx) {
          selectTrack(targetIdx, false);
        }
      },
      showToast
    };
  })();

  // ------------------------------------------------------------------------
  // 4. 顶部滚动日期与实时海拔 HUD + 自动放映导演模式
  // ------------------------------------------------------------------------
  const CinemaHUD = (() => {
    const hud = $("#cinemaHud");
    const dateBtn = $("#hudDateBtn");
    const rollerText = $("#rollerDateText");
    const placeEl = $("#hudPlace");
    const elevEl = $("#hudElev");
    const drawer = $("#hudDrawer");
    const drawerGrid = $("#hudDrawerGrid");
    const autoBtn = $("#btnAutoPlay");
    const autoIcon = $("#autoPlayIcon");
    const autoLabel = $("#autoPlayLabel");

    let curDate = "10.29";
    let curElev = 3480;
    let elevAnim = null;

    // 填充 12 日跳转抽屉
    DATA.chapters.forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "drawer-item";
      btn.dataset.target = ch.id;
      btn.innerHTML = `<span class="drawer-date">${ch.shortDate}</span><span class="drawer-place">${ch.shortPlace}</span>`;
      btn.addEventListener("click", () => {
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
        stopAutoFilm();
        const el = document.getElementById(ch.id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
      drawerGrid.appendChild(btn);
    });

    dateBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = drawer.classList.toggle("open");
      drawer.setAttribute("aria-hidden", String(!open));
    });

    document.addEventListener("click", (e) => {
      if (!hud.contains(e.target) && drawer.classList.contains("open")) {
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
      }
    });

    function animateElevation(targetElev) {
      if (elevAnim) cancelAnimationFrame(elevAnim);
      const from = curElev;
      const start = performance.now();
      const dur = 680;
      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(from + (targetElev - from) * eased);
        elevEl.textContent = `${val.toLocaleString()}m`;
        if (t < 1) elevAnim = requestAnimationFrame(step);
        else curElev = targetElev;
      }
      elevAnim = requestAnimationFrame(step);
    }

    function setChapter(ch) {
      if (!ch) return;
      // 同步全屏氛围底色
      document.documentElement.style.setProperty("--scene-bg", ch.bgColor);
      document.documentElement.style.setProperty("--scene-tint", ch.surfaceTint);
      document.documentElement.style.setProperty("--scene-accent", ch.accent);

      if (ch.shortDate !== curDate) {
        curDate = ch.shortDate;
        rollerText.classList.remove("rolling-in");
        rollerText.classList.add("rolling-out");
        setTimeout(() => {
          rollerText.textContent = ch.shortDate;
          rollerText.classList.remove("rolling-out");
          rollerText.classList.add("rolling-in");
        }, 160);
      }
      placeEl.textContent = ch.shortPlace;
      animateElevation(ch.elevNum);

      $$(".drawer-item", drawerGrid).forEach((item) => {
        item.classList.toggle("active", item.dataset.target === ch.id);
      });
    }

    // 自动放映模式（像剪辑短片一样按章节平滑推进）
    let autoFilmRunning = false;
    let autoTimer = null;
    const sequenceIds = ["birthday", "route", ...DATA.chapters.map((c) => c.id), "finale"];
    let seqIdx = 0;

    function stopAutoFilm(silent = false) {
      if (!autoFilmRunning) return;
      autoFilmRunning = false;
      clearTimeout(autoTimer);
      autoBtn.classList.remove("active");
      autoIcon.textContent = "▶";
      autoLabel.textContent = "自动放映";
      if (!silent) MusicEngine.showToast("已切回自由浏览");
    }

    function advanceFilm() {
      if (!autoFilmRunning) return;
      if (seqIdx >= sequenceIds.length) {
        stopAutoFilm(true);
        MusicEngine.showToast("全卷放映完毕");
        return;
      }
      const id = sequenceIds[seqIdx++];
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // 停留时间：图片轮放章节给足 10.5 秒欣赏 3 帧切换，过场字幕给 5.5 秒
      const ch = DATA.chapters.find((c) => c.id === id);
      const dwell = ch && ch.presentation === "intertitle" ? 5500
        : id === "route" ? 4500
        : id === "birthday" ? 6500
        : 10800;
      autoTimer = setTimeout(advanceFilm, dwell);
    }

    function startAutoFilm(fromStart = false) {
      MusicEngine.playFromGesture();
      autoFilmRunning = true;
      autoBtn.classList.add("active");
      autoIcon.textContent = "❚❚";
      autoLabel.textContent = "放映中";
      if (fromStart) {
        seqIdx = 0;
      } else {
        // 从当前可见章节的下一站继续
        const curIdx = sequenceIds.findIndex((id) => {
          const el = document.getElementById(id);
          return el && el.getBoundingClientRect().top >= -120;
        });
        seqIdx = curIdx >= 0 ? curIdx : 0;
      }
      MusicEngine.showToast("已开启自动放映 · 随时滑动即可接管");
      clearTimeout(autoTimer);
      advanceFilm();
    }

    autoBtn.addEventListener("click", () => {
      if (autoFilmRunning) stopAutoFilm();
      else startAutoFilm(false);
    });

    // 用户手动滚轮或触屏滑动时，温柔交还控制权
    ["wheel", "touchmove"].forEach((evt) => {
      window.addEventListener(evt, () => {
        if (autoFilmRunning) stopAutoFilm(false);
      }, { passive: true });
    });

    return {
      setVisible(v) { hud.classList.toggle("visible", v); },
      setChapter,
      startAutoFilm,
      stopAutoFilm
    };
  })();

  // ------------------------------------------------------------------------
  // 5. 开场按钮与互动吹蜡烛
  // ------------------------------------------------------------------------
  function initHeroAndCake() {
    $("#btnEnterWithMusic").addEventListener("click", (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      AmbientFX.spawnBurst(r.left + r.width / 2, r.top + r.height / 2, 40);
      MusicEngine.playFromGesture();
      $("#birthday").scrollIntoView({ behavior: "smooth" });
    });

    $("#btnEnterAutoFilm").addEventListener("click", () => {
      CinemaHUD.startAutoFilm(true);
    });

    const cakeScene = $("#cakeScene");
    const blowBtn = $("#btnBlowCandles");
    const wishRevealed = $("#wishRevealed");
    let blown = false;

    function toggleCandles() {
      blown = !blown;
      cakeScene.classList.toggle("blown", blown);
      if (blown) {
        const rect = cakeScene.getBoundingClientRect();
        AmbientFX.spawnBurst(rect.left + rect.width / 2, rect.top + 55, 52);
        wishRevealed.classList.add("show");
        blowBtn.textContent = "再点亮蜡烛";
      } else {
        wishRevealed.classList.remove("show");
        blowBtn.textContent = "吹灭蜡烛，许个愿";
      }
    }

    cakeScene.addEventListener("click", toggleCandles);
    cakeScene.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCandles(); }
    });
    blowBtn.addEventListener("click", toggleCandles);
  }

  // ------------------------------------------------------------------------
  // 6. 十二日海拔路线 SVG
  // ------------------------------------------------------------------------
  function buildRouteMap() {
    const svg = $("#routeSvg");
    const stops = DATA.routeStops;

    let d = `M ${stops[0].x} ${stops[0].y}`;
    for (let i = 0; i < stops.length - 1; i++) {
      const p0 = stops[i], p1 = stops[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    const areaD = `${d} L ${stops[stops.length - 1].x} 285 L ${stops[0].x} 285 Z`;

    let html = `
      <defs>
        <linearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E6B45C" stop-opacity="0.32" />
          <stop offset="70%" stop-color="#54C0D4" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#141A24" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="routeStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F2C063" />
          <stop offset="28%" stop-color="#54C0D4" />
          <stop offset="65%" stop-color="#E3774B" />
          <stop offset="100%" stop-color="#F4B956" />
        </linearGradient>
      </defs>
      <g stroke="rgba(255,240,210,0.08)" stroke-dasharray="4 6" stroke-width="1">
        <line x1="48" y1="52" x2="990" y2="52" />
        <line x1="48" y1="136" x2="990" y2="136" />
        <line x1="48" y1="220" x2="990" y2="220" />
      </g>
      <g fill="rgba(255,235,195,0.4)" font-size="10">
        <text x="6" y="55">4600m</text>
        <text x="6" y="139">3500m</text>
        <text x="6" y="223">1000m</text>
      </g>
      <path d="M 48 285 L 130 198 L 195 228 L 246 118 L 320 215 L 490 128 L 574 158 L 680 250 L 820 264 L 990 285 Z"
            fill="rgba(255,255,255,0.03)" />
      <path d="${areaD}" fill="url(#elevFill)" />
      <path class="route-path-line" d="${d}" fill="none" stroke="url(#routeStroke)" stroke-width="2.8" stroke-linecap="round" />
    `;

    stops.forEach((s, i) => {
      const labelAbove = i % 2 === 0 || s.peak;
      const dateY = labelAbove ? s.y - 24 : s.y + 24;
      const nameY = labelAbove ? s.y - 11 : s.y + 37;
      const dotColor = s.peak ? "#EE6E4C" : "#F2C063";
      html += `
        <g class="route-node" data-target="${s.chapterId}" role="button" tabindex="0">
          <circle class="node-ring" cx="${s.x}" cy="${s.y}" r="10" fill="${dotColor}" opacity="0.22" />
          <circle class="node-dot" cx="${s.x}" cy="${s.y}" r="${s.peak ? 5.5 : 4.5}" fill="${dotColor}" stroke="#141A24" stroke-width="2" />
          <text x="${s.x}" y="${dateY}" text-anchor="middle" fill="#FFE4AC" font-size="11" font-weight="700">${s.date}</text>
          <text x="${s.x}" y="${nameY}" text-anchor="middle" fill="rgba(248,242,232,0.82)" font-size="10.5">${s.label}</text>
        </g>
      `;
    });

    svg.innerHTML = html;
    $$(".route-node", svg).forEach((node) => {
      const jump = () => {
        CinemaHUD.stopAutoFilm(true);
        const target = document.getElementById(node.dataset.target);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      };
      node.addEventListener("click", jump);
      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(); }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 7. 构建各种创意轮放组件（Cinema Reel / Handscroll / 3D Deck / Spotlight）
  // ------------------------------------------------------------------------
  function registerPhotos(ch, entry) {
    return entry.photos.map((ph, idx) => {
      const globalIdx = allPhotosFlat.length;
      allPhotosFlat.push({
        src: ph.src,
        alt: ph.alt,
        chapterTitle: `${ch.date} · ${ch.location}`,
        caption: entry.caption.split("\n")[0],
        localIdx: idx + 1,
        localTotal: entry.photos.length
      });
      return { ...ph, globalIdx };
    });
  }

  function createCinemaReel(ch, entry, reverse) {
    const photos = registerPhotos(ch, entry);
    const wrap = document.createElement("div");
    wrap.className = "cinema-layout" + (reverse ? " reverse" : "");

    const stageCol = document.createElement("div");
    stageCol.className = "cinema-stage-col unroll-reveal";

    const frame = document.createElement("div");
    frame.className = "reel-frame";

    const slidesBox = document.createElement("div");
    slidesBox.className = "reel-slides";

    const isWipe = entry.transition === "wipe";
    const slideEls = photos.map((ph, i) => {
      const s = document.createElement("div");
      s.className = `reel-slide orient-${ph.orient}${isWipe ? " is-wipe" : ""}${i === 0 ? " active" : ""}`;
      if (ph.orient === "P") {
        const bg = document.createElement("img");
        bg.className = "reel-bg-blur";
        bg.src = ph.thumb;
        bg.alt = "";
        bg.loading = i < 2 ? "eager" : "lazy";
        s.appendChild(bg);
      }
      const fg = document.createElement("img");
      fg.className = `reel-main-img kb-${i % 4}`;
      fg.src = ph.src;
      fg.alt = ph.alt;
      fg.loading = i < 2 ? "eager" : "lazy";
      fg.decoding = "async";
      s.appendChild(fg);
      slidesBox.appendChild(s);
      return s;
    });
    frame.appendChild(slidesBox);

    // 底部胶片进度条与轻控按钮
    const hud = document.createElement("div");
    hud.className = "reel-hud";
    const capRow = document.createElement("div");
    capRow.className = "reel-caption-row";
    const altEl = document.createElement("span");
    altEl.className = "reel-shot-alt";
    altEl.textContent = photos[0].alt;

    const ctrls = document.createElement("div");
    ctrls.className = "reel-controls";
    const btnPrev = mkBtn("reel-btn", "‹", "上一帧");
    const btnPause = mkBtn("reel-btn", "❚❚", "暂停或继续轮放");
    const btnNext = mkBtn("reel-btn", "›", "下一帧");
    const btnZoom = mkBtn("reel-btn", "⤢", "全屏看原图");
    ctrls.append(btnPrev, btnPause, btnNext, btnZoom);
    capRow.append(altEl, ctrls);

    const barsBox = document.createElement("div");
    barsBox.className = "reel-bars";
    const barEls = photos.map((_, i) => {
      const seg = document.createElement("div");
      seg.className = "reel-bar-seg" + (i === 0 ? " active" : "");
      seg.innerHTML = `<span class="reel-bar-fill"></span>`;
      seg.addEventListener("click", (e) => { e.stopPropagation(); goTo(i); });
      barsBox.appendChild(seg);
      return seg;
    });

    hud.append(capRow, barsBox);
    frame.appendChild(hud);
    stageCol.appendChild(frame);

    // 可选展开全部缩略条
    const stripBtn = document.createElement("button");
    stripBtn.type = "button";
    stripBtn.className = "reel-filmstrip-toggle";
    stripBtn.textContent = `展开胶片选帧（共 ${photos.length} 张）`;

    const strip = document.createElement("div");
    strip.className = "reel-filmstrip";
    const thumbEls = photos.map((ph, i) => {
      const tb = document.createElement("button");
      tb.type = "button";
      tb.className = "strip-thumb" + (i === 0 ? " active" : "");
      tb.innerHTML = `<img src="${ph.thumb}" alt="${ph.alt}" loading="lazy" />`;
      tb.addEventListener("click", () => goTo(i));
      strip.appendChild(tb);
      return tb;
    });

    stripBtn.addEventListener("click", () => {
      const open = strip.classList.toggle("open");
      stripBtn.textContent = open ? "收起胶片选帧" : `展开胶片选帧（共 ${photos.length} 张）`;
    });

    stageCol.append(stripBtn, strip);

    // 侧边文案栏（纯正妈妈原话）
    const storyCol = document.createElement("div");
    storyCol.className = "cinema-story-col unroll-reveal";
    const hasClock = entry.time && entry.time.includes(":");
    const metaTime = hasClock ? `${ch.date} ${entry.time}` : ch.date;
    storyCol.innerHTML = `
      ${ch.badge ? `<span class="story-badge">⛰ ${ch.badge}</span>` : ""}
      ${entry.subTitle ? `<div class="story-sublabel">${entry.subTitle}</div>` : ""}
      <p class="mom-quote">${escapeHtml(entry.caption)}</p>
      <div class="mom-quote-meta">${metaTime} · ${photos.length} 帧轮放</div>
    `;

    wrap.append(stageCol, storyCol);

    // 轮放状态机
    let idx = 0;
    let paused = false;
    let visible = false;
    let timer = null;

    function goTo(newIdx) {
      const nextIdx = (newIdx + photos.length) % photos.length;
      if (nextIdx === idx) return;
      const prevIdx = idx;
      idx = nextIdx;

      slideEls.forEach((s, i) => {
        s.classList.remove("prev", "active");
        if (i === prevIdx) s.classList.add("prev");
        if (i === idx) {
          // 重置 Ken Burns 动画
          const img = s.querySelector(".reel-main-img");
          if (img) { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; }
          s.classList.add("active");
        }
      });

      barEls.forEach((b, i) => {
        b.classList.remove("done", "active");
        const fill = b.querySelector(".reel-bar-fill");
        fill.style.animation = "none";
        void fill.offsetWidth;
        fill.style.animation = "";
        if (i < idx) b.classList.add("done");
        else if (i === idx) b.classList.add("active");
      });

      thumbEls.forEach((t, i) => t.classList.toggle("active", i === idx));
      altEl.textContent = photos[idx].alt;
      scheduleNext();
    }

    function scheduleNext() {
      clearTimeout(timer);
      if (!paused && visible) {
        timer = setTimeout(() => goTo(idx + 1), currentSlideMs);
      }
    }

    btnPrev.addEventListener("click", (e) => { e.stopPropagation(); goTo(idx - 1); });
    btnNext.addEventListener("click", (e) => { e.stopPropagation(); goTo(idx + 1); });
    btnPause.addEventListener("click", (e) => {
      e.stopPropagation();
      paused = !paused;
      frame.classList.toggle("paused", paused);
      btnPause.textContent = paused ? "▶" : "❚❚";
      if (!paused) scheduleNext();
      else clearTimeout(timer);
    });
    btnZoom.addEventListener("click", (e) => {
      e.stopPropagation();
      Lightbox.open(photos[idx].globalIdx);
    });
    slidesBox.addEventListener("click", () => Lightbox.open(photos[idx].globalIdx));

    // 手机手势左右滑切帧
    let touchX = 0;
    frame.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    frame.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });

    activeReels.push({
      el: frame,
      setVisible(v) {
        visible = v;
        if (v) scheduleNext();
        else clearTimeout(timer);
      }
    });

    return wrap;
  }

  function createHandscroll(ch, entry) {
    const photos = registerPhotos(ch, entry);
    const wrap = document.createElement("div");

    const head = document.createElement("div");
    head.className = "handscroll-header unroll-reveal";
    const hasClock = entry.time && entry.time.includes(":");
    head.innerHTML = `
      <p class="mom-quote">${escapeHtml(entry.caption)}</p>
      <div class="mom-quote-meta">${hasClock ? `${ch.date} ${entry.time}` : ch.date} · 横轴画卷（轻触可暂停或放大）</div>
    `;
    wrap.appendChild(head);

    const vp = document.createElement("div");
    vp.className = "handscroll-viewport unroll-reveal";
    const track = document.createElement("div");
    track.className = "handscroll-track";

    photos.forEach((ph) => {
      const panel = document.createElement("div");
      panel.className = `scroll-panel orient-${ph.orient}`;
      panel.innerHTML = `
        <img src="${ph.thumb}" alt="${ph.alt}" loading="lazy" decoding="async" />
        <div class="scroll-panel-cap">${ph.alt}</div>
      `;
      panel.addEventListener("click", () => Lightbox.open(ph.globalIdx));
      track.appendChild(panel);
    });

    vp.appendChild(track);
    wrap.appendChild(vp);

    const bar = document.createElement("div");
    bar.className = "handscroll-bar";
    const prev = mkBtn("hs-nav-btn", "‹", "向左卷动");
    const label = document.createElement("span");
    label.textContent = "画卷徐徐展开 · 左右滑动浏览";
    const next = mkBtn("hs-nav-btn", "›", "向右卷动");
    bar.append(prev, label, next);
    wrap.appendChild(bar);

    const state = { viewport: vp, paused: false, visible: false, dir: 1 };
    activeHandscrolls.push(state);

    let resumeTimer = null;
    const tempPause = () => {
      state.paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { state.paused = false; }, 3500);
    };
    vp.addEventListener("mouseenter", () => { state.paused = true; });
    vp.addEventListener("mouseleave", () => { state.paused = false; });
    vp.addEventListener("touchstart", tempPause, { passive: true });
    prev.addEventListener("click", () => { tempPause(); vp.scrollBy({ left: -340, behavior: "smooth" }); });
    next.addEventListener("click", () => { tempPause(); vp.scrollBy({ left: 340, behavior: "smooth" }); });

    return wrap;
  }

  function createCardDeck(ch, entry) {
    const photos = registerPhotos(ch, entry);
    const wrap = document.createElement("div");
    wrap.className = "cinema-layout";

    const stageCol = document.createElement("div");
    stageCol.className = "cinema-stage-col unroll-reveal";

    const deck = document.createElement("div");
    deck.className = "deck-stage";

    const cards = photos.map((ph, i) => {
      const c = document.createElement("div");
      c.className = `deck-card orient-${ph.orient}`;
      if (ph.orient === "P") {
        const bg = document.createElement("img");
        bg.className = "deck-bg"; bg.src = ph.thumb; bg.alt = ""; bg.loading = "lazy";
        c.appendChild(bg);
      }
      const fg = document.createElement("img");
      fg.className = "deck-fg"; fg.src = ph.src; fg.alt = ph.alt; fg.loading = "lazy";
      c.appendChild(fg);

      const foot = document.createElement("div");
      foot.className = "deck-footer";
      foot.innerHTML = `<span>${ph.alt}</span><span>${i + 1} / ${photos.length}</span>`;
      c.appendChild(foot);
      deck.appendChild(c);
      return c;
    });

    let topIdx = 0;
    let visible = false;
    let timer = null;

    function layoutCards() {
      cards.forEach((c, i) => {
        c.classList.remove("pos-0", "pos-1", "pos-2", "pos-rest", "dealing");
        const rel = (i - topIdx + photos.length) % photos.length;
        if (rel === 0) c.classList.add("pos-0");
        else if (rel === 1) c.classList.add("pos-1");
        else if (rel === 2) c.classList.add("pos-2");
        else c.classList.add("pos-rest");
      });
    }

    function dealNext() {
      const front = cards[topIdx];
      front.classList.add("dealing");
      setTimeout(() => {
        topIdx = (topIdx + 1) % photos.length;
        layoutCards();
        schedule();
      }, 320);
    }

    function schedule() {
      clearTimeout(timer);
      if (visible) timer = setTimeout(dealNext, currentSlideMs);
    }

    deck.addEventListener("click", dealNext);
    let tx = 0;
    deck.addEventListener("touchstart", (e) => { tx = e.changedTouches[0].clientX; }, { passive: true });
    deck.addEventListener("touchend", (e) => {
      if (Math.abs(e.changedTouches[0].clientX - tx) > 36) dealNext();
    }, { passive: true });

    const ctrls = document.createElement("div");
    ctrls.className = "deck-controls";
    const btnNextCard = document.createElement("button");
    btnNextCard.type = "button"; btnNextCard.className = "deck-pill-btn";
    btnNextCard.textContent = "翻下一张 ›";
    btnNextCard.addEventListener("click", dealNext);

    const btnZoom = document.createElement("button");
    btnZoom.type = "button"; btnZoom.className = "deck-pill-btn";
    btnZoom.textContent = "全屏看原图 ⤢";
    btnZoom.addEventListener("click", () => Lightbox.open(photos[topIdx].globalIdx));

    ctrls.append(btnNextCard, btnZoom);
    stageCol.append(deck, ctrls);

    const storyCol = document.createElement("div");
    storyCol.className = "cinema-story-col unroll-reveal";
    storyCol.innerHTML = `
      <p class="mom-quote">${escapeHtml(entry.caption)}</p>
      <div class="mom-quote-meta">${ch.date} ${entry.time || ""} · 叠影轮播（轻点翻页）</div>
    `;

    wrap.append(stageCol, storyCol);
    layoutCards();

    activeDecks.push({
      el: deck,
      setVisible(v) {
        visible = v;
        if (v) schedule();
        else clearTimeout(timer);
      }
    });

    return wrap;
  }

  function createSpotlight(ch, entry) {
    const photos = registerPhotos(ch, entry);
    const ph = photos[0];
    const wrap = document.createElement("div");
    wrap.className = "spotlight-wrap unroll-reveal";

    const frame = document.createElement("div");
    frame.className = "spotlight-frame";
    frame.innerHTML = `<img src="${ph.src}" alt="${ph.alt}" loading="lazy" />`;
    frame.addEventListener("click", () => Lightbox.open(ph.globalIdx));
    wrap.appendChild(frame);

    const bar = document.createElement("div");
    bar.className = "spotlight-bar";
    bar.innerHTML = `
      <div>
        <p class="mom-quote">${escapeHtml(entry.caption)}</p>
        <div class="mom-quote-meta">${ch.date} ${entry.time || ""}</div>
      </div>
    `;

    if (ch.special === "marmot-cracker") {
      let count = 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-cracker";
      btn.id = "btnFeedCracker";
      btn.textContent = "🍘 投喂雪饼";
      btn.addEventListener("click", (e) => {
        count++;
        const r = e.currentTarget.getBoundingClientRect();
        for (let k = 0; k < 3; k++) {
          const el = document.createElement("span");
          el.className = "flying-cracker";
          el.textContent = k === 1 ? "✨" : "🍘";
          el.style.left = `${r.left + r.width / 2}px`;
          el.style.top = `${r.top}px`;
          el.style.setProperty("--dx", `${(Math.random() - 0.5) * 200}px`);
          el.style.setProperty("--dy", `${-110 - Math.random() * 120}px`);
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 950);
        }
        btn.textContent = count === 1 ? "🍘 已给 1 片 · 停手了" : `🍘 已给 ${count} 片雪饼`;
      });
      bar.appendChild(btn);
    }

    wrap.appendChild(bar);
    return wrap;
  }

  function mkBtn(cls, txt, aria) {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls; b.textContent = txt; b.setAttribute("aria-label", aria);
    return b;
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ------------------------------------------------------------------------
  // 8. 渲染全部 12 天连续画卷
  // ------------------------------------------------------------------------
  function renderChapters() {
    const root = $("#chaptersRoot");
    root.innerHTML = "";

    DATA.chapters.forEach((ch) => {
      const sec = document.createElement("section");
      sec.className = "chapter-scene";
      sec.id = ch.id;
      sec.style.setProperty("--ch-accent", ch.accent);

      const container = document.createElement("div");
      container.className = "container";

      // 电影式日期流转过场线
      const bridge = document.createElement("div");
      bridge.className = "date-bridge unroll-reveal";
      bridge.innerHTML = `
        <span class="bridge-line"></span>
        <div class="bridge-stamp">
          <span class="bridge-date">${ch.shortDate}</span>
          <span class="bridge-loc">${ch.location}</span>
          <span class="bridge-elev">${ch.elevation}</span>
        </div>
        <span class="bridge-line right"></span>
      `;
      container.appendChild(bridge);

      const allIntertitle = ch.entries.every((en) => en.mode === "intertitle");
      if (allIntertitle) {
        const grid = document.createElement("div");
        grid.className = "intertitle-wrap" + (ch.entries.length > 1 ? " two-col" : "");
        ch.entries.forEach((en) => {
          const card = document.createElement("article");
          card.className = "intertitle-card unroll-reveal";
          card.innerHTML = `
            ${en.placeTag ? `<div class="intertitle-tag">${en.placeTag}</div>` : ""}
            <p class="mom-quote">${escapeHtml(en.caption)}</p>
            <div class="mom-quote-meta">${ch.date} ${en.time || ""}</div>
          `;
          grid.appendChild(card);
        });
        container.appendChild(grid);
      } else {
        let reelCount = 0;
        ch.entries.forEach((en) => {
          if (en.mode === "note") {
            const note = document.createElement("article");
            note.className = "chapter-prelude-note unroll-reveal";
            note.innerHTML = `
              <p class="mom-quote">${escapeHtml(en.caption)}</p>
              <div class="mom-quote-meta">${ch.date} ${en.time || ""}</div>
            `;
            container.appendChild(note);
          } else if (en.mode === "reel") {
            const reverse = ch.presentation === "reel-reverse" || reelCount % 2 === 1;
            const node = createCinemaReel(ch, en, reverse);
            if (reelCount > 0) node.classList.add("dual-reel-gap");
            reelCount++;
            container.appendChild(node);
          } else if (en.mode === "handscroll") {
            container.appendChild(createHandscroll(ch, en));
          } else if (en.mode === "deck") {
            container.appendChild(createCardDeck(ch, en));
          } else if (en.mode === "spotlight") {
            container.appendChild(createSpotlight(ch, en));
          }
        });
      }

      sec.appendChild(container);
      root.appendChild(sec);
    });
  }

  // ------------------------------------------------------------------------
  // 9. 全屏高清 Lightbox
  // ------------------------------------------------------------------------
  const Lightbox = (() => {
    const lb = $("#lightbox");
    const img = $("#lbImg");
    const counter = $("#lbCounter");
    const chapterEl = $("#lbChapter");
    const captionEl = $("#lbCaption");
    const stage = $("#lbStage");
    let cur = 0, touchStartX = 0;

    function show(index) {
      cur = (index + allPhotosFlat.length) % allPhotosFlat.length;
      const item = allPhotosFlat[cur];
      img.style.opacity = "0.25";
      img.onload = () => { img.style.opacity = "1"; };
      img.src = item.src;
      img.alt = item.alt;
      counter.textContent = `${item.localIdx} / ${item.localTotal}`;
      chapterEl.textContent = item.chapterTitle;
      captionEl.textContent = `${item.alt}  ·  「${item.caption}」`;
      const pre = new Image();
      pre.src = allPhotosFlat[(cur + 1) % allPhotosFlat.length].src;
    }

    function open(index) {
      show(index);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      document.body.style.overflow = "";
    }

    $("#lbClose").addEventListener("click", close);
    $("#lbBackdrop").addEventListener("click", close);
    $("#lbPrev").addEventListener("click", () => show(cur - 1));
    $("#lbNext").addEventListener("click", () => show(cur + 1));

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(cur - 1);
      else if (e.key === "ArrowRight") show(cur + 1);
    });

    stage.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 42) show(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    return { open, close };
  })();

  // ------------------------------------------------------------------------
  // 10. 滚动观察器：画卷展开 + 滚动日期 HUD + 轮放激活 + 章节切歌
  // ------------------------------------------------------------------------
  function initObservers() {
    // 1) 画卷展开动效
    const unrollObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          unrollObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    $$(".unroll-reveal").forEach((el) => unrollObs.observe(el));

    // 2) 仅对当前视口内的轮放/长卷/叠卡启用自动播放（省电流畅！）
    const mediaObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const r = activeReels.find((x) => x.el === en.target);
        if (r) r.setVisible(en.isIntersecting);
        const h = activeHandscrolls.find((x) => x.viewport === en.target);
        if (h) h.visible = en.isIntersecting;
        const d = activeDecks.find((x) => x.el === en.target);
        if (d) d.setVisible(en.isIntersecting);
      });
    }, { threshold: 0.25 });

    activeReels.forEach((r) => mediaObs.observe(r.el));
    activeHandscrolls.forEach((h) => mediaObs.observe(h.viewport));
    activeDecks.forEach((d) => mediaObs.observe(d.el));

    // 3) 章节切换：驱动顶部滚动日期 HUD、背景色调流转、海拔路线高亮、章节音乐切歌
    const routeNodes = $$(".route-node");
    const chapterMap = Object.fromEntries(DATA.chapters.map((c) => [c.id, c]));
    const sections = [$("#top"), $("#birthday"), $("#route"), ...$$(".chapter-scene"), $("#finale")].filter(Boolean);

    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        MusicEngine.onSectionVisible(id);

        if (id === "top") {
          CinemaHUD.setVisible(false);
          document.documentElement.style.setProperty("--scene-bg", "#14171E");
        } else {
          CinemaHUD.setVisible(true);
        }

        if (chapterMap[id]) {
          CinemaHUD.setChapter(chapterMap[id]);
          routeNodes.forEach((n) => n.classList.toggle("active", n.dataset.target === id));
        }
      });
    }, { threshold: 0.22, rootMargin: "-14% 0px -46% 0px" });

    sections.forEach((s) => secObs.observe(s));

    // 4) 顶部阅读进度条
    const bar = $("#scrollProgress");
    window.addEventListener("scroll", () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
      bar.style.width = `${pct}%`;
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 11. 尾声祈愿灯与重看全卷
  // ------------------------------------------------------------------------
  function initFinale() {
    let count = 0;
    const counter = $("#lanternCounter");
    $("#btnLantern").addEventListener("click", () => {
      count++;
      AmbientFX.spawnLantern();
      setTimeout(() => AmbientFX.spawnLantern(), 280);
      counter.textContent = `已放飞 ${count * 2} 盏灯`;
    });

    $("#btnReplayFilm").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => CinemaHUD.startAutoFilm(true), 700);
    });
  }

  // 启动
  initHeroSlides();
  buildRouteMap();
  renderChapters();
  initHeroAndCake();
  initFinale();
  initObservers();
})();
