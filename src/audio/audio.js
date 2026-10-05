// All Web Audio synthesis, ported verbatim from the original single-file game.
// Module-scoped state replaces the old globals; behavior is unchanged.

// ─── shared UI audio context (lobby + results + danger tick) ───
let _uiAudioCtx = null;
let _lobbyNodes = [];
let _lobbyGain = null;
let _lobbyIntervals = [];

function getUIAudioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!_uiAudioCtx) _uiAudioCtx = new AC();
  if (_uiAudioCtx.state === 'suspended') _uiAudioCtx.resume().catch(() => {});
  return _uiAudioCtx;
}

export function stopLobbyMusic() {
  _lobbyIntervals.forEach(id => clearInterval(id));
  _lobbyIntervals = [];
  if (_lobbyGain) {
    const ctx = _uiAudioCtx;
    if (ctx) {
      const now = ctx.currentTime;
      _lobbyGain.gain.cancelScheduledValues(now);
      _lobbyGain.gain.setValueAtTime(_lobbyGain.gain.value, now);
      _lobbyGain.gain.linearRampToValueAtTime(0, now + 0.5);
    }
    const ref = _lobbyGain;
    setTimeout(() => { try { ref.disconnect(); } catch (e) {} }, 700);
    _lobbyGain = null;
  }
  _lobbyNodes.forEach(n => { try { n.stop(); } catch (e) {} });
  _lobbyNodes = [];
}

function startLobbyMusic() {
  const ctx = getUIAudioCtx();
  if (!ctx) return;
  if (ctx.state !== 'running') return;
  stopLobbyMusic();

  _lobbyGain = ctx.createGain();
  _lobbyGain.gain.setValueAtTime(0.2, ctx.currentTime);
  _lobbyGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.08);
  _lobbyGain.connect(ctx.destination);

  const BPM = 112;
  const BEAT = 60 / BPM;
  const S8 = BEAT / 2;
  const S16 = BEAT / 4;

  function uiNote(freq, when, dur, vol, type = 'triangle') {
    if (!_lobbyGain) return;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 0.85);
    osc.connect(g); g.connect(_lobbyGain);
    osc.start(when); osc.stop(when + dur + 0.04);
    _lobbyNodes.push(osc);
  }

  function uiKick(when) {
    if (!_lobbyGain) return;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, when);
    osc.frequency.exponentialRampToValueAtTime(40, when + 0.08);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(0.45, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.14);
    osc.connect(g); g.connect(_lobbyGain);
    osc.start(when); osc.stop(when + 0.18);
    _lobbyNodes.push(osc);
  }

  function uiHat(when, vol = 0.08) {
    if (!_lobbyGain) return;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.025), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(), g = ctx.createGain(), fil = ctx.createBiquadFilter();
    fil.type = 'highpass'; fil.frequency.value = 7000;
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.022);
    src.buffer = buf; src.connect(fil); fil.connect(g); g.connect(_lobbyGain);
    src.start(when); src.stop(when + 0.04);
  }

  const melodyA = [
    [523.3, 0, 0.5, 0.16], [659.3, 0.5, 0.5, 0.15],
    [784, 1, 0.75, 0.17], [659.3, 1.75, 0.25, 0.13],
    [523.3, 2, 0.5, 0.15], [440, 2.5, 0.5, 0.13],
    [392, 3, 1.0, 0.15],
  ];
  const melodyB = [
    [440, 0, 0.5, 0.14], [523.3, 0.5, 0.5, 0.15],
    [659.3, 1, 0.5, 0.16], [523.3, 1.5, 0.5, 0.14],
    [392, 2, 0.5, 0.13], [329.6, 2.5, 0.5, 0.12],
    [261.6, 3, 1.0, 0.15],
  ];
  const bassSeq = [65.4, 65.4, 98, 65.4, 87.3, 65.4, 98, 87.3];
  const arpSeq = [523.3, 659.3, 784, 659.3, 523.3, 440, 392, 440];

  const BARS = 4;
  const LOOP_S = BARS * 4 * BEAT;

  function scheduleLoop(t0) {
    if (!_lobbyGain) return;
    for (let bar = 0; bar < BARS; bar++) {
      const bt = t0 + bar * 4 * BEAT;
      for (let b = 0; b < 4; b++) {
        const qt = bt + b * BEAT;
        uiKick(qt);
        for (let s = 0; s < 4; s++) uiHat(qt + s * S16, s % 2 === 0 ? 0.09 : 0.05);
      }
      for (let i = 0; i < 8; i++) {
        uiNote(bassSeq[i % bassSeq.length], bt + i * S8, S8 * 0.6, 0.18, 'sawtooth');
      }
      for (let i = 0; i < 16; i++) {
        uiNote(arpSeq[i % arpSeq.length], bt + i * S16, S16 * 0.55, 0.07);
      }
      const phrase = bar % 2 === 0 ? melodyA : melodyB;
      phrase.forEach(([freq, sb, dur, vol]) => {
        uiNote(freq, bt + sb * BEAT, dur * BEAT * 0.88, vol, 'square');
      });
    }
  }

  const t0 = ctx.currentTime + 0.01;
  scheduleLoop(t0);
  let nextLoop = t0 + LOOP_S;
  const loopId = setInterval(() => {
    if (!_lobbyGain) return;
    scheduleLoop(nextLoop);
    nextLoop += LOOP_S;
  }, (LOOP_S - 0.3) * 1000);
  _lobbyIntervals.push(loopId);
}

export function primeLobbyMusic() {
  const ctx = getUIAudioCtx();
  if (!ctx) return;

  if (ctx.state === 'running') {
    if (!_lobbyGain) startLobbyMusic();
    return;
  }

  ctx.resume()
    .then(() => {
      if (!_lobbyGain && ctx.state === 'running') startLobbyMusic();
    })
    .catch(() => {});
}

export function armInitialLobbyMusic() {
  const tryStart = () => {
    primeLobbyMusic();
    if (_uiAudioCtx && _uiAudioCtx.state === 'running' && _lobbyGain) {
      window.removeEventListener('pointerdown', tryStart);
      window.removeEventListener('touchstart', tryStart);
      window.removeEventListener('keydown', tryStart);
      window.removeEventListener('mousemove', tryStart);
    }
  };

  tryStart();
  if (_lobbyGain) return;

  window.addEventListener('pointerdown', tryStart, { once: true });
  window.addEventListener('touchstart', tryStart, { once: true });
  window.addEventListener('keydown', tryStart, { once: true });
  window.addEventListener('mousemove', tryStart, { once: true });
}

export function playResultsWinSound() {
  const ctx = getUIAudioCtx();
  if (!ctx) return;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.3);
  g.connect(ctx.destination);

  const now = ctx.currentTime;
  const fanfare = [
    [392, 0.0, 0.18, 0.5], [523.3, 0.14, 0.18, 0.5],
    [659.3, 0.28, 0.18, 0.5], [784, 0.42, 0.28, 0.55],
    [1046.5, 0.58, 0.50, 0.5], [784, 0.72, 0.18, 0.4],
    [1046.5, 0.88, 0.70, 0.55],
  ];
  fanfare.forEach(([freq, when, dur, vol]) => {
    const osc = ctx.createOscillator(), og = ctx.createGain();
    osc.type = 'triangle'; osc.frequency.value = freq;
    og.gain.setValueAtTime(0.0001, now + when);
    og.gain.linearRampToValueAtTime(vol, now + when + 0.01);
    og.gain.exponentialRampToValueAtTime(0.0001, now + when + dur);
    osc.connect(og); og.connect(g);
    osc.start(now + when); osc.stop(now + when + dur + 0.05);
  });
  [[1046.5, 0, 0.12, 0.22], [1318.5, 0.14, 0.1, 0.18], [1568, 0.28, 0.14, 0.16], [2093, 0.58, 0.2, 0.14]].forEach(([freq, when, dur, vol]) => {
    const osc = ctx.createOscillator(), og = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    og.gain.setValueAtTime(0.0001, now + when);
    og.gain.linearRampToValueAtTime(vol, now + when + 0.005);
    og.gain.exponentialRampToValueAtTime(0.0001, now + when + dur);
    osc.connect(og); og.connect(g);
    osc.start(now + when); osc.stop(now + when + dur + 0.03);
  });
  setTimeout(() => { try { g.disconnect(); } catch (e) {} }, 2000);
}

export function playResultsLoseSound() {
  const ctx = getUIAudioCtx();
  if (!ctx) return;
  const g = ctx.createGain();
  g.gain.value = 0.28;
  g.connect(ctx.destination);
  const now = ctx.currentTime;
  [[392, 0.00, 0.22, 0.5], [349.2, 0.20, 0.22, 0.5],
   [311.1, 0.40, 0.22, 0.5], [261.6, 0.60, 0.55, 0.55]].forEach(([freq, when, dur, vol]) => {
    const osc = ctx.createOscillator(), og = ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.value = freq;
    og.gain.setValueAtTime(0.0001, now + when);
    og.gain.linearRampToValueAtTime(vol, now + when + 0.015);
    og.gain.exponentialRampToValueAtTime(0.0001, now + when + dur);
    osc.connect(og); og.connect(g);
    osc.start(now + when); osc.stop(now + when + dur + 0.05);
  });
  setTimeout(() => { try { g.disconnect(); } catch (e) {} }, 1500);
}

// ─── Phase One danger tick ───
let _dangerCtx = null;

export function playDangerTick(secondsLeft) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!_dangerCtx) _dangerCtx = new AudioContextClass();
  const ctx = _dangerCtx;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  const now = ctx.currentTime;
  const volume = secondsLeft === 3 ? 0.55 : secondsLeft === 2 ? 0.7 : 0.9;

  [[0, 180, 45, volume], [0.1, 140, 38, volume * 0.65]].forEach(([offset, startFreq, endFreq, gain]) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now + offset);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + offset + 0.09);
    g.gain.setValueAtTime(0.0001, now + offset);
    g.gain.linearRampToValueAtTime(gain, now + offset + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.15);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.2);
  });

  const beep = ctx.createOscillator();
  const bg = ctx.createGain();
  beep.type = 'square';
  beep.frequency.value = secondsLeft === 1 ? 1400 : 1100;
  bg.gain.setValueAtTime(0.0001, now);
  bg.gain.linearRampToValueAtTime(volume * 0.45, now + 0.005);
  bg.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  beep.connect(bg);
  bg.connect(ctx.destination);
  beep.start(now);
  beep.stop(now + 0.1);
}

// ─── Phase Two SFX + music ───
let phaseTwoAudioContext = null;
let phaseTwoMasterGain = null;
let musicBassInterval = null;
let musicMelodyInterval = null;
let musicPulseInterval = null;
let musicNodes = [];
let musicMusicGain = null;

export function ensurePhaseTwoAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!phaseTwoAudioContext) {
    phaseTwoAudioContext = new AudioContextClass();
    phaseTwoMasterGain = phaseTwoAudioContext.createGain();
    phaseTwoMasterGain.gain.value = 0.14;
    phaseTwoMasterGain.connect(phaseTwoAudioContext.destination);
  }

  if (phaseTwoAudioContext.state === 'suspended') {
    phaseTwoAudioContext.resume().catch(() => {});
  }

  return phaseTwoAudioContext;
}

function playPhaseTwoTone({
  frequency = 440,
  duration = 0.12,
  type = 'triangle',
  volume = 0.12,
  when = 0,
  endFrequency = null
} = {}) {
  const ctx = ensurePhaseTwoAudio();
  if (!ctx || !phaseTwoMasterGain) return;

  const startAt = ctx.currentTime + when;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  if (endFrequency !== null) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFrequency, 1), startAt + duration);
  }

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(phaseTwoMasterGain);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.03);
}

export function playPhaseTwoStartSound() {
  playPhaseTwoTone({ frequency: 220, duration: 0.18, type: 'triangle', volume: 0.08 });
  playPhaseTwoTone({ frequency: 330, duration: 0.1, when: 0.05, type: 'triangle', volume: 0.08 });
  playPhaseTwoTone({ frequency: 494, duration: 0.16, when: 0.12, type: 'sawtooth', volume: 0.07, endFrequency: 622 });
}

export function playPhaseTwoHitSound() {
  playPhaseTwoTone({ frequency: 392, duration: 0.08, type: 'triangle', volume: 0.1 });
  playPhaseTwoTone({ frequency: 523.25, duration: 0.08, when: 0.08, type: 'triangle', volume: 0.1 });
  playPhaseTwoTone({ frequency: 659.25, duration: 0.14, when: 0.16, type: 'triangle', volume: 0.09 });
}

export function playPhaseTwoMissSound() {
  playPhaseTwoTone({ frequency: 210, duration: 0.12, type: 'sawtooth', volume: 0.08, endFrequency: 150 });
  playPhaseTwoTone({ frequency: 160, duration: 0.1, when: 0.05, type: 'square', volume: 0.05, endFrequency: 110 });
}

export function playPhaseTwoTickSound() {
  playPhaseTwoTone({ frequency: 880, duration: 0.05, type: 'sine', volume: 0.05 });
}

export function playPhaseTwoWinSound() {
  playPhaseTwoTone({ frequency: 392, duration: 0.12, type: 'triangle', volume: 0.09 });
  playPhaseTwoTone({ frequency: 523.25, duration: 0.12, when: 0.08, type: 'triangle', volume: 0.09 });
  playPhaseTwoTone({ frequency: 659.25, duration: 0.18, when: 0.16, type: 'triangle', volume: 0.08 });
  playPhaseTwoTone({ frequency: 784, duration: 0.24, when: 0.26, type: 'triangle', volume: 0.08 });
}

export function playPhaseTwoLoseSound() {
  playPhaseTwoTone({ frequency: 392, duration: 0.12, type: 'sawtooth', volume: 0.07, endFrequency: 240 });
  playPhaseTwoTone({ frequency: 261.63, duration: 0.16, when: 0.08, type: 'triangle', volume: 0.06, endFrequency: 180 });
}

export function startPhaseTwoMusic() {
  const ctx = ensurePhaseTwoAudio();
  if (!ctx) return;
  stopPhaseTwoMusic();

  musicMusicGain = ctx.createGain();
  musicMusicGain.gain.setValueAtTime(0, ctx.currentTime);
  musicMusicGain.gain.linearRampToValueAtTime(0.30, ctx.currentTime + 0.25);
  musicMusicGain.connect(ctx.destination);

  const BPM = 138;
  const BEAT = 60 / BPM;
  const S8 = BEAT / 2;
  const S16 = BEAT / 4;

  function tone(freq, when, dur, vol, type = 'square', detune = 0) {
    if (!musicMusicGain) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type; osc.frequency.value = freq; osc.detune.value = detune;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 0.82);
    osc.connect(g); g.connect(musicMusicGain);
    osc.start(when); osc.stop(when + dur + 0.03);
  }

  function kick(when) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, when);
    osc.frequency.exponentialRampToValueAtTime(38, when + 0.07);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(0.65, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.14);
    osc.connect(g); g.connect(musicMusicGain);
    osc.start(when); osc.stop(when + 0.18);
  }

  function snare(when) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.10, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(), g = ctx.createGain(), fil = ctx.createBiquadFilter();
    fil.type = 'bandpass'; fil.frequency.value = 2200; fil.Q.value = 0.8;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(0.32, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.08);
    src.buffer = buf;
    src.connect(fil); fil.connect(g); g.connect(musicMusicGain);
    src.start(when); src.stop(when + 0.12);
  }

  function hat(when, vol) {
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(), g = ctx.createGain(), fil = ctx.createBiquadFilter();
    fil.type = 'highpass'; fil.frequency.value = 8000;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.025);
    src.buffer = buf;
    src.connect(fil); fil.connect(g); g.connect(musicMusicGain);
    src.start(when); src.stop(when + 0.04);
  }

  const melPhraseA = [
    [523.3, 0, 0.5, 0.22], [587.3, 0.5, 0.5, 0.20],
    [698.5, 1, 0.75, 0.24], [587.3, 1.75, 0.25, 0.18],
    [523.3, 2, 0.5, 0.20], [466.2, 2.5, 0.5, 0.18],
    [440, 3, 0.5, 0.18], [466.2, 3.5, 0.5, 0.20],
  ];
  const melPhraseB = [
    [523.3, 0, 0.5, 0.22], [440, 0.5, 0.5, 0.18],
    [392, 1, 0.5, 0.18], [440, 1.5, 0.5, 0.20],
    [523.3, 2, 1.0, 0.24], [587.3, 3, 0.5, 0.20],
    [698.5, 3.5, 0.5, 0.22],
  ];

  const bassLine = [87.3, 87.3, 130.8, 87.3, 116.5, 87.3, 130.8, 116.5];
  const arp = [349.2, 523.3, 698.5, 523.3, 440, 659.3, 880, 659.3];

  const BARS = 4;
  const LOOP_SECS = BARS * 4 * BEAT;

  function scheduleLoop(t0) {
    for (let bar = 0; bar < BARS; bar++) {
      const bt = t0 + bar * 4 * BEAT;

      for (let b = 0; b < 4; b++) {
        const qt = bt + b * BEAT;
        kick(qt);
        if (b === 1 || b === 3) snare(qt + 0.002);
        for (let s = 0; s < 4; s++) hat(qt + s * S16, s % 2 === 0 ? 0.13 : 0.07);
      }

      kick(bt + BEAT * 2 + S8);

      for (let i = 0; i < 8; i++) {
        const f = bassLine[i % bassLine.length];
        tone(f, bt + i * S8, S8 * 0.65, 0.24, 'sawtooth');
        tone(f / 2, bt + i * S8, S8 * 0.5, 0.10, 'sine');
      }

      for (let i = 0; i < 16; i++) {
        tone(arp[i % arp.length], bt + i * S16, S16 * 0.55, 0.09, 'triangle');
      }

      const phrase = (bar % 2 === 0) ? melPhraseA : melPhraseB;
      phrase.forEach(([freq, startBeat, durBeats, vol]) => {
        const wh = bt + startBeat * BEAT;
        tone(freq, wh, durBeats * BEAT * 0.88, vol, 'square');
        tone(freq * 1.335, wh, durBeats * BEAT * 0.80, vol * 0.35, 'triangle', -5);
      });
    }
  }

  const t0 = ctx.currentTime + 0.05;
  scheduleLoop(t0);
  let nextLoop = t0 + LOOP_SECS;
  musicBassInterval = setInterval(() => {
    if (!musicMusicGain) return;
    scheduleLoop(nextLoop);
    nextLoop += LOOP_SECS;
  }, (LOOP_SECS - 0.3) * 1000);
}

export function stopPhaseTwoMusic() {
  if (musicBassInterval) { clearInterval(musicBassInterval); musicBassInterval = null; }
  if (musicMelodyInterval) { clearInterval(musicMelodyInterval); musicMelodyInterval = null; }
  if (musicPulseInterval) { clearInterval(musicPulseInterval); musicPulseInterval = null; }
  musicNodes.forEach(n => {
    if (n && n._isInterval) clearInterval(n._id);
    else { try { n.stop(); } catch (e) {} }
  });
  musicNodes = [];
  if (musicMusicGain) {
    const ctx = phaseTwoAudioContext;
    if (ctx) {
      const now = ctx.currentTime;
      musicMusicGain.gain.cancelScheduledValues(now);
      musicMusicGain.gain.setValueAtTime(musicMusicGain.gain.value, now);
      musicMusicGain.gain.linearRampToValueAtTime(0, now + 0.35);
    }
    const ref = musicMusicGain;
    setTimeout(() => { try { ref.disconnect(); } catch (e) {} }, 500);
    musicMusicGain = null;
  }
}

export function urgeMusicUp() {
  if (!musicMusicGain || !phaseTwoAudioContext) return;
  const ctx = phaseTwoAudioContext;
  musicMusicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicMusicGain.gain.setValueAtTime(musicMusicGain.gain.value, ctx.currentTime);
  musicMusicGain.gain.linearRampToValueAtTime(0.44, ctx.currentTime + 0.3);

  const fillNotes = [523.3, 587.3, 659.3, 698.5, 784, 880, 987.8, 1046.5];
  let fi = 0;
  function urgFill() {
    if (!phaseTwoAudioContext || !musicMusicGain) return;
    const freq = fillNotes[fi % fillNotes.length];
    fi++;
    const now = phaseTwoAudioContext.currentTime;
    const osc = phaseTwoAudioContext.createOscillator();
    const g = phaseTwoAudioContext.createGain();
    osc.type = 'square'; osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.16, now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(g); g.connect(musicMusicGain);
    osc.start(now); osc.stop(now + 0.1);
  }
  urgFill();
  if (musicMelodyInterval) clearInterval(musicMelodyInterval);
  musicMelodyInterval = setInterval(urgFill, 220);
}
