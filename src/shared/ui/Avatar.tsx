import { memo, useMemo } from "react";

export type AvatarProps = {
  username: string;
  size?: number; // px
  className?: string;
  title?: string;
};

// Soft color palette
const COLORS = [
  "#FECACA", // red-200
  "#FED7AA", // orange-200
  "#FEF08A", // yellow-200
  "#BBF7D0", // green-200
  "#99F6E4", // teal-200
  "#A5F3FC", // sky-200
  "#BAE6FD", // blue-200
  "#C7D2FE", // indigo-200
  "#E9D5FF", // purple-200
  "#F5D0FE", // fuchsia-200
  "#FFD6E7", // pinkish
  "#E5E7EB", // gray-200
];

const EMOJIS = [
  "😀",
  "😎",
  "🙂",
  "😉",
  "🤓",
  "🤠",
  "🥳",
  "🤗",
  "🐱",
  "🐶",
  "🦊",
  "🐻",
  "🐼",
  "🐵",
  "🦁",
  "🐯",
  "🐨",
  "🐸",
  "🐧",
  "🐹",
  "🐰",
  "🐢",
  "🐙",
  "🐳",
  "🦄",
  "🐝",
  "🐞",
  "🦋",
  "🐺",
  "🐠",
  "🐬",
  "🦖",
  "⭐",
  "⚡",
  "🔥",
  "🌈",
  "🌵",
  "🍀",
  "🍣",
  "🍕",
  "🍩",
  "☕",
  "🎧",
  "🎮",
  "🚀",
  "🛡️",
  "🧠",
  "🧩",
];

function hashString(str: string): number {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

export const Avatar = memo(function Avatar({
  username,
  size = 28,
  className = "",
  title,
}: AvatarProps) {
  const { bg, emoji } = useMemo(() => {
    const base = hashString((username || "").toLowerCase());
    const bg = pick(COLORS, base);
    const emoji = pick(EMOJIS, base * 48271 + 0x9e3779b1);
    return { bg, emoji };
  }, [username]);

  const style: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: bg,
    fontSize: Math.max(11, Math.floor(size * 0.6)),
    lineHeight: 1,
  };

  return (
    <span
      className={
        "inline-flex select-none items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10 text-base " +
        className
      }
      style={style}
      title={title ?? username}
      aria-label={`Avatar of ${username}`}>
      <span style={{ transform: "translateY(1px)" }}>{emoji}</span>
    </span>
  );
});

export default Avatar;
