/* ==========================================================================
   祝老妈生日快乐 · 川西十二日山河志 — 交互与动效引擎
   - 四曲双音轨 1.4s 平滑交叉淡入淡出 + 章节自动切歌 + 节拍联动动效
   - 互动生日蛋糕吹蜡烛 + 全屏金秋落叶/礼花/孔明灯 Canvas 粒子
   - 12 天海拔 SVG 互动路线图 + 吸顶日期导航联动
   - 10.30 旱獭雪饼彩蛋 + 全屏手势滑动 Lightbox
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.SITE_DATA;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ------------------------------------------------------------------------
  // 1. 英雄开场背景轮播 + 尾声牛奶海封面
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
    }, 6500);

    const finaleBg = $("#finaleBg");
    if (finaleBg && DATA.coverPhoto) {
      finaleBg.style.backgroundImage = `url("${DATA.coverPhoto}")`;
    }
  }

  // ------------------------------------------------------------------------
  // 2. 全屏轻量 Canvas 粒子引擎（秋叶金光 + 生日礼花 + 祈愿孔明灯）
  // ------------------------------------------------------------------------
  const AmbientFX = (() => {
    const canvas = $("#ambientCanvas");
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    let speedScale = 1.0;

    const leaves = [];
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

    function initLeaves() {
      const count = W < 640 ? 14 : 24;
      leaves.length = 0;
      for (let i = 0; i < count; i++) {
        leaves.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 2.2 + Math.random() * 4.2,
          vy: 0.25 + Math.random() * 0.48,
          vx: -0.25 + Math.random() * 0.5,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.008 + Math.random() * 0.015,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: -0.015 + Math.random() * 0.03,
          kind: Math.random() > 0.35 ? "mote" : "leaf",
          alpha: 0.25 + Math.random() * 0.45
        });
      }
    }

    function spawnBurst(cx, cy, count = 42) {
      const colors = ["#F5C562", "#E88B44", "#D95D39", "#FFF1C1", "#4FA9B8"];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const spd = 2.2 + Math.random() * 5.6;
        bursts.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 2.2,
          size: 3 + Math.random() * 4.5,
          color: colors[i % colors.length],
          life: 1.0,
          decay: 0.012 + Math.random() * 0.012,
          rot: Math.random() * Math.PI * 2
        });
      }
    }

    function spawnLantern() {
      lanterns.push({
        x: W * (0.18 + Math.random() * 0.64),
        y: H + 30,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.7 + Math.random() * 0.55),
        sway: Math.random() * Math.PI * 2,
        scale: 0.78 + Math.random() * 0.45,
        alpha: 0.96
      });
    }

    function setTempo(bpm) {
      // 将曲目 BPM 温和映射到秋叶漂浮倍率（64 BPM -> 0.78x, 118 BPM -> 1.18x）
      speedScale = Math.max(0.72, Math.min(1.22, bpm / 88));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      // 1) 金秋微粒与银杏叶
      for (const p of leaves) {
        p.sway += p.swaySpeed * speedScale;
        p.x += (p.vx + Math.sin(p.sway) * 0.42) * speedScale;
        p.y += p.vy * speedScale;
        p.rot += p.rotSpeed * speedScale;
        if (p.y > H + 16) { p.y = -14; p.x = Math.random() * W; }
        if (p.x < -16) p.x = W + 14;
        if (p.x > W + 16) p.x = -14;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        if (p.kind === "mote") {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 2);
          grad.addColorStop(0, "rgba(255, 224, 150, 0.95)");
          grad.addColorStop(1, "rgba(255, 200, 100, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "#E6AD4D";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 1.4, p.r * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2) 生日礼花金箔
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.11;
        b.vx *= 0.985;
        b.rot += 0.12;
        b.life -= b.decay;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = b.life;
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.size / 2, -b.size * 0.32, b.size, b.size * 0.64);
        ctx.restore();
      }

      // 3) 祈愿孔明灯
      for (let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i];
        l.sway += 0.022;
        l.x += l.vx + Math.sin(l.sway) * 0.35;
        l.y += l.vy;
        if (l.y < H * 0.18) l.alpha -= 0.008;
        if (l.alpha <= 0 || l.y < -60) { lanterns.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.scale(l.scale, l.scale);
        ctx.globalAlpha = l.alpha;

        // 外光晕
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 34);
        glow.addColorStop(0, "rgba(255, 206, 108, 0.55)");
        glow.addColorStop(1, "rgba(255, 160, 60, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.fill();

        // 灯身
        const bodyGrad = ctx.createLinearGradient(0, -18, 0, 14);
        bodyGrad.addColorStop(0, "#E36835");
        bodyGrad.addColorStop(0.55, "#F6B958");
        bodyGrad.addColorStop(1, "#FFF2C2");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(-12, -14);
        ctx.quadraticCurveTo(0, -21, 12, -14);
        ctx.lineTo(9, 12);
        ctx.lineTo(-9, 12);
        ctx.closePath();
        ctx.fill();

        // 烛芯
        ctx.fillStyle = "#FFFBEA";
        ctx.beginPath();
        ctx.arc(0, 9, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(tick);
    }

    resize();
    initLeaves();
    window.addEventListener("resize", () => { resize(); initLeaves(); });
    requestAnimationFrame(tick);

    return { spawnBurst, spawnLantern, setTempo };
  })();

  // ------------------------------------------------------------------------
  // 3. 四曲双音轨平滑交叉淡入淡出音乐引擎（支持微信 & 手机首触解锁）
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
    let fadeTimer = null;
    let toastTimer = null;
    const TARGET_VOL = 0.72;

    function applyTrackRhythm(track) {
      document.documentElement.style.setProperty("--beat-sec", `${track.beatSec}s`);
      document.body.dataset.mood = track.motionMood || "crisp";
      AmbientFX.setTempo(track.bpm || 80);
    }

    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
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
        try {
          audioEl.volume = Math.max(0, Math.min(1, fromVol + (toVol - fromVol) * eased));
        } catch (_) {}
        if (t < 1) {
          requestAnimationFrame(step);
        } else if (onDone) {
          onDone();
        }
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
          if (!silentToast) showToast(`♫ 正在播放：${tr.shortTitle} — ${tr.artist}`);
        }).catch(() => {
          // 浏览器策略阻止自动播放，等待用户点击
          isPlaying = false;
          updateUI();
        });
      }
    }

    function pauseAll() {
      isPlaying = false;
      updateUI();
      fadeVolume(activeDeck, activeDeck.volume, 0, 420, () => {
        activeDeck.pause();
      });
      standbyDeck.pause();
    }

    function selectTrack(newIdx, forcePlay = false, toastMsg = null) {
      if (newIdx === currentIdx) {
        if (forcePlay && !isPlaying) startCurrent();
        return;
      }
      const tr = DATA.tracks[newIdx];
      currentIdx = newIdx;

      if (!isPlaying && !forcePlay) {
        updateUI();
        return;
      }

      // 双音轨 1.35 秒平滑交叉淡入淡出
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
          fadeVolume(oldDeck, oldDeck.volume || TARGET_VOL, 0, 1200, () => {
            oldDeck.pause();
          });
          showToast(toastMsg || `♫ 乐章切换：${tr.shortTitle} — ${tr.artist}`);
        }).catch(() => {
          isPlaying = false;
          updateUI();
        });
      }
    }

    function onSectionVisible(sectionId) {
      if (!autoSwitch || !isPlaying || !unlocked) return;
      const targetIdx = DATA.sectionTrackMap[sectionId];
      if (typeof targetIdx === "number" && targetIdx !== currentIdx) {
        const tr = DATA.tracks[targetIdx];
        selectTrack(targetIdx, false, `♫ 随章节切换：${tr.shortTitle} — ${tr.artist}`);
      }
    }

    toggleBtn.addEventListener("click", () => {
      if (isPlaying) pauseAll();
      else startCurrent();
    });

    nextBtn.addEventListener("click", () => {
      autoSwitch = false;
      autoBtn.classList.remove("active");
      const next = (currentIdx + 1) % DATA.tracks.length;
      const tr = DATA.tracks[next];
      selectTrack(next, true, `♫ 下一曲：${tr.shortTitle} — ${tr.artist}`);
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
      showToast(autoSwitch ? "已开启：随浏览章节自动渐变切歌" : "已锁定当前单曲循环");
    });

    // 微信内置浏览器自动尝试就绪
    document.addEventListener("WeixinJSBridgeReady", () => {
      if (unlocked && !isPlaying) startCurrent(true);
    }, false);

    updateUI();

    return {
      playFromGesture() {
        startCurrent();
      },
      onSectionVisible
    };
  })();

  // ------------------------------------------------------------------------
  // 4. 开场按钮与互动生日蛋糕吹蜡烛
  // ------------------------------------------------------------------------
  function initHeroAndCake() {
    $("#btnEnterWithMusic").addEventListener("click", (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      AmbientFX.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 48);
      MusicEngine.playFromGesture();
      $("#birthday").scrollIntoView({ behavior: "smooth" });
    });

    $("#btnEnterSilent").addEventListener("click", () => {
      $("#birthday").scrollIntoView({ behavior: "smooth" });
    });

    const cakeScene = $("#cakeScene");
    const blowBtn = $("#btnBlowCandles");
    const cakeHint = $("#cakeHint");
    const wishRevealed = $("#wishRevealed");
    let blown = false;

    function toggleCandles() {
      blown = !blown;
      cakeScene.classList.toggle("blown", blown);
      if (blown) {
        const rect = cakeScene.getBoundingClientRect();
        AmbientFX.spawnBurst(rect.left + rect.width / 2, rect.top + 55, 60);
        wishRevealed.classList.add("show");
        blowBtn.textContent = "🕯️ 再点亮一次生日烛光";
        cakeHint.textContent = "愿望已寄向川西雪山与星河 ✨";
      } else {
        wishRevealed.classList.remove("show");
        blowBtn.textContent = "✨ 许个愿，吹灭蜡烛";
        cakeHint.textContent = "轻触蛋糕 · 许愿吹灭蜡烛";
      }
    }

    cakeScene.addEventListener("click", toggleCandles);
    cakeScene.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCandles(); }
    });
    blowBtn.addEventListener("click", toggleCandles);
  }

  // ------------------------------------------------------------------------
  // 5. 互动海拔路线图 SVG & 吸顶日期导航
  // ------------------------------------------------------------------------
  function buildRouteMapAndNav() {
    const svg = $("#routeSvg");
    const stops = DATA.routeStops;

    // 构造平滑贝塞尔路线
    let d = `M ${stops[0].x} ${stops[0].y}`;
    for (let i = 0; i < stops.length - 1; i++) {
      const p0 = stops[i];
      const p1 = stops[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${d} L ${stops[stops.length - 1].x} 285 L ${stops[0].x} 285 Z`;

    let html = `
      <defs>
        <linearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E6B45C" stop-opacity="0.34" />
          <stop offset="70%" stop-color="#2A8A9C" stop-opacity="0.10" />
          <stop offset="100%" stop-color="#141A24" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="routeStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F2C063" />
          <stop offset="30%" stop-color="#48B2C4" />
          <stop offset="65%" stop-color="#E3774B" />
          <stop offset="100%" stop-color="#F4B956" />
        </linearGradient>
      </defs>

      <!-- 海拔参考虚线 -->
      <g stroke="rgba(255,240,210,0.08)" stroke-dasharray="4 6" stroke-width="1">
        <line x1="36" y1="52" x2="988" y2="52" />
        <line x1="36" y1="136" x2="988" y2="136" />
        <line x1="36" y1="220" x2="988" y2="220" />
      </g>
      <g fill="rgba(255,235,195,0.38)" font-size="10">
        <text x="8" y="55">4600m</text>
        <text x="8" y="139">3500m</text>
        <text x="8" y="223">1000m</text>
      </g>

      <!-- 远山剪影 -->
      <path d="M 35 285 L 120 198 L 188 228 L 238 118 L 315 215 L 484 128 L 568 158 L 680 250 L 820 264 L 985 285 Z"
            fill="rgba(255,255,255,0.03)" />

      <!-- 海拔填充面积 -->
      <path d="${areaD}" fill="url(#elevFill)" />

      <!-- 路线主曲线 -->
      <path class="route-path-line" d="${d}" fill="none" stroke="url(#routeStroke)" stroke-width="3" stroke-linecap="round" />
    `;

    stops.forEach((s, i) => {
      const labelAbove = i % 2 === 0 || s.peak;
      const dateY = labelAbove ? s.y - 24 : s.y + 24;
      const nameY = labelAbove ? s.y - 11 : s.y + 37;
      const dotColor = s.peak ? "#EE6E4C" : "#F2C063";

      html += `
        <g class="route-node" data-target="${s.chapterId}" data-stop="${s.id}" role="button" tabindex="0">
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
        const target = document.getElementById(node.dataset.target);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      };
      node.addEventListener("click", jump);
      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(); }
      });
    });

    // 吸顶日期跳转条（使用路线图同款精炼短地名，绝不半途截断）
    const navInner = $("#dayNavInner");
    const stopLabelMap = Object.fromEntries(DATA.routeStops.map((s) => [s.chapterId, s.label]));
    DATA.chapters.forEach((ch, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-pill" + (idx === 0 ? " active" : "");
      btn.dataset.target = ch.id;
      const shortLoc = stopLabelMap[ch.id] || ch.location;
      btn.innerHTML = `<span>${ch.shortDate}</span><span class="pill-place">${shortLoc}</span>`;
      btn.addEventListener("click", () => {
        const el = document.getElementById(ch.id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
      navInner.appendChild(btn);
    });
  }

  // ------------------------------------------------------------------------
  // 6. 渲染全部 12 天（19 条朋友圈 + 76 张照片）
  // ------------------------------------------------------------------------
  const allPhotosFlat = [];

  function renderChapters() {
    const root = $("#chaptersRoot");
    root.innerHTML = "";

    DATA.chapters.forEach((ch) => {
      const sec = document.createElement("section");
      sec.className = `chapter theme-${ch.theme}`;
      sec.id = ch.id;
      sec.style.setProperty("--ch-accent", ch.accent);

      const container = document.createElement("div");
      container.className = "container";

      // 章节头部
      const head = document.createElement("div");
      head.className = "chapter-head reveal";
      head.innerHTML = `
        <div>
          <div class="chapter-meta">
            <span class="day-chip">${ch.dayNum}</span>
            <h2 class="date-big">${ch.date}</h2>
          </div>
          <div class="chapter-subline">
            <span>📍 ${ch.location}</span>
            <span class="elev-tag">⛰ ${ch.elevation}</span>
          </div>
        </div>
        <div class="chapter-tagline">${ch.tagline}</div>
      `;
      container.appendChild(head);

      // 稻城亚丁零吸氧登顶成就勋章
      if (ch.badge) {
        const badge = document.createElement("button");
        badge.type = "button";
        badge.className = "achievement-banner reveal";
        badge.innerHTML = `<span>🏅</span><span>${ch.badge} · 轻触为老妈喝彩</span>`;
        badge.addEventListener("click", (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          AmbientFX.spawnBurst(r.left + r.width / 2, r.top + r.height / 2, 46);
          badge.innerHTML = `<span>🏆</span><span>太牛了老妈！4,600m 零吸氧登顶牛奶海！</span>`;
        });
        container.appendChild(badge);
      }

      // 判断是否全为手记条目（如 11.05 康定+泸定桥、11.07 兴文天泉洞+穿越地心），用优雅双栏排版
      const allNotes = ch.entries.every((en) => en.layout === "journal-note");
      const notesWrapper = allNotes ? document.createElement("div") : null;
      if (notesWrapper) {
        notesWrapper.className = "journal-grid" + (ch.entries.length > 1 ? " two-col" : "");
      }

      ch.entries.forEach((entry) => {
        if (entry.layout === "journal-note") {
          const card = document.createElement("article");
          card.className = "journal-note-card reveal";
          card.innerHTML = `
            <div class="note-kicker">✦ ${entry.noteTitle || ch.location}</div>
            <p class="caption-text">${escapeHtml(entry.caption)}</p>
            ${entry.poeticSub ? `<p class="note-sub">${escapeHtml(entry.poeticSub)}</p>` : ""}
            <div class="caption-footer">
              <span>沐辰 · 朋友圈原文</span>
              <span>${ch.date} ${entry.time || ""}</span>
            </div>
          `;
          if (notesWrapper) notesWrapper.appendChild(card);
          else {
            const wrap = document.createElement("div");
            wrap.className = "entry-block";
            wrap.appendChild(card);
            container.appendChild(wrap);
          }
          return;
        }

        // 图文画廊条目
        const block = document.createElement("article");
        block.className = "entry-block reveal" + (entry.darkBlock ? " dark-subblock" : "");

        const hasClock = entry.time && entry.time.includes(":");
        const timeStr = hasClock ? `${ch.date} ${entry.time}` : ch.date;

        const capBox = document.createElement("div");
        capBox.className = "entry-caption-box";
        capBox.innerHTML = `
          <p class="caption-text">${escapeHtml(entry.caption)}</p>
          <div class="caption-footer">
            <span>沐辰 · 朋友圈原文</span>
            <span>${timeStr} · ${entry.photos.length} 帧珍藏</span>
          </div>
        `;
        block.appendChild(capBox);

        // 对 6 张和 9 张画廊，使用自然比例瀑布流（Masonry），彻底消除横竖混排造成的空白空洞
        const useMasonry = entry.photos.length >= 6;
        const grid = document.createElement("div");
        grid.className = useMasonry
          ? `photo-masonry ${entry.layout || "editorial-9"}`
          : `photo-grid ${entry.layout || "spotlight-1"}`;

        entry.photos.forEach((ph, pIdx) => {
          const globalIdx = allPhotosFlat.length;
          allPhotosFlat.push({
            src: ph.src,
            alt: ph.alt,
            chapterTitle: `${ch.date} · ${ch.location}`,
            caption: entry.caption.split("\n")[0],
            localIdx: pIdx + 1,
            localTotal: entry.photos.length
          });

          const tile = document.createElement("div");
          tile.className = `photo-tile orient-${ph.orient || "L"}`;
          tile.setAttribute("role", "button");
          tile.setAttribute("tabindex", "0");
          tile.setAttribute("aria-label", `放大查看：${ph.alt}`);

          const img = document.createElement("img");
          img.src = ph.thumb;
          img.alt = ph.alt;
          img.loading = "lazy";
          img.decoding = "async";
          tile.appendChild(img);

          const cap = document.createElement("div");
          cap.className = "photo-tile-caption";
          cap.textContent = ph.alt;
          tile.appendChild(cap);

          const open = () => Lightbox.open(globalIdx);
          tile.addEventListener("click", open);
          tile.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
          });

          grid.appendChild(tile);
        });

        block.appendChild(grid);

        // 10.30 旱獭雪饼彩蛋互动
        if (ch.special === "marmot-cracker") {
          const egg = document.createElement("div");
          egg.className = "marmot-egg";
          let crackers = 0;
          const lines = [
            "两只川西旱獭正在严肃摔跤中…",
            "收到第 1 片雪饼！两只小家伙停手嗅了嗅 🍘",
            "已投喂 2 片雪饼！左边那只先抱走了 😂",
            "已投喂 3 片雪饼！两边握手言和，祝老妈生日快乐！",
            "投喂雪饼达人！整座高原的旱獭都记住沐辰啦 🏔️"
          ];
          egg.innerHTML = `
            <span class="marmot-status" id="marmotStatus">${lines[0]}</span>
            <button class="btn-cracker" id="btnFeedCracker" type="button">🍘 投喂一片雪饼劝架</button>
          `;
          block.appendChild(egg);

          const btn = $("#btnFeedCracker", egg);
          const status = $("#marmotStatus", egg);
          btn.addEventListener("click", (e) => {
            crackers++;
            const r = e.currentTarget.getBoundingClientRect();
            for (let k = 0; k < 3; k++) {
              const el = document.createElement("span");
              el.className = "flying-cracker";
              el.textContent = k === 1 ? "✨" : "🍘";
              el.style.left = `${r.left + r.width / 2}px`;
              el.style.top = `${r.top}px`;
              el.style.setProperty("--dx", `${(Math.random() - 0.5) * 220}px`);
              el.style.setProperty("--dy", `${-120 - Math.random() * 140}px`);
              document.body.appendChild(el);
              setTimeout(() => el.remove(), 1000);
            }
            const msg = crackers < lines.length ? lines[crackers] : `已投喂 ${crackers} 片雪饼！两只旱獭吃饱啦，给老妈比心 💛`;
            status.textContent = msg;
          });
        }

        container.appendChild(block);
      });

      if (notesWrapper) container.appendChild(notesWrapper);

      sec.appendChild(container);
      root.appendChild(sec);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ------------------------------------------------------------------------
  // 7. 全屏手势滑动 Lightbox
  // ------------------------------------------------------------------------
  const Lightbox = (() => {
    const lb = $("#lightbox");
    const img = $("#lbImg");
    const counter = $("#lbCounter");
    const chapterEl = $("#lbChapter");
    const captionEl = $("#lbCaption");
    const stage = $("#lbStage");
    let cur = 0;
    let touchStartX = 0;

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

      // 预加载下一张高清原图
      const nextItem = allPhotosFlat[(cur + 1) % allPhotosFlat.length];
      if (nextItem) {
        const pre = new Image();
        pre.src = nextItem.src;
      }
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

    stage.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    stage.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 42) {
        if (dx < 0) show(cur + 1);
        else show(cur - 1);
      }
    }, { passive: true });

    return { open, close };
  })();

  // ------------------------------------------------------------------------
  // 8. 滚动联动：显露动效 + 顶部进度条 + 日期导航 + 章节音乐切换
  // ------------------------------------------------------------------------
  function initScrollObservers() {
    // 1) 元素优雅显露
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          revealObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    $$(".reveal").forEach((el) => revealObs.observe(el));

    // 2) 章节监听：同步吸顶日期栏 + 路线图高亮 + 自动渐变切歌
    const pills = $$(".day-pill");
    const routeNodes = $$(".route-node");
    const sections = [$("#top"), $("#birthday"), $("#route"), ...$$(".chapter"), $("#finale")].filter(Boolean);

    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        MusicEngine.onSectionVisible(id);

        if (id.startsWith("ch-")) {
          pills.forEach((p) => {
            const active = p.dataset.target === id;
            p.classList.toggle("active", active);
            if (active) {
              p.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
          });
          routeNodes.forEach((n) => {
            n.classList.toggle("active", n.dataset.target === id);
          });
        }
      });
    }, { threshold: 0.28, rootMargin: "-12% 0px -45% 0px" });

    sections.forEach((s) => secObs.observe(s));

    // 3) 顶部阅读进度条
    const bar = $("#scrollProgress");
    window.addEventListener("scroll", () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
      bar.style.width = `${pct}%`;
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 9. 尾声生日孔明灯祈愿
  // ------------------------------------------------------------------------
  function initFinale() {
    let lanternCount = 0;
    const wishes = [
      "愿老妈平安顺遂，岁岁常欢愉 🏮",
      "愿下一趟旅途，山河与星空都在等你 ✨",
      "愿你永远像在牛奶海一样自由强健 🏔️",
      "愿生活既有雪山旷野，也有邛海烟火 🌅",
      "生日快乐，借时光之手，暖一束花开 🌹"
    ];
    const counter = $("#lanternCounter");
    $("#btnLantern").addEventListener("click", () => {
      lanternCount++;
      AmbientFX.spawnLantern();
      setTimeout(() => AmbientFX.spawnLantern(), 260);
      const w = wishes[(lanternCount - 1) % wishes.length];
      counter.textContent = `已放飞 ${lanternCount * 2} 盏生日祈愿灯 · ${w}`;
    });

    $("#btnBackTop").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ------------------------------------------------------------------------
  // 启动
  // ------------------------------------------------------------------------
  initHeroSlides();
  buildRouteMapAndNav();
  renderChapters();
  initHeroAndCake();
  initFinale();
  initScrollObservers();
})();
