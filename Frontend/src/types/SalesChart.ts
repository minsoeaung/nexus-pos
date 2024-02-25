export type MonthAmount = {
  month: string;
  amount: number;
}

export type SalesChart = {
  monthlySales: MonthAmount[],
  topSellingItems: TopSellingItem[],
  forYear: number
}

export type TopSellingItem = {
  name: string;
  amountSold: number;
  itemId: number;
}