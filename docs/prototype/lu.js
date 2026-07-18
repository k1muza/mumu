/* Learning Universe — shared data, state, and lesson engine (vanilla JS) */
window.LU = (function () {
  const U = (p) => `universe/${p}`;
  const OBJ = (id) => `assets/learning-objects/${id}.png`;
  const SH = (id) => `universe/decorative/shape_${id}.png`;
  const STAR = 'universe/decorative/star_gold_medium.png';

  const SUBJECTS = [
    { id: 'english', name: 'English World', accent: '#1F97A6', bg: 'linear-gradient(180deg,#E7F6F8 0%,#F6FCFC 60%)', chip: '#E1F4F6',
      plaque: U('ui/world_plaque_english.png'), badge: U('rewards/subject_badge_english.png'), card: U('worlds/english_world_card.png'),
      verbs: 'Listen · blend · read · build · understand', dragon: 'Let’s stretch the sounds out together!',
      ranks: ['Letter Sprout', 'Word Explorer', 'Story Weaver', 'Reading Wizard', 'Word Prodigy'],
      badges: [
        { id: 'sound-explorer', name: 'Sound Explorer', skills: ['Beginning sounds', 'Rhyming', 'Blend sounds', 'Segment sounds'] },
        { id: 'letter-mapper', name: 'Letter–Sound Mapper', skills: ['Sound to letter', 'Upper & lower case', 'Starting letter', 'Letter to object'] },
        { id: 'word-decoder', name: 'Word Decoder', skills: ['Blend words', 'Read CVC words', 'Similar words', 'Match to pictures'] },
        { id: 'sentence-builder', name: 'Sentence Builder', skills: ['Arrange words', 'Read sentences', 'Match to scenes', 'Missing words'] },
        { id: 'story-reader', name: 'Story Reader', skills: ['Read stories', 'Predict next', 'Comprehension', 'Sequence events'] },
      ] },
    { id: 'maths', name: 'Maths World', accent: '#6C3AD6', bg: 'linear-gradient(180deg,#EDE7FB 0%,#F8F4FE 60%)', chip: '#EEE7FB',
      plaque: U('ui/world_plaque_maths.png'), badge: U('rewards/subject_badge_maths.png'), card: U('worlds/maths_world_card.png'),
      verbs: 'Count · compare · arrange · calculate · solve', dragon: 'Can you help me count these stars?',
      ranks: ['Number Rookie', 'Counting Star', 'Number Ninja', 'Maths Wizard', 'Maths Prodigy'],
      badges: [
        { id: 'number-order', name: 'Number Order', skills: ['Smallest & largest', 'Order numbers', 'Greater & smaller', 'Missing numbers'] },
        { id: 'shape-finder', name: 'Shape Finder', skills: ['Name shapes', 'Count sides', 'Corners & curves', 'Count shapes'] },
        { id: 'counting-sets', name: 'Counting Sets', skills: ['Count 0–5', 'Count objects', 'Match the set', 'Empty sets'] },
        { id: 'addition-to-50', name: 'Addition to 50', skills: ['Add tens', 'Add ones', 'Word problems', 'Sums to 50'] },
        { id: 'subtraction-to-50', name: 'Subtraction to 50', skills: ['Take away', 'Subtract tens', 'Word problems', 'Differences'] },
        { id: 'time-teller', name: 'Time Teller', skills: ['O’clock', 'Half past', 'Read a clock', 'One hour later'] },
        { id: 'ordinal-order', name: 'Ordinal Order', skills: ['1st, 2nd, 3rd', 'Positions', 'Which position', 'Ordinal words'] },
        { id: 'measure-explorer', name: 'Measure Explorer', skills: ['Longer & shorter', 'Measure length', 'Compare sizes', 'Order by length'] },
        { id: 'coin-counter', name: 'Coin Counter', skills: ['Name coins', 'Count cents', 'Coin values', 'Total money'] },
      ] },
    { id: 'science', name: 'Science World', accent: '#3E9A34', bg: 'linear-gradient(180deg,#E9F6E2 0%,#F6FBF2 60%)', chip: '#E6F5DF',
      plaque: U('ui/world_plaque_science.png'), badge: U('rewards/subject_badge_science.png'), card: U('worlds/science_world_card.png'),
      verbs: 'Observe · classify · predict · test · explain', dragon: 'What do you predict will happen?',
      ranks: ['Curious Cub', 'Nature Scout', 'Lab Explorer', 'Science Wizard', 'Science Prodigy'],
      badges: [
        { id: 'animal-explorer', name: 'Animal Explorer', skills: ['Habitats', 'Group animals', 'What they eat', 'How they move'] },
        { id: 'plant-detective', name: 'Plant Detective', skills: ['Plant parts', 'How they grow', 'What they need', 'Observe change'] },
        { id: 'weather-watcher', name: 'Weather Watcher', skills: ['Weather types', 'Suitable clothes', 'Daily weather', 'Compare'] },
        { id: 'young-experimenter', name: 'Young Experimenter', skills: ['Predict', 'Observe', 'Compare', 'Cause & effect'] },
        { id: 'body-explorer', name: 'Body Explorer', skills: ['Body parts', 'Senses', 'Healthy habits', 'Movement'] },
      ] },
    { id: 'shona', name: 'Shona World', accent: '#C0791F', bg: 'linear-gradient(180deg,#F8EEDC 0%,#FDF8EF 60%)', chip: '#F6EAD5',
      plaque: U('ui/world_plaque_shona.png'), badge: U('rewards/subject_badge_shona.png'), card: U('worlds/shona_world_card.png'),
      verbs: 'Listen · speak · recognise · communicate', dragon: 'Teach me which greeting we should use!',
      ranks: ['Mutambi', 'Mutauri', 'Shamwari yeShona', 'Gamba', 'Shasha yeShona'],
      badges: [
        { id: 'mhuka-expert', name: 'Mhuka Expert', skills: ['Name animals', 'Match sounds', 'Describe actions', 'Wild & tame'] },
        { id: 'greetings-guide', name: 'Greetings Guide', skills: ['Common greetings', 'Choose a reply', 'Listen & repeat', 'Match to time'] },
        { id: 'mhuri-friend', name: 'Mhuri Friend', skills: ['Family members', 'Family phrases', 'Match descriptions', 'Respectful forms'] },
        { id: 'ngano-listener', name: 'Ngano Listener', skills: ['Listen to stories', 'Identify people', 'Order events', 'Comprehension'] },
        { id: 'musha-explorer', name: 'Musha Explorer', skills: ['Household objects', 'Follow instructions', 'Match actions', 'Everyday talk'] },
      ] },
    { id: 'mandarin', name: 'Mandarin World', accent: '#C33A32', bg: 'linear-gradient(180deg,#FBE8E6 0%,#FEF5F4 60%)', chip: '#F9E4E1',
      plaque: U('ui/world_plaque_mandarin.png'), badge: U('rewards/subject_badge_mandarin.png'), card: U('worlds/mandarin_world_card.png'),
      verbs: 'Listen · tones · speak · recognise · match', dragon: 'Let’s listen carefully to the tone!',
      ranks: ['Xiǎo Student', 'Tone Tamer', 'Character Champ', 'Mandarin Wizard', 'Mandarin Prodigy'],
      badges: [
        { id: 'number-speaker', name: 'Number Speaker', skills: ['Hear numbers', 'Count objects', 'Match symbols', 'Say with dragon'] },
        { id: 'tone-explorer', name: 'Tone Explorer', skills: ['Hear tones', 'Match patterns', 'Repeat', 'Meaning change'] },
        { id: 'colour-listener', name: 'Colour Listener', skills: ['Match colours', 'Identify colours', 'Follow colour', 'Similar sounds'] },
        { id: 'character-spotter', name: 'Character Spotter', skills: ['Match meanings', 'Trace strokes', 'Familiar symbols', 'Spoken & written'] },
        { id: 'greeting-guide', name: 'Greeting Guide', skills: ['Basic greetings', 'Appropriate replies', 'Listen & repeat', 'Match situations'] },
      ] },
  ];

  const DEFAULT = {
    mascot: 'Aki', child: 'Zane', stars: 34, gems: 12, leaves: 7, level: 4,
    done: {
      'english/sentence-builder': true, 'english/story-reader': true,
      'maths/number-order': true, 'maths/counting-sets': true,
      'science/weather-watcher': true, 'science/young-experimenter': true,
      'shona/mhuri-friend': true, 'shona/ngano-listener': true,
      'mandarin/colour-listener': true, 'mandarin/character-spotter': true,
    },
    settings: { speech: false, sfx: true, autoplay: true, narration: 'normal' },
  };

  /* ---- preview mode (parents): reads seed from real progress, writes stay in sessionStorage ---- */
  const PREVIEW_FLAG = 'lu_preview';
  function previewOn() { try { return sessionStorage.getItem(PREVIEW_FLAG) === '1'; } catch (e) { return false; } }
  function clearPreviewData() { try { Object.keys(sessionStorage).filter(k => k.indexOf('lu_preview_') === 0).forEach(k => sessionStorage.removeItem(k)); } catch (e) {} }
  function enterPreview() { try { clearPreviewData(); sessionStorage.setItem(PREVIEW_FLAG, '1'); } catch (e) {} }
  function exitPreview() { try { clearPreviewData(); sessionStorage.removeItem(PREVIEW_FLAG); } catch (e) {} }
  function storeGet(key) { try { if (previewOn()) { const v = sessionStorage.getItem('lu_preview_' + key); if (v !== null) return v; } return localStorage.getItem(key); } catch (e) { return null; } }
  function storeSet(key, val) { try { if (previewOn()) sessionStorage.setItem('lu_preview_' + key, val); else localStorage.setItem(key, val); } catch (e) {} }
  function storeRemove(key) { try { if (previewOn()) sessionStorage.removeItem('lu_preview_' + key); else localStorage.removeItem(key); } catch (e) {} }

  function load() { try { const s = JSON.parse(storeGet('lu_state') || '{}'); return Object.assign({}, DEFAULT, s, { done: Object.assign({}, DEFAULT.done, s.done || {}), settings: Object.assign({}, DEFAULT.settings, s.settings || {}) }); } catch (e) { return JSON.parse(JSON.stringify(DEFAULT)); } }
  function save(s) { try { storeSet('lu_state', JSON.stringify(s)); } catch (e) {} }

  /* banner shown on every page while preview mode is on */
  function previewBanner() {
    if (!previewOn() || document.getElementById('lu-preview-banner')) return;
    const bar = document.createElement('div');
    bar.id = 'lu-preview-banner';
    bar.style.cssText = 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:10px;padding:8px 10px 8px 16px;border-radius:999px;background:#3b2a63;color:#fff;box-shadow:0 10px 28px rgba(30,10,70,.4);font-family:\'Baloo 2\',sans-serif;font-weight:800;font-size:13.5px;white-space:nowrap';
    bar.innerHTML = '<span>👀 Preview mode — progress isn’t saved</span><button id="lu-preview-exit" style="border:0;cursor:pointer;border-radius:999px;padding:6px 13px;background:#fff;color:#6C3AD6;font-family:inherit;font-weight:800;font-size:12.5px">Exit</button>';
    document.body.appendChild(bar);
    document.getElementById('lu-preview-exit').addEventListener('click', () => { exitPreview(); location.reload(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', previewBanner); else previewBanner();

  function sub(id) { return SUBJECTS.find(s => s.id === id) || SUBJECTS[0]; }
  function isDone(state, subId, badgeId) { return !!state.done[subId + '/' + badgeId]; }
  function doneCount(state, subId) { return sub(subId).badges.filter(b => isDone(state, subId, b.id)).length; }
  function recommendedBadge(state, subId) { const s = sub(subId); return s.badges.find(b => !isDone(state, subId, b.id)) || s.badges[0]; }

  /* ---- ranks: derived purely from badges earned; tier thresholds scale with world size ---- */
  const UNIVERSE_RANKS = ['Explorer', 'Adventurer', 'Star Voyager', 'Universe Hero', 'Universe Legend'];
  function rankThresholds(tot) { const t2 = Math.max(2, Math.round(tot * .4)); const t3 = Math.min(tot - 1, Math.max(t2 + 1, Math.round(tot * .75))); return [0, 1, t2, t3, tot]; }
  function rankInfo(names, done, tot) {
    const th = rankThresholds(tot);
    let tier = 0; for (let i = 0; i < th.length; i++) if (done >= th[i]) tier = i;
    const hasNext = tier < names.length - 1;
    return { name: names[tier], tier: tier + 1, total: names.length, next: hasNext ? names[tier + 1] : null, toNext: hasNext ? th[tier + 1] - done : 0, thresholds: th, names };
  }
  function rank(state, subId) { const s = sub(subId); return rankInfo(s.ranks, doneCount(state, subId), s.badges.length); }
  function universeRank(state) { let done = 0, tot = 0; SUBJECTS.forEach(s => { done += doneCount(state, s.id); tot += s.badges.length; }); return rankInfo(UNIVERSE_RANKS, done, tot); }

  function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

  /* ---- activity builders ---- */
  const C = (o) => Object.assign({ t: 'choice', bad: 'Not quite — have another try!', audio: false, stimulus: null, reveal: false }, o);
  const L = (w) => ({ t: 'listen', word: w, img: OBJ(w) });
  const Bw = (w) => ({ t: 'build', word: w });
  const pic = (prompt, correct, wrongs, good) => C({ style: 'img', prompt, good, choices: shuffle([{ img: OBJ(correct), correct: true }, ...wrongs.map(w => ({ img: OBJ(w), correct: false }))]) });
  const audioPic = (word, prompt, correct, wrongs, good) => { const a = pic(prompt, correct, wrongs, good); a.audio = true; a.audioWord = word; return a; };
  const shapePick = (prompt, correct, wrongs, good) => C({ style: 'img', prompt, good, choices: shuffle([{ img: SH(correct), correct: true }, ...wrongs.map(w => ({ img: SH(w), correct: false }))]) });
  const txtC = (style, prompt, correct, wrongs, good) => C({ style, prompt, good, choices: shuffle([{ label: correct, correct: true }, ...wrongs.map(w => ({ label: w, correct: false }))]) });
  const letter = (p, c, w, g) => txtC('letter', p, c, w, g);
  const glyph = (p, c, w, g) => txtC('glyph', p, c, w, g);
  const charC = (p, c, w, g) => txtC('char', p, c, w, g);
  const txt = (p, c, w, g) => txtC('text', p, c, w, g);
  const numPick = (p, c, w, g) => txtC('number', p, String(c), w.map(String), g);
  const countA = (n, prompt, opts, g) => C({ style: 'number', prompt, good: g, stimulus: { kind: 'count', n }, choices: opts.map(o => ({ label: String(o), correct: o === n })) });
  const addG = (a, b, prompt, opts, g) => C({ style: 'number', prompt, good: g, stimulus: { kind: 'add', a, b }, choices: opts.map(o => ({ label: String(o), correct: o === a + b })) });
  const subG = (a, b, prompt, opts, g) => C({ style: 'number', prompt, good: g, stimulus: { kind: 'sub', a, b }, choices: opts.map(o => ({ label: String(o), correct: o === a - b })) });
  const compareN = (prompt, big, small, g) => C({ style: 'number', prompt, good: g, choices: shuffle([{ label: String(big), correct: true }, { label: String(small), correct: false }]) });
  const audioNum = (word, p, c, w, g) => { const a = numPick(p, c, w, g); a.audio = true; a.audioWord = word; return a; };
  const color = (word, prompt, hex, wrongs, g) => C({ style: 'color', prompt, good: g, audio: true, audioWord: word, choices: shuffle([{ color: hex, correct: true }, ...wrongs.map(w => ({ color: w, correct: false }))]) });
  const predict = (prompt, correct, wrongs, g) => { const c = txt(prompt, correct, wrongs, g); c.reveal = true; c.bad = 'Let’s watch and see what happens…'; return c; };

  /* ---- maths worksheet builders ---- */
  const objCount = (n, img, prompt, opts, g) => C({ style: 'number', prompt, good: g, stimulus: { kind: 'objrow', img, n }, choices: opts.map(o => ({ label: String(o), correct: o === n })) });
  const shapeCount = (n, shapeId, prompt, opts, g) => objCount(n, SH(shapeId), prompt, opts, g);
  const flatPick = (prompt, correct, wrongs, g) => C({ style: 'shape', prompt, good: g, choices: shuffle([{ shape: correct, correct: true }, ...wrongs.map(sh => ({ shape: sh, correct: false }))]) });
  const flatCount = (n, sh, prompt, opts, g) => C({ style: 'number', prompt, good: g, stimulus: { kind: 'shapes', shape: sh, n }, choices: opts.map(o => ({ label: String(o), correct: o === n })) });
  const setPick = (prompt, correctN, wrongNs, img, g) => C({ style: 'set', setImg: img, prompt, good: g, choices: shuffle([{ n: correctN, correct: true }, ...wrongNs.map(n => ({ n, correct: false }))]) });
  const addNum = (a, b, opts, g) => C({ style: 'number', prompt: a + ' + ' + b + ' = ?', good: g, choices: opts.map(o => ({ label: String(o), correct: o === a + b })) });
  const subNum = (a, b, opts, g) => C({ style: 'number', prompt: a + ' \u2212 ' + b + ' = ?', good: g, choices: opts.map(o => ({ label: String(o), correct: o === a - b })) });
  const clockRead = (h, m, correct, wrongs, g) => C({ style: 'text', prompt: 'What time does this clock show?', good: g, stimulus: { kind: 'clock', h, m }, choices: shuffle([{ label: correct, correct: true }, ...wrongs.map(w => ({ label: w, correct: false }))]) });
  const clockPick = (prompt, correct, wrongs, g) => C({ style: 'clock', prompt, good: g, choices: shuffle([{ time: correct, correct: true }, ...wrongs.map(t => ({ time: t, correct: false }))]) });
  const ordinalPick = (prompt, shapeIds, correctIdx, g) => C({ style: 'ordinal', prompt, good: g, choices: shapeIds.map((id, i) => ({ img: SH(id), pos: i + 1, correct: i === correctIdx })) });
  const lengthPick = (prompt, bars, correctIdx, g) => C({ style: 'length', prompt, good: g, choices: bars.map((b, i) => ({ len: b.len, color: b.color, label: b.label, look: b.look, correct: i === correctIdx })) });
  const rulerCount = (n, prompt, opts, g) => C({ style: 'number', prompt, good: g, stimulus: { kind: 'ruler', n }, choices: opts.map(o => ({ label: String(o), correct: o === n })) });
  const barsOrder = (prompt, items, correct, wrongs, g) => C({ style: 'text', prompt, good: g, stimulus: { kind: 'bars', items }, choices: shuffle([{ label: correct, correct: true }, ...wrongs.map(w => ({ label: w, correct: false }))]) });
  const coinPick = (prompt, correctCents, wrongCents, g) => C({ style: 'coin', prompt, good: g, choices: shuffle([{ cents: correctCents, correct: true }, ...wrongCents.map(c => ({ cents: c, correct: false }))]) });
  const coinTotal = (coins, opts, g) => { const sum = coins.reduce((x, y) => x + y, 0); return C({ style: 'number', prompt: 'How many cents is this in total?', good: g, stimulus: { kind: 'coins', coins }, choices: opts.map(o => ({ label: String(o), correct: o === sum })) }); };


  function buildLesson(subId, badgeId) {
    const K = subId + '/' + badgeId;
    const M = {
      'english/sound-explorer': () => [L('sun'), letter('Which letter makes the first sound in “map”?', 'm', ['s', 't'], 'Yes! “map” begins with the /m/ sound.'), pic('Which picture is “cat”?', 'cat', ['dog', 'bus'], 'Great! c-a-t spells cat.'), Bw('hat')],
      'english/letter-mapper': () => [letter('Which letter says /s/?', 's', ['m', 't'], '“s” makes the /s/ sound, like sun!'), pic('Which word starts with “b”?', 'book', ['cat', 'sun'], 'Book starts with the letter b!'), letter('Tap the CAPITAL letter', 'A', ['a', 'c'], 'Capital letters are big and tall!')],
      'english/word-decoder': () => [pic('Blend the sounds /s/ /u/ /n/ — which word?', 'sun', ['bus', 'net'], 'Blend it: s-u-n makes sun!'), Bw('dog'), pic('Which word says “pig”?', 'pig', ['pat', 'cup'], 'Yes — p-i-g, pig!')],
      'english/sentence-builder': () => [txt('Finish it: “The cat can ___.”', 'run', ['red', 'net'], '“The cat can run.” — a whole sentence!'), txt('Which word begins a sentence?', 'The', ['the', 'cat'], 'Sentences start with a capital letter!')],
      'english/story-reader': () => [pic('In the story, who is Pat?', 'cat', ['dog', 'pig'], 'Pat is a cat!'), pic('What can Pat do?', 'run', ['sit', 'hop'], 'Pat can run — just like the story said!')],
      'maths/number-order': () => [countA(3, 'How many stars?', [2, 3, 4], 'Count them: 1, 2, 3. There are three!'), numPick('Circle the smallest number:  8   3   6   1', 1, [8, 3, 6], 'Smallest of all — 1 is the littlest!'), txt('Put them in order, smallest first:  9, 4, 7', '4, 7, 9', ['9, 7, 4', '7, 4, 9'], 'Smallest to largest: 4, 7, 9!'), compareN('Which number is greater — 12 or 15?', 15, 12, '15 is greater than 12.'), numPick('Which is the largest?  6, 14, 2', 14, [6, 2], '14 is the biggest number here!'), numPick('Fill in the missing number:  10, 11, ___, 13', 12, [14, 9], '10, 11, 12, 13 — 12 fills the gap!')],
      'maths/shape-finder': () => [flatPick('Tap the shape that has 3 sides', 'triangle', ['circle', 'square'], 'A triangle has 3 sides!'), numPick('How many sides does a square have?', 4, [3, 5], 'A square has 4 equal sides!'), flatPick('Tap the shape that has no corners', 'circle', ['square', 'triangle'], 'A circle is round — no corners at all!'), flatCount(3, 'triangle', 'How many triangles do you see?', [2, 3, 4], 'Count them: 1, 2, 3 triangles!'), flatPick('Tap the round shape (the circle)', 'circle', ['square', 'triangle'], 'Round like a ball — that’s the circle!')],
      'maths/counting-sets': () => [countA(5, 'Count the stars. How many?', [4, 5, 6], '1, 2, 3, 4, 5 — five stars!'), objCount(4, OBJ('mango'), 'Count the apples. How many?', [3, 4, 5], 'Four juicy apples!'), setPick('Tap the set that has 2 objects', 2, [3, 1], STAR, 'That set has 2 — count: 1, 2!'), setPick('Tap the box that has 0 objects', 0, [2, 3], STAR, '0 means none — the empty box!'), setPick('Which box shows 4 stars?', 4, [3, 5], STAR, 'Four stars — 1, 2, 3, 4!')],
      'maths/addition-to-50': () => [addNum(12, 7, [18, 19, 20], '12 + 7 = 19!'), addNum(25, 14, [38, 39, 40], '25 + 14 = 39!'), numPick('Sam has 18 marbles and gets 9 more. How many now?', 27, [26, 28], '18 + 9 = 27 marbles!'), addNum(30, 15, [44, 45, 46], '30 + 15 = 45!'), addNum(22, 6, [27, 28, 29], '22 + 6 = 28!')],
      'maths/subtraction-to-50': () => [subNum(45, 12, [31, 32, 33], '45 − 12 = 33!'), subNum(38, 9, [28, 29, 30], '38 − 9 = 29!'), numPick('40 birds are on a tree. 15 fly away. How many are left?', 25, [24, 26], '40 − 15 = 25 birds!'), subNum(29, 14, [14, 15, 16], '29 − 14 = 15!'), subNum(50, 27, [22, 23, 24], '50 − 27 = 23!')],
      'maths/time-teller': () => [clockRead(3, 0, '3 o’clock', ['6 o’clock', '9 o’clock'], 'The little hand points to 3 — 3 o’clock!'), clockPick('Which clock shows 7 o’clock?', [7, 0], [[3, 0], [10, 0]], 'Little hand on 7 — that’s 7 o’clock!'), clockPick('Which clock shows half past 5?', [5, 30], [[5, 0], [6, 30]], 'Half past 5 — the big hand points to 6!'), clockPick('Circle the clock that shows 9 o’clock', [9, 0], [[12, 0], [3, 0]], 'Little hand on 9 — 9 o’clock!'), txt('It is 2 o’clock now. What time will it be in one hour?', '3 o’clock', ['1 o’clock', '4 o’clock'], 'One hour after 2 o’clock is 3 o’clock!')],
      'maths/ordinal-order': () => [ordinalPick('Tap the 3rd shape in the row', ['blue_triangle', 'orange_sphere', 'green_cube', 'purple_cube'], 2, 'The 3rd shape is the cube!'), ordinalPick('Tap the shape in the 1st position', ['orange_sphere', 'blue_triangle', 'green_cube', 'purple_cube'], 0, 'First in line — that’s the 1st!'), txt('What is the ordinal word for position 5?', '5th', ['4th', '6th'], 'Position 5 is the 5th!'), txt('In the word CAT, which position is the letter T?', '3rd', ['1st', '2nd'], 'C-A-T — T is the 3rd letter!'), ordinalPick('Tap the shape in the 2nd position', ['green_cube', 'purple_cube', 'blue_triangle', 'orange_sphere'], 1, 'Second in line — that’s the 2nd!')],
      'maths/measure-explorer': () => [lengthPick('Tap the longer pencil', [{ len: 120, color: '#F2B400', label: 'Pencil A', look: 'pencil' }, { len: 210, color: '#E07B39', label: 'Pencil B', look: 'pencil' }], 1, 'Pencil B is longer — it reaches further!'), rulerCount(4, 'How many paperclips long is the line?', [3, 4, 5], 'It measures 4 paperclips!'), txt('Which is shorter — a shoe or a bus?', 'A shoe', ['A bus'], 'A shoe is much shorter than a bus!'), lengthPick('Tap the longest object', [{ len: 110, color: '#6C3AD6', label: 'A' }, { len: 250, color: '#C94F8A', label: 'B' }, { len: 170, color: '#2F9FAE', label: 'C' }], 1, 'B stretches the longest!'), barsOrder('Order the lines from shortest to longest', [{ label: 'A', len: 210 }, { label: 'B', len: 110 }, { label: 'C', len: 160 }], 'B, C, A', ['A, C, B', 'C, B, A'], 'Shortest to longest: B, C, A!')],
      'maths/coin-counter': () => [coinTotal([5, 5, 1], [10, 11, 12], 'Add them up: 5 + 5 + 1 = 11 cents!'), coinPick('Tap the coin that is worth 5 cents', 5, [1, 10], 'The 5¢ coin — that’s a nickel!'), numPick('If you have 3 pennies, how many cents do you have?', 3, [1, 5], '3 pennies = 3 cents!'), coinPick('Which coin is worth more?', 10, [5], 'A dime (10¢) is worth more than a nickel (5¢)!'), coinTotal([10, 10, 5], [20, 25, 30], '10 + 10 + 5 = 25 cents!')],
      'science/animal-explorer': () => [pic('Which one is an animal?', 'cat', ['bus', 'cup'], 'A cat is an animal — it eats, breathes and moves!'), pic('Which animal gives us milk?', 'cow', ['dog', 'pig'], 'Cows give us milk!'), pic('Which animal barks?', 'dog', ['cat', 'cow'], 'Dogs bark: woof!'), predict('Will a light leaf float on water?', 'It floats', ['It sinks'], 'A light leaf floats on top of the water!')],
      'science/plant-detective': () => [pic('Which one grows in the ground?', 'tree', ['jet', 'cup'], 'Trees grow up from the ground!'), predict('Do plants need water to grow?', 'Yes', ['No'], 'Plants drink water to grow big and strong.'), pic('Which gives cool shade on a hot day?', 'tree', ['bus', 'hat'], 'A big leafy tree gives cool shade!')],
      'science/weather-watcher': () => [glyph('It is raining. What do you wear?', '🧥', ['🕶️', '🩳'], 'A coat keeps you dry in the rain!'), glyph('The sun is very hot. What helps?', '🕶️', ['🧤', '🧣'], 'Sunglasses shade your eyes from bright sun!')],
      'science/young-experimenter': () => [predict('Which is heavier — a car or a cup?', 'The car', ['The cup'], 'A car is much heavier than a little cup!'), predict('Will a heavy rock sink in water?', 'It sinks', ['It floats'], 'A heavy rock sinks to the bottom!')],
      'science/body-explorer': () => [glyph('Which do you SEE with?', '👁️', ['👂', '👃'], 'You see with your eyes!'), glyph('Which do you HEAR with?', '👂', ['👁️', '👄'], 'You hear with your ears!'), predict('Is running good exercise?', 'Yes', ['No'], 'Running keeps your body strong and healthy!')],
      'shona/mhuka-expert': () => [audioPic('imbwa', 'Tap “imbwa”', 'dog', ['cat', 'cow'], 'Hongu! “Imbwa” means dog.'), audioPic('katsi', 'Tap “katsi”', 'cat', ['dog', 'pig'], 'Hongu! “Katsi” means cat.'), audioPic('mombe', 'Tap “mombe”', 'cow', ['pig', 'dog'], 'Hongu! “Mombe” means cow.')],
      'shona/greetings-guide': () => [txt('It is morning. Which greeting?', 'Mangwanani', ['Masikati', 'Manheru'], '“Mangwanani” means good morning!'), txt('Someone asks “Makadii?” You reply:', 'Ndiripo', ['Mombe', 'Imbwa'], '“Ndiripo” means “I am well.”')],
      'shona/mhuri-friend': () => [txt('Which word means “mother”?', 'Amai', ['Baba', 'Sekuru'], '“Amai” means mother.'), txt('Which word means “father”?', 'Baba', ['Amai', 'Sisi'], '“Baba” means father.')],
      'shona/ngano-listener': () => [txt('What is a “ngano”?', 'A folk story', ['A dog', 'Water'], 'A “ngano” is a folk story told by elders!'), txt('Who often tells ngano?', 'Ambuya (grandma)', ['A car', 'A cup'], 'Ambuya — grandmother — loves to tell ngano!')],
      'shona/musha-explorer': () => [txt('Which word means “water”?', 'Mvura', ['Sadza', 'Imba'], '“Mvura” means water!'), txt('Which word means “house”?', 'Imba', ['Mvura', 'Katsi'], '“Imba” means house!')],
      'mandarin/number-speaker': () => [audioNum('sān', 'Tap the number you hear: “sān”', 3, [2, 4], 'Well done! “Sān” is 3.'), audioNum('wǔ', 'Tap “wǔ”', 5, [4, 6], '“Wǔ” is 5!'), audioNum('yī', 'Tap “yī”', 1, [2, 3], '“Yī” is 1!')],
      'mandarin/tone-explorer': () => [glyph('Which tone RISES?   (má)', '↗', ['↘', '→'], 'The 2nd tone rises: má ↗'), glyph('Which tone FALLS?   (mà)', '↘', ['↗', '→'], 'The 4th tone falls: mà ↘'), glyph('Which tone stays FLAT & high?   (mā)', '→', ['↗', '↘'], 'The 1st tone is flat and high: mā →')],
      'mandarin/colour-listener': () => [color('hóng', 'Tap “hóng”', '#e23b34', ['#2f7fe0', '#3fae4a'], '“Hóng” means red!'), color('lán', 'Tap “lán”', '#2f7fe0', ['#e23b34', '#f2b800'], '“Lán” means blue!')],
      'mandarin/character-spotter': () => [charC('Which character means “big”?   (dà)', '大', ['小', '人'], '大 means big!'), charC('Which means “small”?   (xiǎo)', '小', ['大', '三'], '小 means small!'), charC('Which means “person”?   (rén)', '人', ['大', '小'], '人 means person!')],
      'mandarin/greeting-guide': () => [txt('How do you say “hello”?', 'Nǐ hǎo', ['Xièxie', 'Zàijiàn'], '“Nǐ hǎo” means hello!'), txt('How do you say “thank you”?', 'Xièxie', ['Nǐ hǎo', 'Zàijiàn'], '“Xièxie” means thank you!')],
    };
    return (M[K] || (() => [pic('Tap the cat', 'cat', ['dog', 'bus'], 'Nice work!')]))();
  }

  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  return { U, OBJ, SH, STAR, SUBJECTS, DEFAULT, load, save, sub, isDone, doneCount, recommendedBadge, rank, universeRank, shuffle, buildLesson, qs, esc, previewOn, enterPreview, exitPreview, storeGet, storeSet, storeRemove };
})();
