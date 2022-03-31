import { Stock } from '@lib/stock';
import SimplePortfolio from './simple-portfolio';

describe('simple portfolio', () => {
  const FROM_DATE = new Date('2022-03-10');
  const TO_DATE = new Date('2022-03-15');

  class TestStock implements Stock {
    public fromPrice: number;
    public toPrice: number;

    constructor(expectedFromPrice?: number, expectedToPrice?: number) {
      this.fromPrice = expectedFromPrice ?? 0;
      this.toPrice = expectedToPrice ?? 0;
    }

    public getPriceByDate(date: Date): number {
      if (date === FROM_DATE) return this.fromPrice;

      return this.toPrice;
    }
  }

  it.each([
    [[9, 10], [4, 5], 0.361],
    [[20, 25], [10, 5], -0.25],
    [[10, 10], [5, 1], -0.8],
    [[10, 9], [5, 4], -0.3],
    [[10, 5], [5, 10], 0.5],
    [[10, 10], [5, 5], 0],
  ])(
    'should get profit between two dates for %p and %p stocks, expecting %p',
    ([from1, to1], [from2, to2], expected) => {
      // given
      const stocks = [new TestStock(from1, to1), new TestStock(from2, to2)];
      const portfolio = new SimplePortfolio(stocks);

      // when
      const actual = portfolio.getProfitBetweenDates(FROM_DATE, TO_DATE);

      // then
      expect(actual).toEqual(expected);
    },
  );

  it('should get profit zero when portfolio has no stocks', () => {
    // given
    const portfolio = new SimplePortfolio();

    // when
    const actual = portfolio.getProfitBetweenDates(FROM_DATE, TO_DATE);

    // then
    expect(actual).toEqual(0);
  });

  it('should throw an error if base stock price is zero', () => {
    // given
    const portfolio = new SimplePortfolio([new TestStock(0, 1)]);

    // when
    // then
    expect(() =>
      portfolio.getProfitBetweenDates(FROM_DATE, TO_DATE),
    ).toThrowError(/Invalid stock price/);
  });

  it('should throw an error if to compate stock price is zero', () => {
    // given
    const portfolio = new SimplePortfolio([new TestStock(1, 0)]);

    // when
    // then
    expect(() =>
      portfolio.getProfitBetweenDates(FROM_DATE, TO_DATE),
    ).toThrowError(/Invalid stock price/);
  });
});
