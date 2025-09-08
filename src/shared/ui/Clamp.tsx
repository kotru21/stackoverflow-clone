import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui/Button";

type ClampProps = {
  children: React.ReactNode;
  className?: string;
  maxHeight?: number; // px when clamped
  gradientHeight?: number; // px height of fade overlay
  mode?: "navigate" | "toggle";
  onMoreClick?: () => void; // used when mode="navigate"
  moreLabel?: string; // default: "Показать весь"
  lessLabel?: string; // default: "Показать меньше"
};

export const Clamp = memo(function Clamp({
  children,
  className,
  maxHeight = 220,
  gradientHeight = 56,
  mode = "navigate",
  onMoreClick,
  moreLabel = "Показать весь",
  lessLabel = "Показать меньше",
}: ClampProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const prevMaxHeight = el.style.maxHeight;
      el.style.maxHeight = "none";
      const overflowing = el.scrollHeight > maxHeight + 1;
      el.style.maxHeight = prevMaxHeight;
      setIsOverflowing(overflowing);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [maxHeight, children]);

  const containerStyles = useMemo<React.CSSProperties>(() => {
    return expanded ? {} : { maxHeight: `${maxHeight}px` };
  }, [expanded, maxHeight]);

  const showGradient = isOverflowing && !expanded;

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
        <div ref={ref} className="overflow-hidden" style={containerStyles}>
          {children}
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
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={handleLess}>
                {lessLabel}
              </Button>
            ) : (
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={handleMore}>
                {moreLabel}
              </Button>
            )
          ) : (
            <Button type="button" variant="link" size="xs" onClick={handleMore}>
              {moreLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

export default Clamp;
