import type { Metadata } from "next";
import { CardExperience } from "@/components/card/CardExperience";

export const metadata: Metadata = {
  title: "QDQC · Card",
  description: "A touch awakens our world. NFC 入口 · 鹊渡情长。",
};

export default function CardPage() {
  return <CardExperience />;
}
