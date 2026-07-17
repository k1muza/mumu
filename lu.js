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
      badges: [
        { id: 'counting-hero', name: 'Counting Hero', skills: ['Count objects', 'Match numerals', 'Count on & back', 'Missing numbers'] },
        { id: 'shape-finder', name: 'Shape Finder', skills: ['Identify shapes', 'Sort by property', 'Build pictures', 'Find in world'] },
        { id: 'pattern-solver', name: 'Pattern Solver', skills: ['Continue patterns', 'Sound patterns', 'Create a pattern', 'Find the rule'] },
        { id: 'number-line', name: 'Number Navigator', skills: ['Arrange numbers', 'Greater & smaller', 'Before & after', 'Number line'] },
        { id: 'addition-adventurer', name: 'Addition Adventurer', skills: ['Combine groups', 'Picture addition', 'Number bonds', 'Match equations'] },
      ] },
    { id: 'science', name: 'Science World', accent: '#3E9A34', bg: 'linear-gradient(180deg,#E9F6E2 0%,#F6FBF2 60%)', chip: '#E6F5DF',
      plaque: U('ui/world_plaque_science.png'), badge: U('rewards/subject_badge_science.png'), card: U('worlds/science_world_card.png'),
      verbs: 'Observe · classify · predict · test · explain', dragon: 'What do you predict will happen?',
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
      'maths/pattern-solver': true, 'maths/number-line': true,
      'science/weather-watcher': true, 'science/young-experimenter': true,
      'shona/mhuri-friend': true, 'shona/ngano-listener': true,
      'mandarin/colour-listener': true, 'mandarin/character-spotter': true,
    },
    settings: { speech: false, sfx: true, autoplay: true, narration: 'normal' },
  };

  function load() { try { const s = JSON.parse(localStorage.getItem('lu_state') || '{}'); return Object.assign({}, DEFAULT, s, { done: Object.assign({}, DEFAULT.done, s.done || {}), settings: Object.assign({}, DEFAULT.settings, s.settings || {}) }); } catch (e) { return JSON.parse(JSON.stringify(DEFAULT)); } }
  function save(s) { try { localStorage.setItem('lu_state', JSON.stringify(s)); } catch (e) {} }

  function sub(id) { return SUBJECTS.find(s => s.id === id) || SUBJECTS[0]; }
  function isDone(state, subId, badgeId) { return !!state.done[subId + '/' + badgeId]; }
  function doneCount(state, subId) { return sub(subId).badges.filter(b => isDone(state, subId, b.id)).length; }
  function recommendedBadge(state, subId) { const s = sub(subId); return s.badges.find(b => !isDone(state, subId, b.id)) || s.badges[0]; }

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
  const compareN = (prompt, big, small, g) => C({ style: 'number', prompt, good: g, choices: shuffle([{ label: String(big), correct: true }, { label: String(small), correct: false }]) });
  const audioNum = (word, p, c, w, g) => { const a = numPick(p, c, w, g); a.audio = true; a.audioWord = word; return a; };
  const color = (word, prompt, hex, wrongs, g) => C({ style: 'color', prompt, good: g, audio: true, audioWord: word, choices: shuffle([{ color: hex, correct: true }, ...wrongs.map(w => ({ color: w, correct: false }))]) });
  const predict = (prompt, correct, wrongs, g) => { const c = txt(prompt, correct, wrongs, g); c.reveal = true; c.bad = 'Let’s watch and see what happens…'; return c; };

  function buildLesson(subId, badgeId) {
    const K = subId + '/' + badgeId;
    const M = {
      'english/sound-explorer': () => [L('sun'), letter('Which letter makes the first sound in “map”?', 'm', ['s', 't'], 'Yes! “map” begins with the /m/ sound.'), pic('Which picture is “cat”?', 'cat', ['dog', 'bus'], 'Great! c-a-t spells cat.'), Bw('hat')],
      'english/letter-mapper': () => [letter('Which letter says /s/?', 's', ['m', 't'], '“s” makes the /s/ sound, like sun!'), pic('Which word starts with “b”?', 'book', ['cat', 'sun'], 'Book starts with the letter b!'), letter('Tap the CAPITAL letter', 'A', ['a', 'c'], 'Capital letters are big and tall!')],
      'english/word-decoder': () => [pic('Blend the sounds /s/ /u/ /n/ — which word?', 'sun', ['bus', 'net'], 'Blend it: s-u-n makes sun!'), Bw('dog'), pic('Which word says “pig”?', 'pig', ['pat', 'cup'], 'Yes — p-i-g, pig!')],
      'english/sentence-builder': () => [txt('Finish it: “The cat can ___.”', 'run', ['red', 'net'], '“The cat can run.” — a whole sentence!'), txt('Which word begins a sentence?', 'The', ['the', 'cat'], 'Sentences start with a capital letter!')],
      'english/story-reader': () => [pic('In the story, who is Pat?', 'cat', ['dog', 'pig'], 'Pat is a cat!'), pic('What can Pat do?', 'run', ['sit', 'hop'], 'Pat can run — just like the story said!')],
      'maths/counting-hero': () => [countA(3, 'How many stars?', [2, 3, 4], 'Count them: 1, 2, 3. There are three!'), countA(5, 'How many stars now?', [4, 5, 6], '1, 2, 3, 4, 5 — five stars!'), compareN('Which number is greater?', 7, 5, 'Seven is greater than five.'), addG(2, 1, '2 + 1 = ?', [2, 3, 4], 'Two stars and one star make three!')],
      'maths/shape-finder': () => [shapePick('Tap the triangle', 'blue_triangle', ['green_cube', 'orange_sphere'], 'A triangle has 3 sides!'), shapePick('Tap the ball (sphere)', 'orange_sphere', ['purple_cube', 'blue_triangle'], 'A sphere is round like a ball!'), shapePick('Tap the cube (box)', 'green_cube', ['orange_sphere', 'blue_triangle'], 'A cube has flat square sides!')],
      'maths/pattern-solver': () => [glyph('What comes next?   ● ■ ● ■ ?', '■', ['●', '▲'], 'Circle, square, circle, square — square is next!'), glyph('Finish it:   ▲ ▲ ● ▲ ▲ ?', '●', ['▲', '■'], 'Two triangles then a circle — that’s the rule!')],
      'maths/number-line': () => [numPick('What comes after 5?', 6, [4, 8], 'After 5 comes 6.'), numPick('What comes before 3?', 2, [4, 1], 'Before 3 comes 2.')],
      'maths/addition-adventurer': () => [addG(2, 2, '2 + 2 = ?', [3, 4, 5], 'Two and two make four!'), addG(3, 1, '3 + 1 = ?', [3, 4, 5], 'Three and one make four!'), addG(1, 4, '1 + 4 = ?', [4, 5, 6], 'One and four make five!')],
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

  return { U, OBJ, SH, STAR, SUBJECTS, DEFAULT, load, save, sub, isDone, doneCount, recommendedBadge, shuffle, buildLesson, qs, esc };
})();
