import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import SimpleEditor from '../SimpleEditor';
import HtmlViewer from '../HtmlViewer';

interface QuickNoteProps {
  content: string;
  onContentChange: (content: string) => void;
  metadata: {
    color?: string;
  };
  onMetadataChange: (metadata: any) => void;
  editable?: boolean;
}

export const COLORS = [
  {
    name: 'yellow',
    // Classes Tailwind (pour le fond, texte, etc.)
    bg: 'bg-amber-50',
    darkBg: 'bg-amber-900/5',
    text: 'text-amber-900',
    darkText: 'text-amber-100',
    border: 'border-amber-100',
    darkBorder: 'border-amber-900/10',
    // Codes couleurs (accent -> hex/rgb/hsl…) pour usage en style inline
    accent: '#fbbf24',      // approx. amber-400
    darkAccent: '#fbbf24',
  },
  {
    name: 'blue',
    bg: 'bg-sky-50',
    darkBg: 'bg-sky-900/5',
    text: 'text-sky-900',
    darkText: 'text-sky-100',
    border: 'border-sky-100',
    darkBorder: 'border-sky-900/10',
    accent: '#38bdf8',      // approx. sky-400
    darkAccent: '#38bdf8',
  },
  {
    name: 'green',
    bg: 'bg-emerald-50',
    darkBg: 'bg-emerald-900/5',
    text: 'text-emerald-900',
    darkText: 'text-emerald-100',
    border: 'border-emerald-100',
    darkBorder: 'border-emerald-900/10',
    accent: '#34d399',      // approx. emerald-400
    darkAccent: '#34d399',
  },
  {
    name: 'pink',
    bg: 'bg-pink-50',
    darkBg: 'bg-pink-900/5',
    text: 'text-pink-900',
    darkText: 'text-pink-100',
    border: 'border-pink-100',
    darkBorder: 'border-pink-900/10',
    accent: '#fb7185',      // approx. pink-400
    darkAccent: '#fb7185',
  },
  {
    name: 'purple',
    bg: 'bg-purple-50',
    darkBg: 'bg-purple-900/5',
    text: 'text-purple-900',
    darkText: 'text-purple-100',
    border: 'border-purple-100',
    darkBorder: 'border-purple-900/10',
    accent: '#a78bfa',      // approx. purple-400
    darkAccent: '#a78bfa',
  },
];


export default function QuickNote({
  content,
  onContentChange,
  metadata = { color: 'yellow' },
  onMetadataChange,
  editable = true
}: QuickNoteProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getColorClasses = () => {
    const color = COLORS.find(c => c.name === metadata?.color) || COLORS[0];
    return {
      bg: isDark ? color.darkBg : color.bg,
      text: isDark ? color.darkText : color.text,
      accent: isDark ? color.darkAccent : color.accent,
      border: isDark ? color.darkBorder : color.border
    };
  };

  const colorClasses = getColorClasses();

  const handleColorClick = (colorName: string) => {
    onMetadataChange({ ...metadata, color: colorName });
  };

  return (
    
    <div
    className={`group/note relative rounded-2xl transition-all duration-300
      ${isDark ? 'bg-[#1a1b1e]' : 'bg-white'}
      shadow-sm hover:shadow-md border ${colorClasses.border} border-t-[6px]`}
    style={{ borderTopColor: colorClasses.accent }}
    >
        
      {/* Color selection */}
      {editable && (
        <div className="absolute top-0 right-0 m-3 flex gap-1.5 opacity-0 group-hover/note:opacity-100 transition-opacity duration-300 z-[60] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color.name)}
              style={{ backgroundColor: isDark ? color.darkAccent : color.accent }}
              className={`w-5 h-5 rounded-full transition-transform duration-300
                ${metadata?.color === color.name ? 'scale-110 ring-2 ring-white dark:ring-gray-800' : ''}
                hover:scale-110 cursor-pointer`}
            />
          ))}
        </div>
      )}


      {/* Content area */}
      <div className={`relative ${colorClasses.bg} transition-colors duration-300`}>
        <div className="px-8 py-6 relative">
          {editable ? (
            <SimpleEditor
              content={content || ''}
              onChange={(newContent) => onContentChange(newContent)}
              placeholder="Start writing your quick note..."
              editable={true}
              showToolbar={true}
              className="min-h-[200px]"
            />
          ) : (
            <HtmlViewer
              content={content || ''}
              className="min-h-[200px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
