  const STORAGE_KEY = 'conv_tracker_v2';
  const GROUP_COLORS = ['#D4882A','#7A8C3C','#A85C7A','#4A5228','#8B5E3C','#B87333','#5A7A4A','#C4734A'];

  let dragState = null;
  let _pendingSuggestedTokens = 80;
  let _horoscopeOffset = 0;

  const GROUP_TYPES      = { work: '💼', friend: '🌸', family: '🏡', neutral: '◎' };
  const GROUP_TYPE_ORDER = ['work', 'friend', 'family', 'neutral'];

  // ── Zodiac ────────────────────────────────────────────
  const ZODIAC = [
    { key:'capricorn',   emoji:'♑', name:'Capricorn',   ranges:[[12,22],[1,19]]  },
    { key:'aquarius',    emoji:'♒', name:'Aquarius',    ranges:[[1,20],[2,18]]   },
    { key:'pisces',      emoji:'♓', name:'Pisces',      ranges:[[2,19],[3,20]]   },
    { key:'aries',       emoji:'♈', name:'Aries',       ranges:[[3,21],[4,19]]   },
    { key:'taurus',      emoji:'♉', name:'Taurus',      ranges:[[4,20],[5,20]]   },
    { key:'gemini',      emoji:'♊', name:'Gemini',      ranges:[[5,21],[6,20]]   },
    { key:'cancer',      emoji:'♋', name:'Cancer',      ranges:[[6,21],[7,22]]   },
    { key:'leo',         emoji:'♌', name:'Leo',         ranges:[[7,23],[8,22]]   },
    { key:'virgo',       emoji:'♍', name:'Virgo',       ranges:[[8,23],[9,22]]   },
    { key:'libra',       emoji:'♎', name:'Libra',       ranges:[[9,23],[10,22]]  },
    { key:'scorpio',     emoji:'♏', name:'Scorpio',     ranges:[[10,23],[11,21]] },
    { key:'sagittarius', emoji:'♐', name:'Sagittarius', ranges:[[11,22],[12,21]] },
  ];

  const HOROSCOPES = {
    aries: [
      "Bold energy surrounds you — your directness opens doors today. Trust your instincts when connecting with others.",
      "A restless spark pushes you toward new conversations. Channel that fire into meaningful exchanges.",
      "Your leadership energy is strong; someone needs your honest perspective — offer it with warmth.",
      "The stars favor initiative. Reach out first; the connection you've been waiting on won't arrive on its own.",
      "Your natural charisma is amplified. Social situations that once felt draining may surprise you with ease.",
      "Mars lends extra stamina for emotional labor today. You can hold space for others without depleting yourself.",
      "A blunt truth lands softer than you'd expect — speak your mind with care and you'll be heard.",
      "Someone you reconnect with today carries more significance than it first appears.",
    ],
    taurus: [
      "Slow, steady connection is your gift today. Deep conversations nourish you more than surface-level chatter.",
      "Venus asks you to invest in relationships that have stood the test of time. Quality over quantity.",
      "Your presence is grounding for others — lean into that, but guard your own stillness.",
      "Comfort and routine bring unexpected joy. A familiar face brings news worth hearing.",
      "Patience is your superpower right now. Don't rush someone who needs time to open up.",
      "Your loyalty is being noticed. The energy you've put into relationships begins to return.",
      "A shared meal or walk transforms small talk into real connection. Lean into sensory richness.",
      "Someone is asking for your trust. Your instincts about their sincerity are probably right.",
    ],
    gemini: [
      "Your mind is buzzing with ideas — conversations spark and branch in unexpected directions. Follow the threads.",
      "Mercury sharpens your wit today. Words flow easily, but choose them thoughtfully.",
      "You're the connector today — two people in your circle would benefit from knowing each other.",
      "Curiosity is your compass. Ask the question you've been holding back.",
      "Your adaptability lets you meet people exactly where they are. This is a rare gift.",
      "A flood of messages and plans arrives — prioritize what truly feeds your spirit.",
      "Duality works in your favor: listen as much as you speak and you'll learn something surprising.",
      "An idea you share casually today plants a seed that comes back in full bloom later.",
    ],
    cancer: [
      "Your intuition about people is especially sharp today — trust it. Not everyone deserves access to your inner world.",
      "Emotional tides are high; let yourself feel without explaining. The right people won't need reasons.",
      "Nurturing energy flows from you naturally. Someone close needs care more than advice.",
      "Home and heart are your anchors. Genuine warmth goes further than witty banter.",
      "The moon amplifies your empathy — a beautiful gift, but remember to shield your own energy.",
      "An old memory surfaces to teach you something about a current relationship.",
      "Your protective instincts are activated. Check in on someone who's been quiet lately.",
      "Vulnerability is a strength today. Letting your guard down slightly deepens a bond significantly.",
    ],
    leo: [
      "The sun energizes your social presence — you light up every room today. Use it generously.",
      "Your warmth draws people toward you. Lead with your heart and let others bask in your attention.",
      "A creative spark turns an ordinary exchange into something memorable. Don't hold back your flair.",
      "Generosity of spirit is your signature. Celebrating someone else's win costs you nothing and means everything.",
      "You're being seen, and rightly so. Let yourself receive appreciation gracefully.",
      "Drama finds its way to you — rise above it and you emerge looking like the leader you are.",
      "Playfulness and humor are your bridge into deeper connection today. Don't underestimate lightness.",
      "Someone quietly admires your confidence. A kind word from you could change their day.",
    ],
    virgo: [
      "Your attention to detail serves relationships today. You notice what others miss — and it matters.",
      "Mercury sharpens your analytical mind, but the heart resists spreadsheets. Let some things be imperfect.",
      "Service is love in your language. A small, practical gesture means more than grand declarations.",
      "Listen carefully today — the real message often hides beneath what's being said.",
      "Your high standards are a gift and a challenge. Extend a little more grace and connections deepen.",
      "An overlooked detail in a recent conversation deserves revisiting. You were right to notice.",
      "Your help is most powerful when it's asked for. Wait to be invited before offering solutions.",
      "Quiet consistency builds the trust that flashy gestures never could. Keep showing up.",
    ],
    libra: [
      "Venus blesses your social grace today — harmony comes naturally and others gravitate toward your calm.",
      "Balance is your pursuit, but sometimes choosing a side is an act of love. Don't over-equivocate.",
      "Beauty in connection is your theme. Seek conversations that feel like art, not obligation.",
      "A relationship reaches a crossroads. Fairness and honesty together are your best compass.",
      "Your peacemaking instincts are needed. You're the only one who can bridge a particular divide.",
      "Indecision clears when you ask: what would I want if no one were watching?",
      "Partnership energy is strong. A collaboration discussed today could become something lasting.",
      "Your charm is a tool — wield it with intention rather than habit today.",
    ],
    scorpio: [
      "Your perceptive depth cuts through pretense today. You see what others can't — trust that vision.",
      "Intensity is your birthright. Channel it into meaningful exchange rather than quiet brooding.",
      "A truth surfaces that needed to come to light. Your ability to hold it without flinching is your strength.",
      "Not everyone can handle your full depth — and that's okay. Reveal yourself in layers.",
      "Pluto stirs transformation. A conversation that feels small today reshapes something fundamental.",
      "Your loyalty runs deep; make sure it's reciprocated before you extend more of yourself.",
      "Silence communicates volumes coming from you today. Use it deliberately.",
      "A hidden connection between people or events becomes clear to you — follow that thread.",
    ],
    sagittarius: [
      "Your optimism is infectious — share it freely. Even a brief exchange can lift someone's entire week.",
      "Adventure calls even in conversation. Seek out minds that challenge your assumptions.",
      "Jupiter expands your social world. A new connection today opens doors you didn't know existed.",
      "Your honesty, while bracing, is exactly what someone in your circle needs to hear.",
      "Freedom and connection aren't opposites today — you find both in the right exchange.",
      "A philosophical question worth sitting with: who in your life truly expands your horizons?",
      "Let what genuinely excites you lead — your enthusiasm is a renewable resource, and it's contagious.",
      "Seek a perspective wildly different from your own. Mental travel refreshes your social spirit.",
    ],
    capricorn: [
      "Your reliability is a gift. The people who count on you feel it, even when it goes unspoken.",
      "Saturn rewards patience — a relationship you've been tending quietly begins to bear fruit.",
      "Practical care is your love language. Small, consistent acts build the trust words alone never could.",
      "Your ambition is admirable, but don't let it crowd out the softer moments today.",
      "A mentor or elder figure offers wisdom worth receiving — set aside your self-sufficiency for a moment.",
      "Structure brings you peace, but flexibility unlocks connection. Loosen the plan slightly today.",
      "Long-term thinking guides your relationships. The investment you make today pays dividends.",
      "Someone quietly depends on your steadiness. Simply showing up is more than enough.",
    ],
    aquarius: [
      "Your originality shines in connection today — the stranger the conversation, the better.",
      "Uranus sparks unexpected encounters. Someone outside your usual circle carries a key insight.",
      "Your idealism is a compass. Let it guide you toward the relationships that actually matter.",
      "You're ahead of the curve, as usual. Be patient with those still catching up to your vision.",
      "Collective energy feeds you today. Seek out groups, communities, or even a lively group chat.",
      "Detachment is different from indifference — you can observe clearly and still care deeply.",
      "An unconventional approach to a stuck situation opens a conversation you'd given up on.",
      "Your friendship is rare and valuable. Someone today is quietly hoping to earn more of it.",
    ],
    pisces: [
      "Your empathy flows like water today, finding every crack. Set intentional limits on what you absorb.",
      "Neptune deepens your intuition — you feel the undercurrent of every room you enter.",
      "Dreams and reality blur at the edges. A hunch about someone deserves gentle exploration.",
      "Your compassion is your superpower and your vulnerability. Choose carefully who receives it today.",
      "Share something you love with someone who'd appreciate it — art, music, beauty opens hearts.",
      "Forgiveness asks for your attention — not because it was deserved, but because you're ready.",
      "A spiritual or creative connection feels fated today. Don't brush it off as coincidence.",
      "Your sensitivity picks up on what others overlook. Trust the feeling that something important is left unsaid.",
    ],
  };

  function getZodiacSign(birthday) {
    const [, mo, dy] = birthday.split('-').map(Number);
    for (const z of ZODIAC) {
      const [[sm, sd], [em, ed]] = z.ranges;
      if (sm > em) { // wraps year (Capricorn)
        if ((mo === sm && dy >= sd) || (mo === em && dy <= ed)) return z;
      } else {
        if ((mo === sm && dy >= sd) || (mo > sm && mo < em) || (mo === em && dy <= ed)) return z;
      }
    }
    return ZODIAC[0];
  }

  function getDailyHoroscope(key, date) {
    const msgs = HOROSCOPES[key];
    if (!msgs) return '';
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    return msgs[dayOfYear % msgs.length];
  }

  function updateHoroscope(data) {
    const card = document.getElementById('horoscope-card');
    if (!card) return;
    if (!data.birthday) { card.style.display = 'none'; return; }
    const z = getZodiacSign(data.birthday);
    document.getElementById('horoscope-sign').textContent = `${z.emoji} ${z.name}`;
    const textEl = document.getElementById('horoscope-text');
    if (!textEl.classList.contains('loading')) {
      textEl.textContent = getDailyHoroscope(z.key, new Date());
    }
    card.style.display = '';
  }

  function refreshHoroscope() {
    const data = loadData();
    if (!data.birthday) return;
    _horoscopeOffset++;
    const z = getZodiacSign(data.birthday);
    const msgs = HOROSCOPES[z.key];
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const textEl = document.getElementById('horoscope-text');
    textEl.classList.remove('loading');
    textEl.textContent = msgs[(dayOfYear + _horoscopeOffset) % msgs.length];
    // Spin the button
    const btn = document.getElementById('horoscope-refresh-btn');
    if (btn) {
      btn.classList.remove('spinning');
      void btn.offsetWidth;
      btn.classList.add('spinning');
      btn.addEventListener('transitionend', () => btn.classList.remove('spinning'), { once: true });
    }
  }

  async function askHoroscope() {
    const data = loadData();
    if (!data.birthday) return;
    const questionEl = document.getElementById('horoscope-ask-input');
    const question = questionEl.value.trim();
    if (!question) { refreshHoroscope(); return; }

    const textEl = document.getElementById('horoscope-text');
    const sendBtn = document.getElementById('horoscope-ask-btn');

    const z = getZodiacSign(data.birthday);
    textEl.classList.add('loading');
    textEl.textContent = '✨ Reading the stars…';
    sendBtn.disabled = true;

    try {
      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 180,
          system: `You are a warm, intuitive astrologer. The person is a ${z.name}. Give a short personalized reading in 2-3 sentences. Be mystical but grounded, speak directly to them as a wise friend would.`,
          messages: [{ role: 'user', content: `Today I'm wondering about: ${question}` }]
        })
      });
      if (!res.ok) throw new Error(res.status);
      const json = await res.json();
      textEl.classList.remove('loading');
      textEl.textContent = json.content[0].text;
      questionEl.value = '';
    } catch (e) {
      textEl.classList.remove('loading');
      textEl.textContent = 'The stars are cloudy right now — try again in a moment.';
    } finally {
      sendBtn.disabled = false;
    }
  }

  // ── Moon phase (pure JS, no API needed) ───────────────
  function getMoonPhaseInfo(date) {
    const JD    = date.getTime() / 86400000 + 2440587.5;
    const phase = ((JD - 2451550.1) % 29.530588853 + 29.530588853) % 29.530588853;
    if (phase < 1.85)  return { name: 'New Moon',        emoji: '🌑', modifier: -15 };
    if (phase < 7.38)  return { name: 'Waxing Crescent', emoji: '🌒', modifier:  +5 };
    if (phase < 9.22)  return { name: 'First Quarter',   emoji: '🌓', modifier: +10 };
    if (phase < 14.77) return { name: 'Waxing Gibbous',  emoji: '🌔', modifier: +15 };
    if (phase < 16.61) return { name: 'Full Moon',       emoji: '🌕', modifier: +20 };
    if (phase < 22.15) return { name: 'Waning Gibbous',  emoji: '🌖', modifier:  +5 };
    if (phase < 24.0)  return { name: 'Last Quarter',    emoji: '🌗', modifier:  -5 };
    return                    { name: 'Waning Crescent', emoji: '🌘', modifier: -10 };
  }

  // ── Menstrual cycle phase ─────────────────────────────
  function getCyclePhaseInfo(lastPeriodStart, cycleLength) {
    const today = new Date(); today.setHours(0,0,0,0);
    const last  = new Date(lastPeriodStart + 'T00:00:00');
    const cycleDay = (Math.floor((today - last) / 86400000) % cycleLength) + 1;
    if (cycleDay <= 5)  return { name: 'Menstrual phase',  modifier: -20, day: cycleDay };
    if (cycleDay <= 13) return { name: 'Follicular phase', modifier: +15, day: cycleDay };
    if (cycleDay <= 17) return { name: 'Ovulation phase',  modifier: +20, day: cycleDay };
    return                     { name: 'Luteal phase',     modifier: -10, day: cycleDay };
  }

  // ── Token helpers ─────────────────────────────────────
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

  // ── Candle visual ─────────────────────────────────────
  function updateCandleVisual(data) {
    const td       = getTodayTokens(data);
    const current  = td ? td.current  : null;
    const dailyMax = td ? td.dailyMax : null;
    const pct = (current !== null && dailyMax > 0) ? Math.max(0, Math.min(1, current / dailyMax)) : 0;

    const bodyY = 40, bodyH = 106;
    const fillH = Math.max(0, bodyH * pct);
    const fillY = bodyY + bodyH - fillH;

    const fillEl   = document.getElementById('candle-fill');
    const shineEl  = document.getElementById('candle-shine');
    const flameEl  = document.getElementById('candle-flame');
    const puddleEl = document.getElementById('candle-puddle');
    const wickEl   = document.getElementById('candle-wick');

    if (fillEl)  { fillEl.setAttribute('y', fillY);  fillEl.setAttribute('height', fillH); }
    if (shineEl) {
      shineEl.setAttribute('y', fillY + 3);
      shineEl.setAttribute('height', Math.max(0, Math.min(fillH - 6, 36)));
      shineEl.style.display = fillH > 9 ? '' : 'none';
    }

    const burned = current !== null && current <= 0;
    if (flameEl)  flameEl.style.display  = burned ? 'none' : '';
    if (puddleEl) puddleEl.style.display = burned ? ''     : 'none';
    if (wickEl)   wickEl.setAttribute('opacity', burned ? '0.3' : '1');

    const tokenEl = document.getElementById('candle-tokens');
    if (tokenEl) tokenEl.innerHTML = current !== null
      ? `${current} <span>/ ${dailyMax}</span>`
      : `— <span>tokens</span>`;

    const barEl = document.getElementById('token-bar-fill');
    if (barEl) barEl.style.width = current !== null ? (pct * 100) + '%' : '0%';

    const burnoutEl = document.getElementById('candle-burnout');
    if (burnoutEl) burnoutEl.style.display = burned ? 'block' : 'none';
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
    const flameEl = document.getElementById('candle-flame');
    const wrapEl  = document.getElementById('candle-svg-wrap');
    if (!flameEl) return;
    const cleanup = () => flameEl.classList.remove('pulse-burn', 'pulse-grow');
    if (type === 'work') {
      flameEl.classList.remove('pulse-burn', 'pulse-grow');
      void flameEl.offsetWidth;
      flameEl.classList.add('pulse-burn');
      flameEl.addEventListener('animationend', cleanup, { once: true });
    } else if (type === 'friend') {
      flameEl.classList.remove('pulse-burn', 'pulse-grow');
      void flameEl.offsetWidth;
      flameEl.classList.add('pulse-grow');
      flameEl.addEventListener('animationend', cleanup, { once: true });
      if (wrapEl) {
        wrapEl.classList.remove('glow');
        void wrapEl.offsetWidth;
        wrapEl.classList.add('glow');
        wrapEl.addEventListener('animationend', () => wrapEl.classList.remove('glow'), { once: true });
      }
    }
  }

  // ── Daily suggestion ──────────────────────────────────
  function checkDailySuggestion(data) {
    if (getTodayTokens(data)) return; // already set today
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
    document.getElementById('suggest-label').textContent = `${moon.name}${cyclePart} — you're probably at ${power} today. Suggested: ${tokens}`;
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
      dateInput.style.borderColor = '#A85C7A';
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

  // ── Settings panel ────────────────────────────────────
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
      document.getElementById('settings-period-date').value   = data.cycleData.lastPeriodStart;
      document.getElementById('settings-cycle-length').value  = data.cycleData.cycleLength || 28;
    } else {
      cycleNameEl.textContent = 'Not set yet';
      cycleModEl.textContent  = '—';
      cycleModEl.className    = 'forecast-mod';
      suggested = Math.max(40, Math.min(120, 80 + moon.modifier));
    }

    document.getElementById('settings-suggested').textContent = suggested;

    // Horoscope
    const birthdayInput = document.getElementById('settings-birthday');
    if (data.birthday) birthdayInput.value = data.birthday;
    const hDivider = document.getElementById('settings-horoscope-divider');
    const hZodiac  = document.getElementById('settings-zodiac-row');
    const hText    = document.getElementById('settings-horoscope-text');
    if (data.birthday) {
      const z = getZodiacSign(data.birthday);
      document.getElementById('settings-zodiac-emoji').textContent = z.emoji;
      document.getElementById('settings-zodiac-name').textContent  = z.name;
      hText.textContent = getDailyHoroscope(z.key, new Date());
      hDivider.style.display = hZodiac.style.display = hText.style.display = '';
    } else {
      hDivider.style.display = hZodiac.style.display = hText.style.display = 'none';
    }

    document.getElementById('settings-modal').classList.remove('hidden');
  }

  function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
  }

  function saveSettings() {
    const dateEl     = document.getElementById('settings-period-date');
    const lengthEl   = document.getElementById('settings-cycle-length');
    const birthdayEl = document.getElementById('settings-birthday');
    if (!dateEl.value) {
      dateEl.style.borderColor = '#A85C7A';
      setTimeout(() => dateEl.style.borderColor = '', 1000);
      return;
    }
    const data = loadData();
    data.cycleData = { lastPeriodStart: dateEl.value, cycleLength: parseInt(lengthEl.value) || 28 };
    if (birthdayEl.value) data.birthday = birthdayEl.value;
    saveData(data);
    updateCandlePhase(data);
    updateHoroscope(data);
    closeSettings();
  }

  // ── Manual token adjust ───────────────────────────────
  function adjustTokens(delta) {
    const data = loadData();
    const td   = getTodayTokens(data);
    if (!td) return;
    td.current = Math.max(0, Math.min(td.dailyMax, td.current + delta));
    saveData(data);
    updateCandleVisual(data);
  }

  // ── Group type cycling ────────────────────────────────
  function cycleGroupType(groupId) {
    const data  = loadData();
    const group = data.groups.find(g => g.id === groupId);
    if (!group) return;
    const idx   = GROUP_TYPE_ORDER.indexOf(group.type || 'neutral');
    group.type  = GROUP_TYPE_ORDER[(idx + 1) % GROUP_TYPE_ORDER.length];
    saveData(data);
    render();
  }

  // ── Color utils ───────────────────────────────────────
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

  // ── Utils ─────────────────────────────────────────────
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

  // ── Avatar utils ──────────────────────────────────────
  function nameHash(name) {
    return name.split('').reduce((h,c) => Math.imul(h,31) + c.charCodeAt(0) | 0, 0);
  }

  // Draw one standing person's SVG elements at center-x=cx, feet at baseY=52
  function _p(cx, type) {
    const P = {
      adult:   { cy:18, r:5.5, n:23.5, hip:36.5, ay:28.4, ax:7,   ae:33.4, lx:3.5, sw:4.5, sw2:4   },
      elderly: { cy:18, r:5.5, n:23.5, hip:36.5, ay:28.4, ax:7,   ae:33.4, lx:3.5, sw:4.5, sw2:4   },
      child:   { cy:27, r:4,   n:31,   hip:40,   ay:34.5, ax:5,   ae:38.5, lx:2.5, sw:3.5, sw2:3   },
      toddler: { cy:33, r:3,   n:36,   hip:43,   ay:39,   ax:3.5, ae:41.5, lx:2,   sw:3,   sw2:2.5 },
    };
    const q = P[type] || P.adult;
    let s = `<circle cx="${cx}" cy="${q.cy}" r="${q.r}" stroke="none"/>
      <line x1="${cx}" y1="${q.n}"  x2="${cx}" y2="${q.hip}" stroke-width="${q.sw}"/>
      <line x1="${cx}" y1="${q.ay}" x2="${cx-q.ax}" y2="${q.ae}" stroke-width="${q.sw2}"/>
      <line x1="${cx}" y1="${q.ay}" x2="${cx+q.ax}" y2="${q.ae}" stroke-width="${q.sw2}"/>
      <line x1="${cx}" y1="${q.hip}" x2="${cx-q.lx}" y2="52" stroke-width="${q.sw2}"/>
      <line x1="${cx}" y1="${q.hip}" x2="${cx+q.lx}" y2="52" stroke-width="${q.sw2}"/>`;
    if (type === 'elderly')
      s += `<line x1="${cx+q.ax}" y1="${q.ae}" x2="${cx+q.ax+5}" y2="52" stroke-width="2.5"/>`;
    return s;
  }

  // Hand positions (right/left) for a person type
  function _hr(cx, t) { return { x: cx + ({adult:7,elderly:7,child:5,toddler:3.5}[t]||7), y: ({adult:33.4,elderly:33.4,child:38.5,toddler:41.5}[t]||33.4) }; }
  function _hl(cx, t) { return { x: cx - ({adult:7,elderly:7,child:5,toddler:3.5}[t]||7), y: ({adult:33.4,elderly:33.4,child:38.5,toddler:41.5}[t]||33.4) }; }

  // Build a family-group SVG
  function _familySVG(figures, vw, color, size, holding) {
    const vh = 56, w = Math.round(size * vw / vh);
    let inner = '';
    if (holding) {
      for (let i = 0; i < figures.length - 1; i++) {
        const a = figures[i], b = figures[i+1];
        const ra = _hr(a.cx, a.t), lb = _hl(b.cx, b.t);
        inner += `<line x1="${ra.x}" y1="${ra.y}" x2="${lb.x}" y2="${lb.y}" stroke-width="3"/>`;
      }
    }
    figures.forEach(f => inner += _p(f.cx, f.t));
    return `<svg viewBox="0 0 ${vw} ${vh}" width="${w}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <g stroke="${color}" stroke-linecap="round" stroke-linejoin="round" fill="${color}">${inner}</g></svg>`;
  }

  // 6 family configurations (matching reference image)
  const FAMILY_DEFS = [
    { f:[{cx:14,t:'adult'},{cx:36,t:'adult'},{cx:56,t:'child'}],                              vw:70, h:false }, // adult+adult+child
    { f:[{cx:13,t:'adult'},{cx:37,t:'elderly'}],                                              vw:56, h:false }, // adult+elderly w/ cane
    { f:[{cx:11,t:'child'},{cx:28,t:'adult'},{cx:51,t:'adult'},{cx:68,t:'child'}],            vw:80, h:false }, // 2+2 family
    { f:[{cx:14,t:'adult'},{cx:31,t:'toddler'},{cx:49,t:'adult'}],                            vw:63, h:false }, // adult+toddler+adult
    { f:[{cx:14,t:'adult'},{cx:38,t:'adult'}],                                                vw:52, h:false }, // couple
    { f:[{cx:11,t:'child'},{cx:28,t:'adult'},{cx:51,t:'adult'},{cx:68,t:'child'}],            vw:80, h:true  }, // 4 holding hands
  ];

  // Jumping figure (Friends)
  function svgJumping(color, size) {
    const vw=40, vh=52, w=Math.round(size*vw/vh);
    return `<svg viewBox="0 0 ${vw} ${vh}" width="${w}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <g stroke="${color}" stroke-linecap="round" stroke-linejoin="round" fill="${color}">
        <circle cx="21" cy="8" r="6" stroke="none"/>
        <line x1="21" y1="14" x2="20" y2="30" stroke-width="5"/>
        <line x1="21" y1="19" x2="33" y2="7"  stroke-width="4"/>
        <line x1="21" y1="19" x2="9"  y2="23" stroke-width="4"/>
        <line x1="20" y1="30" x2="16" y2="44" stroke-width="4"/>
        <line x1="20" y1="30" x2="29" y2="40" stroke-width="4"/>
        <line x1="29" y1="40" x2="22" y2="49" stroke-width="4"/>
      </g></svg>`;
  }

  // Briefcase standing (Work)
  function svgBriefcaseStand(color, size) {
    const vw=42, vh=56, w=Math.round(size*vw/vh);
    return `<svg viewBox="0 0 ${vw} ${vh}" width="${w}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <g stroke="${color}" stroke-linecap="round" stroke-linejoin="round" fill="${color}">
        <circle cx="19" cy="8" r="6" stroke="none"/>
        <line x1="19" y1="14" x2="19" y2="31" stroke-width="5"/>
        <line x1="19" y1="20" x2="10" y2="27" stroke-width="4"/>
        <line x1="19" y1="20" x2="28" y2="26" stroke-width="4"/>
        <rect x="25" y="27" width="12" height="8" rx="2" stroke="none"/>
        <path d="M28 27 L28 25 Q29.5 23 31 25 L31 27" fill="none" stroke-width="2"/>
        <line x1="19" y1="31" x2="15" y2="52" stroke-width="4"/>
        <line x1="19" y1="31" x2="23" y2="52" stroke-width="4"/>
      </g></svg>`;
  }

  // Briefcase running (Work)
  function svgBriefcaseRun(color, size) {
    const vw=52, vh=54, w=Math.round(size*vw/vh);
    return `<svg viewBox="0 0 ${vw} ${vh}" width="${w}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <g stroke="${color}" stroke-linecap="round" stroke-linejoin="round" fill="${color}">
        <circle cx="33" cy="8" r="6" stroke="none"/>
        <line x1="31" y1="14" x2="24" y2="30" stroke-width="5"/>
        <line x1="29" y1="20" x2="42" y2="15" stroke-width="4"/>
        <rect x="39" y="8"  width="12" height="9" rx="2" stroke="none"/>
        <line x1="27" y1="22" x2="14" y2="26" stroke-width="4"/>
        <rect x="7"  y="21" width="9"  height="7" rx="2" stroke="none"/>
        <line x1="24" y1="30" x2="18" y2="46" stroke-width="4"/>
        <line x1="18" y1="46" x2="10" y2="52" stroke-width="4"/>
        <line x1="24" y1="30" x2="33" y2="42" stroke-width="4"/>
        <line x1="33" y1="42" x2="41" y2="36" stroke-width="4"/>
      </g></svg>`;
  }

  function buildAvatarSVG(name, color, size, groupType) {
    const h = Math.abs(nameHash(name));
    if (groupType === 'friend')  return svgJumping(color, size);
    if (groupType === 'work')    return h % 2 === 0 ? svgBriefcaseStand(color, size) : svgBriefcaseRun(color, size);
    if (groupType === 'family') {
      const d = FAMILY_DEFS[h % FAMILY_DEFS.length];
      return _familySVG(d.f, d.vw, color, size, d.h);
    }
    // neutral: cycle through all poses
    const all = [
      (c,s) => svgJumping(c, s),
      (c,s) => svgBriefcaseStand(c, s),
      (c,s) => svgBriefcaseRun(c, s),
      (c,s) => _familySVG(FAMILY_DEFS[0].f, FAMILY_DEFS[0].vw, c, s, false),
      (c,s) => _familySVG(FAMILY_DEFS[4].f, FAMILY_DEFS[4].vw, c, s, false),
      (c,s) => _familySVG(FAMILY_DEFS[3].f, FAMILY_DEFS[3].vw, c, s, false),
    ];
    return all[h % all.length](color, size);
  }

  function buildCentralSVG(size=52) {
    const vw=40, vh=52, w=Math.round(size*vw/vh);
    return `<svg viewBox="0 0 ${vw} ${vh}" width="${w}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#4A5228" stroke-linecap="round" stroke-linejoin="round" fill="#4A5228">
        <circle cx="20" cy="8" r="6.5" stroke="none"/>
        <line x1="20" y1="15" x2="20" y2="31" stroke-width="5"/>
        <line x1="20" y1="20" x2="11" y2="27" stroke-width="4"/>
        <line x1="20" y1="20" x2="29" y2="27" stroke-width="4"/>
        <line x1="20" y1="31" x2="16" y2="49" stroke-width="4"/>
        <line x1="20" y1="31" x2="24" y2="49" stroke-width="4"/>
      </g>
      <path d="M20 3 L21.3 7 L25 7 L22.1 9.1 L23.2 13 L20 10.8 L16.8 13 L17.9 9.1 L15 7 L18.7 7 Z" fill="#D4882A" stroke="none"/>
    </svg>`;
  }

  function crowdPosition(index) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const r = 55 + 22 * Math.sqrt(index);
    const a = index * goldenAngle;
    return { dx: r * Math.cos(a), dy: r * Math.sin(a) };
  }

  function avatarSize(count) {
    return Math.round(28 + Math.min(count - 1, 6) * 7);
  }

  // ── Day transition ────────────────────────────────────
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

  // ── Data ──────────────────────────────────────────────
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

    // Migrate v2 (flat data.people → groups)
    if (!data.groups && Array.isArray(data.people)) {
      data.groups = [{ id: uid(), name: 'General', people: data.people, color: GROUP_COLORS[0] }];
      delete data.people;
    }

    if (!data.regulars) data.regulars = [];
    if (!data.groups)   data.groups   = [];

    // Ensure every group has a color and a type
    data.groups.forEach((g, i) => {
      if (!g.color) g.color = GROUP_COLORS[i % GROUP_COLORS.length];
      if (!g.type) {
        const n = (g.name || '').toLowerCase();
        if (n.includes('work') || n.includes('office') || n.includes('professional') || n.includes('colleague')) g.type = 'work';
        else if (n.includes('family') || n.includes('fam') || n.includes('parent') || n.includes('sibling'))     g.type = 'family';
        else g.type = 'friend';
      }
    });

    if (!data.tokenDays) data.tokenDays = {};
    if (!data.personCosts) data.personCosts = {};
    if (data.birthday === undefined) data.birthday = null;
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

  // ── Crowd rendering ───────────────────────────────────
  function renderCrowd(data) {
    const canvas = document.getElementById('crowd-canvas');

    // Build / refresh central figure
    if (!canvas.querySelector('.central-figure')) {
      const fig = document.createElement('div');
      fig.className = 'central-figure';
      fig.innerHTML = buildCentralSVG(52);
      canvas.appendChild(fig);
      const lbl = document.createElement('div');
      lbl.className = 'central-label';
      lbl.textContent = 'you';
      canvas.appendChild(lbl);
    }

    // Remove all existing crowd avatars
    canvas.querySelectorAll('.crowd-avatar').forEach(el => el.remove());

    const today = todayStr();
    const todayCounts = data.days[today] || {};
    const W = canvas.offsetWidth  || 480;
    const H = canvas.offsetHeight || 260;

    let idx = 0;
    data.groups.forEach(group => {
      group.people.forEach(name => {
        const count = todayCounts[name] || 0;
        if (count > 0) {
          addAvatarToCanvas(name, idx, count, group.color, false, W, H, getGroupType(group));
          idx++;
        }
      });
    });

    const total = Object.values(todayCounts).reduce((s,v) => s+v, 0);
    updateCrowdLabel(total);
  }

  function addAvatarToCanvas(name, index, count, color, animate, W, H, groupType) {
    const canvas = document.getElementById('crowd-canvas');
    const cx = W / 2;
    const cy = H / 2;
    const pos  = crowdPosition(index);
    const size = avatarSize(count);

    const div = document.createElement('div');
    div.className = 'crowd-avatar';
    div.dataset.name = name;
    div.dataset.groupType = groupType || 'neutral';
    div.innerHTML = buildAvatarSVG(name, color, size, groupType || 'neutral') +
      `<div class="avatar-tip">${escapeHtml(name)} · ${count}</div>`;

    const finalLeft = cx + pos.dx;
    const finalTop  = cy + pos.dy;

    if (animate) {
      const scale = Math.max(3, 180 / Math.max(1, Math.hypot(pos.dx, pos.dy)));
      div.style.left      = (cx + pos.dx * scale) + 'px';
      div.style.top       = (cy + pos.dy * scale) + 'px';
      div.style.transform = 'translate(-50%, -50%) scale(0.1)';
      div.style.opacity   = '0';
      canvas.appendChild(div);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        div.style.transition = [
          'left 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          'top 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          'transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          'opacity 0.4s ease'
        ].join(', ');
        div.style.left      = finalLeft + 'px';
        div.style.top       = finalTop  + 'px';
        div.style.transform = 'translate(-50%, -50%) scale(1)';
        div.style.opacity   = '1';
      }));
    } else {
      div.style.left      = finalLeft + 'px';
      div.style.top       = finalTop  + 'px';
      div.style.transform = 'translate(-50%, -50%)';
      div.style.opacity   = '1';
      canvas.appendChild(div);
    }
  }

  function pulseAvatar(name, count) {
    const canvas = document.getElementById('crowd-canvas');
    const div = Array.from(canvas.querySelectorAll('.crowd-avatar'))
      .find(el => el.dataset.name === name);
    if (!div) return;

    const size = avatarSize(count);
    const svg  = div.querySelector('svg');
    if (svg) {
      const vb = (svg.getAttribute('viewBox') || '0 0 40 52').split(' ');
      const vw = parseFloat(vb[2]) || 40, vh = parseFloat(vb[3]) || 52;
      svg.setAttribute('height', size);
      svg.setAttribute('width', Math.round(size * vw / vh));
    }
    const tip = div.querySelector('.avatar-tip');
    if (tip) tip.textContent = `${name} · ${count}`;

    div.classList.remove('pulse');
    void div.offsetWidth;
    div.classList.add('pulse');
  }

  function updateCrowdLabel(total) {
    const el = document.getElementById('crowd-stats');
    if (!el) return;
    el.textContent = total === 0
      ? 'No conversations yet today'
      : `${total} conversation${total === 1 ? '' : 's'} today`;
  }

  // ── Main render ───────────────────────────────────────
  function render() {
    const data = loadData();
    const todayCounts = data.days[todayStr()] || {};
    const container = document.getElementById('groups-container');
    container.innerHTML = '';

    let grandTotal = 0;

    data.groups.forEach(group => {
      const groupTotal = group.people.reduce((s,n) => s + (todayCounts[n] || 0), 0);
      grandTotal += groupTotal;

      const section = document.createElement('div');
      section.className = 'group-section';
      section.dataset.groupId = group.id;

      // Header
      const header = document.createElement('div');
      header.className = 'group-header';

      // Left side: color swatch + editable name
      const left = document.createElement('div');
      left.className = 'group-header-left';

      const swatch = document.createElement('label');
      swatch.className = 'color-swatch';
      swatch.style.background = group.color;
      swatch.title = 'Change group color';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.className = 'color-input';
      colorInput.value = group.color;
      colorInput.addEventListener('input', e => {
        const newColor = e.target.value;
        swatch.style.background = newColor;
        const d = loadData();
        const g = d.groups.find(x => x.id === group.id);
        if (g) { g.color = newColor; saveData(d); renderCrowd(d); }
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

      // Right side: group total + type + delete
      const right = document.createElement('div');
      right.className = 'group-header-right';
      right.innerHTML = `<span class="group-total"><b>${groupTotal}</b> today</span>`;
      const typeBtn = document.createElement('button');
      typeBtn.className = 'group-type-btn';
      const gType = getGroupType(group);
      typeBtn.title = `Type: ${gType} — click to change`;
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

      // Body (drop zone)
      const body = document.createElement('div');
      body.className = 'group-body';
      body.addEventListener('dragover',  e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
      body.addEventListener('dragenter', e => { if (!body.contains(e.relatedTarget)) body.classList.add('drag-over'); });
      body.addEventListener('dragleave', e => { if (!body.contains(e.relatedTarget)) body.classList.remove('drag-over'); });
      body.addEventListener('drop',      e => onDrop(e, group.id));

      const COST_DEFAULTS = { work: 1, friend: -1, family: 0, neutral: 0 };
      group.people.forEach(name => {
        const count = todayCounts[name] || 0;
        const isRegular = data.regulars.includes(name);
        const personCost = (data.personCosts && data.personCosts[name] !== undefined)
          ? data.personCosts[name]
          : (COST_DEFAULTS[gType] ?? 0);
        const costColor = personCost > 0 ? '#A85C7A' : personCost < 0 ? '#7A8C3C' : '#b0a090';
        const card = document.createElement('div');
        card.className = 'person-card';
        card.draggable = true;
        card.dataset.name = name;
        card.innerHTML = `
          <span class="drag-handle" title="Drag to move">⠿</span>
          <div class="person-name">
            ${escapeHtml(name)}
            ${isRegular ? '<span class="streak-badge">🔥 regular</span>' : ''}
          </div>
          <input type="number" class="cost-input" title="Token cost per convo (+drains / −restores)"
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
          e.target.style.color = val > 0 ? '#A85C7A' : val < 0 ? '#7A8C3C' : '#b0a090';
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
      input.placeholder = '+ Add person...';
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
    updateHoroscope(data);
  }

  // ── Drag & Drop ───────────────────────────────────────
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

  // ── Actions ───────────────────────────────────────────
  function addPerson(groupId, inputEl) {
    const name = inputEl.value.trim();
    if (!name) return;
    const data = loadData();
    if (getAllPeople(data).some(p => p.toLowerCase() === name.toLowerCase())) {
      inputEl.style.color = '#e55';
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

    // Update count display in list
    const countEl = document.getElementById('cnt-' + CSS.escape(name));
    if (countEl) {
      countEl.textContent = count;
      countEl.classList.remove('bump');
      void countEl.offsetWidth;
      countEl.classList.add('bump');
    }

    // Update group total label
    const group = data.groups.find(g => g.people.includes(name));
    if (group) {
      const gTotal = group.people.reduce((s,n) => s + (data.days[today][n] || 0), 0);
      const sec = document.querySelector(`.group-section[data-group-id="${group.id}"]`);
      if (sec) { const b = sec.querySelector('.group-total b'); if (b) b.textContent = gTotal; }
    }

    // Update grand total
    const grandTotal = getAllPeople(data).reduce((s,n) => s + (data.days[today][n] || 0), 0);
    document.getElementById('total-count').textContent = grandTotal;

    // Update crowd
    if (wasZero) {
      // New person walks in
      const canvas = document.getElementById('crowd-canvas');
      const W = canvas.offsetWidth  || 480;
      const H = canvas.offsetHeight || 260;
      const idx = canvas.querySelectorAll('.crowd-avatar').length;
      const color = (group && group.color) || GROUP_COLORS[0];
      addAvatarToCanvas(name, idx, 1, color, true, W, H, group ? getGroupType(group) : 'neutral');
    } else {
      // Existing person pulses and grows
      pulseAvatar(name, count);
    }

    updateCrowdLabel(grandTotal);

    // Token update based on per-person cost
    const groupType = group ? getGroupType(group) : 'neutral';
    const todayTd = data.tokenDays && data.tokenDays[today];
    if (todayTd) {
      const cost = getPersonCost(name, groupType, data);
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
        !confirm(`Delete "${group.name}" and remove its ${group.people.length} ${group.people.length===1?'person':'people'}?`)) return;
    data.groups = data.groups.filter(g => g.id !== groupId);
    saveData(data);
    render();
  }

  function resetCounts() {
    if (!confirm("Reset today's conversation counts and candle to 0?")) return;
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

  // ── History ───────────────────────────────────────────
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
      const total = Object.values(counts).reduce((s,v) => s+v, 0);
      const rows = Object.entries(counts)
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
          ${rows || '<div style="color:#ccc;font-size:13px;padding:4px 0">No conversations logged.</div>'}
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

  // ── Init ──────────────────────────────────────────────
  document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  render();

  // ── Vibe section toggle ───────────────────────────────
  function toggleVibe() {
    const body   = document.getElementById('vibe-body');
    const toggle = document.getElementById('vibe-toggle');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : '';
    toggle.classList.toggle('open', !isOpen);
    localStorage.setItem('vibe_collapsed', isOpen ? '1' : '0');
  }

  // ── Export data ───────────────────────────────────────
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

  // Restore vibe section collapsed state
  if (localStorage.getItem('vibe_collapsed') === '1') {
    const body   = document.getElementById('vibe-body');
    const toggle = document.getElementById('vibe-toggle');
    if (body)   body.style.display = 'none';
    if (toggle) toggle.classList.add('open');
  }

  // Daily token suggestion on first open
  const _initData = loadData();
  checkDailySuggestion(_initData);
