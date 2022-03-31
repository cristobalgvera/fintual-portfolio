export default interface Portfolio {
  getCumulativeProfitBetweenDates(from: Date, to: Date): number;
  getAnnualizedProfitBetweenDates(from: Date, to: Date): number;
}
