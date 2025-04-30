import React from "react";
import { Skeleton } from "./ui/skeleton";

export const TableSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(10)].map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
};
