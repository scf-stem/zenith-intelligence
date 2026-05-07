import React from 'react';
import Card from '../ui/Card';
import { useI18n } from '../../i18n';

interface SolutionDisplayProps {
  solution: string;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
  const { t } = useI18n();
  return (
    <Card header={<h3 className="text-lg font-semibold text-dark">{t('answer')}</h3>}>
      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{solution}</div>
    </Card>
  );
};

export default SolutionDisplay;
