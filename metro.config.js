const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix: Supabase and some ESM packages use `import.meta` which Metro Web can't handle.
// Disabling package exports forces Metro to use the CommonJS build instead of ESM.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
