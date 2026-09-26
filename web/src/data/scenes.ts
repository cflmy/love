import { crops } from "./assets";

export type SceneBeat = {
  id: string;
  image: string;
  caption: string;
  line?: string;
  layout?: "full" | "split" | "pair" | "triptych" | "grid";
  images?: string[];
};

/** Inter-act visual beats — each uses a real cropped still. */
export const prayerScenes: SceneBeat[] = [
  {
    id: "prayer-banner",
    image: crops.storyBanner,
    caption: "我们一起祈祷",
    line: "Que dure, que câlin.",
    layout: "full",
  },
  {
    id: "prayer-pair",
    image: crops.posterHer,
    caption: "愿天长地久",
    line: "愿紧紧相拥",
    layout: "pair",
    images: [crops.posterHer, crops.posterHim],
  },
];

export const responseScenes: SceneBeat[] = [
  {
    id: "response-tea",
    image: crops.storyQuietTea,
    caption: "时间的回应",
    line: "Quiet days, quiet cuddles.",
    layout: "full",
  },
  {
    id: "response-days",
    image: crops.dayDaily,
    caption: "陪伴的日子安宁",
    line: "坚定的拥抱无声",
    layout: "pair",
    images: [crops.daySight, crops.dayDaily],
  },
];

export const meetingScenes: SceneBeat[] = [
  {
    id: "meet-she",
    image: crops.meetShe,
    caption: "她渡河",
    line: "河雾里，有人朝桥走来。",
    layout: "full",
  },
  {
    id: "meet-he",
    image: crops.meetHe,
    caption: "他从远方来",
    line: "灯火一盏盏，像在叫他的名字。",
    layout: "full",
  },
  {
    id: "meet-bridge",
    image: crops.meetBridge,
    caption: "桥灯亮起",
    line: "相逢鹊渡。",
    layout: "full",
  },
  {
    id: "meet-creatures",
    image: crops.butterflyHero,
    caption: "化蝶 · 化鹊",
    layout: "pair",
    images: [crops.butterflyHero, crops.magpieHero],
  },
  {
    id: "meet-hours",
    image: crops.bridgeNight,
    caption: "四季鹊桥",
    layout: "grid",
    images: [
      crops.bridgeNight,
      crops.bridgeMorning,
      crops.bridgeDusk,
      crops.bridgeSnow,
    ],
  },
];

export const pastScenes: SceneBeat[] = [
  {
    id: "past-muyun",
    image: crops.pastMuyun,
    caption: "暮云",
    line: "君为暮云我为风，生生世世不相离。",
    layout: "full",
  },
  {
    id: "past-changfeng",
    image: crops.pastChangfeng,
    caption: "长风",
    line: "君为长风我为云，世世生生不相弃。",
    layout: "full",
  },
  {
    id: "past-four",
    image: crops.pastMeet,
    caption: "前世四景",
    layout: "grid",
    images: [crops.pastMeet, crops.pastTravel, crops.pastHold, crops.pastSeas],
  },
  {
    id: "myth-arc",
    image: crops.mythParting,
    caption: "仙侠侧记",
    layout: "grid",
    images: [
      crops.mythParting,
      crops.mythWaiting,
      crops.mythRoad,
      crops.mythPhoenix,
    ],
  },
];

export const presentScenes: SceneBeat[] = [
  {
    id: "life-meet",
    image: crops.lifeMeet,
    caption: "相遇",
    line: "人海之中，很幸运，我们相遇了。",
    layout: "full",
  },
  {
    id: "life-know",
    image: crops.lifeKnow,
    caption: "相知",
    line: "一起发呆，一起做很多平凡的小事。",
    layout: "full",
  },
  {
    id: "life-three",
    image: crops.lifeRoad,
    caption: "人间三事",
    layout: "triptych",
    images: [crops.lifeRoad, crops.lifeLuck, crops.lifeFuture],
  },
];

export const journeyLeadIn: SceneBeat[] = [
  {
    id: "road-wait",
    image: crops.roadWait,
    caption: "等待",
    line: "你别担心。",
    layout: "full",
  },
  {
    id: "road-depart",
    image: crops.roadDepart,
    caption: "出发",
    line: "太阳落山前我一定回来。",
    layout: "pair",
    images: [crops.roadDepart, crops.roadClimb],
  },
  {
    id: "road-run",
    image: crops.roadRunHer,
    caption: "奔赴",
    layout: "triptych",
    images: [crops.roadRunHer, crops.roadTrain, crops.roadBeforeSunset],
  },
];

export const journeyOutro: SceneBeat[] = [
  {
    id: "road-hold",
    image: crops.roadSunHolds,
    caption: "只要你回来",
    line: "太阳永不落山。",
    layout: "pair",
    images: [crops.roadSunHolds, crops.roadEmbrace],
  },
  {
    id: "myth-break",
    image: crops.mythChains,
    caption: "枷锁既破",
    layout: "grid",
    images: [
      crops.mythChains,
      crops.mythRun,
      crops.mythEmbrace,
      crops.mythNeverSets,
    ],
  },
  {
    id: "road-more",
    image: crops.roadMoreDays,
    caption: "日后与君",
    line: "平安喜乐。",
    layout: "full",
  },
];

export const storyStrip = [
  crops.story1,
  crops.story2,
  crops.story3,
  crops.story4,
  crops.story5,
  crops.story6,
  crops.story7,
  crops.story8,
];
