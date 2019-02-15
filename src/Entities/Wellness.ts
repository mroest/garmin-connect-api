import { List } from 'immutable';

export interface WeeklySleepDuration {
  date: string;
  sleep: number;
}

export interface WeeklyRestHeartRate {
  date: string;
  restHr: number;
}

export interface WeeklyStressLevel {
  date: string;
  stressLevel: number;
}

export type WeeklyRestHeartRateCollection = List<WeeklyRestHeartRate>;
export type WeeklySleepDurationCollection = List<WeeklySleepDuration>;
export type WeeklyStressLevelCollection = List<WeeklyStressLevel>;
