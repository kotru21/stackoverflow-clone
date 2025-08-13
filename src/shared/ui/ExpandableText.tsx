import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type ExpandableTextProps = {
  text: string;
  className?: string;
  maxHeight?: number; // px, when collapsed
  gradientHeight?: number; // px height of fade overlay
  mode: "navigate" | "toggle"; // navigate: show more goes to a page; toggle: expands/collapses inline
  onMoreClick?: () => void; // used when mode="navigate"
  moreLabel?: string; // default: "Показать весь"
  lessLabel?: string; // default: "Показать меньше"
};

export const ExpandableText = memo(function ExpandableText({
  text,
  className,
  maxHeight = 160,
  gradientHeight = 56,
  mode,
  onMoreClick,
  moreLabel = "Показать весь",
  lessLabel = "Показать меньше",
}: ExpandableTextProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Measure overflow on mount/resize/content changes
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const check = () => {
      // Temporarily remove max-height to measure full scrollHeight correctly
      const prevMaxHeight = el.style.maxHeight;
      el.style.maxHeight = "none";
      const overflowing = el.scrollHeight > maxHeight + 1; // buffer
      el.style.maxHeight = prevMaxHeight;
      setIsOverflowing(overflowing);
    };

    check();

    const ro = new ResizeObserver(() => check());
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [maxHeight, text]);

  const showGradient = isOverflowing && !expanded;
  const containerStyles = useMemo<React.CSSProperties>(() => {
    return expanded ? {} : { maxHeight: `${maxHeight}px` };
  }, [expanded, maxHeight]);

  const handleMore = useCallback(() => {
    if (mode === "navigate") {
      onMoreClick?.();
      return;
    }
    setExpanded(true);
  }, [mode, onMoreClick]);

  const handleLess = useCallback(() => setExpanded(false), []);

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={contentRef}
          className={[
            "overflow-hidden whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300",
            expanded ? "" : "",
          ].join(" ")}
          style={containerStyles}>
          {text}
        </div>

        {showGradient && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0"
            style={{ height: gradientHeight }}>
            <div className="h-full w-full bg-gradient-to-t from-white to-transparent dark:from-neutral-800" />
          </div>
        )}
      </div>

      {isOverflowing && (
        <div className="mt-2">
          {mode === "toggle" ? (
            expanded ? (
              <button
                type="button"
                onClick={handleLess}
                className="text-blue-600 hover:underline dark:text-blue-400 text-sm">
                {lessLabel}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMore}
                className="text-blue-600 hover:underline dark:text-blue-400 text-sm">
                {moreLabel}
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleMore}
              className="text-blue-600 hover:underline dark:text-blue-400 text-sm">
              {moreLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
});
