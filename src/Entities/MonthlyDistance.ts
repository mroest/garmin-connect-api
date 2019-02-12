import { List } from 'immutable';

export interface MonthlyDistanceInterface {
  date: string;
  distance: number;
  activities: number;
}

export type MonthlyDistanceCollection = List<MonthlyDistanceInterface>;
