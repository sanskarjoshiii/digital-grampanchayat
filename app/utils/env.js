// Central place to read required server-side environment variables.
// If one is missing, throw a clear, specific error instead of failing
// silently later (e.g. a broken DB connection or an OTP email that never sends).
//
// See .env.example for the full list and MIGRATION_CHECKLIST.md for setup.

/**
 * Return the value of a required env var, or throw a descriptive error.
 * @param {string} name - the environment variable name
 * @param {string} [hint] - short note on where to get the value
 */
export function requireEnv(name, hint = "") {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Add it to your .env.local file` +
        (hint ? ` (${hint})` : "") +
        `. See .env.example for the full list.`
    );
  }
  return value;
}
