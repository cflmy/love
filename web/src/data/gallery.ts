import { crops } from "./assets";

export type GalleryTile = {
  id: string;
  src: string;
  caption: string;
  /** Corner mark on the art (1…n within its series). */
  mark: number;
  /** Narrative series — same mark across series share a beat. */
  series:
    | "meet"
    | "story"
    | "life"
    | "day"
    | "road"
    | "myth"
    | "past";
};

/**
 * Waterfall stills ordered by corner mark, then story spine.
 * Caps match the numbers printed on the art — not filename order
 * (story-6.webp / story-7.webp files are swapped vs marks 6 / 7).
 */
export const MEMORY_WATERFALL: GalleryTile[] = [
  // —— mark 1 ——
  { id: "meet-1", src: crops.meetShe, caption: "她 · 渡河", mark: 1, series: "meet" },
  { id: "story-1", src: crops.story1, caption: "相逢鹊渡", mark: 1, series: "story" },
  { id: "life-1", src: crops.lifeMeet, caption: "相遇", mark: 1, series: "life" },
  { id: "day-1", src: crops.daySight, caption: "初见", mark: 1, series: "day" },
  { id: "road-1", src: crops.roadWait, caption: "等你", mark: 1, series: "road" },
  { id: "myth-1", src: crops.mythParting, caption: "别离", mark: 1, series: "myth" },

  // —— mark 2 ——
  { id: "meet-2", src: crops.meetHe, caption: "他 · 飞来", mark: 2, series: "meet" },
  { id: "story-2", src: crops.story2, caption: "今世相知", mark: 2, series: "story" },
  { id: "life-2", src: crops.lifeKnow, caption: "相知", mark: 2, series: "life" },
  { id: "day-2", src: crops.dayDaily, caption: "日常", mark: 2, series: "day" },
  { id: "road-2", src: crops.roadDepart, caption: "出发", mark: 2, series: "road" },
  { id: "myth-2", src: crops.mythWaiting, caption: "等候", mark: 2, series: "myth" },

  // —— mark 3 ——
  { id: "meet-3", src: crops.meetBridge, caption: "相逢鹊渡", mark: 3, series: "meet" },
  { id: "story-3", src: crops.story3, caption: "山高路远", mark: 3, series: "story" },
  { id: "life-3", src: crops.lifeRoad, caption: "山高路远", mark: 3, series: "life" },
  { id: "day-3", src: crops.dayTravel, caption: "远行", mark: 3, series: "day" },
  { id: "road-3", src: crops.roadClimb, caption: "翻山", mark: 3, series: "road" },
  { id: "myth-3", src: crops.mythRoad, caption: "长路", mark: 3, series: "myth" },

  // —— mark 4 ——
  { id: "story-4", src: crops.story4, caption: "原地等待", mark: 4, series: "story" },
  { id: "life-4", src: crops.lifeLuck, caption: "祥云聚顶", mark: 4, series: "life" },
  { id: "day-4", src: crops.daySpecial, caption: "特别", mark: 4, series: "day" },
  { id: "road-4", src: crops.roadRunHer, caption: "奔赴", mark: 4, series: "road" },
  { id: "myth-4", src: crops.mythPhoenix, caption: "凤凰", mark: 4, series: "myth" },

  // —— mark 5 ——
  { id: "story-5", src: crops.story5, caption: "凤凰照临", mark: 5, series: "story" },
  { id: "life-5", src: crops.lifeFuture, caption: "未来", mark: 5, series: "life" },
  { id: "day-5", src: crops.dayTea, caption: "两杯茶", mark: 5, series: "day" },
  { id: "road-5", src: crops.roadTrain, caption: "列车", mark: 5, series: "road" },
  { id: "myth-5", src: crops.mythChains, caption: "羁绊", mark: 5, series: "myth" },

  // —— mark 6 ——
  { id: "story-6", src: crops.story6, caption: "奔向彼此", mark: 6, series: "story" },
  { id: "day-6", src: crops.dayTomorrow, caption: "更远", mark: 6, series: "day" },
  { id: "road-6", src: crops.roadBeforeSunset, caption: "落日前", mark: 6, series: "road" },
  { id: "myth-6", src: crops.mythRun, caption: "奔赴", mark: 6, series: "myth" },

  // —— mark 7 ——
  { id: "story-7", src: crops.story7, caption: "终会相见", mark: 7, series: "story" },
  { id: "road-7", src: crops.roadSunHolds, caption: "太阳守候", mark: 7, series: "road" },
  { id: "myth-7", src: crops.mythEmbrace, caption: "相拥", mark: 7, series: "myth" },
  { id: "past-muyun", src: crops.pastMuyun, caption: "暮云", mark: 7, series: "past" },
  { id: "past-hold", src: crops.pastHold, caption: "相守", mark: 7, series: "past" },

  // —— mark 8 ——
  { id: "story-8", src: crops.story8, caption: "太阳永不落山", mark: 8, series: "story" },
  { id: "road-8", src: crops.roadEmbrace, caption: "归来", mark: 8, series: "road" },
  { id: "myth-8", src: crops.mythNeverSets, caption: "不落", mark: 8, series: "myth" },
  { id: "past-changfeng", src: crops.pastChangfeng, caption: "长风", mark: 8, series: "past" },
  { id: "past-travel", src: crops.pastTravel, caption: "初遇", mark: 8, series: "past" },
  { id: "past-meet", src: crops.pastMeet, caption: "同游", mark: 8, series: "past" },
  { id: "past-seas", src: crops.pastSeas, caption: "山海", mark: 8, series: "past" },
  { id: "road-9", src: crops.roadMoreDays, caption: "日后与君", mark: 8, series: "road" },
  // poster-her / poster-him omitted — cream studio plates flash white in the dark film
];
