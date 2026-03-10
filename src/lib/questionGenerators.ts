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
  choices?: string[];
  correctIndex?: number;
  correctAnswer?: string | number; // For input and order questions
  type?: 'choice' | 'input' | 'order' | 'match';
  interactiveStyle?: 'balloons' | 'compare-cards'; // New distinct animation styles
  matchPairs?: { left: string; right: string }[]; // For connecting left to right
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
  // Individual Rupees
  c1: '/images/rupee_c1.png',
  c2: '/images/rupee_c2.png',
  c5: '/images/rupee_c5.png',
  c10: '/images/rupee_c10.png',
  c20: '/images/rupee_c20.png',
  n10: '/images/rupee_n10.png',
  n20: '/images/rupee_n20.png',
  n50: '/images/rupee_n50.png',
  n100: '/images/rupee_n100.png',
  n200: '/images/rupee_n200.png',
  n500: '/images/rupee_n500.png',
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
  // 1: Visual Groups (<, >, =)
  const s1: Question[] = Array.from({ length: 5 }, () => {
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

  // 2: Greater / Less / Equal (Numbers)
  const s2: Question[] = Array.from({ length: 5 }, () => {
    const a = randInt(1, 25), b = randInt(1, 25);
    const adjusted = Math.random() > 0.8 ? a : (a === b ? (b < 25 ? b + 1 : b - 1) : b);
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

  // 3: Greatest or Least
  const s3: Question[] = Array.from({ length: 5 }, () => {
    const isGreatest = Math.random() > 0.5;
    const nums = pick(Array.from({ length: 60 }, (_, i) => i + 1), 4);
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

  // 4: Order the Numbers Smallest to Biggest
  const s4: Question[] = Array.from({ length: 5 }, () => {
    const nums = shuffle([randInt(1, 15), randInt(16, 30), randInt(31, 50)]);
    const sorted = [...nums].sort((a, b) => a - b);

    return {
      prompt: `Put these numbers in order from SMALLEST to BIGGEST:`,
      choices: nums.map(String),
      correctAnswer: sorted.join(','),
      type: 'order',
      speechText: `Tap the numbers to put them in order from smallest to biggest: ${nums.join(', ')}.`,
      funFact: `Perfectly sorted! ${sorted.join(' is less than ')}!`,
    };
  });

  // 5: Order the Numbers Biggest to Smallest
  const s5: Question[] = Array.from({ length: 5 }, () => {
    const nums = shuffle([randInt(1, 15), randInt(16, 30), randInt(31, 50)]);
    const sorted = [...nums].sort((a, b) => b - a); // descending

    return {
      prompt: `Put these numbers in order from BIGGEST to SMALLEST:`,
      choices: nums.map(String),
      correctAnswer: sorted.join(','),
      type: 'order',
      speechText: `Tap the numbers to put them in order from biggest to smallest.`,
      funFact: `Awesome! You sorted them from largest to smallest!`,
    };
  });

  // 6: Choose the number GREATER than X
  const s6: Question[] = Array.from({ length: 5 }, () => {
    const target = randInt(10, 50);
    const correct = randInt(target + 1, 99);
    const wrong1 = randInt(1, target);
    const wrong2 = randInt(1, target);
    const opts = shuffle([String(correct), String(wrong1), String(wrong2)]);
    return {
      prompt: `Which number is GREATER than ${target}? 🎈`,
      choices: opts,
      correctIndex: opts.indexOf(String(correct)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Which of these numbers is bigger than ${target}?`,
      funFact: `Yes! ${correct} is greater than ${target}!`,
    };
  });

  // 7: Choose the number LESS than X
  const s7: Question[] = Array.from({ length: 5 }, () => {
    const target = randInt(20, 99);
    const correct = randInt(1, target - 1);
    const wrong1 = randInt(target, 120);
    const wrong2 = randInt(target, 120);
    const opts = shuffle([String(correct), String(wrong1), String(wrong2)]);
    return {
      prompt: `Which number is LESS than ${target}? 🎈`,
      choices: opts,
      correctIndex: opts.indexOf(String(correct)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Which of these numbers is smaller than ${target}?`,
      funFact: `Correct! ${correct} is less than ${target}!`,
    };
  });

  // 8: True or False
  const s8: Question[] = Array.from({ length: 5 }, () => {
    const a = randInt(1, 40), b = randInt(1, 40);
    const isTrue = Math.random() > 0.5;
    let sign = '';
    if (isTrue) {
      sign = a > b ? '>' : (a < b ? '<' : '=');
    } else {
      sign = a > b ? '<' : (a < b ? '>' : '=');
    }
    if (!isTrue && a === b) sign = ['<', '>'][randInt(0, 1)];

    const ans = isTrue ? 'True' : 'False';
    const opts = ['True', 'False'];
    return {
      prompt: `Is this statement True or False? \n ${a} ${sign} ${b}`,
      choices: opts,
      correctIndex: opts.indexOf(ans),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Is it true or false that ${a} is ${sign === '>' ? 'greater than' : sign === '<' ? 'less than' : 'equal to'} ${b}?`,
      funFact: isTrue ? `That's right, it is true!` : `Good job spotting the false statement!`,
    };
  });

  // 9: Solve and Compare
  const s9: Question[] = Array.from({ length: 5 }, () => {
    const a1 = randInt(1, 10), a2 = randInt(1, 10);
    const b1 = randInt(1, 10), b2 = randInt(1, 10);
    const sumA = a1 + a2;
    const sumB = b1 + b2;
    const sym = sumA > sumB ? '>' : sumA < sumB ? '<' : '=';
    const opts = shuffle(['>', '<', '=']);
    return {
      prompt: `Solve both sides! Which sign goes in the middle?`,
      visual: `${a1}+${a2}   ___   ${b1}+${b2}`,
      choices: opts,
      correctIndex: opts.indexOf(sym),
      type: 'choice',
      interactiveStyle: 'compare-cards',
      speechText: `What goes in the blank: greater than, less than, or equal to?`,
      funFact: `Because ${sumA} ${sym} ${sumB}!`,
    };
  });

  // 10: Which group has MORE
  const s10: Question[] = Array.from({ length: 5 }, () => {
    const a = randInt(1, 9), b = randInt(1, 9);
    const adjusted = a === b ? (b < 9 ? b + 1 : b - 1) : b;
    const img1 = randImg();
    const img2 = randImg();
    const correctLabel = a > adjusted ? 'Group 1' : 'Group 2';
    const opts = ['Group 1', 'Group 2'];
    return {
      prompt: `Which group has MORE items? 🧐`,
      countGroups: [
        { imageUrl: img1, count: a, label: 'Group 1' },
        { imageUrl: img2, count: adjusted, label: 'Group 2' },
      ],
      choices: opts,
      correctIndex: opts.indexOf(correctLabel),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Which group has more items? Group 1 or Group 2?`,
      funFact: `Yes! ${Math.max(a, adjusted)} is more than ${Math.min(a, adjusted)}!`,
    };
  });

  // 11: Which group has FEWER
  const s11: Question[] = Array.from({ length: 5 }, () => {
    const a = randInt(1, 9), b = randInt(1, 9);
    const adjusted = a === b ? (b < 9 ? b + 1 : b - 1) : b;
    const img1 = randImg();
    const img2 = randImg();
    const correctLabel = a < adjusted ? 'Group 1' : 'Group 2';
    const opts = ['Group 1', 'Group 2'];
    return {
      prompt: `Which group has FEWER items? 🤨`,
      countGroups: [
        { imageUrl: img1, count: a, label: 'Group 1' },
        { imageUrl: img2, count: adjusted, label: 'Group 2' },
      ],
      choices: opts,
      correctIndex: opts.indexOf(correctLabel),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Which group has fewer items? Group 1 or Group 2?`,
      funFact: `Yes! ${Math.min(a, adjusted)} is fewer than ${Math.max(a, adjusted)}!`,
    };
  });

  // 12: Missing symbol in True statement
  const s12: Question[] = Array.from({ length: 5 }, () => {
    const missingRight = Math.random() > 0.5;
    const sym = ['>', '<'][randInt(0, 1)];
    const num = randInt(5, 50);
    let correct = 0;
    if (sym === '>') correct = randInt(1, num - 1);
    else correct = randInt(num + 1, num + 20);
    const wrong1 = sym === '>' ? randInt(num + 1, num + 20) : randInt(1, num - 1);
    const wrong2 = num;
    const choices = shuffle([String(correct), String(wrong1), String(wrong2)].filter((v, i, a) => a.indexOf(v) === i));
    if (choices.length < 3) choices.push(String(randInt(100, 150)));

    return {
      prompt: `Which number makes this TRUE? ✨`,
      visual: missingRight ? ` ${num} ${sym} _?_ ` : ` _?_ ${sym} ${num} `,
      choices: choices,
      correctIndex: choices.indexOf(String(correct)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: missingRight ? `${num} is ${sym === '>' ? 'greater than' : 'less than'} what number?` : `What number is ${sym === '>' ? 'greater than' : 'less than'} ${num}?`,
      funFact: `Awesome! The statement is now true!`,
    };
  });

  return [
    { title: 'Comparing Groups', questions: s1 },
    { title: 'Which has MORE?', questions: s10 },
    { title: 'Which has FEWER?', questions: s11 },
    { title: 'Greater, Less or Equal?', questions: s2 },
    { title: 'Greatest or Least?', questions: s3 },
    { title: 'Smallest to Biggest', questions: s4 },
    { title: 'Biggest to Smallest', questions: s5 },
    { title: 'Find the Greater Number', questions: s6 },
    { title: 'Find the Lesser Number', questions: s7 },
    { title: 'True or False?', questions: s8 },
    { title: 'Solve & Compare', questions: s9 },
    { title: 'Make it True!', questions: s12 },
  ];
}

// ============ 3 · PLACE VALUE & BASE 10 =====================================
function generatePlaceValue(): Section[] {
  // 1: Blocks -> Number (Choice)
  const s1: Question[] = Array.from({ length: 5 }, () => {
    const tens = randInt(1, 9), ones = randInt(0, 9);
    const n = tens * 10 + ones;
    const opts = wrongNums(n, 2, 10, 99).map(String);
    return {
      prompt: `Look at the Base-10 blocks! What number is this? 🧱`,
      base10: { hundreds: 0, tens, ones },
      choices: opts,
      correctIndex: opts.indexOf(String(n)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count the tens and ones blocks. What number do they make?`,
      funFact: `${tens} Tens and ${ones} Ones makes ${n}!`,
    };
  });

  // 2: Blocks -> Tens and Ones (Choice)
  const s2: Question[] = Array.from({ length: 5 }, () => {
    const tens = randInt(1, 4), ones = randInt(1, 9);
    const correct = `${tens} Tens, ${ones} Ones`;
    const wrong1 = `${tens + 1} Tens, ${ones} Ones`;
    const wrong2 = `${tens} Tens, ${ones > 1 ? ones - 1 : ones + 1} Ones`;
    const opts = shuffle([correct, wrong1, wrong2]);
    return {
      prompt: `How many Tens and Ones are shown? 🔢`,
      base10: { hundreds: 0, tens, ones },
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `How many tens and how many ones are there?`,
      funFact: `Awesome counting!`,
    };
  });

  // 3: Text -> Number (Choice)
  const s3: Question[] = Array.from({ length: 5 }, () => {
    const tens = randInt(1, 9), ones = randInt(0, 9);
    const n = tens * 10 + ones;
    const opts = wrongNums(n, 2, 10, 99).map(String);
    return {
      prompt: `What number is ${tens} Tens and ${ones} Ones?`,
      visual: `${tens} Tens   &   ${ones} Ones`,
      choices: opts,
      correctIndex: opts.indexOf(String(n)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What number has ${tens} tens and ${ones} ones?`,
    };
  });

  // 4: Number -> Text (Choice)
  const s4: Question[] = Array.from({ length: 5 }, () => {
    const tens = randInt(1, 9), ones = randInt(0, 9);
    const n = tens * 10 + ones;
    const correct = `${tens} Tens, ${ones} Ones`;

    let w1 = `${ones} Tens, ${tens} Ones`;
    let w2 = `${tens} Tens, ${ones > 0 ? ones - 1 : ones + 1} Ones`;
    if (tens === ones) w1 = `${tens + 1} Tens, ${ones} Ones`;

    const opts = shuffle([correct, w1, w2]);
    return {
      prompt: `How many Tens and Ones are in ${n}?`,
      visual: `   ${n}   `,
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `How many tens and ones make up the number ${n}?`,
    };
  });

  // 5: Value of Digit (Choice)
  const s5: Question[] = Array.from({ length: 5 }, () => {
    const n = randInt(11, 99);
    const tensDigit = Math.floor(n / 10);
    const onesDigit = n % 10;
    const askingTens = Math.random() > 0.5;
    const correct = askingTens ? String(tensDigit * 10) : String(onesDigit);

    let wrong1 = askingTens ? String(tensDigit) : String(onesDigit * 10);
    let wrong2 = askingTens ? String((tensDigit + 1) * 10) : String((onesDigit + 1) % 10);

    // Ensure uniqueness
    const opts = Array.from(new Set([correct, wrong1, wrong2]));
    while (opts.length < 3) opts.push(String(randInt(100, 150)));
    const shuffledOpts = shuffle(opts);

    return {
      prompt: `In the number ${n}, what is the VALUE of the ${askingTens ? tensDigit : onesDigit}?`,
      visual: `   ${n}   `,
      choices: shuffledOpts,
      correctIndex: shuffledOpts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `In the number ${n}, what is the value of the digit ${askingTens ? tensDigit : onesDigit}?`,
      funFact: `The ${askingTens ? tensDigit : onesDigit} is in the ${askingTens ? 'tens' : 'ones'} place, so its value is ${correct}!`,
    };
  });

  // 6: Identify the Place (Choice)
  const s6: Question[] = Array.from({ length: 5 }, () => {
    const n = randInt(11, 99);
    const tensDigit = Math.floor(n / 10);
    const onesDigit = n % 10;
    const askingTens = Math.random() > 0.5;
    const correct = String(askingTens ? tensDigit : onesDigit);
    const opts = wrongNums(Number(correct), 2, 0, 9).map(String);
    return {
      prompt: `In the number ${n}, which digit is in the ${askingTens ? 'TENS' : 'ONES'} place? 🔍`,
      visual: `   ${n}   `,
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `In the number ${n}, what digit is in the ${askingTens ? 'tens' : 'ones'} place?`,
      funFact: `Yes! ${correct} is in the ${askingTens ? 'tens' : 'ones'} place.`,
    };
  });

  // 7: Expanded Form -> Number (Input)
  const s7: Question[] = Array.from({ length: 5 }, () => {
    const tens = randInt(1, 9), ones = randInt(1, 9);
    const ans = tens * 10 + ones;
    return {
      prompt: `What number is this? (Type your answer) ⌨️`,
      visual: `${tens * 10} + ${ones} = ?`,
      choices: [],
      correctAnswer: ans,
      type: 'input',
      speechText: `What is ${tens * 10} plus ${ones}?`,
      funFact: `${tens * 10} and ${ones} make ${ans}!`,
    };
  });

  // 8: Number -> Expanded Form (Choice)
  const s8: Question[] = Array.from({ length: 5 }, () => {
    const tens = randInt(1, 9), ones = randInt(1, 9);
    const n = tens * 10 + ones;
    const correct = `${tens * 10} + ${ones}`;
    const opts = shuffle([correct, `${tens} + ${ones}`, `${ones * 10} + ${tens}`]);
    return {
      prompt: `How do you write ${n} in expanded form?`,
      visual: `   ${n}   `,
      choices: opts,
      correctIndex: opts.indexOf(correct),
      type: 'choice',
      interactiveStyle: 'compare-cards',
      speechText: `Which of these is the expanded form of ${n}?`,
      funFact: `Great job! ${n} breaks down into ${tens * 10} and ${ones}!`,
    };
  });

  // 9: 10 More (Choice)
  const s9: Question[] = Array.from({ length: 5 }, () => {
    const n = randInt(10, 89);
    const ans = n + 10;
    const opts = wrongNums(ans, 2, 10, 99).map(String);
    return {
      prompt: `What is 10 MORE than ${n}? 📈`,
      visual: `${n} + 10 = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(ans)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What number is 10 more than ${n}?`,
      funFact: `Adding 10 makes the tens digit go up by 1! ${n} becomes ${ans}!`,
    };
  });

  // 10: 10 Less (Choice)
  const s10: Question[] = Array.from({ length: 5 }, () => {
    const n = randInt(20, 99);
    const ans = n - 10;
    const opts = wrongNums(ans, 2, 10, 89).map(String);
    return {
      prompt: `What is 10 LESS than ${n}? 📉`,
      visual: `${n} - 10 = ?`,
      choices: opts,
      correctIndex: opts.indexOf(String(ans)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What number is 10 less than ${n}?`,
      funFact: `Subtracting 10 makes the tens digit go down by 1! ${n} becomes ${ans}!`,
    };
  });

  // 11: Number Words to Numbers (Choice)
  const s11: Question[] = Array.from({ length: 5 }, () => {
    const words = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const tensIdx = randInt(0, 7);
    const ones = randInt(1, 9);
    const n = (tensIdx + 2) * 10 + ones;
    const word = `${words[tensIdx]}-${numberWords[ones]}`;
    const opts = wrongNums(n, 2, 20, 99).map(String);
    return {
      prompt: `Read the word and choose the number! 📖`,
      visual: ` ${word.toUpperCase()} `,
      choices: opts,
      correctIndex: opts.indexOf(String(n)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What number is ${word}?`,
      funFact: `Spot on! That spells ${n}.`,
    };
  });

  // 12: Match Pairs
  const s12: Question[] = Array.from({ length: 5 }, () => {
    const pairs = new Set<string>();
    const matchPairs: { left: string; right: string }[] = [];
    while (matchPairs.length < 4) {
      const t = randInt(1, 9);
      const o = randInt(0, 9);
      const n = t * 10 + o;
      if (!pairs.has(String(n))) {
        pairs.add(String(n));
        matchPairs.push({ left: `${t} Tens, ${o} Ones`, right: String(n) });
      }
    }
    return {
      prompt: `Match the Tens and Ones to the correct number! 🔗`,
      choices: [],
      type: 'match',
      matchPairs: matchPairs,
      speechText: `Tap a box on the left, then find its matching number on the right!`,
    };
  });

  return [
    { title: '🟦 Blocks to Number', questions: s1 },
    { title: '🧱 Blocks to Tens & Ones', questions: s2 },
    { title: '🔢 Tens & Ones to Number', questions: s3 },
    { title: '🔙 Number to Tens & Ones', questions: s4 },
    { title: '💡 Value of the Digit', questions: s5 },
    { title: '🔍 Identify the Place', questions: s6 },
    { title: '➕ Expanded Form (Type It)', questions: s7 },
    { title: '✍️ Write in Expanded Form', questions: s8 },
    { title: '📈 10 More', questions: s9 },
    { title: '📉 10 Less', questions: s10 },
    { title: '🗣️ Words to Numbers', questions: s11 },
    { title: '🔗 Match Tens & Ones', questions: s12 },
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

  // s5: Make 10 Match
  const s5: Question[] = Array.from({ length: 5 }, () => {
    const pairs = new Set<string>();
    const matchPairs: { left: string; right: string }[] = [];
    while (matchPairs.length < 4) {
      const a = randInt(1, 9);
      if (!pairs.has(String(a))) {
        pairs.add(String(a));
        pairs.add(String(10 - a));
        matchPairs.push({ left: `${a} + ?`, right: String(10 - a) });
      }
    }
    return {
      prompt: `Match the numbers that add up to 10! 🎯`,
      choices: [],
      type: 'match',
      matchPairs: matchPairs,
      speechText: `Which numbers make 10 together? Match them up!`,
    };
  });

  // s6: Money Addition
  const s6: Question[] = Array.from({ length: 6 }, () => {
    const c10Count = randInt(1, 3);
    const c5Count = randInt(1, 4);
    const total = (c10Count * 10) + (c5Count * 5);
    const choices = shuffle([...wrongNums(total, 2, 10, 50).map(n => `₹${n}`), `₹${total}`]);
    return {
      prompt: `Add the coins to find the total! 🪙`,
      countGroups: [
        { imageUrl: IMG.c10, count: c10Count, label: '₹10' },
        { imageUrl: IMG.c5, count: c5Count, label: '₹5' },
      ],
      choices,
      correctIndex: choices.indexOf(`₹${total}`),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count the ten rupee and five rupee coins. How much money is there in total?`,
      funFact: `Awesome! You added ₹10s and ₹5s to get ₹${total}!`,
    };
  });

  // s7: True or False Addition
  const s7: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 15);
    const b = randInt(1, 15);
    const isTrue = Math.random() > 0.5;
    const displayedSum = isTrue ? a + b : a + b + (randInt(1, 4) * (Math.random() > 0.5 ? 1 : -1));
    const ans = isTrue ? 'True ✅' : 'False ❌';
    const opts = ['True ✅', 'False ❌'];
    return {
      prompt: `True or False? \n ${a} + ${b} = ${displayedSum}`,
      choices: opts,
      correctIndex: opts.indexOf(ans),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Is it true that ${a} plus ${b} equals ${displayedSum}?`,
      funFact: isTrue ? `Spot on! It's true!` : `Good save! The real answer is ${a + b}.`,
    };
  });

  // s8: Double It!
  const s8: Question[] = Array.from({ length: 6 }, () => {
    const img = randImg();
    const a = randInt(1, 8);
    const choices = shuffle([...wrongNums(a + a, 2, 2, 20).map(String), String(a + a)]);
    return {
      prompt: `Double it! ${a} + ${a} = ? ✌️`,
      countGroups: [
        { imageUrl: img, count: a, label: `${a}` },
        { imageUrl: img, count: a, label: `${a}` },
      ],
      choices,
      correctIndex: choices.indexOf(String(a + a)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What is double of ${a}? Add ${a} and ${a}.`,
      funFact: `Doubles are twice as nice! ${a} + ${a} = ${a + a}!`,
    };
  });

  // s9: Dice Addition
  const s9: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 6), b = randInt(1, 6);
    const sum = a + b;
    const choices = shuffle([...wrongNums(sum, 2, 2, 12).map(String), String(sum)]);
    return {
      prompt: `Roll the dice & add! 🎲`,
      visual: `${'🎲'.repeat(a)}   +   ${'🎲'.repeat(b)} \n ${a} + ${b} = ?`,
      choices,
      correctIndex: choices.indexOf(String(sum)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Read the numbers from the dice, ${a} and ${b}. What do they add up to?`,
    };
  });

  // s10: Missing Addend Match
  const s10: Question[] = Array.from({ length: 5 }, () => {
    const matchPairs: { left: string; right: string }[] = [];
    const used = new Set<string>();
    while (matchPairs.length < 4) {
      const sum = randInt(10, 20);
      const a = randInt(1, sum - 1);
      const b = sum - a;
      if (!used.has(String(b))) {
        used.add(String(b));
        matchPairs.push({ left: `${a} + ? = ${sum}`, right: String(b) });
      }
    }
    return {
      prompt: `Match the missing number to complete the equation! 🧩`,
      choices: [],
      type: 'match',
      matchPairs: matchPairs,
      speechText: `Match the equation on the left to its missing number on the right!`,
    };
  });

  return [
    { title: '🖼️ Add the Pictures', questions: s1 },
    { title: '➕ Addition Facts (Fast!)', questions: s2 },
    { title: '❓ Find the Missing Number', questions: s3 },
    { title: '📖 Addition Word Problems', questions: s4 },
    { title: '🎯 Make 10 Match', questions: s5 },
    { title: '🪙 Money Addition', questions: s6 },
    { title: '✅ True or False?', questions: s7 },
    { title: '✌️ Double It!', questions: s8 },
    { title: '🎲 Dice Addition', questions: s9 },
    { title: '🧩 Missing Number Match', questions: s10 },
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

  // s5: Eating the Cake
  const s5: Question[] = Array.from({ length: 6 }, () => {
    const total = randInt(4, 10);
    const eaten = randInt(1, total - 1);
    const left = total - eaten;
    const choices = shuffle([...wrongNums(left, 2, 0, 10).map(String), String(left)]);
    return {
      prompt: `We had ${total} cakes 🍰. We ate ${eaten}. How many are left?`,
      countGroups: [
        { imageUrl: IMG.cake, count: left, label: `Leftovers` }
      ],
      visual: `${total} − ${eaten} = ?`,
      choices,
      correctIndex: choices.indexOf(String(left)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `If we have ${total} cakes and we eat ${eaten}, how many cakes are left?`,
      funFact: `Yummy! We have ${left} cakes left to enjoy!`,
    };
  });

  // s6: Money Subtraction
  const s6: Question[] = Array.from({ length: 6 }, () => {
    const myMoney = pick([10, 20, 50], 1)[0];
    const spend = randInt(1, myMoney - 1);
    const left = myMoney - spend;
    const choices = shuffle([...wrongNums(left, 2, 1, myMoney).map(n => `₹${n}`), `₹${left}`]);
    const noteImg = myMoney === 10 ? IMG.n10 : myMoney === 20 ? IMG.n20 : IMG.n50;

    return {
      prompt: `You have ₹${myMoney}. You spend ₹${spend}. How much is left? 💸`,
      countGroups: [
        { imageUrl: noteImg, count: 1, label: `My ₹${myMoney}` }
      ],
      visual: `₹${myMoney} − ₹${spend} = ?`,
      choices,
      correctIndex: choices.indexOf(`₹${left}`),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `If you have ${myMoney} rupees and spend ${spend} rupees, how much money do you get back?`,
      funFact: `You keep ₹${left} in your piggy bank! 🐷`,
    };
  });

  // s7: True or False Subtraction
  const s7: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(5, 20);
    const b = randInt(1, a - 1);
    const isTrue = Math.random() > 0.5;
    const displayedDiff = isTrue ? a - b : a - b + (randInt(1, 3) * (Math.random() > 0.5 ? 1 : -1));
    const ans = isTrue ? 'True ✅' : 'False ❌';
    const opts = ['True ✅', 'False ❌'];
    return {
      prompt: `True or False? \n ${a} − ${b} = ${displayedDiff}`,
      choices: opts,
      correctIndex: opts.indexOf(ans),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Is it true that ${a} minus ${b} equals ${displayedDiff}?`,
      funFact: isTrue ? `Spot on! It's true!` : `Good save! The real answer is ${a - b}.`,
    };
  });

  // s8: Subtracting from 10
  const s8: Question[] = Array.from({ length: 6 }, () => {
    const a = randInt(1, 9);
    const left = 10 - a;
    const choices = shuffle([...wrongNums(left, 2, 0, 10).map(String), String(left)]);
    return {
      prompt: `Fast Facts! 10 − ${a} = ? ⚡`,
      visual: `10 − ${a} = ?`,
      choices,
      correctIndex: choices.indexOf(String(left)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `What is 10 minus ${a}?`,
      funFact: `10 minus ${a} is ${left}! You are lightning fast! ⚡`,
    };
  });

  // s9: Balloon Pop
  const s9: Question[] = Array.from({ length: 6 }, () => {
    const total = randInt(5, 12);
    const pop = randInt(1, total - 1);
    const left = total - pop;
    const choices = shuffle([...wrongNums(left, 2, 0, 12).map(String), String(left)]);
    return {
      prompt: `There were ${total} balloons 🎈. *POP!* ${pop} popped. How many left?`,
      countGroups: [
        { imageUrl: IMG.balloon, count: left, label: `${left} safe!` }
      ],
      choices,
      correctIndex: choices.indexOf(String(left)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `You had ${total} balloons and ${pop} of them popped. How many are left?`,
    };
  });

  // s10: Match the Difference
  const s10: Question[] = Array.from({ length: 5 }, () => {
    const matchPairs: { left: string; right: string }[] = [];
    const used = new Set<string>();
    while (matchPairs.length < 4) {
      const a = randInt(5, 15);
      const b = randInt(1, a - 1);
      const diff = a - b;
      if (!used.has(String(diff))) {
        used.add(String(diff));
        matchPairs.push({ left: `${a} − ${b}`, right: String(diff) });
      }
    }
    return {
      prompt: `Match the equation to its correct answer! 🧩`,
      choices: [],
      type: 'match',
      matchPairs: matchPairs,
      speechText: `Match each subtraction problem on the left with its answer on the right!`,
    };
  });

  return [
    { title: '🖼️ Take Away Pictures', questions: s1 },
    { title: '➖ Subtraction Facts (Fast!)', questions: s2 },
    { title: '❓ Find the Missing Number', questions: s3 },
    { title: '📖 Subtraction Stories', questions: s4 },
    { title: '🍰 Eating the Cake', questions: s5 },
    { title: '💸 Money Subtraction', questions: s6 },
    { title: '✅ True or False?', questions: s7 },
    { title: '⚡ Subtracting from 10', questions: s8 },
    { title: '🎈 Balloon Pop!', questions: s9 },
    { title: '🧩 Match the Difference', questions: s10 },
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
  { value: 1, name: '₹1 coin', label: '₹1', img: IMG.c1 },
  { value: 2, name: '₹2 coin', label: '₹2', img: IMG.c2 },
  { value: 5, name: '₹5 coin', label: '₹5', img: IMG.c5 },
  { value: 10, name: '₹10 coin', label: '₹10', img: IMG.c10 },
  { value: 20, name: '₹20 coin', label: '₹20', img: IMG.c20 },
];
const indianNotes = [
  { value: 10, name: '₹10 note', label: '₹10', img: IMG.n10 },
  { value: 20, name: '₹20 note', label: '₹20', img: IMG.n20 },
  { value: 50, name: '₹50 note', label: '₹50', img: IMG.n50 },
  { value: 100, name: '₹100 note', label: '₹100', img: IMG.n100 },
  { value: 200, name: '₹200 note', label: '₹200', img: IMG.n200 },
  { value: 500, name: '₹500 note', label: '₹500', img: IMG.n500 },
];

const allMoney = [...indianCoins, ...indianNotes];

function generateMoney(): Section[] {
  // --- SET 1: Identify Coins & Notes (Real Images) ---
  const s1: Question[] = Array.from({ length: 14 }, (_, i) => {
    const item = allMoney[i % allMoney.length];
    const choices = shuffle([item.name, ...pick(allMoney.filter(m => m.name !== item.name).map(m => m.name), 2)]);
    return {
      prompt: `Identify this ${item.value > 20 ? 'note' : 'money'}! What is it?`,
      imageUrl: item.img,
      choices,
      correctIndex: choices.indexOf(item.name),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Look at the picture. What is this ${item.value > 20 ? 'note' : 'coin'} worth?`,
      funFact: `This is a ${item.name}! Great job identifying it. 🌟`,
    };
  });

  // --- SET 2: Add Up the Money (Visual Counting) ---
  const s2: Question[] = Array.from({ length: 12 }, () => {
    const numItems = randInt(2, 4);
    const selected = Array.from({ length: numItems }, () => indianCoins[randInt(0, indianCoins.length - 1)]);
    const total = selected.reduce((sum, item) => sum + item.value, 0);
    const choices = wrongNums(total, 3, 1, 100).map(n => `₹${n}`);

    return {
      prompt: `How much money is here in total? 💰`,
      countGroups: selected.map(item => ({ imageUrl: item.img, count: 1, label: item.label })),
      choices,
      correctIndex: choices.indexOf(`₹${total}`),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Count all the money you see. What is the total amount in rupees?`,
      funFact: `Adding ${selected.map(s => s.label).join(' + ')} gives you ₹${total}! 🎈`,
    };
  });

  // --- SET 3: Match Item to Price ---
  const shopItems = [
    { name: 'Apple 🍎', cost: 10 },
    { name: 'Pencil ✏️', cost: 5 },
    { name: 'Chocolate 🍫', cost: 20 },
    { name: 'Ball ⚽', cost: 50 },
    { name: 'Toy Car 🏎️', cost: 100 },
    { name: 'Notebook 📓', cost: 30 },
  ];

  const s3: Question[] = [
    {
      prompt: "Match the items to their correct prices! 🏷️",
      type: 'match',
      matchPairs: shuffle(shopItems).slice(0, 4).map(item => ({
        left: item.name,
        right: `₹${item.cost}`
      })),
      speechText: "Can you match each item to how much it costs?",
      funFact: "You are getting really good at reading price tags! 🛍️"
    },
    {
      prompt: "Match the money to its value! 🪙",
      type: 'match',
      matchPairs: shuffle(allMoney).slice(0, 4).map(m => ({
        left: m.label,
        right: m.name
      })),
      speechText: "Match the labels on the left to the names on the right.",
      funFact: "Perfect matching! You know your money well. 💎"
    },
    {
      prompt: "Shopping Match! 🛍️",
      type: 'match',
      matchPairs: shuffle(shopItems).reverse().slice(0, 4).map(item => ({
        left: item.name,
        right: `₹${item.cost}`
      })),
      speechText: "One more matching game! Can you match these items to their costs?",
      funFact: "You are a shopping master! 🛒"
    }
  ];

  // --- SET 4: Can I Buy It? (Budgeting) ---
  const budgetingItems = [
    { item: 'Ice Cream 🍦', cost: 40 },
    { item: 'Stickers ✨', cost: 15 },
    { item: 'Juice 🧃', cost: 25 },
    { item: 'Balloon 🎈', cost: 10 },
    { item: 'Teddy 🧸', cost: 200 },
  ];

  const s4: Question[] = Array.from({ length: 10 }, () => {
    const myMoney = pick([10, 20, 50, 100, 500], 1)[0];
    const purchase = budgetingItems[randInt(0, budgetingItems.length - 1)];
    const canBuy = myMoney >= purchase.cost;

    return {
      prompt: `You have ₹${myMoney}. The ${purchase.item} costs ₹${purchase.cost}. Can you buy it?`,
      visual: `MY MONEY: ₹${myMoney}\nCOST: ₹${purchase.cost}`,
      choices: ['Yes, I can! ✅', 'No, not enough ❌'],
      correctIndex: canBuy ? 0 : 1,
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `If you have ${myMoney} rupees and the ${purchase.item} costs ${purchase.cost} rupees, do you have enough?`,
      funFact: canBuy
        ? `Yes! You'll even have ₹${myMoney - purchase.cost} left over. 🌈`
        : `Not yet! You need ₹${purchase.cost - myMoney} more. 📈`,
    };
  });

  // --- SET 5: Comparing Money (Greater/Less) ---
  const s5: Question[] = Array.from({ length: 10 }, () => {
    const valA = pick([5, 10, 20, 50, 100, 200], 1)[0];
    const valB = pick([5, 10, 20, 50, 100, 200].filter(v => v !== valA), 1)[0];
    const itemA = allMoney.find(m => m.value === valA) || allMoney[0];
    const itemB = allMoney.find(m => m.value === valB) || allMoney[1];

    return {
      prompt: `Which amount is MORE? 👆`,
      type: 'choice',
      countGroups: [
        { imageUrl: itemA.img, count: 1, label: `Choice A` },
        { imageUrl: itemB.img, count: 1, label: `Choice B` }
      ],
      choices: [`₹${valA}`, `₹${valB}`],
      correctIndex: valA > valB ? 0 : 1,
      interactiveStyle: 'balloons',
      speechText: `Which one here is more money? Choice A or Choice B?`,
    };
  });

  // --- SET 6: Money Patterns (Skip counting ₹10 notes) ---
  const s6: Question[] = Array.from({ length: 8 }, () => {
    const start = randInt(1, 4) * 10;
    const seq = [start, start + 10, start + 20, start + 30];
    const missingIdx = randInt(1, 3);
    const correct = seq[missingIdx];
    const choices = shuffle([String(correct), ...wrongNums(correct, 2, 10, 100).map(n => String(n))]);

    return {
      prompt: `Count by 10s! What number is missing in the pattern? 🔟`,
      visual: `SEQUENCE:${seq.map((n, i) => i === missingIdx ? '__' : n).join(',')}`,
      imageUrl: IMG.n10,
      choices,
      correctIndex: choices.indexOf(String(correct)),
      type: 'choice',
      interactiveStyle: 'balloons',
      speechText: `Look at the pattern. We are counting by tens. What comes next?`,
    };
  });

  return [
    { title: '🪙 Identify Coins & Notes', questions: s1 },
    { title: '➕ Add the Money', questions: s2 },
    { title: '🤝 Price Matching Game', questions: s3 },
    { title: '🛒 Shopping Time!', questions: s4 },
    { title: '⚖️ Which is More?', questions: s5 },
    { title: '🔟 Money Patterns', questions: s6 },
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
        interactiveStyle: 'balloons' as const,
        speechText: `First ${a}, then ${b} more arrive. How many in total?`,
      };
    } else {
      const total = a + b;
      const opts = wrongNums(b, 2, 1, 9).map(String);
      return {
        prompt: `🎯 There were ${total}. ${a} left. How many are still there?`,
        choices: opts, correctIndex: opts.indexOf(String(b)), type: 'choice',
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
