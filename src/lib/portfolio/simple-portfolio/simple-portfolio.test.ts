import { Stock } from '@lib/stock';
import SimplePortfolio from './simple-portfolio';

describe('simple portfolio', () => {
  describe('cumulative profit', () => {
    const FROM_DATE = new Date('2022-01-01');
    const TO_DATE = new Date('2022-01-30');

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
      [[9, 10], [4, 5], 0.3611],
      [[20, 25], [10, 5], -0.25],
      [[10, 10], [5, 1], -0.8],
      [[10, 9], [5, 4], -0.3],
      [[10, 5], [5, 10], 0.5],
      [[10, 10], [5, 5], 0],
    ])(
      'should get cumulative profit between two dates for %p and %p stocks, expecting %p',
      ([priceFrom1, priceTo1], [priceFrom2, priceTo2], expected) => {
        // given
        const stocks = [
          new TestStock(priceFrom1, priceTo1),
          new TestStock(priceFrom2, priceTo2),
        ];
        const portfolio = new SimplePortfolio(stocks);

        // when
        const actual = portfolio.getCumulativeProfitBetweenDates(
          FROM_DATE,
          TO_DATE,
        );

        // then
        expect(actual).toEqual(expected);
      },
    );

    it('should get cumulative profit zero when portfolio has no stocks', () => {
      // given
      const portfolio = new SimplePortfolio();

      // when
      const actual = portfolio.getCumulativeProfitBetweenDates(
        FROM_DATE,
        TO_DATE,
      );

      // then
      expect(actual).toEqual(0);
    });

    it.each([[[0, 1]], [[1, 0]], [[0, 0]]])(
      'should throw an error if either base or to compare stock price is zero: %p',
      ([priceFrom, priceTo]) => {
        // given
        const portfolio = new SimplePortfolio([
          new TestStock(priceFrom, priceTo),
        ]);

        // when
        // then
        expect(() =>
          portfolio.getCumulativeProfitBetweenDates(FROM_DATE, TO_DATE),
        ).toThrowError(/Invalid stock price/);
      },
    );

    it.each([[[TO_DATE, FROM_DATE]], [[FROM_DATE, FROM_DATE]]])(
      'should throw an error if base date is greater than or equal to compare one: %p',
      ([dateFrom, dateTo]) => {
        // given
        const portfolio = new SimplePortfolio();

        // when
        // then
        expect(() =>
          portfolio.getCumulativeProfitBetweenDates(dateFrom, dateTo),
        ).toThrowError(/Invalid data range/);
      },
    );
  });

  describe('annualized profit', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    })

    it.each([
      [575, 0.2374, 0.1448],
      [365, 0.11, 0.11],
      [730, 0.15, 0.07238],
      [10, 0.06, 7.388],
    ])(
      'should get to %p days held and %p cumulative profit, %p annualized profit',
      (daysHeld, cumulativeProfit, expected) => {
        // given
        const portfolio = new SimplePortfolio();

        jest
          .spyOn(portfolio, 'getCumulativeProfitBetweenDates')
          .mockReturnValue(cumulativeProfit);

        // mocking private method
        const calculateDaysHeldBetweenDates = jest.spyOn(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          SimplePortfolio.prototype as any,
          'calculateDaysHeldBetweenDates',
        );

        calculateDaysHeldBetweenDates.mockReturnValue(daysHeld);

        // when
        const actual = portfolio.getAnnualizedProfitBetweenDates(
          new Date(),
          new Date(),
        );

        // then
        expect(actual).toEqual(expected);

        expect(portfolio.getCumulativeProfitBetweenDates).toHaveBeenCalledTimes(
          1,
        );
        expect(calculateDaysHeldBetweenDates).toHaveBeenCalledTimes(1);
      },
    );
  });
});
