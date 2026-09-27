"use client";

import { useState } from "react";
import { DECK_ITEMS, chromeCopy } from "@/data/chrome";
import { useStoryStore } from "@/store/story";

/** The letter desk: every field from the form sheet, then a sealed line. */
export function LetterForm() {
  const locale = useStoryStore((s) => s.locale);
  const pushToast = useStoryStore((s) => s.pushToast);
  const text = chromeCopy(locale);
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [seal, setSeal] = useState("");
  const [showSeal, setShowSeal] = useState(false);
  const [chapter, setChapter] = useState<string>(DECK_ITEMS[0]?.id ?? "meeting");
  const [pin, setPin] = useState(true);
  const [read, setRead] = useState(false);
  const [ready, setReady] = useState<"yes" | "no" | "">("");
  const [kept, setKept] = useState("");

  const submit = () => {
    if (!line.trim()) {
      pushToast("error", text.errLine);
      return;
    }
    if (!read) {
      pushToast("warning", text.warnRead);
      return;
    }
    pushToast("info", text.sealing);
    window.setTimeout(() => {
      setKept(line.trim());
      pushToast("success", text.saved);
    }, 500);
  };

  return (
    <form
      className="qd-form"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="qd-form__title">{text.formTitle}</p>
      <p className="qd-form__hint">{text.formHint}</p>

      <label>
        {text.name}
        <input value={name} placeholder={text.namePh} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        {text.line}
        <textarea value={line} placeholder={text.linePh} rows={3} onChange={(e) => setLine(e.target.value)} />
      </label>

      <label>
        {text.seal}
        <span className="qd-form__secret">
          <input
            type={showSeal ? "text" : "password"}
            value={seal}
            onChange={(e) => setSeal(e.target.value)}
            autoComplete="off"
          />
          <button type="button" onClick={() => setShowSeal((v) => !v)} aria-label={text.seal}>
            {showSeal ? "•" : "○"}
          </button>
        </span>
      </label>

      <label>
        {text.chapter}
        <select value={chapter} onChange={(e) => setChapter(e.target.value)}>
          {DECK_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {text[item.key]}
            </option>
          ))}
        </select>
      </label>

      <label className="qd-form__toggle">
        <input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} />
        <i />
        {text.pin}
      </label>

      <label className="qd-form__check">
        <input type="checkbox" checked={read} onChange={(e) => setRead(e.target.checked)} />
        <span>{text.read}</span>
      </label>

      <fieldset>
        <legend>{text.ready}</legend>
        <label>
          <input type="radio" name="ready" checked={ready === "yes"} onChange={() => setReady("yes")} />
          {text.yes}
        </label>
        <label>
          <input type="radio" name="ready" checked={ready === "no"} onChange={() => setReady("no")} />
          {text.cancel}
        </label>
      </fieldset>

      <button type="submit" className="qd-btn qd-btn--primary">
        <span className="qd-btn__wash" aria-hidden />
        <span className="qd-btn__sheen" aria-hidden />
        <span className="qd-btn__rim" aria-hidden />
        <span className="qd-btn__zh">{text.save}</span>
      </button>

      {kept ? (
        <p className="qd-form__kept">
          {name ? `${name} · ` : ""}
          {kept}
          {pin ? "" : ""}
        </p>
      ) : null}
    </form>
  );
}
