import { List } from 'immutable';

export interface MonthlyStepsInterface {
  date: string;
  steps: number;
}

export type MonthlyStepsCollection = List<MonthlyStepsInterface>;
