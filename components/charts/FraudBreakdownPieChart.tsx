import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../../types';

// FIX: Added index signature to resolve typing conflict with recharts Tooltip/Legend components.
// This allows recharts to access properties dynamically without TypeScript errors.
interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}

const COLORS = ['#10B981', '#EF4444']; // Green for Legit, Red for Fraud

const FraudBreakdownPieChart: React.FC<{ data: Transaction[] }> = ({ data }) => {
    const chartData: ChartData[] = useMemo(() => {
        const legitCount = data.filter(t => !t.predicted_is_fraud).length;
        const fraudCount = data.filter(t => t.predicted_is_fraud).length;
        return [
            { name: 'Legitimate', value: legitCount },
            { name: 'Fraudulent', value: fraudCount },
        ];
    }, [data]);

    return (
        <>
            <h4 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">AI Fraud Detection Breakdown</h4>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        // FIX: The 'percent' property can be undefined. Added a fallback to 0 to prevent arithmetic errors.
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
};

export default FraudBreakdownPieChart;