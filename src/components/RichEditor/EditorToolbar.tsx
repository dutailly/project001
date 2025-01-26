import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Image, Link, Table,
  CheckSquare, Quote, Heading1, Heading2, Heading3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EditorToolbarProps {
  editor: Editor;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-[#25262b]' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';

  const ToolbarButton = ({ onClick, active, children }: any) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : `${textMutedColor} hover:${textColor} hover:bg-gray-100`
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className={`sticky top-0 z-10 ${bgColor} border-b ${borderColor} mb-4`}>
      <div className="flex flex-wrap items-center gap-1 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive('taskList')}
        >
          <CheckSquare className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter the URL of the image:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <Image className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter the URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          active={editor.isActive('link')}
        >
          <Link className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({
            rows: 3,
            cols: 3,
            withHeaderRow: true
          }).run()}
        >
          <Table className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}