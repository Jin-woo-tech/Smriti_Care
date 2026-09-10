import React from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';

export const EmergencyModal: React.FC = () => {
  const { isSosOpen, setSosOpen, settings, narrate } = useApp();
  const lang = settings.language;

  if (!isSosOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-red-500 text-slate-900 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={() => setSosOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <ShieldAlert size={36} className="animate-bounce" />
          <div>
            <h2 className="text-2xl font-bold">
              {lang === 'as'
                ? 'জৰুৰীকালীন সহায় (SOS)'
                : lang === 'hi'
                ? 'आपातकालीन सहायता (SOS)'
                : 'Emergency Help & Contacts'}
            </h2>
            <p className="text-sm text-slate-600">
              {lang === 'as'
                ? 'তলৰ যিকোনো এটা নম্বৰত স্পৰ্শ কৰি তৎক্ষণাৎ যোগাযোগ কৰক'
                : lang === 'hi'
                ? 'तुरंत संपर्क करने के लिए नीचे दिए गए किसी भी नंबर पर टैप करें।'
                : 'Tap any contact below to connect immediately.'}
            </p>
          </div>
        </div>

        {/* Action Contacts */}
        <div className="space-y-3.5 my-6">
          {/* Primary Caregiver */}
          <a
            href="tel:+919864067890"
            className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 border-2 border-teal-500 hover:bg-teal-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-700 text-white rounded-xl">
                <HeartHandshake size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-teal-950">
                  {lang === 'as'
                    ? 'জীয়াৰী প্ৰিয়ংকা (প্ৰাথমিক যত্নকৰ্তা)'
                    : lang === 'hi'
                    ? 'बेटी प्रियंका (मुख्य देखभालकर्ता)'
                    : 'Daughter Priyanka (Caregiver)'}
                </p>
                <p className="text-sm text-teal-800">+91 98640 67890 • Jorhat</p>
              </div>
            </div>
            <PhoneCall size={28} className="text-teal-700" />
          </a>

          {/* ASHA Health Worker */}
          <a
            href="tel:+919435012345"
            className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 border-2 border-sky-500 hover:bg-sky-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-600 text-white rounded-xl">
                <PhoneCall size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-sky-950">
                  {lang === 'as'
                    ? 'মিনতি দাস (আশা স্বাস্থ্য কৰ্মী)'
                    : lang === 'hi'
                    ? 'मिनती दास (आशा स्वास्थ्य कार्यकर्ता)'
                    : 'Minoti Das (ASHA Health Worker)'}
                </p>
                <p className="text-sm text-sky-800">+91 94350 12345 • Titabor Block</p>
              </div>
            </div>
            <PhoneCall size={28} className="text-sky-600" />
          </a>

          {/* 108 Assam Emergency Ambulance */}
          <a
            href="tel:108"
            className="flex items-center justify-between p-4 rounded-2xl bg-red-50 border-2 border-red-600 hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 text-white rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-red-950">
                  {lang === 'as'
                    ? '১০৮ জৰুৰী এম্বুলেন্স সেৱা (অসম)'
                    : lang === 'hi'
                    ? '108 आपातकालीन एम्बुलेंस सेवा'
                    : '108 Emergency Medical Ambulance'}
                </p>
                <p className="text-sm text-red-800">Toll-Free 24/7 Government Helpline</p>
              </div>
            </div>
            <PhoneCall size={28} className="text-red-600" />
          </a>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() =>
              narrate(
                lang === 'as'
                  ? 'জৰুৰীকালীন সহায়: জীয়াৰী প্ৰিয়ংকা, আশা কৰ্মী মিনতি দাস, বা ১০৮ এম্বুলেন্স সেৱাত ফোন কৰক।'
                  : lang === 'hi'
                  ? 'आपातकालीन सहायता: बेटी प्रियंका, आशा कार्यकर्ता मिनती दास या 108 एम्बुलेंस सेवा पर कॉल करें।'
                  : 'Emergency Help: You can call your daughter Priyanka, ASHA worker Minoti Das, or 108 Emergency Ambulance.'
              )
            }
            className="text-sm font-semibold text-teal-700 hover:underline cursor-pointer"
          >
            {getTranslation('actionListen', lang)}
          </button>
          <button
            onClick={() => setSosOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 cursor-pointer"
          >
            {getTranslation('actionCancel', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
