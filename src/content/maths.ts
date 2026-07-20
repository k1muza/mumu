import type { SubjectContent } from "@/lib/types";
import {
  addGroups,
  addNum,
  barsOrder,
  clockPick,
  clockRead,
  coinPick,
  coinTotal,
  compareNumbers,
  countObjects,
  countRow,
  expandBadges,
  flatShapeCount,
  flatShapePick,
  lengthPick,
  numPick,
  obj,
  ordinalPick,
  rulerCount,
  setPick,
  subNum,
  subtractGroups,
  txt,
  uni,
  vary,
} from "./builders";

const subjectId = "maths";
const star = uni("rewards/star_gold.webp");

const { badges, lessons } = expandBadges(subjectId, [
  {
    slug: "number-order",
    name: "Number Order",
    skills: ["Smallest & largest", "Order numbers", "Greater & smaller", "Missing numbers"],
    lessons: [
      {
        title: "Smallest and largest",
        objective: "Find the smallest and largest numbers in a group",
        activities: [
          vary(
            countObjects(3, "How many stars?", [2, 3, 4], "Count them: 1, 2, 3. There are three!"),
            countObjects(4, "How many stars?", [3, 4, 5], "Count them: 1, 2, 3, 4. There are four!"),
            countObjects(5, "How many stars?", [4, 5, 6], "Count them: 1, 2, 3, 4, 5. There are five!"),
          ),
          vary(
            numPick("Tap the smallest number:  8   3   6   1", 1, [8, 3, 6], "Smallest of all — 1 is the littlest!"),
            numPick("Tap the smallest number:  9   4   7   2", 2, [9, 4, 7], "Smallest of all — 2 is the littlest!"),
            numPick("Tap the smallest number:  6   3   8   5", 3, [6, 8, 5], "Smallest of all — 3 is the littlest!"),
          ),
          vary(
            numPick("Which is the largest?  6, 14, 2", 14, [6, 2], "14 is the biggest number here!"),
            numPick("Which is the largest?  9, 5, 17", 17, [9, 5], "17 is the biggest number here!"),
            numPick("Which is the largest?  12, 8, 19", 19, [12, 8], "19 is the biggest number here!"),
          ),
        ],
      },
      {
        title: "Put numbers in order",
        objective: "Order numbers, compare them and fill in missing numbers",
        activities: [
          vary(
            txt("Put them in order, smallest first:  9, 4, 7", "4, 7, 9", ["9, 7, 4", "7, 4, 9"], "Smallest to largest: 4, 7, 9!"),
            txt("Put them in order, smallest first:  8, 3, 5", "3, 5, 8", ["8, 5, 3", "5, 3, 8"], "Smallest to largest: 3, 5, 8!"),
            txt("Put them in order, smallest first:  6, 10, 2", "2, 6, 10", ["10, 6, 2", "6, 2, 10"], "Smallest to largest: 2, 6, 10!"),
          ),
          vary(
            compareNumbers("Which number is greater — 12 or 15?", 15, 12, "15 is greater than 12."),
            compareNumbers("Which number is greater — 11 or 14?", 14, 11, "14 is greater than 11."),
            compareNumbers("Which number is greater — 13 or 18?", 18, 13, "18 is greater than 13."),
          ),
          vary(
            numPick("Fill in the missing number:  10, 11, ___, 13", 12, [14, 9], "10, 11, 12, 13 — 12 fills the gap!"),
            numPick("Fill in the missing number:  6, 7, ___, 9", 8, [10, 5], "6, 7, 8, 9 — 8 fills the gap!"),
            numPick("Fill in the missing number:  15, 16, ___, 18", 17, [19, 14], "15, 16, 17, 18 — 17 fills the gap!"),
          ),
        ],
      },
    ],
  },
  {
    slug: "shape-finder",
    name: "Shape Finder",
    skills: ["Name shapes", "Count sides", "Corners & curves", "Count shapes"],
    lessons: [
      {
        title: "Sides and corners",
        objective: "Identify shapes by their sides and corners",
        activities: [
          vary(
            flatShapePick(
              "Tap the shape that has 3 sides",
              "triangle",
              ["circle", "square"],
              "A triangle has 3 sides!",
            ),
            flatShapePick(
              "Tap the shape that has 4 sides",
              "square",
              ["circle", "triangle"],
              "A square has 4 sides!",
            ),
            flatShapePick(
              "Tap the shape that has 3 corners",
              "triangle",
              ["square", "circle"],
              "A triangle has 3 corners!",
            ),
          ),
          vary(
            numPick("How many sides does a square have?", 4, [3, 5], "A square has 4 equal sides!"),
            numPick("How many sides does a triangle have?", 3, [2, 4], "A triangle has 3 sides!"),
            numPick("How many corners does a square have?", 4, [3, 5], "A square has 4 corners!"),
          ),
          vary(
            flatShapePick(
              "Tap the shape that has no corners",
              "circle",
              ["square", "triangle"],
              "A circle is round — no corners at all!",
            ),
            flatShapePick(
              "Tap the shape that has 4 corners",
              "square",
              ["circle", "triangle"],
              "A square has 4 corners!",
            ),
          ),
        ],
      },
      {
        title: "Spot and count shapes",
        objective: "Recognise round shapes and count shapes in a group",
        activities: [
          vary(
            flatShapeCount(3, "triangle", "How many triangles do you see?", [2, 3, 4], "Count them: 1, 2, 3 triangles!"),
            flatShapeCount(4, "square", "How many squares do you see?", [3, 4, 5], "Count them: 1, 2, 3, 4 squares!"),
            flatShapeCount(2, "circle", "How many circles do you see?", [2, 3, 4], "Count them: 1, 2 circles!"),
          ),
          vary(
            flatShapePick(
              "Tap the round shape (the circle)",
              "circle",
              ["square", "triangle"],
              "Round like a ball — that’s the circle!",
            ),
            flatShapePick(
              "Tap the square",
              "square",
              ["circle", "triangle"],
              "Four equal sides — that’s the square!",
            ),
            flatShapePick(
              "Tap the triangle",
              "triangle",
              ["circle", "square"],
              "Three pointy corners — that’s the triangle!",
            ),
          ),
        ],
      },
    ],
  },
  {
    slug: "counting-sets",
    name: "Counting Sets",
    skills: ["Count 0–5", "Count objects", "Match the set", "Empty sets"],
    lessons: [
      {
        title: "Count the objects",
        objective: "Count objects in a group accurately up to 5",
        activities: [
          vary(
            countObjects(5, "Count the stars. How many?", [4, 5, 6], "1, 2, 3, 4, 5 — five stars!"),
            countObjects(4, "Count the stars. How many?", [3, 4, 5], "1, 2, 3, 4 — four stars!"),
            countObjects(3, "Count the stars. How many?", [2, 3, 4], "1, 2, 3 — three stars!"),
          ),
          vary(
            countRow(4, obj("mango"), "Count the mangoes. How many?", [3, 4, 5], "Four juicy mangoes!"),
            countRow(5, obj("mango"), "Count the mangoes. How many?", [4, 5, 6], "Five juicy mangoes!"),
            countRow(3, obj("mango"), "Count the mangoes. How many?", [2, 3, 4], "Three juicy mangoes!"),
          ),
        ],
      },
      {
        title: "Match the set",
        objective: "Match sets to numbers, including the empty set for zero",
        activities: [
          vary(
            setPick("Tap the set that has 2 objects", 2, [3, 1], star, "That set has 2 — count: 1, 2!"),
            setPick("Tap the set that has 3 objects", 3, [2, 4], star, "That set has 3 — count: 1, 2, 3!"),
            setPick("Tap the set that has 1 object", 1, [2, 3], star, "Just one on its own — that’s 1!"),
          ),
          vary(
            setPick("Tap the box that has 0 objects", 0, [2, 3], star, "0 means none — the empty box!"),
            setPick("Tap the box that has 0 objects", 0, [1, 4], star, "0 means none — the empty box!"),
          ),
          vary(
            setPick("Which box shows 4 stars?", 4, [3, 5], star, "Four stars — 1, 2, 3, 4!"),
            setPick("Which box shows 5 stars?", 5, [4, 3], star, "Five stars — 1, 2, 3, 4, 5!"),
            setPick("Which box shows 3 stars?", 3, [4, 2], star, "Three stars — 1, 2, 3!"),
          ),
        ],
      },
    ],
  },
  {
    slug: "addition-to-15",
    name: "Addition to 15",
    skills: ["Put together", "Count on", "Word problems", "Sums to 15"],
    lessons: [
      {
        title: "Put the groups together",
        objective: "Combine two groups of objects and count the total",
        activities: [
          vary(
            addGroups(3, 2, "Put the groups together. How many in all?", [4, 5, 6], "3 and 2 make 5!"),
            addGroups(4, 2, "Put the groups together. How many in all?", [5, 6, 7], "4 and 2 make 6!"),
            addGroups(2, 2, "Put the groups together. How many in all?", [3, 4, 5], "2 and 2 make 4!"),
          ),
          vary(
            addGroups(4, 3, "Join the two groups. How many altogether?", [6, 7, 8], "4 and 3 make 7!"),
            addGroups(5, 3, "Join the two groups. How many altogether?", [7, 8, 9], "5 and 3 make 8!"),
            addGroups(5, 4, "Join the two groups. How many altogether?", [8, 9, 10], "5 and 4 make 9!"),
          ),
          vary(
            numPick("Sam has 5 marbles and gets 3 more. How many now?", 8, [7, 9], "5 + 3 = 8 marbles!"),
            numPick("Tia has 4 sweets and gets 2 more. How many now?", 6, [5, 7], "4 + 2 = 6 sweets!"),
            numPick("Ben has 6 stickers and gets 3 more. How many now?", 9, [8, 10], "6 + 3 = 9 stickers!"),
          ),
        ],
      },
      {
        title: "Sums to 15",
        objective: "Add two numbers with sums up to 15",
        activities: [
          vary(
            addNum(7, 4, [10, 11, 12], "7 + 4 = 11!"),
            addNum(8, 3, [10, 11, 12], "8 + 3 = 11!"),
            addNum(6, 5, [10, 11, 12], "6 + 5 = 11!"),
          ),
          vary(
            addNum(9, 6, [14, 15, 16], "9 + 6 = 15!"),
            addNum(10, 5, [14, 15, 16], "10 + 5 = 15!"),
            addNum(8, 6, [13, 14, 15], "8 + 6 = 14!"),
          ),
          vary(
            numPick("Mia has 9 beads and gets 4 more. How many now?", 13, [12, 14], "9 + 4 = 13 beads!"),
            numPick("Leo has 7 shells and finds 5 more. How many now?", 12, [11, 13], "7 + 5 = 12 shells!"),
            numPick("Zoe has 8 crayons and gets 7 more. How many now?", 15, [14, 16], "8 + 7 = 15 crayons!"),
          ),
        ],
      },
    ],
  },
  {
    slug: "subtraction-to-15",
    name: "Subtraction to 15",
    skills: ["Take away", "Count back", "Word problems", "Differences"],
    lessons: [
      {
        title: "Take some away",
        objective: "Cross out objects and count how many are left",
        activities: [
          vary(
            subtractGroups(
              5,
              2,
              "Five stars are shining. Take away two. How many are left?",
              [2, 3, 4],
              "Five take away two leaves three!",
            ),
            subtractGroups(
              6,
              2,
              "Six stars are shining. Take away two. How many are left?",
              [3, 4, 5],
              "Six take away two leaves four!",
            ),
            subtractGroups(
              4,
              1,
              "Four stars are shining. Take away one. How many are left?",
              [2, 3, 4],
              "Four take away one leaves three!",
            ),
          ),
          vary(
            subtractGroups(
              6,
              1,
              "Start with six stars. Take away one. How many are left?",
              [4, 5, 6],
              "Six take away one leaves five!",
            ),
            subtractGroups(
              7,
              2,
              "Start with seven stars. Take away two. How many are left?",
              [4, 5, 6],
              "Seven take away two leaves five!",
            ),
            subtractGroups(
              5,
              1,
              "Start with five stars. Take away one. How many are left?",
              [3, 4, 5],
              "Five take away one leaves four!",
            ),
          ),
          vary(
            subtractGroups(
              7,
              3,
              "Seven stars are shining. Three drift away. How many stay?",
              [3, 4, 5],
              "Seven take away three leaves four!",
            ),
            subtractGroups(
              8,
              3,
              "Eight stars are shining. Three drift away. How many stay?",
              [4, 5, 6],
              "Eight take away three leaves five!",
            ),
            subtractGroups(
              6,
              3,
              "Six stars are shining. Three drift away. How many stay?",
              [2, 3, 4],
              "Six take away three leaves three!",
            ),
          ),
        ],
      },
      {
        title: "Take away within 15",
        objective: "Subtract two numbers within 15",
        activities: [
          vary(
            subNum(12, 4, [7, 8, 9], "12 − 4 = 8!"),
            subNum(11, 3, [7, 8, 9], "11 − 3 = 8!"),
            subNum(13, 5, [7, 8, 9], "13 − 5 = 8!"),
          ),
          vary(
            subNum(15, 6, [8, 9, 10], "15 − 6 = 9!"),
            subNum(14, 5, [8, 9, 10], "14 − 5 = 9!"),
            subNum(15, 7, [7, 8, 9], "15 − 7 = 8!"),
          ),
          vary(
            subNum(10, 4, [5, 6, 7], "10 − 4 = 6!"),
            subNum(10, 3, [6, 7, 8], "10 − 3 = 7!"),
            subNum(9, 4, [4, 5, 6], "9 − 4 = 5!"),
          ),
        ],
      },
      {
        title: "Subtraction stories",
        objective: "Solve take-away story problems within 15",
        activities: [
          vary(
            numPick("12 birds are on a tree. 4 fly away. How many are left?", 8, [7, 9], "12 − 4 = 8 birds!"),
            numPick("11 birds are on a tree. 3 fly away. How many are left?", 8, [7, 9], "11 − 3 = 8 birds!"),
            numPick("13 birds are on a tree. 5 fly away. How many are left?", 8, [7, 9], "13 − 5 = 8 birds!"),
          ),
          vary(
            subNum(15, 8, [6, 7, 8], "15 − 8 = 7!"),
            subNum(14, 7, [6, 7, 8], "14 − 7 = 7!"),
            subNum(13, 6, [6, 7, 8], "13 − 6 = 7!"),
          ),
        ],
      },
    ],
  },
  {
    slug: "time-teller",
    name: "Time Teller",
    skills: ["O’clock", "Half past", "Read a clock", "One hour later"],
    lessons: [
      {
        title: "O’clock",
        objective: "Read whole hours on an analogue clock",
        activities: [
          vary(
            clockRead(3, 0, "3 o’clock", ["6 o’clock", "9 o’clock"], "The little hand points to 3 — 3 o’clock!"),
            clockRead(6, 0, "6 o’clock", ["3 o’clock", "12 o’clock"], "The little hand points to 6 — 6 o’clock!"),
            clockRead(11, 0, "11 o’clock", ["10 o’clock", "12 o’clock"], "The little hand points to 11 — 11 o’clock!"),
          ),
          vary(
            clockPick("Which clock shows 7 o’clock?", [7, 0], [[3, 0], [10, 0]], "Little hand on 7 — that’s 7 o’clock!"),
            clockPick("Which clock shows 4 o’clock?", [4, 0], [[8, 0], [11, 0]], "Little hand on 4 — that’s 4 o’clock!"),
            clockPick("Which clock shows 2 o’clock?", [2, 0], [[6, 0], [9, 0]], "Little hand on 2 — that’s 2 o’clock!"),
          ),
          vary(
            clockPick("Tap the clock that shows 9 o’clock", [9, 0], [[12, 0], [3, 0]], "Little hand on 9 — 9 o’clock!"),
            clockPick("Tap the clock that shows 1 o’clock", [1, 0], [[5, 0], [10, 0]], "Little hand on 1 — 1 o’clock!"),
            clockPick("Tap the clock that shows 12 o’clock", [12, 0], [[6, 0], [3, 0]], "Both hands straight up — 12 o’clock!"),
          ),
        ],
      },
      {
        title: "Half past and one hour later",
        objective: "Read half-past times and work out the time one hour later",
        activities: [
          vary(
            clockPick("Which clock shows half past 5?", [5, 30], [[5, 0], [6, 30]], "Half past 5 — the big hand points to 6!"),
            clockPick("Which clock shows half past 8?", [8, 30], [[8, 0], [9, 30]], "Half past 8 — the big hand points to 6!"),
            clockPick("Which clock shows half past 2?", [2, 30], [[2, 0], [3, 30]], "Half past 2 — the big hand points to 6!"),
          ),
          vary(
            txt(
              "It is 2 o’clock now. What time will it be in one hour?",
              "3 o’clock",
              ["1 o’clock", "4 o’clock"],
              "One hour after 2 o’clock is 3 o’clock!",
            ),
            txt(
              "It is 6 o’clock now. What time will it be in one hour?",
              "7 o’clock",
              ["5 o’clock", "8 o’clock"],
              "One hour after 6 o’clock is 7 o’clock!",
            ),
            txt(
              "It is 10 o’clock now. What time will it be in one hour?",
              "11 o’clock",
              ["9 o’clock", "12 o’clock"],
              "One hour after 10 o’clock is 11 o’clock!",
            ),
          ),
        ],
      },
    ],
  },
  {
    slug: "ordinal-order",
    name: "Ordinal Order",
    skills: ["1st, 2nd, 3rd", "Positions", "Which position", "Ordinal words"],
    lessons: [
      {
        title: "Find the position",
        objective: "Point to objects by their ordinal position in a row",
        activities: [
          vary(
            ordinalPick(
              "Tap the 3rd shape in the row",
              ["blue_triangle", "orange_sphere", "green_cube", "purple_cube"],
              2,
              "The 3rd shape is the cube!",
            ),
            ordinalPick(
              "Tap the 4th shape in the row",
              ["green_cube", "blue_triangle", "orange_sphere", "purple_cube"],
              3,
              "The 4th shape is the cube!",
            ),
            ordinalPick(
              "Tap the 3rd shape in the row",
              ["purple_cube", "green_cube", "orange_sphere", "blue_triangle"],
              2,
              "The 3rd shape is the sphere!",
            ),
          ),
          vary(
            ordinalPick(
              "Tap the shape in the 1st position",
              ["orange_sphere", "blue_triangle", "green_cube", "purple_cube"],
              0,
              "First in line — that’s the 1st!",
            ),
            ordinalPick(
              "Tap the shape in the 1st position",
              ["purple_cube", "green_cube", "orange_sphere", "blue_triangle"],
              0,
              "First in line — that’s the 1st!",
            ),
            ordinalPick(
              "Tap the shape in the 4th position",
              ["blue_triangle", "green_cube", "purple_cube", "orange_sphere"],
              3,
              "Last in line — that’s the 4th!",
            ),
          ),
          vary(
            ordinalPick(
              "Tap the shape in the 2nd position",
              ["green_cube", "purple_cube", "blue_triangle", "orange_sphere"],
              1,
              "Second in line — that’s the 2nd!",
            ),
            ordinalPick(
              "Tap the shape in the 3rd position",
              ["blue_triangle", "orange_sphere", "purple_cube", "green_cube"],
              2,
              "Third in line — that’s the 3rd!",
            ),
            ordinalPick(
              "Tap the shape in the 2nd position",
              ["orange_sphere", "green_cube", "blue_triangle", "purple_cube"],
              1,
              "Second in line — that’s the 2nd!",
            ),
          ),
        ],
      },
      {
        title: "Ordinal words",
        objective: "Use ordinal words like 3rd and 5th to describe positions",
        activities: [
          vary(
            txt("What is the ordinal word for position 5?", "5th", ["4th", "6th"], "Position 5 is the 5th!"),
            txt("What is the ordinal word for position 8?", "8th", ["7th", "9th"], "Position 8 is the 8th!"),
            txt("What is the ordinal word for position 2?", "2nd", ["1st", "3rd"], "Position 2 is the 2nd!"),
          ),
          vary(
            txt("In the word CAT, which position is the letter T?", "3rd", ["1st", "2nd"], "C-A-T — T is the 3rd letter!"),
            txt("In the word DOG, which position is the letter G?", "3rd", ["1st", "2nd"], "D-O-G — G is the 3rd letter!"),
            txt("In the word SUN, which position is the letter U?", "2nd", ["1st", "3rd"], "S-U-N — U is the 2nd letter!"),
          ),
        ],
      },
    ],
  },
  {
    slug: "measure-explorer",
    name: "Measure Explorer",
    skills: ["Longer & shorter", "Measure length", "Compare sizes", "Order by length"],
    lessons: [
      {
        title: "Longer or shorter",
        objective: "Compare lengths and pick the longer or shorter object",
        activities: [
          vary(
            lengthPick(
              "Tap the longer pencil",
              [
                { len: 120, color: "#F2B400", label: "Pencil A", look: "pencil" as const },
                { len: 210, color: "#E07B39", label: "Pencil B", look: "pencil" as const },
              ],
              1,
              "Pencil B is longer — it reaches further!",
            ),
            lengthPick(
              "Tap the longer pencil",
              [
                { len: 230, color: "#2F9FAE", label: "Pencil A", look: "pencil" as const },
                { len: 130, color: "#C94F8A", label: "Pencil B", look: "pencil" as const },
              ],
              0,
              "Pencil A is longer — it reaches further!",
            ),
            lengthPick(
              "Tap the shorter pencil",
              [
                { len: 200, color: "#6C3AD6", label: "Pencil A", look: "pencil" as const },
                { len: 115, color: "#F2B400", label: "Pencil B", look: "pencil" as const },
              ],
              1,
              "Pencil B is shorter — it stops sooner!",
            ),
          ),
          vary(
            txt("Which is shorter — a shoe or a bus?", "A shoe", ["A bus"], "A shoe is much shorter than a bus!"),
            txt("Which is shorter — a spoon or a broom?", "A spoon", ["A broom"], "A spoon is much shorter than a broom!"),
            txt("Which is longer — a train or a bicycle?", "A train", ["A bicycle"], "A train is much longer than a bicycle!"),
          ),
          vary(
            lengthPick(
              "Tap the longest object",
              [
                { len: 110, color: "#6C3AD6", label: "A" },
                { len: 250, color: "#C94F8A", label: "B" },
                { len: 170, color: "#2F9FAE", label: "C" },
              ],
              1,
              "B stretches the longest!",
            ),
            lengthPick(
              "Tap the longest object",
              [
                { len: 120, color: "#F2B400", label: "A" },
                { len: 160, color: "#6C3AD6", label: "B" },
                { len: 240, color: "#E07B39", label: "C" },
              ],
              2,
              "C stretches the longest!",
            ),
            lengthPick(
              "Tap the shortest object",
              [
                { len: 220, color: "#2F9FAE", label: "A" },
                { len: 100, color: "#C94F8A", label: "B" },
                { len: 180, color: "#F2B400", label: "C" },
              ],
              1,
              "B is the shortest of the three!",
            ),
          ),
        ],
      },
      {
        title: "Measure and order",
        objective: "Measure with informal units and order objects by length",
        activities: [
          vary(
            rulerCount(4, "How many paperclips long is the line?", [3, 4, 5], "It measures 4 paperclips!"),
            rulerCount(5, "How many paperclips long is the line?", [4, 5, 6], "It measures 5 paperclips!"),
            rulerCount(3, "How many paperclips long is the line?", [2, 3, 4], "It measures 3 paperclips!"),
          ),
          vary(
            barsOrder(
              "Order the lines from shortest to longest",
              [
                { label: "A", len: 210 },
                { label: "B", len: 110 },
                { label: "C", len: 160 },
              ],
              "B, C, A",
              ["A, C, B", "C, B, A"],
              "Shortest to longest: B, C, A!",
            ),
            barsOrder(
              "Order the lines from shortest to longest",
              [
                { label: "A", len: 120 },
                { label: "B", len: 220 },
                { label: "C", len: 170 },
              ],
              "A, C, B",
              ["B, C, A", "C, A, B"],
              "Shortest to longest: A, C, B!",
            ),
            barsOrder(
              "Order the lines from longest to shortest",
              [
                { label: "A", len: 150 },
                { label: "B", len: 240 },
                { label: "C", len: 100 },
              ],
              "B, A, C",
              ["C, A, B", "A, B, C"],
              "Longest to shortest: B, A, C!",
            ),
          ),
        ],
      },
    ],
  },
  {
    slug: "coin-counter",
    name: "Coin Counter",
    skills: ["Name coins", "Count cents", "Coin values", "Total money"],
    lessons: [
      {
        title: "Know your coins",
        objective: "Recognise coins and their values in cents",
        activities: [
          vary(
            coinPick("Tap the coin that is worth 5 cents", 5, [1, 10], "The 5¢ coin — that’s a nickel!"),
            coinPick("Tap the coin that is worth 10 cents", 10, [1, 5], "The 10¢ coin — that’s a dime!"),
            coinPick("Tap the coin that is worth 1 cent", 1, [5, 10], "The 1¢ coin — that’s a penny!"),
          ),
          vary(
            coinPick("Which coin is worth more?", 10, [5], "A dime (10¢) is worth more than a nickel (5¢)!"),
            coinPick("Which coin is worth more?", 5, [1], "A nickel (5¢) is worth more than a penny (1¢)!"),
            coinPick("Which coin is worth less?", 1, [10], "A penny (1¢) is worth less than a dime (10¢)!"),
          ),
          vary(
            numPick("If you have 3 pennies, how many cents do you have?", 3, [1, 5], "3 pennies = 3 cents!"),
            numPick("If you have 4 pennies, how many cents do you have?", 4, [2, 5], "4 pennies = 4 cents!"),
            numPick("If you have 5 pennies, how many cents do you have?", 5, [3, 4], "5 pennies = 5 cents!"),
          ),
        ],
      },
      {
        title: "Count the cents",
        objective: "Add up a handful of coins to find the total",
        activities: [
          vary(
            coinTotal([5, 5, 1], [10, 11, 12], "Add them up: 5 + 5 + 1 = 11 cents!"),
            coinTotal([5, 1, 1], [6, 7, 8], "Add them up: 5 + 1 + 1 = 7 cents!"),
            coinTotal([10, 5, 1], [15, 16, 17], "Add them up: 10 + 5 + 1 = 16 cents!"),
          ),
          vary(
            coinTotal([10, 10, 5], [20, 25, 30], "10 + 10 + 5 = 25 cents!"),
            coinTotal([10, 5, 5], [15, 20, 25], "10 + 5 + 5 = 20 cents!"),
            coinTotal([10, 10, 1], [20, 21, 22], "10 + 10 + 1 = 21 cents!"),
          ),
        ],
      },
    ],
  },
]);

const maths: SubjectContent = {
  subject: {
    id: subjectId,
    name: "Maths World",
    order: 1,
    accent: "#6C3AD6",
    bg: "linear-gradient(180deg,#EDE7FB 0%,#F8F4FE 60%)",
    chip: "#EEE7FB",
    verbs: "Count · compare · arrange · calculate · solve",
    dragonLine: "Can you help me count these stars?",
    ranks: ["Number Rookie", "Counting Star", "Number Ninja", "Maths Wizard", "Maths Prodigy"],
    art: {
      plaque: uni("ui/world_plaque_maths.webp"),
      badge: uni("rewards/subject_badge_maths.webp"),
      card: uni("worlds/maths_world_card.webp"),
    },
  },
  badges,
  lessons,
};

export default maths;
