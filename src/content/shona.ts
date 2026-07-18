import type { SubjectContent } from "@/lib/types";
import { audioPic, expandBadges, txt, uni } from "./builders";

const subjectId = "shona";

const { badges, lessons } = expandBadges(subjectId, [
  {
    slug: "greetings-guide",
    name: "Greetings Guide",
    skills: ["Common greetings", "Choose a reply", "Listen & repeat", "Match to time"],
    lessons: [
      {
        title: "Greet the day",
        objective: "Choose the right greeting for the situation",
        activities: [
          txt(
            "It is morning. Which greeting?",
            "Mangwanani",
            ["Masikati", "Manheru"],
            "“Mangwanani” means good morning!",
          ),
          txt(
            "Someone asks “Makadii?” You reply:",
            "Ndiripo",
            ["Mombe", "Imbwa"],
            "“Ndiripo” means “I am well.”",
          ),
        ],
      },
      {
        title: "Polite talk",
        objective: "Use greetings, thanks and goodbyes in short everyday exchanges",
        activities: [
          txt("It is evening. Which greeting?", "Manheru", ["Mangwanani", "Masikati"], "“Manheru” means good evening!"),
          txt("Someone helps you. What can you say?", "Maita", ["Mvura", "Imba"], "“Maita” is a respectful way to say thank you."),
          txt("Someone says “Maita.” Which reply means “you’re welcome”?", "Titambire", ["Mombe", "Katsi"], "“Titambire” means you’re welcome."),
          txt("You are leaving. Which word means goodbye?", "Sara mushe", ["Huya pano", "Mangwanani"], "“Sara mushe” means stay well or goodbye."),
        ],
      },
    ],
  },
  {
    slug: "mhuri-friend",
    name: "Mhuri Friend",
    skills: ["Family members", "Family phrases", "Match descriptions", "Respectful forms"],
    lessons: [
      {
        title: "Meet the family",
        objective: "Name family members in Shona",
        activities: [
          txt("Which word means “mother”?", "Amai", ["Baba", "Sekuru"], "“Amai” means mother."),
          txt("Which word means “father”?", "Baba", ["Amai", "Sisi"], "“Baba” means father."),
        ],
      },
      {
        title: "Our family circle",
        objective: "Recognise grandparents and use simple family phrases",
        activities: [
          txt("Which word means “grandmother”?", "Ambuya", ["Sekuru", "Baba"], "“Ambuya” means grandmother."),
          txt("Which word means “grandfather”?", "Sekuru", ["Ambuya", "Amai"], "“Sekuru” means grandfather."),
          txt("What does “Amai vangu” mean?", "My mother", ["My father", "My house"], "“Vangu” shows that Amai is my mother."),
          txt("Complete the family pair: Amai na __", "Baba", ["Mvura", "Imba"], "“Amai na Baba” means mother and father."),
        ],
      },
    ],
  },
  {
    slug: "musha-explorer",
    name: "Musha Explorer",
    skills: ["Household objects", "Follow instructions", "Match actions", "Everyday talk"],
    lessons: [
      {
        title: "Around the home",
        objective: "Name everyday things around the home",
        activities: [
          txt("Which word means “water”?", "Mvura", ["Sadza", "Imba"], "“Mvura” means water!"),
          txt("Which word means “house”?", "Imba", ["Mvura", "Katsi"], "“Imba” means house!"),
        ],
      },
      {
        title: "Home helper mission",
        objective: "Understand simple home words and follow one-step instructions",
        activities: [
          txt("Which word means “food”?", "Chikafu", ["Mvura", "Imba"], "“Chikafu” means food."),
          txt("Which word means “book”?", "Bhuku", ["Mukombe", "Mubhedha"], "“Bhuku” means book."),
          txt("“Gara pasi” tells you to…", "Sit down", ["Run away", "Drink water"], "“Gara pasi” means sit down."),
          txt("“Huya pano” tells you to…", "Come here", ["Go to sleep", "Open a book"], "“Huya pano” means come here."),
        ],
      },
    ],
  },
  {
    slug: "mhuka-expert",
    name: "Mhuka Expert",
    skills: ["Name animals", "Match sounds", "Describe actions", "Wild & tame"],
    lessons: [
      {
        title: "Name the animals",
        objective: "Match spoken animal names to pictures",
        activities: [
          audioPic("imbwa", "Tap “imbwa”", "dog", ["cat", "cow"], "Hongu! “Imbwa” means dog."),
          audioPic("katsi", "Tap “katsi”", "cat", ["dog", "pig"], "Hongu! “Katsi” means cat."),
          audioPic("mombe", "Tap “mombe”", "cow", ["pig", "dog"], "Hongu! “Mombe” means cow."),
        ],
      },
      {
        title: "Animal clue challenge",
        objective: "Recall animal names and match them to sounds and descriptions",
        activities: [
          audioPic("nguruve", "Tap “nguruve”", "pig", ["cow", "dog"], "Hongu! “Nguruve” means pig."),
          txt("Which mhuka says “woof”?", "Imbwa", ["Katsi", "Mombe"], "Imbwa — the dog — says woof!"),
          txt("Which mhuka gives us milk?", "Mombe", ["Nguruve", "Katsi"], "Mombe means cow, and cows give us milk."),
          txt("What does “mhuka” mean?", "animal", ["house", "water"], "“Mhuka” means animal."),
        ],
      },
    ],
  },
  {
    slug: "ngano-listener",
    name: "Ngano Listener",
    skills: ["Listen to stories", "Identify people", "Order events", "Comprehension"],
    lessons: [
      {
        title: "Story time",
        objective: "Understand what a ngano is and who tells it",
        activities: [
          txt(
            "What is a “ngano”?",
            "A folk story",
            ["A dog", "Water"],
            "A “ngano” is a folk story told by elders!",
          ),
          txt(
            "Who often tells ngano?",
            "Ambuya (grandma)",
            ["A car", "A cup"],
            "Ambuya — grandmother — loves to tell ngano!",
          ),
        ],
      },
      {
        title: "Listen and remember",
        objective: "Recall characters, order events and find the message in a tiny ngano",
        activities: [
          txt("Ngano: Ambuya tells of Katsi. Katsi is hungry. Amai gives Katsi food. Katsi says “Maita.” Who tells the ngano?", "Ambuya", ["Katsi", "Amai"], "Ambuya — grandmother — tells the ngano."),
          txt("Who is hungry?", "Katsi", ["Ambuya", "Baba"], "Katsi, the cat, is hungry."),
          txt("What happens after Katsi gets food?", "Katsi says “Maita.”", ["Katsi asks for water.", "Ambuya leaves."], "Katsi says thank you after receiving food."),
          txt("What does the ngano remind us to do?", "Say thank you", ["Hide our food", "Forget our family"], "The story reminds us to show gratitude."),
        ],
      },
    ],
  },
]);

const shona: SubjectContent = {
  subject: {
    id: subjectId,
    name: "Shona World",
    order: 3,
    accent: "#C0791F",
    bg: "linear-gradient(180deg,#F8EEDC 0%,#FDF8EF 60%)",
    chip: "#F6EAD5",
    verbs: "Listen · speak · recognise · communicate",
    dragonLine: "Teach me which greeting we should use!",
    ranks: ["Mutambi", "Mutauri", "Shamwari yeShona", "Gamba", "Shasha yeShona"],
    art: {
      plaque: uni("ui/world_plaque_shona.png"),
      badge: uni("rewards/subject_badge_shona.png"),
      card: uni("worlds/shona_world_card.png"),
    },
  },
  badges,
  lessons,
};

export default shona;
