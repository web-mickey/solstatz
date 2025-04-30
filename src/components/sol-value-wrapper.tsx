import { cn } from "@/lib/utils";
import { SolIcon } from "./sol-icon";

interface SolValueWrapperProps {
  value: string | number | React.ReactNode;
  size?: number;
}

export const SolValueWrapper = ({ value, size = 24 }: SolValueWrapperProps) => {
  return (
    <div className={cn("flex items-center gap-1")}>
      <SolIcon size={size} />
      <div className="text-md">{value}</div>
    </div>
  );
};
