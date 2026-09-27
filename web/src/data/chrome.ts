import type { StoryIconName } from "@/components/ui/icons";
import type { ChapterId } from "./chapters";
import type { Locale } from "@/store/story";
import { crops } from "./assets";

export type ChromeCopy = {
  home: string;
  meeting: string;
  past: string;
  present: string;
  journey: string;
  quiet: string;
  memories: string;
  letter: string;
  future: string;
  music: string;
  volume: string;
  share: string;
  nfc: string;
  nfcHint: string;
  backTop: string;
  scroll: string;
  touchFirst: string;
  playerOriginal: string;
  play: string;
  pause: string;
  prev: string;
  next: string;
  liked: string;
  shareTitle: string;
  shareHint: string;
  shareYes: string;
  shareNo: string;
  copied: string;
  memoryTitle: string;
  memoryHint: string;
  cancel: string;
  yes: string;
  formTitle: string;
  formHint: string;
  name: string;
  namePh: string;
  line: string;
  linePh: string;
  seal: string;
  chapter: string;
  pin: string;
  read: string;
  ready: string;
  save: string;
  saved: string;
  errLine: string;
  warnRead: string;
  sealing: string;
  statusLive: string;
  statusDone: string;
  statusLocked: string;
  statusMark: string;
  deckTitle: string;
  deckHint: string;
};

const copy: Record<Locale, ChromeCopy> = {
  zh: {
    home: "首页",
    meeting: "相逢",
    past: "前世",
    present: "今世",
    journey: "山高路远",
    quiet: "Quiet Days",
    memories: "我们的回忆",
    letter: "给你的一封信",
    future: "更远的明天",
    music: "音乐",
    volume: "音量",
    share: "分享",
    nfc: "NFC 贴近手机",
    nfcHint: "Tap to Visit",
    backTop: "回到顶部",
    scroll: "Scroll",
    touchFirst: "先触碰鹊桥，再走进这一章。",
    playerOriginal: "QDQC Original",
    play: "播放",
    pause: "暂停",
    prev: "上一首",
    next: "下一首",
    liked: "已放进收藏。",
    shareTitle: "要把这一页交给谁？",
    shareHint: "Share this page",
    shareYes: "好的",
    shareNo: "取消",
    copied: "链接已经抄好。",
    memoryTitle: "要进入回忆吗？",
    memoryHint: "Enter the Memory?",
    cancel: "取消",
    yes: "好的",
    formTitle: "留一句在信里",
    formHint: "A line for later",
    name: "怎么称呼",
    namePh: "写下一个称呼",
    line: "一句心里话",
    linePh: "想说的话，留在这里",
    seal: "只有我们知道的词",
    chapter: "放在哪一章",
    pin: "记在时间线上",
    read: "我已读过这封信",
    ready: "要继续前行吗",
    save: "封上",
    saved: "这句话已经留在信里。",
    errLine: "还差一句心里话。",
    warnRead: "请先勾选「我已读过这封信」。",
    sealing: "正在封上火漆…",
    statusLive: "进行中",
    statusDone: "已完成",
    statusLocked: "未解锁",
    statusMark: "重要节点",
    deckTitle: "章节",
    deckHint: "Choose a chapter",
  },
  en: {
    home: "Home",
    meeting: "Meeting",
    past: "Past",
    present: "Present",
    journey: "The Road",
    quiet: "Quiet Days",
    memories: "Memories",
    letter: "Letter",
    future: "More Days",
    music: "Music",
    volume: "Volume",
    share: "Share",
    nfc: "NFC · Tap to Visit",
    nfcHint: "Tap to Visit",
    backTop: "Back to top",
    scroll: "Scroll",
    touchFirst: "Touch the bridge before entering a chapter.",
    playerOriginal: "QDQC Original",
    play: "Play",
    pause: "Pause",
    prev: "Previous",
    next: "Next",
    liked: "Saved to favorites.",
    shareTitle: "Share this page?",
    shareHint: "With someone who should read it",
    shareYes: "Yes",
    shareNo: "Cancel",
    copied: "Link copied.",
    memoryTitle: "Enter this memory?",
    memoryHint: "Enter the Memory?",
    cancel: "Cancel",
    yes: "Yes",
    formTitle: "Leave a line",
    formHint: "A line for later",
    name: "Name",
    namePh: "A name",
    line: "A line",
    linePh: "What you want to keep",
    seal: "A word only we know",
    chapter: "Which chapter",
    pin: "Pin it on the timeline",
    read: "I have read this letter",
    ready: "Shall we go on?",
    save: "Seal it",
    saved: "Your line is in the letter.",
    errLine: "The letter still needs a line.",
    warnRead: "Please confirm you have read the letter.",
    sealing: "Sealing the wax…",
    statusLive: "In progress",
    statusDone: "Done",
    statusLocked: "Locked",
    statusMark: "A marked day",
    deckTitle: "Chapters",
    deckHint: "Choose a chapter",
  },
  fr: {
    home: "Accueil",
    meeting: "Rencontre",
    past: "Passé",
    present: "Présent",
    journey: "La route",
    quiet: "Quiet Days",
    memories: "Souvenirs",
    letter: "Lettre",
    future: "Demain",
    music: "Musique",
    volume: "Volume",
    share: "Partager",
    nfc: "NFC · Approchez",
    nfcHint: "Tap to Visit",
    backTop: "Haut de page",
    scroll: "Scroll",
    touchFirst: "Touchez le pont avant d'entrer dans un chapitre.",
    playerOriginal: "QDQC Original",
    play: "Lecture",
    pause: "Pause",
    prev: "Précédent",
    next: "Suivant",
    liked: "Ajouté aux favoris.",
    shareTitle: "Partager cette page ?",
    shareHint: "À quelqu'un qui doit la lire",
    shareYes: "Oui",
    shareNo: "Annuler",
    copied: "Lien copié.",
    memoryTitle: "Entrer dans ce souvenir ?",
    memoryHint: "Enter the Memory?",
    cancel: "Annuler",
    yes: "Oui",
    formTitle: "Laisser une ligne",
    formHint: "Une ligne pour plus tard",
    name: "Nom",
    namePh: "Un nom",
    line: "Une ligne",
    linePh: "Ce que vous voulez garder",
    seal: "Un mot que nous seuls savons",
    chapter: "Quel chapitre",
    pin: "L'épingler sur la ligne du temps",
    read: "J'ai lu cette lettre",
    ready: "On continue ?",
    save: "Cacheter",
    saved: "Votre ligne est dans la lettre.",
    errLine: "Il manque encore une ligne.",
    warnRead: "Confirmez d'abord avoir lu la lettre.",
    sealing: "On cachette…",
    statusLive: "En cours",
    statusDone: "Terminé",
    statusLocked: "Fermé",
    statusMark: "Un jour marqué",
    deckTitle: "Chapitres",
    deckHint: "Choisir un chapitre",
  },
};

export function chromeCopy(locale: Locale) {
  return copy[locale];
}

export type NavItem = {
  id: ChapterId;
  icon: StoryIconName;
  image?: string;
  key: keyof ChromeCopy;
};

/** Nav order = film spine after Opening (docs/008). */
export const NAV_ITEMS: NavItem[] = [
  { id: "meeting", icon: "butterfly", image: crops.meetBridge, key: "meeting" },
  { id: "past", icon: "phoenix", image: crops.pastMuyun, key: "past" },
  { id: "present", icon: "city", image: crops.lifeMeet, key: "present" },
  { id: "journey", icon: "mountain", image: crops.roadClimb, key: "journey" },
  { id: "memories", icon: "camera", image: crops.daySpecial, key: "memories" },
  { id: "quiet-days", icon: "tea", image: crops.dayTea, key: "quiet" },
  { id: "letter", icon: "mail", image: crops.storyLetter, key: "letter" },
  { id: "future", icon: "moon", image: crops.storyCoda, key: "future" },
];

export const DECK_ITEMS = NAV_ITEMS.filter((item) => item.image);

export const PLAYLIST = [
  { id: "butterfly" as const, key: "meeting" as const, sub: "Opening" },
  { id: "past" as const, key: "past" as const, sub: "Past Life" },
  { id: "present" as const, key: "present" as const, sub: "This Life" },
  { id: "journey" as const, key: "journey" as const, sub: "On the Road" },
  { id: "quietDays" as const, key: "quiet" as const, sub: "Quiet Days" },
  { id: "moreDays" as const, key: "future" as const, sub: "More Days" },
];
