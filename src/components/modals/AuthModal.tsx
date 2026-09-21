import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck, Heart, Stethoscope, Users, MapPin, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import { Role } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, register, settings } = useApp();
  const lang = settings.language;

  // Form State
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fields
  const [role, setRole] = useState<Role>('patient');
  const [fullName, setFullName] = useState<string>('');
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('Guwahati, Assam');
  const [age, setAge] = useState<string>('72');
  const [condition, setCondition] = useState<string>('Mild Cognitive Impairment');
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await login(usernameOrEmail, password);
      setAuthModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await register({
        username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
        password,
        role,
        fullName,
        phone,
        address,
        age: parseInt(age, 10) || 70,
        condition,
        emergencyContactName,
        emergencyContactPhone,
        preferredLanguage: lang,
      });
      setAuthModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setErrorMessage('');
    setUsernameOrEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {authModalMode === 'login'
                  ? (lang === 'hi' ? 'स्मृति केयर में लॉगिन करें' : 'Sign in to SmritiCare')
                  : (lang === 'hi' ? 'नया खाता बनाएं' : 'Create an Account')}
              </h2>
              <p className="text-xs text-purple-200">
                {lang === 'hi' ? 'सुरक्षित एवं देखभाल आधारित मंच' : 'Secure, personalized cognitive wellness portal'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1">
          <button
            onClick={() => { setAuthModalMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
              authModalMode === 'login'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'hi' ? 'लॉगिन' : 'Sign In'}
          </button>
          <button
            onClick={() => { setAuthModalMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
              authModalMode === 'register'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'hi' ? 'रजिस्टर (नया मरीज / देखभालकर्ता)' : 'Register Account'}
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-700 dark:text-rose-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Forms */}
        <div className="p-6">
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'hi' ? 'यूज़रनेम या ईमेल' : 'Username or Email'}
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={e => setUsernameOrEmail(e.target.value)}
                    placeholder="e.g. bipin.elder or doctor.anand@aiims.in"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{lang === 'hi' ? 'साइन इन करें' : 'Sign In'}</span>
                  )}
                </button>
              </div>

              {/* Demo Hint */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900 text-[11px] text-purple-700 dark:text-purple-300 text-center">
                <strong>Demo Accounts:</strong> bipin.elder / bipin123 (Patient) • priya.care / priya123 (Caregiver) • dr.anand / doctor123 (Clinician) • runu.asha / asha123 (ASHA)
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {lang === 'hi' ? 'अपनी भूमिका चुनें' : 'Select Your Role'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'patient', label: lang === 'hi' ? 'मरीज / वरिष्ठ' : 'Patient / Elder', icon: Heart },
                    { id: 'caregiver', label: lang === 'hi' ? 'परिवार / देखभालकर्ता' : 'Family Caregiver', icon: Users },
                    { id: 'clinician', label: lang === 'hi' ? 'न्यूरोलॉजिस्ट / डॉक्टर' : 'Clinician / Doctor', icon: Stethoscope },
                    { id: 'asha', label: lang === 'hi' ? 'आशा / स्वास्थ्य कार्यकर्ता' : 'ASHA / Health Worker', icon: ShieldCheck },
                  ].map(r => {
                    const Icon = r.icon;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id as Role)}
                        className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                          role === r.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {step === 1 ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Bipin Gogoi"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'यूज़रनेम या ईमेल' : 'Username / Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={e => setUsernameOrEmail(e.target.value)}
                      placeholder="e.g. bipin.elder"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'पासवर्ड' : 'Password'}
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName || !usernameOrEmail || !password) {
                        setErrorMessage('Please fill in name, username, and password.');
                        return;
                      }
                      setErrorMessage('');
                      setStep(2);
                    }}
                    className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all mt-2"
                  >
                    <span>{lang === 'hi' ? 'आगे बढ़ें (स्वास्थ्य विवरण)' : 'Next Step (Health Details)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'hi' ? 'उम्र' : 'Age'}
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'hi' ? 'फोन नंबर' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'वर्तमान स्थिति / डायग्नोसिस' : 'Condition / Clinical Notes'}
                    </label>
                    <input
                      type="text"
                      value={condition}
                      onChange={e => setCondition(e.target.value)}
                      placeholder="e.g. Mild Cognitive Impairment, Early Dementia"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'hi' ? 'आपातकालीन संपर्क नाम' : 'Emergency Contact'}
                      </label>
                      <input
                        type="text"
                        value={emergencyContactName}
                        onChange={e => setEmergencyContactName(e.target.value)}
                        placeholder="Priya Gogoi"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'hi' ? 'आपातकालीन फोन' : 'Emergency Phone'}
                      </label>
                      <input
                        type="tel"
                        value={emergencyContactPhone}
                        onChange={e => setEmergencyContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                    >
                      {lang === 'hi' ? 'पीछे' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all text-sm"
                    >
                      {isLoading ? (
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>{lang === 'hi' ? 'पंजीकरण पूरा करें' : 'Complete Registration'}</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
