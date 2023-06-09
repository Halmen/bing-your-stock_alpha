import { cache } from "react";
import {
  StockQuoteSchema,
  StockCandleSchema,
  SymbolLookUpSchema,
  StockQuoteModel,
  StockCandleModel,
  SymbolLookUpModel,
} from "@/common/zodSchemas";

export const getStockSymbolLookup = cache(
  (searchSymbol: string): Promise<SymbolLookUpModel> =>
    fetch(
      `https://finnhub.io/api/v1/search?q=${searchSymbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => SymbolLookUpSchema.parse(data))
      .catch((error) => error)
);

export const getStockQuote = (stockTicker: string): Promise<StockQuoteModel> =>
  fetch(
    `https://finnhub.io/api/v1/quote?symbol=${stockTicker}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_TOKEN}`,
    { next: { revalidate: 15 } }
  )
    .then((response) => response.json())
    .then((data) => StockQuoteSchema.parse(data))
    .catch((error) => error);

export const getStockChart = cache(
  (
    stockTicker: string,
    resolution: string,
    lastYearTimestamp: number,
    currentTimestamp: number
  ): Promise<StockCandleModel> =>
    fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${stockTicker}&resolution=${resolution}&from=${lastYearTimestamp}&to=${currentTimestamp}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => StockCandleSchema.parse(data))
      .catch((error) => error)
);
