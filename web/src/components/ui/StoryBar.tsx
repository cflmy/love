"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { brand } from "@/data/assets";
import { NAV_ITEMS, chromeCopy } from "@/data/chrome";
import type { ChapterId } from "@/data/chapters";
import { useGoChapter } from "@/engine/goChapter";
import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore, type Locale } from "@/store/story";
import { ChapterNav } from "./ChapterNav";
import { StoryIcon } from "./icons";
import { StoryModal } from "./StoryModal";

function activeKey(id: ChapterId): ChapterId {
  if (id === "opening") return "meeting";
  return id;
}

const LOCALES: Locale[] = ["zh", "en", "fr"];
const LOCALE_LABEL: Record<Locale, string> = { zh: "中", en: "EN", fr: "FR" };

/** Top bar from the navigation sheet: chapters, music, volume, share, language. */
export function StoryBar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const chapterId = useStoryStore((s) => s.chapterId);
  const progress = useStoryStore((s) => s.progress);
  const locale = useStoryStore((s) => s.locale);
  const setLocale = useStoryStore((s) => s.setLocale);
  const musicEnabled = useStoryStore((s) => s.musicEnabled);
  const setMusicEnabled = useStoryStore((s) => s.setMusicEnabled);
  const playerOpen = useStoryStore((s) => s.playerOpen);
  const setPlayerOpen = useStoryStore((s) => s.setPlayerOpen);
  const volume = useStoryStore((s) => s.volume);
  const setVolume = useStoryStore((s) => s.setVolume);
  const pushToast = useStoryStore((s) => s.pushToast);
  const go = useGoChapter();
  const text = chromeCopy(locale);
  const current = activeKey(chapterId);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale === "fr" ? "fr" : "en";
  }, [locale]);

  const share = async () => {
    setShareOpen(false);
    const url = window.location.href;
    const payload = { title: "QDQC · 鹊渡情长", text: text.shareHint, url };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(url);
      pushToast("success", text.copied);
    } catch {
      pushToast("info", text.copied);
    }
  };

  return (
    <>
      <header className="story-bar">
        <a className="story-bar__brand" href={pathname === "/" ? "#top" : "/"}>
          <Image src={brand.icon} alt="" width={36} height={38} className="story-bar__logo" />
          <span>
            QDQC
            <i>∞</i>
          </span>
        </a>

        <nav className="story-bar__links" aria-label={text.deckTitle}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`story-bar__link ${item.id === current && pathname === "/" ? "is-active" : ""}`}
              onClick={() => go(item.id)}
            >
              {item.id === "meeting" ? <StoryIcon name="butterfly" /> : null}
              {text[item.key]}
            </button>
          ))}
        </nav>

        <div className="story-bar__tools">
          <button
            type="button"
            className={`story-bar__tool ${playerOpen ? "is-on" : ""}`}
            aria-pressed={playerOpen}
            aria-label={text.music}
            onClick={() => setPlayerOpen(!playerOpen)}
          >
            <StoryIcon name="music" />
          </button>
          <div className="story-bar__volume">
            <button
              type="button"
              className={`story-bar__tool ${musicEnabled ? "is-on" : ""}`}
              aria-pressed={musicEnabled}
              aria-label={text.volume}
              onClick={() => setVolumeOpen((v) => !v)}
            >
              <StoryIcon name="volume" />
            </button>
            {volumeOpen ? (
              <label className="story-bar__slider">
                <span className="sr-only">{text.volume}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(volume * 100)}
                  style={{ ["--seek" as string]: `${Math.round(volume * 100)}%` }}
                  onChange={(e) => {
                    const next = Number(e.target.value) / 100;
                    setVolume(next);
                    MusicEngine.setMaster(next);
                    if (!musicEnabled && next > 0) {
                      setMusicEnabled(true);
                      MusicEngine.setEnabled(true);
                    }
                  }}
                />
              </label>
            ) : null}
          </div>
          <button type="button" className="story-bar__tool" aria-label={text.share} onClick={() => setShareOpen(true)}>
            <StoryIcon name="share" />
          </button>
          <div className="story-bar__lang" role="group" aria-label="Language">
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                className={code === locale ? "is-active" : ""}
                aria-pressed={code === locale}
                onClick={() => setLocale(code)}
              >
                {LOCALE_LABEL[code]}
              </button>
            ))}
          </div>
          <a className="story-bar__nfc" href="/card">
            <StoryIcon name="mail" />
            <span>{text.nfc}</span>
          </a>
          <button
            type="button"
            className="story-bar__menu"
            aria-label={text.deckTitle}
            aria-expanded={menu}
            aria-controls="chapter-menu"
            onClick={() => setMenu((v) => !v)}
          >
            <StoryIcon name="home" />
          </button>
        </div>
        <i className="story-bar__meter" style={{ width: `${Math.round(progress * 100)}%` }} />
      </header>

      <div className="story-rail" aria-label={text.deckTitle}>
        {NAV_ITEMS.filter((item) => item.image).map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`chapter-orb ${item.id === current && pathname === "/" ? "is-active" : ""}`}
            onClick={() => go(item.id)}
          >
            <span className="chapter-orb__ring">
              <Image src={item.image!} alt="" width={64} height={64} className="chapter-orb__img" />
            </span>
            <span className="chapter-orb__index">{index + 1}</span>
            <span className="chapter-orb__label">{text[item.key]}</span>
          </button>
        ))}
      </div>

      <ChapterNav open={menu} onClose={() => setMenu(false)} />

      <StoryModal
        open={shareOpen}
        title={text.shareTitle}
        hint={text.shareHint}
        cancelLabel={text.shareNo}
        confirmLabel={text.shareYes}
        onCancel={() => setShareOpen(false)}
        onConfirm={share}
      />
    </>
  );
}
