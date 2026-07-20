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
    coverImage: "/universe/stories/story-pat-cover.webp",
    pages: [
      { text: "Pat is a cat.", img: "a fluffy grey-and-white tabby kitten sitting on a mat by a stone doorway while a happy boy waves hello.", image: "/universe/stories/story-pat-p0.webp" },
      { text: "Pat can run.", img: "the grey-and-white kitten running across green grass, chasing a red ball of yarn, tail up.", image: "/universe/stories/story-pat-p1.webp" },
      { text: "Pat can sit.", img: "the grey-and-white kitten sitting neatly and licking one paw beside a blue food bowl.", image: "/universe/stories/story-pat-p2.webp" },
      { text: "Pat can tap.", img: "the grey-and-white kitten tapping the water in a shiny blue bowl with one front paw.", image: "/universe/stories/story-pat-p3.webp" },
      { text: "Pat is my cat.", img: "the boy sitting cross-legged on the grass, gently petting the grey-and-white kitten, both smiling.", image: "/universe/stories/story-pat-p4.webp" },
      { text: "I pat Pat.", img: "the boy hugging the grey-and-white kitten cheek to cheek at golden sunset near a little house.", image: "/universe/stories/story-pat-p5.webp" },
    ],
    questions: [
      {
        q: "Who is Pat?",
        choices: [
          { text: "A boy", img: "friendly cartoon portrait of a young boy with curly dark hair.", image: "/universe/stories/story-pat-q0-c0.webp", correct: false },
          { text: "A cat", img: "a grey-and-white tabby kitten looking at the camera.", image: "/universe/stories/story-pat-q0-c1.webp", correct: true },
          { text: "A puppy", img: "a small brown puppy sitting.", image: "/universe/stories/story-pat-q0-c2.webp", correct: false },
        ],
      },
      {
        q: "What can Pat do?",
        choices: [
          { text: "Run", img: "a grey-and-white kitten running fast across grass.", image: "/universe/stories/story-pat-q1-c0.webp", correct: true },
          { text: "Sleep", img: "a grey-and-white kitten curled up asleep.", image: "/universe/stories/story-pat-q1-c1.webp", correct: false },
          { text: "Eat", img: "a grey-and-white kitten eating from a bowl.", image: "/universe/stories/story-pat-q1-c2.webp", correct: false },
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
    coverImage: "/universe/stories/story-man-cover.webp",
    pages: [
      { text: "The man has a bun.", img: "a man in a straw hat and blue shirt kneeling and holding up a round golden bun, a grey kitten looking up at it.", image: "/universe/stories/story-man-p0.webp" },
      { text: "The man and the cat.", img: "the man gently offering the bun toward the eager grey kitten, close together on a sunny path.", image: "/universe/stories/story-man-p1.webp" },
      { text: "The man and the cat go.", img: "the man walking down a dirt village path with the little grey kitten trotting beside him.", image: "/universe/stories/story-man-p2.webp" },
      { text: "They hop on the log.", img: "the man stepping onto a fallen log while the grey kitten hops up onto it too, forest edge behind.", image: "/universe/stories/story-man-p3.webp" },
      { text: "They run.", img: "the man and the grey kitten running happily along a sunny dirt path together.", image: "/universe/stories/story-man-p4.webp" },
      { text: "The man reads.", img: "the man sitting on a mat reading a red picture book with the grey kitten resting beside him.", image: "/universe/stories/story-man-p5.webp" },
    ],
    questions: [
      {
        q: "What does the man have?",
        choices: [
          { text: "A bun", img: "a round golden bun on a plate.", image: "/universe/stories/story-man-q0-c0.webp", correct: true },
          { text: "A cap", img: "a blue baseball cap.", correct: false },
          { text: "A ball of yarn", img: "a red ball of yarn.", image: "/universe/stories/story-man-q0-c2.webp", correct: false },
        ],
      },
      {
        q: "What do they do?",
        choices: [
          { text: "They run", img: "a man and a grey kitten running together.", correct: true },
          { text: "They hop", img: "a man and a kitten hopping over a log.", correct: false },
          { text: "They read", img: "a man reading a book with a kitten.", correct: false },
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
    coverImage: "/universe/stories/story-hen-cover.webp",
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
          { text: "The hen", img: "a plump red hen.", correct: true },
          { text: "The egg", img: "a smooth white egg.", correct: false },
          { text: "The chick", img: "a fluffy yellow chick.", correct: false },
        ],
      },
      {
        q: "Who pops up?",
        choices: [
          { text: "The chick", img: "a fluffy yellow chick hatching.", correct: true },
          { text: "The hen", img: "a red hen standing.", correct: false },
          { text: "A kitten", img: "a grey kitten sitting.", correct: false },
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
    coverImage: "/universe/stories/story-pup-cover.webp",
    pages: [
      { text: "Sam is a puppy.", img: "a small brown puppy with floppy ears sitting on green grass in a sunny garden." },
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
          { text: "A puppy", img: "a small brown puppy.", correct: true },
          { text: "A kitten", img: "a grey kitten.", correct: false },
          { text: "A hen", img: "a red hen.", correct: false },
        ],
      },
      {
        q: "Where does Sam jump?",
        choices: [
          { text: "Into the pond", img: "into a blue pond with a splash.", correct: true },
          { text: "Onto a log", img: "up onto a wooden log.", correct: false },
          { text: "Into the straw", img: "into a pile of straw.", correct: false },
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
    coverImage: "/universe/stories/story-fox-cover.webp",
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
          { text: "The fox", img: "an orange fox.", correct: true },
          { text: "The hen", img: "a red hen.", correct: false },
          { text: "The cat", img: "a grey cat.", correct: false },
        ],
      },
      {
        q: "What do they do in the box?",
        choices: [
          { text: "They nap", img: "a fox and hen napping together.", correct: true },
          { text: "They run", img: "a fox running across grass.", correct: false },
          { text: "They hop", img: "a hen hopping over a log.", correct: false },
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
    coverImage: "/universe/stories/story-meg-cover.webp",
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
          { text: "A girl", img: "a young girl with braids.", correct: true },
          { text: "A ladybug", img: "a red ladybug.", correct: false },
          { text: "A cat", img: "a grey cat.", correct: false },
        ],
      },
      {
        q: "What can the bug do?",
        choices: [
          { text: "Hop", img: "a red ladybug hopping up.", correct: true },
          { text: "Run", img: "a puppy running.", correct: false },
          { text: "Nap", img: "a cat napping.", correct: false },
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
    coverImage: "/universe/stories/story-pig-cover.webp",
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
          { text: "The pig", img: "a plump pig.", correct: true },
          { text: "The mud", img: "brown mud.", correct: false },
          { text: "The hen", img: "a red hen.", correct: false },
        ],
      },
      {
        q: "Where is the pig?",
        choices: [
          { text: "In the mud", img: "in a puddle of mud.", correct: true },
          { text: "In a box", img: "inside a cardboard box.", correct: false },
          { text: "In a pond", img: "in a blue pond.", correct: false },
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
    coverImage: "/universe/stories/story-ben-cover.webp",
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
          { text: "A net", img: "a small fishing net.", correct: true },
          { text: "A box", img: "a cardboard box.", correct: false },
          { text: "A jar", img: "a glass jar.", correct: false },
        ],
      },
      {
        q: "What does Ben get?",
        choices: [
          { text: "A fish", img: "a small orange fish.", correct: true },
          { text: "A ladybug", img: "a red ladybug.", correct: false },
          { text: "A hen", img: "a red hen.", correct: false },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------------
   * Step-up readers — everyday words, but full sentences and a real story
   * arc (something goes wrong, someone tries, it works out) so the reader
   * keeps turning pages. Same shape as the stories above.
   * ------------------------------------------------------------------ */

  {
    id: "shoe",
    title: "The Lost Shoe",
    accent: "#6C3AD6",
    tint: "#EEE7FB",
    cover:
      "Book-cover art — a young girl with two puffs in her hair standing on one foot by a blue cottage front door, holding up a single blue school shoe and looking puzzled, her yellow backpack and one lost shoe on the path, morning light.",
    coverImage: "/universe/stories/story-shoe-cover.webp",
    pages: [
      { text: "It is time for school. Zoe has one shoe.", img: "a young girl with two hair puffs sitting on the floor by the front door, one blue shoe on her foot and her other foot bare." },
      { text: "She looks under the bed. There is no shoe.", img: "the girl on her tummy peering under a bed with a torch, only dust and a sock there." },
      { text: "She looks in the toy box. No shoe.", img: "the girl digging through a wooden toy box full of toys, holding a teddy up, no shoe in sight." },
      { text: "Mum helps her look, but the shoe is gone.", img: "the girl and her mum searching the tidy little bedroom together, both looking puzzled." },
      { text: "Then Zoe hears a soft sound outside.", img: "the girl stopping still and turning her head toward an open window, one hand at her ear." },
      { text: "The dog is on the grass with her shoe!", img: "a happy brown dog lying on green grass chewing a blue school shoe, tail wagging." },
      { text: "Zoe laughs and takes her wet shoe back.", img: "the girl laughing as she pulls the damp blue shoe from the friendly dog, garden around them." },
      { text: "Now she has two shoes. Off to school!", img: "the girl walking down a sunny path in both shoes with her school bag, waving goodbye to the dog." },
    ],
    questions: [
      {
        q: "What did Zoe lose?",
        choices: [
          { text: "Her shoe", img: "a single blue school shoe.", correct: true },
          { text: "Her hat", img: "a yellow sun hat.", correct: false },
          { text: "Her bag", img: "a red school bag.", correct: false },
        ],
      },
      {
        q: "Who had the shoe?",
        choices: [
          { text: "The dog", img: "a brown dog holding a shoe in its mouth.", correct: true },
          { text: "Her mum", img: "a smiling mum standing in a doorway.", correct: false },
          { text: "The cat", img: "a grey cat sitting on a mat.", correct: false },
        ],
      },
      {
        q: "Where did Zoe look first?",
        choices: [
          { text: "Under the bed", img: "a child peering under a bed with a torch.", correct: true },
          { text: "In the garden", img: "a green garden with grass and flowers.", correct: false },
          { text: "In the toy box", img: "a wooden box full of toys.", correct: false },
        ],
      },
    ],
  },
  {
    id: "rain",
    title: "The Big Rain",
    accent: "#1F97A6",
    tint: "#DFF1F3",
    cover:
      "Book-cover art — a boy in a blue raincoat and a girl in a yellow raincoat splashing in a puddle outside a cottage door, a small white paper boat floating beside them, cheerful mood.",
    coverImage: "/universe/stories/story-rain-cover.webp",
    pages: [
      { text: "Ben and Meg play outside in the warm sun.", img: "a young boy and a girl with braids kicking a ball on green grass under a bright blue sky." },
      { text: "Then the sky goes dark and grey.", img: "the same garden as heavy grey clouds roll in, the two children looking up at the sky." },
      { text: "Big drops of rain fall on their heads.", img: "fat raindrops falling on the boy and girl, who squint and hold their hands over their hair." },
      { text: "They run inside and shut the door.", img: "the two children tumbling through a doorway into a cosy room, laughing, rain behind them." },
      { text: "They watch the rain run down the window.", img: "the boy and girl kneeling on a chair with their noses near a rainy window, streaks of water on the glass." },
      { text: "Meg folds a little boat out of paper.", img: "the girl at a table carefully folding a small white paper boat, the boy watching closely." },
      { text: "At last the rain stops and the sun comes back.", img: "sunshine breaking through the clouds over a wet shining garden, a rainbow in the sky." },
      { text: "They sail the boat in a big puddle.", img: "the two children crouching by a wide puddle, the little paper boat floating on the water." },
    ],
    questions: [
      {
        q: "What fell from the sky?",
        choices: [
          { text: "Rain", img: "heavy raindrops falling from grey clouds.", correct: true },
          { text: "Snow", img: "white snowflakes falling.", correct: false },
          { text: "Leaves", img: "brown leaves falling from a tree.", correct: false },
        ],
      },
      {
        q: "What did Meg make?",
        choices: [
          { text: "A paper boat", img: "a small folded white paper boat.", correct: true },
          { text: "A kite", img: "a red paper kite.", correct: false },
          { text: "A cake", img: "a round iced cake.", correct: false },
        ],
      },
      {
        q: "Where did they sail the boat?",
        choices: [
          { text: "In a puddle", img: "a wide puddle of rainwater on the ground.", correct: true },
          { text: "In the sea", img: "big blue ocean waves.", correct: false },
          { text: "In a cup", img: "a white cup of water.", correct: false },
        ],
      },
    ],
  },
  {
    id: "market",
    title: "Tari at the Market",
    accent: "#C0791F",
    tint: "#F6EAD5",
    cover:
      "Book-cover art — a young boy carrying a big cloth bag of oranges beside his mum in a busy, colourful open-air market, warm sunny day.",
    coverImage: "/universe/stories/story-market-cover.webp",
    pages: [
      { text: "Tari goes to the market with his mum.", img: "a young boy holding his mum’s hand as they walk into a busy open-air market." },
      { text: "The market is full of noise and colour.", img: "a lively market scene with stalls of fruit, cloth and baskets, people talking and smiling." },
      { text: "Mum buys rice, beans and ten fat oranges.", img: "a woman at a fruit stall handing money to a seller who fills a bag with bright oranges." },
      { text: "Tari holds the bag. It is very heavy.", img: "the boy hugging a bulging cloth bag of oranges with both arms, cheeks puffed with effort." },
      { text: "One orange rolls out and down the road.", img: "a single orange rolling away along the dusty market road, the boy reaching after it." },
      { text: "A kind woman stops it with her foot.", img: "a smiling woman in a bright headwrap gently stopping the rolling orange with her sandal." },
      { text: "She picks it up and gives it back to him.", img: "the woman handing the orange back to the grateful boy, both smiling." },
      { text: "Tari says thank you and holds the bag tight.", img: "the boy walking home beside his mum, hugging the full bag carefully, looking proud." },
    ],
    questions: [
      {
        q: "Where did Tari go?",
        choices: [
          { text: "To the market", img: "a busy open-air market with colourful stalls.", correct: true },
          { text: "To school", img: "a school building with a bell.", correct: false },
          { text: "To the pond", img: "a calm blue pond with reeds.", correct: false },
        ],
      },
      {
        q: "What rolled down the road?",
        choices: [
          { text: "An orange", img: "one round orange rolling on a dusty road.", correct: true },
          { text: "A ball", img: "a striped rubber ball.", correct: false },
          { text: "An egg", img: "a smooth white egg.", correct: false },
        ],
      },
      {
        q: "Who helped Tari?",
        choices: [
          { text: "A kind woman", img: "a smiling woman in a bright headwrap.", correct: true },
          { text: "A dog", img: "a brown dog sitting.", correct: false },
          { text: "His teacher", img: "a teacher standing by a chalkboard.", correct: false },
        ],
      },
    ],
  },
  {
    id: "kite",
    title: "The Kite in the Tree",
    accent: "#3E9A34",
    tint: "#E6F5DF",
    cover:
      "Book-cover art — a girl with short curly hair in a yellow dress running across a green hill, flying a bright red kite with a long ribbon tail high in a big blue sky.",
    coverImage: "/universe/stories/story-kite-cover.webp",
    pages: [
      { text: "Ada has a red kite with a long tail.", img: "a girl with short curly hair holding up a bright red kite with a ribbon tail on a grassy hill." },
      { text: "She runs, and the kite goes up high.", img: "the girl running across the hill as her red kite climbs into the blue sky behind her." },
      { text: "The wind pulls hard. The string slips away.", img: "the kite string whipping out of the girl’s open hands in a gust of wind, her eyes wide." },
      { text: "The kite lands in the top of a tall tree.", img: "the red kite tangled high in the leafy branches of a tall tree, string dangling." },
      { text: "Ada jumps and jumps, but the tree is too tall.", img: "the girl jumping up with her arms stretched at the foot of the tall tree, kite far above." },
      { text: "Her friend Ben brings a long stick.", img: "a boy running up carrying a long thin stick over his shoulder, the girl waving him over." },
      { text: "They push and push. The kite comes free!", img: "the two children together pushing the long stick up into the branches as the red kite drops loose." },
      { text: "Now Ada and Ben fly the kite together.", img: "the girl and boy on the hill, both holding the string as the red kite flies high above them." },
    ],
    questions: [
      {
        q: "Where did the kite land?",
        choices: [
          { text: "In a tree", img: "a red kite stuck in the top branches of a tall tree.", correct: true },
          { text: "In a pond", img: "a kite floating on pond water.", correct: false },
          { text: "On the roof", img: "a kite lying on a tin roof.", correct: false },
        ],
      },
      {
        q: "What did Ben bring?",
        choices: [
          { text: "A long stick", img: "a long thin wooden stick.", correct: true },
          { text: "A net", img: "a small green fishing net.", correct: false },
          { text: "A ladder", img: "a wooden ladder.", correct: false },
        ],
      },
      {
        q: "Who flew the kite at the end?",
        choices: [
          { text: "Ada and Ben", img: "a girl and a boy holding a kite string together on a hill.", correct: true },
          { text: "Only Ada", img: "a girl alone holding a kite.", correct: false },
          { text: "Nobody", img: "an empty grassy hill under a blue sky.", correct: false },
        ],
      },
    ],
  },
  {
    id: "newgirl",
    title: "The New Girl",
    accent: "#6C3AD6",
    tint: "#EEE7FB",
    cover:
      "Book-cover art — two schoolgirls in green uniforms holding hands and walking together across a sunny school yard, one shy and one welcoming, other children skipping and playing ball behind them.",
    coverImage: "/universe/stories/story-newgirl-cover.webp",
    pages: [
      { text: "A new girl comes to school today.", img: "a shy girl in a school uniform standing in a classroom doorway, other children looking up from their desks." },
      { text: "Her name is Lulu, and she says nothing.", img: "the shy girl sitting quietly alone at a desk, hands in her lap, eyes down." },
      { text: "At play time she stands by the wall.", img: "the shy girl standing alone against a school wall while children run and play in the yard." },
      { text: "Meg sees her and walks over.", img: "a girl with braids crossing the school yard toward the lonely girl by the wall." },
      { text: "“Do you want to play with us?” asks Meg.", img: "the girl with braids smiling and holding out her hand to the shy new girl." },
      { text: "Lulu smiles and says yes.", img: "the new girl smiling for the first time and taking the offered hand." },
      { text: "They skip and run and laugh all play time.", img: "the two girls skipping and laughing together in the sunny school yard with other children." },
      { text: "Now Lulu is not new. She has a friend.", img: "the two girls sitting side by side on a step sharing a snack, both happy." },
    ],
    questions: [
      {
        q: "Who is new at school?",
        choices: [
          { text: "Lulu", img: "a shy girl in a school uniform standing alone.", correct: true },
          { text: "Meg", img: "a cheerful girl with braids.", correct: false },
          { text: "Ben", img: "a young boy in school clothes.", correct: false },
        ],
      },
      {
        q: "What did Meg do?",
        choices: [
          { text: "She asked her to play", img: "a girl holding out her hand kindly to another girl.", correct: true },
          { text: "She ran away", img: "a girl running off across a school yard.", correct: false },
          { text: "She said nothing", img: "a girl turning her back and folding her arms.", correct: false },
        ],
      },
      {
        q: "How does Lulu feel at the end?",
        choices: [
          { text: "Happy", img: "a smiling girl laughing with a friend.", correct: true },
          { text: "Sad", img: "a girl with a sad face and drooping shoulders.", correct: false },
          { text: "Cross", img: "a girl frowning with folded arms.", correct: false },
        ],
      },
    ],
  },
  {
    id: "bird",
    title: "The Little Bird",
    accent: "#C33A32",
    tint: "#F9E4E1",
    cover:
      "Book-cover art — a boy in a cosy knitted jumper sitting on a porch swing at sunset, holding a little bird in a straw nest in his hands, his brown dog leaning in to look.",
    coverImage: "/universe/stories/story-bird-cover.webp",
    pages: [
      { text: "Kofi finds a small bird under a tree.", img: "a young boy crouching under a big tree, looking down at a tiny brown bird on the grass." },
      { text: "The bird is wet and it cannot fly.", img: "a close view of a damp little brown bird with drooping wings sitting in the grass." },
      { text: "He puts it in a box with soft grass.", img: "the boy gently setting the little bird into a shoebox lined with soft green grass." },
      { text: "He gives it water in a bottle top.", img: "the boy placing a small bottle top of water into the box beside the bird." },
      { text: "The bird rests all day in the warm sun.", img: "the open box on a sunny step, the bird resting quietly inside, warm afternoon light." },
      { text: "In the morning it hops and flaps its wings.", img: "the little brown bird hopping on the edge of the box and flapping its wings, the boy watching." },
      { text: "Kofi takes the box outside and opens it.", img: "the boy standing in the garden holding the open box up, looking hopeful." },
      { text: "The little bird flies up into the tree.", img: "the brown bird flying up out of the box toward a leafy tree, the boy waving goodbye." },
    ],
    questions: [
      {
        q: "What did Kofi find?",
        choices: [
          { text: "A bird", img: "a small brown bird on the grass.", correct: true },
          { text: "A cat", img: "a grey kitten sitting.", correct: false },
          { text: "An egg", img: "a smooth white egg in the grass.", correct: false },
        ],
      },
      {
        q: "What did he put in the box?",
        choices: [
          { text: "Soft grass", img: "a shoebox lined with soft green grass.", correct: true },
          { text: "Mud", img: "a box of wet brown mud.", correct: false },
          { text: "Sand", img: "a box of dry yellow sand.", correct: false },
        ],
      },
      {
        q: "What did the bird do at the end?",
        choices: [
          { text: "It flew away", img: "a small brown bird flying up toward a tree.", correct: true },
          { text: "It slept", img: "a little bird asleep in a box.", correct: false },
          { text: "It ran", img: "a little bird running along the ground.", correct: false },
        ],
      },
    ],
  },
  {
    id: "cake",
    title: "Who Ate the Cake?",
    accent: "#C0791F",
    tint: "#F6EAD5",
    cover:
      "Book-cover art — a pink-iced cake with a big slice missing on a kitchen table, a guilty-looking shaggy brown dog sitting beside it with icing on its nose and crumbs on the cloth, funny and warm.",
    coverImage: "/universe/stories/story-cake-cover.webp",
    pages: [
      { text: "Mum makes a big cake for tea time.", img: "a smiling mum setting a tall cake with white cream on a wooden kitchen table." },
      { text: "“Do not touch it,” she says, and goes out.", img: "the mum in the doorway with one finger raised, a girl and a dog watching the cake on the table." },
      { text: "When she comes back, half the cake is gone!", img: "the mum staring in surprise at the cake with a big piece missing, crumbs on the table." },
      { text: "Mum looks at Zoe. Zoe shakes her head.", img: "a young girl with hair puffs shaking her head with wide innocent eyes, her mum looking at her." },
      { text: "Zoe looks at the dog. The dog looks away.", img: "a brown dog sitting very still and staring at the ceiling, trying to look innocent." },
      { text: "There is white cream on the dog’s nose.", img: "a close view of the brown dog with a blob of white cream on the tip of its nose." },
      { text: "Everyone laughs. The dog wags his tail.", img: "the mum and girl laughing while the brown dog wags its tail happily in the kitchen." },
      { text: "They eat the rest of the cake at tea time.", img: "the mum and girl at the table eating slices of cake, the dog under the table hoping for crumbs." },
    ],
    questions: [
      {
        q: "What did Mum make?",
        choices: [
          { text: "A cake", img: "a tall cake with white cream.", correct: true },
          { text: "Bread", img: "a loaf of brown bread.", correct: false },
          { text: "Rice", img: "a bowl of white rice.", correct: false },
        ],
      },
      {
        q: "Who ate the cake?",
        choices: [
          { text: "The dog", img: "a brown dog with cream on its nose.", correct: true },
          { text: "Zoe", img: "a girl with hair puffs shaking her head.", correct: false },
          { text: "Mum", img: "a mum standing in a kitchen doorway.", correct: false },
        ],
      },
      {
        q: "How did they know?",
        choices: [
          { text: "Cream on his nose", img: "a close view of a dog’s nose with a blob of white cream on it.", correct: true },
          { text: "He told them", img: "a dog sitting with its mouth open.", correct: false },
          { text: "They saw him", img: "an empty kitchen with a cake on the table.", correct: false },
        ],
      },
    ],
  },
  {
    id: "night",
    title: "The Shape in the Dark",
    accent: "#3E9A34",
    tint: "#E6F5DF",
    cover:
      "Book-cover art — a boy in striped pyjamas sitting on the edge of his bed at night shining a small torch, its warm beam lighting up a hooded coat hanging on a chair, cosy bedroom, crescent moon at the window.",
    coverImage: "/universe/stories/story-night-cover.webp",
    pages: [
      { text: "It is late. Time for Tari to go to bed.", img: "a young boy in pyjamas climbing into a small bed in a cosy room, night outside the window." },
      { text: "Mum puts out the light and shuts the door.", img: "a mum switching off the bedroom light in the doorway, the room going dim and blue." },
      { text: "The room is very dark. Tari pulls up his sheet.", img: "the boy in bed pulling a sheet up to his chin, only moonlight in the dark room." },
      { text: "He sees a big shape by the wall.", img: "a tall dark shadowy shape near the bedroom wall, the boy staring at it with wide eyes." },
      { text: "His heart goes fast. Is it a monster?", img: "the boy sitting up stiffly in bed, clutching the sheet, looking at the dark shape." },
      { text: "Tari is brave. He turns on his little torch.", img: "the boy clicking on a small torch, a bright beam cutting through the dark room." },
      { text: "It is only his coat on the chair!", img: "the torch beam lighting up a coat and hat hanging on a wooden chair, the boy looking relieved." },
      { text: "Tari laughs and goes to sleep.", img: "the boy curled up asleep with a small smile, the coat on the chair in soft moonlight." },
    ],
    questions: [
      {
        q: "Where was Tari?",
        choices: [
          { text: "In bed", img: "a boy in pyjamas lying in a small bed at night.", correct: true },
          { text: "At school", img: "a classroom with desks and a chalkboard.", correct: false },
          { text: "At the market", img: "a busy market with colourful stalls.", correct: false },
        ],
      },
      {
        q: "What was the shape by the wall?",
        choices: [
          { text: "His coat", img: "a coat and hat hanging on a wooden chair.", correct: true },
          { text: "A monster", img: "a big friendly cartoon monster.", correct: false },
          { text: "A cat", img: "a grey cat sitting in the dark.", correct: false },
        ],
      },
      {
        q: "What did Tari use to see?",
        choices: [
          { text: "A torch", img: "a small torch shining a bright beam.", correct: true },
          { text: "A candle", img: "a lit candle in a holder.", correct: false },
          { text: "The sun", img: "a bright sun in a blue sky.", correct: false },
        ],
      },
    ],
  },
];
