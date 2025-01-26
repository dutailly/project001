import React, { useRef, useState } from 'react';
import { Upload, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useBookmarks } from '../../context/BookmarkContext';
import { parseCSV } from '../../utils/csvParser';

export default function ImportSection() {
  const { theme } = useTheme();
  const { addBookmark } = useBookmarks();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: number; failed: number } | null>(null);

  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const bookmarks = parseCSV(text);

      if (bookmarks.length > 100) {
        setError('Maximum 100 bookmarks allowed per import');
        return;
      }

      let successCount = 0;
      let failedCount = 0;

      for (const bookmark of bookmarks) {
        try {
          await addBookmark({
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description,
            folder: bookmark.folder,
            tags: bookmark.tags,
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=128`,
          });
          successCount++;
        } catch {
          failedCount++;
        }
      }

      setImportStatus({ success: successCount, failed: failedCount });
      setSuccess(`Successfully imported ${successCount} bookmarks`);
      if (failedCount > 0) {
        setError(`Failed to import ${failedCount} bookmarks`);
      }
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Import Data</h2>
        <p className={`${textMutedColor} mb-6`}>
          Import your bookmarks from a CSV file.
        </p>
      </div>

      {success && (
        <div className="bg-green-500 bg-opacity-10 text-green-500 px-4 py-2 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500 bg-opacity-10 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className={`block w-full p-8 border-2 border-dashed ${borderColor} rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors`}
        >
          <Upload className="w-8 h-8 mx-auto mb-4" />
          <span className="block text-lg font-medium mb-1">
            Click to upload CSV file
          </span>
          <span className={`block text-sm ${textMutedColor}`}>
            Maximum 100 bookmarks
          </span>
        </label>

        <div className="absolute top-4 right-4">
          <button
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
            className={textMutedColor}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {showHelp && (
            <div className="absolute right-0 mt-2 w-72 p-4 rounded-lg shadow-lg bg-black text-white text-sm z-50">
              <p className="mb-2">CSV Format Requirements:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Fields must be separated by semicolons (;)</li>
                <li>All fields must be enclosed in double quotes (")</li>
                <li>Required columns: "URL";"Title";"Description";"Folder";"Tags"</li>
                <li>Folder can be empty ("")</li>
                <li>Tags should be comma-separated within the quotes</li>
                <li>Maximum 100 bookmarks per import</li>
              </ul>
              <p className="mt-2">Example:</p>
              <code className="block mt-1 p-1 bg-gray-800 rounded text-xs">
                "https://example.com";"My Site";"Description";"Work";"tag1,tag2"
              </code>
            </div>
          )}
        </div>
      </div>

      {importStatus && (
        <div className={`text-sm ${textMutedColor}`}>
          Import results: {importStatus.success} successful, {importStatus.failed} failed
        </div>
      )}
    </div>
  );
}