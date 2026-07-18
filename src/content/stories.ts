import type { Story } from "@/lib/types";

/**
 * Story Reader content (English world).
 *
 * To add a story: append an object to STORIES with a unique `id`, pick an
 * accent/tint pair (reuse one below or add your own), then write the cover,
 * one `{ text, img }` entry per page, and picture questions. Every `img` /
 * `cover` value is only the scene description — the shared art style is
 * prepended automatically, and each empty slot in the app shows a
 * "Copy prompt" button so you can generate the illustration, then drop or
 * upload the result straight onto the slot. Images and progress live in the
 * browser database, so no version bump is needed here.
 */

/** Shared art direction prepended to every image prompt. */
export const STORY_ART_STYLE =
  "Warm children’s picture-book illustration, soft painterly storybook style, gentle natural light, friendly rounded characters, no lettering. Scene: ";

/** Full image prompt for a scene description. */
export const storyPrompt = (scene: string) => STORY_ART_STYLE + scene;

export const STORIES: Story[] = [
  {
    id: "pat",
    title: "Pat is a Cat",
    accent: "#6C3AD6",
    tint: "#EEE7FB",
    cover:
      "Book-cover art — a cheerful young boy with curly dark hair waving one hand, sitting beside a fluffy grey-and-white tabby kitten in a sunny flower garden with a small cottage behind them.",
    pages: [
      { text: "Pat is a cat.", img: "a fluffy grey-and-white tabby kitten sitting on a mat by a stone doorway while a happy boy waves hello." },
      { text: "Pat can run.", img: "the grey-and-white kitten running across green grass, chasing a red ball of yarn, tail up." },
      { text: "Pat can sit.", img: "the grey-and-white kitten sitting neatly and licking one paw beside a blue food bowl." },
      { text: "Pat can tap.", img: "the grey-and-white kitten tapping the water in a shiny blue bowl with one front paw." },
      { text: "Pat is my cat.", img: "the boy sitting cross-legged on the grass, gently petting the grey-and-white kitten, both smiling." },
      { text: "I pat Pat.", img: "the boy hugging the grey-and-white kitten cheek to cheek at golden sunset near a little house." },
    ],
    questions: [
      {
        q: "Who is Pat?",
        choices: [
          { img: "friendly cartoon portrait of a young boy with curly dark hair.", correct: false },
          { img: "a grey-and-white tabby kitten looking at the camera.", correct: true },
          { img: "a small brown puppy sitting.", correct: false },
        ],
      },
      {
        q: "What can Pat do?",
        choices: [
          { img: "a grey-and-white kitten running fast across grass.", correct: true },
          { img: "a grey-and-white kitten curled up asleep.", correct: false },
          { img: "a grey-and-white kitten eating from a bowl.", correct: false },
        ],
      },
    ],
  },
  {
    id: "man",
    title: "The Man and the Cat",
    accent: "#3E9A34",
    tint: "#E6F5DF",
    cover:
      "Book-cover art — a kind smiling man in a blue shirt and straw hat kneeling on a village path beside a small grey kitten, warm sunny African village in the background.",
    pages: [
      { text: "The man has a bun.", img: "a man in a straw hat and blue shirt kneeling and holding up a round golden bun, a grey kitten looking up at it." },
      { text: "The man and the cat.", img: "the man gently offering the bun toward the eager grey kitten, close together on a sunny path." },
      { text: "The man and the cat go.", img: "the man walking down a dirt village path with the little grey kitten trotting beside him." },
      { text: "They hop on the log.", img: "the man stepping onto a fallen log while the grey kitten hops up onto it too, forest edge behind." },
      { text: "They run.", img: "the man and the grey kitten running happily along a sunny dirt path together." },
      { text: "The man reads.", img: "the man sitting on a mat reading a red picture book with the grey kitten resting beside him." },
    ],
    questions: [
      {
        q: "What does the man have?",
        choices: [
          { img: "a round golden bun on a plate.", correct: true },
          { img: "a blue baseball cap.", correct: false },
          { img: "a red ball of yarn.", correct: false },
        ],
      },
      {
        q: "What do they do?",
        choices: [
          { img: "a man and a grey kitten running together.", correct: true },
          { img: "a man and a kitten hopping over a log.", correct: false },
          { img: "a man reading a book with a kitten.", correct: false },
        ],
      },
    ],
  },
  {
    id: "hen",
    title: "The Red Hen",
    accent: "#1F97A6",
    tint: "#DFF1F3",
    cover:
      "Book-cover art — a plump friendly red hen standing proudly in a sunny farmyard with a fluffy yellow chick peeking out beside her, wooden barn behind.",
    pages: [
      { text: "The hen is red.", img: "a plump red hen standing in a sunny farmyard, looking cheerful." },
      { text: "The hen sits.", img: "the red hen sitting cosily on a round nest of golden straw." },
      { text: "The hen has an egg.", img: "the red hen beside one smooth white egg nestled in the straw nest." },
      { text: "The egg can rock.", img: "the single white egg wobbling and rocking in the straw nest, tiny motion lines." },
      { text: "A chick pops up.", img: "a fluffy yellow chick hatching, popping happily out of a cracked eggshell." },
      { text: "The hen is glad.", img: "the red hen and the little yellow chick nuzzling together, both happy in the farmyard." },
    ],
    questions: [
      {
        q: "What is red?",
        choices: [
          { img: "a plump red hen.", correct: true },
          { img: "a smooth white egg.", correct: false },
          { img: "a fluffy yellow chick.", correct: false },
        ],
      },
      {
        q: "Who pops up?",
        choices: [
          { img: "a fluffy yellow chick hatching.", correct: true },
          { img: "a red hen standing.", correct: false },
          { img: "a grey kitten sitting.", correct: false },
        ],
      },
    ],
  },
  {
    id: "pup",
    title: "Sam the Pup",
    accent: "#C0791F",
    tint: "#F6EAD5",
    cover:
      "Book-cover art — a happy little brown puppy with floppy ears sitting in a sunny green garden beside a small blue pond, bright cheerful mood.",
    pages: [
      { text: "Sam is a pup.", img: "a small brown puppy with floppy ears sitting on green grass in a sunny garden." },
      { text: "Sam sits in the sun.", img: "the brown puppy lying happily in a warm patch of sunshine on the grass." },
      { text: "Sam is hot.", img: "the brown puppy panting with tongue out under the shade of a leafy tree, hot sunny day." },
      { text: "Sam runs to the pond.", img: "the brown puppy running eagerly toward a small blue pond in the garden." },
      { text: "Sam jumps in.", img: "the brown puppy leaping into the blue pond with a big splash of water." },
      { text: "Sam is wet.", img: "the soaking-wet brown puppy shaking off water droplets, looking delighted by the pond." },
    ],
    questions: [
      {
        q: "Who is Sam?",
        choices: [
          { img: "a small brown puppy.", correct: true },
          { img: "a grey kitten.", correct: false },
          { img: "a red hen.", correct: false },
        ],
      },
      {
        q: "Where does Sam jump?",
        choices: [
          { img: "into a blue pond with a splash.", correct: true },
          { img: "up onto a wooden log.", correct: false },
          { img: "into a pile of straw.", correct: false },
        ],
      },
    ],
  },
  {
    id: "fox",
    title: "The Fox and the Box",
    accent: "#C33A32",
    tint: "#F9E4E1",
    cover:
      "Book-cover art — a cheerful orange fox peeking happily out of a big cardboard box in a sunny meadow, bright playful mood.",
    pages: [
      { text: "The fox has a box.", img: "a friendly orange fox standing beside a big brown cardboard box on green grass." },
      { text: "The box is big.", img: "the orange fox looking up at a tall big cardboard box, the box much bigger than the fox." },
      { text: "The fox sits in the box.", img: "the orange fox sitting cosily inside the open cardboard box, peeking over the edge." },
      { text: "A hen hops in.", img: "a plump red hen hopping into the cardboard box to join the orange fox." },
      { text: "The fox and the hen.", img: "the orange fox and the red hen sitting together inside the cardboard box, friends." },
      { text: "They nap in the box.", img: "the orange fox and the red hen napping snugly side by side inside the box, eyes closed." },
    ],
    questions: [
      {
        q: "What has a box?",
        choices: [
          { img: "an orange fox.", correct: true },
          { img: "a red hen.", correct: false },
          { img: "a grey cat.", correct: false },
        ],
      },
      {
        q: "What do they do in the box?",
        choices: [
          { img: "a fox and hen napping together.", correct: true },
          { img: "a fox running across grass.", correct: false },
          { img: "a hen hopping over a log.", correct: false },
        ],
      },
    ],
  },
  {
    id: "meg",
    title: "Meg and the Bug",
    accent: "#6C3AD6",
    tint: "#EEE7FB",
    cover:
      "Book-cover art — a curious young girl with two braids crouching in a garden to look at a little red ladybug on a leaf, sunny and sweet.",
    pages: [
      { text: "Meg is a girl.", img: "a happy young girl with two braids standing in a green sunny garden." },
      { text: "Meg sees a bug.", img: "the girl crouching down, pointing at a tiny red bug on a leaf, curious." },
      { text: "The bug is red.", img: "a close friendly view of a small round red ladybug with black spots on a green leaf." },
      { text: "The bug can hop.", img: "the little red bug hopping into the air off a leaf, tiny motion lines." },
      { text: "Meg gets a jar.", img: "the girl gently holding a clear glass jar, ready to look at the little red bug." },
      { text: "Meg lets it go.", img: "the girl smiling as she opens her hands and the red bug flies away in the garden." },
    ],
    questions: [
      {
        q: "Who is Meg?",
        choices: [
          { img: "a young girl with braids.", correct: true },
          { img: "a red ladybug.", correct: false },
          { img: "a grey cat.", correct: false },
        ],
      },
      {
        q: "What can the bug do?",
        choices: [
          { img: "a red ladybug hopping up.", correct: true },
          { img: "a puppy running.", correct: false },
          { img: "a cat napping.", correct: false },
        ],
      },
    ],
  },
  {
    id: "pig",
    title: "The Pig in the Mud",
    accent: "#3E9A34",
    tint: "#E6F5DF",
    cover:
      "Book-cover art — a jolly pink pig with a big smile sitting in a shallow puddle of brown mud on a sunny farm, splashy and fun.",
    pages: [
      { text: "The pig is pink.", img: "a plump happy pink pig standing in a sunny green farmyard." },
      { text: "The pig digs.", img: "the pink pig digging in the soft brown earth with its snout, dirt flying." },
      { text: "The pig is in the mud.", img: "the pink pig sitting happily in a shallow puddle of squishy brown mud." },
      { text: "The mud is wet.", img: "a close view of the pink pig splashing in the wet brown mud, droplets flying." },
      { text: "The pig is glad.", img: "the muddy pink pig grinning with delight, covered in happy splatters of mud." },
      { text: "The pig naps.", img: "the pink pig lying down for a cosy nap in the warm mud, eyes closed, content." },
    ],
    questions: [
      {
        q: "What is pink?",
        choices: [
          { img: "a plump pig.", correct: true },
          { img: "brown mud.", correct: false },
          { img: "a red hen.", correct: false },
        ],
      },
      {
        q: "Where is the pig?",
        choices: [
          { img: "in a puddle of mud.", correct: true },
          { img: "inside a cardboard box.", correct: false },
          { img: "in a blue pond.", correct: false },
        ],
      },
    ],
  },
  {
    id: "ben",
    title: "Ben and the Net",
    accent: "#1F97A6",
    tint: "#DFF1F3",
    cover:
      "Book-cover art — a happy young boy in shorts holding a small fishing net at the edge of a calm blue pond, reeds and sunshine around him.",
    pages: [
      { text: "Ben is at the pond.", img: "a cheerful young boy standing at the grassy edge of a calm blue pond on a sunny day." },
      { text: "Ben has a net.", img: "the boy holding up a small green fishing net, smiling, pond behind him." },
      { text: "Ben sees a fish.", img: "the boy pointing excitedly at a small orange fish swimming in the clear blue pond." },
      { text: "Ben dips the net.", img: "the boy carefully dipping his net into the pond water toward the little orange fish." },
      { text: "Ben gets the fish.", img: "the boy lifting the net out of the water with a small orange fish inside, delighted." },
      { text: "Ben lets it go.", img: "the boy gently tipping the net so the little orange fish swims back into the pond." },
    ],
    questions: [
      {
        q: "What does Ben have?",
        choices: [
          { img: "a small fishing net.", correct: true },
          { img: "a cardboard box.", correct: false },
          { img: "a glass jar.", correct: false },
        ],
      },
      {
        q: "What does Ben get?",
        choices: [
          { img: "a small orange fish.", correct: true },
          { img: "a red ladybug.", correct: false },
          { img: "a red hen.", correct: false },
        ],
      },
    ],
  },
];
