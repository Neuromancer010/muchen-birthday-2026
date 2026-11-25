/* ==========================================================================
   致老妈 · 川西之旅音乐相册 — 电影切镜轮放与自动放映引擎
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.SITE_DATA;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let currentSlideMs = DATA.tracks[0].slideMs || 3400;
  const activeReels = [];
  const activeHandscrolls = [];
  const activeDecks = [];
  const activeVideos = [];
  const allPhotosFlat = [];
  let unmutedVideoCtrl = null;

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
    }, 5600);

    const finaleBg = $("#finaleBg");
    if (finaleBg && DATA.coverPhoto) {
      finaleBg.style.backgroundImage = `url("${DATA.coverPhoto}")`;
    }
  }

  // ------------------------------------------------------------------------
  // 2. 全屏章节自适应电影氛围粒子引擎（秋叶 / 雪晶 / 碧水光斑 / 暖灯星火）
  // ------------------------------------------------------------------------
  const AmbientFX = (() => {
    const canvas = $("#ambientCanvas");
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    let speedScale = 1.0;
    let atmosphere = "autumn"; // autumn | snow | water | lantern

    const motes = [];
    const bokehs = [];
    const bursts = [];
    const lanterns = [];
    const rockets = [];
    const ripples = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initMotes() {
      const count = W < 640 ? 18 : 30;
      motes.length = 0;
      for (let i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 2.0 + Math.random() * 4.2,
          vy: 0.22 + Math.random() * 0.44,
          vx: -0.24 + Math.random() * 0.48,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.01 + Math.random() * 0.016,
          rot: Math.random() * Math.PI * 2,
          rotSpd: (Math.random() - 0.5) * 0.024,
          alpha: 0.2 + Math.random() * 0.36,
          isLeaf: i % 3 === 0
        });
      }
      const bCount = W < 640 ? 4 : 7;
      bokehs.length = 0;
      for (let i = 0; i < bCount; i++) {
        bokehs.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 36 + Math.random() * 68,
          vx: (Math.random() - 0.5) * 0.14,
          vy: -0.06 - Math.random() * 0.1,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.045 + Math.random() * 0.055
        });
      }
    }

    function setAtmosphere(kind) {
      if (kind && ["autumn", "snow", "water", "lantern"].includes(kind)) {
        atmosphere = kind;
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

    function spawnLantern(wish = "") {
      lanterns.push({
        x: W * (0.2 + Math.random() * 0.6),
        y: H + 30,
        vx: (Math.random() - 0.5) * 0.32,
        vy: -(0.78 + Math.random() * 0.45),
        sway: Math.random() * Math.PI * 2,
        scale: 0.85 + Math.random() * 0.38,
        alpha: 0.96,
        wish
      });
    }

    function spawnRocket(startX) {
      const x0 = typeof startX === "number" ? startX : W * (0.35 + Math.random() * 0.3);
      rockets.push({
        x: x0,
        y: H - 30,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(11.5 + Math.random() * 3.0),
        targetY: H * (0.18 + Math.random() * 0.16),
        trail: []
      });
    }

    function spawnRipple(x, y) {
      ripples.push({ x, y, r: 4, maxR: 46, alpha: 0.55 });
    }

    function setTempo(bpm) {
      speedScale = Math.max(0.76, Math.min(1.2, bpm / 92));
    }

    function drawLeaf(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * 0.9;
      const g = ctx.createLinearGradient(-p.r * 1.4, 0, p.r * 1.4, 0);
      g.addColorStop(0, "rgba(244, 186, 84, 0.95)");
      g.addColorStop(1, "rgba(222, 114, 52, 0.85)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-p.r * 1.6, 0);
      ctx.quadraticCurveTo(0, -p.r * 1.15, p.r * 1.6, 0);
      ctx.quadraticCurveTo(0, p.r * 1.15, -p.r * 1.6, 0);
      ctx.fill();
      ctx.restore();
    }

    function drawSnowGlint(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * (0.75 + 0.25 * Math.sin(p.sway * 2));
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 2.2);
      grad.addColorStop(0, "rgba(235, 250, 255, 0.96)");
      grad.addColorStop(0.45, "rgba(150, 218, 245, 0.48)");
      grad.addColorStop(1, "rgba(120, 196, 235, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 2.2, 0, Math.PI * 2);
      ctx.fill();
      if (p.isLeaf) {
        ctx.strokeStyle = "rgba(240, 252, 255, 0.55)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(-p.r * 1.5, 0); ctx.lineTo(p.r * 1.5, 0);
        ctx.moveTo(0, -p.r * 1.5); ctx.lineTo(0, p.r * 1.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawWaterCaustic(p) {
      ctx.save();
      ctx.globalAlpha = p.alpha * (0.72 + 0.28 * Math.sin(p.sway * 2.2));
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.8);
      grad.addColorStop(0, "rgba(162, 244, 248, 0.92)");
      grad.addColorStop(0.5, "rgba(84, 198, 214, 0.34)");
      grad.addColorStop(1, "rgba(62, 166, 186, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawWarmSpark(p, crimsonBias) {
      ctx.save();
      ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.sway * 2.4));
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.6);
      grad.addColorStop(0, crimsonBias ? "rgba(255, 214, 140, 0.98)" : "rgba(255, 224, 152, 0.95)");
      grad.addColorStop(0.5, crimsonBias ? "rgba(238, 128, 66, 0.38)" : "rgba(244, 184, 88, 0.28)");
      grad.addColorStop(1, "rgba(255, 180, 90, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      // 柔和电影镜头散景光斑（低频缓慢呼吸）
      const bokehColor = atmosphere === "snow" ? "136, 208, 245"
        : atmosphere === "water" ? "84, 212, 220"
        : atmosphere === "lantern" ? "244, 154, 78"
        : "242, 194, 102";

      for (const bk of bokehs) {
        bk.phase += 0.008 * speedScale;
        bk.x += bk.vx * speedScale;
        bk.y += bk.vy * speedScale;
        if (bk.y < -bk.r) { bk.y = H + bk.r; bk.x = Math.random() * W; }
        if (bk.x < -bk.r) bk.x = W + bk.r;
        if (bk.x > W + bk.r) bk.x = -bk.r;
        const a = bk.alpha * (0.72 + 0.28 * Math.sin(bk.phase));
        const g = ctx.createRadialGradient(bk.x, bk.y, 0, bk.x, bk.y, bk.r);
        g.addColorStop(0, `rgba(${bokehColor}, ${a})`);
        g.addColorStop(0.6, `rgba(${bokehColor}, ${a * 0.35})`);
        g.addColorStop(1, `rgba(${bokehColor}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bk.x, bk.y, bk.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of motes) {
        p.sway += p.swaySpeed * speedScale;
        p.rot += p.rotSpd * speedScale;
        const driftX = (p.vx + Math.sin(p.sway) * 0.42) * speedScale;
        // 水汽与灯火星火轻盈上升，秋叶与雪晶轻柔飘落
        const dirY = (atmosphere === "water" || atmosphere === "lantern") ? -0.78 : 1.0;
        p.x += driftX;
        p.y += p.vy * dirY * speedScale;
        if (p.y > H + 18) { p.y = -14; p.x = Math.random() * W; }
        if (p.y < -18) { p.y = H + 14; p.x = Math.random() * W; }
        if (p.x < -18) p.x = W + 14;
        if (p.x > W + 18) p.x = -14;

        if (atmosphere === "autumn" && p.isLeaf) drawLeaf(p);
        else if (atmosphere === "snow") drawSnowGlint(p);
        else if (atmosphere === "water") drawWaterCaustic(p);
        else drawWarmSpark(p, atmosphere === "lantern");
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
        if (l.wish) {
          ctx.font = "600 12px -apple-system, 'PingFang SC', sans-serif";
          ctx.fillStyle = "rgba(255, 240, 198, 0.94)";
          ctx.textAlign = "center";
          ctx.fillText(l.wish, 0, 29);
        }
        ctx.restore();
      }

      // 星空火箭升空与烟花绽放（西昌彩蛋）
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rk = rockets[i];
        rk.trail.push({ x: rk.x, y: rk.y });
        if (rk.trail.length > 18) rk.trail.shift();
        rk.x += rk.vx;
        rk.y += rk.vy;
        rk.vy *= 0.988;

        for (let t = 0; t < rk.trail.length; t++) {
          const pt = rk.trail[t];
          const frac = t / rk.trail.length;
          ctx.save();
          ctx.globalAlpha = frac * 0.85;
          ctx.fillStyle = t > rk.trail.length - 4 ? "#FFF8DC" : "#F5B84C";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5 + frac * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (rk.y <= rk.targetY || rk.vy > -2.5) {
          spawnBurst(rk.x, rk.y, 64);
          setTimeout(() => spawnBurst(rk.x + (Math.random() - 0.5) * 90, rk.y + (Math.random() - 0.5) * 45, 36), 180);
          rockets.splice(i, 1);
        }
      }

      // 轻触星光涟漪
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.2;
        rp.alpha -= 0.025;
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = rp.alpha;
        ctx.strokeStyle = "rgba(255, 224, 152, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (const hs of activeHandscrolls) {
        if (!hs.paused && hs.visible) {
          const vp = hs.viewport;
          const maxScroll = vp.scrollWidth - vp.clientWidth;
          if (maxScroll > 20) {
            vp.scrollLeft += hs.dir * 0.44 * speedScale;
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

    return { spawnBurst, spawnLantern, spawnRocket, spawnRipple, setTempo, setAtmosphere };
  })();

  // ------------------------------------------------------------------------
  // 3. 双曲平滑交叉淡入淡出音乐引擎（不显示作者）
  // ------------------------------------------------------------------------
  const MusicEngine = (() => {
    const deckA = $("#bgmDeckA");
    const deckB = $("#bgmDeckB");
    const dock = $("#musicDock");
    const titleEl = $("#musicTitle");
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
    const DUCKED_VOL = 0.06;
    let isDucked = false;

    function getTargetVol() {
      return isDucked ? DUCKED_VOL : TARGET_VOL;
    }

    function duck(enable) {
      if (isDucked === enable) return;
      isDucked = enable;
      if (!isPlaying) return;
      fadeVolume(activeDeck, activeDeck.volume, getTargetVol(), enable ? 420 : 750);
    }

    function applyTrackRhythm(track) {
      currentSlideMs = track.slideMs || 3400;
      document.documentElement.style.setProperty("--beat-sec", `${track.beatSec}s`);
      document.documentElement.style.setProperty("--slide-ms", `${currentSlideMs}ms`);
      document.body.dataset.mood = track.motionMood || "folk";
      AmbientFX.setTempo(track.bpm || 90);
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
          <span class="mp-item-name">${i === currentIdx && isPlaying ? "♫ " : ""}${tr.shortTitle}</span>
          <span class="mp-item-range">${tr.chapterRange}</span>
        `;
        btn.addEventListener("click", () => {
          autoSwitch = false;
          autoBtn.classList.remove("active");
          selectTrack(i, true, `♫ ${tr.shortTitle}`);
        });
        trackListEl.appendChild(btn);
      });
    }

    function updateUI() {
      const tr = DATA.tracks[currentIdx];
      titleEl.textContent = tr.shortTitle;
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

    function startCurrent(silentToast = false, restartFromZero = false) {
      const tr = DATA.tracks[currentIdx];
      if (!activeDeck.src || !activeDeck.src.endsWith(tr.src)) {
        activeDeck.src = tr.src;
      }
      if (restartFromZero) {
        try { activeDeck.currentTime = 0; } catch (_) {}
      }
      activeDeck.volume = 0.02;
      const p = activeDeck.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          unlocked = true;
          isPlaying = true;
          updateUI();
          fadeVolume(activeDeck, 0.02, getTargetVol(), 1200);
          if (!silentToast) showToast(`♫ ${tr.shortTitle}`);
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
          fadeVolume(nextDeck, 0.01, getTargetVol(), 1350);
          fadeVolume(oldDeck, oldDeck.volume || getTargetVol(), 0, 1150, () => oldDeck.pause());
          showToast(toastMsg || `♫ ${tr.shortTitle}`);
        }).catch(() => { isPlaying = false; updateUI(); });
      }
    }

    toggleBtn.addEventListener("click", () => { if (isPlaying) pauseAll(); else startCurrent(); });
    nextBtn.addEventListener("click", () => {
      autoSwitch = false;
      autoBtn.classList.remove("active");
      const next = (currentIdx + 1) % DATA.tracks.length;
      const tr = DATA.tracks[next];
      selectTrack(next, true, `♫ ${tr.shortTitle}`);
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
      playFromGesture(restartFirst = false) {
        if (restartFirst) {
          autoSwitch = true;
          autoBtn.classList.add("active");
          if (currentIdx !== 0) {
            selectTrack(0, true);
          } else {
            startCurrent(true, true);
          }
        } else {
          startCurrent(true, false);
        }
      },
      ensureTrack(idx) {
        if (!autoSwitch || !isPlaying || !unlocked) return;
        if (typeof idx === "number" && idx !== currentIdx) {
          selectTrack(idx, false);
        }
      },
      onSectionVisible(sectionId) {
        if (!autoSwitch || !isPlaying || !unlocked) return;
        const targetIdx = DATA.sectionTrackMap[sectionId];
        if (typeof targetIdx === "number" && targetIdx !== currentIdx) {
          selectTrack(targetIdx, false);
        }
      },
      duck,
      showToast
    };
  })();

  // ------------------------------------------------------------------------
  // 4. 顶部滚动日期与海拔 HUD + 自动放映引擎
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
    const autoNextBtn = $("#btnAutoNext");
    const autoIcon = $("#autoPlayIcon");
    const autoLabel = $("#autoPlayLabel");
    const dwellFill = $("#hudDwellFill");
    const sceneSweep = $("#sceneSweep");

    let curDate = "10.29";
    let curElev = 3480;
    let elevAnim = null;

    DATA.chapters.forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "drawer-item";
      btn.dataset.target = ch.id;
      btn.innerHTML = `<span class="drawer-date">${ch.shortDate}</span><span class="drawer-place">${ch.shortPlace}</span>`;
      btn.addEventListener("click", () => {
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
        stopAutoFilm(true);
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
      document.documentElement.style.setProperty("--scene-bg", ch.bgColor);
      document.documentElement.style.setProperty("--scene-tint", ch.surfaceTint);
      document.documentElement.style.setProperty("--scene-accent", ch.accent);
      if (ch.atmosphere) AmbientFX.setAtmosphere(ch.atmosphere);

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

    // ----------------------------------------------------------------------
    // 逐幕阅读时间 + 两首歌完整时长自动放映编排引擎
    // ----------------------------------------------------------------------
    function calcReadingSec(text) {
      const len = String(text || "").replace(/\s+/g, "").length;
      return 5.0 + len * 0.17;
    }

    function buildAutoPlan() {
      const steps = [
        { id: "birthday", trackIdx: 0, rawSec: 18, minSec: 15, block: "start", label: "生日寄语" },
        { id: "route",    trackIdx: 0, rawSec: 11, minSec: 9,  block: "start", label: "行程轨迹" }
      ];

      DATA.chapters.forEach((ch) => {
        const trackIdx = DATA.sectionTrackMap[ch.id] ?? 0;
        ch.entries.forEach((en, idx) => {
          const readSec = calcReadingSec(en.caption);
          let mediaSec = 10;
          if (en.mode === "reel") {
            mediaSec = (en.photos ? en.photos.length : 6) * 3.1;
          } else if (en.mode === "handscroll") {
            mediaSec = 24;
          } else if (en.mode === "deck") {
            mediaSec = 20;
          } else if (en.mode === "video" && en.video) {
            mediaSec = Math.min(34, Math.max(14, (en.video.duration || 20) * 0.52));
          }
          // 确保阅读时间与画面欣赏时间充分叠加，不匆忙切幕
          const rawSec = Math.max(readSec + 7.5, mediaSec * 0.72 + readSec * 0.65);
          steps.push({
            id: `entry-${ch.id}-${idx}`,
            chapterId: ch.id,
            trackIdx,
            rawSec,
            minSec: Math.max(12, Math.round(readSec + 4)),
            block: idx === 0 ? "start" : "center",
            label: `${ch.shortDate} · ${en.subTitle || ch.shortPlace}`
          });
        });
      });

      steps.push({ id: "finale", trackIdx: 1, rawSec: 18, minSec: 14, block: "start", label: "尾声" });

      // 按两首歌各自真实时长归一化每幕停留时间，使整场放映精确铺满两首歌
      [0, 1].forEach((tIdx) => {
        const group = steps.filter((s) => s.trackIdx === tIdx);
        const targetSec = (DATA.tracks[tIdx] && DATA.tracks[tIdx].durationSec) || 300;
        const rawSum = group.reduce((acc, s) => acc + s.rawSec, 0) || 1;
        group.forEach((s) => {
          const scaled = (s.rawSec / rawSum) * targetSec;
          s.dwellMs = Math.round(Math.max(s.minSec, scaled) * 1000);
        });
        // 二次微调，保证总和紧贴单曲时长
        const curSumMs = group.reduce((acc, s) => acc + s.dwellMs, 0);
        const targetMs = targetSec * 1000;
        if (Math.abs(curSumMs - targetMs) > 2000 && group.length) {
          const ratio = targetMs / curSumMs;
          group.forEach((s) => {
            s.dwellMs = Math.round(Math.max(s.minSec * 1000, s.dwellMs * ratio));
          });
        }
      });

      return steps;
    }

    let autoPlan = null;
    let autoFilmRunning = false;
    let autoTimer = null;
    let seqIdx = 0;

    function triggerSceneSweep() {
      if (!sceneSweep) return;
      sceneSweep.classList.remove("sweeping");
      void sceneSweep.offsetWidth;
      sceneSweep.classList.add("sweeping");
    }

    function animateDwellBar(ms) {
      if (!dwellFill) return;
      dwellFill.style.transition = "none";
      dwellFill.style.width = "0%";
      void dwellFill.offsetWidth;
      dwellFill.style.transition = `width ${ms}ms linear`;
      dwellFill.style.width = "100%";
    }

    function stopAutoFilm(silent = false) {
      if (!autoFilmRunning) return;
      autoFilmRunning = false;
      clearTimeout(autoTimer);
      hud.classList.remove("auto-active");
      autoBtn.classList.remove("active");
      autoIcon.textContent = "▶";
      autoLabel.textContent = "继续放映";
      if (dwellFill) {
        dwellFill.style.transition = "none";
        dwellFill.style.width = "0%";
      }
      if (!silent) MusicEngine.showToast("已切回自由浏览");
    }

    function advanceFilm() {
      if (!autoFilmRunning) return;
      if (!autoPlan) autoPlan = buildAutoPlan();
      if (seqIdx >= autoPlan.length) {
        stopAutoFilm(true);
        MusicEngine.showToast("两首乐章与川西画卷已放映完毕");
        return;
      }

      const step = autoPlan[seqIdx++];
      if (seqIdx > 1) triggerSceneSweep();

      // 精确同步曲目切换（前半程第一首，后半程进入康定无缝切第二首）
      MusicEngine.ensureTrack(step.trackIdx);

      const el = document.getElementById(step.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: step.block || "center" });
      }
      if (step.chapterId) {
        const chObj = DATA.chapters.find((c) => c.id === step.chapterId);
        if (chObj) setChapter(chObj);
      }

      animateDwellBar(step.dwellMs);
      clearTimeout(autoTimer);
      autoTimer = setTimeout(advanceFilm, step.dwellMs);
    }

    function startAutoFilm(fromStart = false) {
      if (!autoPlan) autoPlan = buildAutoPlan();
      MusicEngine.playFromGesture(fromStart);
      autoFilmRunning = true;
      hud.classList.add("auto-active");
      autoBtn.classList.add("active");
      autoIcon.textContent = "❚❚";
      autoLabel.textContent = "放映中";

      if (fromStart) {
        seqIdx = 0;
      } else {
        const curIdx = autoPlan.findIndex((s) => {
          const el = document.getElementById(s.id);
          return el && el.getBoundingClientRect().top >= -140;
        });
        seqIdx = curIdx >= 0 ? curIdx : 0;
      }

      MusicEngine.showToast("♫ 正在为您放映川西记忆");
      clearTimeout(autoTimer);
      advanceFilm();
    }

    autoBtn.addEventListener("click", () => {
      if (autoFilmRunning) stopAutoFilm();
      else startAutoFilm(false);
    });
    if (autoNextBtn) {
      autoNextBtn.addEventListener("click", () => {
        if (autoFilmRunning) advanceFilm();
      });
    }

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
  // 5. 单一「开启画卷」入口（即自动放映）与互动吹蜡烛
  // ------------------------------------------------------------------------
  function initHeroAndCake() {
    $("#btnOpenScroll").addEventListener("click", (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      AmbientFX.spawnBurst(r.left + r.width / 2, r.top + r.height / 2, 40);
      CinemaHUD.startAutoFilm(true);
    });

    const cakeScene = $("#cakeScene");
    const blowBtn = $("#btnBlowCandles");
    const wishRevealed = $("#wishRevealed");
    const giftBtn = $("#btnOpenGift");
    const giftCard = $("#giftCardReveal");
    let blown = false;

    function toggleCandles() {
      blown = !blown;
      cakeScene.classList.toggle("blown", blown);
      if (blown) {
        const rect = cakeScene.getBoundingClientRect();
        AmbientFX.spawnBurst(rect.left + rect.width / 2, rect.top + 55, 56);
        wishRevealed.classList.add("show");
        blowBtn.textContent = "🕯️ 再点亮蜡烛";
        blowBtn.classList.remove("pulse-cta");
      } else {
        wishRevealed.classList.remove("show");
        if (giftCard) { giftCard.classList.remove("open"); giftCard.setAttribute("aria-hidden", "true"); }
        if (giftBtn) giftBtn.style.display = "";
        blowBtn.textContent = "🕯️ 吹灭蜡烛，许个愿";
        blowBtn.classList.add("pulse-cta");
      }
    }

    if (giftBtn && giftCard) {
      giftBtn.addEventListener("click", (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        AmbientFX.spawnBurst(r.left + r.width / 2, r.top + r.height / 2, 54);
        giftCard.classList.add("open");
        giftCard.setAttribute("aria-hidden", "false");
        giftBtn.style.display = "none";
      });
    }

    cakeScene.addEventListener("click", toggleCandles);
    cakeScene.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCandles(); }
    });
    blowBtn.addEventListener("click", toggleCandles);

    // 轻触任意按钮时在指尖绽放柔和金色光环
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, .route-node, .cake-scene")) {
        AmbientFX.spawnRipple(e.clientX, e.clientY);
      }
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 6. 海拔路线 SVG
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
  // 7. 心动瞬间收藏 + 各站专属互动彩蛋 + 融图影院组件
  // ------------------------------------------------------------------------
  const Favorites = (() => {
    const KEY = "mom_sichuan_favs_2026";
    let set = new Set();
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) set = new Set(raw);
    } catch (_) {}

    function save() {
      try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch (_) {}
      updateSummary();
    }

    function updateSummary() {
      const el = $("#favSummary");
      if (!el) return;
      el.textContent = set.size > 0 ? `❤️ 已收藏 ${set.size} 个心动瞬间` : "";
    }

    return {
      has: (k) => set.has(k),
      toggle(k) {
        if (set.has(k)) set.delete(k);
        else set.add(k);
        save();
        return set.has(k);
      },
      updateSummary
    };
  })();

  function spawnTokens(btn, tokens, count = 4) {
    const r = btn.getBoundingClientRect();
    for (let k = 0; k < count; k++) {
      const el = document.createElement("span");
      el.className = "flying-token";
      el.textContent = tokens[k % tokens.length];
      el.style.left = `${r.left + r.width / 2}px`;
      el.style.top = `${r.top}px`;
      el.style.setProperty("--dx", `${(Math.random() - 0.5) * 240}px`);
      el.style.setProperty("--dy", `${-110 - Math.random() * 140}px`);
      el.style.setProperty("--rot", `${(Math.random() - 0.5) * 260}deg`);
      el.style.setProperty("--rot2", `${(Math.random() - 0.5) * 420}deg`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  function spawnWindHorses(btn) {
    const colors = ["#3A86D9", "#F7F5EE", "#DC4A3D", "#3CA66B", "#F2BD42"];
    const r = btn.getBoundingClientRect();
    for (let k = 0; k < 14; k++) {
      const fl = document.createElement("span");
      fl.className = "wind-horse-flag";
      fl.style.background = colors[k % colors.length];
      fl.style.left = `${r.left + r.width / 2}px`;
      fl.style.top = `${r.top}px`;
      fl.style.setProperty("--dx", `${(Math.random() - 0.5) * 320}px`);
      fl.style.setProperty("--dy", `${-120 - Math.random() * 180}px`);
      fl.style.setProperty("--rot", `${(Math.random() - 0.5) * 320}deg`);
      fl.style.setProperty("--rot2", `${(Math.random() - 0.5) * 600}deg`);
      document.body.appendChild(fl);
      setTimeout(() => fl.remove(), 1750);
    }
  }

  function buildInteractRow(momentKey, specialType, extraCtx = {}) {
    const row = document.createElement("div");
    row.className = "story-interact-row";

    // 1) 每站专属定制趣味互动（显眼呼吸光环）
    if (specialType === "marmot-cracker") {
      let count = 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-special-interact pulse-cta";
      btn.id = "btnFeedCracker";
      btn.textContent = "🍘 投喂雪饼";
      btn.addEventListener("click", () => {
        count++;
        spawnTokens(btn, ["🍘", "✨", "🍘", "💛"], 4);
        btn.classList.remove("pulse-cta");
        btn.textContent = count === 1 ? "🍘 已给 1 片 · 停手啦！"
          : count < 4 ? `🍘 已投喂 ${count} 片雪饼`
          : `🍘 吃撑啦（共 ${count} 片）`;
      });
      row.appendChild(btn);
    } else if (specialType === "yading-cheer") {
      let count = 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-special-interact pulse-cta";
      btn.textContent = "🏆 为零吸氧登顶鼓掌";
      btn.addEventListener("click", () => {
        count++;
        const r = btn.getBoundingClientRect();
        AmbientFX.spawnBurst(r.left + r.width / 2, r.top, 36);
        spawnTokens(btn, ["👏", "🏔️", "✨", "👍"], 5);
        btn.classList.remove("pulse-cta");
        btn.textContent = `👏 太厉害了！已鼓掌 ${count} 次`;
      });
      row.appendChild(btn);
    } else if (specialType === "wind-horse") {
      let count = 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-special-interact pulse-cta";
      btn.textContent = "🪁 撒一把祝福风马";
      btn.addEventListener("click", () => {
        count++;
        spawnWindHorses(btn);
        btn.classList.remove("pulse-cta");
        btn.textContent = count === 1 ? "🪁 风马已随风起 · 岁岁平安" : `🪁 已撒 ${count} 把祝福风马`;
        MusicEngine.showToast("风马随风飞向雪山，祝老妈平安顺遂");
      });
      row.appendChild(btn);
    } else if (specialType === "pour-tea") {
      let count = 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-special-interact pulse-cta";
      btn.textContent = "🍵 添一盏盖碗清茶";
      btn.addEventListener("click", () => {
        count++;
        spawnTokens(btn, ["🍵", "♨️", "✨", "🏮"], 4);
        btn.classList.remove("pulse-cta");
        btn.textContent = `🍵 已续茶 ${count} 盏 · 慢慢摆龙门阵`;
      });
      row.appendChild(btn);
    } else if (specialType === "waterfall-sound" && typeof extraCtx.toggleSound === "function") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-special-interact pulse-cta";
      btn.textContent = "♨️ 听听峡谷瀑布原声";
      btn.addEventListener("click", () => {
        const nowUnmuted = extraCtx.toggleSound();
        btn.classList.remove("pulse-cta");
        btn.textContent = nowUnmuted ? "🔊 正在聆听温泉瀑布声" : "♨️ 听听峡谷瀑布原声";
      });
      extraCtx.onMuteSync = (isMuted) => {
        btn.textContent = isMuted ? "♨️ 听听峡谷瀑布原声" : "🔊 正在聆听温泉瀑布声";
      };
      row.appendChild(btn);
    } else if (specialType === "wish-rocket") {
      let count = 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-special-interact pulse-cta";
      btn.textContent = "🚀 补一场西昌星空火箭";
      btn.addEventListener("click", () => {
        count++;
        const r = btn.getBoundingClientRect();
        AmbientFX.spawnRocket(r.left + r.width / 2);
        setTimeout(() => AmbientFX.spawnRocket(window.innerWidth * 0.65), 260);
        btn.classList.remove("pulse-cta");
        btn.textContent = count === 1 ? "🚀 星空火箭已升空 ✨" : `🚀 已放飞 ${count} 场星空火箭`;
        MusicEngine.showToast("这枚西昌星空火箭，先提前送给老妈 ✨");
      });
      row.appendChild(btn);
    }

    // 2) 每站都有「收藏这一刻」心动按钮
    const heartBtn = document.createElement("button");
    heartBtn.type = "button";
    const initLoved = Favorites.has(momentKey);
    heartBtn.className = "btn-heart-moment" + (initLoved ? " loved" : "");
    heartBtn.textContent = initLoved ? "❤️ 已收藏这一刻" : "🤍 收藏这一刻";
    heartBtn.addEventListener("click", () => {
      const loved = Favorites.toggle(momentKey);
      heartBtn.classList.toggle("loved", loved);
      heartBtn.textContent = loved ? "❤️ 已收藏这一刻" : "🤍 收藏这一刻";
      if (loved) {
        spawnTokens(heartBtn, ["❤️", "✨", "💛"], 4);
      }
    });
    row.appendChild(heartBtn);

    return row;
  }

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
    const cuts = entry.cuts || ["curtain", "blur-zoom", "wipe-right", "flash-dissolve", "wipe-diag", "iris"];
    const enterCut = ch.enterCut || "curtain";

    const wrap = document.createElement("div");
    wrap.className = "cinema-layout" + (reverse ? " reverse" : "");

    const stageCol = document.createElement("div");
    stageCol.className = `cinema-stage-col cut-reveal cut-${enterCut}`;

    const shell = document.createElement("div");
    shell.className = "reel-stage-shell";

    // 动态随图流溢的环境光晕
    const aura = document.createElement("div");
    aura.className = "stage-aura";
    aura.style.backgroundImage = `url("${photos[0].thumb}")`;
    shell.appendChild(aura);

    const frame = document.createElement("div");
    frame.className = "reel-frame";

    const slidesBox = document.createElement("div");
    slidesBox.className = "reel-slides";

    const slideEls = photos.map((ph, i) => {
      const s = document.createElement("div");
      s.className = `reel-slide orient-${ph.orient}${i === 0 ? " active" : ""}`;
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

    // 柔和暗角溶色罩 + 胶片暖光闪白层 + 扫光漏光层
    const vignette = document.createElement("div");
    vignette.className = "reel-vignette-blend";
    const flashLayer = document.createElement("div");
    flashLayer.className = "reel-flash-layer";
    const streakLayer = document.createElement("div");
    streakLayer.className = "reel-light-streak";
    const sidePrev = mkBtn("reel-side-arrow prev", "‹", "上一张照片");
    const sideNext = mkBtn("reel-side-arrow next", "›", "下一张照片");
    frame.append(vignette, flashLayer, streakLayer, sidePrev, sideNext);

    const hud = document.createElement("div");
    hud.className = "reel-hud";
    const capRow = document.createElement("div");
    capRow.className = "reel-caption-row";
    const altEl = document.createElement("span");
    altEl.className = "reel-shot-alt";
    altEl.textContent = photos[0].alt;

    const ctrls = document.createElement("div");
    ctrls.className = "reel-controls";
    const btnPrev = mkBtn("reel-btn", "‹", "上一张");
    const btnPause = mkBtn("reel-btn", "❚❚", "暂停或继续");
    const btnNext = mkBtn("reel-btn", "›", "下一张");
    const btnZoom = mkBtn("reel-btn", "⤢", "全屏看大图");
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
    shell.appendChild(frame);
    stageCol.appendChild(shell);

    // 折叠照片全览条（去掉技术化词汇）
    const stripBtn = document.createElement("button");
    stripBtn.type = "button";
    stripBtn.className = "reel-filmstrip-toggle";
    stripBtn.textContent = `查看这一天全部 ${photos.length} 张照片 ▾`;

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
      stripBtn.textContent = open ? "收起照片 ▴" : `查看这一天全部 ${photos.length} 张照片 ▾`;
    });

    stageCol.append(stripBtn, strip);

    const storyCol = document.createElement("div");
    storyCol.className = "cinema-story-col cut-reveal cut-blur-zoom";
    const hasClock = entry.time && entry.time.includes(":");
    const metaTime = hasClock ? `${ch.date} ${entry.time}` : ch.date;
    storyCol.innerHTML = `
      ${ch.badge ? `<span class="story-badge">⛰ ${ch.badge}</span>` : ""}
      ${entry.subTitle ? `<div class="story-sublabel">${entry.subTitle}</div>` : ""}
      <p class="mom-quote">${formatQuoteLines(entry.caption)}</p>
      <div class="mom-quote-meta">${metaTime}</div>
    `;
    const reelSpecial = (ch.special === "yading-cheer" || ch.special === "wind-horse")
      ? ch.special
      : (ch.special === "wish-rocket" && entry.subTitle && entry.subTitle.includes("邛海") ? "wish-rocket" : null);
    storyCol.appendChild(buildInteractRow(`${ch.id}-${entry.subTitle || "reel"}`, reelSpecial));

    wrap.append(stageCol, storyCol);

    const ALL_CUT_CLASSES = [
      "anim-curtain", "anim-wipe-right", "anim-wipe-diag",
      "anim-iris", "anim-blur-zoom", "anim-flash-dissolve",
      "anim-prism-bloom", "anim-tilt-push"
    ];

    let idx = 0;
    let cutStep = 0;
    let paused = false;
    let visible = false;
    let timer = null;

    function goTo(newIdx) {
      const nextIdx = (newIdx + photos.length) % photos.length;
      if (nextIdx === idx) return;
      const prevIdx = idx;
      idx = nextIdx;
      const cutName = cuts[cutStep % cuts.length];
      cutStep++;

      // 更新外围融图环境光晕
      aura.style.backgroundImage = `url("${photos[idx].thumb}")`;

      // 触发胶片闪白或漏光扫边特效
      if (cutName === "flash-dissolve" || cutName === "blur-zoom" || cutName === "prism-bloom") {
        flashLayer.classList.remove("firing");
        void flashLayer.offsetWidth;
        flashLayer.classList.add("firing");
      } else if (cutName === "wipe-right" || cutName === "wipe-diag" || cutName === "tilt-push") {
        streakLayer.classList.remove("sweeping");
        void streakLayer.offsetWidth;
        streakLayer.classList.add("sweeping");
      }

      slideEls.forEach((s, i) => {
        s.classList.remove("prev", "active", ...ALL_CUT_CLASSES);
        if (i === prevIdx) s.classList.add("prev");
        if (i === idx) {
          const img = s.querySelector(".reel-main-img");
          if (img) { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; }
          void s.offsetWidth;
          s.classList.add("active", `anim-${cutName}`);
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

    sidePrev.addEventListener("click", (e) => { e.stopPropagation(); goTo(idx - 1); });
    sideNext.addEventListener("click", (e) => { e.stopPropagation(); goTo(idx + 1); });
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
    head.className = "handscroll-header cut-reveal cut-blur-zoom";
    const hasClock = entry.time && entry.time.includes(":");
    head.innerHTML = `
      <p class="mom-quote">${formatQuoteLines(entry.caption)}</p>
      <div class="mom-quote-meta">${hasClock ? `${ch.date} ${entry.time}` : ch.date}</div>
    `;
    head.appendChild(buildInteractRow(`${ch.id}-scroll`, null));
    wrap.appendChild(head);

    const vp = document.createElement("div");
    vp.className = "handscroll-viewport cut-reveal cut-wipe-right";
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
    label.textContent = "← 左右滑动，点击图片可放大 →";
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
    stageCol.className = "cinema-stage-col cut-reveal cut-iris";

    const shell = document.createElement("div");
    shell.className = "deck-stage-shell";

    const aura = document.createElement("div");
    aura.className = "stage-aura";
    aura.style.backgroundImage = `url("${photos[0].thumb}")`;
    shell.appendChild(aura);

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

    shell.appendChild(deck);

    let topIdx = 0;
    let visible = false;
    let timer = null;

    function layoutCards() {
      aura.style.backgroundImage = `url("${photos[topIdx].thumb}")`;
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
    stageCol.append(shell, ctrls);

    const storyCol = document.createElement("div");
    storyCol.className = "cinema-story-col cut-reveal cut-blur-zoom";
    storyCol.innerHTML = `
      <p class="mom-quote">${formatQuoteLines(entry.caption)}</p>
      <div class="mom-quote-meta">${ch.date} ${entry.time || ""}</div>
    `;
    storyCol.appendChild(buildInteractRow(`${ch.id}-deck`, ch.special === "pour-tea" ? "pour-tea" : null));

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

  function formatDur(sec) {
    const s = Math.max(0, Math.round(Number(sec) || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }

  function createCinemaVideo(ch, entry, reverse) {
    const vid = entry.video;
    const enterCut = ch.enterCut || "curtain";
    const isPortrait = vid.orient === "P";

    const wrap = document.createElement("div");
    wrap.className = "cinema-layout" + (isPortrait ? " is-portrait-video" : "") + (reverse ? " reverse" : "");

    const stageCol = document.createElement("div");
    stageCol.className = `cinema-stage-col cut-reveal cut-${enterCut}`;

    const shell = document.createElement("div");
    shell.className = `video-stage-shell orient-${vid.orient}`;

    // 环境融图光晕
    const aura = document.createElement("div");
    aura.className = "stage-aura";
    aura.style.backgroundImage = `url("${vid.poster}")`;
    shell.appendChild(aura);

    const frame = document.createElement("div");
    frame.className = `video-frame orient-${vid.orient} paused`;
    if (vid.w && vid.h) {
      frame.style.aspectRatio = `${vid.w} / ${vid.h}`;
    }

    const videoEl = document.createElement("video");
    videoEl.className = "cinema-video-el";
    videoEl.src = vid.src;
    videoEl.poster = vid.poster;
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.loop = true;
    videoEl.playsInline = true;
    videoEl.preload = "metadata";
    videoEl.setAttribute("playsinline", "");
    videoEl.setAttribute("webkit-playsinline", "");
    videoEl.setAttribute("x5-playsinline", "");
    videoEl.setAttribute("x5-video-player-type", "h5");
    frame.appendChild(videoEl);

    const vignette = document.createElement("div");
    vignette.className = "reel-vignette-blend";
    frame.appendChild(vignette);

    const totalStr = formatDur(vid.duration);
    const badge = document.createElement("div");
    badge.className = "video-top-badge";
    badge.innerHTML = `<span class="video-live-dot"></span><span class="video-time-txt">${totalStr}</span>`;
    const timeTxt = badge.querySelector(".video-time-txt");
    frame.appendChild(badge);

    const centerPlay = document.createElement("div");
    centerPlay.className = "video-center-play";
    centerPlay.setAttribute("aria-hidden", "true");
    centerPlay.textContent = "▶";
    frame.appendChild(centerPlay);

    const hud = document.createElement("div");
    hud.className = "video-hud";

    const hudRow = document.createElement("div");
    hudRow.className = "video-hud-row";
    const shotLabel = document.createElement("span");
    shotLabel.className = "video-shot-label";
    shotLabel.textContent = vid.label || ch.location;

    const ctrls = document.createElement("div");
    ctrls.className = "video-controls";

    const btnPlay = mkBtn("reel-btn", "▶", "播放或暂停视频");
    const btnSound = document.createElement("button");
    btnSound.type = "button";
    btnSound.className = "video-sound-btn";
    btnSound.setAttribute("aria-label", "开启或关闭视频原声");
    btnSound.textContent = "🔇 开启原声";

    const btnFs = mkBtn("reel-btn", "⤢", "全屏播放视频");
    ctrls.append(btnPlay, btnSound, btnFs);
    hudRow.append(shotLabel, ctrls);

    const scrub = document.createElement("div");
    scrub.className = "video-scrub";
    scrub.innerHTML = `<div class="video-scrub-track"><div class="video-scrub-fill"></div></div>`;
    const scrubFill = scrub.querySelector(".video-scrub-fill");

    hud.append(hudRow, scrub);
    frame.appendChild(hud);
    shell.appendChild(frame);
    stageCol.appendChild(shell);

    const storyCol = document.createElement("div");
    storyCol.className = "cinema-story-col cut-reveal cut-blur-zoom";
    const hasClock = entry.time && entry.time.includes(":");
    const metaTime = hasClock ? `${ch.date} ${entry.time}` : ch.date;
    storyCol.innerHTML = `
      ${entry.subTitle ? `<div class="story-sublabel">${entry.subTitle}</div>` : ""}
      <p class="mom-quote">${formatQuoteLines(entry.caption)}</p>
      <div class="mom-quote-meta">${metaTime}</div>
    `;

    const extraCtx = {
      toggleSound() {
        setMutedState(!videoEl.muted, false);
        return !videoEl.muted;
      }
    };
    const vidSpecial = (ch.special === "marmot-cracker" || ch.special === "waterfall-sound") ? ch.special : null;
    storyCol.appendChild(buildInteractRow(`${ch.id}-${entry.subTitle || "vid"}`, vidSpecial, extraCtx));

    wrap.append(stageCol, storyCol);

    let userPaused = false;
    let visible = false;

    function syncPlayState() {
      const playing = !videoEl.paused && !videoEl.ended;
      frame.classList.toggle("paused", !playing);
      btnPlay.textContent = playing ? "❚❚" : "▶";
    }

    function setMutedState(muted, silentToast = false) {
      videoEl.muted = muted;
      btnSound.classList.toggle("unmuted", !muted);
      btnSound.textContent = muted ? "🔇 开启原声" : "🔊 原声中";
      if (typeof extraCtx.onMuteSync === "function") extraCtx.onMuteSync(muted);
      if (!muted) {
        if (unmutedVideoCtrl && unmutedVideoCtrl !== ctrl) {
          unmutedVideoCtrl.muteSilently();
        }
        unmutedVideoCtrl = ctrl;
        MusicEngine.duck(true);
        CinemaHUD.stopAutoFilm(true);
        if (videoEl.paused) {
          userPaused = false;
          videoEl.play().catch(() => {});
        }
        if (!silentToast) MusicEngine.showToast("已开启视频原声 · 配乐已自动轻柔淡出");
      } else {
        if (unmutedVideoCtrl === ctrl) {
          unmutedVideoCtrl = null;
          MusicEngine.duck(false);
        }
        if (!silentToast) MusicEngine.showToast("已切回相册配乐");
      }
    }

    const ctrl = {
      el: frame,
      muteSilently() { setMutedState(true, true); },
      setVisible(v) {
        visible = v;
        if (v) {
          if (!userPaused) {
            const p = videoEl.play();
            if (p && typeof p.catch === "function") p.catch(() => syncPlayState());
          }
        } else {
          if (!videoEl.muted) setMutedState(true, true);
          videoEl.pause();
          syncPlayState();
        }
      }
    };

    function togglePlay() {
      if (videoEl.paused) {
        userPaused = false;
        videoEl.play().then(syncPlayState).catch(syncPlayState);
      } else {
        userPaused = true;
        videoEl.pause();
        syncPlayState();
      }
    }

    videoEl.addEventListener("play", syncPlayState);
    videoEl.addEventListener("pause", syncPlayState);
    videoEl.addEventListener("timeupdate", () => {
      const dur = videoEl.duration || vid.duration || 1;
      const pct = Math.min(100, (videoEl.currentTime / dur) * 100);
      scrubFill.style.width = `${pct}%`;
      timeTxt.textContent = `${formatDur(videoEl.currentTime)} / ${formatDur(dur)}`;
    });

    frame.addEventListener("click", (e) => {
      if (e.target.closest(".video-hud")) return;
      togglePlay();
    });
    btnPlay.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });
    btnSound.addEventListener("click", (e) => {
      e.stopPropagation();
      setMutedState(!videoEl.muted, false);
    });
    btnFs.addEventListener("click", (e) => {
      e.stopPropagation();
      if (videoEl.requestFullscreen) videoEl.requestFullscreen().catch(() => {});
      else if (videoEl.webkitEnterFullscreen) videoEl.webkitEnterFullscreen();
    });
    scrub.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = scrub.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const dur = videoEl.duration || vid.duration || 0;
      if (dur > 0) videoEl.currentTime = dur * ratio;
    });

    activeVideos.push(ctrl);
    return wrap;
  }

  function createSpotlight(ch, entry) {
    const photos = registerPhotos(ch, entry);
    const ph = photos[0];
    const wrap = document.createElement("div");
    wrap.className = `spotlight-wrap cut-reveal cut-${ch.enterCut || "iris"}`;

    const aura = document.createElement("div");
    aura.className = "stage-aura";
    aura.style.backgroundImage = `url("${ph.thumb}")`;
    wrap.appendChild(aura);

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

  function formatQuoteLines(str) {
    return String(str || "")
      .split("\n")
      .map((line, i) => `<span class="quote-line" style="--li:${i}">${escapeHtml(line)}</span>`)
      .join("");
  }

  // ------------------------------------------------------------------------
  // 8. 渲染全部连续画卷章节
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

      const bridge = document.createElement("div");
      bridge.className = "date-bridge cut-reveal cut-curtain";
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
          card.className = `intertitle-card cut-reveal cut-${ch.enterCut || "blur-zoom"}`;
          card.innerHTML = `
            ${en.placeTag ? `<div class="intertitle-tag">${en.placeTag}</div>` : ""}
            <p class="mom-quote">${escapeHtml(en.caption)}</p>
            <div class="mom-quote-meta">${ch.date} ${en.time || ""}</div>
          `;
          grid.appendChild(card);
        });
        container.appendChild(grid);
      } else {
        let stageCount = 0;
        ch.entries.forEach((en, entryIdx) => {
          let node = null;
          if (en.mode === "note") {
            node = document.createElement("article");
            node.className = "chapter-prelude-note cut-reveal cut-blur-zoom";
            node.innerHTML = `
              <p class="mom-quote">${formatQuoteLines(en.caption)}</p>
              <div class="mom-quote-meta">${ch.date} ${en.time || ""}</div>
            `;
          } else if (en.mode === "video") {
            const reverse = ch.presentation === "reel-reverse"
              ? (stageCount % 2 === 0)
              : (stageCount % 2 === 1);
            node = createCinemaVideo(ch, en, reverse);
            if (stageCount > 0) node.classList.add("dual-reel-gap");
            stageCount++;
          } else if (en.mode === "reel") {
            const reverse = ch.presentation === "reel-reverse"
              ? (stageCount % 2 === 0)
              : (stageCount % 2 === 1);
            node = createCinemaReel(ch, en, reverse);
            if (stageCount > 0) node.classList.add("dual-reel-gap");
            stageCount++;
          } else if (en.mode === "handscroll") {
            node = createHandscroll(ch, en);
            if (stageCount > 0) node.classList.add("dual-reel-gap");
            stageCount++;
          } else if (en.mode === "deck") {
            node = createCardDeck(ch, en);
            if (stageCount > 0) node.classList.add("dual-reel-gap");
            stageCount++;
          } else if (en.mode === "spotlight") {
            node = createSpotlight(ch, en);
          }
          if (node) {
            node.id = `entry-${ch.id}-${entryIdx}`;
            node.classList.add("cinema-entry-anchor");
            container.appendChild(node);
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
  // 10. 滚动观察器（监听父级章节，绝不因 clip-path 漏触发显露）
  // ------------------------------------------------------------------------
  function initObservers() {
    const revealParents = [$("#birthday"), $("#route"), ...$$(".chapter-scene"), $("#finale")].filter(Boolean);
    const parentObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          $$(".cut-reveal", en.target).forEach((el, idx) => {
            setTimeout(() => el.classList.add("in-view"), idx * 90);
          });
          parentObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.02, rootMargin: "0px 0px -20px 0px" });
    revealParents.forEach((p) => parentObs.observe(p));

    const cutObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          cutObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.01 });
    $$(".cut-reveal").forEach((el) => cutObs.observe(el));

    const mediaObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const r = activeReels.find((x) => x.el === en.target);
        if (r) r.setVisible(en.isIntersecting);
        const h = activeHandscrolls.find((x) => x.viewport === en.target);
        if (h) h.visible = en.isIntersecting;
        const d = activeDecks.find((x) => x.el === en.target);
        if (d) d.setVisible(en.isIntersecting);
        const v = activeVideos.find((x) => x.el === en.target);
        if (v) v.setVisible(en.isIntersecting);
      });
    }, { threshold: 0.25 });

    activeReels.forEach((r) => mediaObs.observe(r.el));
    activeHandscrolls.forEach((h) => mediaObs.observe(h.viewport));
    activeDecks.forEach((d) => mediaObs.observe(d.el));
    activeVideos.forEach((v) => mediaObs.observe(v.el));

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
          AmbientFX.setAtmosphere("autumn");
        } else {
          CinemaHUD.setVisible(true);
          if (id === "finale") AmbientFX.setAtmosphere("lantern");
        }

        if (chapterMap[id]) {
          CinemaHUD.setChapter(chapterMap[id]);
          routeNodes.forEach((n) => n.classList.toggle("active", n.dataset.target === id));
        }
      });
    }, { threshold: 0.03, rootMargin: "-24% 0px -56% 0px" });

    sections.forEach((s) => secObs.observe(s));

    const bar = $("#scrollProgress");
    const auras = $$(".stage-aura");
    let parallaxTick = false;
    window.addEventListener("scroll", () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
      bar.style.width = `${pct}%`;

      if (!parallaxTick) {
        parallaxTick = true;
        requestAnimationFrame(() => {
          const vh = window.innerHeight || 900;
          for (const a of auras) {
            const rect = a.parentElement.getBoundingClientRect();
            if (rect.bottom < -120 || rect.top > vh + 120) continue;
            const norm = ((rect.top + rect.height * 0.5) / vh - 0.5) * 2;
            const shift = Math.max(-22, Math.min(22, norm * 18));
            a.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
          }
          parallaxTick = false;
        });
      }
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 11. 尾声祈愿灯与重看全卷
  // ------------------------------------------------------------------------
  function initFinale() {
    let count = 0;
    const wishes = ["平安顺心", "岁岁常安", "吃好喝好", "看遍山河", "自在开心", "永远年轻"];
    const counter = $("#lanternCounter");
    Favorites.updateSummary();

    $("#btnLantern").addEventListener("click", () => {
      const w1 = wishes[(count * 2) % wishes.length];
      const w2 = wishes[(count * 2 + 1) % wishes.length];
      count++;
      AmbientFX.spawnLantern(w1);
      setTimeout(() => AmbientFX.spawnLantern(w2), 320);
      counter.textContent = `已放飞 ${count * 2} 盏祈愿天灯 · 祝老妈${w1}`;
    });

    $("#btnReplayFilm").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => CinemaHUD.startAutoFilm(true), 700);
    });
  }

  initHeroSlides();
  buildRouteMap();
  renderChapters();
  initHeroAndCake();
  initFinale();
  initObservers();
})();
