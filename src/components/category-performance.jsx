import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Progress } from "@/components/ui/progress";

// Mock data for category performance
const data = [
  { category: "Biology", rate: 92 },
  { category: "Mathematics", rate: 85 },
  { category: "History", rate: 78 },
  { category: "Computer Science", rate: 94 },
  { category: "Economics", rate: 88 },
];

export function CategoryPerformance() {
  return (
    <div className="space-y-8">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Detailed Performance</h3>
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">{item.category}</div>
                <div className="text-muted-foreground">{item.rate}%</div>
              </div>
              <Progress value={item.rate} className="h-2" />
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <div>Questions: 24</div>
                <div>Correct: {Math.round(24 * (item.rate / 100))}</div>
                <div>Avg. Time: 45s</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <Tooltip>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">{payload[0].payload.category}</p>
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
