import React from 'react';
import { useI18n } from '../../i18n';

interface Model {
  id: string;
  name: string;
  description: string;
}

interface ModelSelectorProps {
  onSelectModel: (modelId: string) => void;
  selectedModelId: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelectModel, selectedModelId }) => {
  const { t } = useI18n();
  const models: Model[] = [
    {
      id: 'DeepSeek V4 Flash',
      name: 'DeepSeek V4 Flash',
      description: t('modelDescription'),
    },
  ];

  return (
    <div className="model-selector">
      <label className="model-selector-label">
        {t('chooseModel')}
      </label>
      <div className="model-selector-grid">
        {models.map((model) => (
          <div
            key={model.id}
            className={`
              model-selector-item
              ${selectedModelId === model.id ? 'model-selector-item-selected' : ''}
            `}
            onClick={() => onSelectModel(model.id)}
          >
            <h4 className="model-selector-item-title">{model.name}</h4>
            <p className="model-selector-item-description">{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
