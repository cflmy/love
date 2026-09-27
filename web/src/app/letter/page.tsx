import type { Metadata } from "next";
import { LetterChapter } from "@/components/story/LetterChapter";

export const metadata: Metadata = {
  title: "给你的一封信",
  description: "A Letter to You · QDQC",
};

export default function LetterPage() {
  return (
    <main className="letter-route">
      <LetterChapter />
    </main>
  );
}
