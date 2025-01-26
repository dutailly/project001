import React from 'react';
import { Home, ListTodo, Calendar, Star, Folder, Tag, X } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const { 
    todos, 
    getLabelsWithCount, 
    getFoldersWithCount,
    selectedLabel, 
    selectedFolder,
    setSelectedLabel, 
    setSelectedFolder,
    selectedView, 
    setSelectedView 
  } = useTodo();
  const { theme } = useTheme();

  const totalTasks = todos.length;
  const activeTasks = todos.filter(todo => !todo.completed).length;
  const todayTasks = todos.filter(todo => {
    const today = new Date().toISOString().split('T')[0];
    return todo.dueDate === today;
  }).length;
  const highPriorityTasks = todos.filter(todo => todo.priority === 'high').length;

  const menuItems = [
    { icon: Home, label: 'All Tasks', count: totalTasks, view: 'all' as const },
    { icon: ListTodo, label: 'Active Tasks', count: activeTasks, view: 'tasks' as const },
    { icon: Calendar, label: 'Today', count: todayTasks, view: 'today' as const },
    { icon: Star, label: 'Important', count: highPriorityTasks, view: 'important' as const },
  ];

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-[#2c2d32]' : 'hover:bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const handleLabelClick = (labelName: string) => {
    setSelectedLabel(selectedLabel === labelName ? null : labelName);
    onClose?.();
  };

  const handleFolderClick = (folderName: string) => {
    setSelectedFolder(selectedFolder === folderName ? null : folderName);
    onClose?.();
  };

  const handleMenuClick = (view: typeof selectedView) => {
    setSelectedView(view);
    onClose?.();
  };

  const folders = getFoldersWithCount();
  const labels = getLabelsWithCount();

  return (
    <aside className="h-full p-4">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleMenuClick(item.view)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
              selectedView === item.view
                ? `${bgColor} ${textColor}`
                : `${textMutedColor} ${hoverBgColor} hover:${textColor}`
            } transition-colors`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.count > 0 && (
              <span className={`${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-1 rounded-md text-sm`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Folders Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-4 mb-2">
          <h3 className={textMutedColor + " text-sm font-medium"}>Folders</h3>
        </div>
        <div className="space-y-2 px-4">
          {folders.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => handleFolderClick(name)}
              className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-colors ${
                selectedFolder === name
                  ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                  : `${textMutedColor} hover:${textColor} ${hoverBgColor}`
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                <span className="text-sm">{name}</span>
              </div>
              <span className={`text-xs ${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-0.5 rounded-md`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-4 mb-2">
          <h3 className={textMutedColor + " text-sm font-medium"}>Tags</h3>
        </div>
        <div className="space-y-2 px-4">
          {labels.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => handleLabelClick(name)}
              className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-colors ${
                selectedLabel === name
                  ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                  : `${textMutedColor} hover:${textColor} ${hoverBgColor}`
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="text-sm">{name}</span>
              </div>
              <span className={`text-xs ${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-0.5 rounded-md`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;