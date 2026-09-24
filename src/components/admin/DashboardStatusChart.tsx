"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardStatusChart({ title, description, labels, values, color }: { title: string; description: string; labels: string[]; values: number[]; color: string }) {
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif", background: "transparent" },
    plotOptions: { bar: { borderRadius: 5, columnWidth: "52%" } },
    colors: [color], dataLabels: { enabled: false }, legend: { show: false },
    xaxis: { categories: labels, labels: { style: { colors: "#6B7280", fontSize: "11px" }, trim: true, hideOverlappingLabels: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, forceNiceScale: true, labels: { style: { colors: "#6B7280", fontSize: "11px" }, formatter: (value) => Math.round(value).toString() } },
    grid: { borderColor: "#E5E7EB", strokeDashArray: 4, padding: { left: 0, right: 0 } },
    tooltip: { theme: "dark", y: { formatter: (value) => `${value} registro${value === 1 ? "" : "s"}` } },
    theme: { mode: "light" },
  };
  return <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]"><h2 className="font-semibold text-gray-800 dark:text-white/90">{title}</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p><div className="mt-4 h-72"><Chart options={options} series={[{ name: title, data: values }]} type="bar" height="100%" /></div></section>;
}
