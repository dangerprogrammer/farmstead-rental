import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'farmstead-rental',
  webDir: 'www',
  server: {
    cleartext: !0,
    allowNavigation: ['*']
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '51626388269-kebham1in7anp70f0m2miomts3rf8ja4.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
