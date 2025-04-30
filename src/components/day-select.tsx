import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aggregatedMevData } from "@/lib/aggregated-mev-data";
import { dayFormatter } from "@/lib/utils";

interface DaySelectProps {
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

export const DaySelect = (props: DaySelectProps) => {
  const { selectedDay, setSelectedDay } = props;
  const data = aggregatedMevData;
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-lg">Day</div>
      <Select
        value={selectedDay}
        onValueChange={(val) => {
          const day = data.find((day) => day.date === val);
          if (day) {
            setSelectedDay(day.date);
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Day">
            {dayFormatter(selectedDay)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {data.map((day) => (
            <SelectItem key={day.date} value={day.date}>
              {day.date}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
