import React from 'react';
import { Code, Braces, FileCode } from 'lucide-react';
import RichEditor from '../RichEditor';
import { useTheme } from '../../context/ThemeContext';

interface CodeSnippetProps {
  content: string;
  onContentChange: (content: string) => void;
  metadata: {
    language?: string;
    framework?: string;
  };
  onMetadataChange: (metadata: any) => void;
  editable?: boolean;
}

export default function CodeSnippet({
  content,
  onContentChange,
  metadata,
  onMetadataChange,
  editable = true
}: CodeSnippetProps) {
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const defaultContent = `
    <h1>Code Snippet</h1>

    <h2>Description</h2>
    <p>Brief description of what this code does...</p>

    <h2>Dependencies</h2>
    <ul>
      <li>Dependency 1</li>
      <li>Dependency 2</li>
    </ul>

    <h2>Code</h2>
    <pre><code>// Your code here
function example() {
  // Implementation
  return result;
}</code></pre>

    <h2>Usage Example</h2>
    <pre><code>// Example usage
const result = example();
console.log(result);</code></pre>

    <h2>Parameters</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
          <th>Required</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>param1</td>
          <td>string</td>
          <td>Description of param1</td>
          <td>Yes</td>
        </tr>
      </tbody>
    </table>

    <h2>Return Value</h2>
    <p>Description of what the code returns...</p>

    <h2>Notes</h2>
    <ul>
      <li>Important note 1</li>
      <li>Important note 2</li>
    </ul>

    <h2>Related Snippets</h2>
    <ul>
      <li>Related snippet 1</li>
      <li>Related snippet 2</li>
    </ul>
  `;

  return (
    <div className={`${bgColor} rounded-lg shadow-lg border ${borderColor} min-h-screen`}>
      {/* Snippet Metadata */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <Code className="w-4 h-4" />
              Language
            </label>
            <input
              type="text"
              value={metadata.language || ''}
              onChange={(e) => onMetadataChange({ ...metadata, language: e.target.value })}
              placeholder="e.g., JavaScript"
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            />
          </div>

          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <Braces className="w-4 h-4" />
              Framework
            </label>
            <input
              type="text"
              value={metadata.framework || ''}
              onChange={(e) => onMetadataChange({ ...metadata, framework: e.target.value })}
              placeholder="e.g., React"
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            />
          </div>
        </div>

        {editable && (
          <div className={`mt-6 p-4 rounded-lg ${inputBgColor} flex items-center gap-3`}>
            <FileCode className={`w-5 h-5 ${textMutedColor}`} />
            <p className={`text-sm ${textMutedColor}`}>
              Pro tip: Use code blocks for your snippets and examples.
              Press <kbd className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">```</kbd> to
              start a code block.
            </p>
          </div>
        )}
      </div>

      {/* Rich Text Editor */}
      <div className="p-6">
        <RichEditor
          content={content || defaultContent}
          onChange={onContentChange}
          placeholder="Start documenting your code..."
          editable={editable}
          className="min-h-[500px]"
        />
      </div>
    </div>
  );
}