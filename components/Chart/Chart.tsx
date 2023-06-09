"use client";
import { use } from "react";
import { getStockChart } from "@/common/https/finnhubAPI";
import { Ticker, StockCandle } from "@/common/interfaces";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const transformData = (rawData: StockCandle) => {
  if (rawData?.s === "no_data") {
    return [
      {
        data: [],
      },
    ];
  }

  return [
    {
      data: [...Array(rawData?.c?.length)].map((_, index) => [
        rawData.t[index],
        rawData?.o[index],
        rawData?.h[index],
        rawData?.l[index],
        rawData.c[index],
      ]),
    },
  ];
};

const getOptions = (chartName: string): ApexOptions => ({
  chart: {
    type: "candlestick",
    height: "auto",
    width: "100%",
  },
  title: {
    text: chartName,
    align: "left",
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
  noData: {
    text: "No data, try different value",
    align: "center",
    verticalAlign: "middle",
    style: {
      color: "#5555bf",
      fontSize: "1.5rem",
      fontFamily: "Franklin Gothic Medium",
    },
  },
});

interface Props extends Ticker {
  resolution?: "D" | "W" | "M";
  startTimeStamp: number;
  endTimeStamp: number;
}

const Chart = ({
  companyName = "Tibor's Crypto Scheme",
  displaySymbol,
  startTimeStamp,
  endTimeStamp,
  resolution = "D",
}: Props) => {
  const data = use(
    getStockChart(displaySymbol, resolution, startTimeStamp, endTimeStamp)
  );

  return (
    <>
      <ReactApexCharts
        options={getOptions(companyName)}
        series={data?.c?.length ? transformData(data) : []}
        type="candlestick"
        height={500}
      />
    </>
  );
};

export default Chart;
