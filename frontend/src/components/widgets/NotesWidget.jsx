'use client';

import { useState, useEffect } from 'react';
import useDashboardStore from '@/store/useDashboardStore';

export default function NotesWidget({ widgetId, initialData }) {
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  const [text, setText] = useState(initialData?.text || '');

  useEffect(() => {
    setText(initialData?.text || '');
  }, [initialData]);

  const handleSave = () => {
    updateWidget(widgetId, { text });
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div className="flex flex-col h-full">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        className="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Write your notes here..."
      />
      <button
        onClick={handleSave}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Save
      </button>
    </div>
  );
}
