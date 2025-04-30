"use client";

import { SolValueWrapper } from "@/components/sol-value-wrapper";
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
import {
  aggregatedFullMevData,
  aggregatedMevData,
} from "@/lib/aggregated-mev-data";
import { formatNumber, getValidatorData, shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

interface ValidatorTableProps {
  selectedDay: string;
  type: "All" | "Daily";
  sortBy: "sol" | "tx";
}

export default function ValidatorTable({
  selectedDay,
  type,
  sortBy,
}: ValidatorTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const selectedDaysData =
    type === "All"
      ? aggregatedFullMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const allValidators = selectedDaysData.flatMap(
    (day) => day.top_validator_extracted ?? []
  );

  if (!allValidators.length) return null;

  const aggregatedValidators = allValidators.reduce(
    (acc: Record<string, any>, validator) => {
      if (!acc[validator.validator]) {
        acc[validator.validator] = { ...validator };
      } else {
        acc[validator.validator].tx_count += validator.tx_count;
        acc[validator.validator].victim_real_sol_extracted +=
          validator.victim_real_sol_extracted;
      }
      return acc;
    },
    {}
  );

  const sortedValidators = Object.values(aggregatedValidators).sort((a, b) => {
    if (sortBy === "tx") {
      return b.tx_count - a.tx_count;
    }
    return b.victim_real_sol_extracted - a.victim_real_sol_extracted;
  });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(sortedValidators.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedValidators.slice(
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
                <TableHead>Validator</TableHead>
                <TableHead className="w-[150px]">Active Stake</TableHead>
                {sortBy === "tx" && (
                  <TableHead className="w-[100px]">Attacks</TableHead>
                )}
                {sortBy === "sol" && (
                  <TableHead className="w-[150px]">SOL Drained</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((validator, index) => {
                const validatorData: any = getValidatorData(
                  validator.validator
                );
                const name =
                  validatorData?.name ?? shortenAddress(validator.validator);

                const stake = validatorData?.active_stake
                  ? formatNumber(
                      Number((validatorData?.active_stake / 1e9).toFixed(0))
                    )
                  : "-";

                return (
                  <TableRow
                    key={`${validator.validator}-${index}`}
                    className="hover:bg-muted"
                  >
                    <TableCell>
                      <Link
                        href={`https://solscan.io/account/${validator.validator}`}
                        target="_blank"
                        className="flex items-center gap-1"
                      >
                        {name}
                        <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <SolValueWrapper value={stake} size={12} />
                    </TableCell>
                    {sortBy === "tx" && (
                      <TableCell>{validator.tx_count}</TableCell>
                    )}
                    {sortBy === "sol" && (
                      <TableCell className="text-brand font-bold">
                        <SolValueWrapper
                          value={validator.victim_real_sol_extracted.toFixed(2)}
                          size={12}
                        />
                      </TableCell>
                    )}
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
