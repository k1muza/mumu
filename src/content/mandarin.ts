import type { SubjectContent } from "@/lib/types";
import { audioNum, colour, expandBadges, glyph, hanzi, txt, uni } from "./builders";

const subjectId = "mandarin";

const { badges, lessons } = expandBadges(subjectId, [
  {
    slug: "greeting-guide",
    name: "Greeting Guide",
    skills: ["Basic greetings", "Appropriate replies", "Listen & repeat", "Match situations"],
    lessons: [
      {
        title: "Say hello",
        objective: "Recognise basic greetings",
        activities: [
          txt("How do you say “hello”?", "Nǐ hǎo", ["Xièxie", "Zàijiàn"], "“Nǐ hǎo” means hello!"),
          txt(
            "How do you say “thank you”?",
            "Xièxie",
            ["Nǐ hǎo", "Zàijiàn"],
            "“Xièxie” means thank you!",
          ),
        ],
      },
      {
        title: "Friendly conversations",
        objective: "Choose polite greetings and replies in short exchanges",
        activities: [
          txt("How do you say “goodbye”?", "Zàijiàn", ["Nǐ hǎo", "Xièxie"], "“Zàijiàn” means goodbye or see you again!"),
          txt("A friend says “Nǐ hǎo.” What can you reply?", "Nǐ hǎo", ["Zàijiàn", "Wǔ"], "You can greet your friend back with “Nǐ hǎo.”"),
          txt("Someone says “Xièxie.” Which reply means “you’re welcome”?", "Bú kèqi", ["Nǐ hǎo", "Zàijiàn"], "“Bú kèqi” means you’re welcome."),
          txt("You are leaving school. What do you say?", "Zàijiàn", ["Xièxie", "Nǐ hǎo"], "“Zàijiàn” is the right goodbye."),
        ],
      },
    ],
  },
  {
    slug: "number-speaker",
    name: "Number Speaker",
    skills: ["Hear numbers", "Count objects", "Match symbols", "Say with dragon"],
    lessons: [
      {
        title: "Hear the numbers",
        objective: "Match spoken numbers to numerals",
        activities: [
          audioNum("sān", "Tap the number you hear: “sān”", 3, [2, 4], "Well done! “Sān” is 3."),
          audioNum("wǔ", "Tap “wǔ”", 5, [4, 6], "“Wǔ” is 5!"),
          audioNum("yī", "Tap “yī”", 1, [2, 3], "“Yī” is 1!"),
        ],
      },
      {
        title: "Count to ten",
        objective: "Recognise and order spoken Mandarin numbers from six to ten",
        activities: [
          audioNum("liù", "Tap the number you hear: “liù”", 6, [5, 7], "“Liù” is 6."),
          audioNum("qī", "Tap “qī”", 7, [6, 8], "“Qī” is 7."),
          audioNum("bā", "Tap “bā”", 8, [7, 9], "“Bā” is 8."),
          audioNum("shí", "Tap “shí”", 10, [8, 9], "“Shí” is 10 — you counted all the way to ten!"),
        ],
      },
    ],
  },
  {
    slug: "tone-explorer",
    name: "Tone Explorer",
    skills: ["Hear tones", "Match patterns", "Repeat", "Meaning change"],
    lessons: [
      {
        title: "Rising and falling",
        objective: "Hear the difference between tones",
        activities: [
          glyph("Which tone RISES?   (má)", "↗", ["↘", "→"], "The 2nd tone rises: má ↗"),
          glyph("Which tone FALLS?   (mà)", "↘", ["↗", "→"], "The 4th tone falls: mà ↘"),
          glyph(
            "Which tone stays FLAT & high?   (mā)",
            "→",
            ["↗", "↘"],
            "The 1st tone is flat and high: mā →",
          ),
        ],
      },
      {
        title: "Tone-shape challenge",
        objective: "Match all four Mandarin tone marks to their voice movements",
        activities: [
          glyph("Which voice shape DIPS then rises?   (mǎ)", "↘↗", ["→", "↘"], "The 3rd tone dips and rises: mǎ ↘↗"),
          glyph("Which tone mark belongs on a high, flat sound?", "¯", ["´", "`"], "The macron ¯ marks the high, flat 1st tone."),
          glyph("Which tone mark belongs on a rising sound?", "´", ["ˇ", "`"], "The acute mark ´ shows the rising 2nd tone."),
          glyph("Which tone mark belongs on a sharp falling sound?", "`", ["´", "¯"], "The grave mark ` shows the falling 4th tone."),
        ],
      },
    ],
  },
  {
    slug: "colour-listener",
    name: "Colour Listener",
    skills: ["Match colours", "Identify colours", "Follow colour", "Similar sounds"],
    lessons: [
      {
        title: "Listen for colours",
        objective: "Match spoken colour names to colours",
        activities: [
          colour("hóng", "Tap “hóng”", "#e23b34", ["#2f7fe0", "#3fae4a"], "“Hóng” means red!"),
          colour("lán", "Tap “lán”", "#2f7fe0", ["#e23b34", "#f2b800"], "“Lán” means blue!"),
        ],
      },
      {
        title: "Rainbow listening game",
        objective: "Distinguish and recall five spoken colour words",
        activities: [
          colour("lǜ", "Tap “lǜ”", "#3fae4a", ["#e23b34", "#2f7fe0"], "“Lǜ” means green!"),
          colour("huáng", "Tap “huáng”", "#f2b800", ["#3fae4a", "#2f7fe0"], "“Huáng” means yellow!"),
          colour("hēi", "Tap “hēi”", "#26232d", ["#e23b34", "#f2b800"], "“Hēi” means black!"),
          txt("Which word means red?", "hóng", ["lán", "lǜ"], "Hóng is red — you remembered the word as well as the colour!"),
        ],
      },
    ],
  },
  {
    slug: "character-spotter",
    name: "Character Spotter",
    skills: ["Match meanings", "Trace strokes", "Familiar symbols", "Spoken & written"],
    lessons: [
      {
        title: "Spot the characters",
        objective: "Match simple characters to their meanings",
        activities: [
          hanzi("Which character means “big”?   (dà)", "大", ["小", "人"], "大 means big!"),
          hanzi("Which means “small”?   (xiǎo)", "小", ["大", "三"], "小 means small!"),
          hanzi("Which means “person”?   (rén)", "人", ["大", "小"], "人 means person!"),
        ],
      },
      {
        title: "Character clue quest",
        objective: "Recognise number characters and use visual clues to remember meaning",
        activities: [
          hanzi("Which character means “one”?   (yī)", "一", ["二", "三"], "一 is one single line, so it means one."),
          hanzi("Which character means “two”?   (èr)", "二", ["一", "三"], "二 has two lines and means two."),
          hanzi("Which character means “three”?   (sān)", "三", ["二", "人"], "三 has three lines and means three."),
          hanzi("Which character looks like mountain peaks and means “mountain”?   (shān)", "山", ["人", "大"], "山 looks like mountain peaks and means mountain."),
        ],
      },
    ],
  },
]);

const mandarin: SubjectContent = {
  subject: {
    id: subjectId,
    name: "Mandarin World",
    order: 4,
    accent: "#C33A32",
    bg: "linear-gradient(180deg,#FBE8E6 0%,#FEF5F4 60%)",
    chip: "#F9E4E1",
    verbs: "Listen · tones · speak · recognise · match",
    dragonLine: "Let’s listen carefully to the tone!",
    ranks: ["Xiǎo Student", "Tone Tamer", "Character Champ", "Mandarin Wizard", "Mandarin Prodigy"],
    art: {
      plaque: uni("ui/world_plaque_mandarin.webp"),
      badge: uni("rewards/subject_badge_mandarin.webp"),
      card: uni("worlds/mandarin_world_card.webp"),
    },
  },
  badges,
  lessons,
};

export default mandarin;
