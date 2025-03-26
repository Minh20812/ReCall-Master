import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the retention rate over time
const data = [
  { date: "May 1", rate: 75 },
  { date: "May 2", rate: 78 },
  { date: "May 3", rate: 76 },
  { date: "May 4", rate: 80 },
  { date: "May 5", rate: 82 },
  { date: "May 6", rate: 85 },
  { date: "May 7", rate: 83 },
  { date: "May 8", rate: 86 },
  { date: "May 9", rate: 84 },
  { date: "May 10", rate: 87 },
  { date: "May 11", rate: 89 },
  { date: "May 12", rate: 88 },
  { date: "May 13", rate: 90 },
  { date: "May 14", rate: 87 },
];

export function AnalyticsChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[50, 100]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <Tooltip>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">{payload[0].payload.date}</p>
          <p className="text-sm text-muted-foreground">
            Retention:{" "}
            <span className="font-medium text-primary">
              {payload[0].value}%
            </span>
          </p>
        </div>
      </Tooltip>
    );
  }

  return null;
}
