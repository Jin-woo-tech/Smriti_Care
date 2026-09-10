import React, { useState } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  Mic,
  Image as ImageIcon,
  Heart,
  ShieldAlert
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
    { en: getTranslation('chatPrompt1', 'en'), as: getTranslation('chatPrompt1', 'as') },
    { en: getTranslation('chatPrompt2', 'en'), as: getTranslation('chatPrompt2', 'as') },
    { en: getTranslation('chatPrompt3', 'en'), as: getTranslation('chatPrompt3', 'as') },
    { en: getTranslation('chatPrompt4', 'en'), as: getTranslation('chatPrompt4', 'as') },
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
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-700/80 border border-teal-500/50 flex items-center justify-center text-teal-200">
            <Heart size={26} className="text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">
                {lang === 'as' ? 'স্মৃতি সাথী (AI Companion)' : 'Smriti Sathi (AI Care Companion)'}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-700/80 text-teal-200">
                Bilingual
              </span>
            </div>
            <p className="text-xs text-teal-100/80">
              {lang === 'as'
                ? 'ঔষধ, স্মৃতি আৰু দৈনন্দিন কথা-বতৰাৰ বাবে আপোনাৰ সদা সজাগ সংগী।'
                : 'Empathetic voice-enabled conversational support for daily guidance.'}
            </p>
          </div>
        </div>

        <VoiceNarratorButton
          textToRead={
            lang === 'as'
              ? 'নমস্কাৰ! মই আপোনাৰ স্মৃতি সাথী। আপোনাৰ কিবা সুধিবলগীয়া থাকিলে তলৰ বুটামত টিপক।'
              : 'Namaskar! I am Smriti Sathi. Tap any suggested question or speak to me directly.'
          }
          size="md"
          className="bg-white text-teal-950 border-0 shadow-md font-bold"
        />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(lang === 'as' ? p.as : p.en)}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-white border border-sky-200 hover:border-teal-500 hover:bg-teal-50 text-slate-800 whitespace-nowrap cursor-pointer transition-all shadow-xs"
          >
            💬 {lang === 'as' ? p.as : p.en}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm shadow-sky-900/5 p-4 sm:p-6 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Bot size={20} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 space-y-1.5 shadow-xs ${
                    isUser
                      ? 'bg-teal-700 text-white rounded-tr-xs'
                      : 'bg-sky-50 text-slate-900 rounded-tl-xs border border-sky-200'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>

                  <div className="flex items-center justify-between gap-3 pt-1 text-[11px] opacity-75">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <VoiceNarratorButton
                        textToRead={msg.text}
                        size="sm"
                        className="bg-white p-1 border-0 shadow-xs"
                      />
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <User size={20} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold p-2">
              <Sparkles size={14} className="animate-spin text-teal-600" />
              <span>Smriti Sathi is thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white p-3 rounded-2xl border border-sky-200 shadow-md shadow-sky-900/5 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
          placeholder={
            lang === 'as'
              ? 'ইয়াত লিখক বা সুধক...'
              : 'Ask Smriti Sathi about your routine, medicines, or memories...'
          }
          className="flex-1 px-4 py-3 bg-transparent text-sm sm:text-base focus:outline-none text-slate-900 placeholder:text-slate-400"
        />

        <button
          onClick={() => handleSend(inputValue)}
          disabled={!inputValue.trim()}
          className="p-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer transition-colors disabled:opacity-40 shadow-xs"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
