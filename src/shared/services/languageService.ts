export const SUPPORTED_LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "Go",
  "Kotlin",
  "Ruby",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const SUPPORTED_LANG_HINT = `Допустимые: ${SUPPORTED_LANGUAGES.join(
  ", "
)}`;

export function normalizeLanguageInput(
  input: string
): SupportedLanguage | undefined {
  const raw = (input || "").trim().toLowerCase();
  if (!raw) return undefined;

  const cleaned = raw.replace(/\s+/g, "");

  const map: Record<string, SupportedLanguage> = {
    javascript: "JavaScript",
    js: "JavaScript",
    node: "JavaScript",
    python: "Python",
    py: "Python",
    java: "Java",
    c: "C",
    "c++": "C++",
    cpp: "C++",
    "c#": "C#",
    csharp: "C#",
    "c-sharp": "C#",
    golang: "Go",
    go: "Go",
    kotlin: "Kotlin",
    kt: "Kotlin",
    ruby: "Ruby",
    rb: "Ruby",
  };

  if (map[raw]) return map[raw];
  if (map[cleaned]) return map[cleaned];

  return undefined;
}
