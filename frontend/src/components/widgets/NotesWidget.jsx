'use client';

import { useState, useEffect } from 'react';
import useDashboardStore from '@/store/useDashboardStore';

export default function NotesWidget({ widgetId, initialData }) {
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  const [text, setText] = useState(initialData?.text || '');

  useEffect(() => {
    setText(initialData?.text || '');
  }, [initialData]);

  const handleBlur = () => {
    updateWidget(widgetId, { text });
  };

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Write your notes here... (Auto-saves when you click outside)"
    />
  );
}
