import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import type { PageResponse } from "@/lib/admin/types";
import type { ReactNode } from "react";
import PaginationControls from "./PaginationControls";

type Column<T> = { label: string; value: (item: T) => ReactNode };

export default function AdminTable<T>({
  title,
  data,
  columns,
  filters,
  rowClassName,
  tools,
}: {
  title: string;
  data: PageResponse<T> | null;
  columns: Column<T>[];
  filters: ReactNode;
  rowClassName?: (item: T) => string;
  tools?: ReactNode;
}) {
  return (
    <>
      <PageBreadcrumb pageTitle={title} />
      <ComponentCard title={title}>
        {tools}
        <form className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">{filters}<button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600" type="submit">Apply filters</button></form>
        {!data ? <p className="text-sm text-gray-500 dark:text-gray-400">We could not load this data. Check your session and try again.</p> : (<>
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader className="border-y border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03]"><TableRow>{columns.map((column) => <TableCell key={column.label} isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">{column.label}</TableCell>)}</TableRow></TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {data.content.map((item, index) => <TableRow key={index} className={rowClassName?.(item)}>{columns.map((column) => <TableCell key={column.label} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{column.value(item)}</TableCell>)}</TableRow>)}
              </TableBody>
            </Table>
            {data.content.length === 0 && <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No records found.</p>}
          </div>
          <div className="grid gap-3 md:hidden">{data.content.map((item, index) => <article key={index} className={`rounded-xl border border-gray-200 p-4 dark:border-gray-700 ${rowClassName?.(item) ?? ""}`}>{columns.map((column) => <div key={column.label} className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm last:border-0 dark:border-white/[0.05]"><span className="text-gray-500 dark:text-gray-400">{column.label}</span><span className="text-end text-gray-800 dark:text-gray-200">{column.value(item)}</span></div>)}</article>)}</div>
          <PaginationControls page={data.number} totalPages={data.totalPages} total={data.totalElements} />
        </>)}
      </ComponentCard>
    </>
  );
}
