// Grade 1 Math — K5Learning-inspired interactive question generators
// Topics: Number Charts, Patterns, Comparing, Base10, Place Value, Addition,
//         Subtraction, Fractions, Measurement, Money (Indian ₹), Time, Geometry,
//         Data & Graphing, Word Problems

export interface Question {
  prompt: string;
  visual?: string;           // text/tally/number-line
  imageUrl?: string;         // single reference image
  countImageUrl?: string;    // image repeated `countNumber` times
  countNumber?: number;
  countGroups?: { imageUrl: string; count: number; label?: string }[];
  analogClock?: { hour: number; minute: number }; // draws SVG analog clock
  fractionSvg?: { parts: number; shaded: number; shape: 'circle' | 'rect' }; // draws fraction
  base10?: { hundreds: number; tens: number; ones: number }; // draws base-10 blocks
  choices: string[];
  correctIndex?: number;
  correctAnswer?: string | number; // For input and order questions
  type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' | 'input' | 'order';
  interactiveStyle?: 'balloons' | 'compare-cards'; // New distinct animation styles
  speechText?: string;
  funFact?: string;  // shown after correct answer
}

export interface Section { title: string; questions: Question[]; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n); }
function wrongNums(correct: number, count: number, min = 0, max = 50): number[] {
  const s = new Set<number>([correct]);
  let t = 0;
  while (s.size < count + 1 && t++ < 500) {
    const v = randInt(min, max);
    if (v !== correct) s.add(v);
  }
  return shuffle([...s]);
}

// Image paths served from /public/images/
export const IMG = {
  apple: '/images/apple.png',
  balloon: '/images/balloon.png',
  star: '/images/star.png',
  fish: '/images/fish.png',
  cake: '/images/cake.png',
  coins: '/images/indian_coins.png',
  notes: '/images/indian_notes.png',
  shapes: '/images/math_shapes.png',
  base10: '/images/base10.png',
  fractions: '/images/fractions.png',
};
const countPool = [IMG.apple, IMG.balloon, IMG.star, IMG.fish, IMG.cake];
function randImg() { return countPool[randInt(0, countPool.length - 1)]; }
function imgName(url: string) {
  if (url.includes('apple')) return 'apples';
  if (url.includes('balloon')) return 'balloons';
  if (url.includes('star')) return 'stars';
  if (url.includes('fish')) return 'fish';
  return 'cakes';
}

const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const kidNames = ['Arjun', 'Priya', 'Ravi', 'Meera', 'Kabir', 'Ananya', 'Rohit', 'Sneha'];

// ============ 1 · NUMBER CHARTS & COUNTING ===================================
function generateNumberCharts(): Section[] {
  // 1a: Count objects 1-10
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(1, 10);
    const img = randImg();
    const opts = wrongNums(n, 2, 1, 10).map(String);
    return {
      prompt: `Count and choose the right number!`,
      countImageUrl: img,
      countNumber: n,
      choices: opts,
      correctIndex: opts.indexOf(String(n)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count all the ${imgName(img)}. How many are there? Choose ${opts.join(', or ')}.`,
      funFact: `Great counting! ${n} is the answer!`,
    };
  });

  // 1b: Count objects 10-20
  const s2: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(10, 20);
    const img = randImg();
    const opts = wrongNums(n, 2, 10, 20).map(String);
    return {
      prompt: `Count carefully — there are more than 10!`,
      countImageUrl: img,
      countNumber: n,
      choices: opts,
      correctIndex: opts.indexOf(String(n)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count all the ${imgName(img)}. Remember to count past 10!`,
      funFact: `Amazing! You counted to ${n}!`,
    };
  });

  // 1c: Skip counting by 2s
  const s3: Question[] = Array.from({ length: 6 }, () => {
    const start = randInt(0, 4) * 2;
    const seq = [start, start + 2, start + 4, start + 6, start + 8];
    const mi = randInt(1, 3);
    const ans = seq[mi];
    seq[mi] = -1;
    const display = `SEQUENCE:` + seq.map(n => n === -1 ? '__' : String(n)).join(',');
    const opts = wrongNums(ans, 2, 0, 20).map(String);
    return {
      prompt: `Count by 2s — fill in the missing number! 🐰`,
      visual: display,
      choices: opts,
      correctIndex: opts.indexOf(String(ans)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `We are counting by twos. What number is missing from the pattern?`,
    };
  });

  // 1d: Skip counting by 5s
  const s4: Question[] = Array.from({ length: 6 }, () => {
    const start = randInt(0, 4) * 5;
    const seq = [start, start + 5, start + 10, start + 15, start + 20];
    const mi = randInt(1, 3);
    const ans = seq[mi];
    seq[mi] = -1;
    const display = `SEQUENCE:` + seq.map(n => n === -1 ? '__' : String(n)).join(',');
    const opts = wrongNums(ans, 2, 0, 30).map(String);
    return {
      prompt: `Count by 5s!`,
      visual: display,
      choices: opts,
      correctIndex: opts.indexOf(String(ans)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `We are counting by fives. What number is missing?`,
    };
  });

  // 1e: Before and After (Input)
  const s5: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(5, 98);
    const askBefore = Math.random() > 0.5;
    const ans = askBefore ? n - 1 : n + 1;

    return {
      prompt: `Type the number that comes ${askBefore ? 'BEFORE' : 'AFTER'} ${n}`,
      visual: askBefore ? `SEQUENCE:__,${n},${n + 1}` : `SEQUENCE:${n - 1},${n},__`,
      choices: [],
      correctAnswer: ans,
      type: 'input',
      speechText: `What number comes ${askBefore ? 'before' : 'after'} ${n}? Type your answer.`,
      funFact: `Awesome! ${ans} is correct!`,
    };
  });

  // 1f: 100-Chart Missing Number (Input)
  const s6: Question[] = Array.from({ length: 6 }, () => {
    const rowStart = randInt(0, 7) * 10 + 1; // e.g. 21, 31, 41
    const colStart = randInt(0, 6); // 0 to 6 offset
    const start = rowStart + colStart;

    // We create a 3x3 grid snippet from the 100 chart
    // Rows are +10, Cols are +1
    const grid = [
      [start, start + 1, start + 2],
      [start + 10, start + 11, start + 12],
      [start + 20, start + 21, start + 22]
    ];

    // Pick a random cell to hide
    const hideR = randInt(0, 2);
    const hideC = randInt(0, 2);
    const ans = grid[hideR][hideC];

    // Build the visual representation
    const visualItems = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        visualItems.push((r === hideR && c === hideC) ? '__' : String(grid[r][c]));
      }
    }

    return {
      prompt: `Fill in the missing number from the 100-chart!`,
      visual: `GRID:` + visualItems.join(','),
      choices: [],
      correctAnswer: ans,
      type: 'input',
      speechText: `Look at this piece of the 100 chart. What number is missing?`,
      funFact: `Spot on! ${ans} fits perfectly!`,
    };
  });

  // 1g: Missing number in sequence 1-100 (Input)
  const s7: Question[] = Array.from({ length: 6 }, () => {
    const start = randInt(10, 80);
    const seq = [start, start + 1, start + 2, start + 3];
    const hideIdx = randInt(0, 3);
    const ans = seq[hideIdx];
    seq[hideIdx] = -1;
    const visual = `SEQUENCE:` + seq.map(n => n === -1 ? '__' : String(n)).join(',');
    return {
      prompt: `Type the missing number in the sequence!`,
      visual,
      choices: [],
      correctAnswer: ans,
      type: 'input',
      speechText: `What number is missing from this sequence? Type your answer.`,
      funFact: `Great job! ${ans} comes right after ${ans - 1}!`,
    };
  });

  // 1h: Skip counting by 10s (Input)
  const s8: Question[] = Array.from({ length: 6 }, () => {
    const start = randInt(1, 5) * 10;
    const seq = [start, start + 10, start + 20, start + 30];
    const hideIdx = randInt(0, 3);
    const ans = seq[hideIdx];
    seq[hideIdx] = -1;
    const visual = `SEQUENCE:` + seq.map(n => n === -1 ? '__' : String(n)).join(',');
    return {
      prompt: `Skip count by 10s! Fill the blank.`,
      visual,
      choices: [],
      correctAnswer: ans,
      type: 'input',
      speechText: `We are counting by tens. What number is missing?`,
      funFact: `Counting by 10s is fast! ${ans} is correct!`,
    };
  });

  // 1i: Counting Backwards (Input)
  const s9: Question[] = Array.from({ length: 6 }, () => {
    const start = randInt(10, 30);
    const seq = [start, start - 1, start - 2, start - 3];
    const hideIdx = randInt(1, 3);
    const ans = seq[hideIdx];
    seq[hideIdx] = -1;
    const visual = `SEQUENCE:` + seq.map(n => n === -1 ? '__' : String(n)).join(',');
    return {
      prompt: `We are counting BACKWARDS! Type the missing number.`,
      visual,
      choices: [],
      correctAnswer: ans,
      type: 'input',
      speechText: `Count backwards. What number is missing?`,
      funFact: `Awesome! You can count backwards down to ${ans}!`,
    };
  });

  // 1j: Is it Even or Odd? (Choice)
  const s10: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(1, 20); // lowered to 20 for reasonable grid display
    const isEven = n % 2 === 0;
    const ans = isEven ? 'Even' : 'Odd';
    const opts = ['Even', 'Odd'];
    const img = randImg();
    return {
      prompt: `Look at the number ${n}. Is it EVEN or ODD?`,
      countImageUrl: img,
      countNumber: n,
      choices: opts,
      correctIndex: opts.indexOf(ans),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Is the number ${n} even or odd? Pairs are even, leftovers are odd!`,
      funFact: isEven ? `${n} is even! Every item gets a pair!` : `${n} is odd! One is left out!`,
    };
  });

  // 1k: Ordinal Numbers (Input)
  const s11: Question[] = Array.from({ length: 6 }, () => {
    const pos = randInt(1, 5); // 1st to 5th
    const suffixes = ['st', 'nd', 'rd', 'th', 'th'];
    const ordinal = `${pos}${suffixes[pos - 1]}`;

    const images = pick(countPool, 5);
    const targetImg = images[pos - 1];
    let targetName = imgName(targetImg);
    if (targetName.endsWith('s')) targetName = targetName.slice(0, -1); // make singular

    return {
      prompt: `The ${targetName} is in which place? Type a number (1, 2, 3...)`,
      countGroups: images.map(url => ({
        imageUrl: url,
        count: 1,
        label: ' '
      })),
      choices: [],
      correctAnswer: pos,
      type: 'input',
      speechText: `Look at the row from left to right. What place is the ${targetName} in? Type the number.`,
      funFact: `Correct! The ${targetName} is ${ordinal} in line!`,
    };
  });

  return [
    { title: 'Count Objects (1-10)', questions: s1 },
    { title: 'Count Objects (10-20)', questions: s2 },
    { title: 'Skip Count by 2s', questions: s3 },
    { title: 'Skip Count by 5s', questions: s4 },
    { title: 'Before & After', questions: s5 },
    { title: 'Missing from 100-Chart', questions: s6 },
    { title: 'Counting Sequence', questions: s7 },
    { title: 'Skip Count 10s', questions: s8 },
    { title: 'Counting Backwards', questions: s9 },
    { title: 'Even or Odd?', questions: s10 },
    { title: 'Ordinal Places', questions: s11 },
  ];
}

// ============ 2 · COMPARING NUMBERS =========================================
function generateComparing(): Section[] {
  // 2a: Visual Groups (<, >, =)
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 9), b = randInt(1, 9);
    const adjusted = a === b ? (b < 9 ? b + 1 : b - 1) : b;
    const img = randImg();
    const sym = a > adjusted ? '>' : a < adjusted ? '<' : '=';
    const opts = shuffle(['>', '<', '=']);
    return {
      prompt: `Count the groups. Which sign goes in the middle?`,
      countGroups: [
        { imageUrl: img, count: a, label: ' ' },
        { imageUrl: img, count: adjusted, label: ' ' },
      ],
      choices: opts,
      correctIndex: opts.indexOf(sym),
      type: 'choice',
      interactiveStyle: 'compare-cards',
      speechText: `Which sign makes this true, greater than, less than, or equal to?`,
    };
  });

  // 2b: Greater / Less / Equal (Numbers)
  const s2: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 25), b = randInt(1, 25);
    const adjusted = a === b ? (b < 25 ? b + 1 : b - 1) : b;
    const sym = a > adjusted ? '>' : a < adjusted ? '<' : '=';
    const opts = shuffle(['>', '<', '=']);
    return {
      prompt: `Put the correct sign between the numbers:`,
      visual: `   ${a}   ___   ${adjusted}   `,
      choices: opts,
      correctIndex: opts.indexOf(sym),
      type: 'choice',
      interactiveStyle: 'compare-cards',
      speechText: `Is ${a} greater than, less than, or equal to ${adjusted}?`,
    };
  });

  // 2c: Greatest / Least
  const s3: Question[] = Array.from({ length: 6 }, () => {
    const isGreatest = Math.random() > 0.5;
    const nums = pick(Array.from({ length: 60 }, (_, i) => i + 1), 4); // Pick 4 random nums from 1 to 40
    const sorted = [...nums].sort((a, b) => a - b);
    const target = isGreatest ? sorted[3] : sorted[0];
    const opts = nums.map(String);

    return {
      prompt: `Which number is the ${isGreatest ? 'GREATEST' : 'LEAST'}?`,
      visual: `${nums.join('   ')}`,
      choices: opts,
      correctIndex: opts.indexOf(String(target)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Which of these numbers is the ${isGreatest ? 'greatest' : 'least'}?`,
    };
  });

  // 2d: Ordering numbers smallest to largest (Interactive Tap-to-Order)
  const s4: Question[] = Array.from({ length: 6 }, () => {
    const nums = shuffle([randInt(1, 10), randInt(11, 25), randInt(26, 40)]);
    const sorted = [...nums].sort((a, b) => a - b);

    return {
      prompt: `Put these numbers in order from SMALLEST to BIGGEST:`,
      choices: nums.map(String),
      correctAnswer: sorted.join(','), // comma-separated for validation
      type: 'order',
      speechText: `Tap the numbers to put them in order from smallest to biggest: ${nums.join(', ')}.`,
      funFact: `Perfectly sorted! ${sorted.join(' is less than ')}!`,
    };
  });

  return [
    { title: 'Comparing Groups', questions: s1 },
    { title: 'Greater, Less or Equal?', questions: s2 },
    { title: 'Greatest or Least?', questions: s3 },
    { title: 'Order the Numbers', questions: s4 },
  ];
}

// ============ 3 · PLACE VALUE & BASE 10 =====================================
function generatePlaceValue(): Section[] {
  // 3a: Tens and ones with base-10 visuals
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const tens = randInt(1, 4), ones = randInt(0, 9);
    const n = tens * 10 + ones;
    const correct = `${tens} tens, ${ones} ones`;
    const opts = shuffle([correct, `${tens + 1} tens, ${ones} ones`, `${tens} tens, ${ones + 1 > 9 ? 0 : ones + 1} ones`]);
    return {
      prompt: `Look at the blocks. How many tens and ones? 🔢`,
      base10: { hundreds: 0, tens, ones },
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count the ten-blocks and one-blocks. How many tens and ones make the number ${n}?`,
    };
  });

  // 3b: Tens and ones → number
  const s2: Question[] = Array.from({ length: 6 }, () => {
    const tens = randInt(1, 5), ones = randInt(0, 9);
    const n = tens * 10 + ones;
    const opts = wrongNums(n, 2, 10, 59).map(String);
    return {
      prompt: `${tens} tens and ${ones} ones = which number? 🤔`,
      base10: { hundreds: 0, tens, ones },
      choices: opts,
      correctIndex: opts.indexOf(String(n)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `${tens} tens means ${tens * 10}. Plus ${ones} ones. What is the number?`,
    };
  });

  // 3c: Identify digit value
  const s3: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(11, 59);
    const tensDigit = Math.floor(n / 10);
    const onesDigit = n % 10;
    const isAskingTens = Math.random() > 0.5;
    const correct = String(isAskingTens ? tensDigit : onesDigit);
    const opts = wrongNums(Number(correct), 2, 0, 9).map(String);
    return {
      prompt: isAskingTens
        ? `In the number ${n}, what digit is in the TENS place? 🔍`
        : `In the number ${n}, what digit is in the ONES place? 🔍`,
      visual: `  ${n}  \n↑ Tens ↑ Ones`,
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: isAskingTens
        ? `In the number ${n}, what digit is in the tens place?`
        : `In the number ${n}, what digit is in the ones place?`,
    };
  });

  // 3d: Number → words (teens)
  const s4: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(10, 20);
    const word = numberWords[n];
    const wrong = pick(numberWords.filter(w => w !== word).slice(10, 21), 2);
    const opts = shuffle([word, ...wrong]);
    return {
      prompt: `How do we say the number ${n} in words? 🗣️`,
      visual: `  ${n}  `,
      choices: opts,
      correctIndex: opts.indexOf(word),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What is the word for ${n}?`,
    };
  });

  return [
    { title: '🟦 Tens and Ones (Blocks)', questions: s1 },
    { title: '🔢 Blocks → Number', questions: s2 },
    { title: '🔍 Digit in Tens/Ones Place', questions: s3 },
    { title: '🗣️ Numbers in Words', questions: s4 },
  ];
}

// ============ 4 · ADDITION ==================================================
function generateAddition(): Section[] {
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 5), b = randInt(1, 5);
    const img = randImg();
    const opts = wrongNums(a + b, 2, 2, 10).map(String);
    return {
      prompt: `Count both groups and add! ➕`,
      countGroups: [
        { imageUrl: img, count: a, label: `${a}` },
        { imageUrl: img, count: b, label: `${b}` },
      ],
      visual: `${a} + ${b} = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(a + b)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `${a} ${imgName(img)} plus ${b} ${imgName(img)} equals how many?`,
      funFact: `${a} + ${b} = ${a + b}! You are a math star! ⭐`,
    };
  });

  const s2: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 9), b = randInt(1, 9);
    const opts = wrongNums(a + b, 2, 2, 18).map(String);
    return {
      prompt: `${a} + ${b} = ? Choose the right answer! 🎯`,
      choices: opts,
      correctIndex: opts.indexOf(String(a + b)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What is ${a} plus ${b}?`,
    };
  });

  const s3: Question[] = Array.from({ length: 6 }, () => {
    const sum = randInt(4, 10);
    const a = randInt(1, sum - 1), b = sum - a;
    const missingA = Math.random() > 0.5;
    const opts = wrongNums(missingA ? a : b, 2, 1, 9).map(String);
    return {
      prompt: missingA
        ? `❓ + ${b} = ${sum}    What is the missing number?`
        : `${a} + ❓ = ${sum}    What is the missing number?`,
      choices: opts,
      correctIndex: opts.indexOf(String(missingA ? a : b)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: missingA
        ? `Something plus ${b} equals ${sum}. What is the missing number?`
        : `${a} plus something equals ${sum}. What is the missing number?`,
    };
  });

  const s4: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 5), b = randInt(1, 5);
    const name = pick(kidNames, 1)[0];
    const img = randImg();
    const thing = imgName(img);
    const opts = wrongNums(a + b, 2, 2, 10).map(String);
    return {
      prompt: `📖 ${name} had ${a} ${thing}. Got ${b} more. How many now?`,
      countGroups: [{ imageUrl: img, count: a }, { imageUrl: img, count: b }],
      visual: `${a} + ${b} = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(a + b)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `${name} had ${a} ${thing} and got ${b} more. How many ${thing} does ${name} have now?`,
    };
  });

  return [
    { title: '🖼️ Add the Pictures', questions: s1 },
    { title: '➕ Addition Facts (Fast!)', questions: s2 },
    { title: '❓ Find the Missing Number', questions: s3 },
    { title: '📖 Addition Word Problems', questions: s4 },
  ];
}

// ============ 5 · SUBTRACTION ===============================================
function generateSubtraction(): Section[] {
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const total = randInt(4, 9), cross = randInt(1, total - 1);
    const remain = total - cross;
    const img = randImg();
    const opts = wrongNums(remain, 2, 0, 9).map(String);
    return {
      prompt: `${total} ${imgName(img)} → ${cross} are taken away ❌. How many left? 🤔`,
      countGroups: [{ imageUrl: img, count: remain, label: `${remain} left` }],
      visual: `${total} − ${cross} = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(remain)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `There are ${total} ${imgName(img)}. ${cross} are taken away. How many are left?`,
      funFact: `${total} − ${cross} = ${remain}! You're great! 🎊`,
    };
  });

  const s2: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(3, 12), b = randInt(1, a - 1);
    const opts = wrongNums(a - b, 2, 0, 12).map(String);
    return {
      prompt: `${a} − ${b} = ? ➖`,
      choices: opts,
      correctIndex: opts.indexOf(String(a - b)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What is ${a} minus ${b}? Count back on your fingers!`,
    };
  });

  const s3: Question[] = Array.from({ length: 6 }, () => {
    const diff = randInt(4, 10);
    const b = randInt(1, diff - 1);
    const a = diff + b;
    const missingA = Math.random() > 0.5;
    const opts = wrongNums(missingA ? a : b, 2, 1, 12).map(String);
    return {
      prompt: missingA
        ? `❓ − ${b} = ${diff}    Find the missing number!`
        : `${a} − ❓ = ${diff}    Find the missing number!`,
      choices: opts,
      correctIndex: opts.indexOf(String(missingA ? a : b)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: missingA
        ? `Something minus ${b} equals ${diff}. What number is missing?`
        : `${a} minus something equals ${diff}. What is it?`,
    };
  });

  const s4: Question[] = Array.from({ length: 6 }, () => {
    const total = randInt(4, 10), away = randInt(1, total - 1);
    const name = pick(kidNames, 1)[0];
    const img = randImg();
    const thing = imgName(img);
    const opts = wrongNums(total - away, 2, 0, 10).map(String);
    return {
      prompt: `📖 ${name} had ${total} ${thing}. Gave away ${away}. How many left?`,
      visual: `${total} − ${away} = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(total - away)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `${name} had ${total} ${thing} and gave away ${away}. How many are left?`,
    };
  });

  return [
    { title: '🖼️ Take Away Pictures', questions: s1 },
    { title: '➖ Subtraction Facts (Fast!)', questions: s2 },
    { title: '❓ Find the Missing Number', questions: s3 },
    { title: '📖 Subtraction Stories', questions: s4 },
  ];
}

// ============ 6 · FRACTIONS =================================================
function generateFractions(): Section[] {
  const shapeFracs = [
    { parts: 2, shaded: 1, shape: 'circle' as const, word: 'one half (½)' },
    { parts: 4, shaded: 1, shape: 'rect' as const, word: 'one quarter (¼)' },
    { parts: 3, shaded: 1, shape: 'circle' as const, word: 'one third (⅓)' },
    { parts: 4, shaded: 2, shape: 'rect' as const, word: 'two quarters (½)' },
    { parts: 2, shaded: 1, shape: 'rect' as const, word: 'one half (½)' },
  ];

  const s1: Question[] = pick(shapeFracs, 4).map(f => {
    const words = ['one half (½)', 'one quarter (¼)', 'one third (⅓)', 'two quarters (½)'];
    const opts = shuffle([f.word, ...pick(words.filter(w => w !== f.word), 2)]);
    return {
      prompt: `What fraction of the shape is coloured? 🎨`,
      fractionSvg: f,
      choices: opts,
      correctIndex: opts.indexOf(f.word),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Look at the shape. What fraction is the coloured part? Is it ${opts.join(', or ')}?`,
      funFact: `Fractions show parts of a whole! ${f.word} means ${f.shaded} part out of ${f.parts}!`,
    };
  });

  const s2: Question[] = [
    { q: 'A pizza is cut into 2 equal pieces. You eat 1 piece. You ate ___ of the pizza.', a: '½ (one half)', w: ['¼ (one quarter)', '⅓ (one third)'] },
    { q: 'A chocolate bar has 4 equal pieces. Priya takes 1. She has ___ of the bar.', a: '¼ (one quarter)', w: ['½ (one half)', '⅓ (one third)'] },
    { q: 'An orange is cut into 3 equal parts. Arjun eats 1 part. He ate ___ of the orange.', a: '⅓ (one third)', w: ['½ (one half)', '¼ (one quarter)'] },
    { q: 'A cake is cut in half. There are ___ equal pieces.', a: '2', w: ['3', '4'] },
  ].map(item => {
    const opts = shuffle([item.a, ...item.w]);
    return {
      prompt: item.q,
      imageUrl: IMG.fractions,
      choices: opts,
      correctIndex: opts.indexOf(item.a),
      type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
      speechText: item.q,
    };
  });

  const s3: Question[] = [
    { whole: 4, shaded: 2, shape: 'rect' as const },
    { whole: 4, shaded: 1, shape: 'circle' as const },
    { whole: 2, shaded: 1, shape: 'circle' as const },
    { whole: 3, shaded: 1, shape: 'rect' as const },
  ].map(f => {
    const correct = `${f.shaded}/${f.whole}`;
    const opts = shuffle([correct,
      `${f.shaded + 1}/${f.whole}`,
      `${f.shaded}/${f.whole + 1}`,
    ].filter((v, i, a) => a.indexOf(v) === i));
    return {
      prompt: `How many parts are shaded? Write the fraction! ✍️`,
      fractionSvg: { parts: f.whole, shaded: f.shaded, shape: f.shape },
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
      speechText: `${f.shaded} out of ${f.whole} parts are shaded. What fraction is that?`,
    };
  });

  return [
    { title: '🍕 Name the Fraction', questions: s1 },
    { title: '📖 Fraction Word Problems', questions: s2 },
    { title: '✍️ Write the Fraction', questions: s3 },
  ];
}

// ============ 7 · TELLING TIME ==============================================
// SVG analog clock is drawn by WorksheetSection using analogClock field

function generateTime(): Section[] {
  // 7a: O'clock — read the clock
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const hour = randInt(1, 12);
    const correct = `${hour}:00`;
    const w1 = `${(hour % 12) + 1}:00`;
    const w2 = `${((hour + 4) % 12) + 1}:00`;
    const opts = shuffle([correct, w1, w2]);
    return {
      prompt: `⏰ What time does this clock show?`,
      analogClock: { hour, minute: 0 },
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Look at the clock. The hour hand points to ${hour}. The minute hand points to 12. What time is it?`,
      funFact: `The short hand tells the HOUR. The long hand says minutes! 🕐`,
    };
  });

  // 7b: Half past
  const s2: Question[] = Array.from({ length: 6 }, () => {
    const hour = randInt(1, 12);
    const correct = `${hour}:30`;
    const w1 = `${hour}:00`;
    const w2 = `${(hour % 12) + 1}:30`;
    const opts = shuffle([correct, w1, w2]);
    return {
      prompt: `⏰ This clock shows "half past". What time is it?`,
      analogClock: { hour, minute: 30 },
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `When the long hand points to 6, it is half past. The short hand is near ${hour}. What time?`,
      funFact: `Half past ${hour} = ${hour}:30! The minute hand points to 6! ⬇️`,
    };
  });

  // 7c: Morning or Night
  const activities = [
    { text: 'Eating breakfast 🍳', answer: 'Morning 🌅' },
    { text: 'Sleeping in bed 😴', answer: 'Night 🌙' },
    { text: 'Going to school 🏫', answer: 'Morning 🌅' },
    { text: 'Brushing teeth before sleep 🪥', answer: 'Night 🌙' },
    { text: 'Drinking morning milk 🥛', answer: 'Morning 🌅' },
    { text: 'Reading a bedtime story 📖', answer: 'Night 🌙' },
    { text: 'Playing in the sun ☀️', answer: 'Morning 🌅' },
    { text: 'Looking at the stars 🌟', answer: 'Night 🌙' },
  ];
  const s3: Question[] = pick(activities, 4).map(a => ({
    prompt: `Does this happen in the Morning or at Night? 🤔\n"${a.text}"`,
    choices: ['Morning 🌅', 'Night 🌙'],
    correctIndex: a.answer === 'Morning 🌅' ? 0 : 1,
    type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
    speechText: `${a.text}. Does this usually happen in the morning or at night?`,
  }));

  // 7d: Draw the time (choose correct clock)
  const s4: Question[] = Array.from({ length: 6 }, () => {
    const hour = randInt(1, 12);
    const min = pick([0, 30], 1)[0];
    const label = min === 0 ? `${hour}:00` : `${hour}:30`;
    const adj = (hour % 12) + 1;
    const opts = [
      { hour, minute: min },
      { hour: adj, minute: min },
      { hour, minute: min === 0 ? 30 : 0 },
    ];
    const shuffled = shuffle(opts);
    return {
      prompt: `Which clock shows ${label}? 🕐`,
      countGroups: shuffled.map((o, i) => ({
        imageUrl: '',   // sentinel — WorksheetSection renders analogClock in group
        count: 0,
        label: `Clock ${['A', 'B', 'C'][i]}`,
        _clockData: o,  // passed via countGroups hack (rendered specially)
      })) as any,
      choices: shuffled.map((_, i) => `Clock ${['A', 'B', 'C'][i]}`),
      correctIndex: shuffled.findIndex(o => o.hour === hour && o.minute === min),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Which clock shows ${label}?`,
    };
  });

  return [
    { title: '⏰ Tell the Time (O\'clock)', questions: s1 },
    { title: '🕧 Tell the Time (Half Past)', questions: s2 },
    { title: '☀️ Morning or Night?', questions: s3 },
    { title: '🎯 Choose the Right Clock', questions: s4 },
  ];
}

// ============ 8 · GEOMETRY ==================================================
const shapes = [
  { name: 'circle', sides: 0, color: '#2196F3', svgId: 'circle' },
  { name: 'triangle', sides: 3, color: '#E53935', svgId: 'triangle' },
  { name: 'square', sides: 4, color: '#43A047', svgId: 'square' },
  { name: 'rectangle', sides: 4, color: '#FB8C00', svgId: 'rectangle' },
  { name: 'pentagon', sides: 5, color: '#8E24AA', svgId: 'pentagon' },
  { name: 'hexagon', sides: 6, color: '#FFB300', svgId: 'hexagon' },
];

function generateGeometry(): Section[] {
  const s1: Question[] = pick(shapes, 4).map(s => {
    const opts = shuffle([s.name, ...pick(shapes.filter(x => x.name !== s.name), 2).map(x => x.name)]);
    return {
      prompt: `What is this shape called? 🔷`,
      visual: `SHAPE:${s.svgId}:${s.color}`,
      choices: opts,
      correctIndex: opts.indexOf(s.name),
      type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
      speechText: `Look at the shape. What is it called?`,
    };
  });

  const s2: Question[] = pick(shapes, 4).map(s => {
    const pool = ['0', '3', '4', '5', '6'].filter(x => x !== String(s.sides));
    const opts = shuffle([String(s.sides), ...pick(pool, 2)]);
    return {
      prompt: `Count the sides of this shape! 📏`,
      visual: `SHAPE:${s.svgId}:${s.color}`,
      choices: opts,
      correctIndex: opts.indexOf(String(s.sides)),
      type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
      speechText: `How many sides does a ${s.name} have?`,
    };
  });

  const solid3D = [
    { name: 'sphere (ball)', example: '⚽ 🌍 🪄', real: 'A ball', faces: 0 },
    { name: 'cube (box)', example: '🎲 📦 🧊', real: 'A dice', faces: 6 },
    { name: 'cylinder', example: '🥫 🎩 🪣', real: 'A tin can', faces: 2 },
    { name: 'cone', example: '🍦 🎃 🔺', real: 'An ice cream cone', faces: 1 },
  ];
  const s3: Question[] = solid3D.map(s => {
    const opts = shuffle(solid3D.map(x => x.name));
    return {
      prompt: `${s.real} is an example of which 3D shape? 📦`,
      visual: s.example,
      choices: opts,
      correctIndex: opts.indexOf(s.name),
      type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
      speechText: `${s.real}. What 3D shape is this?`,
    };
  });

  const symmetry = [
    { q: 'A butterfly 🦋 has a line of symmetry. True or False?', a: 'True ✅' },
    { q: 'The letter "A" has a line of symmetry. True or False?', a: 'True ✅' },
    { q: 'A circle has ZERO lines of symmetry. True or False?', a: 'False ❌' },
    { q: 'A square has 4 lines of symmetry. True or False?', a: 'True ✅' },
  ];
  const s4: Question[] = symmetry.map(s => {
    const opts = ['True ✅', 'False ❌'];
    return {
      prompt: s.q,
      choices: opts,
      correctIndex: opts.indexOf(s.a),
      type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
      speechText: s.q,
    };
  });

  return [
    { title: '🔷 Name the 2D Shape', questions: s1 },
    { title: '📏 Count the Sides', questions: s2 },
    { title: '📦 3D Shapes Around Us', questions: s3 },
    { title: '🦋 Symmetry (True/False)', questions: s4 },
  ];
}

// ============ 9 · MEASUREMENT ===============================================
function generateMeasurement(): Section[] {
  const longerPairs = [
    ['snake 🐍', 'worm 🐛'],
    ['bus 🚌', 'bicycle 🚲'],
    ['ruler 📏', 'pencil ✏️'],
    ['giraffe 🦒', 'cat 🐱'],
  ];
  const s1: Question[] = longerPairs.map(([a, b]) => ({
    prompt: `Which is LONGER? 📏`,
    visual: `${a}\nor\n${b}`,
    choices: [a, b],
    correctIndex: 0,
    type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
    speechText: `Which is longer: a ${a} or a ${b}?`,
  }));

  const heavierPairs = [
    ['elephant 🐘', 'ant 🐜'],
    ['car 🚗', 'bicycle 🚲'],
    ['rock 🪨', 'feather 🪶'],
    ['books 📚', 'one paper 📄'],
  ];
  const s2: Question[] = heavierPairs.map(([a, b]) => ({
    prompt: `Which is HEAVIER? ⚖️`,
    visual: `${a}\nor\n${b}`,
    choices: [a, b],
    correctIndex: 0,
    type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
    speechText: `Which is heavier: ${a} or ${b}?`,
  }));

  const s3: Question[] = Array.from({ length: 6 }, () => {
    const units = randInt(2, 8);
    const boxes = '□'.repeat(units);
    const opts = wrongNums(units, 2, 1, 10).map(String);
    return {
      prompt: `How many units long? Count the boxes! 📦`,
      visual: `✏️ [${boxes}]\n  each □ = 1 unit`,
      choices: opts,
      correctIndex: opts.indexOf(String(units)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count the boxes. How many units long is the object?`,
    };
  });

  const s4: Question[] = [
    { a: 'full cup 🥛', b: 'half cup', more: 'full cup 🥛' },
    { a: 'big bottle 🍶', b: 'small cup 🥤', more: 'big bottle 🍶' },
    { a: 'bucket 🪣', b: 'spoon 🥄', more: 'bucket 🪣' },
    { a: 'bathtub 🛁', b: 'glass 🥤', more: 'bathtub 🛁' },
  ].map(item => ({
    prompt: `Which holds MORE water? 💧`,
    visual: `${item.a}   vs   ${item.b}`,
    choices: [item.a, item.b],
    correctIndex: 0 as const,
    type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
    speechText: `Which can hold more water: ${item.a} or ${item.b}?`,
  }));

  return [
    { title: '📏 Longer or Shorter?', questions: s1 },
    { title: '⚖️ Heavier or Lighter?', questions: s2 },
    { title: '📦 Measure with Units', questions: s3 },
    { title: '💧 More or Less Volume?', questions: s4 },
  ];
}

// ============ 10 · MONEY (Indian ₹) ========================================
const indianCoins = [
  { value: 1, name: '₹1 coin (one rupee)', label: '₹1' },
  { value: 2, name: '₹2 coin (two rupees)', label: '₹2' },
  { value: 5, name: '₹5 coin (five rupees)', label: '₹5' },
  { value: 10, name: '₹10 coin (ten rupees)', label: '₹10' },
  { value: 20, name: '₹20 coin (twenty rupees)', label: '₹20' },
];
const indianNotes = [
  { value: 10, name: '₹10 note', label: '₹10' },
  { value: 50, name: '₹50 note', label: '₹50' },
  { value: 100, name: '₹100 note', label: '₹100' },
];

function generateMoney(): Section[] {
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const coin = indianCoins[randInt(0, indianCoins.length - 1)];
    const opts = shuffle(indianCoins.map(c => c.name));
    return {
      prompt: `This coin says "${coin.label}". What coin is it? 🪙`,
      imageUrl: IMG.coins,
      choices: opts,
      correctIndex: opts.indexOf(coin.name),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `The coin is worth ${coin.value} rupees. What is it called?`,
    };
  });

  const s2: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(2, 3);
    const selected = Array.from({ length: n }, () => indianCoins[randInt(0, 3)]);
    const total = selected.reduce((s, c) => s + c.value, 0);
    const visual = selected.map(c => `[${c.label}]`).join(' + ') + ' = ₹?';
    const opts = wrongNums(total, 2, 1, 40).map(n => `₹${n}`);
    return {
      prompt: `Add these coins together! 💰`,
      visual,
      imageUrl: IMG.coins,
      choices: opts,
      correctIndex: opts.indexOf(`₹${total}`),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Add ${selected.map(c => c.value + ' rupees').join(' and ')}. How much in total?`,
      funFact: `${selected.map(c => c.label).join(' + ')} = ₹${total}! 🎉`,
    };
  });

  const s3: Question[] = Array.from({ length: 3 }, () => {
    const note = indianNotes[randInt(0, indianNotes.length - 1)];
    const opts = shuffle(indianNotes.map(n => n.name));
    return {
      prompt: `This note says "${note.label}". What is it? 📄`,
      imageUrl: IMG.notes,
      choices: opts,
      correctIndex: opts.indexOf(note.name),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `The note is worth ${note.value} rupees. What is it called?`,
    };
  });

  const shopItems = [
    { name: 'pencil ✏️', cost: 5 },
    { name: 'eraser 🧹', cost: 2 },
    { name: 'biscuit 🍪', cost: 10 },
    { name: 'notebook 📓', cost: 20 },
    { name: 'colour pencils 🖍️', cost: 50 },
  ];
  const s4: Question[] = Array.from({ length: 6 }, () => {
    const have = pick([1, 2, 5, 10, 20, 50], 1)[0];
    const item = shopItems[randInt(0, shopItems.length - 1)];
    const canBuy = have >= item.cost;
    return {
      prompt: `You have ₹${have}. A ${item.name} costs ₹${item.cost}. Can you buy it? 🛒`,
      visual: `My money: ₹${have}\nItem cost: ₹${item.cost}`,
      choices: ['Yes ✅', 'No ❌'],
      correctIndex: canBuy ? 0 : 1,
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `You have ${have} rupees. The item costs ${item.cost} rupees. Do you have enough to buy it?`,
    };
  });

  return [
    { title: '🪙 Identify Indian Coins', questions: s1 },
    { title: '➕ Add the Coins', questions: s2 },
    { title: '📄 Identify Rupee Notes', questions: s3 },
    { title: '🛒 Can I Buy It?', questions: s4 },
  ];
}

// ============ 11 · DATA & GRAPHING ==========================================
function toTally(n: number): string {
  const g = Math.floor(n / 5), r = n % 5;
  return [...Array(g).fill('IIII I'), ...(r > 0 ? [Array(r).fill('I').join('')] : [])]
    .join('  ') || '—';
}

function generateDataGraphing(): Section[] {
  const fruits = [
    { name: '🍎 Apples', img: IMG.apple },
    { name: '🎈 Balloons', img: IMG.balloon },
    { name: '⭐ Stars', img: IMG.star },
  ];
  const counts = fruits.map(() => randInt(1, 6));
  const maxIdx = counts.indexOf(Math.max(...counts));
  const minIdx = counts.indexOf(Math.min(...counts));
  const chart = fruits.map((f, i) =>
    `${f.name.padEnd(14)} | ${toTally(counts[i])} (${counts[i]})`
  ).join('\n');

  const s1: Question[] = [{
    prompt: `📊 Read the tally chart. Which group has the MOST?`,
    visual: chart,
    choices: fruits.map(f => f.name),
    correctIndex: maxIdx,
    type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Look at the tally chart. Count the marks. Which group has the most?`,
  }];

  const s2: Question[] = [{
    prompt: `📊 Read the tally chart. Which group has the FEWEST?`,
    visual: chart,
    choices: fruits.map(f => f.name),
    correctIndex: minIdx,
    type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Which group has the fewest marks in the tally chart?`,
  }];

  const s3: Question[] = Array.from({ length: 6 }, () => {
    const n = randInt(2, 6);
    const add = randInt(1, 3);
    const total = n + add;
    const opts = wrongNums(total, 2, 2, 12).map(String);
    return {
      prompt: `Tally shows ${n}. We add ${add} more tally marks. New total? ✏️`,
      visual: `${toTally(n)}  +  ${Array(add).fill('I').join('')}  =  ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(total)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `The tally has ${n} marks. We add ${add} more. What is the new total?`,
    };
  });

  const s4: Question[] = Array.from({ length: 6 }, () => {
    const img = randImg();
    const n = randInt(2, 8);
    const opts = wrongNums(n, 2, 1, 10).map(String);
    return {
      prompt: `Count only these pictures. How many? 🔢`,
      countImageUrl: img,
      countNumber: n,
      choices: opts,
      correctIndex: opts.indexOf(String(n)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count all the ${imgName(img)}. How many are there?`,
    };
  });

  return [
    { title: '📊 Chart — Which has Most?', questions: s1 },
    { title: '📊 Chart — Which has Fewest?', questions: s2 },
    { title: '✏️ Add to the Tally', questions: s3 },
    { title: '🖼️ Count from the Picture', questions: s4 },
  ];
}

// ============ 12 · WORD PROBLEMS ============================================
function generateWordProblems(): Section[] {
  const s1: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 5), b = randInt(1, 5);
    const name = pick(kidNames, 1)[0];
    const img = randImg();
    const thing = imgName(img);
    const opts = wrongNums(a + b, 2, 2, 10).map(String);
    return {
      prompt: `📖 ${name} had ${a} ${thing}. Mum gave ${b} more. How many ${thing} in all?`,
      countGroups: [{ imageUrl: img, count: a }, { imageUrl: img, count: b }],
      visual: `${a} + ${b} = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(a + b)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `${name} had ${a} ${thing} and got ${b} more. How many altogether?`,
    };
  });

  const s2: Question[] = Array.from({ length: 6 }, () => {
    const total = randInt(4, 10), away = randInt(1, total - 1);
    const name = pick(kidNames, 1)[0];
    const img = randImg();
    const thing = imgName(img);
    const opts = wrongNums(total - away, 2, 0, 10).map(String);
    return {
      prompt: `📖 ${name} had ${total} ${thing}. Gave ${away} to a friend. How many left?`,
      visual: `${total} − ${away} = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(total - away)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `${name} had ${total} ${thing} and gave away ${away}. How many are left?`,
    };
  });

  const ageProblems = [
    { q: 'Priya is 6 years old. Arjun is 2 years older. How old is Arjun?', a: 8 },
    { q: 'Ravi has 5 rupees. He spends 3 rupees. How many rupees are left?', a: 2 },
    { q: 'There are 9 birds. 4 fly away. How many birds are left?', a: 5 },
    { q: 'Meera bakes 3 cakes on Monday and 4 on Tuesday. How many cakes in total?', a: 7 },
  ];
  const s3: Question[] = ageProblems.map(p => {
    const opts = wrongNums(p.a, 2, 0, 12).map(String);
    return {
      prompt: `🤔 ${p.q}`,
      choices: opts,
      correctIndex: opts.indexOf(String(p.a)),
      type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
      speechText: p.q,
    };
  });

  const s4: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 9), b = randInt(1, 9);
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const opts = wrongNums(a + b, 2, 2, 18).map(String);
      return {
        prompt: `🎯 First there were ${a}. Then ${b} more came. How many now?`,
        choices: opts, correctIndex: opts.indexOf(String(a + b)), type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
        speechText: `First ${a}, then ${b} more arrive. How many in total?`,
      };
    } else {
      const total = a + b;
      const opts = wrongNums(b, 2, 1, 9).map(String);
      return {
        prompt: `🎯 There were ${total}. ${a} left. How many are still there?`,
        choices: opts, correctIndex: opts.indexOf(String(b)), type: 'choice',
      interactiveStyle: 'balloons',
      interactiveStyle: 'balloons' as const,
        speechText: `There were ${total} and ${a} left. How many remain?`,
      };
    }
  });

  return [
    { title: '📖 Addition Stories', questions: s1 },
    { title: '📖 Subtraction Stories', questions: s2 },
    { title: '🤔 Mixed Word Problems', questions: s3 },
    { title: '🎯 Think and Solve', questions: s4 },
  ];
}

// ============ TOPIC MAP =====================================================
export const topics = [
  { id: 1, name: 'Number Charts & Counting', emoji: '🔢', generate: generateNumberCharts },
  { id: 2, name: 'Comparing Numbers', emoji: '⚖️', generate: generateComparing },
  { id: 3, name: 'Place Value & Base 10', emoji: '🔟', generate: generatePlaceValue },
  { id: 4, name: 'Addition', emoji: '➕', generate: generateAddition },
  { id: 5, name: 'Subtraction', emoji: '➖', generate: generateSubtraction },
  { id: 6, name: 'Fractions', emoji: '½', generate: generateFractions },
  { id: 7, name: 'Telling Time', emoji: '⏰', generate: generateTime },
  { id: 8, name: 'Geometry (Shapes)', emoji: '🔷', generate: generateGeometry },
  { id: 9, name: 'Measurement', emoji: '📏', generate: generateMeasurement },
  { id: 10, name: 'Money (₹ Rupees)', emoji: '₹', generate: generateMoney },
  { id: 11, name: 'Data & Graphing', emoji: '📊', generate: generateDataGraphing },
  { id: 12, name: 'Word Problems', emoji: '📖', generate: generateWordProblems },
];
