
import React from 'react';
import type { ModelMetrics } from '../types';

interface ModelMetricsDisplayProps {
    metrics: ModelMetrics;
}

const MetricItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}%</span>
    </div>
);

const ModelMetricsDisplay: React.FC<ModelMetricsDisplayProps> = ({ metrics }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Model Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricItem label="Accuracy" value={metrics.accuracy} />
                <MetricItem label="Precision" value={metrics.precision} />
                <MetricItem label="Recall" value={metrics.recall} />
                <MetricItem label="F1-Score" value={metrics.f1_score} />
            </div>
        </div>
    );
};

export default ModelMetricsDisplay;
