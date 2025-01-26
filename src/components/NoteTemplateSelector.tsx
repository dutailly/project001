import React from 'react';
import { noteTemplates } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';
import { icons, ArrowLeft } from 'lucide-react';

interface NoteTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  onBack: () => void;
}

export default function NoteTemplateSelector({ onSelectTemplate, onBack }: NoteTemplateSelectorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedTextColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBgColor = isDark ? 'hover:bg-[#35363c]' : 'hover:bg-gray-50';

  const renderTemplateIcon = (iconName: string) => {
    const Icon = icons[iconName as keyof typeof icons];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <div className={`${bgColor} rounded-lg border ${borderColor} shadow-sm w-full`}>
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 p-2 ${mutedTextColor} ${hoverBgColor} rounded-lg
              hover:text-blue-500 transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h2 className={`text-2xl font-medium ${textColor}`}>Choose Template</h2>
            <p className={`mt-1 text-sm ${mutedTextColor}`}>Select a template to get started with your new note</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {noteTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`group p-4 rounded-lg border ${borderColor} ${hoverBgColor} border-b-2
                transition-all duration-200 text-left hover:border-blue-500 hover:shadow-sm`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`${mutedTextColor} group-hover:text-blue-500 transition-colors`}>
                  {renderTemplateIcon(template.icon)}
                </span>
                <h3 className={`font-medium ${textColor} group-hover:text-blue-500 transition-colors`}>
                  {template.name}
                </h3>
              </div>
              <p className={`text-sm ${mutedTextColor}`}>{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
