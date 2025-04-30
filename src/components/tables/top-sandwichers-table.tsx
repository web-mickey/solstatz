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
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SolValueWrapper } from "../sol-value-wrapper";
import { TablePagination } from "../table-pagination";
import { getAggregatedAttackers } from "@/lib/agg-precalculated-data";

interface TopSandwichersTableProps {
  selectedDay: string;
  type: "All" | "Daily";
  sortBy?: "sol" | "tx";
}

export default function TopSandwichersTable({
  selectedDay,
  type,
  sortBy = "sol",
}: TopSandwichersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const screenWidth = useScreenSize();
  const isMobile = screenWidth < 1024;

  const { attackers, totalExtracted } = getAggregatedAttackers(
    type,
    selectedDay
  );

  if (!attackers.length) return null;

  const sortedAttackers = attackers.sort((a, b) => {
    return sortBy === "tx"
      ? b.tx_count - a.tx_count
      : b.victim_real_sol_extracted - a.victim_real_sol_extracted;
  });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(sortedAttackers.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedAttackers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="flex flex-col gap-4">
      <Card className="xl:col-span-2">
        <CardContent>
          <Table className="lg:table-fixed w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Wallet Address</TableHead>
                <TableHead>Attacks</TableHead>
                <TableHead>SOL Drained</TableHead>
                <TableHead>% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((attacker, index) => {
                const percentOfTotal =
                  totalExtracted > 0
                    ? (attacker.victim_real_sol_extracted / totalExtracted) *
                      100
                    : 0;

                return (
                  <TableRow
                    key={`${attacker.attacker_address}-${index}`}
                    className="hover:bg-muted"
                  >
                    <TableCell>
                      <Link
                        href={`https://solscan.io/account/${attacker.attacker_address}`}
                        target="_blank"
                        className="flex items-center gap-1"
                      >
                        {shortenAddress(
                          attacker.attacker_address,
                          isMobile ? 2 : 8
                        )}
                        <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                      </Link>
                    </TableCell>
                    <TableCell>{attacker.tx_count}</TableCell>
                    <TableCell className="text-brand font-bold">
                      <SolValueWrapper
                        value={attacker.victim_real_sol_extracted.toFixed(2)}
                        size={12}
                      />
                    </TableCell>
                    <TableCell>{percentOfTotal.toFixed(2)}%</TableCell>
                  </TableRow>
                );
              })}
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
