'use client';

import { X } from 'lucide-react';
import useDashboardStore from '@/store/useDashboardStore';
import ClockWidget from './widgets/ClockWidget';
import NotesWidget from './widgets/NotesWidget';
import TodoWidget from './widgets/TodoWidget';

const widgetComponents = {
  clock: ClockWidget,
  notes: NotesWidget,
  todo: TodoWidget,
};

export default function WidgetCard({ widget }) {
  const removeWidget = useDashboardStore((state) => state.removeWidget);

  const WidgetComponent = widgetComponents[widget.type];

  if (!WidgetComponent) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 h-80 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}
        </h3>
        <button
          onClick={() => removeWidget(widget.id)}
          className="text-gray-400 hover:text-red-600 transition"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <WidgetComponent widgetId={widget.id} initialData={widget.data} />
      </div>
    </div>
  );
}
