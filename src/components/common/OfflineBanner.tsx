import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../lib/i18n';

export const OfflineBanner: React.FC = () => {
  const { settings, syncQueue, triggerSync, isSyncing, toggleSimulatedOffline } = useApp();
  const lang = settings.language;

  if (!settings.isSimulatedOffline && syncQueue.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 text-sm font-semibold flex flex-wrap items-center justify-between gap-3 shadow-md z-40 border-b border-amber-600">
      <div className="flex items-center gap-2">
        <WifiOff size={18} className="animate-pulse text-amber-900" />
        <span>
          {settings.isSimulatedOffline
            ? getTranslation('offlineStatus', lang)
            : 'Reconnected to Network'}
        </span>
        <span className="bg-amber-700/20 text-amber-950 px-2 py-0.5 rounded-full text-xs font-bold">
          {syncQueue.length} {getTranslation('syncPendingCount', lang)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {syncQueue.length > 0 && (
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-amber-900 hover:bg-amber-950 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : getTranslation('actionSyncNow', lang)}
          </button>
        )}

        {settings.isSimulatedOffline && (
          <button
            onClick={toggleSimulatedOffline}
            className="text-xs bg-amber-100 hover:bg-white text-amber-900 px-2.5 py-1 rounded-lg font-bold border border-amber-300 transition-colors"
          >
            Go Online
          </button>
        )}
      </div>
    </div>
  );
};
