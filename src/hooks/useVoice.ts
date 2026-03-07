import { useState, useCallback, useRef, useEffect } from 'react';

export function useVoice() {
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Pick a good voice for children when available
    const getBestVoice = (): SpeechSynthesisVoice | null => {
        if (!window.speechSynthesis) return null;
        const voices = window.speechSynthesis.getVoices();
        // Prefer US English female voices which tend to be clearest for kids
        return (
            voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('samantha')) ||
            voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('zira')) ||
            voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('hazel')) ||
            voices.find(v => v.lang === 'en-US') ||
            voices.find(v => v.lang.startsWith('en')) ||
            null
        );
    };

    const stop = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        stop();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.85;   // slightly slower — easier for young children
        utter.pitch = 1.1;   // slightly higher — friendly tone
        utter.volume = 1;
        const voice = getBestVoice();
        if (voice) utter.voice = voice;
        utteranceRef.current = utter;
        window.speechSynthesis.speak(utter);
    }, [voiceEnabled, stop]);

    const toggleVoice = useCallback(() => {
        setVoiceEnabled(prev => {
            if (prev) stop(); // stop any ongoing speech when turning off
            return !prev;
        });
    }, [stop]);

    // Load voices asynchronously (Firefox / some browsers need this event)
    useEffect(() => {
        window.speechSynthesis?.getVoices(); // trigger load
        const handler = () => window.speechSynthesis?.getVoices();
        window.speechSynthesis?.addEventListener('voiceschanged', handler);
        return () => window.speechSynthesis?.removeEventListener('voiceschanged', handler);
    }, []);

    return { voiceEnabled, speak, toggleVoice, stop };
}
