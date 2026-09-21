import React from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, HeartHandshake, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';
import { maskPhoneNumber } from '../../lib/utils';
import { ThreeDParticleBackground } from './ThreeDParticleBackground';

export const EmergencyModal: React.FC = () => {
  const { isSosOpen, setSosOpen, settings, narrate, activePatient } = useApp();
  const lang = settings.language;

  if (!isSosOpen) return null;

  const caregiverPhone = activePatient?.emergencyContactPhone || '+91 98640 67890';
  const ashaPhone = '+91 94350 12345';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1d]/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#181635]/95 via-[#0e1628]/95 to-[#0a101f]/95 border border-rose-500/40 rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-rose-950/60 text-white overflow-hidden animate-in zoom-in-95 duration-200 backdrop-blur-2xl">
        {/* Dynamic Emergency 3D Particles */}
        <ThreeDParticleBackground variant="modal" particleCount={40} colorTheme="emergency-rose" />

        {/* Glow ambient spots */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setSosOpen(false)}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-sky-200 hover:text-white cursor-pointer transition-all active:scale-95"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header with SOS Badge */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-13 h-13 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse">
            <ShieldAlert size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'hi'
                  ? 'आपातकालीन सहायता (SOS)'
                  : 'Emergency Help & Contacts'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-400/40">
                24/7 LIVE
              </span>
            </div>
            <p className="text-xs text-sky-200/70 font-medium mt-0.5">
              {lang === 'hi'
                ? 'तुरंत संपर्क करने के लिए नीचे दिए गए किसी भी नंबर पर टैप करें।'
                : 'Tap any contact below to connect immediately.'}
            </p>
          </div>
        </div>

        {/* Action Contacts - Frosted Dark Cards */}
        <div className="space-y-3 my-5">
          {/* Primary Caregiver */}
          <a
            href={`tel:${caregiverPhone}`}
            className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-purple-500/30 hover:border-purple-400/60 backdrop-blur-md transition-all shadow-lg hover:shadow-purple-600/20 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 border border-purple-400/30 text-[#c084fc] flex items-center justify-center shrink-0 transition-colors shadow-xs">
                <HeartHandshake size={24} />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-white group-hover:text-purple-200 transition-colors">
                  {activePatient?.emergencyContactName ||
                    (lang === 'hi'
                      ? 'बेटी प्रियंका (मुख्य देखभालकर्ता)'
                      : 'Primary Caregiver')}
                </p>
                <p className="text-xs font-mono font-bold text-[#c084fc] mt-0.5">
                  {maskPhoneNumber(caregiverPhone)} • Jorhat
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 group-hover:bg-purple-600 border border-purple-400/40 flex items-center justify-center text-white transition-all shadow-md">
              <PhoneCall size={18} />
            </div>
          </a>

          {/* ASHA Health Worker */}
          <a
            href={`tel:${ashaPhone}`}
            className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-md transition-all shadow-lg hover:shadow-cyan-600/20 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0 transition-colors shadow-xs">
                <PhoneCall size={22} />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors">
                  {lang === 'hi'
                    ? 'मिनती दास (आशा स्वास्थ्य कार्यकर्ता)'
                    : 'Minoti Das (ASHA Worker)'}
                </p>
                <p className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                  {maskPhoneNumber(ashaPhone)} • Titabor Block
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 group-hover:bg-cyan-600 border border-cyan-400/40 flex items-center justify-center text-white transition-all shadow-md">
              <PhoneCall size={18} />
            </div>
          </a>

          {/* 108 Emergency Ambulance */}
          <a
            href="tel:108"
            className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-red-900/30 hover:from-rose-950/60 hover:to-red-900/50 border border-rose-500/40 hover:border-rose-400/70 backdrop-blur-md transition-all shadow-lg hover:shadow-rose-600/30 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-500/30 group-hover:bg-rose-500/40 border border-rose-400/50 text-rose-300 flex items-center justify-center shrink-0 transition-colors shadow-xs animate-bounce">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-white group-hover:text-rose-200 transition-colors">
                  {lang === 'hi'
                    ? '108 आपातकालीन एम्बुलेंस सेवा'
                    : '108 Emergency Medical Ambulance'}
                </p>
                <p className="text-xs text-rose-300/80 font-medium mt-0.5">
                  Toll-Free 24/7 National Health Mission Helpline
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-600 group-hover:bg-rose-500 border border-rose-400/50 flex items-center justify-center text-white transition-all shadow-lg shadow-rose-600/40">
              <PhoneCall size={18} />
            </div>
          </a>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-2">
          <button
            onClick={() =>
              narrate(
                lang === 'hi'
                  ? 'आपातकालीन सहायता: परिवार के देखभालकर्ता, आशा कार्यकर्ता मिनती दास या 108 एम्बुलेंस सेवा पर कॉल करें।'
                  : 'Emergency Help: You can call your primary caregiver, ASHA worker Minoti Das, or 108 Emergency Ambulance.'
              )
            }
            className="flex items-center gap-1.5 text-xs font-bold text-sky-200 hover:text-[#c084fc] cursor-pointer transition-colors"
          >
            <Volume2 size={14} className="text-[#c084fc]" />
            <span>{getTranslation('actionListen', lang)}</span>
          </button>
          <button
            onClick={() => setSosOpen(false)}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 cursor-pointer transition-all active:scale-95"
          >
            {getTranslation('actionCancel', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
