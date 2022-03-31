import { Stock } from '@lib/stock';
import Portfolio from '../portfolio';

const INVALID_STOCK_PRICE_MESSAGE = 'Invalid stock price in date';

export default class SimplePortfolio implements Portfolio {
  private stocks: Stock[];

  constructor(stocks?: Stock[]) {
    this.stocks = stocks ?? [];
  }

  public getProfitBetweenDates(from: Date, to: Date): number {
    const profit = this.stocks.reduce((accumulatedProfit, stock) => {
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

    return Number(profit.toPrecision(3));
  }

  private calculateProfit(basePrice: number, toComparePrice: number): number {
    return (toComparePrice - basePrice) / basePrice;
  }
}
