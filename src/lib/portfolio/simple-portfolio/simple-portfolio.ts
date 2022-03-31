import { Stock } from '@lib/stock';
import Portfolio from '../portfolio';

export default class SimplePortfolio implements Portfolio {
  private stocks: Stock[];

  constructor(stocks?: Stock[]) {
    this.stocks = stocks ?? [];
  }

  public getProfitBetweenDates(from: Date, to: Date): number {
    return this.stocks.reduce((accumulatedProfit, stock) => {
      const basePrice = stock.getPriceByDate(from);
      const toComparePrice = stock.getPriceByDate(to);

      return (
        accumulatedProfit + this.calculateProfit(basePrice, toComparePrice)
      );
    }, 0);
  }

  private calculateProfit(basePrice: number, toComparePrice: number): number {
    return toComparePrice - basePrice;
  }
}
