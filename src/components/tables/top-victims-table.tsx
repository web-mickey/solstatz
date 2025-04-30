"use client";

import { TablePagination } from "@/components/table-pagination";
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
import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SolValueWrapper } from "../sol-value-wrapper";

interface TopVictimsTableProps {
  type: "All" | "Daily";
  selectedDay: string;
  sortBy?: "sol" | "tx";
}

export default function TopVictimsTable({
  type,
  selectedDay,
  sortBy = "sol",
}: TopVictimsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const screenWidth = useScreenSize();
  const isMobile = screenWidth < 1024;

  const selectedData =
    type === "All"
      ? aggregatedFullMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allVictims = selectedData.flatMap(
    (day) => day.top_victim_wallet_address_tx ?? []
  );

  if (!allVictims.length) return null;

  const aggregatedVictims = allVictims.reduce(
    (acc: Record<string, any>, victim) => {
      if (!acc[victim.victim_wallet_address]) {
        acc[victim.victim_wallet_address] = { ...victim };
      } else {
        acc[victim.victim_wallet_address].tx_count += victim.tx_count;
        acc[victim.victim_wallet_address].victim_real_sol_extracted +=
          victim.victim_real_sol_extracted;
      }
      return acc;
    },
    {}
  );

  const sortedVictims = Object.values(aggregatedVictims).sort((a, b) => {
    if (sortBy === "tx") {
      return b.tx_count - a.tx_count;
    }
    return b.victim_real_sol_extracted - a.victim_real_sol_extracted;
  });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(sortedVictims.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedVictims.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <Table className="w-full lg:table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Victim Wallet</TableHead>
                <TableHead>Attacks</TableHead>
                <TableHead>SOL Lost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((victim, index) => (
                <TableRow key={`${victim.victim_wallet_address}-${index}`}>
                  <TableCell>
                    <Link
                      href={`https://solscan.io/account/${victim.victim_wallet_address}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      {shortenAddress(
                        victim.victim_wallet_address,
                        isMobile ? 2 : 8
                      )}
                      <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                    </Link>
                  </TableCell>
                  <TableCell>{victim.tx_count}</TableCell>
                  <TableCell className="text-brand font-bold">
                    <SolValueWrapper
                      value={victim.victim_real_sol_extracted.toFixed(2)}
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
