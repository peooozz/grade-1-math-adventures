import { useState, useRef, useEffect } from 'react';
import { topics } from '@/lib/questionGenerators';
import { ChevronDown } from 'lucide-react';

interface TopicSelectorProps {
  selectedTopic: number;
  onSelectTopic: (id: number) => void;
}

const TopicSelector = ({ selectedTopic, onSelectTopic }: TopicSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = topics.find(t => t.id === selectedTopic)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex justify-center" ref={ref}>
      <div className="relative w-full max-w-xs">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between gap-2 px-5 py-3 rounded-2xl font-heading text-base font-bold transition-all duration-200 border-2"
          style={{
            background: 'hsl(var(--card))',
            borderColor: 'hsl(var(--pink-border))',
            color: 'hsl(var(--foreground))',
          }}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">{current.emoji}</span>
            {current.name}
          </span>
          <ChevronDown
            className="transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            size={20}
          />
        </button>

        {open && (
          <div
            className="absolute z-50 mt-2 w-full rounded-2xl py-2 shadow-xl border-2 overflow-hidden"
            style={{
              background: 'hsl(var(--card))',
              borderColor: 'hsl(var(--pink-border))',
              animation: 'worksheetFadeIn 0.2s ease-out',
            }}
          >
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  onSelectTopic(topic.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-left font-body font-semibold text-sm transition-all duration-150 hover:scale-[1.02]"
                style={{
                  background: selectedTopic === topic.id ? 'hsl(var(--purple-light))' : 'transparent',
                  color: 'hsl(var(--foreground))',
                }}
                onMouseEnter={(e) => {
                  if (selectedTopic !== topic.id) e.currentTarget.style.background = 'hsl(var(--pink-soft) / 0.5)';
                }}
                onMouseLeave={(e) => {
                  if (selectedTopic !== topic.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-lg">{topic.emoji}</span>
                {topic.name}
                {selectedTopic === topic.id && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicSelector;
