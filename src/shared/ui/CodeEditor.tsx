import React, { memo } from "react";
import { Highlight, themes } from "prism-react-renderer";
import type {
  Language,
  RenderProps,
  Token as PrismToken,
} from "prism-react-renderer";

import { useTheme } from "@/app/providers/useTheme";

type Props = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  height?: number | string;
  className?: string;
};

function toPrismLanguage(lang?: string): Language {
  const l = (lang || "").toLowerCase();
  if (
    l.includes("tsx") ||
    l.includes("jsx") ||
    l.includes("ts") ||
    l.includes("js") ||
    l.includes("node")
  )
    return "tsx" as Language;
  if (l === "python" || l === "py") return "python" as Language;
  if (l === "java") return "java" as Language;
  if (l === "c++" || l === "cpp") return "cpp" as Language;
  if (l === "c") return "c" as Language;
  if (l === "go" || l === "golang") return "go" as Language;
  if (l === "kotlin" || l === "kt" || l === "kts") return "kotlin" as Language;
  if (l === "ruby" || l === "rb") return "ruby" as Language;
  if (l === "php") return "php" as Language;
  if (l === "swift") return "swift" as Language;
  if (l === "rust" || l === "rs") return "rust" as Language;
  if (l === "json") return "json" as Language;
  if (l === "bash" || l === "sh" || l === "shell") return "bash" as Language;
  if (l === "html") return "markup" as Language;
  if (l === "css" || l === "scss" || l === "less") return "css" as Language;
  return "tsx" as Language;
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  height = 240,
  className,
}: Props) {
  const { theme } = useTheme();
  const prismTheme = React.useMemo(
    () =>
      theme === "dark"
        ? themes.gruvboxMaterialDark
        : themes.gruvboxMaterialLight,
    [theme]
  );

  const lang = toPrismLanguage(language);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  const onScrollSync = () => {
    const ta = taRef.current;
    const overlay = overlayRef.current;
    if (ta && overlay) {
      overlay.scrollTop = ta.scrollTop;
      overlay.scrollLeft = ta.scrollLeft;
    }
  };

  return (
    <div
      ref={containerRef}
      className={"relative border rounded " + (className || "")}
      style={{ height }}>
      {/* Highlighted layer (behind), scroll-synced */}
      <div ref={overlayRef} className="absolute inset-0 overflow-auto rounded">
        <Highlight
          code={(value ?? "").replace(/\r\n/g, "\n")}
          language={lang}
          theme={prismTheme}>
          {({
            className: cls,
            style,
            tokens,
            getLineProps,
            getTokenProps,
          }: RenderProps) => (
            <pre
              className={cls + " m-0 p-2 text-sm font-mono leading-5"}
              style={{
                ...style,
                backgroundColor: "transparent",
                minHeight: "100%",
              }}>
              {(() => {
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

      {/* Textarea input layer (on top), with transparent text but visible caret */}
      <textarea
        ref={taRef}
        className="absolute inset-0 w-full h-full resize-none bg-transparent outline-none p-2 font-mono text-sm text-transparent caret-black dark:caret-white overflow-auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScrollSync}
        placeholder={undefined}
        wrap="off"
        spellCheck={false}
      />

      {/* Visible placeholder when empty */}
      {!value && placeholder && (
        <div className="absolute top-2 left-2 text-gray-400 pointer-events-none text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
}

export default memo(CodeEditor);
