import React from 'react';
import { BarChart2, Database, FileSpreadsheet } from 'lucide-react';
import RichEditor from '../RichEditor';
import { useTheme } from '../../context/ThemeContext';

interface DataAnalysisProps {
  content: string;
  onContentChange: (content: string) => void;
  metadata: {
    dataSource?: string;
    methodology?: string;
  };
  onMetadataChange: (metadata: any) => void;
  editable?: boolean;
}

export default function DataAnalysis({
  content,
  onContentChange,
  metadata,
  onMetadataChange,
  editable = true
}: DataAnalysisProps) {
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const defaultContent = `
    <h1>Data Analysis Report</h1>

    <h2>Executive Summary</h2>
    <p>Brief overview of the analysis and key findings...</p>

    <h2>Data Source</h2>
    <ul>
      <li>Source: [Data Source Name]</li>
      <li>Time Period: [Time Period]</li>
      <li>Sample Size: [Sample Size]</li>
    </ul>

    <h2>Methodology</h2>
    <p>Description of the analysis approach...</p>

    <h2>Key Findings</h2>
    <h3>Finding 1</h3>
    <p>Description of first finding...</p>
    <blockquote>
      <p><strong>Insight:</strong> Key insight from this finding...</p>
    </blockquote>

    <h3>Finding 2</h3>
    <p>Description of second finding...</p>
    <blockquote>
      <p><strong>Insight:</strong> Key insight from this finding...</p>
    </blockquote>

    <h2>Data Visualization</h2>
    <p>Add charts and graphs here...</p>

    <h2>Statistical Analysis</h2>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
          <th>Significance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Metric 1</td>
          <td>Value 1</td>
          <td>p < 0.05</td>
        </tr>
      </tbody>
    </table>

    <h2>Conclusions</h2>
    <ul>
      <li>Conclusion 1</li>
      <li>Conclusion 2</li>
    </ul>

    <h2>Recommendations</h2>
    <ul>
      <li>Recommendation 1</li>
      <li>Recommendation 2</li>
    </ul>

    <h2>Next Steps</h2>
    <ul class="task-list">
      <li class="task-list-item" data-type="taskItem">
        <label>
          <input type="checkbox">
          <span>Follow-up analysis 1</span>
        </label>
      </li>
      <li class="task-list-item" data-type="taskItem">
        <label>
          <input type="checkbox">
          <span>Follow-up analysis 2</span>
        </label>
      </li>
    </ul>
  `;

  return (
    <div className={`${bgColor} rounded-lg shadow-lg border ${borderColor} min-h-screen`}>
      {/* Analysis Metadata */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <Database className="w-4 h-4" />
              Data Source
            </label>
            <input
              type="text"
              value={metadata.dataSource || ''}
              onChange={(e) => onMetadataChange({ ...metadata, dataSource: e.target.value })}
              placeholder="e.g., Sales Database 2023"
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            />
          </div>

          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium ${textMutedColor}`}>
              <FileSpreadsheet className="w-4 h-4" />
              Methodology
            </label>
            <input
              type="text"
              value={metadata.methodology || ''}
              onChange={(e) => onMetadataChange({ ...metadata, methodology: e.target.value })}
              placeholder="e.g., Regression Analysis"
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={!editable}
            />
          </div>
        </div>

        {editable && (
          <div className={`mt-6 p-4 rounded-lg ${inputBgColor} flex items-center gap-3`}>
            <BarChart2 className={`w-5 h-5 ${textMutedColor}`} />
            <p className={`text-sm ${textMutedColor}`}>
              Pro tip: Use tables for statistical data and add images for charts and visualizations.
              Structure your analysis with clear sections for methodology, findings, and conclusions.
            </p>
          </div>
        )}
      </div>

      {/* Rich Text Editor */}
      <div className="p-6">
        <RichEditor
          content={content || defaultContent}
          onChange={onContentChange}
          placeholder="Start your data analysis..."
          editable={editable}
          className="min-h-[500px]"
        />
      </div>
    </div>
  );
}