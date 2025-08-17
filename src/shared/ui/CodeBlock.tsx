import { Highlight, themes } from "prism-react-renderer";
import type {
  Language,
  RenderProps,
  Token as PrismToken,
} from "prism-react-renderer";
import { memo, useMemo } from "react";
import { useTheme } from "../../app/providers/useTheme";

export type CodeBlockProps = {
  code: string;
  language?: Language | string;
  className?: string;
};

export const CodeBlock = memo(function CodeBlock({
  code,
  language = "tsx",
  className,
}: CodeBlockProps) {
  const { theme } = useTheme();
  const safeCode = (code ?? "").replace(/\r\n/g, "\n");
  // Удаляем единственный завершающий перевод строки, который часто даёт пустую последнюю строку
  const normalizedCode = safeCode.endsWith("\n")
    ? safeCode.slice(0, -1)
    : safeCode;

  function toPrismLanguage(lang?: Language | string): Language {
    const l = String(lang || "tsx").toLowerCase();
    if (
      l.includes("tsx") ||
      l.includes("jsx") ||
      l === "ts" ||
      l === "js" ||
      l.includes("node")
    )
      return "tsx" as Language;
    if (l === "python" || l === "py") return "python" as Language;
    if (l === "java") return "java" as Language;
    if (l === "c++" || l === "cpp") return "cpp" as Language;
    if (l === "c") return "c" as Language;
    if (l === "go" || l === "golang") return "go" as Language;
    if (l === "kotlin" || l === "kt" || l === "kts")
      return "kotlin" as Language;
    if (l === "ruby" || l === "rb") return "ruby" as Language;
    if (l === "php") return "php" as Language;
    if (l === "swift") return "swift" as Language;
    if (l === "rust" || l === "rs") return "rust" as Language;
    if (l === "json") return "json" as Language;
    if (l === "bash" || l === "sh" || l === "shell") return "bash" as Language;
    if (l === "html") return "markup" as Language;
    if (l === "css" || l === "scss" || l === "less") return "css" as Language;
    return (l as Language) || ("tsx" as Language);
  }

  const prismLanguage = toPrismLanguage(language as Language | string);
  const prismTheme = useMemo(
    () =>
      theme === "dark"
        ? themes.gruvboxMaterialDark
        : themes.gruvboxMaterialLight,
    [theme]
  );

  return (
    <div
      className={
        "rounded border bg-gray-50 dark:bg-neutral-900 " + (className ?? "")
      }>
      <Highlight
        code={normalizedCode}
        language={prismLanguage}
        theme={prismTheme}>
        {({
          className: cls,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }: RenderProps) => (
          <pre
            className={
              cls +
              " m-0 p-3 text-sm font-mono leading-5 overflow-x-auto overflow-y-hidden"
            }
            style={{ ...style, backgroundColor: "transparent" }}>
            {(() => {
              // Убираем полностью пустую последнюю строку, чтобы избежать лишнего вертикального отступа
              const lines = [...tokens];
              if (lines.length > 1) {
                const last = lines[lines.length - 1];
                const isEmptyLast =
                  last.length === 1 && String(last[0]?.content || "") === "";
                if (isEmptyLast) lines.pop();
              }
              return lines.map((line: PrismToken[], i: number) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token: PrismToken, key: number) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ));
            })()}
          </pre>
        )}
      </Highlight>
    </div>
  );
});
