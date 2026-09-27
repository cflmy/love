import { Howl } from "howler";
import { audio } from "@/data/assets";

type TrackId = keyof typeof audio;

class MusicEngineImpl {
  private tracks = new Map<TrackId, Howl>();
  private current: TrackId | null = null;
  private unlocked = false;
  private master = 0.72;
  private enabled = true;

  unlock() {
    this.unlocked = true;
    // Warm prologue so first play is instant.
    this.ensure("prologue");
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.tracks.forEach((h) => h.fade(h.volume(), 0, 400));
      setTimeout(() => this.tracks.forEach((h) => h.pause()), 420);
    } else if (this.current) {
      this.play(this.current, 800);
    }
  }

  setMaster(volume: number) {
    this.master = Math.max(0, Math.min(1, volume));
    if (this.current) {
      this.tracks.get(this.current)?.volume(this.master);
    }
  }

  private ensure(id: TrackId) {
    let howl = this.tracks.get(id);
    if (!howl) {
      howl = new Howl({
        src: [audio[id]],
        html5: true,
        loop: true,
        volume: 0,
        preload: true,
      });
      this.tracks.set(id, howl);
    }
    return howl;
  }

  play(id: TrackId, fadeMs = 1600) {
    if (!this.unlocked || !this.enabled) {
      this.current = id;
      return;
    }
    const next = this.ensure(id);
    if (this.current === id) {
      if (!next.playing()) {
        next.volume(0);
        next.play();
        next.fade(0, this.master, fadeMs);
      }
      return;
    }
    const prevId = this.current;
    const prev = prevId ? this.tracks.get(prevId) : null;
    this.current = id;
    next.volume(0);
    if (!next.playing()) next.play();
    next.fade(0, this.master, fadeMs);
    if (prev && prev.playing()) {
      prev.fade(prev.volume(), 0, fadeMs);
      setTimeout(() => prev.pause(), fadeMs + 40);
    }
  }

  setIntensity(value: number) {
    if (!this.current) return;
    const howl = this.tracks.get(this.current);
    if (!howl) return;
    const v = this.master * (0.45 + 0.55 * Math.max(0, Math.min(1, value)));
    howl.volume(v);
  }

  currentId() {
    return this.current;
  }

  masterVolume() {
    return this.master;
  }

  isEnabled() {
    return this.enabled;
  }

  position() {
    const howl = this.current ? this.tracks.get(this.current) : null;
    if (!howl) return { seek: 0, duration: 0 };
    const seek = howl.seek();
    return {
      seek: typeof seek === "number" ? seek : 0,
      duration: howl.duration() || 0,
    };
  }

  seekTo(ratio: number) {
    const howl = this.current ? this.tracks.get(this.current) : null;
    if (!howl) return;
    const duration = howl.duration();
    if (!duration) return;
    howl.seek(Math.max(0, Math.min(1, ratio)) * duration);
  }

  stopAll(fadeMs = 600) {
    this.tracks.forEach((h) => {
      h.fade(h.volume(), 0, fadeMs);
      setTimeout(() => h.stop(), fadeMs + 40);
    });
    this.current = null;
  }
}

export const MusicEngine = new MusicEngineImpl();
