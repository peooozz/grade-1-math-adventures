import { useState, useCallback, useMemo } from 'react';
import FloatingEmojis from '@/components/FloatingEmojis';
import TopicSelector from '@/components/TopicSelector';
import WorksheetSection from '@/components/WorksheetSection';
import { topics, type Section } from '@/lib/questionGenerators';
import { useVoice } from '@/hooks/useVoice';

const Index = () => {
  const [selectedTopic, setSelectedTopic] = useState(1);
  const [key, setKey] = useState(0);
  const { voiceEnabled, speak, toggleVoice, stop } = useVoice();

  const topic = topics.find(t => t.id === selectedTopic)!;
  const sections: Section[] = useMemo(() => topic.generate(), [key, selectedTopic]);

  const handleNewWorksheet = useCallback(() => { stop(); setKey(k => k + 1); }, [stop]);
  const handlePrint = useCallback(() => window.print(), []);
  const handleTopicChange = useCallback((id: number) => { stop(); setSelectedTopic(id); setKey(k => k + 1); }, [stop]);

  const today = new Date().toLocaleDateString('en-IN');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#FFFDE7 0%,#E3F2FD 100%)', position: 'relative' }}>
      <FloatingEmojis />

      {/* ── Header ── */}
      <header className="no-print" style={{ textAlign: 'center', paddingTop: 36, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
        {/* Decorative icons */}
        <div style={{ fontSize: 42, marginBottom: 6 }}>📐 ➕ 🔢 ➖ 📏</div>

        <h1 style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 'clamp(28px, 5.5vw, 48px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #1565C0, #FFB300)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 4px',
        }}>
          Grade 1 Math Worksheet
        </h1>

        <p style={{ color: '#1565C0', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 16, margin: 0 }}>
          Interactive Practice — Tap the right answer! 🎯
        </p>

        {/* Sun decoration */}
        <div style={{ fontSize: 36, marginTop: 8 }}>🌞</div>
      </header>

      {/* ── Topic Selector ── */}
      <nav className="no-print" style={{ padding: '0 16px 16px' }}>
        <TopicSelector selectedTopic={selectedTopic} onSelectTopic={handleTopicChange} />
      </nav>

      {/* ── Action Buttons ── */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}>
        <button onClick={handlePrint} className="pill-button">
          🖨️ Print Worksheet
        </button>
        <button
          onClick={handleNewWorksheet}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 22px', borderRadius: 99, fontWeight: 700, fontSize: 14,
            border: '2px solid #90CAF9', background: 'white', color: '#1565C0',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          🔄 New Worksheet
        </button>
        <button
          onClick={toggleVoice}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 22px', borderRadius: 99, fontWeight: 700, fontSize: 14,
            background: voiceEnabled
              ? 'linear-gradient(135deg, #1565C0, #0D47A1)'
              : 'white',
            color: voiceEnabled ? 'white' : '#1565C0',
            border: voiceEnabled ? 'none' : '2px solid #90CAF9',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: voiceEnabled ? '0 4px 14px rgba(21,101,192,0.4)' : 'none',
          }}
        >
          {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
        </button>
      </div>

      {/* ── Worksheet Area ── */}
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '0 16px 48px' }} key={key}>
        {/* Name/Class/Date */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20,
          alignItems: 'flex-end', paddingBottom: 16, paddingLeft: 8,
          borderBottom: '2px dashed #90CAF9',
          fontFamily: "'Nunito', sans-serif",
        }}>
          {[['Name', 140], ['Class', 80]].map(([label, w]) => (
            <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, color: '#1A237E' }}>{label}:</span>
              <span style={{ borderBottom: '2px solid #1A237E', display: 'inline-block', width: Number(w) }}>&nbsp;</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, color: '#1A237E' }}>Date:</span>
            <span style={{ fontWeight: 700, color: '#1565C0' }}>{today}</span>
          </div>
        </div>

        {/* Print-only header */}
        <div className="hidden print-header" style={{ marginBottom: 16 }}>
          <h1 style={{ textAlign: 'center', fontFamily: "'Baloo 2', cursive", fontSize: 24, fontWeight: 900 }}>Grade 1 Math Worksheet</h1>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#555' }}>{topic.emoji} {topic.name}</p>
        </div>

        {/* Topic Label */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 24px', borderRadius: 99,
            background: 'linear-gradient(135deg, #42A5F5, #1565C0)',
            color: 'white', fontFamily: "'Baloo 2', cursive",
            fontSize: 20, fontWeight: 800,
            boxShadow: '0 4px 14px rgba(21,101,192,0.35)',
          }}>
            {topic.emoji} {topic.name}
          </span>
        </div>

        {/* Voice hint */}
        {voiceEnabled && (
          <div className="voice-hint no-print" style={{ marginBottom: 16 }}>
            🔊 Voice is ON — press <strong>🔊</strong> on any question to hear it read aloud!
          </div>
        )}

        {/* Sections */}
        {sections.map((section, i) => (
          <WorksheetSection
            key={`${key}-${i}`}
            section={section}
            index={i}
            voiceEnabled={voiceEnabled}
            onSpeak={speak}
          />
        ))}
      </main>
    </div>
  );
};

export default Index;
