import { useState } from 'react';
import type { Section } from '@/lib/questionGenerators';

// ─── SVG Analog Clock ──────────────────────────────────────────────────────
const AnalogClock = ({ hour, minute, size = 120 }: { hour: number; minute: number; size?: number }) => {
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  // Hour hand angle: each hour = 30°, plus minute contribution (0.5° per minute)
  const hourAngle = ((hour % 12) * 30 + minute * 0.5 - 90) * (Math.PI / 180);
  const minAngle = (minute * 6 - 90) * (Math.PI / 180);
  const hourLen = r * 0.55, minLen = r * 0.78;

  const hx = cx + hourLen * Math.cos(hourAngle);
  const hy = cy + hourLen * Math.sin(hourAngle);
  const mx = cx + minLen * Math.cos(minAngle);
  const my = cy + minLen * Math.sin(minAngle);

  // Hour tick marks
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180);
    const inner = r * 0.85, outer = r;
    return {
      x1: cx + inner * Math.cos(a), y1: cy + inner * Math.sin(a),
      x2: cx + outer * Math.cos(a), y2: cy + outer * Math.sin(a),
    };
  });

  // Numbers 1-12
  const nums = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const a = (n * 30 - 90) * (Math.PI / 180);
    const dist = r * 0.72;
    return { n, x: cx + dist * Math.cos(a), y: cy + dist * Math.sin(a) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto', animation: 'floatItem 3s ease-in-out infinite' }}>
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#1565C0" strokeWidth={3} />
      {/* Ticks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#bbb" strokeWidth={2} />
      ))}
      {/* Numbers */}
      {nums.map(({ n, x, y }) => (
        <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fontSize={size * 0.11} fontWeight="700" fill="#1A237E" fontFamily="Nunito, sans-serif">
          {n}
        </text>
      ))}
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#1A237E" strokeWidth={size * 0.055}
        strokeLinecap="round" />
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#E53935" strokeWidth={size * 0.03}
        strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={size * 0.04} fill="#FFB300" />
    </svg>
  );
};

// ─── Fraction SVG ─────────────────────────────────────────────────────────
const FractionSVG = ({ parts, shaded, shape }: { parts: number; shaded: number; shape: 'circle' | 'rect' }) => {
  const size = 100;
  const colors = ['#E53935', '#FB8C00', '#43A047', '#1E88E5', '#8E24AA', '#FFB300'];

  if (shape === 'circle') {
    const cx = size / 2, cy = size / 2, r = 40;
    const slices = Array.from({ length: parts }, (_, i) => {
      const startAngle = (i * 360 / parts - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * 360 / parts - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
      const large = 360 / parts > 180 ? 1 : 0;
      const d = `M${cx},${cy} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} Z`;
      return { d, fill: i < shaded ? colors[i % colors.length] : '#e0e0e0' };
    });
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto', animation: 'floatItem 3s ease-in-out infinite' }}>
        {slices.map((s, i) => <path key={i} d={s.d} fill={s.fill} stroke="white" strokeWidth={2} />)}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#333" strokeWidth={2} />
        <text x={cx} y={size - 6} textAnchor="middle" fontSize={13} fontWeight="800" fill="#1A237E">
          {shaded}/{parts}
        </text>
      </svg>
    );
  }

  // Rectangle
  const w = 90, h = 50, ox = 5, oy = 20;
  const sliceW = w / parts;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto', animation: 'floatItem 3s ease-in-out infinite' }}>
      {Array.from({ length: parts }, (_, i) => (
        <rect key={i} x={ox + i * sliceW} y={oy} width={sliceW} height={h}
          fill={i < shaded ? colors[i % colors.length] : '#e0e0e0'}
          stroke="white" strokeWidth={1.5} />
      ))}
      <rect x={ox} y={oy} width={w} height={h} fill="none" stroke="#333" strokeWidth={2} />
      <text x={size / 2} y={85} textAnchor="middle" fontSize={13} fontWeight="800" fill="#1A237E">
        {shaded}/{parts}
      </text>
    </svg>
  );
};

// ─── Place Value Mat (Redesigned Base-10) ──────────────────────────────────
const Base10Blocks = ({ hundreds, tens, ones }: { hundreds: number; tens: number; ones: number }) => {
  return (
    <div className="pv-mat">
      {/* Tens Column */}
      {tens > 0 && (
        <div className="pv-col tens">
          <div className="pv-header">Tens</div>
          <div className="pv-blocks-container">
            {Array.from({ length: tens }, (_, i) => (
              <div key={`ten-${i}`} className="pv-ten-rod" />
            ))}
          </div>
        </div>
      )}

      {/* Ones Column */}
      {ones > 0 && (
        <div className="pv-col ones">
          <div className="pv-header">Ones</div>
          <div className="pv-blocks-container">
            <div className="pv-ones-grid">
              {Array.from({ length: ones }, (_, i) => (
                <div key={`one-${i}`} className="pv-one-cube" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Shape SVG ─────────────────────────────────────────────────────────────
const ShapeSVG = ({ svgId, color }: { svgId: string; color: string }) => {
  const sz = 110, sw = 4, s = '#222';
  const m: Record<string, JSX.Element> = {
    circle: <svg width={sz} height={sz} viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill={color} stroke={s} strokeWidth={sw} /></svg>,
    triangle: <svg width={sz} height={sz} viewBox="0 0 100 100"><polygon points="50,8 95,90 5,90" fill={color} stroke={s} strokeWidth={sw} /></svg>,
    square: <svg width={sz} height={sz} viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" fill={color} stroke={s} strokeWidth={sw} /></svg>,
    rectangle: <svg width={130} height={80} viewBox="0 0 130 80"><rect x="6" y="6" width="118" height="68" fill={color} stroke={s} strokeWidth={sw} /></svg>,
    pentagon: <svg width={sz} height={sz} viewBox="0 0 100 100"><polygon points="50,6 97,38 80,92 20,92 3,38" fill={color} stroke={s} strokeWidth={sw} /></svg>,
    hexagon: <svg width={sz} height={sz} viewBox="0 0 100 100"><polygon points="50,4 93,27 93,73 50,96 7,73 7,27" fill={color} stroke={s} strokeWidth={sw} /></svg>,
  };
  return <div style={{ display: 'flex', justifyContent: 'center', padding: 8, animation: 'floatItem 3s ease-in-out infinite' }}>{m[svgId] ?? null}</div>;
};

// ─── Image Count Grid ───────────────────────────────────────────────────────
const ImageCountGrid = ({ imageUrl, count }: { imageUrl: string; count: number }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: 8, maxWidth: 300, margin: '0 auto' }}>
    {Array.from({ length: count }, (_, i) => (
      <img key={i} src={imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 8 }} />
    ))}
  </div>
);

// ─── Group Compare ──────────────────────────────────────────────────────────
const GroupCompare = ({ groups }: { groups: { imageUrl: string; count: number; label?: string; _clockData?: any }[] }) => (
  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
    {groups.map((g, i) => {
      const isSingular = g.count === 1;
      return (
        <div key={i} style={{
          border: '2.5px dashed #90CAF9', borderRadius: 20, padding: '14px 18px',
          textAlign: 'center', background: '#F0F7FF', minWidth: isSingular ? 120 : 150,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(33,150,243,0.1)',
        }}>
          {g.label && (
            <div style={{ fontWeight: 900, fontSize: 14, color: '#1565C0', marginBottom: 8, fontFamily: "'Baloo 2',cursive" }}>
              {g.label}
            </div>
          )}
          {g._clockData ? (
            <AnalogClock hour={g._clockData.hour} minute={g._clockData.minute} size={110} />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: isSingular ? 140 : 180 }}>
              {Array.from({ length: g.count }, (_, j) => (
                <img key={j} src={g.imageUrl} alt="" style={{
                  width: isSingular ? 110 : 50,
                  height: isSingular ? 110 : 50,
                  objectFit: 'contain',
                  borderRadius: 8,
                  animation: `floatItem 3s ease-in-out ${j * 0.2}s infinite, popIn 0.4s ease-out`
                }} />
              ))}
            </div>
          )}
          {!g._clockData && !isSingular && (
            <div style={{ fontSize: 12, fontWeight: 700, color: '#666', marginTop: 8 }}>{g.count} items</div>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Visual Block ───────────────────────────────────────────────────────────
const VisualBlock = ({ visual }: { visual: string }) => {
  if (visual.startsWith('SHAPE:')) {
    const [, svgId, color] = visual.split(':');
    return <ShapeSVG svgId={svgId} color={color} />;
  }

  if (visual.startsWith('SEQUENCE:')) {
    const items = visual.replace('SEQUENCE:', '').split(',');
    return (
      <div className="sequence-container">
        {items.map((item, i) => (
          <div
            key={i}
            className={`sequence-box ${item === '__' ? 'missing' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {item !== '__' ? item : ''}
          </div>
        ))}
      </div>
    );
  }

  if (visual.startsWith('GRID:')) {
    const items = visual.replace('GRID:', '').split(',');
    return (
      <div className="grid-container">
        {items.map((item, i) => (
          <div
            key={i}
            className={`grid-box ${item === '__' ? 'missing' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {item !== '__' ? item : ''}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'monospace', fontSize: 15, whiteSpace: 'pre-line', textAlign: 'center',
      background: '#FFFDE7', border: '1.5px dashed #FFD54F', borderRadius: 10,
      padding: '8px 14px', lineHeight: 1.7, color: '#1A237E',
    }}>
      {visual}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
interface WorksheetSectionProps {
  section: Section;
  index: number;
  voiceEnabled?: boolean;
  onSpeak?: (text: string) => void;
}

const sectionColors = [
  '#E3F2FD', '#FFF8E1', '#E8F5E9', '#F3E5F5',
  '#E0F7FA', '#FCE4EC', '#F1F8E9', '#FFF3E0',
];

const WorksheetSection = ({ section, index, voiceEnabled = false, onSpeak }: WorksheetSectionProps) => {
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [showFun, setShowFun] = useState<Record<number, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [orderValues, setOrderValues] = useState<Record<number, string[]>>({}); // tracks selected order
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<Record<number, string>>({});
  const [matchedPairs, setMatchedPairs] = useState<Record<number, string[]>>({}); // left strings
  const [wrongMatch, setWrongMatch] = useState<Record<number, string>>({}); // wrong right string

  const validQs = section.questions.length;
  const correctCount = Object.entries(answers).filter(([qi, ans]) => {
    const q = section.questions[Number(qi)];
    if (q.type === 'input' || q.type === 'order') return String(ans) === String(q.correctAnswer);
    if (q.type === 'match') return ans === 'correct';
    return q.correctIndex === Number(ans);
  }).length;

  const handleChoice = (qi: number, ci: number) => {
    if (answers[qi] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qi]: ci }));
    const q = section.questions[qi];
    const ok = ci === q.correctIndex;
    if (ok && (q as any).funFact) setShowFun(prev => ({ ...prev, [qi]: true }));
    if (voiceEnabled && onSpeak) {
      onSpeak(ok
        ? (q as any).funFact ?? 'Great job! That is correct!'
        : `Try again! The correct answer is ${q.choices[q.correctIndex ?? 0]}.`
      );
    }
  };

  const handleInputSubmit = (qi: number) => {
    if (answers[qi] !== undefined) return;
    const q = section.questions[qi];
    const val = inputValues[qi] || '';
    if (!val.trim()) return;

    setAnswers(prev => ({ ...prev, [qi]: val }));
    const ok = String(val).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

    if (ok && (q as any).funFact) setShowFun(prev => ({ ...prev, [qi]: true }));
    if (voiceEnabled && onSpeak) {
      onSpeak(ok
        ? (q as any).funFact ?? 'Great job! That is correct!'
        : `Try again! The correct answer is ${q.correctAnswer}.`
      );
    }
  };

  const handleOrderTap = (qi: number, val: string, isRemove: boolean = false) => {
    if (answers[qi] !== undefined) return;
    const q = section.questions[qi];

    setOrderValues(prev => {
      const current = prev[qi] || [];
      let next: string[];

      if (isRemove) {
        next = current.filter(v => v !== val);
      } else {
        if (current.includes(val) || current.length >= q.choices.length) return prev;
        next = [...current, val];
      }

      // Auto-submit if all slots are filled
      if (next.length === q.choices.length) {
        setAnswers(ansPrev => ({ ...ansPrev, [qi]: next.join(',') }));
        const isCorrect = next.join(',') === String(q.correctAnswer);
        if (isCorrect && (q as any).funFact) setShowFun(fPrev => ({ ...fPrev, [qi]: true }));

        if (voiceEnabled && onSpeak) {
          onSpeak(isCorrect
            ? ((q as any).funFact ?? 'Great job! That is correct!')
            : `Try again! The correct order is ${String(q.correctAnswer).replace(/,/g, ', ')}.`
          );
        }
      }

      return { ...prev, [qi]: next };
    });
  };

  const handleMatchSelect = (qi: number, side: 'left' | 'right', val: string) => {
    if (answers[qi] !== undefined) return;
    const q = section.questions[qi];
    if (!q.matchPairs) return;

    if (side === 'left') {
      setMatchSelectedLeft(prev => ({ ...prev, [qi]: prev[qi] === val ? '' : val }));
    } else {
      const selectedLeft = matchSelectedLeft[qi];
      if (!selectedLeft) return; // Must select left first

      const isMatch = q.matchPairs.some(p => p.left === selectedLeft && p.right === val);
      if (isMatch) {
        setMatchedPairs(prev => {
          const current = prev[qi] || [];
          const updated = [...current, selectedLeft];

          if (updated.length === q.matchPairs!.length) {
            setAnswers(ansPrev => ({ ...ansPrev, [qi]: 'correct' }));
            if ((q as any).funFact) setShowFun(old => ({ ...old, [qi]: true }));
            if (voiceEnabled && onSpeak) onSpeak('Amazing! You matched them all!');
          }
          return { ...prev, [qi]: updated };
        });
        setMatchSelectedLeft(prev => ({ ...prev, [qi]: '' }));
      } else {
        setWrongMatch(prev => ({ ...prev, [qi]: val }));
        setTimeout(() => setWrongMatch(prev => ({ ...prev, [qi]: '' })), 500);
      }
    }
  };

  const handleReset = () => {
    setAnswers({}); setShowFun({}); setInputValues({}); setOrderValues({});
    setMatchSelectedLeft({}); setMatchedPairs({}); setWrongMatch({});
  };

  const choiceStyle = (qi: number, ci: number): React.CSSProperties => {
    const q = section.questions[qi];
    const isAnswered = answers[qi] !== undefined;
    if (!isAnswered) return {}; // Let CSS .choice-btn-idle handle it

    const isCorrect = ci === q.correctIndex;
    const isSelected = answers[qi] === ci;
    if (isCorrect) return {
      cursor: 'default', border: '2.5px solid #43A047', background: '#E8F5E9',
      color: '#1B5E20', transform: 'scale(1.07)',
      boxShadow: '0 0 12px rgba(67,160,71,0.5)', fontWeight: 800,
    };
    if (isSelected) return {
      cursor: 'default', border: '2.5px solid #E53935', background: '#FFEBEE',
      color: '#B71C1C', opacity: 0.8, textDecoration: 'line-through',
    };
    return { cursor: 'default', border: '2.5px solid #e0e0e0', background: '#f5f5f5', color: '#aaa', opacity: 0.45 };
  };

  const isPerfect = validQs > 0 && correctCount === validQs && Object.keys(answers).length >= validQs;
  const cardColor = sectionColors[index % sectionColors.length];

  return (
    <div
      className="worksheet-fade-in"
      style={{
        background: 'white',
        borderRadius: 24,
        padding: 26,
        marginBottom: 22,
        border: '2px solid #90CAF9',
        boxShadow: '0 4px 20px rgba(33,150,243,0.10)',
        animationDelay: `${index * 0.07}s`,
      }}
    >
      {/* ── Section Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 18, flexWrap: 'wrap', gap: 8,
        background: `linear-gradient(to right, ${cardColor}, white)`,
        borderRadius: 14, padding: '10px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg,#42A5F5,#1565C0)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, flexShrink: 0,
          }}>{index + 1}</span>
          <h3 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 18, fontWeight: 800, color: '#1A237E', margin: 0 }}>
            {section.title}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {validQs > 0 && (
            <span style={{
              padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 800,
              background: isPerfect
                ? 'linear-gradient(135deg,#43A047,#1B5E20)'
                : 'linear-gradient(135deg,#42A5F5,#1565C0)',
              color: 'white', animation: 'popIn 0.3s ease-out',
            }}>
              {correctCount}/{validQs} ✅
            </span>
          )}
          <button onClick={handleReset} className="reset-btn">
            ↩️ Reset
          </button>
        </div>
      </div>

      {isPerfect && (
        <div
          className="celebration-banner"
          style={{ marginBottom: 16, animation: 'popIn 0.4s ease-out, glowPulse 2s infinite' }}
        >
          🌟 Wow! Perfect Score! You are a Math Champion! 🏆🎉
        </div>
      )}

      {/* ── Questions Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
        {section.questions.map((q, qi) => {
          const isAnswered = answers[qi] !== undefined;
          let isCorrect = false;
          if (isAnswered) {
            isCorrect = q.type === 'input'
              ? String(answers[qi]).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
              : answers[qi] === q.correctIndex;
          }
          return (
            <div key={qi} style={{
              border: `2px dashed ${isCorrect ? '#66BB6A' : '#90CAF9'}`,
              borderRadius: 18, padding: 18,
              background: isCorrect ? '#F1F8E9' : '#FAFBFF',
              transition: 'all 0.25s',
            }}>
              {/* Prompt */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                <p style={{
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15,
                  color: '#1A237E', lineHeight: 1.45, flex: 1, margin: 0,
                }}>{q.prompt}</p>
                {voiceEnabled && (
                  <button onClick={() => onSpeak?.((q as any).speechText ?? q.prompt)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #90CAF9',
                      background: '#E3F2FD', cursor: 'pointer', fontSize: 15, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    🔊
                  </button>
                )}
              </div>

              {/* Analog Clock */}
              {(q as any).analogClock && (
                <div style={{ marginBottom: 12, textAlign: 'center' }}>
                  <AnalogClock
                    hour={(q as any).analogClock.hour}
                    minute={(q as any).analogClock.minute}
                    size={130}
                  />
                  <div style={{ fontSize: 12, color: '#777', marginTop: 4 }}>
                    Short hand = hours · Long hand = minutes
                  </div>
                </div>
              )}

              {/* Fraction SVG */}
              {(q as any).fractionSvg && (
                <div style={{ marginBottom: 12 }}>
                  <FractionSVG
                    parts={(q as any).fractionSvg.parts}
                    shaded={(q as any).fractionSvg.shaded}
                    shape={(q as any).fractionSvg.shape}
                  />
                </div>
              )}

              {/* Base-10 Blocks */}
              {(q as any).base10 && (
                <div style={{ marginBottom: 12, background: '#F3F8FF', borderRadius: 12, padding: 8 }}>
                  <Base10Blocks
                    hundreds={(q as any).base10.hundreds}
                    tens={(q as any).base10.tens}
                    ones={(q as any).base10.ones}
                  />
                </div>
              )}

              {/* Count Image Grid */}
              {(q as any).countImageUrl && (q as any).countNumber && (
                <div style={{ marginBottom: 12 }}>
                  <ImageCountGrid imageUrl={(q as any).countImageUrl} count={(q as any).countNumber} />
                </div>
              )}

              {/* Group Compare */}
              {(q as any).countGroups?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <GroupCompare groups={(q as any).countGroups} />
                </div>
              )}

              {/* Reference Image */}
              {(q as any).imageUrl && !(q as any).countGroups && (
                <div style={{ textAlign: 'center', marginBottom: 10 }}>
                  <img src={(q as any).imageUrl} alt="" style={{
                    maxHeight: 120, maxWidth: '100%', objectFit: 'contain', borderRadius: 10,
                  }} />
                </div>
              )}

              {/* Text / Shape Visual */}
              {q.visual && q.interactiveStyle === 'compare-cards' ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, margin: '20px 0' }}>
                  <div className="compare-card">{q.visual.split('___')[0]?.trim()}</div>
                  <div className={`compare-slot ${answers[qi] !== undefined ? 'filled' : 'empty'}`}>
                    {answers[qi] !== undefined ? q.choices[answers[qi] as number] : '?'}
                  </div>
                  <div className="compare-card">{q.visual.split('___')[1]?.trim()}</div>
                </div>
              ) : q.visual ? (
                <div style={{ marginBottom: 12 }}><VisualBlock visual={q.visual} /></div>
              ) : null}

              {/* Choices / Input Area */}
              {q.type === 'input' ? (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14 }}>
                  <input
                    type="text"
                    inputMode={typeof q.correctAnswer === 'number' ? 'numeric' : 'text'}
                    value={inputValues[qi] ?? ''}
                    onChange={(e) => {
                      if (!isAnswered) setInputValues(prev => ({ ...prev, [qi]: e.target.value }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isAnswered) handleInputSubmit(qi);
                    }}
                    disabled={isAnswered}
                    placeholder="?"
                    className="fun-input"
                    style={{
                      background: isAnswered ? '#f5f5f5' : 'white',
                      width: 140, // and whatever else can't be in CSS
                    }}
                  />
                  <button
                    onClick={() => handleInputSubmit(qi)}
                    disabled={isAnswered || !inputValues[qi]?.trim()}
                    className="check-btn"
                  >
                    Check
                  </button>
                </div>
              ) : q.type === 'order' ? (
                <div style={{ marginTop: 14 }}>
                  {/* Sequence Slots */}
                  <div className="order-container">
                    {q.choices.map((_, slotIdx) => {
                      const val = (orderValues[qi] || [])[slotIdx];
                      return (
                        <div
                          key={`slot-${slotIdx}`}
                          className={`order-slot ${val ? 'filled' : 'empty'}`}
                          onClick={() => val && handleOrderTap(qi, val, true)}
                        >
                          {val || ''}
                        </div>
                      );
                    })}
                  </div>
                  {/* Number Bank */}
                  <div className="order-pill-bank" style={{ opacity: isAnswered ? 0.6 : 1, pointerEvents: isAnswered ? 'none' : 'auto' }}>
                    {q.choices.map((choice, ci) => {
                      const isSelected = (orderValues[qi] || []).includes(choice);
                      return (
                        <button
                          key={`pill-${ci}`}
                          className="order-pill"
                          onClick={() => handleOrderTap(qi, choice)}
                          style={{
                            opacity: isSelected ? 0.3 : 1,
                            transform: isSelected ? 'scale(0.95)' : 'none',
                            cursor: isSelected ? 'default' : 'pointer'
                          }}
                          disabled={isSelected}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : q.interactiveStyle === 'balloons' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginTop: 24 }}>
                  {q.choices.map((choice, ci) => (
                    <button key={ci} onClick={() => handleChoice(qi, ci)}
                      disabled={isAnswered}
                      className="balloon-choice"
                      style={{
                        animationDelay: `${ci * 0.15}s`,
                        background: `hsl(${(ci * 137) % 360}, 80%, 65%)`,
                        borderColor: `hsl(${(ci * 137) % 360}, 80%, 45%)`,
                        opacity: isAnswered && ci !== q.correctIndex ? 0.3 : 1,
                        transform: isAnswered && answers[qi] === ci ? 'scale(1.15)' : 'none',
                        zIndex: isAnswered && answers[qi] === ci ? 10 : 1,
                      }}>
                      {choice}
                    </button>
                  ))}
                </div>
              ) : q.interactiveStyle === 'compare-cards' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* The Visual Group/Number Cards are handled above, this is just for the answers */}
                  </div>
                  <div style={{ display: 'flex', gap: 16, background: 'hsl(var(--yellow-soft) / 0.4)', padding: 16, borderRadius: 20, border: '2px dashed hsl(var(--yellow-mid))' }}>
                    {q.choices.map((choice, ci) => (
                      <button key={ci} onClick={() => handleChoice(qi, ci)}
                        disabled={isAnswered}
                        className="order-pill"
                        style={{
                          width: 70, height: 70, fontSize: '2rem',
                          background: isAnswered && answers[qi] === ci ? 'hsl(var(--yellow-bright))' : 'white',
                          borderColor: isAnswered && answers[qi] === ci ? 'hsl(var(--orange))' : 'hsl(var(--blue-border))',
                          opacity: isAnswered && ci !== q.correctIndex ? 0.4 : 1,
                        }}>
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              ) : q.type === 'match' && q.matchPairs ? (
                <div className="match-grid" style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {q.matchPairs.map((p, i) => {
                      const isSelected = matchSelectedLeft[qi] === p.left;
                      const isMatched = (matchedPairs[qi] || []).includes(p.left);
                      return (
                        <button key={`L-${i}`}
                          className={`match-item ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                          onClick={() => handleMatchSelect(qi, 'left', p.left)}
                          disabled={isMatched || isAnswered}
                        >
                          {p.left} {isMatched && ' ✅'}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {q.matchPairs.map((_, i) => {
                      // Pseudo-shuffle so right side isn't identical directly across from left
                      const displayRight = q.matchPairs![(i + 1) % q.matchPairs!.length].right;
                      const parentLeft = q.matchPairs!.find(x => x.right === displayRight)!.left;
                      const isWrong = wrongMatch[qi] === displayRight;
                      const isMatched = (matchedPairs[qi] || []).includes(parentLeft);

                      return (
                        <button key={`R-${i}`}
                          className={`match-item ${isWrong ? 'wrong' : ''} ${isMatched ? 'matched' : ''}`}
                          onClick={() => handleMatchSelect(qi, 'right', displayRight)}
                          disabled={isMatched || isAnswered}
                        >
                          {displayRight} {isMatched && ' ✅'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                q.choices && q.choices.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 10 }}>
                    {q.choices.map((choice, ci) => (
                      <button key={ci} onClick={() => handleChoice(qi, ci)}
                        className={!isAnswered ? 'choice-btn-idle' : ''}
                        style={{
                          padding: '9px 20px', borderRadius: 99,
                          fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14,
                          transition: 'all 0.15s', ...choiceStyle(qi, ci),
                        }}>
                        {choice}
                        {isAnswered && ci === q.correctIndex ? ' ✅' : ''}
                        {answers[qi] === ci && ci !== q.correctIndex ? ' ❌' : ''}
                      </button>
                    ))}
                  </div>
                )
              )}

              {/* Feedback */}
              {isAnswered && (
                <div className={isCorrect ? 'correct-feedback' : 'wrong-feedback'}>
                  {isCorrect
                    ? `🎉 Correct! ${showFun[qi] && (q as any).funFact ? (q as any).funFact : 'Well done!'}`
                    : `😊 Keep trying! Answer: ${q.type === 'input' || q.type === 'order' ? String(q.correctAnswer).replace(/,/g, ', ') : q.choices[q.correctIndex || 0]}`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default WorksheetSection;
