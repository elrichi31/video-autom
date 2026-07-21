/**
 * Small, deliberately conservative pronunciation pass for common terms in
 * this project. It improves clarity without changing the meaning or trying to
 * guess how arbitrary figures should be spoken.
 */
const ACRONYM_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bGPT\b/g, "ge pe te"],
  [/\bIA\b/g, "i a"],
  [/\bAI\b/g, "i a"],
  [/\bFBI\b/g, "efe be i"],
  [/\bCIA\b/g, "ce i a"],
  [/\bUSB-C\b/g, "u ese be ce"],
  [/\bUSB\b/g, "u ese be"],
  [/\bURL\b/g, "u erre ele"],
  [/\bVPN\b/g, "uve pe ene"],
  [/\b2FA\b/g, "doble factor de autenticación"],
  [/\bMFA\b/g, "autenticación multifactor"],
  [/\bCEO\b/g, "ce e o"],
  [/\bCTO\b/g, "ce te o"],
];

export function normalizeTextForTts(text: string): string {
  let normalized = text
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\.{3,}/g, "…")
    .trim();

  for (const [pattern, replacement] of ACRONYM_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}
