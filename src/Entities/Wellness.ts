import { List } from 'immutable';

export interface WeeklySleepDuration {
  date: string;
  sleep: number;
}

export type WeeklySleepDurationCollection = List<WeeklySleepDuration>;
