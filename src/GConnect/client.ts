import { MonthlyRestHrCollection, MonthlyRestHrInterface } from '../Entities/MonthlyRestHr';
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough, { CookieJar } from 'tough-cookie';
import { MonthlyMaxHrCollection, MonthlyMaxHrInterface } from '../Entities/MonthlyMaxHr';
import { List } from 'immutable';
import { MonthlyDistanceCollection, MonthlyDistanceInterface } from '../Entities/MonthlyDistance';
import { MonthlyDurationCollection, MonthlyDurationInterface } from '../Entities/MonthlyDuration';
import { SSM } from 'aws-sdk';
import { MonthlyStepsCollection, MonthlyStepsInterface } from '../Entities/MonthlySteps';
import moment from 'moment';
import config from '../../config';
import { WeeklySleepDuration, WeeklySleepDurationCollection } from '../Entities/Wellness';

export type GConnectTicket = string;

interface ActivityParams {
  aggregation: 'monthly' | 'weekly';
  startDate: string;
  userFirstDay: string;
  groupByParentActivityType: boolean;
  endDate: string;
  metric: string;
}

interface WellnessParams {
  fromMonthStartDate: string;
  untilMonthStartDate: string;
  metricId: number;
}

class GConnect {
  private static getEndDate = (): string => {
    return moment().format('YYYY-MM-') + moment().endOf('month').format('DD');
  };

  private static getActivityParams(metric: string): ActivityParams {
    return {
      aggregation: 'monthly',
      userFirstDay: 'monday',
      groupByParentActivityType: false,
      startDate: moment().subtract(3, 'months').format('YYYY-MM-01'),
      endDate: this.getEndDate(),
      metric,
    };
  }

  private static getWellnessParams(metric?: number): WellnessParams {
    return {
      fromMonthStartDate: moment().subtract(3, 'months').format('YYYY-MM-01'),
      untilMonthStartDate: this.getEndDate(),
      metricId: metric || 29,
    };
  }

  private readonly axios: AxiosInstance;
  private readonly cookieJar: CookieJar;
  private readonly requestConfig: AxiosRequestConfig;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
    this.cookieJar = new tough.CookieJar();
    axiosCookieJarSupport(this.axios);

    this.requestConfig = {
      withCredentials: true,
      jar: this.cookieJar,
      validateStatus: (status: number) => {
        return status >= 200 && status <= 302;
      },
    };

  }

  public async getWeeklySleepDuration(): Promise<WeeklySleepDurationCollection> {
    await this.login();
    const response = await Axios.get(
      config.GARMIN_CONNECT.WELLNESS_WEEKLY_URL,
      { ...this.requestConfig, ...{ params: GConnect.getWellnessParams(26) } },
    );
    if (!response.data.allMetrics.metricsMap.WELLNESS_TOTAL_STEPS) {
      throw new Error('Invalid response');
    }
    return List(response.data.allMetrics.metricsMap.SLEEP_SLEEP_DURATION.map((item: any): WeeklySleepDuration => {
      return {
        date: `${item.month.year}-${String(item.month.monthId).padStart(2, '0')}-01`,
        sleep: item.value,
      };
    }));
  }

  public async getMaxHrData(): Promise<MonthlyMaxHrCollection> {
    await this.login();

    const response = await Axios.get(
      config.GARMIN_CONNECT.ACTIVITY_URL,
      { ...this.requestConfig, ...{ params: GConnect.getActivityParams('maxHr') } },
    );

    return List(response.data.map((item: any): MonthlyMaxHrInterface => {
      return {
        date: item.date,
        maxHr: item.stats.all.maxHr.max,
      };
    }));
  }

  public async getMonthlySteps(): Promise<MonthlyStepsCollection> {
    await this.login();

    const response = await Axios.get(
      config.GARMIN_CONNECT.WELLNESS_MONTHLY_URL,
      { ...this.requestConfig, ...{ params: GConnect.getWellnessParams() } },
    );

    if (!response.data.allMetrics.metricsMap.WELLNESS_TOTAL_STEPS) {
      throw new Error('Invalid response');
    }
    return List(response.data.allMetrics.metricsMap.WELLNESS_TOTAL_STEPS.map((item: any): MonthlyStepsInterface => {
      return {
        date: `${item.month.year}-${String(item.month.monthId).padStart(2, '0')}-01`,
        steps: item.value,
      };
    }));
  }

  public async getMonthlyRestHr(): Promise<MonthlyRestHrCollection> {
    await this.login();
    const response = await Axios.get(
      config.GARMIN_CONNECT.WELLNESS_MONTHLY_URL,
      { ...this.requestConfig, ...{ params: GConnect.getWellnessParams(60) } },
    );
    if (!response.data.allMetrics.metricsMap.WELLNESS_RESTING_HEART_RATE) {
      throw new Error('Invalid response');
    }
    return List(response.data.allMetrics.metricsMap.WELLNESS_RESTING_HEART_RATE.map((item: any): MonthlyRestHrInterface => {
      return {
        date: `${item.month.year}-${String(item.month.monthId).padStart(2, '0')}-01`,
        restHr: item.value,
      };
    }));
  }

  public async getMonthlyDistance(): Promise<MonthlyDistanceCollection> {
    await this.login();

    const response = await Axios.get(
      config.GARMIN_CONNECT.ACTIVITY_URL,
      { ...this.requestConfig, ...{ params: GConnect.getActivityParams('distance') } },
    );

    return List(response.data.map((item: any): MonthlyDistanceInterface => {
      return {
        date: item.date,
        distance: Math.round(item.stats.all.distance.sum / 100000),
        activities: item.stats.all.distance.count,
      };
    }));
  }

  public async getMonthlyDuration(): Promise<MonthlyDurationCollection> {
    await this.login();

    const response = await Axios.get(
      config.GARMIN_CONNECT.ACTIVITY_URL,
      { ...this.requestConfig, ...{ params: GConnect.getActivityParams('duration') } },
    );

    return List(response.data.map((item: any): MonthlyDurationInterface => {
      return {
        date: item.date,
        duration: Math.round(item.stats.all.duration.sum),
        activities: item.stats.all.duration.count,
      };
    }));
  }

  private async login(): Promise<GConnectTicket> {
    await Axios.get(config.GARMIN_CONNECT.SSO_URL, this.requestConfig);
    const paramStore = new SSM();
    const getParameterResult = await paramStore.getParameter({ Name: 'gc_password' }).promise();
    if (!getParameterResult.Parameter) {
      throw new Error('Unable to get parameter store value');
    }
    const response = await Axios.post(
      config.GARMIN_CONNECT.SSO_URL,
      `${config.GARMIN_CONNECT.EMAIL}&embed=false&password=${getParameterResult.Parameter.Value}`,
      {
        ...this.requestConfig, ...{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
    );
    const matched: string[] | null = response.data.match(/(ST-[-0-9a-zA-Z]+-cas)/gm);

    if (matched == null) {
      throw new Error('Unable to login');
    }
    const ticket = matched.pop();
    await Axios.get(`https://connect.garmin.com/modern/?ticket=${ticket}`, this.requestConfig);
    return ticket || '';
  }
}

export default GConnect;
