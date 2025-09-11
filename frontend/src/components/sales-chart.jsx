import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const salesData = [
  { month: "Jan", sales: 1200, revenue: 14400 },
  { month: "Feb", sales: 1800, revenue: 21600 },
  { month: "Mar", sales: 2200, revenue: 26400 },
  { month: "Apr", sales: 1900, revenue: 22800 },
  { month: "May", sales: 2800, revenue: 33600 },
  { month: "Jun", sales: 3200, revenue: 38400 },
  { month: "Jul", sales: 2900, revenue: 34800 },
  { month: "Aug", sales: 3800, revenue: 45600 },
  { month: "Sep", sales: 4200, revenue: 50400 },
  { month: "Oct", sales: 3900, revenue: 46800 },
  { month: "Nov", sales: 4800, revenue: 57600 },
  { month: "Dec", sales: 5200, revenue: 62400 },
]

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <CardDescription>Monthly book sales and revenue over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-chart-1">Sales: {payload[0].value.toLocaleString()} copies</p>
                      <p className="text-sm text-muted-foreground">Revenue: ${payload[1].value.toLocaleString()}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
