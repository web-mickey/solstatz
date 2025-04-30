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
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { TopAttackRecord } from "@/lib/types";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SolValueWrapper } from "../sol-value-wrapper";
import { TablePagination } from "../table-pagination";

interface TopSandwichAttacksTableProps {
  selectedDay: string;
  type: "All" | "Daily";
}

export default function TopSandwichAttacksTable({
  selectedDay,
  type,
}: TopSandwichAttacksTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const screenWidth = useScreenSize();
  const isMobile = screenWidth < 1024;

  const selectedDaysData =
    type === "All"
      ? aggregatedMevData
      : aggregatedMevData.filter((d) => d.date === selectedDay);

  const topSandwichAttacksData: TopAttackRecord[] = selectedDaysData.flatMap(
    (day) => day.top_attacks ?? []
  );

  if (!topSandwichAttacksData.length) {
    return null;
  }

  const sortedAttacks = topSandwichAttacksData.sort(
    (a, b) => b.attacker_sol_extracted - a.attacker_sol_extracted
  );

  const rowsPerPage = 20;
  const totalPages = Math.ceil(sortedAttacks.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedAttacks.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div>
      <Card className="xl:col-span-2">
        <CardContent>
          <Table className="lg:table-fixed w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Attacker</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Victim</TableHead>
                <TableHead className="w-[100px]">Provider</TableHead>
                <TableHead className="w-[250px]">Tx Hashes</TableHead>
                <TableHead>Victim Sol In</TableHead>
                <TableHead>Attacker Drained</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((attack, index) => (
                <TableRow
                  key={`${attack.attacker_address}-${attack.token_address}-${index}`}
                >
                  <TableCell>
                    <Link
                      href={`https://solscan.io/account/${attack.attacker_address}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      {shortenAddress(
                        attack.attacker_address,
                        isMobile ? 2 : 4
                      )}
                      <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`https://solscan.io/account/${attack.token_address}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      {!isMobile && (
                        <img
                          src={`https://image.bullx.io/1399811149/${attack.token_address}`}
                          alt={attack.token_address}
                          width={20}
                          height={20}
                          className="rounded-full w-5 h-5"
                        />
                      )}
                      {shortenAddress(attack.token_address, isMobile ? 2 : 4)}
                      <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`https://solscan.io/account/${attack.victim_wallet_address}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      {shortenAddress(
                        attack.victim_wallet_address,
                        isMobile ? 2 : 4
                      )}
                      <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                    </Link>
                  </TableCell>

                  <TableCell>
                    {attack.victim_priv_mempool_provider ?? "-"}
                  </TableCell>

                  <TableCell className="align-middle">
                    <div className="flex flex-row flex-wrap items-center gap-2">
                      <Link
                        href={`https://solscan.io/tx/${attack.attacker_tx_hash_buy}`}
                        target="_blank"
                        className="flex items-center gap-1"
                      >
                        Buy
                        <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                      </Link>
                      {attack.victim_tx_hash && (
                        <Link
                          href={`https://solscan.io/tx/${attack.victim_tx_hash}`}
                          target="_blank"
                          className="flex items-center gap-1"
                        >
                          Victim
                          <FaArrowUpRightFromSquare
                            size={8}
                            className="-mt-1"
                          />
                        </Link>
                      )}
                      <Link
                        href={`https://solscan.io/tx/${attack.attacker_tx_hash_sell}`}
                        target="_blank"
                        className="flex items-center gap-1"
                      >
                        Sell
                        <FaArrowUpRightFromSquare size={8} className="-mt-1" />
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell>
                    {attack.victim_amount_in ? (
                      <SolValueWrapper
                        value={attack.victim_amount_in.toFixed(2)}
                        size={12}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell className="text-brand font-bold">
                    <div className="flex flex-col">
                      <SolValueWrapper
                        value={attack.attacker_sol_extracted.toFixed(2)}
                        size={12}
                      />
                      {attack.victim_amount_in > 0 && (
                        <div className="text-xs text-primary">
                          (
                          {(
                            (attack.attacker_sol_extracted /
                              attack.victim_amount_in) *
                            100
                          ).toFixed(2)}
                          %)
                        </div>
                      )}
                    </div>
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
