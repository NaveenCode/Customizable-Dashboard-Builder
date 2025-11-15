'use client';

import { X, Clock, FileText, CheckSquare } from 'lucide-react';
import useDashboardStore from '@/store/useDashboardStore';

const widgetTypes = [
  {
    type: 'clock',
    name: 'Clock',
    description: 'Display current time and date',
    icon: Clock,
  },
  {
    type: 'notes',
    name: 'Notes',
    description: 'Take quick notes',
    icon: FileText,
  },
  {
    type: 'todo',
    name: 'Todo List',
    description: 'Manage your tasks',
    icon: CheckSquare,
  },
];

export default function AddWidgetModal({ isOpen, onClose }) {
  const addWidget = useDashboardStore((state) => state.addWidget);

  const handleAddWidget = (type) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      position: Date.now(),
      data: type === 'todo' ? { todos: [] } : type === 'notes' ? { text: '' } : {},
    };
    addWidget(newWidget);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Widget</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {widgetTypes.map((widget) => {
            const Icon = widget.icon;
            return (
              <div
                key={widget.type}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col h-full"
                onClick={() => handleAddWidget(widget.type)}
              >
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="mb-3 text-blue-600">
                    <Icon size={48} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {widget.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex-1">{widget.description}</p>
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full">
                  Add
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
