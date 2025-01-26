import React from 'react';
import { Hash, CheckSquare, UserCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import SimpleEditor from '../../SimpleEditor';

interface Decision {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  what: string;
  who: string;
  when: string;
}

interface TopicProps {
  id: string;
  name: string;
  description: string;
  decisions: Decision[];
  tasks: Task[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDecisionsChange: (decisions: Decision[]) => void;
  onTasksChange: (tasks: Task[]) => void;
  onDelete: () => void;
}

export default function Topic({
  id,
  name,
  description,
  decisions,
  tasks,
  onNameChange,
  onDescriptionChange,
  onDecisionsChange,
  onTasksChange,
  onDelete
}: TopicProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const addDecision = () => {
    onDecisionsChange([
      ...decisions,
      { id: crypto.randomUUID(), text: '', completed: false }
    ]);
  };

  const addTask = () => {
    onTasksChange([
      ...tasks,
      { id: crypto.randomUUID(), what: '', who: '', when: '' }
    ]);
  };

  return (
    <div className={`p-4 rounded-lg border ${borderColor} space-y-4`}>
      {/* Topic Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Hash className="w-4 h-4" />
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Topic name"
            className={`w-full ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          Remove Topic
        </button>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <SimpleEditor
          content={description}
          onChange={onDescriptionChange}
          placeholder="Topic description..."
        />
      </div>

      {/* Decisions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Decisions</label>
          <button
            type="button"
            onClick={addDecision}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Add Decision
          </button>
        </div>
        <div className="space-y-2">
          {decisions.map((decision, index) => (
            <div key={decision.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={decision.completed}
                onChange={(e) => {
                  const newDecisions = [...decisions];
                  newDecisions[index].completed = e.target.checked;
                  onDecisionsChange(newDecisions);
                }}
                className="mt-1.5"
              />
              <input
                type="text"
                value={decision.text}
                onChange={(e) => {
                  const newDecisions = [...decisions];
                  newDecisions[index].text = e.target.value;
                  onDecisionsChange(newDecisions);
                }}
                placeholder="Decision..."
                className={`flex-1 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => {
                  onDecisionsChange(decisions.filter((_, i) => i !== index));
                }}
                className="text-red-500 hover:text-red-600 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Assigned Tasks</label>
          <button
            type="button"
            onClick={addTask}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Add Task
          </button>
        </div>
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex items-start gap-2">
              <input
                type="text"
                value={task.what}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[index].what = e.target.value;
                  onTasksChange(newTasks);
                }}
                placeholder="What needs to be done..."
                className={`flex-1 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <input
                type="text"
                value={task.who}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[index].who = e.target.value;
                  onTasksChange(newTasks);
                }}
                placeholder="Who"
                className={`w-32 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <input
                type="date"
                value={task.when}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[index].when = e.target.value;
                  onTasksChange(newTasks);
                }}
                className={`w-32 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => {
                  onTasksChange(tasks.filter((_, i) => i !== index));
                }}
                className="text-red-500 hover:text-red-600 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}