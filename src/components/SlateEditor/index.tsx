import React, { useMemo, useCallback } from 'react';
import {
  createEditor,
  Descendant,
  Node,
  Element,
  Text,
  BaseEditor,
  BaseText
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor
} from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';

interface SlateEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = BaseText & { text: string }

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

// Convert HTML string to Slate value
const deserialize = (html: string): Descendant[] => {
  if (!html) return [{ type: 'paragraph', children: [{ text: '' }] }];
  
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const text = div.textContent || '';
  return [
    {
      type: 'paragraph' as const,
      children: [{ text }],
    },
  ];
};

// Convert Slate value to HTML string
const serialize = (nodes: Descendant[]): string => {
  return nodes
    .map(n => Node.string(n))
    .join('\n');
};

export default function SlateEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  className = '',
}: SlateEditorProps) {
  // Create a Slate editor object that won't change across renders
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initialize the editor content
  const initialValue = useMemo(() => deserialize(content), [content]);

  // Define change handler
  const handleChange = useCallback(
    (value: Descendant[]) => {
      const html = serialize(value);
      onChange(html);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <Editable
          placeholder={placeholder}
          readOnly={!editable}
          className="outline-none min-h-[200px] w-full"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
          onKeyDown={(event) => {
            // Ensure space key is handled naturally
            if (event.key === ' ') {
              return;
            }
          }}
        />
      </Slate>
    </div>
  );
}
