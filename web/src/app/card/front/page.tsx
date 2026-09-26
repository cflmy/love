import type { Metadata } from "next";
import { CardExperience } from "@/components/card/CardExperience";

export const metadata: Metadata = {
  title: "QDQC · Card Front",
  description: "NFC 卡正面 · 相逢鹊渡。",
};

export default function CardFrontPage() {
  return <CardExperience initialFace="front" />;
}
