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
  language?: Language;
  className?: string;
};

export const CodeBlock = memo(function CodeBlock({
  code,
  language = "tsx",
  className,
}: CodeBlockProps) {
  const { theme } = useTheme();
  const safeCode = code ?? "";
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
      <Highlight code={safeCode} language={language} theme={prismTheme}>
        {({
          className: cls,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }: RenderProps) => (
          <pre
            className={cls + " m-0 p-2 text-sm overflow-auto"}
            style={{ ...style, backgroundColor: "transparent" }}>
            {tokens.map((line: PrismToken[], i: number) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token: PrismToken, key: number) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
});
