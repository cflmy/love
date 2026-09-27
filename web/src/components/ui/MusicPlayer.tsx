"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { crops } from "@/data/assets";
import { PLAYLIST, chromeCopy } from "@/data/chrome";
import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore } from "@/store/story";
import { StoryIcon } from "./icons";

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Disc, transport, and playlist from the music-player sheet. */
export function MusicPlayer() {
  const open = useStoryStore((s) => s.playerOpen);
  const setOpen = useStoryStore((s) => s.setPlayerOpen);
  const locale = useStoryStore((s) => s.locale);
  const musicEnabled = useStoryStore((s) => s.musicEnabled);
  const setMusicEnabled = useStoryStore((s) => s.setMusicEnabled);
  const setAudioUnlocked = useStoryStore((s) => s.setAudioUnlocked);
  const pushToast = useStoryStore((s) => s.pushToast);
  const text = chromeCopy(locale);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const track = PLAYLIST[index];

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      const pos = MusicEngine.position();
      setSeek(pos.seek);
      setDuration(pos.duration);
      const current = MusicEngine.currentId();
      const found = PLAYLIST.findIndex((item) => item.id === current);
      if (found >= 0) setIndex(found);
    }, 400);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const playIndex = (nextIndex: number) => {
    const item = PLAYLIST[(nextIndex + PLAYLIST.length) % PLAYLIST.length];
    setIndex((nextIndex + PLAYLIST.length) % PLAYLIST.length);
    MusicEngine.unlock();
    setAudioUnlocked(true);
    setMusicEnabled(true);
    MusicEngine.setEnabled(true);
    MusicEngine.play(item.id, 500);
  };

  const toggle = () => {
    if (!musicEnabled) {
      playIndex(index);
      return;
    }
    setMusicEnabled(false);
    MusicEngine.setEnabled(false);
  };

  const ratio = duration > 0 ? Math.min(1, seek / duration) : 0;

  return (
    <div
      className="qd-player-layer"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <section
        className={`qd-player ${musicEnabled ? "is-on" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={text.music}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="qd-player__close" onClick={() => setOpen(false)} aria-label={text.cancel}>
          ×
        </button>
        <div className="qd-player__head">
          <div className="qd-player__disc">
            <Image src={crops.meetBridge} alt="" width={140} height={140} />
          </div>
          <div className="qd-player__meta">
            <strong>{text[track.key]}</strong>
            <em>{text.playerOriginal}</em>
            <span>
              {clock(seek)} / {clock(duration)}
            </span>
            <label className="qd-player__seek">
              <span className="sr-only">{text.music}</span>
              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(ratio * 1000)}
                onChange={(e) => MusicEngine.seekTo(Number(e.target.value) / 1000)}
                style={{ ["--seek" as string]: `${ratio * 100}%` }}
              />
            </label>
            <div className="qd-player__transport">
              <button type="button" aria-label={text.prev} onClick={() => playIndex(index - 1)}>
                <StoryIcon name="chevron" className="qd-btn__chev--back" />
              </button>
              <button type="button" className="is-main" aria-label={musicEnabled ? text.pause : text.play} onClick={toggle}>
                <StoryIcon name={musicEnabled ? "pause" : "play"} />
              </button>
              <button type="button" aria-label={text.next} onClick={() => playIndex(index + 1)}>
                <StoryIcon name="chevron" />
              </button>
              <button
                type="button"
                aria-pressed={Boolean(liked[track.id])}
                aria-label={text.liked}
                onClick={() => {
                  setLiked((prev) => ({ ...prev, [track.id]: !prev[track.id] }));
                  pushToast("success", text.liked);
                }}
              >
                <StoryIcon name="heart" />
              </button>
            </div>
          </div>
        </div>
        <ol className="qd-player__list qd-scroll">
          {PLAYLIST.map((item, i) => (
            <li key={item.id}>
              <button type="button" className={i === index ? "is-active" : ""} onClick={() => playIndex(i)}>
                <StoryIcon name="play" />
                <span>
                  <strong>{text[item.key]}</strong>
                  <em>{item.sub}</em>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
