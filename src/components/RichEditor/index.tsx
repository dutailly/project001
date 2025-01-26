import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { useTheme } from '../../context/ThemeContext';

// Custom extension to handle text input
const TextInputExtension = Extension.create({
  name: 'textInput',
  addKeyboardShortcuts() {
    return {
      Space: () => {
        this.editor.commands.insertContent(' ');
        return true;
      },
    };
  },
});

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  showToolbar?: boolean;
  className?: string;
}

export default function RichEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  showToolbar = true,
  className = '',
}: RichEditorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isInternalChange = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-list-item',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder,
      }),
      TextInputExtension,
    ],
    content,
    editable,
    enableInputRules: false,
    enablePasteRules: false,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      onChange(editor.getHTML());
      isInternalChange.current = false;
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''} focus:outline-none`,
        spellcheck: 'true',
      },
    },
  });

  useEffect(() => {
    if (editor && !isInternalChange.current) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`rich-editor ${className}`}>
      <style>{`
        .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          white-space: pre-wrap !important;
          word-wrap: break-word;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          tab-size: 4;
        }
        
        .ProseMirror:focus {
          outline: none;
        }

        .editor-paragraph {
          margin-bottom: 1em;
          white-space: pre-wrap !important;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .ProseMirror p {
          margin-bottom: 1em;
          white-space: pre-wrap !important;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #b4b4b4;
          padding-left: 1em;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
        }

        .ProseMirror code {
          background-color: rgba(97, 97, 97, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }

        .ProseMirror pre {
          background-color: rgba(97, 97, 97, 0.1);
          padding: 1em;
          border-radius: 5px;
          margin-bottom: 1em;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin-bottom: 1em;
          overflow: hidden;
        }

        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid #b4b4b4;
          padding: 0.5em;
          vertical-align: top;
        }

        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: rgba(97, 97, 97, 0.1);
        }

        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5em;
        }

        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
          margin: 0.5em 0.5em 0 0;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}
