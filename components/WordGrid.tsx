
import React from 'react';
import { Category, Word } from '../types';
import Card from './Card';
import { PlusIcon } from './icons';
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
    <div className="mt-8">
      {/* Header removed as navigation is now in the SentenceBar */}
      <div className="flex items-center mb-2 justify-center">
        <h1 className="text-xl font-bold text-center text-current opacity-90">{category.name}</h1>
      </div>
      
      {/* Dense responsive grid to fill width */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1">
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
