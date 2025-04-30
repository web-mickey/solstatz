import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import { validatorsList } from "./validators-list";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 2): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals).replace(/\.0$/, "") + "K";
  }
  return num.toFixed(decimals);
}

export function formatNumberWithCommas(num: number, decimals = 0): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function shortenAddress(address: string, length = 4): string {
  if (!address) {
    return "Unknown";
  }

  return address.slice(0, length) + "..." + address.slice(-length);
}

export const onCopyText = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const dayFormatter = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
};

export const getSolanaPrice = async () => {
  const response = await fetch(
    "https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000"
  );

  const data = await response.json();

  return data["Price"];
};

export const formatSolValue = (value: number, decimals = 2) => {
  return (value / 1000000000).toFixed(decimals);
};

export function formatShortDistanceToNow(date: Date | number): string {
  const shortFormatDistance = (token: string, count: number): string => {
    const map: Record<string, string> = {
      lessThanXSeconds: `<${count}s`,
      xSeconds: `${count}s`,
      halfAMinute: "30s",
      lessThanXMinutes: `<${count}m`,
      xMinutes: `${count}m`,
      aboutXHours: `~${count}h`,
      xHours: `${count}h`,
      xDays: `${count}d`,
      aboutXWeeks: `~${count}w`,
      xWeeks: `${count}w`,
      aboutXMonths: `~${count}mo`,
      xMonths: `${count}mo`,
      aboutXYears: `~${count}y`,
      xYears: `${count}y`,
      overXYears: `>${count}y`,
      almostXYears: `<${count}y`,
    };

    return map[token] || "";
  };

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: {
      formatDistance: (token, count, options) => {
        const base = shortFormatDistance(token as string, count);
        const suffix = options?.addSuffix
          ? options.comparison && options.comparison > 0
            ? " in"
            : " ago"
          : "";
        return base + suffix;
      },
    },
  });
}

export const getValidatorData = (validator: string) => {
  const validatorData = validatorsList.find((v) => v.account === validator);

  if (!validatorData) {
    return null;
  }

  return validatorData;
};
