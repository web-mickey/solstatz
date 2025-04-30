import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaCopy } from "react-icons/fa6";
import { onCopyText } from "@/lib/utils";

interface StatCardProps {
  title: string;
  children: React.ReactNode;
  textToCopy: string;
  noCopyButton?: boolean;
}

export const StatCard = (props: StatCardProps) => {
  const { title, children, textToCopy, noCopyButton } = props;
  return (
    <div className="relative z-10 flex flex-col w-full max-w-4xl p-4">
      {!noCopyButton && (
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => onCopyText(textToCopy)}
          >
            <FaCopy />
          </Button>
        </div>
      )}
      <Card className="relative w-full bg-transparent text-white shadow-2xl">
        <Image
          src="/sol-statz-post-bg.png"
          alt="Sol Statz Post Background"
          layout="fill"
          className="absolute inset-0 z-[-1] rounded-xl"
        />

        <div className="p-8 pb-4 space-y-10">
          <h1 className="text-center text-xl font-bold leading-tight tracking-tighter sm:text-3xl">
            {title}
          </h1>
          {children}
        </div>
        <div className="flex justify-end p-8 py-2">
          <div className="text-2xl font-bold text-primary">@SolStatz</div>
        </div>
      </Card>
    </div>
  );
};
