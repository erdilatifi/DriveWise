'use client';

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ProgressData } from '@/hooks/use-test-attempts';

export function WeeklyProgressChart({ data }: { data: ProgressData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          dy={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
          contentStyle={{
            backgroundColor: '#09090b',
            border: '1px solid #27272a',
            borderRadius: '0.75rem',
            padding: '0.5rem 0.75rem',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
          }}
          labelStyle={{
            color: '#e5e5e5',
            fontSize: 12,
            marginBottom: 4,
          }}
          itemStyle={{
            color: '#fdba74',
            fontSize: 12,
            fontWeight: 600,
          }}
          formatter={(value) => [`${value}%`, 'Score']}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#f97316"
          strokeWidth={3}
          dot={{
            r: 4,
            strokeWidth: 2,
            stroke: '#000',
            fill: '#f97316',
          }}
          activeDot={{
            r: 6,
            strokeWidth: 0,
            fill: '#fff',
          }}
          fill="url(#colorScore)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PassRatePieChart({
  pieData,
  showTooltip,
}: {
  pieData: { name: string; value: number; color: string }[];
  showTooltip: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={showTooltip ? 5 : 0}
          dataKey="value"
          stroke="none"
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke={entry.color === '#27272a' ? 'rgba(255,255,255,0.05)' : 'none'}
              strokeWidth={entry.color === '#27272a' ? 1 : 0}
            />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              padding: '8px 12px',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            itemStyle={{ color: '#fff' }}
            formatter={(value) => [`${value}`, 'Count']}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
