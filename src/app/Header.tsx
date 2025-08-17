import { memo, useEffect, useState } from "react";
import HeaderView from "./ui/HeaderView";
import type { HeaderViewProps } from "./ui/HeaderView";

type Props = Omit<HeaderViewProps, "atTop">;

function Header(props: Props) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <HeaderView {...props} atTop={atTop} />;
}

export default memo(Header);
