export type StoryIconName =
  | "home"
  | "heart"
  | "butterfly"
  | "phoenix"
  | "city"
  | "mountain"
  | "tea"
  | "camera"
  | "mail"
  | "moon"
  | "music"
  | "pause"
  | "chevron"
  | "play"
  | "volume"
  | "share"
  | "lock"
  | "check"
  | "up";

type Props = {
  name: StoryIconName;
  className?: string;
};

/** Gold-line icons drawn to the UI kit, not cropped from the component sheets. */
export function StoryIcon({ name, className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={`qd-icon ${className}`.trim()} aria-hidden>
      {mark(name)}
    </svg>
  );
}

function mark(name: StoryIconName) {
  switch (name) {
    case "home":
      return (
        <>
          <path d="M4 11.2 12 4.5l8 6.7" />
          <path d="M7 10.5V19h10v-8.5" />
        </>
      );
    case "heart":
      return <path d="M12 19s-6.2-3.7-6.2-8.1A3.4 3.4 0 0 1 12 8.2a3.4 3.4 0 0 1 6.2 2.7C18.2 15.3 12 19 12 19Z" />;
    case "butterfly":
      return (
        <>
          <path d="M12 12c-1.4-3.6-5-5.4-7.4-3.2-2.2 1.8-.4 4.8 2 5.6 2 .7 3.8 0 5.4-2.4Z" />
          <path d="M12 12c1.4-3.6 5-5.4 7.4-3.2 2.2 1.8.4 4.8-2 5.6-2 .7-3.8 0-5.4-2.4Z" />
          <path d="M12 11.2v7" />
          <path d="M12 8.2c.8-1.4 1.6-2 2.4-2" />
        </>
      );
    case "phoenix":
      return (
        <>
          <path d="M5 15c2.2-4 5-6.2 8.2-6.6 1.6 2.2 2.2 4.4 1.6 6.6-2 .2-3.8-.2-5.4-1.2" />
          <path d="M14.2 8.2c1.8-2.4 4.4-3.4 6.8-2.6-1.2 1.8-1.4 3.4-.6 5" />
          <path d="M8.4 16.8c1.6 1.4 3.4 2 5.2 1.6" />
        </>
      );
    case "city":
      return (
        <>
          <path d="M4 19V9.5L9 7v12" />
          <path d="M9 19V5l6 2.2V19" />
          <path d="M15 19v-7.5L20 9v10" />
        </>
      );
    case "mountain":
      return <path d="M3 18.5 9.2 8l3.3 4.2L16 7.5 21 18.5Z" />;
    case "tea":
      return (
        <>
          <path d="M6 9h9.2v5.2a4.2 4.2 0 0 1-4.2 4.2H10A4 4 0 0 1 6 14.2Z" />
          <path d="M15.2 10.2h1.6a2.2 2.2 0 0 1 0 4.4h-1.4" />
          <path d="M8 19.5h8" />
        </>
      );
    case "camera":
      return (
        <>
          <path d="M4 8.5h3l1.4-2h7.2L17 8.5h3V18H4Z" />
          <circle cx="12" cy="13" r="2.4" />
        </>
      );
    case "mail":
      return (
        <>
          <path d="M4 7.5h16v10H4Z" />
          <path d="m4.5 8 7.5 5.5L19.5 8" />
        </>
      );
    case "moon":
      return <path d="M15.2 4.8A7.2 7.2 0 1 0 19 15.6 5.6 5.6 0 0 1 15.2 4.8Z" />;
    case "music":
      return (
        <>
          <path d="M9 17.5V7.2l9-1.7v8.6" />
          <circle cx="7.2" cy="17.5" r="1.8" />
          <circle cx="16.2" cy="14.2" r="1.8" />
        </>
      );
    case "pause":
      return (
        <>
          <path d="M8 7v10" />
          <path d="M16 7v10" />
        </>
      );
    case "play":
      return <path d="M8 6.5v11l9-5.5Z" />;
    case "chevron":
      return <path d="M9 6.5 15 12 9 17.5" />;
    case "volume":
      return (
        <>
          <path d="M5 10h2.5L11 7v10l-3.5-3H5Z" />
          <path d="M14 9.5a3.5 3.5 0 0 1 0 5" />
          <path d="M16 7.5a6 6 0 0 1 0 9" />
        </>
      );
    case "share":
      return (
        <>
          <circle cx="7" cy="12" r="2" />
          <circle cx="16.5" cy="7.5" r="2" />
          <circle cx="16.5" cy="16.5" r="2" />
          <path d="m8.8 11 6-2.6" />
          <path d="m8.8 13 6 2.6" />
        </>
      );
    case "lock":
      return (
        <>
          <rect x="6" y="11" width="12" height="8" rx="1.5" />
          <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" />
        </>
      );
    case "check":
      return <path d="M6 12.5 10 16.5 18 8" />;
    case "up":
      return (
        <>
          <path d="M12 18V7" />
          <path d="m7.5 11 4.5-4.5L16.5 11" />
        </>
      );
  }
}

/** Five-petal blossom used on primary actions. */
export function BlossomMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g fill="#f3b7c6">
        <ellipse cx="24" cy="13" rx="5.2" ry="8" />
        <ellipse cx="24" cy="13" rx="5.2" ry="8" transform="rotate(72 24 24)" />
        <ellipse cx="24" cy="13" rx="5.2" ry="8" transform="rotate(144 24 24)" />
        <ellipse cx="24" cy="13" rx="5.2" ry="8" transform="rotate(216 24 24)" />
        <ellipse cx="24" cy="13" rx="5.2" ry="8" transform="rotate(288 24 24)" />
      </g>
      <circle cx="24" cy="24" r="3.2" fill="#e7c98a" />
    </svg>
  );
}
