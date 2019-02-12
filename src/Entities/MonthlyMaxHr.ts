import { List } from 'immutable';

export interface MonthlyMaxHrInterface {
  date: string;
  maxHr: number;
}

export type MonthlyMaxHrCollection = List<MonthlyMaxHrInterface>;
