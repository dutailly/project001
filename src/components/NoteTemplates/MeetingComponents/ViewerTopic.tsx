import React from 'react';
import { Hash } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import HtmlViewer from '../../HtmlViewer';

interface ViewerTopicProps {
  name: string;
  description: string;
  decisions: Array<{ text: string; completed: boolean }>;
  tasks: Array<{ what: string; who: string; when: string }>;
}

export default function ViewerTopic({
  name,
  description,
  decisions,
  tasks,
}: ViewerTopicProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgBase = isDark ? 'bg-[#1e1e2f]' : 'bg-white';
  const bgHighlight = isDark ? 'bg-[#25262b]' : 'bg-gray-50';
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`rounded-lg border ${borderColor} overflow-hidden ${bgBase}`}>
      {/* Topic Header */}
      <div className="bg-[#4783ff] px-3 py-2">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-white" />
          <h3 className="font-semibold text-white text-base">{name}</h3>
        </div>
      </div>

      {/* Description */}
      <div className="p-2.5">
        <div className="mb-1">
          <label className={`text-sm font-medium ${textMutedColor}`}>
            Description
          </label>
        </div>
        <div className={`${bgHighlight} rounded-lg py-2 px-3 border ${borderColor}`}>
          <HtmlViewer content={description} />
        </div>
      </div>

      {/* Decisions */}
      {decisions.length > 0 && (
        <div className={`px-2.5 pt-1.5 pb-2 border-t ${borderColor}`}>
          <div className="mb-1">
            <label className={`text-sm font-medium ${textMutedColor}`}>
              Decisions
            </label>
          </div>
          <div className="space-y-0.5">
            {decisions.map((decision, index) => (
              <div key={index} className={`flex items-center gap-2 px-2.5 py-1 rounded-md ${bgHighlight}`}>
                <input
                  type="checkbox"
                  checked={decision.completed}
                  disabled
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#4783ff]"
                />
                <span className={`text-sm ${decision.completed ? 'line-through text-gray-400' : ''}`}>
                  {decision.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className={`px-2.5 pt-1.5 pb-2 border-t ${borderColor}`}>
          <div className="mb-1">
            <label className={`text-sm font-medium ${textMutedColor}`}>
              Assigned Tasks
            </label>
          </div>
          <div className="space-y-0.5">
            {tasks.map((task, index) => (
              <div key={index} className={`flex items-center justify-between px-2.5 py-1 rounded-md ${bgHighlight} text-sm`}>
                <span className="flex-1">{task.what}</span>
                <div className="flex items-center gap-1.5 ml-3">
                  <span className="px-2 py-0.5 bg-[#4783ff]/10 text-[#4783ff] rounded-md">
                    {task.who}
                  </span>
                  <span className="px-2 py-0.5 bg-[#4783ff]/5 text-[#4783ff] rounded-md">
                    {task.when}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}