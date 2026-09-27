export const palette = {
  moonWhite: "#F7F3E9",
  daiQing: "#172B49",
  mistBlue: "#6F8FB7",
  butterflyBlue: "#4E83B5",
  paleGold: "#C7A66A",
  cinnabar: "#9C493E",
  night: "#0A1128",
  deepNight: "#050810",
} as const;

/**
 * Bump when rewriting public/media binaries in place.
 * Same path + new bytes is invisible to next/image & browser caches without this.
 */
export const MEDIA_REV = "20260927k";

/** Cache-bust polished media URLs (path stays under public/). */
export function media(path: string): string {
  if (!path.startsWith("/media/")) return path;
  return `${path}?v=${MEDIA_REV}`;
}

function mediaMap<T extends Record<string, string>>(obj: T): { [K in keyof T]: string } {
  const out = {} as { [K in keyof T]: string };
  for (const key of Object.keys(obj) as (keyof T)[]) {
    out[key] = media(obj[key]);
  }
  return out;
}

function mediaList(paths: readonly string[]): string[] {
  return paths.map(media);
}

/** Full sheets (synced from assert) — prefer `crops` for UI. */
export const images = mediaMap({
  logoFemale: "/media/image/001.png",
  logoBrand: "/media/image/002.png",
  nfcCard: "/media/image/003.png",
  cardAlt: "/media/image/004.png",
  posterMale: "/media/image/005.png",
  posterFemale: "/media/image/006.png",
  heroDesktop: "/media/image/007.png",
  butterflySheet: "/media/image/008.png",
  magpieSheet: "/media/image/009.png",
  bridgeSheet: "/media/image/010.png",
  endingHero: "/media/image/011.png",
  storyBoardA: "/media/image/012.png",
  storyBoardB: "/media/image/13.png",
  presentFive: "/media/image/14.png",
  presentSix: "/media/image/15.png",
  storyBoardC: "/media/image/16.png",
  storyBoardD: "/media/image/17.png",
  fullStory: "/media/image/18.png",
  uiDesktop: "/media/image/19.png",
  uiKit: "/media/image/20.png",
  uiExtra: "/media/image/21.png",
  uiMobile: "/media/image/22.png",
});

/** Cropped / sliced stills — permanent files under public/media/crops. */
export const crops = mediaMap({
  nfcFront: "/media/crops/nfc-front.webp",
  nfcBack: "/media/crops/nfc-back.webp",
  portraitHer: "/media/crops/portrait-her-card.webp",
  portraitHim: "/media/crops/portrait-him-card.webp",
  nfcAltFront: "/media/crops/nfc-alt-front.webp",
  nfcAltBack: "/media/crops/nfc-alt-back.webp",
  posterHim: "/media/crops/poster-him.webp",
  posterHer: "/media/crops/poster-her.webp",
  heroDesktop: "/media/crops/hero-desktop.webp",
  heroEnding: "/media/crops/hero-ending.webp",
  butterflyHero: "/media/crops/butterfly-hero.webp",
  butterflyFront: "/media/crops/butterfly-front.webp",
  butterflySide: "/media/crops/butterfly-side.webp",
  butterflyBack: "/media/crops/butterfly-back.webp",
  magpieHero: "/media/crops/magpie-hero.webp",
  magpieSpread: "/media/crops/magpie-spread.webp",
  magpieFlight: "/media/crops/magpie-flight.webp",
  magpieSide: "/media/crops/magpie-side.webp",
  magpiePerch: "/media/crops/magpie-perch.webp",
  magpieBack: "/media/crops/magpie-back.webp",
  bridgeNight: "/media/crops/bridge-night.webp",
  bridgeMorning: "/media/crops/bridge-morning.webp",
  bridgeDusk: "/media/crops/bridge-dusk.webp",
  bridgeSnow: "/media/crops/bridge-snow.webp",
  bridgeFull: "/media/crops/bridge-full.webp",
  meetShe: "/media/crops/meet-1-she.webp",
  meetHe: "/media/crops/meet-2-he.webp",
  meetBridge: "/media/crops/meet-3-bridge.webp",
  pastMuyun: "/media/crops/past-muyun.webp",
  pastChangfeng: "/media/crops/past-changfeng.webp",
  pastMeet: "/media/crops/past-meet.webp",
  pastTravel: "/media/crops/past-travel.webp",
  pastHold: "/media/crops/past-hold.webp",
  pastSeas: "/media/crops/past-seas.webp",
  lifeMeet: "/media/crops/life-1-meet.webp",
  lifeKnow: "/media/crops/life-2-know.webp",
  lifeRoad: "/media/crops/life-3-road.webp",
  lifeLuck: "/media/crops/life-4-luck.webp",
  lifeFuture: "/media/crops/life-5-future.webp",
  daySight: "/media/crops/day-1-sight.webp",
  dayDaily: "/media/crops/day-2-daily.webp",
  dayTravel: "/media/crops/day-3-travel.webp",
  daySpecial: "/media/crops/day-4-special.webp",
  dayTea: "/media/crops/day-5-tea.webp",
  dayTomorrow: "/media/crops/day-6-tomorrow.webp",
  roadWait: "/media/crops/road-1-wait.webp",
  roadDepart: "/media/crops/road-2-depart.webp",
  roadClimb: "/media/crops/road-3-climb.webp",
  roadRunHer: "/media/crops/road-4-run-her.webp",
  roadTrain: "/media/crops/road-5-train.webp",
  roadBeforeSunset: "/media/crops/road-6-before-sunset.webp",
  roadSunHolds: "/media/crops/road-7-sun-holds.webp",
  roadEmbrace: "/media/crops/road-8-embrace.webp",
  roadMoreDays: "/media/crops/road-9-more-days.webp",
  mythParting: "/media/crops/myth-1-parting.webp",
  mythWaiting: "/media/crops/myth-2-waiting.webp",
  mythRoad: "/media/crops/myth-3-road.webp",
  mythPhoenix: "/media/crops/myth-4-phoenix.webp",
  mythChains: "/media/crops/myth-5-chains.webp",
  mythRun: "/media/crops/myth-6-run.webp",
  mythEmbrace: "/media/crops/myth-7-embrace.webp",
  mythNeverSets: "/media/crops/myth-8-never-sets.webp",
  story1: "/media/crops/story-1.webp",
  story2: "/media/crops/story-2.webp",
  story3: "/media/crops/story-3.webp",
  story4: "/media/crops/story-4.webp",
  story5: "/media/crops/story-5.webp",
  /** File story-7.webp carries corner mark 6「奔向彼此」 */
  story6: "/media/crops/story-7.webp",
  /** File story-6.webp carries corner mark 7「终会相见」 */
  story7: "/media/crops/story-6.webp",
  story8: "/media/crops/story-8.webp",
  storyBanner: "/media/crops/story-banner.webp",
  storyQuietTea: "/media/crops/story-quiet-tea.webp",
  storyLetter: "/media/crops/story-letter.webp",
  storyCoda: "/media/crops/story-coda.webp",
});

/** Transparent subjects / flight / elements — permanent under public/media/parts. */
export const parts = {
  butterflyFlight: mediaList([
    "/media/parts/butterfly-flight-01.webp",
    "/media/parts/butterfly-flight-02.webp",
    "/media/parts/butterfly-flight-03.webp",
    "/media/parts/butterfly-flight-04.webp",
    "/media/parts/butterfly-flight-05.webp",
  ]),
  magpieFlight: mediaList([
    "/media/parts/magpie-flight-01.webp",
    "/media/parts/magpie-flight-02.webp",
    "/media/parts/magpie-flight-03.webp",
    "/media/parts/magpie-flight-04.webp",
    "/media/parts/magpie-flight-05.webp",
    "/media/parts/magpie-flight-06.webp",
  ]),
  butterflyFront: media("/media/parts/butterfly-front.webp"),
  butterflySide: media("/media/parts/butterfly-side.webp"),
  butterflyBack: media("/media/parts/butterfly-back.webp"),
  magpieSpread: media("/media/parts/magpie-pose-01.webp"),
  magpieSide: media("/media/parts/magpie-pose-02.webp"),
  magpiePerch: media("/media/parts/magpie-pose-03.webp"),
  magpieBack: media("/media/parts/magpie-pose-04.webp"),
  butterflyElements: mediaList(
    Array.from(
      { length: 21 },
      (_, i) => `/media/parts/butterfly-element-${String(i + 1).padStart(2, "0")}.webp`,
    ),
  ),
  magpieElements: mediaList(
    Array.from(
      { length: 23 },
      (_, i) => `/media/parts/magpie-element-${String(i + 1).padStart(2, "0")}.webp`,
    ),
  ),
  magpieElementsB: mediaList(
    Array.from(
      { length: 23 },
      (_, i) => `/media/parts/magpie-element-b-${String(i + 1).padStart(2, "0")}.webp`,
    ),
  ),
  /** Decorative floaters — butterflies + petals from element sheets */
  floaters: mediaList([
    "/media/parts/butterfly-element-01.webp",
    "/media/parts/butterfly-element-02.webp",
    "/media/parts/butterfly-element-04.webp",
    "/media/parts/butterfly-element-07.webp",
    "/media/parts/butterfly-element-09.webp",
    "/media/parts/magpie-element-01.webp",
    "/media/parts/magpie-element-03.webp",
  ]),
};

/** UI kit — connectivity-extracted buttons / chrome (not CSS pills). */
export const uiButtons = mediaMap({
  start: "/media/parts/ui-btn-start.webp",
  next: "/media/parts/ui-btn-next.webp",
  prev: "/media/parts/ui-btn-prev.webp",
  more: "/media/parts/ui-btn-more.webp",
  music: "/media/parts/ui-btn-music.webp",
  pause: "/media/parts/ui-btn-pause.webp",
  memory: "/media/parts/ui-btn-memory.webp",
  primaryMobile: "/media/parts/ui-btn-primary-mobile.webp",
  secondaryMobile: "/media/parts/ui-btn-secondary-mobile.webp",
});

export const uiChrome = {
  navBar: media("/media/parts/ui-nav-bar.webp"),
  dialog: media("/media/parts/ui-dialog.webp"),
  mobileParts: mediaList(
    Array.from(
      { length: 8 },
      (_, i) => `/media/parts/ui-mobile-part-${String(i + 1).padStart(2, "0")}.webp`,
    ),
  ),
};

/** Brand marks from assert/zip 001–002 (manual slices). */
export const brand = mediaMap({
  /** Portrait logo tile — loading / nav mark */
  icon: "/media/slices/001/001_06.webp",
  portrait: "/media/slices/001/001_01.webp",
  /** Main brand block with QDQC + motto */
  hero: "/media/slices/002/002_01.webp",
  wordmark: "/media/slices/002/002_05.webp",
  seal: "/media/slices/002/002_12.webp",
});

/** Extra bridge / atmosphere — prefer keyed parts when available. */
export const worldArt = mediaMap({
  bridgeHero: "/media/slices/010/010_01.webp",
  bridgeBanner: "/media/slices/010/010_02.webp",
  bridgeDetail: "/media/parts/bridge-row-01.webp",
  bridgeStrip: "/media/slices/010/010_23.webp",
  bridgeSnow: "/media/parts/bridge-snow-tile.webp",
  bridgeMorning: "/media/parts/bridge-morning-tile.webp",
  bridgeDusk: "/media/parts/bridge-dusk-tile.webp",
  butterflyDetail: "/media/slices/008/008_09.webp",
  magpieSheet: "/media/slices/009/009_02.webp",
});

/** Manual zip slice roots (full tile sets). Prefer `crops` / `parts` in UI. */
export const slices = {
  logo: "/media/slices/001",
  brand: "/media/slices/002",
  butterfly: "/media/slices/008",
  magpie: "/media/slices/009",
  bridge: "/media/slices/010",
  meeting: "/media/slices/012",
  past: "/media/slices/13",
  present: "/media/slices/14",
  days: "/media/slices/15",
  journey: "/media/slices/16",
  myth: "/media/slices/17",
  storyboard: "/media/slices/18",
  uiDesktop: "/media/slices/19",
  uiKit: "/media/slices/20",
  uiExtra: "/media/slices/21",
  uiMobile: "/media/slices/22",
} as const;

export const audio = {
  prologue: "/audio/prologue-01.m4a",
  prayer: "/audio/act1-02-prayer.m4a",
  response: "/audio/act1-03-response.m4a",
  butterfly: "/audio/act2-04-butterfly.m4a",
  magpieBridge: "/audio/act2-05-bridge.m4a",
  past: "/audio/act3-past.m4a",
  changfeng: "/audio/act3-07-changfeng.m4a",
  promise: "/audio/act3-08-promise.m4a",
  present: "/audio/act4-present.m4a",
  quietDays: "/audio/act4-10-quiet-days.m4a",
  journey: "/audio/act5-journey.m4a",
  dontHurry: "/audio/act5-12-dont-hurry.m4a",
  mountains: "/audio/act5-13-mountains.m4a",
  towardYou: "/audio/act5-14-toward-you.m4a",
  sunNeverSets: "/audio/act6-15-sun.m4a",
  reprise: "/audio/act6-16-reprise.m4a",
  moreDays: "/audio/act6-17-more-days.m4a",
} as const;
