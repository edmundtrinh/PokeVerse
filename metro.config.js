const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Fast Refresh is enabled
config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    if (!url.endsWith('.bundle')) {
      return url;
    }
    // Ensure localhost URLs work properly with Fast Refresh
    return url.replace(/^https?:\/\/.*?\//, 'http://localhost:8081/');
  },
};

module.exports = config;