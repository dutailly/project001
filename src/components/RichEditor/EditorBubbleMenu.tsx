import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Strikethrough, Code,
  Link, TextQuote, Heading1, Heading2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EditorBubbleMenuProps {
  editor: Editor;
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-[#25262b]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${bgColor} rounded-lg shadow-lg border border-gray-200 flex items-center p-1 gap-1`}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? textColor : textMutedColor
        }`}
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? textColor : textMutedColor
        }`}
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('strike') ? textColor : textMutedColor
        }`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('code') ? textColor : textMutedColor
        }`}
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-gray-200" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('heading', { level: 1 }) ? textColor : textMutedColor
        }`}
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('heading', { level: 2 }) ? textColor : textMutedColor
        }`}
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-gray-200" />

      <button
        onClick={() => {
          const url = window.prompt('Enter the URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('link') ? textColor : textMutedColor
        }`}
      >
        <Link className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded hover:bg-gray-100 ${
          editor.isActive('blockquote') ? textColor : textMutedColor
        }`}
      >
        <TextQuote className="w-4 h-4" />
      </button>
    </div>
  );
}