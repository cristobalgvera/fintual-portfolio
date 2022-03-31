import { Stock } from '@lib/stock';
import Portfolio from '../portfolio';

const DEFAULT_PRECISION = 4;
const INVALID_STOCK_PRICE_MESSAGE = 'Invalid stock price in date';
const INVALID_DATA_RANGE =
  'Invalid data range, to compare date must be greater than to base date';

export default class SimplePortfolio implements Portfolio {
  private stocks: Stock[];

  constructor(stocks?: Stock[]) {
    this.stocks = stocks ?? [];
  }
  getAnnualizedProfitBetweenDates(from: Date, to: Date): number {
    const cumulativeProfit = this.getCumulativeProfitBetweenDates(from, to);
    const daysHeld = this.calculateDaysHeldBetweenDates(from, to);

    const annualizedProfit = Math.pow(1 + cumulativeProfit, 365 / daysHeld) - 1;

    return this.truncateNumber(annualizedProfit);
  }

  public getCumulativeProfitBetweenDates(from: Date, to: Date): number {
    if (from >= to) throw new Error(INVALID_DATA_RANGE);

    const cumulativeProfit = this.stocks.reduce((accumulatedProfit, stock) => {
      const basePrice = stock.getPriceByDate(from);

      if (basePrice === 0)
        throw new Error(`${INVALID_STOCK_PRICE_MESSAGE} ${from.toISOString()}`);

      const toComparePrice = stock.getPriceByDate(to);

      if (toComparePrice === 0)
        throw new Error(`${INVALID_STOCK_PRICE_MESSAGE} ${to.toISOString()}`);

      return (
        accumulatedProfit + this.calculateProfit(basePrice, toComparePrice)
      );
    }, 0);

    return this.truncateNumber(cumulativeProfit);
  }

  private calculateDaysHeldBetweenDates(from: Date, to: Date): number {
    return (to.getTime() - from.getTime()) / (1000 * 3600 * 24);
  }

  private truncateNumber(n: number) {
    return Number(n.toPrecision(DEFAULT_PRECISION));
  }

  private calculateProfit(basePrice: number, toComparePrice: number): number {
    return (toComparePrice - basePrice) / basePrice;
  }
}
