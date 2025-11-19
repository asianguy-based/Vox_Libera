import React from 'react';
import { Category, Word } from '../types';
import Card from './Card';
import { BackIcon, PlusIcon } from './icons';
import { UI_LABELS } from '../data/translations';

interface WordGridProps {
  category: Category;
  onWordClick: (word: Word) => void;
  onGoBack: () => void;
  customColor?: string;
  onAddWord: () => void;
  labels?: any;
}

const WordGrid = ({ category, onWordClick, onGoBack, customColor, onAddWord, labels }: WordGridProps): React.ReactElement => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-white bg-slate-500 hover:bg-slate-600 transition-colors duration-200 shadow-sm text-sm"
        >
          <BackIcon className="w-4 h-4" />
          {labels?.back || "Back"}
        </button>
        <h1 className="text-2xl font-bold text-center text-current opacity-90 flex-grow">{category.name}</h1>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
        {category.words.map((word) => (
          <Card
            key={word.label}
            label={word.label}
            icon={word.icon}
            onClick={() => onWordClick(word)}
            color={customColor || category.color}
          />
        ))}

         {/* Add Word Button */}
         <button
          onClick={onAddWord}
          className="flex flex-col items-center justify-center p-2 aspect-auto min-h-[6rem] h-full rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
        >
          <PlusIcon className="w-8 h-8 mb-1 opacity-50" />
          <span className="text-xs font-semibold text-center">{labels?.addPhrase || "Add Phrase"}</span>
        </button>
      </div>
    </div>
  );
};

export default WordGrid;