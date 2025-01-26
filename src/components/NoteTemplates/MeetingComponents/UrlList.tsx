import React from 'react';
import { Link2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Url {
  id: string;
  url: string;
  description: string;
}

interface UrlListProps {
  urls: Url[];
  onChange: (urls: Url[]) => void;
}

export default function UrlList({ urls, onChange }: UrlListProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  const addUrl = () => {
    onChange([...urls, { id: crypto.randomUUID(), url: '', description: '' }]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link2 className="w-4 h-4" />
          <span>URLs of Interest</span>
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          Add URL
        </button>
      </div>
      <div className="space-y-2">
        {urls.map((url, index) => (
          <div key={url.id} className="flex items-center gap-2">
            <input
              type="url"
              value={url.url}
              onChange={(e) => {
                const newUrls = [...urls];
                newUrls[index].url = e.target.value;
                onChange(newUrls);
              }}
              placeholder="https://..."
              className={`flex-1 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="text"
              value={url.description}
              onChange={(e) => {
                const newUrls = [...urls];
                newUrls[index].description = e.target.value;
                onChange(newUrls);
              }}
              placeholder="Description"
              className={`flex-1 ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              onClick={() => {
                onChange(urls.filter((_, i) => i !== index));
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