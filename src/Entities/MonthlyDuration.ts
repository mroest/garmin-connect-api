import { List } from 'immutable';

export interface MonthlyDurationInterface {
  date: string;
  duration: number;
  activities: number;
}

export type MonthlyDurationCollection = List<MonthlyDurationInterface>;
