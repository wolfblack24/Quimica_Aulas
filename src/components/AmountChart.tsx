import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface AmountChartProps {
  data: ChartDataPoint[];
}

export default function AmountChart({ data }: AmountChartProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-white mb-3">Quantidade vs. Tempo</h3>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ value: 'Tempo', position: 'insideBottom', offset: -5, fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ value: 'Quantidade (mols)', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend
              wrapperStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="N2"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              name="N₂"
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="H2"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={false}
              name="H₂"
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="NH3"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={false}
              name="NH₃"
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
