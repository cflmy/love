"use client";

import { useEffect } from "react";
import { StoryIcon } from "./icons";
import { useStoryStore, type ToastKind } from "@/store/story";

const ICON: Record<ToastKind, "check" | "lock" | "music" | "heart"> = {
  success: "check",
  error: "lock",
  info: "music",
  warning: "heart",
};

export function ToastHost() {
  const toasts = useStoryStore((s) => s.toasts);
  const dismiss = useStoryStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toasts.length) return;
    const latest = toasts[toasts.length - 1];
    const timer = window.setTimeout(() => dismiss(latest.id), 3400);
    return () => window.clearTimeout(timer);
  }, [toasts, dismiss]);

  if (!toasts.length) return null;

  return (
    <div className="qd-toasts" aria-live="polite">
      {toasts.map((toast) => (
        <p key={toast.id} className={`qd-toast qd-toast--${toast.kind}`}>
          <StoryIcon name={ICON[toast.kind]} />
          <span>{toast.text}</span>
        </p>
      ))}
    </div>
  );
}
