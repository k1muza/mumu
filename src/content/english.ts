import type { SubjectContent } from "@/lib/types";
import { buildWord, expandBadges, letter, listen, pic, txt, uni } from "./builders";

const subjectId = "english";

const { badges, lessons } = expandBadges(subjectId, [
  {
    slug: "sound-explorer",
    name: "Sound Explorer",
    skills: ["Beginning sounds", "Rhyming", "Blend sounds", "Segment sounds"],
    lessons: [
      {
        title: "Hear the sounds",
        objective: "Hear beginning sounds and blend spoken sounds",
        activities: [
          listen("sun"),
          letter(
            "Which letter makes the first sound in “map”?",
            "m",
            ["s", "t"],
            "Yes! “map” begins with the /m/ sound.",
          ),
          pic("Which picture is “cat”?", "cat", ["dog", "bus"], "Great! c-a-t spells cat."),
          buildWord("hat"),
        ],
      },
      {
        title: "Rhyme detectives",
        objective: "Recognise rhymes and hear sounds at the start and end of words",
        activities: [
          pic("Which picture rhymes with “cat”?", "hat", ["dog", "sun"], "Cat and hat rhyme — they both end with /at/!"),
          letter("Which sound begins “tree”?", "t", ["m", "s"], "Tree begins with the /t/ sound."),
          letter("Which sound ends “sun”?", "n", ["s", "t"], "Stretch it out: su-n. Sun ends with /n/."),
          buildWord("map"),
        ],
      },
    ],
  },
  {
    slug: "letter-mapper",
    name: "Letter–Sound Mapper",
    skills: ["Sound to letter", "Upper & lower case", "Starting letter", "Letter to object"],
    lessons: [
      {
        title: "Match sounds to letters",
        objective: "Match sounds to letters and recognise letter cases",
        activities: [
          letter("Which letter says /s/?", "s", ["m", "t"], "“s” makes the /s/ sound, like sun!"),
          pic("Which word starts with “b”?", "book", ["cat", "sun"], "Book starts with the letter b!"),
          letter("Tap the CAPITAL letter", "A", ["a", "c"], "Capital letters are big and tall!"),
        ],
      },
      {
        title: "Letter partners",
        objective: "Connect capital and lowercase letters to sounds in words",
        activities: [
          letter("Which small letter is the partner of B?", "b", ["d", "p"], "B and b are letter partners!"),
          letter("Which CAPITAL letter is the partner of m?", "M", ["N", "W"], "M and m make the same /m/ sound."),
          pic("Which picture begins with /t/?", "tree", ["sun", "map"], "Tree begins with t: /t/ /t/ tree!"),
          letter("Which letter ends “dog”?", "g", ["d", "b"], "Dog ends with the /g/ sound."),
        ],
      },
    ],
  },
  {
    slug: "word-decoder",
    name: "Word Decoder",
    skills: ["Blend words", "Read CVC words", "Similar words", "Match to pictures"],
    lessons: [
      {
        title: "Blend simple words",
        objective: "Blend sounds into simple three-letter words",
        activities: [
          pic(
            "Blend the sounds /s/ /u/ /n/ — which word?",
            "sun",
            ["bus", "net"],
            "Blend it: s-u-n makes sun!",
          ),
          buildWord("dog"),
          pic("Which word says “pig”?", "pig", ["pat", "cup"], "Yes — p-i-g, pig!"),
        ],
      },
      {
        title: "Word-family workshop",
        objective: "Read and build CVC words by noticing shared endings",
        activities: [
          buildWord("cap"),
          pic("Read m-a-p. Which picture matches?", "map", ["mat", "man"], "Blend it: m-a-p makes map!"),
          txt("Which word rhymes with “log”?", "dog", ["sit", "cup"], "Dog and log share the /og/ ending."),
          buildWord("sit"),
        ],
      },
    ],
  },
  {
    slug: "sentence-builder",
    name: "Sentence Builder",
    skills: ["Arrange words", "Read sentences", "Match to scenes", "Missing words"],
    lessons: [
      {
        title: "Build a sentence",
        objective: "Complete and begin simple sentences",
        activities: [
          txt(
            "Finish it: “The cat can ___.”",
            "run",
            ["red", "net"],
            "“The cat can run.” — a whole sentence!",
          ),
          txt(
            "Which word begins a sentence?",
            "The",
            ["the", "cat"],
            "Sentences start with a capital letter!",
          ),
        ],
      },
      {
        title: "Sentence fixers",
        objective: "Choose complete sentences with capitals, spaces and punctuation",
        activities: [
          txt("Finish it: “The dog can ___.”", "hop", ["hat", "red"], "The dog can hop. That tells a complete idea!"),
          txt("Which sentence starts correctly?", "The pig can run.", ["the pig can run.", "pig can run."], "A sentence begins with a capital letter."),
          txt("Which mark ends a telling sentence?", ".", ["?", ","], "A full stop shows that the telling sentence is finished."),
          txt("Choose the sentence in the right order.", "The cat can sit.", ["Cat the sit can.", "Can cat the sit."], "The words are in an order that makes sense!"),
        ],
      },
    ],
  },
  {
    slug: "story-reader",
    name: "Story Reader",
    skills: ["Read stories", "Predict next", "Comprehension", "Sequence events"],
    lessons: [
      {
        title: "Read about Pat",
        objective: "Answer questions about a short story",
        activities: [
          pic("In the story, who is Pat?", "cat", ["dog", "pig"], "Pat is a cat!"),
          pic("What can Pat do?", "run", ["sit", "hop"], "Pat can run — just like the story said!"),
        ],
      },
      {
        title: "Sam’s windy hat",
        objective: "Recall, sequence and infer ideas from a three-sentence story",
        activities: [
          txt("Story: Sam has a red hat. The wind blows it into a tree. Sam gets it back. What colour is the hat?", "red", ["blue", "green"], "The story says Sam’s hat is red."),
          pic("Where did the wind blow the hat?", "tree", ["bus", "bed"], "The hat landed in a tree."),
          txt("What happened first?", "Sam had the hat.", ["The hat went into the tree.", "Sam got the hat back."], "First, Sam had the hat."),
          txt("Why did Sam look up?", "The hat was in the tree.", ["Sam saw a bus.", "It was bedtime."], "That clue helps us work out why Sam looked up!"),
        ],
      },
    ],
  },
]);

const english: SubjectContent = {
  subject: {
    id: subjectId,
    name: "English World",
    environment: "Word Lagoon",
    order: 0,
    accent: "#1F97A6",
    bg: "linear-gradient(180deg,#E7F6F8 0%,#F6FCFC 60%)",
    chip: "#E1F4F6",
    verbs: "Listen · blend · read · build · understand",
    dragonLine: "Let’s stretch the sounds out together!",
    ranks: ["Letter Sprout", "Word Explorer", "Story Weaver", "Reading Wizard", "Word Prodigy"],
    art: {
      plaque: uni("ui/world_plaque_english.png"),
      badge: uni("rewards/subject_badge_english.png"),
      card: uni("worlds/english_world_card.png"),
    },
  },
  badges,
  lessons,
};

export default english;
