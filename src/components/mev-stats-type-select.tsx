import { MevStatsType } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface MevStatsTypeSelectProps {
  statsType: MevStatsType;
  setStatsType: (statsType: MevStatsType) => void;
}

export const MevStatsTypeSelect = (props: MevStatsTypeSelectProps) => {
  const { statsType, setStatsType } = props;

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-lg">Source</div>
      <Tabs
        value={statsType}
        onValueChange={(value) => setStatsType(value as MevStatsType)}
      >
        <TabsList>
          <TabsTrigger value={MevStatsType.All}>All</TabsTrigger>
          <TabsTrigger value={MevStatsType.Raydium}>Raydium</TabsTrigger>
          <TabsTrigger value={MevStatsType.Pump}>Pump Fun</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
