"use client";

import { useMemo } from "react";
import { chapterProgressBounds } from "@/data/chapters";
import { MEETING_TITLE, holdThenExit, smoothstep } from "@/data/meetingShots";
import { useStoryStore } from "@/store/story";

/**
 * Fixed overlay during 相逢鹊渡 — rise → hold → exit *inside* meeting.
 * Only a breath of residue into 前世; never covers 暮云 entrance.
 */
export function MeetingTitle() {
  const progress = useStoryStore((s) => s.progress);
  const chapterId = useStoryStore((s) => s.chapterId);
  const reduced = useStoryStore((s) => s.reducedMotion);

  const { meetLocal, pastLocal } = useMemo(() => {
    const bounds = chapterProgressBounds();
    const meet = bounds.find((x) => x.id === "meeting");
    const past = bounds.find((x) => x.id === "past");
    const meetLocal = meet
      ? Math.min(1, Math.max(0, (progress - meet.start) / Math.max(0.0001, meet.end - meet.start)))
      : 0;
    const pastLocal = past
      ? Math.min(1, Math.max(0, (progress - past.start) / Math.max(0.0001, past.end - past.start)))
      : 0;
    return { meetLocal, pastLocal };
  }, [progress]);

  const inMeeting = chapterId === "meeting";
  const inPastCarry = chapterId === "past" && pastLocal < MEETING_TITLE.pastCarry;
  if (!inMeeting && !inPastCarry) return null;

  const exit = MEETING_TITLE.exitStart;
  const exitEnd = MEETING_TITLE.exitEnd;

  const lineA = holdThenExit(
    meetLocal,
    MEETING_TITLE.lineA.start,
    MEETING_TITLE.lineA.peak,
    exit,
    exitEnd,
  );
  const lineB = holdThenExit(
    meetLocal,
    MEETING_TITLE.lineB.start,
    MEETING_TITLE.lineB.peak,
    exit,
    exitEnd,
  );
  const lineC = holdThenExit(
    meetLocal,
    MEETING_TITLE.lineC.start,
    MEETING_TITLE.lineC.peak,
    exit,
    exitEnd,
  );

  const gateInMeeting = holdThenExit(
    meetLocal,
    MEETING_TITLE.gate.start,
    MEETING_TITLE.gate.peak,
    exit,
    exitEnd,
  );
  // Past residue: fade + lift only — no new beat, clears before 暮云 reads
  const pastFade = inPastCarry ? 1 - smoothstep(pastLocal, 0, MEETING_TITLE.pastCarry) : 0;
  const gate = inMeeting ? gateInMeeting : pastFade * 0.35;

  if (gate < 0.02) return null;

  const blur = (t: number) => (reduced ? 0 : (1 - t) * 14);
  const y = (t: number) => (1 - t) * 18;
  // Soft lift while exiting so 暮云 (center) isn't covered during the breath of overlap
  const exitLift = inMeeting
    ? smoothstep(meetLocal, exit, exitEnd) * -12
    : inPastCarry
      ? -18 - pastLocal * 24
      : 0;

  return (
    <div
      className="meeting-title"
      aria-live="polite"
      style={{
        opacity: gate,
        transform: `translate(-50%, calc(-50% + ${exitLift}vh))`,
      }}
    >
      <p
        className="meeting-title__line a"
        style={{
          opacity: 0.15 + lineA * 0.85,
          filter: `blur(${blur(lineA)}px)`,
          transform: `translateY(${y(lineA)}px)`,
        }}
      >
        相逢鹊渡
      </p>
      <p
        className="meeting-title__line b"
        style={{
          opacity: lineB * 0.92,
          filter: `blur(${blur(lineB)}px)`,
          transform: `translateY(${y(lineB)}px)`,
        }}
      >
        相守情长
      </p>
      <p
        className="meeting-title__line c"
        style={{
          opacity: lineC * 0.88,
          filter: `blur(${blur(lineC) * 0.7}px)`,
          transform: `translateY(${y(lineC) * 0.6}px)`,
        }}
      >
        故与君鹊渡情长
      </p>
    </div>
  );
}
