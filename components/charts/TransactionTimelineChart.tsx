
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../../types';

const TransactionTimelineChart: React.FC<{ data: Transaction[] }> = ({ data }) => {
    const chartData = useMemo(() => {
        const transactionsByDay = data.reduce((acc, t) => {
            const date = new Date(t.timestamp).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { date, all: 0, fraud: 0 };
            }
            acc[date].all++;
            if (t.predicted_is_fraud) {
                acc[date].fraud++;
            }
            return acc;
        }, {} as Record<string, { date: string; all: number; fraud: number }>);
        
        return Object.values(transactionsByDay).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);

    return (
        <>
            <h4 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">Daily Transaction Volume</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="all" name="All Transactions" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="fraud" name="Fraudulent Transactions" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default TransactionTimelineChart;
