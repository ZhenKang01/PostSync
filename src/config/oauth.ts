export interface OAuthPlatform {
  name: string;
  icon: string;
  color: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientId: string;
  redirectUri: string;
}

const baseRedirectUri = `${window.location.origin}/oauth/callback`;

export const oauthConfig: Record<string, OAuthPlatform> = {
  X: {
    name: 'X',
    icon: '/image.png',
    color: 'bg-black',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'users.read', 'offline.access'],
    clientId: import.meta.env.VITE_X_CLIENT_ID || '',
    redirectUri: `${baseRedirectUri}/x`,
  },
  LinkedIn: {
    name: 'LinkedIn',
    icon: '/linkedin-logo.svg',
    color: 'bg-blue-600',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['r_liteprofile', 'r_emailaddress'],
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
    redirectUri: `${baseRedirectUri}/linkedin`,
  },
  Facebook: {
    name: 'Facebook',
    icon: '/facebook-logo.svg',
    color: 'bg-blue-500',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['public_profile', 'email'],
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
    redirectUri: `${baseRedirectUri}/facebook`,
  },
  Instagram: {
    name: 'Instagram',
    icon: '/instagram-logo.png',
    color: 'bg-white',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scopes: ['user_profile', 'user_media'],
    clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '',
    redirectUri: `${baseRedirectUri}/instagram`,
  },
  YouTube: {
    name: 'YouTube',
    icon: 'https://cdn.simpleicons.org/youtube/FF0000',
    color: 'bg-white',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/userinfo.profile'],
    clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID || '',
    redirectUri: `${baseRedirectUri}/youtube`,
  },
  TikTok: {
    name: 'TikTok',
    icon: 'https://cdn.simpleicons.org/tiktok/000000',
    color: 'bg-white',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token',
    scopes: ['user.info.basic'],
    clientId: import.meta.env.VITE_TIKTOK_CLIENT_KEY || '',
    redirectUri: `${baseRedirectUri}/tiktok`,
  },
};

export function generateOAuthUrl(platform: string, state: string): string {
  const config = oauthConfig[platform];
  if (!config) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state: state,
  });

  if (platform === 'X') {
    params.append('code_challenge', 'challenge');
    params.append('code_challenge_method', 'plain');
  }

  if (platform === 'YouTube') {
    params.append('access_type', 'offline');
    params.append('prompt', 'consent');
  }

  return `${config.authUrl}?${params.toString()}`;
}
