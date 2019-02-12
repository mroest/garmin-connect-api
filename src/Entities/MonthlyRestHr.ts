import { List } from 'immutable';

export interface MonthlyRestHrInterface {
  date: string;
  restHr: number;
}

export type MonthlyRestHrCollection = List<MonthlyRestHrInterface>;
