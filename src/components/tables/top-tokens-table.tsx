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

interface TopTokensTableProps {
  type: "All" | "Daily";
  selectedDay: string;
  sortBy?: "sol" | "tx";
}

export default function TopTokensTable({
  type,
  selectedDay,
  sortBy = "sol",
}: TopTokensTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const screenWidth = useScreenSize();
  const isMobile = screenWidth < 1024;

  const selectedData =
    type === "All"
      ? aggregatedFullMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allTokens = selectedData.flatMap(
    (day) => day.top_token_address_tx ?? []
  );

  if (!allTokens.length) return null;

  const aggregatedTokens = allTokens.reduce(
    (acc: Record<string, any>, token) => {
      if (!acc[token.token_address]) {
        acc[token.token_address] = { ...token };
      } else {
        acc[token.token_address].tx_count += token.tx_count;
        acc[token.token_address].victim_real_sol_extracted +=
          token.victim_real_sol_extracted;
      }
      return acc;
    },
    {}
  );

  const sortedTokens = Object.values(aggregatedTokens).sort((a, b) => {
    if (sortBy === "tx") {
      return b.tx_count - a.tx_count;
    }
    return b.victim_real_sol_extracted - a.victim_real_sol_extracted;
  });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(sortedTokens.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedTokens.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <Table className="w-full lg:table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Token Address</TableHead>
                <TableHead>Attacks</TableHead>
                <TableHead>SOL Drained</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((token, index) => (
                <TableRow key={`${token.token_address}-${index}`}>
                  <TableCell>
                    <Link
                      href={`https://solscan.io/account/${token.token_address}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      {shortenAddress(token.token_address, isMobile ? 2 : 8)}
                      <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                    </Link>
                  </TableCell>
                  <TableCell>{token.tx_count}</TableCell>
                  <TableCell className="text-brand font-bold">
                    <SolValueWrapper
                      value={token.victim_real_sol_extracted.toFixed(2)}
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
