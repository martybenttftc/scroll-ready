const { SourceSkips } = require('expo/fingerprint');

// Editing npm scripts doesn't change native code, so it shouldn't
// change the runtime version and cut installed builds off from updates.
/** @type {import('expo/fingerprint').Config} */
module.exports = {
  sourceSkips: SourceSkips.PackageJsonScriptsAll,
};
