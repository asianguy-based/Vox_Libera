
import React, { useState } from 'react';
import { Recording } from '../types';
import AudioRecorderControl from './AudioRecorderControl';
import { generateId } from '../utils/recordingsUtils';

interface RecordingsPageProps {
  recordings: Recording[];
  onGoBack: () => void;
  onPlay: (recording: Recording) => void;
  onSaveRecording: (id: string, audioData: string) => void;
  onDeleteAudio: (id: string) => void;
  onAddRecording: (label: string, icon: string) => void;
  onRenameRecording: (id: string, label: string) => void;
  onDeleteRecording: (id: string) => void;
  customColor?: string;
  darkMode?: boolean;
}

const ICON_CHOICES = ['📝', '⭐', '🎙️', '💬', '❤️', '🎵', '👋', '🙏'];

// Dedicated full-page view for all of a user's spoken recordings - the 5
// default starter slots plus any custom ones they've added. Kept separate
// from Settings so recording/playing/organizing personal voice clips is
// quick to reach directly from the main category grid, per the user's
// request to have "all the custom items in their own category page for
// easy access."
const RecordingsPage = ({
  recordings,
  onGoBack,
  onPlay,
  onSaveRecording,
  onDeleteAudio,
  onAddRecording,
  onRenameRecording,
  onDeleteRecording,
  darkMode,
}: RecordingsPageProps): React.ReactElement => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('📝');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const cardBase = darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800';

  const handleAddSubmit = () => {
    const label = newLabel.trim();
    if (!label) return;
    onAddRecording(label, newIcon);
    setNewLabel('');
    setNewIcon('📝');
    setIsAdding(false);
  };

  const startRename = (rec: Recording) => {
    setRenamingId(rec.id);
    setRenameValue(rec.label);
  };

  const submitRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) onRenameRecording(id, trimmed);
    setRenamingId(null);
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto px-1">
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="text-2xl">💾</span>
        <h1 className="text-xl font-bold text-current opacity-90">Saved Spoken Recordings</h1>
      </div>
      <p className="text-center text-sm opacity-70 mb-6">
        Record your own voice (or a loved one's) for quick, personal phrases. Tap a card to play it back on the main board.
      </p>

      <div className="space-y-3">
        {recordings.map((rec) => (
          <div key={rec.id} className={`rounded-xl border shadow-sm overflow-hidden transition-colors ${cardBase}`}>
            <div className="flex items-center gap-3 p-3">
              <button
                onClick={() => (rec.audioData ? onPlay(rec) : setExpandedId(expandedId === rec.id ? null : rec.id))}
                className="text-3xl leading-none select-none"
                title={rec.audioData ? 'Play' : 'Record audio'}
              >
                {rec.icon || '📝'}
              </button>

              <div className="flex-grow min-w-0">
                {renamingId === rec.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => submitRename(rec.id)}
                    onKeyDown={(e) => e.key === 'Enter' && submitRename(rec.id)}
                    className="w-full p-1.5 rounded border border-blue-400 text-slate-800 dark:text-slate-100 dark:bg-slate-900 text-sm"
                  />
                ) : (
                  <button
                    onClick={() => startRename(rec)}
                    className="font-semibold text-left truncate w-full hover:underline"
                    title="Tap to rename"
                  >
                    {rec.label}
                  </button>
                )}
                <p className="text-xs opacity-60">
                  {rec.audioData ? 'Recorded' : 'No audio yet'}
                  {rec.isDefault ? ' · Default slot' : ''}
                </p>
              </div>

              <button
                onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-current opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap"
              >
                {expandedId === rec.id ? 'Close' : rec.audioData ? 'Manage' : 'Record'}
              </button>

              {!rec.isDefault && (
                <button
                  onClick={() => {
                    if (confirm(`Delete "${rec.label}"? This cannot be undone.`)) onDeleteRecording(rec.id);
                  }}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  title="Delete this recording slot"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              )}
            </div>

            {expandedId === rec.id && (
              <div className={`px-3 pb-3 pt-1 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <AudioRecorderControl
                  label={rec.label}
                  existingAudio={rec.audioData}
                  onSaveAudio={(base64) => onSaveRecording(rec.id, base64)}
                  onDeleteAudio={() => onDeleteAudio(rec.id)}
                  compact
                />
              </div>
            )}
          </div>
        ))}

        {/* Add new recording */}
        {isAdding ? (
          <div className={`rounded-xl border-2 border-dashed p-4 space-y-3 ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
            <div className="flex gap-2 flex-wrap">
              {ICON_CHOICES.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setNewIcon(ic)}
                  className={`text-2xl p-2 rounded-lg transition-all ${newIcon === ic ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                  {ic}
                </button>
              ))}
            </div>
            <input
              autoFocus
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
              placeholder="Label, e.g. Mom's Voice"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={!newLabel.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
              >
                Add Recording
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <span className="text-2xl opacity-70">➕</span>
            <span className="text-sm font-semibold">Add Another Recording</span>
          </button>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={onGoBack} className="px-5 py-2.5 rounded-lg bg-slate-500 text-white font-semibold hover:bg-slate-600 transition-colors">
          ⬅️ Back to Categories
        </button>
      </div>
    </div>
  );
};

export default RecordingsPage;
