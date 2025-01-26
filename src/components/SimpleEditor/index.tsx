import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '../../context/ThemeContext';

export interface SimpleEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  showToolbar?: boolean;
}

export default function SimpleEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  className = '',
  showToolbar = true,
}: SimpleEditorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full relative ${className}`}>
      <Editor
        apiKey='yc52x2m887fshac3vlceirpsg3euzehlje25nfcff4mbemlg'
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'lists', 'link', 'image', 'charmap', 'preview', 
            'searchreplace', 'fullscreen',
            'table', 'help', 'wordcount'
          ],
          toolbar: showToolbar ? 'undo redo | formatselect | ' +
            'bold italic underline | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help' : false,
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px;
              ${isDark ? 'background-color: #1a1b1e; color: #e5e5e5;' : ''}
              position: relative;
              z-index: 1;
            }
          `,
          skin: isDark ? 'oxide-dark' : 'oxide',
          content_css: isDark ? 'dark' : 'default',
          placeholder: placeholder,
          branding: false,
          promotion: false,
          statusbar: false,
        }}
        disabled={!editable}
        value={content || ''}
        onEditorChange={(newContent) => {
          onChange(newContent || '');
        }}
      />
    </div>
  );
}
