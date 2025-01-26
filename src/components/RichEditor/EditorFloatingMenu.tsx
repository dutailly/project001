import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Plus,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Image,
  Table,
  CheckSquare,
  Quote
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EditorFloatingMenuProps {
  editor: Editor;
}

export default function EditorFloatingMenu({ editor }: EditorFloatingMenuProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-[#25262b]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';

  const [showMenu, setShowMenu] = React.useState(false);

  const MenuButton = ({ onClick, children, label }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ${textMutedColor} hover:${textColor} w-full text-left`}
    >
      {children}
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${bgColor} rounded-full p-1 shadow-lg border border-gray-200`}
      >
        <Plus className={`w-4 h-4 ${textMutedColor}`} />
      </button>

      {showMenu && (
        <div
          className={`absolute left-0 mt-2 ${bgColor} rounded-lg shadow-xl border border-gray-200 p-2 min-w-[200px]`}
        >
          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              setShowMenu(false);
            }}
            label="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              setShowMenu(false);
            }}
            label="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
              setShowMenu(false);
            }}
            label="Bullet List"
          >
            <List className="w-4 h-4" />
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
              setShowMenu(false);
            }}
            label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleTaskList().run();
              setShowMenu(false);
            }}
            label="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
              setShowMenu(false);
            }}
            label="Quote"
          >
            <Quote className="w-4 h-4" />
          </MenuButton>

          <MenuButton
            onClick={() => {
              const url = window.prompt('Enter the URL of the image:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
              setShowMenu(false);
            }}
            label="Image"
          >
            <Image className="w-4 h-4" />
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true
              }).run();
              setShowMenu(false);
            }}
            label="Table"
          >
            <Table className="w-4 h-4" />
          </MenuButton>
        </div>
      )}
    </div>
  );
}