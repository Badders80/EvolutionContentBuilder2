export type ContentType =
  | "race_preview"
  | "post_race"
  | "investor_report"
  | "trainer_update";

export interface HorseProfile {
  horse_id: string;
  horse_name: string;
  trainer_id?: string;
  primary_image_url?: string;
  mistable_url?: string;
  loveracing_url?: string;
  stable_profile_url?: string;
}

export interface TrainerProfile {
  trainer_id: string;
  trainer_name: string;
  stable_name?: string;
  profile_url?: string;
  image_url?: string;
}

export interface ContentDocument {
  id: string;
  content_type: ContentType;

  horse_id?: string;      // set if using a stored HorseProfile
  horse_name: string;     // always required

  trainer_id?: string;
  trainer_name?: string;

  race_name?: string;
  date: string;

  race_urls?: string[];   // paste miStable / TAB / LoveRacing links

  headline: string;
  subheading?: string;
  body_intro: string;
  body_details: string;
  body_highlights?: string[];
}
