import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { Sale } from "lib/types/Sale";
import { useEffect, useState } from "react";
import {
  getMinTokenPriceAgainstETH,
  getTokenPriceAgainstETHWithMinPrice,
} from "lib/utils";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  TimeScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function PriceChart({ sale }: { sale: Sale }) {
  const [options, setOptions] = useState({});
  let defaultData = {
    datasets: [
      {
        data: [],
        fill: false,
        pointRadius: 0,
        showLine: false,
        borderDash: [5, 5],
        pointBackgroundColor: "rgb(0, 0, 0, 0.8)",
        borderColor: "rgb(0, 0, 0, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        data: [],
        fill: true,
        pointRadius: 2,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const [data, setData] = useState<
    ChartData<
      "line",
      {
        x: number;
        y: number;
      }[],
      unknown
    >
  >(defaultData);

  useEffect(() => {
    const newData = sale.contributions.map((contribution) => {
      return {
        x: contribution.receivedAt * 1000,
        y: getTokenPriceAgainstETHWithMinPrice(
          sale.minRaisedAmount,
          sale.allocatedAmount,
          contribution.totalRaised,
          Number(sale.tokenDecimals)
        ).toNumber(),
      };
    });
    // Price at the sale start
    newData.unshift({
      x: sale.startingAt * 1000,
      y: getMinTokenPriceAgainstETH(
        sale.minRaisedAmount,
        sale.allocatedAmount,
        Number(sale.tokenDecimals)
      ).toNumber(),
    });
    // Price now
    const now = new Date().getTime();
    newData.push({
      x: now > sale.closingAt * 1000 ? sale.closingAt * 1000 : now,
      y: getTokenPriceAgainstETHWithMinPrice(
        sale.minRaisedAmount,
        sale.allocatedAmount,
        sale.totalRaised,
        Number(sale.tokenDecimals)
      ).toNumber(),
    });
    newData.sort((a, b) => a.x - b.x);
    setOptions({
        responsive: true,
        plugins: {
            legend: {
            display: false,
            position: "top" as const,
            },
            title: {
            display: true,
            text: `1 ${sale.tokenSymbol.toUpperCase()} = ${getTokenPriceAgainstETHWithMinPrice(
                sale.minRaisedAmount,
                sale.allocatedAmount,
                sale.totalRaised,
                Number(sale.tokenDecimals)
            ).toFixed(8)} ETH`,
            font: { weight: "bold", size: 18 },
            color: "white",
            },
            tooltip: {
            callbacks: {
                label: function (context: any) {
                return `${context.raw.y.toFixed(8)} ETH`;
                },
            },
            },
        },
        scales: {
            x: {
            display: true,
            type: "time" as const,
            time: {
                unit: "day" as const,
                displayFormats: {
                day: "YYYY/MM/DD",
                },
            },
            // min: new Date(sale.startingAt * 1000).getTime(),
            max: new Date(sale.closingAt * 1000).getTime(),
            ticks: {
                autoSkip: true,
                maxTicksLimit: 5,
            },
            },
            y: {
            position: "right" as const,
            // min: getMinTokenPriceAgainstETH(sale.minRaisedAmount, sale.allocatedAmount, sale.tokenDecimals).toNumber(),
            // max: getTokenPriceAgainstETHWithMinPrice(sale.minRaisedAmount, sale.allocatedAmount, sale.totalRaised, sale.tokenDecimals).times(1.2).toNumber(),
            ticks: {
                callback: function (value: string | number) {
                return `${Number(value).toFixed(8)}`;
                },
            },
            },
        },
    });
    setData({
        datasets: [
          {
            data: [],
            fill: false,
            pointRadius: 0,
            showLine: false,
            borderDash: [5, 5],
            pointBackgroundColor: "rgb(0, 0, 0, 0.8)",
            borderColor: "rgb(0, 0, 0, 0.6)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            data: newData,
            fill: true,
            pointRadius: 2,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });
  }, [sale]);

  return <Line options={options} data={data} />;
}
