import React from 'react';
import { FileCode, GitBranch, AlertCircle } from 'lucide-react';
import RichEditor from '../RichEditor';
import { useTheme } from '../../context/ThemeContext';

interface TechnicalDocProps {
  content: string;
  onContentChange: (content: string) => void;
  metadata: {
    version?: string;
    status?: string;
  };
  onMetadataChange: (metadata: any) => void;
  editable?: boolean;
}

export default function TechnicalDoc({
  content,
  onContentChange,
  metadata,
  onMetadataChange,
  editable = true
}: TechnicalDocProps) {
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const defaultContent = `
    <h1>Technical Documentation</h1>

    <h2>Overview</h2>
    <p>Provide a brief overview of the technical document here...</p>

    <h2>Prerequisites</h2>
    <ul>
      <li>Requirement 1</li>
      <li>Requirement 2</li>
    </ul>

    <h2>Installation</h2>
    <pre><code>// Installation steps here
npm install my-package</code></pre>

    <h2>Usage</h2>
    <pre><code>// Example code here
const example = new Example();
example.doSomething();</code></pre>

    <h2>API Reference</h2>
    <h3>Methods</h3>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Parameters</th>
          <th>Return Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>method()</td>
          <td>param: string</td>
          <td>void</td>
          <td>Description here</td>
        </tr>
      </tbody>
    </table>

    <h2>Troubleshooting</h2>
    <blockquote>
      <p>Common issues and their solutions...</p>
    </blockquote>
  `;

  return (
    <div className={`${bgColor} rounded-lg shadow-lg border ${borderColor} min-h-screen`}>
      {/* Document Metadata */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <GitBranch className="w-4 h-4" />
              Version
            </label>
            <input
              type="text"
              value={metadata.version || ''}
              onChange={(e) => onMetadataChange({ ...metadata, version: e.target.value })}
              placeholder="e.g., 1.0.0"
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            />
          </div>

          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <AlertCircle className="w-4 h-4" />
              Status
            </label>
            <select
              value={metadata.status || ''}
              onChange={(e) => onMetadataChange({ ...metadata, status: e.target.value })}
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            >
              <option value="">Select status</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {editable && (
          <div className={`mt-6 p-4 rounded-lg ${inputBgColor} flex items-center gap-3`}>
            <FileCode className={`w-5 h-5 ${textMutedColor}`} />
            <p className={`text-sm ${textMutedColor}`}>
              Pro tip: Use code blocks for examples and API references.
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
          placeholder="Start writing documentation..."
          editable={editable}
          className="min-h-[500px]"
        />
      </div>
    </div>
  );
}