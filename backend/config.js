module.exports = {
  // Backend Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,

  // Asterisk Connection (you'll update these when you start Asterisk manually)
  ASTERISK_HOST: process.env.ASTERISK_HOST || 'localhost',
  ASTERISK_PORT: process.env.ASTERISK_PORT || 5060,
  ASTERISK_USERNAME: process.env.ASTERISK_USERNAME || '1001',
  ASTERISK_SECRET: process.env.ASTERISK_SECRET || '',

  // Smartflo API Configuration
  SMARTFLO_API_URL: process.env.SMARTFLO_API_URL || 'https://api-smartflo.tatateleservices.com/v1',
  SMARTFLO_API_TOKEN: process.env.SMARTFLO_API_TOKEN || '',
  SMARTFLO_AGENT_NUMBER: process.env.SMARTFLO_AGENT_NUMBER || '',
  SMARTFLO_CALLER_ID: process.env.SMARTFLO_CALLER_ID || '',

  // Frontend URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // CORS Settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
