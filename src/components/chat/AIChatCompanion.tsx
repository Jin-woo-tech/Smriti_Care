import React, { useState } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { getSathiAIResponse } from '../../lib/aiClient';
import { VoiceNarratorButton } from '../common/VoiceNarratorButton';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIChatCompanion: React.FC = () => {
  const { settings, narrate } = useApp();
  const lang = settings.language;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: getTranslation('chatGreeting', lang),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const quickPrompts = [
    { en: getTranslation('chatPrompt1', 'en'), hi: getTranslation('chatPrompt1', 'hi') },
    { en: getTranslation('chatPrompt2', 'en'), hi: getTranslation('chatPrompt2', 'hi') },
    { en: getTranslation('chatPrompt3', 'en'), hi: getTranslation('chatPrompt3', 'hi') },
    { en: getTranslation('chatPrompt4', 'en'), hi: getTranslation('chatPrompt4', 'hi') },
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await getSathiAIResponse(textToSend, lang, settings.apiKey);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      // If voice enabled, read back response
      if (settings.voiceAssistanceEnabled) {
        narrate(responseText);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 text-white">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-white/14 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-[#c084fc] shadow-lg shadow-purple-600/25">
            <Heart size={28} className="text-[#c084fc]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {lang === 'hi' ? 'स्मृति साथी (AI Companion)' : 'Smriti Sathi (AI Care Companion)'}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                Bilingual (EN / HI)
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.35)] flex items-center gap-1">
                <Sparkles size={11} className="text-[#c084fc]" />
                AI Proxy Powered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-200/80 font-medium mt-1">
              {lang === 'hi'
                ? 'दवा, दिनचर्या और यादों के लिए आपका संवेदनशील AI संवादी साथी।'
                : 'Empathetic voice-enabled conversational support for daily guidance.'}
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <VoiceNarratorButton
            textToRead={
              lang === 'hi'
                ? 'नमस्ते! मैं स्मृति साथी हूँ। किसी भी सुझाव प्रश्न पर टैप करें या सीधे लिखें।'
                : 'Namaskar! I am Smriti Sathi. Tap any suggested question or write to me directly.'
            }
            size="md"
            label={getTranslation('actionListen', lang)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg font-bold"
          />
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(lang === 'hi' ? (p.hi || p.en) : p.en)}
            className="text-xs font-semibold px-4 py-2.5 rounded-2xl glass-card-dark border border-white/12 hover:border-purple-400 hover:bg-white/15 text-sky-100 whitespace-nowrap cursor-pointer transition-all shadow-md backdrop-blur-md"
          >
            💬 {lang === 'hi' ? (p.hi || p.en) : p.en}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="glass-card-dark rounded-3xl border border-white/12 shadow-2xl p-4 sm:p-6 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4 flex flex-col justify-between backdrop-blur-md">
        <div className="space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 text-[#c084fc] flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={20} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 space-y-1.5 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white rounded-tr-xs border border-purple-400/30'
                      : 'bg-white/10 text-white rounded-tl-xs border border-white/15 backdrop-blur-md'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>

                  <div className="flex items-center justify-between gap-3 pt-1 text-[11px] text-sky-200/70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <VoiceNarratorButton
                        textToRead={msg.text}
                        size="sm"
                        label=""
                        className="bg-white/10 hover:bg-white/20 p-1 border border-white/15 shadow-xs text-white"
                      />
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 flex items-center justify-center shrink-0">
                    <User size={20} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-300 font-semibold p-2">
              <Sparkles size={14} className="animate-spin text-[#c084fc]" />
              <span>Smriti Sathi is thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="glass-card-dark p-3 rounded-2xl border border-white/15 shadow-xl flex items-center gap-2 backdrop-blur-md">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
          placeholder={
            lang === 'hi'
              ? 'यहाँ लिखें या पूछें...'
              : 'Ask Smriti Sathi about your routine, medicines, or memories...'
          }
          className="flex-1 px-4 py-3 bg-transparent text-sm sm:text-base focus:outline-none text-white placeholder:text-sky-200/50"
        />

        <button
          onClick={() => handleSend(inputValue)}
          disabled={!inputValue.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] hover:from-[#9333ea] hover:to-[#7c3aed] text-white font-bold cursor-pointer transition-all disabled:opacity-40 shadow-lg shadow-purple-600/30 border border-purple-400/30"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
