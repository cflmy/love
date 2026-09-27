"use client";

import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore } from "@/store/story";
import { StoryIcon } from "./icons";

/** Tiny note control — the music button from the kit, not a media bar. */
export function MusicToggle() {
  const entered = useStoryStore((s) => s.entered);
  const musicEnabled = useStoryStore((s) => s.musicEnabled);
  const setMusicEnabled = useStoryStore((s) => s.setMusicEnabled);
  const progress = useStoryStore((s) => s.progress);

  if (!entered) return null;

  return (
    <button
      type="button"
      className={`qd-note ${musicEnabled ? "is-on" : ""}`}
      onClick={() => {
        const next = !musicEnabled;
        setMusicEnabled(next);
        MusicEngine.setEnabled(next);
      }}
      aria-label={musicEnabled ? "关闭音乐" : "开启音乐"}
      aria-pressed={musicEnabled}
    >
      <span className="qd-note__disc" aria-hidden>
        <StoryIcon name={musicEnabled ? "music" : "pause"} />
      </span>
      <span className="qd-note__copy">
        <strong>{musicEnabled ? "音乐" : "静音"}</strong>
        <em>{musicEnabled ? "Music" : "Muted"}</em>
        <span className="qd-note__bar">
          <i style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      </span>
    </button>
  );
}
