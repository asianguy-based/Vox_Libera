
import React, { useState } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (label: string, icon: string, color?: string) => void;
  type: 'category' | 'word';
}

const AddItemModal = ({ isOpen, onClose, onSave, type }: AddItemModalProps): React.ReactElement | null => {
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#6366f1'); // Default Indigo

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !icon) return;
    onSave(label, icon, type === 'category' ? color : undefined);
    // Reset form
    setLabel('');
    setIcon('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Add New {type === 'category' ? 'Category' : 'Phrase'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1">
            <span className="text-2xl">❌</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name / Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={type === 'category' ? "e.g. Hobbies" : "e.g. I like painting"}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Emoji Icon</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Paste an emoji here (e.g. 🎨)"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Tip: On Windows press 'Win + .' or on Mac 'Cmd + Ctrl + Space' to open emoji picker.</p>
          </div>

          {type === 'category' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Button Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-20 p-1 rounded border border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-600">{color}</span>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
