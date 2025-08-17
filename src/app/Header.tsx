import { memo, useEffect, useRef, useState } from "react";
import HeaderView from "./ui/HeaderView";
import type { HeaderViewProps } from "./ui/HeaderView";

type Props = Omit<HeaderViewProps, "atTop">;

function Header(props: Props) {
  const [atTop, setAtTop] = useState(true);
  const atTopRef = useRef<boolean>(true);

  // держим ref в синхронизации со стейтом
  useEffect(() => {
    atTopRef.current = atTop;
  }, [atTop]);

  useEffect(() => {
    const COLLAPSE_Y = 24; // ~разница высоты между py-5 и py-2
    const EXPAND_Y = 0;
    let ticking = false;

    const evalPos = () => {
      const y =
        window.scrollY ?? document.documentElement.scrollTop ?? (0 as number);
  let next = atTopRef.current;
  if (atTopRef.current) {
        if (y > COLLAPSE_Y) next = false;
      } else {
        if (y <= EXPAND_Y) next = true;
      }
  if (next !== atTopRef.current) {
        atTopRef.current = next;
        setAtTop(next);
      }
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
