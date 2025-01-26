import React from 'react';
import { Edit3, Tag, FileText } from 'lucide-react';
import RichEditor from '../RichEditor';
import { useTheme } from '../../context/ThemeContext';

interface BlogPostProps {
  content: string;
  onContentChange: (content: string) => void;
  metadata: {
    status?: 'draft' | 'published';
    category?: string;
  };
  onMetadataChange: (metadata: any) => void;
  editable?: boolean;
}

export default function BlogPost({
  content,
  onContentChange,
  metadata,
  onMetadataChange,
  editable = true
}: BlogPostProps) {
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const defaultContent = `
    <h1>Blog Post Title</h1>

    <blockquote>
      <p><em>Write a compelling introduction here...</em></p>
    </blockquote>

    <h2>Introduction</h2>
    <p>Start with a hook that grabs your reader's attention...</p>

    <h2>Main Content</h2>
    <h3>Section 1</h3>
    <p>Your first main point goes here...</p>

    <h3>Section 2</h3>
    <p>Your second main point goes here...</p>

    <h2>Key Takeaways</h2>
    <ul>
      <li>Key point 1</li>
      <li>Key point 2</li>
      <li>Key point 3</li>
    </ul>

    <h2>Conclusion</h2>
    <p>Wrap up your main points and call to action...</p>
  `;

  return (
    <div className={`${bgColor} rounded-lg shadow-lg border ${borderColor} min-h-screen`}>
      {/* Blog Post Metadata */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <FileText className="w-4 h-4" />
              Status
            </label>
            <select
              value={metadata.status || 'draft'}
              onChange={(e) => onMetadataChange({ ...metadata, status: e.target.value })}
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <Tag className="w-4 h-4" />
              Category
            </label>
            <input
              type="text"
              value={metadata.category || ''}
              onChange={(e) => onMetadataChange({ ...metadata, category: e.target.value })}
              placeholder="e.g., Technology"
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            />
          </div>
        </div>

        {editable && (
          <div className={`mt-6 p-4 rounded-lg ${inputBgColor} flex items-center gap-3`}>
            <Edit3 className={`w-5 h-5 ${textMutedColor}`} />
            <p className={`text-sm ${textMutedColor}`}>
              Pro tip: Use headings to structure your content and make it easier to read.
              Add images and links to make your post more engaging.
            </p>
          </div>
        )}
      </div>

      {/* Rich Text Editor */}
      <div className="p-6">
        <RichEditor
          content={content || defaultContent}
          onChange={onContentChange}
          placeholder="Start writing your blog post..."
          editable={editable}
          className="min-h-[500px]"
        />
      </div>
    </div>
  );
}