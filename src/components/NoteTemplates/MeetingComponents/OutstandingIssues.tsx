import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Issue {
  id: string;
  text: string;
}

interface OutstandingIssuesProps {
  issues: Issue[];
  onChange: (issues: Issue[]) => void;
}

export default function OutstandingIssues({ issues, onChange }: OutstandingIssuesProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  const addIssue = () => {
    onChange([...issues, { id: crypto.randomUUID(), text: '' }]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>Outstanding Issues</span>
        </div>
        <button
          type="button"
          onClick={addIssue}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          Add Issue
        </button>
      </div>
      <div className="space-y-2">
        {issues.map((issue, index) => (
          <div key={issue.id} className="flex items-center gap-2">
            <input
              type="text"
              value={issue.text}
              onChange={(e) => {
                const newIssues = [...issues];
                newIssues[index].text = e.target.value;
                onChange(newIssues);
              }}
              placeholder="Describe the issue..."
              className={`flex-1 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              onClick={() => {
                onChange(issues.filter((_, i) => i !== index));
              }}
              className="text-red-500 hover:text-red-600 px-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}