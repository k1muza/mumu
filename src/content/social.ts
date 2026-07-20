import type { SubjectContent } from "@/lib/types";
import { expandBadges, glyph, pic, txt, uni } from "./builders";

const subjectId = "social";

const { badges, lessons } = expandBadges(subjectId, [
  {
    slug: "community-helpers",
    name: "Community Helpers",
    skills: ["Who helps us", "Jobs & tools", "Where they work", "Staying safe"],
    lessons: [
      {
        title: "Helpers in our community",
        objective: "Recognise community helpers, their jobs and how they keep us safe",
        activities: [
          txt(
            "A doctor helps us when we feel…",
            "Sick",
            ["Sleepy", "Hungry"],
            "A doctor helps us feel better when we are sick!",
          ),
          pic(
            "Which vehicle does a bus driver drive?",
            "bus",
            ["cat", "cup"],
            "A bus driver drives the bus to help people travel!",
          ),
          txt(
            "What does a teacher help you do?",
            "Learn new things",
            ["Cook dinner", "Fly a plane"],
            "Teachers help us learn new things every day!",
          ),
          glyph(
            "A firefighter is brave. What do they put out?",
            "🔥",
            ["🌧️", "🎈"],
            "Firefighters keep us safe by putting out fires!",
          ),
          txt(
            "If you are lost, who is a safe helper to ask?",
            "A police officer",
            ["A stranger in a car", "Nobody"],
            "A police officer helps keep us safe!",
          ),
        ],
      },
    ],
  },
  {
    slug: "my-family-home",
    name: "My Family & Home",
    skills: ["Family members", "Our homes", "Helping at home", "Belonging"],
    lessons: [
      {
        title: "My family and home",
        objective: "Identify family relationships and ways to help and belong at home",
        activities: [
          txt(
            "Who is a grown-up that cares for you?",
            "A parent",
            ["A puppy", "A pencil"],
            "Parents care for us and keep us safe!",
          ),
          txt(
            "A brother or sister is your…",
            "Sibling",
            ["Teacher", "Neighbour"],
            "Brothers and sisters are your siblings!",
          ),
          txt(
            "Where does a family live together?",
            "In a home",
            ["In a bus", "In a cup"],
            "Families live together in a home!",
          ),
          txt(
            "A kind way to help your family at home is to…",
            "Tidy my toys",
            ["Make a big mess", "Break things"],
            "Tidying up is a wonderful way to help!",
          ),
          glyph(
            "Which shows a happy time with family?",
            "🎉",
            ["😴", "🌧️"],
            "Families love to celebrate happy times together!",
          ),
        ],
      },
    ],
  },
  {
    slug: "map-explorer",
    name: "Map Explorer",
    skills: ["Near & far", "Read a simple map", "Places in town", "Follow directions"],
    lessons: [
      {
        title: "Near, far and on the map",
        objective: "Use simple map clues and compare where places are",
        activities: [
          pic(
            "Which one shows us where places are?",
            "map",
            ["cup", "hat"],
            "A map shows us where places are!",
          ),
          txt(
            "Your friend lives far away. “Far” means…",
            "A long way away",
            ["Very close", "Next door"],
            "Far means a long way away!",
          ),
          txt(
            "On a map, blue usually shows…",
            "Water",
            ["Roads", "Trees"],
            "Blue shows water, like rivers and the sea!",
          ),
          txt(
            "Which is nearer to you — your shoes or the moon?",
            "My shoes",
            ["The moon"],
            "Your shoes are near; the moon is very far!",
          ),
          pic(
            "Which would you find in a park on a map?",
            "tree",
            ["bus", "cup"],
            "Parks are full of trees!",
          ),
        ],
      },
    ],
  },
  {
    slug: "long-ago-today",
    name: "Long Ago & Today",
    skills: ["Old & new", "Changes over time", "Order events", "Then vs now"],
    lessons: [
      {
        title: "Then and now",
        objective: "Compare life long ago with life today and order events in time",
        activities: [
          txt(
            "Long ago people sent letters. Today we can send a…",
            "Text message",
            ["Carrier pigeon", "Smoke signal"],
            "Today we send quick text messages!",
          ),
          txt(
            "Which is from long ago?",
            "A horse and cart",
            ["A car", "A jet"],
            "Long ago people travelled by horse and cart!",
          ),
          txt(
            "Grandparents were born…",
            "Before you",
            ["After you", "Tomorrow"],
            "Grandparents were born long before you!",
          ),
          txt(
            "Baby, child, grown-up — who is the youngest?",
            "Baby",
            ["Grown-up", "Child"],
            "A baby is the youngest of all!",
          ),
          glyph(
            "Which lights a room today?",
            "💡",
            ["🕯️", "🔥"],
            "Today we use bright electric lights!",
          ),
        ],
      },
    ],
  },
  {
    slug: "good-citizen",
    name: "Good Citizen",
    skills: ["Fair rules", "Taking turns", "Kindness", "Caring for our world"],
    lessons: [
      {
        title: "Kind and caring citizens",
        objective: "Choose fair, kind and responsible ways to care for people and places",
        activities: [
          txt(
            "It is your friend’s turn on the swing. You should…",
            "Wait your turn",
            ["Push in", "Grab it"],
            "Taking turns is fair and kind!",
          ),
          glyph(
            "Where does litter belong?",
            "🗑️",
            ["🌳", "🌊"],
            "Litter goes in the bin to keep our world clean!",
          ),
          txt(
            "A classmate falls down. A kind thing to do is…",
            "Help them up",
            ["Laugh at them", "Walk away"],
            "Helping others makes you a good friend!",
          ),
          txt(
            "Rules help everyone to…",
            "Stay safe and be fair",
            ["Have no fun", "Be unkind"],
            "Rules keep everyone safe and fair!",
          ),
          glyph(
            "Which helps care for our planet?",
            "♻️",
            ["🚗", "🏭"],
            "Recycling helps us care for our world!",
          ),
        ],
      },
    ],
  },
  {
    slug: "needs-and-wants",
    name: "Needs & Wants",
    skills: ["Needs vs wants", "Food & shelter", "Sharing", "Celebrations"],
    lessons: [
      {
        title: "What we need and want",
        objective: "Tell needs from wants and practise sharing with others",
        activities: [
          txt(
            "Which is something we NEED to live?",
            "Food",
            ["A new toy", "Sweets"],
            "We need food to live and grow strong!",
          ),
          txt(
            "Which is a WANT — nice, but not needed?",
            "A new toy",
            ["Water", "Shelter"],
            "A toy is a want — fun, but not needed!",
          ),
          glyph(
            "Which keeps you warm, safe and dry?",
            "🏠",
            ["🍭", "🎈"],
            "A home keeps us warm, safe and dry — that’s a need!",
          ),
          txt(
            "You have two cookies; your friend has none. You could…",
            "Share one",
            ["Eat both quickly", "Hide them"],
            "Sharing is caring!",
          ),
          glyph(
            "Which shows a celebration?",
            "🎂",
            ["🧹", "📏"],
            "A birthday cake means a happy celebration!",
          ),
        ],
      },
    ],
  },
]);

const social: SubjectContent = {
  subject: {
    id: subjectId,
    name: "Social Sciences World",
    environment: "Community Island",
    order: 5,
    accent: "#D4356B",
    bg: "linear-gradient(180deg,#FCE7EF 0%,#FEF5F8 60%)",
    chip: "#FBE1EB",
    verbs: "Explore · describe · compare · share · care",
    dragonLine: "Let’s find out about the people around us!",
    ranks: ["Community Scout", "Helpful Neighbour", "Map Explorer", "Citizen Champion", "Social Sciences Star"],
    art: {
      card: uni("worlds/social_sciences_world.png"),
    },
  },
  badges,
  lessons,
};

export default social;
