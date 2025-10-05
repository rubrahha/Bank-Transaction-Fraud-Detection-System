
import React, { useState, useCallback, useMemo } from 'react';
import { generateTransactionData, detectFraudulentTransactions } from '../services/geminiService';
import type { Transaction, ModelMetrics } from '../types';
import StatCard from './StatCard';
import TransactionTable from './TransactionTable';
import ModelMetricsDisplay from './ModelMetrics';
import FraudBreakdownPieChart from './charts/FraudBreakdownPieChart';
import FraudByMerchantBarChart from './charts/FraudByMerchantBarChart';
import TransactionTimelineChart from './charts/TransactionTimelineChart';

type Stage = 'initial' | 'loadingData' | 'dataLoaded' | 'cleaningData' | 'dataCleaned' | 'trainingModel' | 'modelTrained' | 'detectingFraud' | 'detectionComplete';

const STAGE_DESCRIPTIONS: Record<Stage, string> = {
  initial: 'Start by generating a sample dataset of bank transactions.',
  loadingData: 'Generating realistic transaction data using AI. This may take a moment...',
  dataLoaded: 'Data generated. Next, clean the data to prepare for analysis.',
  cleaningData: 'Simulating data cleaning process...',
  dataCleaned: 'Data cleaned successfully. Now, train the fraud detection model.',
  trainingModel: 'Simulating model training with the cleaned dataset...',
  modelTrained: 'Model trained. You can now run fraud detection on the transactions.',
  detectingFraud: 'AI is analyzing transactions to detect fraudulent patterns...',
  detectionComplete: 'Fraud detection complete. Review the results below.'
};

const Dashboard: React.FC = () => {
    const [stage, setStage] = useState<Stage>('initial');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [cleaningLog, setCleaningLog] = useState<string>('');
    const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);

    const handleGenerateData = useCallback(async () => {
        setStage('loadingData');
        const data = await generateTransactionData();
        setTransactions(data);
        setStage('dataLoaded');
    }, []);

    const handleCleanData = useCallback(() => {
        setStage('cleaningData');
        setTimeout(() => {
            const originalCount = transactions.length;
            const cleanedTransactions = transactions.filter(t => t.amount > 0 && t.merchant);
            const removedCount = originalCount - cleanedTransactions.length;
            setTransactions(cleanedTransactions);
            setCleaningLog(`Data cleaning complete. Removed ${removedCount} invalid records (e.g., negative amounts, missing merchant).`);
            setStage('dataCleaned');
        }, 1500);
    }, [transactions]);

    const handleTrainModel = useCallback(() => {
        setStage('trainingModel');
        setTimeout(() => {
            setModelMetrics({
                accuracy: 96.5,
                precision: 91.3,
                recall: 88.7,
                f1_score: 90.0,
            });
            setStage('modelTrained');
        }, 2000);
    }, []);

    const handleDetectFraud = useCallback(async () => {
        setStage('detectingFraud');
        const analyzedTransactions = await detectFraudulentTransactions(transactions);
        setTransactions(analyzedTransactions);
        setStage('detectionComplete');
    }, [transactions]);

    const actionButton = useMemo(() => {
        const isLoading = ['loadingData', 'cleaningData', 'trainingModel', 'detectingFraud'].includes(stage);
        
        const Button: React.FC<{onClick: () => void; text: string;}> = ({onClick, text}) => (
             <button
                onClick={onClick}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {text}
            </button>
        );

        switch (stage) {
            case 'initial':
                return <Button onClick={handleGenerateData} text="Generate Transaction Data" />;
            case 'loadingData':
                 return <Button onClick={() => {}} text="Generating Data..." />;
            case 'dataLoaded':
                return <Button onClick={handleCleanData} text="Clean Data" />;
            case 'cleaningData':
                 return <Button onClick={() => {}} text="Cleaning Data..." />;
            case 'dataCleaned':
                return <Button onClick={handleTrainModel} text="Train Fraud Detection Model" />;
            case 'trainingModel':
                 return <Button onClick={() => {}} text="Training Model..." />;
            case 'modelTrained':
                return <Button onClick={handleDetectFraud} text="Run Fraud Detection" />;
            case 'detectingFraud':
                return <Button onClick={() => {}} text="Detecting Fraud..." />;
            default:
                return null;
        }
    }, [stage, handleGenerateData, handleCleanData, handleTrainModel, handleDetectFraud]);
    
    const stats = useMemo(() => {
        const totalTransactions = transactions.length;
        const actualFraud = transactions.filter(t => t.is_fraud).length;
        const predictedFraud = transactions.filter(t => t.predicted_is_fraud).length;
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        return { totalTransactions, actualFraud, predictedFraud, totalAmount };
    }, [transactions]);

    return (
        <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Workflow Status</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{STAGE_DESCRIPTIONS[stage]}</p>
                <div className="mt-6">
                    {actionButton}
                </div>
                 {cleaningLog && stage === 'dataCleaned' && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{cleaningLog}</p>}
            </div>

            {transactions.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Transactions" value={stats.totalTransactions.toLocaleString()} />
                        <StatCard title="Total Transaction Volume" value={`$${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                        <StatCard title="Actual Fraud Cases" value={stats.actualFraud.toLocaleString()} />
                         <StatCard title="AI Detected Fraud" value={stage === 'detectionComplete' ? stats.predictedFraud.toLocaleString() : 'N/A'} />
                    </div>

                    {stage === 'detectionComplete' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"><FraudBreakdownPieChart data={transactions} /></div>
                            <div className="lg:col-span-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"><FraudByMerchantBarChart data={transactions} /></div>
                        </div>
                    )}
                    
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                      <TransactionTimelineChart data={transactions} />
                    </div>

                    {modelMetrics && <ModelMetricsDisplay metrics={modelMetrics} />}

                    <TransactionTable transactions={transactions} detectionComplete={stage === 'detectionComplete'}/>
                </>
            )}
        </div>
    );
};

export default Dashboard;
