"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useScreenSize from "@/hooks/useScreenSize";
import {
  aggregatedFullMevData,
  aggregatedMevData,
} from "@/lib/aggregated-mev-data";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SolValueWrapper } from "../sol-value-wrapper";
import { TablePagination } from "../table-pagination";

interface TopPoolsTableProps {
  selectedDay: string;
  type: "All" | "Daily";
  sortBy?: "sol" | "tx";
}

export default function TopPoolsTable({
  selectedDay,
  type,
  sortBy = "sol",
}: TopPoolsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const screenWidth = useScreenSize();
  const isMobile = screenWidth < 1024;

  const poolData = useMemo(() => {
    const selectedDaysData =
      type === "All"
        ? aggregatedFullMevData
        : aggregatedMevData.filter((d) => d.date === selectedDay);

    const allPools = selectedDaysData.flatMap((day) => day.top_lp_tx ?? []);

    if (!allPools.length) return [];

    const aggregatedPools = allPools.reduce(
      (acc: Record<string, any>, pool) => {
        if (!acc[pool.lp]) {
          acc[pool.lp] = { ...pool };
        } else {
          acc[pool.lp].tx_count += pool.tx_count;
          acc[pool.lp].victim_real_sol_extracted +=
            pool.victim_real_sol_extracted;
        }
        return acc;
      },
      {}
    );

    return Object.values(aggregatedPools).sort((a, b) => {
      if (sortBy === "tx") {
        return b.tx_count - a.tx_count;
      }
      return b.victim_real_sol_extracted - a.victim_real_sol_extracted;
    });
  }, [selectedDay, type, sortBy]);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(poolData.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = poolData.slice(startIndex, startIndex + rowsPerPage);

  if (!poolData.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card className="xl:col-span-2">
        <CardContent>
          <Table className="lg:table-fixed w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Pool Address</TableHead>
                <TableHead>Attacks</TableHead>
                <TableHead>SOL Drained</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((pool, index) => (
                <TableRow
                  key={`${pool.lp}-${index}`}
                  className="hover:bg-muted"
                >
                  <TableCell>
                    <Link
                      href={`https://solscan.io/account/${pool.lp}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      {shortenAddress(pool.lp, isMobile ? 2 : 8)}
                      <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                    </Link>
                  </TableCell>
                  <TableCell>{pool.tx_count}</TableCell>
                  <TableCell className="text-brand font-bold">
                    <SolValueWrapper
                      value={pool.victim_real_sol_extracted.toFixed(2)}
                      size={12}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
