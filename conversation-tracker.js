  const STORAGE_KEY = 'conv_tracker_v2';

  // Muted, dusty palette — watercolor feel
  const GROUP_COLORS = ['#c5a04a','#a0c4b8','#c4a0b8','#b8a898','#a8b8c4','#c8b098','#b8c4a0','#c0a8a0'];

  let dragState = null;
  let _pendingSuggestedTokens = 80;

  const GROUP_TYPES      = { work: '◈', friend: '◇', family: '○', neutral: '·' };
  const GROUP_TYPE_ORDER = ['work', 'friend', 'family', 'neutral'];

  // ── Tarot Major Arcana ────────────────────────────────
  const TAROT_CARDS = [
    { numeral: '0',     name: 'The Fool',          reading: 'Begin without a map. The most alive conversations today come from following curiosity without agenda — walk into the room open, and see who meets you there.' },
    { numeral: 'I',     name: 'The Magician',       reading: 'You hold every tool you need. Your words can transform an ordinary exchange into something that lingers for days. Speak with intention today.' },
    { numeral: 'II',    name: 'The High Priestess', reading: 'What is not said carries as much weight as what is. Listen below the surface today — the real message arrives in pauses, not sentences.' },
    { numeral: 'III',   name: 'The Empress',        reading: 'Nourish freely. Your presence is abundant today — the people around you feel it. Pour into someone who has been quietly depleted.' },
    { numeral: 'IV',    name: 'The Emperor',        reading: 'Hold your ground with warmth. Structure in your relationships is an act of care, not control. Clear boundaries today are a gift to everyone.' },
    { numeral: 'V',     name: 'The Hierophant',     reading: 'A teaching arrives through an unexpected voice. Stay humble enough to learn from someone who shows up without credentials.' },
    { numeral: 'VI',    name: 'The Lovers',         reading: 'Choose connection over comfort. The conversation you have been avoiding holds something precious — the discomfort clears the moment you begin.' },
    { numeral: 'VII',   name: 'The Chariot',        reading: 'Move with purpose. Your energy is directional today — it carries others forward when you lead from a steady, lit place inside yourself.' },
    { numeral: 'VIII',  name: 'Strength',           reading: 'The most powerful thing you can do today is stay soft. Real strength in connection looks like patience, like bearing witness without fixing.' },
    { numeral: 'IX',    name: 'The Hermit',         reading: 'Fewer conversations, deeper ones. Today asks for stillness between exchanges — the lantern you carry only shows one step at a time.' },
    { numeral: 'X',     name: 'Wheel of Fortune',   reading: 'Something shifts. A connection you thought stalled begins to move again. What felt fixed is more fluid than it appeared — allow the turn.' },
    { numeral: 'XI',    name: 'Justice',             reading: 'Speak what is true, even when it asks something of you. Relationships that can hold honesty are the ones worth tending.' },
    { numeral: 'XII',   name: 'The Hanged Man',     reading: 'See through the other\'s eyes first. Suspend what you were about to say and let a different perspective arrive — you will emerge changed.' },
    { numeral: 'XIII',  name: 'Death',              reading: 'Something old in a relationship has run its course. Let it go without ceremony. What remains after this ending is what was always real.' },
    { numeral: 'XIV',   name: 'Temperance',         reading: 'The right measure of yourself today. Not too much, not withheld — a steady pour. Someone needs exactly the version of you that is calibrated, not performing.' },
    { numeral: 'XV',    name: 'The Devil',          reading: 'Notice where you are seeking approval rather than connection. The chain is only as strong as your belief in it — it falls the moment you name it.' },
    { numeral: 'XVI',   name: 'The Tower',          reading: 'Something crumbles to make room. A difficult exchange clears the air for something far more honest to grow in its place.' },
    { numeral: 'XVII',  name: 'The Star',           reading: 'You are a point of light for someone today without knowing it. Show up without pretense — your quiet presence is enough to orient a person who is lost.' },
    { numeral: 'XVIII', name: 'The Moon',           reading: 'Trust what you feel, not only what you see. Someone\'s words and their energy are not the same today. Your intuition knows which to follow.' },
    { numeral: 'XIX',   name: 'The Sun',            reading: 'Let yourself be seen. The warmth you are holding back is exactly what the room is waiting for. Shine without apology.' },
    { numeral: 'XX',    name: 'Judgement',          reading: 'A call is rising — toward depth, toward the real. Answer it today by choosing one true conversation over five convenient ones.' },
    { numeral: 'XXI',   name: 'The World',          reading: 'You arrive whole. There is nothing left to prove in any room today — move through it with the ease of someone who already belongs.' },
  ];

  let _tarotIndex = null; // null = use date seed, set to number = shuffled

  function getDailyTarotIndex() {
    const d = new Date();
    return (d.getFullYear() * 366 + Math.floor((d - new Date(d.getFullYear(),0,0))/86400000)) % TAROT_CARDS.length;
  }

  function initTarotCard() {
    const card = TAROT_CARDS[_tarotIndex !== null ? _tarotIndex : getDailyTarotIndex()];
    const nameEl = document.getElementById('tarot-name');
    const textEl = document.getElementById('tarot-text');
    if (nameEl) nameEl.innerHTML = `<span class="tarot-numeral">${card.numeral}</span>${card.name}`;
    if (textEl) textEl.textContent = card.reading;
  }

  function shuffleTarot() {
    const prev = _tarotIndex !== null ? _tarotIndex : getDailyTarotIndex();
    let next;
    do { next = Math.floor(Math.random() * TAROT_CARDS.length); } while (next === prev);
    _tarotIndex = next;
    initTarotCard();
    const btn = document.getElementById('tarot-shuffle-btn');
    if (btn) {
      btn.classList.remove('spinning');
      void btn.offsetWidth;
      btn.classList.add('spinning');
      btn.addEventListener('transitionend', () => btn.classList.remove('spinning'), { once: true });
    }
  }

  // ── Moon phase ─────────────────────────────────────────
  function getMoonPhaseInfo(date) {
    const JD    = date.getTime() / 86400000 + 2440587.5;
    const phase = ((JD - 2451550.1) % 29.530588853 + 29.530588853) % 29.530588853;
    if (phase < 1.85)  return { name: 'New Moon',        emoji: '🌑', modifier: -15, phase };
    if (phase < 7.38)  return { name: 'Waxing Crescent', emoji: '🌒', modifier:  +5, phase };
    if (phase < 9.22)  return { name: 'First Quarter',   emoji: '🌓', modifier: +10, phase };
    if (phase < 14.77) return { name: 'Waxing Gibbous',  emoji: '🌔', modifier: +15, phase };
    if (phase < 16.61) return { name: 'Full Moon',       emoji: '🌕', modifier: +20, phase };
    if (phase < 22.15) return { name: 'Waning Gibbous',  emoji: '🌖', modifier:  +5, phase };
    if (phase < 24.0)  return { name: 'Last Quarter',    emoji: '🌗', modifier:  -5, phase };
    return                    { name: 'Waning Crescent', emoji: '🌘', modifier: -10, phase };
  }

  // ── Menstrual cycle phase ───────────────────────────────
  function getCyclePhaseInfo(lastPeriodStart, cycleLength) {
    const today = new Date(); today.setHours(0,0,0,0);
    const last  = new Date(lastPeriodStart + 'T00:00:00');
    const cycleDay = (Math.floor((today - last) / 86400000) % cycleLength) + 1;
    if (cycleDay <= 5)  return { name: 'Menstrual phase',  modifier: -20, day: cycleDay };
    if (cycleDay <= 13) return { name: 'Follicular phase', modifier: +15, day: cycleDay };
    if (cycleDay <= 17) return { name: 'Ovulation phase',  modifier: +20, day: cycleDay };
    return                     { name: 'Luteal phase',     modifier: -10, day: cycleDay };
  }

  // ── Token helpers ───────────────────────────────────────
  function getTodayTokens(data) {
    return (data.tokenDays && data.tokenDays[todayStr()]) || null;
  }

  function setTodayTokens(data, current, dailyMax) {
    if (!data.tokenDays) data.tokenDays = {};
    data.tokenDays[todayStr()] = { current, dailyMax };
  }

  function getGroupType(group) { return group.type || 'neutral'; }

  function getPersonCost(name, groupType, data) {
    if (data.personCosts && data.personCosts[name] !== undefined) return data.personCosts[name];
    return { work: 1, friend: -1, family: 0, neutral: 0 }[groupType] ?? 0;
  }

  // ── Candle visual (info widget, not scene) ─────────────
  function updateCandleVisual(data) {
    const td       = getTodayTokens(data);
    const current  = td ? td.current  : null;
    const dailyMax = td ? td.dailyMax : null;
    const pct = (current !== null && dailyMax > 0) ? Math.max(0, Math.min(1, current / dailyMax)) : 0;

    const tokenEl = document.getElementById('candle-tokens');
    if (tokenEl) tokenEl.innerHTML = current !== null
      ? `${current} <span>/ ${dailyMax}</span>`
      : `— <span>tokens</span>`;

    const barEl = document.getElementById('token-bar-fill');
    if (barEl) barEl.style.width = current !== null ? (pct * 100) + '%' : '0%';

    const burned = current !== null && current <= 0;
    const burnoutEl = document.getElementById('candle-burnout');
    if (burnoutEl) burnoutEl.style.display = burned ? 'block' : 'none';

    // Widget candle wax fill
    const widgetFill = document.getElementById('candle-fill');
    if (widgetFill) {
      const maxH = 106, bodyY = 40;
      const fillH = Math.max(0, maxH * pct);
      widgetFill.setAttribute('y', (bodyY + maxH - fillH).toFixed(1));
      widgetFill.setAttribute('height', fillH.toFixed(1));
    }
    const widgetFlame  = document.getElementById('candle-flame');
    const widgetPuddle = document.getElementById('candle-puddle');
    if (widgetFlame)  widgetFlame.style.display  = burned ? 'none' : '';
    if (widgetPuddle) widgetPuddle.style.display = burned ? ''     : 'none';

    updateSceneCandle(pct, burned);
    updateMoonBoatSpeed(pct);
    updateTownLanterns(pct);
  }

  function updateCandlePhase(data) {
    const phaseEl = document.getElementById('candle-phase');
    if (!phaseEl) return;
    const moon = getMoonPhaseInfo(new Date());
    if (!data.cycleData || !data.cycleData.lastPeriodStart) {
      phaseEl.textContent = `${moon.emoji} ${moon.name}`;
      return;
    }
    const cycle = getCyclePhaseInfo(data.cycleData.lastPeriodStart, data.cycleData.cycleLength || 28);
    phaseEl.textContent = `${moon.emoji} ${moon.name} · ${cycle.name}`;
  }

  function triggerFlameAnimation(type) {
    const flameEl = document.getElementById('bg-flame');
    if (!flameEl) return;
    const cleanup = () => flameEl.style.animation = '';
    if (type === 'work') {
      flameEl.style.animation = 'flamePulseBurn 0.45s ease-out';
      flameEl.addEventListener('animationend', cleanup, { once: true });
    } else if (type === 'friend') {
      flameEl.style.animation = 'flamePulseGrow 0.45s cubic-bezier(0.34,1.56,0.64,1)';
      flameEl.addEventListener('animationend', cleanup, { once: true });
    }
  }

  // ── Scene background SVG ────────────────────────────────
  // Built once, updated dynamically via IDs

  const SCENE_W = 400, SCENE_H = 420;
  const TOWN_Y  = 264;  // town silhouette starts here
  const WATER_Y = 344;  // water starts here
  const CANDLE_X = SCENE_W / 2;
  const CANDLE_Y = 200; // candle base (flame goes upward)

  function buildSceneBackground(canvas) {
    // Generate stardust positions deterministically
    const dustDots = [];
    let seed = 42;
    const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    for (let i = 0; i < 160; i++) {
      dustDots.push({
        x: rng() * SCENE_W,
        y: rng() * TOWN_Y * 0.95,
        r: rng() < 0.85 ? rng() * 0.9 + 0.3 : rng() * 1.5 + 0.8,
        o: rng() * 0.45 + 0.12,
        c: rng() < 0.75 ? '#f5ecd8' : rng() < 0.85 ? '#cce0ee' : '#e8d4f8'
      });
    }

    // Lantern positions in town (window-like spots)
    const lanterns = [
      {x:50,y:290,r:2.8},{x:72,y:298,r:2.4},{x:118,y:282,r:2.6},{x:148,y:294,r:2.2},
      {x:175,y:287,r:2.5},{x:228,y:291,r:2.3},{x:262,y:285,r:2.7},{x:292,y:296,r:2.2},
      {x:318,y:290,r:2.4},{x:345,y:286,r:2.6},{x:370,y:298,r:2.3},{x:388,y:292,r:2.1},
    ];

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'scene-bg');
    svg.setAttribute('viewBox', `0 0 ${SCENE_W} ${SCENE_H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    svg.innerHTML = `
      <defs>
        <!-- Hand-painted texture: displaces edges to look organic/brushed -->
        <filter id="paint-tex" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028 0.038" numOctaves="4" seed="7" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <!-- Heavier paint texture for town silhouette -->
        <filter id="paint-heavy" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022 0.032" numOctaves="5" seed="11" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <!-- Soft watercolor glow for candle flame -->
        <filter id="flame-bloom" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="9" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <!-- Moon glow -->
        <filter id="moon-bloom" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="11" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <!-- Soft lantern glow -->
        <filter id="lantern-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="3.5"/>
        </filter>

        <!-- Sky: deep indigo-charcoal radial, painted feel -->
        <radialGradient id="sky-g" cx="50%" cy="38%" r="72%">
          <stop offset="0%"   stop-color="#1c3350"/>
          <stop offset="45%"  stop-color="#0e1e32"/>
          <stop offset="100%" stop-color="#050c18"/>
        </radialGradient>
        <!-- Second sky layer for watercolor depth -->
        <radialGradient id="sky-g2" cx="30%" cy="60%" r="55%">
          <stop offset="0%"   stop-color="#102840" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#102840" stop-opacity="0"/>
        </radialGradient>

        <!-- Candle ambient glow -->
        <radialGradient id="candle-aura-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#f7c14f" stop-opacity="0.18"/>
          <stop offset="55%"  stop-color="#d4822a" stop-opacity="0.07"/>
          <stop offset="100%" stop-color="#d4822a" stop-opacity="0"/>
        </radialGradient>

        <!-- Moon boat gradient (silvery, luminous) -->
        <radialGradient id="moon-g" cx="32%" cy="28%" r="68%">
          <stop offset="0%"   stop-color="#f0f8ff"/>
          <stop offset="45%"  stop-color="#cce0ee"/>
          <stop offset="100%" stop-color="#7aaccb"/>
        </radialGradient>

        <!-- Water gradient -->
        <linearGradient id="water-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#0e2438"/>
          <stop offset="100%" stop-color="#050e1c"/>
        </linearGradient>

        <!-- Milky way / atmospheric streak -->
        <linearGradient id="milky-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#2a4868" stop-opacity="0"/>
          <stop offset="40%"  stop-color="#2a5878" stop-opacity="0.22"/>
          <stop offset="60%"  stop-color="#2a5878" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#1a3858" stop-opacity="0"/>
        </linearGradient>

        <!-- Town fill -->
        <linearGradient id="town-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#0c1d2c"/>
          <stop offset="100%" stop-color="#060f1a"/>
        </linearGradient>

        <!-- Scene clip -->
        <clipPath id="scene-clip"><rect width="${SCENE_W}" height="${SCENE_H}"/></clipPath>
      </defs>

      <g clip-path="url(#scene-clip)">

        <!-- Sky background -->
        <rect width="${SCENE_W}" height="${SCENE_H}" fill="url(#sky-g)"/>
        <rect width="${SCENE_W}" height="${SCENE_H}" fill="url(#sky-g2)"/>

        <!-- Milky way streak (very subtle atmospheric glow) -->
        <ellipse cx="210" cy="110" rx="40" ry="260" fill="url(#milky-g)" opacity="0.6"
                 transform="rotate(-12 210 110)" filter="url(#paint-tex)"/>

        <!-- Star dust -->
        <g id="stardust">
          ${dustDots.map(d => `<circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${d.r.toFixed(2)}" fill="${d.c}" opacity="${d.o.toFixed(2)}"/>`).join('')}
        </g>

        <!-- Slow drifting clouds (very faint) -->
        <g id="cloud-layer" opacity="0.07">
          <ellipse cx="80"  cy="55"  rx="65" ry="18" fill="#cce0ee" filter="url(#paint-tex)"/>
          <ellipse cx="320" cy="88"  rx="55" ry="14" fill="#cce0ee" filter="url(#paint-tex)"/>
          <ellipse cx="160" cy="40"  rx="42" ry="10" fill="#cce0ee" filter="url(#paint-tex)"/>
        </g>

        <!-- Candle ambient glow in sky -->
        <ellipse id="candle-aura" cx="${CANDLE_X}" cy="${CANDLE_Y - 30}" rx="85" ry="68"
                 fill="url(#candle-aura-g)"/>

        <!-- Constellation lines (regulars — filled by JS) -->
        <g id="constellation-layer" stroke="rgba(197,160,74,0.18)" stroke-width="0.8"
           stroke-dasharray="3 5" fill="none" opacity="0.9"></g>

        <!-- Light pools cast by stars on town rooftops -->
        <g id="light-pool-layer" opacity="0.55"></g>

        <!-- Scene candle -->
        <g id="scene-candle-g" transform="translate(${CANDLE_X}, ${CANDLE_Y})">
          <!-- Candle body outer (dark wax) -->
          <rect x="-8" y="0" width="16" height="52" rx="3.5"
                fill="#261404" filter="url(#paint-tex)"/>
          <!-- Candle wax fill (animated) -->
          <rect id="bg-candle-fill" x="-8" y="0" width="16" height="52" rx="3.5"
                fill="#c5a050" opacity="0.78"/>
          <!-- Wax drip left -->
          <path d="M-8,18 Q-10,26 -9,38" stroke="#a88840" stroke-width="2.8" fill="none"
                stroke-linecap="round" opacity="0.32"/>
          <!-- Wax shine -->
          <rect x="-5.5" y="3" width="3.5" height="26" rx="1.8" fill="rgba(255,255,255,0.18)"/>
          <!-- Wick -->
          <path d="M0,-1 Q-0.6,3.5 0,8" stroke="#3d4018" stroke-width="1.6" fill="none"
                stroke-linecap="round"/>
          <!-- Flame group -->
          <g id="bg-flame" style="transform-origin: 0px -4px; animation: flameDance 2.6s ease-in-out infinite;">
            <!-- Outer flame glow -->
            <path d="M0,-4 C-8,-10 -10,-20 -8,-29 C-6,-36 -3,-39 0,-40 C3,-39 6,-36 8,-29 C10,-20 8,-10 0,-4Z"
                  fill="#d4822a" opacity="0.55" filter="url(#flame-bloom)"/>
            <!-- Outer flame body -->
            <path d="M0,-4 C-7,-10 -9,-19 -7,-27 C-5,-33 -2,-36 0,-37 C2,-36 5,-33 7,-27 C9,-19 7,-10 0,-4Z"
                  fill="#d4822a" opacity="0.82"/>
            <!-- Mid flame -->
            <path d="M0,-6 C-4,-11 -5,-18 -4,-24 C-2.5,-29 -1,-31 0,-32 C1,-31 2.5,-29 4,-24 C5,-18 4,-11 0,-6Z"
                  fill="#e8a040"/>
            <!-- Inner bright flame -->
            <path d="M0,-8 C-2.5,-13 -3,-19 -2,-24 C-1,-27 0,-29 0,-28 C0,-29 1,-27 2,-24 C3,-19 2.5,-13 0,-8Z"
                  fill="#f7c14f"/>
            <!-- Flame core highlight -->
            <ellipse cx="0" cy="-22" rx="1.6" ry="2.8" fill="white" opacity="0.65"/>
          </g>
        </g>

        <!-- Ripple layer (appended by JS on tap) -->
        <g id="ripple-layer"></g>

        <!-- Town silhouette — Venice-style irregular skyline -->
        <g id="town-layer">
          <!-- Shadow behind town (atmospheric depth) -->
          <rect x="0" y="${TOWN_Y - 5}" width="${SCENE_W}" height="${SCENE_H - TOWN_Y + 5}"
                fill="#05111e" filter="url(#paint-heavy)"/>
          <!-- Main town path -->
          <path id="town-path" d="
            M0,${SCENE_H}
            L0,${TOWN_Y + 18}
            Q8,${TOWN_Y + 14} 16,${TOWN_Y + 18}
            L18,${TOWN_Y + 8}
            L22,${TOWN_Y + 4}
            L26,${TOWN_Y + 8}
            L28,${TOWN_Y + 18}
            L38,${TOWN_Y + 18}
            L38,${TOWN_Y + 5}
            L46,${TOWN_Y}
            L54,${TOWN_Y + 5}
            L54,${TOWN_Y + 18}
            L64,${TOWN_Y + 18}
            L64,${TOWN_Y - 6}
            L68,${TOWN_Y - 10}
            L72,${TOWN_Y - 6}
            L72,${TOWN_Y + 18}
            L82,${TOWN_Y + 18}
            L82,${TOWN_Y + 6}
            L84,${TOWN_Y + 4}
            L86,${TOWN_Y + 6}
            L86,${TOWN_Y + 18}
            L100,${TOWN_Y + 18}
            L100,${TOWN_Y + 4}
            L108,${TOWN_Y - 2}
            L116,${TOWN_Y + 4}
            L116,${TOWN_Y + 18}
            C126,${TOWN_Y + 4} 136,${TOWN_Y - 16} 146,${TOWN_Y + 4}
            L146,${TOWN_Y + 18}
            L154,${TOWN_Y + 18}
            L154,${TOWN_Y + 2}
            L156,${TOWN_Y}
            L158,${TOWN_Y + 2}
            L158,${TOWN_Y + 18}
            L168,${TOWN_Y + 18}
            L168,${TOWN_Y - 4}
            L172,${TOWN_Y - 8}
            L176,${TOWN_Y - 4}
            L176,${TOWN_Y + 18}
            L188,${TOWN_Y + 18}
            L188,${TOWN_Y + 8}
            L192,${TOWN_Y + 4}
            L196,${TOWN_Y + 8}
            L196,${TOWN_Y + 18}
            L206,${TOWN_Y + 18}
            L206,${TOWN_Y - 6}
            C216,${TOWN_Y - 24} 226,${TOWN_Y - 24} 236,${TOWN_Y - 6}
            L236,${TOWN_Y + 18}
            L244,${TOWN_Y + 18}
            L244,${TOWN_Y + 6}
            L248,${TOWN_Y + 2}
            L252,${TOWN_Y + 6}
            L252,${TOWN_Y + 18}
            L262,${TOWN_Y + 18}
            L262,${TOWN_Y + 4}
            L266,${TOWN_Y}
            L270,${TOWN_Y + 4}
            L270,${TOWN_Y + 18}
            L280,${TOWN_Y + 18}
            L280,${TOWN_Y - 4}
            L284,${TOWN_Y - 8}
            L288,${TOWN_Y - 4}
            L288,${TOWN_Y + 18}
            L300,${TOWN_Y + 18}
            L300,${TOWN_Y + 8}
            Q310,${TOWN_Y + 2} 320,${TOWN_Y + 8}
            L320,${TOWN_Y + 18}
            L330,${TOWN_Y + 18}
            L330,${TOWN_Y + 4}
            L334,${TOWN_Y}
            L338,${TOWN_Y + 4}
            L338,${TOWN_Y + 18}
            L350,${TOWN_Y + 18}
            L350,${TOWN_Y + 6}
            L354,${TOWN_Y + 2}
            L358,${TOWN_Y + 6}
            L358,${TOWN_Y + 18}
            L370,${TOWN_Y + 18}
            L370,${TOWN_Y + 10}
            L374,${TOWN_Y + 6}
            L378,${TOWN_Y + 10}
            L378,${TOWN_Y + 18}
            L${SCENE_W},${TOWN_Y + 18}
            L${SCENE_W},${SCENE_H}
            Z
          " fill="url(#town-g)" filter="url(#paint-heavy)"/>
        </g>

        <!-- Lanterns (warm window glows) -->
        <g id="lantern-layer">
          ${lanterns.map((l,i) => `
            <circle class="lantern" id="lantern-${i}"
                    cx="${l.x}" cy="${l.y}" r="${l.r * 1.8}"
                    fill="#d4822a" opacity="0.0" filter="url(#lantern-glow)"/>
            <circle class="lantern-dot" id="lantern-dot-${i}"
                    cx="${l.x}" cy="${l.y}" r="${l.r}"
                    fill="#f0b060" opacity="0.0"/>
          `).join('')}
        </g>

        <!-- Water -->
        <g id="water-layer">
          <!-- Water base -->
          <rect x="0" y="${WATER_Y}" width="${SCENE_W}" height="${SCENE_H - WATER_Y}"
                fill="url(#water-g)"/>
          <!-- Wave animation: two copies so it tiles seamlessly -->
          <g style="animation: waveScroll 36s linear infinite; will-change: transform;">
            <path d="
              M0,${WATER_Y + 2}
              Q10,${WATER_Y - 2} 20,${WATER_Y + 2}
              Q30,${WATER_Y + 6} 40,${WATER_Y + 2}
              Q50,${WATER_Y - 2} 60,${WATER_Y + 2}
              Q70,${WATER_Y + 5} 80,${WATER_Y + 2}
              Q90,${WATER_Y - 1} 100,${WATER_Y + 2}
              Q110,${WATER_Y + 5} 120,${WATER_Y + 2}
              Q130,${WATER_Y - 2} 140,${WATER_Y + 2}
              Q150,${WATER_Y + 4} 160,${WATER_Y + 2}
              Q170,${WATER_Y - 1} 180,${WATER_Y + 2}
              Q190,${WATER_Y + 5} 200,${WATER_Y + 2}
              Q210,${WATER_Y - 2} 220,${WATER_Y + 2}
              Q230,${WATER_Y + 4} 240,${WATER_Y + 2}
              Q250,${WATER_Y - 1} 260,${WATER_Y + 2}
              Q270,${WATER_Y + 5} 280,${WATER_Y + 2}
              Q290,${WATER_Y - 2} 300,${WATER_Y + 2}
              Q310,${WATER_Y + 4} 320,${WATER_Y + 2}
              Q330,${WATER_Y - 1} 340,${WATER_Y + 2}
              Q350,${WATER_Y + 5} 360,${WATER_Y + 2}
              Q370,${WATER_Y - 2} 380,${WATER_Y + 2}
              Q390,${WATER_Y + 4} 400,${WATER_Y + 2}
              Q410,${WATER_Y - 1} 420,${WATER_Y + 2}
              Q430,${WATER_Y + 5} 440,${WATER_Y + 2}
              Q450,${WATER_Y - 2} 460,${WATER_Y + 2}
              Q470,${WATER_Y + 4} 480,${WATER_Y + 2}
              Q490,${WATER_Y - 1} 500,${WATER_Y + 2}
              Q510,${WATER_Y + 5} 520,${WATER_Y + 2}
              Q530,${WATER_Y - 2} 540,${WATER_Y + 2}
              Q550,${WATER_Y + 4} 560,${WATER_Y + 2}
              Q570,${WATER_Y - 1} 580,${WATER_Y + 2}
              Q590,${WATER_Y + 5} 600,${WATER_Y + 2}
              Q610,${WATER_Y - 2} 620,${WATER_Y + 2}
              Q630,${WATER_Y + 4} 640,${WATER_Y + 2}
              Q650,${WATER_Y - 1} 660,${WATER_Y + 2}
              Q670,${WATER_Y + 5} 680,${WATER_Y + 2}
              Q690,${WATER_Y - 2} 700,${WATER_Y + 2}
              Q710,${WATER_Y + 4} 720,${WATER_Y + 2}
              Q730,${WATER_Y - 1} 740,${WATER_Y + 2}
              Q750,${WATER_Y + 5} 760,${WATER_Y + 2}
              Q770,${WATER_Y - 2} 780,${WATER_Y + 2}
              Q790,${WATER_Y + 4} 800,${WATER_Y + 2}
              L800,${SCENE_H} L0,${SCENE_H} Z
            " fill="#0a1e34" opacity="0.72" filter="url(#paint-tex)"/>
          </g>
          <!-- Second wave layer (offset, slower) -->
          <g style="animation: waveScroll 52s linear infinite reverse; will-change: transform; opacity: 0.38;">
            <path d="
              M0,${WATER_Y + 5}
              Q15,${WATER_Y + 1} 30,${WATER_Y + 5}
              Q45,${WATER_Y + 9} 60,${WATER_Y + 5}
              Q75,${WATER_Y + 1} 90,${WATER_Y + 5}
              Q105,${WATER_Y + 9} 120,${WATER_Y + 5}
              Q135,${WATER_Y + 1} 150,${WATER_Y + 5}
              Q165,${WATER_Y + 9} 180,${WATER_Y + 5}
              Q195,${WATER_Y + 1} 210,${WATER_Y + 5}
              Q225,${WATER_Y + 9} 240,${WATER_Y + 5}
              Q255,${WATER_Y + 1} 270,${WATER_Y + 5}
              Q285,${WATER_Y + 9} 300,${WATER_Y + 5}
              Q315,${WATER_Y + 1} 330,${WATER_Y + 5}
              Q345,${WATER_Y + 9} 360,${WATER_Y + 5}
              Q375,${WATER_Y + 1} 390,${WATER_Y + 5}
              Q405,${WATER_Y + 9} 420,${WATER_Y + 5}
              Q435,${WATER_Y + 1} 450,${WATER_Y + 5}
              Q465,${WATER_Y + 9} 480,${WATER_Y + 5}
              Q495,${WATER_Y + 1} 510,${WATER_Y + 5}
              Q525,${WATER_Y + 9} 540,${WATER_Y + 5}
              Q555,${WATER_Y + 1} 570,${WATER_Y + 5}
              Q585,${WATER_Y + 9} 600,${WATER_Y + 5}
              Q615,${WATER_Y + 1} 630,${WATER_Y + 5}
              Q645,${WATER_Y + 9} 660,${WATER_Y + 5}
              Q675,${WATER_Y + 1} 690,${WATER_Y + 5}
              Q705,${WATER_Y + 9} 720,${WATER_Y + 5}
              Q735,${WATER_Y + 1} 750,${WATER_Y + 5}
              Q765,${WATER_Y + 9} 780,${WATER_Y + 5}
              Q795,${WATER_Y + 1} 800,${WATER_Y + 5}
              L800,${SCENE_H} L0,${SCENE_H} Z
            " fill="#0e2840" opacity="1"/>
          </g>
        </g>

        <!-- Moon boat — crescent moon floating on water -->
        <g id="moon-boat-layer">
          <!-- Outer soft glow (bloom beneath moon on water) -->
          <ellipse id="moon-water-glow"
                   cx="135" cy="${WATER_Y + 14}" rx="38" ry="12"
                   fill="#cce0ee" opacity="0.12" filter="url(#moon-bloom)"/>
          <!-- Moon crescent body with hand-painted filter -->
          <g id="moon-boat-g" filter="url(#paint-tex)">
            <clipPath id="moon-clip">
              <circle cx="130" cy="${WATER_Y + 8}" r="22"/>
            </clipPath>
            <!-- Full circle fill -->
            <circle cx="130" cy="${WATER_Y + 8}" r="22" fill="url(#moon-g)" filter="url(#moon-bloom)"/>
            <!-- Cut to make crescent -->
            <circle cx="140" cy="${WATER_Y + 5}" r="18"
                    fill="#05111e" clip-path="url(#moon-clip)"/>
          </g>
          <!-- Crescent reflection in water (vertical flip, very faint) -->
          <g opacity="0.18" transform="translate(0,0) scale(1,-1) translate(0,-${2*(WATER_Y + 8)})">
            <clipPath id="moon-clip-r">
              <circle cx="130" cy="${WATER_Y + 8}" r="22"/>
            </clipPath>
            <circle cx="130" cy="${WATER_Y + 8}" r="22" fill="url(#moon-g)"/>
            <circle cx="140" cy="${WATER_Y + 5}" r="18"
                    fill="#05111e" clip-path="url(#moon-clip-r)"/>
          </g>
          <!-- Water shimmer from moon -->
          <ellipse cx="135" cy="${WATER_Y + 32}"
                   rx="22" ry="4" fill="#cce0ee" opacity="0.09"/>
        </g>

        <!-- Star light reflections on water surface -->
        <g id="star-water-reflections" opacity="0.3"></g>

      </g>

      <!-- CSS keyframe for wave scroll (inline, since it's in SVG) -->
      <style>
        @keyframes waveScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-400px); }
        }
      </style>
    `;

    canvas.appendChild(svg);

    // Constellation + ripple SVG overlay (above stars)
    const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    overlay.setAttribute('id', 'constellation-svg');
    canvas.appendChild(overlay);
  }

  // Number of lanterns that should be lit for a given token %
  const LANTERN_COUNT = 12;
  let _litLanterns = new Set();

  function updateTownLanterns(pct) {
    const litCount = Math.round(pct * LANTERN_COUNT);
    // Build target set (random but deterministic per percentage step)
    const target = new Set();
    const allIdx = Array.from({length: LANTERN_COUNT}, (_, i) => i);
    // Simple seeded shuffle based on litCount
    const seededOrder = [...allIdx].sort((a, b) => {
      const sa = Math.sin(a * 127.1 + litCount * 13.7);
      const sb = Math.sin(b * 127.1 + litCount * 13.7);
      return sa - sb;
    });
    seededOrder.slice(0, litCount).forEach(i => target.add(i));

    for (let i = 0; i < LANTERN_COUNT; i++) {
      const glow = document.getElementById(`lantern-${i}`);
      const dot  = document.getElementById(`lantern-dot-${i}`);
      const lit  = target.has(i);
      if (glow) glow.setAttribute('opacity', lit ? '0.55' : '0');
      if (dot)  dot.setAttribute('opacity',  lit ? '0.75' : '0');
    }
    _litLanterns = target;
  }

  function updateSceneCandle(pct, burned) {
    const fill = document.getElementById('bg-candle-fill');
    const flame = document.getElementById('bg-flame');
    const aura  = document.getElementById('candle-aura');
    if (fill) {
      const maxH = 52;
      const h = Math.max(0, maxH * pct);
      const y = maxH - h;
      fill.setAttribute('y', y.toFixed(1));
      fill.setAttribute('height', h.toFixed(1));
    }
    if (flame) flame.style.display = burned ? 'none' : '';
    if (aura)  aura.setAttribute('opacity', burned ? '0.12' : '1');
  }

  function updateMoonBoatSpeed(pct) {
    const boat = document.getElementById('moon-boat-g');
    const glow = document.getElementById('moon-water-glow');
    if (!boat) return;
    // More tokens = faster drift; burned out = stationary
    const dur = pct <= 0 ? 'none' : `${Math.round(28 + (1 - pct) * 44)}s`;
    const range = Math.round(pct * 28 + 8);
    const moonX = 135, moonY = WATER_Y + 8;
    const style = pct <= 0
      ? ''
      : `animation: moonBoatDrift ${dur} ease-in-out infinite; --boat-range:${range}px; transform-origin: ${moonX}px ${moonY}px;`;
    boat.setAttribute('style', style);
    if (glow) glow.setAttribute('style', style);
  }

  function addRipple(px, py, scaledY) {
    // px, py are percentage of canvas width/height; convert to SVG coords
    const canvas = document.getElementById('crowd-canvas');
    const cw = canvas.offsetWidth  || 400;
    const ch = canvas.offsetHeight || 420;
    // Ripple appears on water surface at x = same horizontal as star
    const rippleX = (px / cw) * SCENE_W;
    const rippleY = WATER_Y + 14;

    const layer = document.getElementById('ripple-layer');
    if (!layer) return;

    // Two expanding rings
    for (let ring = 0; ring < 2; ring++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', rippleX);
      c.setAttribute('cy', rippleY);
      c.setAttribute('r', 3);
      c.setAttribute('fill', 'none');
      c.setAttribute('stroke', 'rgba(197,180,140,0.55)');
      c.setAttribute('stroke-width', 1.5);
      c.style.animation = `rippleExpand ${1.8 + ring * 0.6}s ease-out ${ring * 0.3}s forwards`;
      layer.appendChild(c);
      c.addEventListener('animationend', () => c.remove());
    }
  }

  // ── Star SVG builder ─────────────────────────────────────
  function buildStarPath(pts, cx, cy, outerR, innerR, jitter) {
    let d = '';
    for (let i = 0; i < pts * 2; i++) {
      const base = i % 2 === 0 ? outerR : innerR;
      const r = jitter > 0 ? base + (Math.sin(i * 9.7 + pts) * jitter) : base;
      const a = (i * Math.PI) / pts - Math.PI / 2;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
    }
    return d + 'Z';
  }

  function costToPoints(cost) {
    if (cost <= 0) return 4;
    if (cost <= 3) return 6;
    if (cost <= 6) return 8;
    return 12;
  }

  function avatarSize(count) {
    return Math.round(24 + Math.pow(count, 0.65) * 9);
  }

  function buildStarSVG(color, size, pts) {
    const cx = size / 2, cy = size / 2;
    const outerR = size / 2 * 0.88;
    const innerR = outerR * (pts <= 4 ? 0.44 : pts <= 6 ? 0.40 : pts <= 8 ? 0.37 : 0.33);
    const jitter  = outerR * 0.055; // organic imperfection

    // Outer path (slightly larger, soft)
    const pathOuter = buildStarPath(pts, cx, cy, outerR * 1.1, innerR * 1.1, jitter * 1.4);
    // Inner path (crisp)
    const pathInner = buildStarPath(pts, cx, cy, outerR, innerR, jitter);
    // Tiny inner core
    const pathCore  = buildStarPath(pts, cx, cy, outerR * 0.32, innerR * 0.32, 0);

    const filterId = `sf${pts}${Math.abs(color.charCodeAt(1) || 0)}`;

    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <filter id="${filterId}" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="${Math.max(2, size * 0.12)}" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="${pathOuter}" fill="${color}" opacity="0.28" filter="url(#${filterId})"/>
      <path d="${pathInner}" fill="${color}" opacity="0.88"/>
      <path d="${pathCore}"  fill="white"   opacity="0.55"/>
    </svg>`;
  }

  // ── Crowd rendering ───────────────────────────────────────
  function nameHash(name) {
    return name.split('').reduce((h,c) => Math.imul(h,31) + c.charCodeAt(0) | 0, 0);
  }

  function crowdPosition(index) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const r = 52 + 20 * Math.sqrt(index);
    const a = index * goldenAngle;
    return { dx: r * Math.cos(a), dy: r * Math.sin(a) };
  }

  function renderCrowd(data) {
    const canvas = document.getElementById('crowd-canvas');

    // Build scene background on first call
    if (!document.getElementById('scene-bg')) {
      buildSceneBackground(canvas);
    }

    // Remove existing star avatars
    canvas.querySelectorAll('.star-avatar').forEach(el => el.remove());

    // Clear constellation SVG
    const constSvg = document.getElementById('constellation-svg');
    if (constSvg) constSvg.innerHTML = '';

    // Clear light pools
    const poolLayer = document.getElementById('light-pool-layer');
    if (poolLayer) poolLayer.innerHTML = '';

    const today = todayStr();
    const todayCounts = data.days[today] || {};
    const W = canvas.offsetWidth  || 400;
    const H = canvas.offsetHeight || 420;

    // Sky center for star orbiting
    const cx = W / 2;
    const cy = H * 0.46;

    let idx = 0;
    data.groups.forEach(group => {
      group.people.forEach(name => {
        const count = todayCounts[name] || 0;
        if (count > 0) {
          const cost     = getPersonCost(name, getGroupType(group), data);
          const isReg    = (data.regulars || []).includes(name);
          addStarToCanvas(name, idx, count, group.color, cost, isReg, cx, cy, W, H);
          idx++;
        }
      });
    });

    const total = Object.values(todayCounts).reduce((s,v) => s+v, 0);
    updateCrowdLabel(total);

    // Refresh candle/lantern state
    const td  = getTodayTokens(data);
    const pct = td && td.dailyMax > 0 ? Math.max(0, Math.min(1, td.current / td.dailyMax)) : 0;
    updateSceneCandle(pct, td ? td.current <= 0 : false);
    updateMoonBoatSpeed(pct);
    updateTownLanterns(pct);
  }

  function addStarToCanvas(name, index, count, color, cost, isRegular, cx, cy, W, H, animate) {
    const canvas = document.getElementById('crowd-canvas');
    const pos  = crowdPosition(index);
    const size = avatarSize(count);
    const pts  = costToPoints(cost);
    const h    = Math.abs(nameHash(name));

    // Scale: compress horizontally a bit to keep stars in scene
    const scaleX = 0.62, scaleY = 0.58;
    const starX = cx + pos.dx * scaleX;
    const starY = cy + pos.dy * scaleY;

    // Clamp to sky area (don't overlap town)
    const maxY = H * 0.60;
    const minY = size / 2 + 8;
    const minX = size / 2;
    const maxX = W - size / 2;
    const finalX = Math.max(minX, Math.min(maxX, starX));
    const finalY = Math.max(minY, Math.min(maxY, starY));

    // Per-star drift values (small, lazy)
    const driftAmp = 6 + (h % 5);
    const angles   = [0.4, 1.9, 3.6, 5.1].map(a => a + (h % 7) * 0.15);
    const dx1 = (Math.cos(angles[0]) * driftAmp).toFixed(2);
    const dy1 = (Math.sin(angles[0]) * driftAmp * 0.65).toFixed(2);
    const dx2 = (Math.cos(angles[1]) * driftAmp).toFixed(2);
    const dy2 = (Math.sin(angles[1]) * driftAmp * 0.65).toFixed(2);
    const dx3 = (Math.cos(angles[2]) * driftAmp).toFixed(2);
    const dy3 = (Math.sin(angles[2]) * driftAmp * 0.65).toFixed(2);
    const driftDur    = 48 + (h % 38);   // 48–86 seconds
    const driftDelay  = -((h % driftDur));
    const breatheDur  = 7 + (h % 7);
    const breatheDelay = -((h % breatheDur));

    const div = document.createElement('div');
    div.className = 'star-avatar';
    div.dataset.name = name;
    div.innerHTML = buildStarSVG(color, size, pts) +
      `<div class="star-tip">${escapeHtml(name)} &middot; ${count}</div>`;

    div.style.cssText = `
      left: ${finalX}px;
      top:  ${finalY}px;
      --dx1: ${dx1}px; --dy1: ${dy1}px;
      --dx2: ${dx2}px; --dy2: ${dy2}px;
      --dx3: ${dx3}px; --dy3: ${dy3}px;
      --star-opacity: ${0.72 + (h % 25) / 100};
      filter: drop-shadow(0 0 ${Math.max(3, size * 0.14)}px ${color});
      animation:
        starDrift   ${driftDur}s   ease-in-out ${driftDelay}s   infinite,
        starBreathe ${breatheDur}s ease-in-out ${breatheDelay}s infinite;
      z-index: ${5 + (count > 10 ? 1 : 0)};
    `;

    if (animate) {
      // Star arrives from outside: fade + scale in
      div.style.opacity   = '0';
      div.style.transform = 'translate(-50%, -50%) scale(0.1)';
      canvas.appendChild(div);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        div.style.transition = 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)';
        div.style.opacity    = '1';
        div.style.transform  = '';
      }));
    } else {
      canvas.appendChild(div);
    }

    // Constellation line for regulars
    if (isRegular) {
      const constSvg = document.getElementById('constellation-svg');
      if (constSvg) {
        // Convert canvas pixel coords to SVG viewBox coords
        const svgW = constSvg.clientWidth  || W;
        const svgH = constSvg.clientHeight || H;
        const sceneCandelX = W / 2, sceneCandelY = H * 0.46;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', finalX);
        line.setAttribute('y1', finalY);
        line.setAttribute('x2', sceneCandelX);
        line.setAttribute('y2', sceneCandelY);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-opacity', '0.22');
        line.setAttribute('stroke-width', '0.7');
        line.setAttribute('stroke-dasharray', '3 6');
        constSvg.appendChild(line);
      }
    }

    // Light pool on town rooftop
    const poolLayer = document.getElementById('light-pool-layer');
    if (poolLayer) {
      const poolX = (finalX / W) * SCENE_W;
      const poolR = Math.min(28, 10 + count * 1.2);
      const pool  = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      pool.setAttribute('cx', poolX.toFixed(1));
      pool.setAttribute('cy', (TOWN_Y + 10).toString());
      pool.setAttribute('rx', poolR.toFixed(1));
      pool.setAttribute('ry', (poolR * 0.35).toFixed(1));
      pool.setAttribute('fill', color);
      pool.setAttribute('opacity', '0.08');
      poolLayer.appendChild(pool);

      // Water reflection
      const refLayer = document.getElementById('star-water-reflections');
      if (refLayer) {
        const ref = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ref.setAttribute('cx', poolX.toFixed(1));
        ref.setAttribute('cy', (WATER_Y + 10).toString());
        ref.setAttribute('rx', '4');
        ref.setAttribute('ry', '12');
        ref.setAttribute('fill', color);
        ref.setAttribute('opacity', '0.12');
        refLayer.appendChild(ref);
      }
    }

    // Click: log conversation tap
    div.addEventListener('click', () => increment(name));
    return div;
  }

  function pulseStarAvatar(name, count, cost) {
    const canvas = document.getElementById('crowd-canvas');
    const div = Array.from(canvas.querySelectorAll('.star-avatar'))
      .find(el => el.dataset.name === name);
    if (!div) return;

    // Update size
    const size = avatarSize(count);
    const pts  = costToPoints(cost);
    const h    = Math.abs(nameHash(name));
    const svg  = div.querySelector('svg');
    if (svg) {
      const color = svg.querySelector('path')?.getAttribute('fill') || '#c5a04a';
      div.innerHTML = buildStarSVG(color, size, pts) +
        `<div class="star-tip">${escapeHtml(name)} &middot; ${count}</div>`;
      div.addEventListener('click', () => increment(name));
    }

    // Update filter glow (size grows)
    const currentColor = div.querySelector('path')?.getAttribute('fill') || '#c5a04a';
    div.style.filter = `drop-shadow(0 0 ${Math.max(3, size * 0.14)}px ${currentColor})`;

    // Pulse animation
    div.classList.remove('pulse');
    void div.offsetWidth;
    div.classList.add('pulse');
    div.addEventListener('animationend', () => div.classList.remove('pulse'), { once: true });
  }

  function updateCrowdLabel(total) {
    const el = document.getElementById('crowd-stats');
    if (!el) return;
    el.textContent = total === 0
      ? 'no conversations yet today'
      : `${total} conversation${total === 1 ? '' : 's'} today`;
  }

  // ── Daily suggestion ───────────────────────────────────────
  function checkDailySuggestion(data) {
    if (getTodayTokens(data)) return;
    if (!data.cycleData || !data.cycleData.lastPeriodStart) {
      document.getElementById('setup-modal').classList.remove('hidden');
      return;
    }
    openSuggestModal(data);
  }

  function openSuggestModal(data) {
    const moon   = getMoonPhaseInfo(new Date());
    const base   = 80;
    let tokens   = base + moon.modifier;
    let cyclePart = '';
    if (data.cycleData && data.cycleData.lastPeriodStart) {
      const cycle = getCyclePhaseInfo(data.cycleData.lastPeriodStart, data.cycleData.cycleLength || 28);
      tokens += cycle.modifier;
      cyclePart = ` + ${cycle.name.toLowerCase()}`;
    }
    tokens = Math.max(40, Math.min(120, tokens));
    _pendingSuggestedTokens = tokens;

    const power = tokens >= 100 ? 'full power' : tokens >= 80 ? 'good energy' : tokens >= 60 ? 'moderate energy' : 'low energy';
    document.getElementById('suggest-moon').textContent  = moon.emoji;
    document.getElementById('suggest-label').textContent = `${moon.name}${cyclePart} — ${power} today. Suggested: ${tokens}`;
    document.getElementById('nudge-value').textContent   = tokens;
    document.getElementById('suggest-modal').classList.remove('hidden');
  }

  function nudgeTokens(delta) {
    _pendingSuggestedTokens = Math.max(40, Math.min(120, _pendingSuggestedTokens + delta));
    document.getElementById('nudge-value').textContent = _pendingSuggestedTokens;
  }

  function confirmTokens() {
    const data = loadData();
    setTodayTokens(data, _pendingSuggestedTokens, _pendingSuggestedTokens);
    saveData(data);
    document.getElementById('suggest-modal').classList.add('hidden');
    updateCandleVisual(data);
    updateCandlePhase(data);
  }

  function dismissSuggest() {
    const data = loadData();
    if (!getTodayTokens(data)) { setTodayTokens(data, 80, 80); saveData(data); }
    document.getElementById('suggest-modal').classList.add('hidden');
    updateCandleVisual(data);
    updateCandlePhase(data);
  }

  function saveSetupAndSuggest() {
    const dateInput   = document.getElementById('setup-period-date');
    const lengthInput = document.getElementById('setup-cycle-length');
    if (!dateInput.value) {
      dateInput.style.borderColor = 'rgba(197,160,74,0.6)';
      setTimeout(() => dateInput.style.borderColor = '', 1000);
      return;
    }
    const data = loadData();
    data.cycleData = { lastPeriodStart: dateInput.value, cycleLength: parseInt(lengthInput.value) || 28 };
    saveData(data);
    document.getElementById('setup-modal').classList.add('hidden');
    openSuggestModal(data);
  }

  function skipSetup() {
    document.getElementById('setup-modal').classList.add('hidden');
    const data = loadData();
    if (!getTodayTokens(data)) {
      const moon   = getMoonPhaseInfo(new Date());
      const tokens = Math.max(40, Math.min(120, 80 + moon.modifier));
      setTodayTokens(data, tokens, tokens);
      saveData(data);
    }
    updateCandleVisual(data);
    updateCandlePhase(data);
  }

  // ── Settings panel ─────────────────────────────────────────
  function openSettings() {
    const data = loadData();
    const moon = getMoonPhaseInfo(new Date());

    document.getElementById('settings-moon-emoji').textContent = moon.emoji;
    document.getElementById('settings-moon-name').textContent  = moon.name;
    const moonModEl = document.getElementById('settings-moon-mod');
    moonModEl.textContent = (moon.modifier >= 0 ? '+' : '') + moon.modifier;
    moonModEl.className = 'forecast-mod' + (moon.modifier < 0 ? ' negative' : '');

    const cycleNameEl = document.getElementById('settings-cycle-name');
    const cycleModEl  = document.getElementById('settings-cycle-mod');

    let suggested;
    if (data.cycleData && data.cycleData.lastPeriodStart) {
      const cycle = getCyclePhaseInfo(data.cycleData.lastPeriodStart, data.cycleData.cycleLength || 28);
      cycleNameEl.textContent = cycle.name;
      cycleModEl.textContent  = (cycle.modifier >= 0 ? '+' : '') + cycle.modifier;
      cycleModEl.className    = 'forecast-mod' + (cycle.modifier < 0 ? ' negative' : '');
      suggested = Math.max(40, Math.min(120, 80 + moon.modifier + cycle.modifier));
      document.getElementById('settings-period-date').value  = data.cycleData.lastPeriodStart;
      document.getElementById('settings-cycle-length').value = data.cycleData.cycleLength || 28;
    } else {
      cycleNameEl.textContent = 'Not set yet';
      cycleModEl.textContent  = '—';
      cycleModEl.className    = 'forecast-mod';
      suggested = Math.max(40, Math.min(120, 80 + moon.modifier));
    }

    document.getElementById('settings-suggested').textContent = suggested;
    document.getElementById('settings-modal').classList.remove('hidden');
  }

  function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
  }

  function saveSettings() {
    const dateEl   = document.getElementById('settings-period-date');
    const lengthEl = document.getElementById('settings-cycle-length');
    if (!dateEl.value) {
      dateEl.style.borderColor = 'rgba(197,160,74,0.6)';
      setTimeout(() => dateEl.style.borderColor = '', 1000);
      return;
    }
    const data = loadData();
    data.cycleData = { lastPeriodStart: dateEl.value, cycleLength: parseInt(lengthEl.value) || 28 };
    saveData(data);
    updateCandlePhase(data);
    closeSettings();
  }

  // ── Manual token adjust ─────────────────────────────────────
  function adjustTokens(delta) {
    const data = loadData();
    const td   = getTodayTokens(data);
    if (!td) return;
    td.current = Math.max(0, Math.min(td.dailyMax, td.current + delta));
    saveData(data);
    updateCandleVisual(data);
  }

  // ── Group type cycling ──────────────────────────────────────
  function cycleGroupType(groupId) {
    const data  = loadData();
    const group = data.groups.find(g => g.id === groupId);
    if (!group) return;
    const idx  = GROUP_TYPE_ORDER.indexOf(group.type || 'neutral');
    group.type = GROUP_TYPE_ORDER[(idx + 1) % GROUP_TYPE_ORDER.length];
    saveData(data);
    render();
  }

  // ── Color utils ─────────────────────────────────────────────
  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1,3),16)/255;
    let g = parseInt(hex.slice(3,5),16)/255;
    let b = parseInt(hex.slice(5,7),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min;
    let h=0, s=0, l=(max+min)/2;
    if (d) {
      s = d / (1 - Math.abs(2*l-1));
      switch(max) {
        case r: h=((g-b)/d+6)%6; break;
        case g: h=(b-r)/d+2;     break;
        case b: h=(r-g)/d+4;     break;
      }
      h /= 6;
    }
    return [h*360, s*100, l*100];
  }

  function hslToHex(h, s, l) {
    h/=360; s/=100; l/=100;
    const a = s*Math.min(l,1-l);
    const f = n => {
      const k=(n+h*12)%12;
      return l - a*Math.max(-1,Math.min(k-3,9-k,1));
    };
    return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');
  }

  function lighten(hex, amt=30) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
    const [h,s,l] = hexToHsl(hex);
    return hslToHex(h, Math.max(0,s-10), Math.min(94,l+amt));
  }

  function darken(hex, amt=22) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
    const [h,s,l] = hexToHsl(hex);
    return hslToHex(h, Math.min(100,s+5), Math.max(5,l-amt));
  }

  // ── Utils ────────────────────────────────────────────────────
  function todayStr() { return new Date().toLocaleDateString('en-CA'); }
  function uid() { return 'g' + Date.now() + Math.random().toString(36).slice(2,5); }

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getPriorDays(n, beforeDate) {
    const result = [];
    const d = new Date(beforeDate + 'T00:00:00');
    for (let i=1; i<=n; i++) {
      const p = new Date(d);
      p.setDate(d.getDate()-i);
      result.push(p.toLocaleDateString('en-CA'));
    }
    return result;
  }

  function getAllPeople(data) { return data.groups.flatMap(g => g.people); }

  // ── Day transition ───────────────────────────────────────────
  function handleDayTransition(data, today) {
    const last3 = getPriorDays(3, today);
    if (!data.regulars) data.regulars = [];

    const hasHistory = Object.keys(data.days).some(k => k <= last3[2]);
    if (!hasHistory) return data;

    data.groups.forEach(group => {
      group.people = group.people.filter(name => {
        const counts = last3.map(d => (data.days[d] && data.days[d][name]) || 0);
        if (counts.every(c => c === 0)) {
          data.regulars = data.regulars.filter(r => r !== name);
          return false;
        }
        return true;
      });
    });

    getAllPeople(data).forEach(name => {
      const counts = last3.map(d => (data.days[d] && data.days[d][name]) || 0);
      const allActive = counts.every(c => c > 0);
      if (allActive && !data.regulars.includes(name)) {
        data.regulars.push(name);
      } else if (!allActive) {
        data.regulars = data.regulars.filter(r => r !== name);
      }
    });

    return data;
  }

  // ── Data ─────────────────────────────────────────────────────
  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    let data;

    if (!raw) {
      data = {
        groups: [
          { id: uid(), name: 'Work',     people: [], color: GROUP_COLORS[0] },
          { id: uid(), name: 'Personal', people: [], color: GROUP_COLORS[1] }
        ],
        days: {}, regulars: [], lastDate: todayStr()
      };
      saveData(data);
      return data;
    }

    data = JSON.parse(raw);

    // Migrate v1 (people as objects with .count)
    if (data.date !== undefined && !data.days) {
      const old = data.people || [];
      const hist = {};
      if (old.some(p => p.count > 0)) {
        hist[data.date] = {};
        old.forEach(p => { hist[data.date][p.name] = p.count; });
      }
      data = { people: old.map(p => p.name), days: hist, regulars: [], lastDate: data.date };
    }

    // Migrate v2 (flat people → groups)
    if (!data.groups && Array.isArray(data.people)) {
      data.groups = [{ id: uid(), name: 'General', people: data.people, color: GROUP_COLORS[0] }];
      delete data.people;
    }

    if (!data.regulars) data.regulars = [];
    if (!data.groups)   data.groups   = [];

    data.groups.forEach((g, i) => {
      if (!g.color) g.color = GROUP_COLORS[i % GROUP_COLORS.length];
      if (!g.type) {
        const n = (g.name || '').toLowerCase();
        if (n.includes('work') || n.includes('office') || n.includes('colleague')) g.type = 'work';
        else if (n.includes('family') || n.includes('fam'))                        g.type = 'family';
        else g.type = 'friend';
      }
    });

    if (!data.tokenDays)   data.tokenDays   = {};
    if (!data.personCosts) data.personCosts = {};
    if (data.cycleData === undefined) data.cycleData = null;

    const today = todayStr();
    if (data.lastDate && data.lastDate !== today) {
      data = handleDayTransition(data, today);
    }
    data.lastDate = today;
    saveData(data);
    return data;
  }

  function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

  // ── Main render ───────────────────────────────────────────────
  function render() {
    const data = loadData();
    const todayCounts = data.days[todayStr()] || {};
    const container = document.getElementById('groups-container');
    container.innerHTML = '';

    let grandTotal = 0;

    data.groups.forEach(group => {
      const gType      = getGroupType(group);
      const groupTotal = group.people.reduce((s,n) => s + (todayCounts[n] || 0), 0);
      grandTotal += groupTotal;

      const section = document.createElement('div');
      section.className = 'group-section';
      section.dataset.groupId = group.id;

      const header = document.createElement('div');
      header.className = 'group-header';

      const left = document.createElement('div');
      left.className = 'group-header-left';

      const swatch = document.createElement('label');
      swatch.className = 'color-swatch';
      swatch.style.background = group.color;
      swatch.title = 'Change colour';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.className = 'color-input';
      colorInput.value = group.color;
      colorInput.addEventListener('input', e => {
        const nc = e.target.value;
        swatch.style.background = nc;
        const d = loadData();
        const g = d.groups.find(x => x.id === group.id);
        if (g) { g.color = nc; saveData(d); renderCrowd(d); }
      });
      swatch.appendChild(colorInput);
      left.appendChild(swatch);

      const nameEl = document.createElement('span');
      nameEl.className = 'group-name';
      nameEl.contentEditable = 'true';
      nameEl.spellcheck = false;
      nameEl.textContent = group.name;
      nameEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); nameEl.blur(); }
      });
      nameEl.addEventListener('blur', () => {
        const newName = nameEl.textContent.trim() || 'Group';
        const d = loadData();
        const g = d.groups.find(x => x.id === group.id);
        if (g) { g.name = newName; saveData(d); }
        nameEl.textContent = newName;
      });
      left.appendChild(nameEl);
      header.appendChild(left);

      const right = document.createElement('div');
      right.className = 'group-header-right';
      right.innerHTML = `<span class="group-total"><b>${groupTotal}</b> today</span>`;
      const typeBtn = document.createElement('button');
      typeBtn.className = 'group-type-btn';
      typeBtn.title = `Type: ${gType}`;
      typeBtn.textContent = GROUP_TYPES[gType];
      typeBtn.addEventListener('click', () => cycleGroupType(group.id));
      right.appendChild(typeBtn);
      const delBtn = document.createElement('button');
      delBtn.className = 'group-delete-btn';
      delBtn.title = 'Delete group';
      delBtn.textContent = '×';
      delBtn.addEventListener('click', () => deleteGroup(group.id));
      right.appendChild(delBtn);
      header.appendChild(right);
      section.appendChild(header);

      const body = document.createElement('div');
      body.className = 'group-body';
      body.addEventListener('dragover',  e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
      body.addEventListener('dragenter', e => { if (!body.contains(e.relatedTarget)) body.classList.add('drag-over'); });
      body.addEventListener('dragleave', e => { if (!body.contains(e.relatedTarget)) body.classList.remove('drag-over'); });
      body.addEventListener('drop',      e => onDrop(e, group.id));

      const COST_DEFAULTS = { work: 1, friend: -1, family: 0, neutral: 0 };
      group.people.forEach(name => {
        const count      = todayCounts[name] || 0;
        const isRegular  = data.regulars.includes(name);
        const personCost = (data.personCosts && data.personCosts[name] !== undefined)
          ? data.personCosts[name]
          : (COST_DEFAULTS[gType] ?? 0);
        const costColor = personCost > 0 ? 'rgba(180,120,160,0.6)' : personCost < 0 ? 'rgba(160,196,184,0.6)' : 'rgba(197,160,74,0.38)';

        const card = document.createElement('div');
        card.className = 'person-card';
        card.draggable = true;
        card.dataset.name = name;
        card.innerHTML = `
          <span class="drag-handle" title="Drag to move">⠿</span>
          <div class="person-name">
            ${escapeHtml(name)}
            ${isRegular ? '<span class="streak-badge">regular</span>' : ''}
          </div>
          <input type="number" class="cost-input" title="Token cost (+drains / −restores)"
            value="${personCost}" min="-10" max="10" step="1" style="color:${costColor}"/>
          <div class="person-count" id="cnt-${CSS.escape(name)}">${count}</div>
          <button class="tap-btn" title="Log conversation">+1</button>
          <button class="delete-btn" title="Remove">✕</button>
        `;
        card.querySelector('.tap-btn').addEventListener('click',    e => { e.stopPropagation(); increment(name); });
        card.querySelector('.delete-btn').addEventListener('click', e => { e.stopPropagation(); removePerson(name, group.id); });
        card.addEventListener('click', e => {
          if (e.target.closest('.delete-btn, .cost-input, .drag-handle, .tap-btn')) return;
          increment(name);
        });
        card.querySelector('.cost-input').addEventListener('change', e => {
          const val = Math.max(-10, Math.min(10, parseInt(e.target.value) || 0));
          e.target.value = val;
          e.target.style.color = val > 0 ? 'rgba(180,120,160,0.6)' : val < 0 ? 'rgba(160,196,184,0.6)' : 'rgba(197,160,74,0.38)';
          const d = loadData();
          if (!d.personCosts) d.personCosts = {};
          d.personCosts[name] = val;
          saveData(d);
        });
        card.addEventListener('dragstart', e => {
          dragState = { name, fromGroupId: group.id };
          e.dataTransfer.effectAllowed = 'move';
          requestAnimationFrame(() => card.classList.add('dragging'));
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        body.appendChild(card);
      });

      const addRow = document.createElement('div');
      addRow.className = 'add-person-row';
      const input = document.createElement('input');
      input.className = 'add-person-input';
      input.type = 'text';
      input.maxLength = 40;
      input.placeholder = '+ add person…';
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { addPerson(group.id, input); e.preventDefault(); } });
      input.addEventListener('blur',    () => { if (input.value.trim()) addPerson(group.id, input); });
      addRow.appendChild(input);
      body.appendChild(addRow);

      section.appendChild(body);
      container.appendChild(section);
    });

    document.getElementById('total-count').textContent = grandTotal;
    renderCrowd(data);
    renderHistory(data);
    updateCandleVisual(data);
    updateCandlePhase(data);
    initTarotCard();
  }

  // ── Drag & Drop ───────────────────────────────────────────────
  function onDrop(e, toGroupId) {
    e.preventDefault();
    document.querySelectorAll('.group-body').forEach(b => b.classList.remove('drag-over'));
    if (!dragState || dragState.fromGroupId === toGroupId) { dragState = null; return; }
    const data = loadData();
    const from = data.groups.find(g => g.id === dragState.fromGroupId);
    const to   = data.groups.find(g => g.id === toGroupId);
    if (from && to) {
      from.people = from.people.filter(p => p !== dragState.name);
      to.people.push(dragState.name);
      saveData(data);
    }
    dragState = null;
    render();
  }

  // ── Actions ───────────────────────────────────────────────────
  function addPerson(groupId, inputEl) {
    const name = inputEl.value.trim();
    if (!name) return;
    const data = loadData();
    if (getAllPeople(data).some(p => p.toLowerCase() === name.toLowerCase())) {
      inputEl.style.color = 'rgba(180,80,80,0.7)';
      inputEl.value = '';
      setTimeout(() => inputEl.style.color = '', 800);
      return;
    }
    const group = data.groups.find(g => g.id === groupId);
    if (group) { group.people.push(name); saveData(data); inputEl.value = ''; render(); }
  }

  function increment(name) {
    const data = loadData();
    const today = todayStr();
    if (!data.days[today]) data.days[today] = {};
    const wasZero = (data.days[today][name] || 0) === 0;
    data.days[today][name] = (data.days[today][name] || 0) + 1;
    saveData(data);

    const count = data.days[today][name];
    const group = data.groups.find(g => g.people.includes(name));

    // Update count display
    const countEl = document.getElementById('cnt-' + CSS.escape(name));
    if (countEl) {
      countEl.textContent = count;
      countEl.classList.remove('bump');
      void countEl.offsetWidth;
      countEl.classList.add('bump');
    }

    // Update group total label
    if (group) {
      const gTotal = group.people.reduce((s,n) => s + (data.days[today][n] || 0), 0);
      const sec = document.querySelector(`.group-section[data-group-id="${group.id}"]`);
      if (sec) { const b = sec.querySelector('.group-total b'); if (b) b.textContent = gTotal; }
    }

    // Update grand total
    const grandTotal = getAllPeople(data).reduce((s,n) => s + (data.days[today][n] || 0), 0);
    document.getElementById('total-count').textContent = grandTotal;

    const canvas = document.getElementById('crowd-canvas');
    const W = canvas.offsetWidth  || 400;
    const H = canvas.offsetHeight || 420;
    const cx = W / 2, cy = H * 0.46;
    const cost = getPersonCost(name, group ? getGroupType(group) : 'neutral', data);

    if (wasZero) {
      const idx   = canvas.querySelectorAll('.star-avatar').length;
      const color = (group && group.color) || GROUP_COLORS[0];
      const isReg = (data.regulars || []).includes(name);
      const div = addStarToCanvas(name, idx, 1, color, cost, isReg, cx, cy, W, H, true);
      // Ripple on water
      if (div) {
        const l = parseFloat(div.style.left);
        addRipple(l, 0, H);
      }
    } else {
      pulseStarAvatar(name, count, cost);
      // Ripple on water
      const div = Array.from(canvas.querySelectorAll('.star-avatar')).find(el => el.dataset.name === name);
      if (div) addRipple(parseFloat(div.style.left), 0, H);
    }

    updateCrowdLabel(grandTotal);

    // Token drain
    const todayTd = data.tokenDays && data.tokenDays[today];
    if (todayTd) {
      if (cost !== 0) {
        todayTd.current = Math.max(0, Math.min(todayTd.dailyMax, todayTd.current - cost));
        saveData(data);
        updateCandleVisual(data);
        triggerFlameAnimation(cost > 0 ? 'work' : 'friend');
      }
    }
  }

  function removePerson(name, groupId) {
    const data = loadData();
    const group = data.groups.find(g => g.id === groupId);
    if (group) {
      group.people = group.people.filter(p => p !== name);
      data.regulars = data.regulars.filter(r => r !== name);
      saveData(data);
      render();
    }
  }

  function addGroup() {
    const data = loadData();
    const color = GROUP_COLORS[data.groups.length % GROUP_COLORS.length];
    data.groups.push({ id: uid(), name: 'New Group', people: [], color, type: 'neutral' });
    saveData(data);
    render();
    const nameEls = document.querySelectorAll('.group-name[contenteditable]');
    const last = nameEls[nameEls.length - 1];
    if (last) {
      last.focus();
      const range = document.createRange();
      range.selectNodeContents(last);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function deleteGroup(groupId) {
    const data = loadData();
    const group = data.groups.find(g => g.id === groupId);
    if (!group) return;
    if (group.people.length > 0 &&
        !confirm(`Delete "${group.name}" and its ${group.people.length} ${group.people.length===1?'person':'people'}?`)) return;
    data.groups = data.groups.filter(g => g.id !== groupId);
    saveData(data);
    render();
  }

  function resetCounts() {
    if (!confirm("Reset today's counts and restore candle?")) return;
    const data = loadData();
    const today = todayStr();
    if (data.days[today]) Object.keys(data.days[today]).forEach(k => data.days[today][k] = 0);
    if (data.tokenDays && data.tokenDays[today]) {
      const td = data.tokenDays[today];
      td.current = td.dailyMax;
    }
    saveData(data);
    render();
  }

  // ── History ───────────────────────────────────────────────────
  function renderHistory(data) {
    const el = document.getElementById('history-list');
    const today = todayStr();
    const pastDays = Object.keys(data.days).filter(d => d !== today).sort((a,b) => b.localeCompare(a));

    if (pastDays.length === 0) {
      el.innerHTML = '<div class="history-empty">No history yet.</div>';
      return;
    }

    el.innerHTML = '';
    pastDays.forEach(dateStr => {
      const counts = data.days[dateStr];
      const total  = Object.values(counts).reduce((s,v) => s+v, 0);
      const rows   = Object.entries(counts)
        .filter(([,c]) => c > 0)
        .sort((a,b) => b[1]-a[1])
        .map(([name,count]) =>
          `<div class="history-row"><span class="h-name">${escapeHtml(name)}</span><span class="h-count">${count}</span></div>`
        ).join('');

      const dayEl = document.createElement('div');
      dayEl.className = 'history-day';
      dayEl.innerHTML = `
        <div class="history-day-header" onclick="toggleDay(this)">
          <div class="history-day-date">${formatDate(dateStr)}</div>
          <div class="history-day-right">
            <div class="history-day-total"><span>${total}</span> conversations</div>
            <span class="history-chevron">▼</span>
          </div>
        </div>
        <div class="history-day-detail">
          ${rows || '<div style="color:rgba(232,220,200,0.2);font-size:12px;padding:4px 0">Nothing logged.</div>'}
        </div>
      `;
      el.appendChild(dayEl);
    });
  }

  function toggleDay(header) {
    header.nextElementSibling.classList.toggle('open');
    header.querySelector('.history-chevron').classList.toggle('open');
  }

  function toggleHistory() {
    const list   = document.getElementById('history-list');
    const toggle = document.getElementById('history-toggle');
    const isOpen = list.style.display !== 'none';
    list.style.display = isOpen ? 'none' : 'flex';
    toggle.classList.toggle('open', !isOpen);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toLocaleDateString('en-CA')) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // ── Vibe section toggle ────────────────────────────────────────
  function toggleVibe() {
    const body   = document.getElementById('vibe-body');
    const toggle = document.getElementById('vibe-toggle');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : '';
    toggle.classList.toggle('open', !isOpen);
    localStorage.setItem('vibe_collapsed', isOpen ? '1' : '0');
  }

  // ── Export data ────────────────────────────────────────────────
  function exportData() {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `people-i-talk-to-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Init ───────────────────────────────────────────────────────
  document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  // Restore vibe section collapsed state
  if (localStorage.getItem('vibe_collapsed') === '1') {
    const body   = document.getElementById('vibe-body');
    const toggle = document.getElementById('vibe-toggle');
    if (body)   body.style.display = 'none';
    if (toggle) toggle.classList.add('open');
  }

  // Add ripple CSS keyframe (needs to be in DOM, not stylesheet, because it uses SVG animation)
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleExpand {
      0%   { r: 3;  opacity: 0.6; stroke-width: 1.5; }
      100% { r: 32; opacity: 0;   stroke-width: 0.4; }
    }
    @keyframes moonBoatDrift {
      0%   { transform: translateX(0px); }
      50%  { transform: translateX(var(--boat-range, 18px)); }
      100% { transform: translateX(0px); }
    }
  `;
  document.head.appendChild(rippleStyle);

  render();

  // Daily token suggestion on first open
  const _initData = loadData();
  checkDailySuggestion(_initData);
