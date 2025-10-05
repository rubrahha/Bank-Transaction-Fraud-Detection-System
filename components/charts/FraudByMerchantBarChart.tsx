
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../../types';

const FraudByMerchantBarChart: React.FC<{ data: Transaction[] }> = ({ data }) => {
    const chartData = useMemo(() => {
        const fraudByMerchant = data
            .filter(t => t.predicted_is_fraud)
            .reduce((acc, t) => {
                acc[t.merchant] = (acc[t.merchant] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(fraudByMerchant)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 fraudulent merchants
    }, [data]);

    return (
        <>
            <h4 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">Top Merchants by Fraud Incidents</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Fraudulent Transactions" fill="#EF4444" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default FraudByMerchantBarChart;
