"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

const renderCustomLabel = (props: {
  cx: any;
  cy: any;
  midAngle: any;
  outerRadius: any;
  fill: any;
  payload: any;
  percent: any;
  solValues?: boolean;
}) => {
  const { cx, cy, midAngle, outerRadius, fill, payload, percent, solValues } =
    props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + 10) * cos;
  const my = cy + (outerRadius + 10) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 13;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        className="fill-current text-gray-500"
      >
        {solValues ? (
          <tspan>
            {payload.value.toFixed(0)} SOL ({(percent * 100).toFixed(2)}%)
          </tspan>
        ) : (
          `${payload.value.toFixed(0)} (${(percent * 100).toFixed(2)}%)`
        )}
      </text>
    </g>
  );
};

export interface GenericPieChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  description?: string;
  colors?: string[];
  solValues?: boolean;
}

export default function GenericPieChart({
  data,
  title,
  description,
  colors = CHART_COLORS,
  solValues = false,
}: GenericPieChartProps) {
  const chartData = data.map((entry, idx) => ({
    ...entry,
    fill: colors[idx % colors.length],
    opacity: 0.8,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <Card>
        <CardContent className="px-4 py-2">
          <div style={{ width: "100%", height: "400px" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="0"
                  outerRadius="100"
                  dataKey="value"
                  label={(props) => renderCustomLabel({ ...props, solValues })}
                  labelLine={false}
                  isAnimationActive={false}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
