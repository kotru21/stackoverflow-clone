import { memo, useEffect, useState } from "react";
import HeaderView from "./ui/HeaderView";
import type { HeaderViewProps } from "./ui/HeaderView";

type Props = Omit<HeaderViewProps, "atTop">;

function Header(props: Props) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const COLLAPSE_Y = 24; // ~разница высоты между py-5 и py-2
    const EXPAND_Y = 0;
    let ticking = false;

    const evalPos = () => {
      const y = window.scrollY ?? document.documentElement.scrollTop ?? 0;
      setAtTop((prev) => {
        if (prev && y > COLLAPSE_Y) return false;
        if (!prev && y <= EXPAND_Y) return true;
        return prev;
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        evalPos();
      });
    };

    // начальная инициализация
    evalPos();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <HeaderView {...props} atTop={atTop} />;
}

export default memo(Header);
