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
  { day: "Mon", rate: 75 },
  { day: "Tue", rate: 82 },
  { day: "Wed", rate: 78 },
  { day: "Thu", rate: 85 },
  { day: "Fri", rate: 90 },
  { day: "Sat", rate: 87 },
  { day: "Sun", rate: 91 },
];

export function DashboardChart() {
  return (
    <div className="h-[200px] w-full  ">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
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
      <div className="border bg-white p-2 shadow-md rounded-md">
        <p className="text-sm font-medium">{payload[0].payload.day}</p>
        <p className="text-sm text-gray-600">
          Retention:{" "}
          <span className="font-medium text-blue-600 ">
            {payload[0].value}%
          </span>
        </p>
      </div>
    );
  }

  return null;
}
