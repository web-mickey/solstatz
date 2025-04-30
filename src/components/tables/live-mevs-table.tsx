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
import { LiveMev } from "@/lib/types";
import {
  formatShortDistanceToNow,
  formatSolValue,
  shortenAddress,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Header } from "../header";
import { LiveDot } from "../live-dot";
import { SolValueWrapper } from "../sol-value-wrapper";
import { TablePagination } from "../table-pagination";
import { TableSkeleton } from "../table-skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export type TopAttack = LiveMev & { isNew?: boolean };

export const LiveMevsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLiveMevs = async (): Promise<LiveMev[]> => {
    const response = await fetch(`/api/mev/sandwich_events`);
    return response.json();
  };

  const { data: liveData } = useQuery({
    queryKey: ["live-mevs"],
    queryFn: fetchLiveMevs,
    refetchInterval: 5000,
  });

  const screenWidth = useScreenSize();
  const isMobile = screenWidth < 1024;

  const rowsPerPage = 10;
  const totalPages = Math.ceil((liveData?.length || 0) / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = liveData?.length
    ? liveData?.slice(startIndex, startIndex + rowsPerPage)
    : [];

  return (
    <div>
      <LiveDot />
      <Header
        title={
          <div className="flex items-center gap-2">Latest MEV Attacks</div>
        }
        description="Latest Sandwiches"
      />
      <Card>
        <CardContent>
          {liveData ? (
            <>
              <Table className="lg:table-fixed w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">From now</TableHead>
                    <TableHead className="w-[80px] text-center">DEX</TableHead>
                    <TableHead>Attacker</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Victim</TableHead>
                    <TableHead className="w-[200px]">Tx Hashes</TableHead>
                    <TableHead>Sol In</TableHead>
                    <TableHead>Drained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRows?.map((attack, index) => {
                    return (
                      <TableRow
                        key={`${attack.wallet_address}-${attack.token_address}-${index}`}
                      >
                        <TableCell>
                          {formatShortDistanceToNow(new Date(attack.timestamp))}
                        </TableCell>
                        <TableCell className="flex justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Image
                                  src={
                                    attack.source === "raydium"
                                      ? "/raydium.webp"
                                      : attack.source === "pump"
                                      ? "/pumpfun.webp"
                                      : "/pumpswap.webp"
                                  }
                                  alt={attack.source}
                                  width={20}
                                  height={20}
                                />
                              </TooltipTrigger>
                              <TooltipContent className="capitalize">
                                {attack.source}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`https://solscan.io/account/${attack.wallet_address}`}
                            target="_blank"
                            className="flex items-center gap-1"
                          >
                            {shortenAddress(
                              attack.wallet_address,
                              isMobile ? 2 : 4
                            )}
                            <FaArrowUpRightFromSquare
                              size={8}
                              className="-mt-1"
                            />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`https://solscan.io/account/${attack.token_address}`}
                            target="_blank"
                            className="flex items-center gap-2"
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
                            {shortenAddress(
                              attack.token_address,
                              isMobile ? 2 : 4
                            )}
                            <FaArrowUpRightFromSquare
                              size={8}
                              className="-mt-1"
                            />
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
                            <FaArrowUpRightFromSquare
                              size={8}
                              className="-mt-1"
                            />
                          </Link>
                        </TableCell>
                        <TableCell className="flex flex-row gap-3">
                          <Link
                            href={`https://solscan.io/tx/${attack.tx_hash_buy}`}
                            target="_blank"
                            className="flex items-center gap-1"
                          >
                            Buy
                            <FaArrowUpRightFromSquare
                              size={8}
                              className="-mt-1"
                            />
                          </Link>
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
                          <Link
                            href={`https://solscan.io/tx/${attack.tx_hash_sell}`}
                            target="_blank"
                            className="flex items-center gap-1"
                          >
                            Sell
                            <FaArrowUpRightFromSquare
                              size={8}
                              className="-mt-1"
                            />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <SolValueWrapper
                            value={formatSolValue(attack.victim_amount_in, 4)}
                            size={12}
                          />
                        </TableCell>
                        <TableCell className="text-brand font-bold">
                          <SolValueWrapper
                            value={
                              <div className="flex flex-row gap-1">
                                {formatSolValue(attack.sol_drained, 4)}
                                <div className="text-primary text-xs">
                                  (
                                  {(
                                    (attack.sol_drained /
                                      attack.victim_amount_in) *
                                    100
                                  ).toFixed(2)}
                                  %)
                                </div>
                              </div>
                            }
                            size={12}
                          />
                        </TableCell>
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
            </>
          ) : (
            <TableSkeleton />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
