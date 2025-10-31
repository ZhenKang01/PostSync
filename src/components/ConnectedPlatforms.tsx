import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { oauthConfig, generateOAuthUrl } from '../config/oauth';
import {
  getConnectedAccounts,
  disconnectAccount,
  type ConnectedAccount,
} from '../services/connectedAccounts';

interface PlatformStatus {
  platform: string;
  connected: boolean;
  loading: boolean;
  account?: ConnectedAccount;
}

export function ConnectedPlatforms() {
  const [platforms, setPlatforms] = useState<PlatformStatus[]>([
    { platform: 'X', connected: false, loading: false },
    { platform: 'LinkedIn', connected: false, loading: false },
    { platform: 'Facebook', connected: false, loading: false },
    { platform: 'Instagram', connected: false, loading: false },
    { platform: 'YouTube', connected: false, loading: false },
    { platform: 'TikTok', connected: false, loading: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      setIsLoading(true);
      const accounts = await getConnectedAccounts();

      setPlatforms(prevPlatforms =>
        prevPlatforms.map(p => {
          const account = accounts.find(a => a.platform === p.platform);
          return {
            ...p,
            connected: !!account,
            account,
          };
        })
      );
    } catch (err) {
      console.error('Error loading connected accounts:', err);
      setError('Failed to load connected accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platformName: string) => {
    try {
      const config = oauthConfig[platformName];

      // Check if client ID is configured
      if (!config.clientId || config.clientId.includes('your_') || config.clientId.includes('_here')) {
        setError(`${platformName} OAuth credentials not configured. Please add ${platformName === 'YouTube' ? 'VITE_YOUTUBE_CLIENT_ID' : `VITE_${platformName.toUpperCase()}_CLIENT_ID`} to your .env file.`);
        return;
      }

      console.log(`Initiating OAuth for ${platformName}`);
      console.log(`Redirect URI: ${config.redirectUri}`);

      setPlatforms(prev =>
        prev.map(p =>
          p.platform === platformName ? { ...p, loading: true } : p
        )
      );

      const state = btoa(JSON.stringify({
        platform: platformName,
        timestamp: Date.now(),
        returnUrl: window.location.pathname,
      }));

      localStorage.setItem('oauth_state', state);

      const authUrl = generateOAuthUrl(platformName, state);
      console.log('OAuth URL:', authUrl);

      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating OAuth:', err);
      setError(`Failed to connect to ${platformName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setPlatforms(prev =>
        prev.map(p =>
          p.platform === platformName ? { ...p, loading: false } : p
        )
      );
    }
  };

  const handleDisconnect = async (platformName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platformName}?`)) {
      return;
    }

    try {
      setPlatforms(prev =>
        prev.map(p =>
          p.platform === platformName ? { ...p, loading: true } : p
        )
      );

      await disconnectAccount(platformName);

      setPlatforms(prev =>
        prev.map(p =>
          p.platform === platformName
            ? { ...p, connected: false, loading: false, account: undefined }
            : p
        )
      );
    } catch (err) {
      console.error('Error disconnecting account:', err);
      setError(`Failed to disconnect ${platformName}`);
      setPlatforms(prev =>
        prev.map(p =>
          p.platform === platformName ? { ...p, loading: false } : p
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const config = oauthConfig[platform.platform];
          if (!config) return null;

          return (
            <div
              key={platform.platform}
              className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 transition-all hover:border-gray-300 dark:hover:border-gray-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden ${config.color}`}
                >
                  <img
                    src={config.icon}
                    alt={config.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {config.name}
                  </h3>
                  {platform.connected && platform.account && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{platform.account.platform_username}
                    </p>
                  )}
                </div>
              </div>

              {platform.loading ? (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </button>
              ) : platform.connected ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Connected
                  </div>
                  <button
                    onClick={() => handleDisconnect(platform.platform)}
                    className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform.platform)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Setup Required
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
          To enable OAuth connections, you need to configure your OAuth credentials in the environment variables:
        </p>
        <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 font-mono">
          <li>• VITE_X_CLIENT_ID</li>
          <li>• VITE_LINKEDIN_CLIENT_ID</li>
          <li>• VITE_FACEBOOK_APP_ID</li>
          <li>• VITE_INSTAGRAM_CLIENT_ID</li>
          <li>• VITE_YOUTUBE_CLIENT_ID</li>
          <li>• VITE_TIKTOK_CLIENT_KEY</li>
        </ul>
      </div>
    </div>
  );
}
