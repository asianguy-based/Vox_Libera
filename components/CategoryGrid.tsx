
import React, { useState } from 'react';
import { Category } from '../types';
import Card from './Card';
import { PlusIcon } from './icons';
import { UI_LABELS } from '../data/translations';

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  customColor?: string;
  onAddCategory: () => void;
  onMoveCategory: (fromIndex: number, toIndex: number) => void;
  labels?: any;
}

const CategoryGrid = ({ categories, onCategoryClick, customColor, onAddCategory, onMoveCategory, labels }: CategoryGridProps): React.ReactElement => {
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
     e.preventDefault(); // Necessary to allow dropping
     e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
     e.preventDefault();
     if (draggedIndex === null) return;
     if (draggedIndex !== dropIndex) {
        onMoveCategory(draggedIndex, dropIndex);
     }
     setDraggedIndex(null);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-4 mb-4">
         <h1 className="text-xl font-bold text-current opacity-90">{labels?.selectCategory || "Select a Category"}</h1>
         <button 
           onClick={() => setIsReordering(!isReordering)}
           className={`px-2 py-0.5 text-xs font-semibold rounded-full border transition-all ${isReordering ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-transparent text-slate-500 border-slate-300 hover:border-blue-400 hover:text-blue-600'}`}
         >
           {isReordering ? (labels?.done || 'Done') : (labels?.rearrange || 'Rearrange')}
         </button>
      </div>
      
      {/* Dense responsive grid to fill width */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1">
        {categories.map((category, index) => (
          <div
            key={category.name}
            draggable={isReordering}
            onDragStart={(e) => isReordering && handleDragStart(e, index)}
            onDragOver={(e) => isReordering && handleDragOver(e)}
            onDrop={(e) => isReordering && handleDrop(e, index)}
            className={`transition-all duration-200 ${isReordering ? 'cursor-move' : ''} ${draggedIndex === index ? 'opacity-40 scale-95' : ''}`}
            title={isReordering ? "Drag to reorder" : category.name}
          >
              <Card
                label={category.name}
                icon={category.icon}
                onClick={() => !isReordering && onCategoryClick(category)}
                color={customColor || category.color}
              />
          </div>
        ))}
        
        {/* Add Category Button */}
        {!isReordering && (
            <button
            onClick={onAddCategory}
            className="flex flex-col items-center justify-center p-2 aspect-auto min-h-[6rem] h-full rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
            <PlusIcon className="w-8 h-8 mb-1 opacity-50" />
            <span className="text-xs font-semibold text-center">{labels?.addCategory || "Add Category"}</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default CategoryGrid;
