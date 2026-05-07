import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Card from '../../components/ui/Card';
import ProblemInput from '../../components/features/ProblemInput';
import SolutionDisplay from '../../components/features/SolutionDisplay';
import ModelSelector from '../../components/features/ModelSelector';
import HistoryList from '../../components/features/HistoryList';
import { useI18n } from '../../i18n';

interface Problem {
  id: string;
  content: string;
  type: 'text' | 'image';
  solution: string;
  timestamp: number;
}

const AppPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedModel, setSelectedModel] = useState('DeepSeek V4 Flash');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState('');
  const [history, setHistory] = useState<Problem[]>([]);
  const { t } = useI18n();

  const handleSubmit = async (type: 'text' | 'image', content: string) => {
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const newSolution = type === 'text' 
        ? `Solution for "${content}" (model: ${selectedModel})`
        : `Solution for the uploaded image (model: ${selectedModel})`;
      
      const newProblem: Problem = {
        id: Date.now().toString(),
        content,
        type,
        solution: newSolution,
        timestamp: Date.now(),
      };
      
      setSolution(newSolution);
      setHistory([newProblem, ...history]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectHistory = (problem: Problem) => {
    setSolution(problem.solution);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 shadow-sm border border-primary/10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('welcomeBack', { name: user.name || 'User' })}</h1>
        <p className="text-gray-600">{t('personalizedLearning')}</p>
      </div>
      
      {/* 模型选择和问题输入 */}
      <Card shadow="lg" padding="lg">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('chooseModel')}</h2>
            <ModelSelector
              selectedModelId={selectedModel}
              onSelectModel={setSelectedModel}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('inputProblem')}</h2>
            <ProblemInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Card>

      {/* 解决方案和历史记录 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card shadow="lg" padding="lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('solution')}</h2>
            {solution ? (
              <SolutionDisplay solution={solution} />
            ) : (
              <div className="text-center py-16 text-gray-500 animate-fade-in">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-600">{t('noSolution')}</p>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card shadow="lg" padding="lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('history')}</h2>
            <HistoryList
              history={history}
              onSelectHistory={handleSelectHistory}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
