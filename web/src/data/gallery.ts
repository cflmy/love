import { crops } from "./assets";

export type GalleryTile = {
  id: string;
  src: string;
  caption: string;
};

/**
 * Waterfall / masonry stills — storyboard + myth + life plates
 * that were registered in crops but barely surfaced in the film UI.
 */
export const MEMORY_WATERFALL: GalleryTile[] = [
  { id: "w-story1", src: crops.story1, caption: "鹊渡" },
  { id: "w-story2", src: crops.story2, caption: "長河" },
  { id: "w-story3", src: crops.story3, caption: "灯火" },
  { id: "w-story4", src: crops.story4, caption: "相守" },
  { id: "w-story5", src: crops.story5, caption: "岁月" },
  { id: "w-story6", src: crops.story6, caption: "归途" },
  { id: "w-story7", src: crops.story7, caption: "信笺" },
  { id: "w-story8", src: crops.story8, caption: "明天" },
  { id: "w-banner", src: crops.storyBanner, caption: "QDQC" },
  { id: "w-myth1", src: crops.mythParting, caption: "别离" },
  { id: "w-myth2", src: crops.mythWaiting, caption: "等候" },
  { id: "w-myth3", src: crops.mythRoad, caption: "长路" },
  { id: "w-myth4", src: crops.mythPhoenix, caption: "凤凰" },
  { id: "w-myth5", src: crops.mythChains, caption: "羁绊" },
  { id: "w-myth6", src: crops.mythRun, caption: "奔赴" },
  { id: "w-myth7", src: crops.mythEmbrace, caption: "相拥" },
  { id: "w-myth8", src: crops.mythNeverSets, caption: "不落" },
  { id: "w-life2", src: crops.lifeKnow, caption: "相知" },
  { id: "w-life3", src: crops.lifeRoad, caption: "同行" },
  { id: "w-life4", src: crops.lifeLuck, caption: "幸运" },
  { id: "w-life5", src: crops.lifeFuture, caption: "未来" },
  { id: "w-day1", src: crops.daySight, caption: "初见" },
  { id: "w-day2", src: crops.dayDaily, caption: "日常" },
  { id: "w-day3", src: crops.dayTravel, caption: "远行" },
  { id: "w-day4", src: crops.daySpecial, caption: "特别" },
  { id: "w-day5", src: crops.dayTea, caption: "两杯茶" },
  { id: "w-day6", src: crops.dayTomorrow, caption: "更远" },
  { id: "w-road1", src: crops.roadWait, caption: "等候" },
  { id: "w-road3", src: crops.roadClimb, caption: "翻山" },
  { id: "w-road5", src: crops.roadTrain, caption: "列车" },
  { id: "w-road8", src: crops.roadEmbrace, caption: "归来" },
  { id: "w-poster-her", src: crops.posterHer, caption: "她" },
  { id: "w-poster-him", src: crops.posterHim, caption: "他" },
];
