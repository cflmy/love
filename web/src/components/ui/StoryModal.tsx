"use client";

import { BlossomMark } from "./icons";

type Props = {
  open: boolean;
  title: string;
  hint?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Parchment dialog from the modal sheet. */
export function StoryModal({ open, title, hint, cancelLabel, confirmLabel, onCancel, onConfirm }: Props) {
  if (!open) return null;
  return (
    <div className="qd-overlay" role="presentation" onClick={onCancel}>
      <div
        className="qd-modal qd-modal--overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qd-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="qd-modal__close" onClick={onCancel} aria-label={cancelLabel}>
          ×
        </button>
        <BlossomMark className="qd-modal__bloom" />
        <p id="qd-modal-title" className="qd-modal__title">
          {title}
        </p>
        {hint ? <p className="qd-modal__en">{hint}</p> : null}
        <div className="qd-modal__actions">
          <button type="button" className="qd-btn qd-btn--secondary" onClick={onCancel}>
            <span className="qd-btn__wash" aria-hidden />
            <span className="qd-btn__sheen" aria-hidden />
            <span className="qd-btn__rim" aria-hidden />
            <span className="qd-btn__zh">{cancelLabel}</span>
          </button>
          <button type="button" className="qd-btn qd-btn--memory" onClick={onConfirm}>
            <span className="qd-btn__wash" aria-hidden />
            <span className="qd-btn__sheen" aria-hidden />
            <span className="qd-btn__rim" aria-hidden />
            <BlossomMark className="qd-btn__bloom" />
            <span className="qd-btn__zh">{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
