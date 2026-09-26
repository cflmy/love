import type { Metadata } from "next";
import { CardExperience } from "@/components/card/CardExperience";

export const metadata: Metadata = {
  title: "QDQC · Card Back",
  description: "NFC 卡背面 · 相守情长。",
};

export default function CardBackPage() {
  return <CardExperience initialFace="back" />;
}
