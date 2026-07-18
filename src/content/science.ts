import type { SubjectContent } from "@/lib/types";
import { expandBadges, glyph, pic, predict, txt, uni } from "./builders";

const subjectId = "science";

const { badges, lessons } = expandBadges(subjectId, [
  {
    slug: "animal-explorer",
    name: "Animal Explorer",
    skills: ["Habitats", "Group animals", "What they eat", "How they move"],
    lessons: [
      {
        title: "Amazing animals",
        objective: "Recognise animals and what they do",
        activities: [
          pic(
            "Which one is an animal?",
            "cat",
            ["bus", "cup"],
            "A cat is an animal — it eats, breathes and moves!",
          ),
          pic("Which animal gives us milk?", "cow", ["dog", "pig"], "Cows give us milk!"),
          pic("Which animal barks?", "dog", ["cat", "cow"], "Dogs bark: woof!"),
          predict(
            "Will a light leaf float on water?",
            "It floats",
            ["It sinks"],
            "A light leaf floats on top of the water!",
          ),
        ],
      },
      {
        title: "Animal clue safari",
        objective: "Classify animals by habitat, food and movement",
        activities: [
          txt("Where does a fish live?", "In water", ["In a tree", "In a nest"], "Fish have bodies that help them live and swim in water."),
          pic("Which animal mostly eats grass?", "cow", ["cat", "dog"], "A cow is a plant-eater and grazes on grass."),
          txt("Which animal moves by flying?", "bird", ["cow", "pig"], "A bird uses its wings to fly."),
          txt("Which pair are both farm animals?", "cow and pig", ["fish and lion", "cat and fish"], "Cows and pigs can both live on a farm."),
        ],
      },
    ],
  },
  {
    slug: "plant-detective",
    name: "Plant Detective",
    skills: ["Plant parts", "How they grow", "What they need", "Observe change"],
    lessons: [
      {
        title: "How plants grow",
        objective: "Discover what plants need to grow",
        activities: [
          pic("Which one grows in the ground?", "tree", ["jet", "cup"], "Trees grow up from the ground!"),
          predict(
            "Do plants need water to grow?",
            "Yes",
            ["No"],
            "Plants drink water to grow big and strong.",
          ),
          pic(
            "Which gives cool shade on a hot day?",
            "tree",
            ["bus", "hat"],
            "A big leafy tree gives cool shade!",
          ),
        ],
      },
      {
        title: "From seed to plant",
        objective: "Identify plant parts and sequence the needs and stages of growth",
        activities: [
          txt("Which plant part drinks water from the soil?", "roots", ["flower", "fruit"], "Roots take in water and hold the plant steady."),
          txt("Which plant part catches sunlight?", "leaves", ["roots", "seed"], "Leaves use sunlight to help make food for the plant."),
          txt("What usually comes first?", "seed", ["flower", "fruit"], "A new plant begins as a seed."),
          predict("A plant gets water but stays in a dark cupboard. Will it grow strong and green?", "No", ["Yes"], "Plants need light as well as water to grow well."),
        ],
      },
    ],
  },
  {
    slug: "weather-watcher",
    name: "Weather Watcher",
    skills: ["Weather types", "Suitable clothes", "Daily weather", "Compare"],
    lessons: [
      {
        title: "Dress for the weather",
        objective: "Choose suitable clothing for the weather",
        activities: [
          glyph(
            "It is raining. What do you wear?",
            "🧥",
            ["🕶️", "🩳"],
            "A coat keeps you dry in the rain!",
          ),
          glyph(
            "The sun is very hot. What helps?",
            "🕶️",
            ["🧤", "🧣"],
            "Sunglasses shade your eyes from bright sun!",
          ),
        ],
      },
      {
        title: "Weather clue watchers",
        objective: "Use sky and wind clues to describe weather and plan safely",
        activities: [
          glyph("Dark clouds and drops are falling. What is the weather?", "🌧️", ["☀️", "🌬️"], "Dark clouds and falling drops tell us it is raining."),
          txt("A flag is flapping fast. What does that tell us?", "It is windy", ["It is snowy", "It is night"], "A moving flag is a clue that the air is windy."),
          txt("What should you take on a rainy walk?", "an umbrella", ["sunglasses only", "a fan"], "An umbrella helps keep rain off your body."),
          predict("The sun comes out after rain. Might a puddle get smaller?", "Yes", ["No"], "Warmth from the sun helps puddle water evaporate."),
        ],
      },
    ],
  },
  {
    slug: "young-experimenter",
    name: "Young Experimenter",
    skills: ["Predict", "Observe", "Compare", "Cause & effect"],
    lessons: [
      {
        title: "Predict and test",
        objective: "Make predictions and observe outcomes",
        activities: [
          predict(
            "Which is heavier — a car or a cup?",
            "The car",
            ["The cup"],
            "A car is much heavier than a little cup!",
          ),
          predict(
            "Will a heavy rock sink in water?",
            "It sinks",
            ["It floats"],
            "A heavy rock sinks to the bottom!",
          ),
        ],
      },
      {
        title: "Fair-test lab",
        objective: "Choose a fair test, observe evidence and compare materials",
        activities: [
          predict("Which will soak up a small spill better?", "A cloth", ["A metal spoon"], "Cloth has tiny spaces that soak up water."),
          txt("To test which paper plane flies farther, what should stay the same?", "The throw", ["The plane colour", "The winner"], "Using the same kind of throw makes the test fairer."),
          txt("What should a scientist do after making a prediction?", "Test and observe", ["Change the answer", "Hide the result"], "Scientists test, watch closely and use what they observe."),
          predict("A toy car rolls down a steeper ramp. Will it probably travel faster?", "Yes", ["No"], "A steeper ramp usually makes the toy car speed up."),
        ],
      },
    ],
  },
  {
    slug: "body-explorer",
    name: "Body Explorer",
    skills: ["Body parts", "Senses", "Healthy habits", "Movement"],
    lessons: [
      {
        title: "My amazing body",
        objective: "Match senses to the body parts that use them",
        activities: [
          glyph("Which do you SEE with?", "👁️", ["👂", "👃"], "You see with your eyes!"),
          glyph("Which do you HEAR with?", "👂", ["👁️", "👄"], "You hear with your ears!"),
          predict(
            "Is running good exercise?",
            "Yes",
            ["No"],
            "Running keeps your body strong and healthy!",
          ),
        ],
      },
      {
        title: "Healthy-body helpers",
        objective: "Connect body parts and senses to safe, healthy daily choices",
        activities: [
          glyph("Which body part helps you smell a flower?", "👃", ["👂", "👁️"], "Your nose is your body’s smelling organ."),
          txt("What helps your body grow and repair while you rest?", "sleep", ["loud noise", "sweets only"], "Sleep gives a growing body time to rest and repair."),
          txt("Which choice helps keep teeth healthy?", "Brush them", ["Never clean them", "Eat sweets all day"], "Brushing removes food and helps protect your teeth."),
          predict("After running, will your heart beat faster?", "Yes", ["No"], "Your heart beats faster to move more oxygen around your body."),
        ],
      },
    ],
  },
]);

const science: SubjectContent = {
  subject: {
    id: subjectId,
    name: "Science World",
    order: 2,
    accent: "#3E9A34",
    bg: "linear-gradient(180deg,#E9F6E2 0%,#F6FBF2 60%)",
    chip: "#E6F5DF",
    verbs: "Observe · classify · predict · test · explain",
    dragonLine: "What do you predict will happen?",
    ranks: ["Curious Cub", "Nature Scout", "Lab Explorer", "Science Wizard", "Science Prodigy"],
    art: {
      plaque: uni("ui/world_plaque_science.png"),
      badge: uni("rewards/subject_badge_science.png"),
      card: uni("worlds/science_world_card.png"),
    },
  },
  badges,
  lessons,
};

export default science;
