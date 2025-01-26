import React from 'react';
import { CheckCircle2, Circle, Clock, Tag, Trash2, Folder, MoreVertical, Edit2, X, CheckSquare, MessageSquare, Paperclip } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { useTheme } from '../context/ThemeContext';
import { Todo } from '../context/TodoContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

function TodoItem({ todo, onEdit }: TodoItemProps) {
  const [showActions, setShowActions] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  React.useEffect(() => {
    if (isExpanded) {
      console.log('Task expanded:', {
        title: todo.title,
        hasChecklist: Boolean(todo.checklist),
        checklistLength: todo.checklist?.length,
        checklistItems: todo.checklist
      });
    }
  }, [isExpanded, todo]);
  const { toggleTodo, deleteTodo, selectedLabel, selectedFolder, updateTodo } = useTodo();
  const { theme } = useTheme();

  const itemBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-white';
  const actionBgColor = theme === 'dark' ? 'bg-[#35363c]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const themeStyles = useThemeStyles();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return textMutedColor;
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTodo(todo.id);
    }
    setShowActions(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(todo);
    setShowActions(false);
  };


  const completedChecklistItems = todo.checklist?.filter(item => item.completed).length || 0;
  const totalChecklistItems = todo.checklist?.length || 0;

  return (
    <div 
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const isClickable = target.closest('button') || 
                          target.closest('.actions-menu') || 
                          target.closest('input') || 
                          target.closest('.checklist-item');
        
        if (!isClickable) {
          console.log('Toggling expansion for task:', {
            title: todo.title,
            wasExpanded: isExpanded,
            clickedElement: target.tagName,
            hasChecklist: Boolean(todo.checklist),
            checklistLength: todo.checklist?.length
          });
          setIsExpanded(!isExpanded);
        }
      }}
      onDoubleClick={(e) => {
        if (
          !(e.target as HTMLElement).closest('button') &&
          !(e.target as HTMLElement).closest('.actions-menu') &&
          !(e.target as HTMLElement).closest('.checklist-item')
        ) {
          onEdit(todo);
        }
      }}
      className={`p-3 rounded-lg ${todo.completed ? `${itemBgColor} opacity-75` : itemBgColor} 
      hover:bg-opacity-95 transition-colors group border ${borderColor} relative space-y-2 shadow-sm cursor-pointer
      ${isExpanded ? 'ring-2 ring-blue-500 z-10' : ''}`}
    >
      
      {/* Date */}
      <div className={`text-xs ${textMutedColor}`}>
        {todo.dueDate}
      </div>

      {/* Title and Menu */}
      <div className="flex items-start justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${todo.completed ? `line-through ${textMutedColor}` : textColor}`}>
            {todo.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Tag className={`w-4 h-4 ${getPriorityColor(todo.priority)}`} />
          
          {/* Actions Menu */}
          <div className="relative actions-menu">
            <button
              onClick={() => setShowActions(!showActions)}
              className={`p-1 ${actionBgColor} rounded hover:bg-opacity-80 ${textMutedColor} hover:${textColor}`}
            >
              {showActions ? (
                <X className="w-3 h-3" />
              ) : (
                <MoreVertical className="w-3 h-3" />
              )}
            </button>

            {showActions && (
              <div className={`absolute top-0 right-full mr-1 ${itemBgColor} rounded-lg border ${borderColor} py-1 min-w-[120px] overflow-hidden shadow-lg`}>
                <button
                  onClick={handleEdit}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm ${textMutedColor} hover:${textColor} hover:${actionBgColor} transition-colors`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
        
      {/* Checklist Items */}
      {totalChecklistItems > 0 && (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs text-blue-500 w-4 h-4 flex items-center justify-center"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <div className="flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">{completedChecklistItems}/{totalChecklistItems}</span>
          </div>
          <div className="flex w-24 space-x-[2px]">
            {todo.checklist.map((item, index) => (
              <div
                key={index}
                className={`h-1 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-200'}`}
                style={{ width: `${100 / totalChecklistItems}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {isExpanded && (
        <div
        style={
          themeStyles.bgColor === 'bg-black'
            ? { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
            : {}
        }
        className="mt-3 space-y-2 border-t pt-3 border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-black rounded-lg p-2 relative z-20"
        onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={() => onEdit(todo)}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              Edit checklist
            </button>
          </div>
          {todo.checklist?.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-2 checklist-item"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  const newChecklist = todo.checklist.map(i =>
                    i.id === item.id ? { ...i, completed: !i.completed } : i
                  );
                  updateTodo(todo.id, { checklist: newChecklist });
                }}
                className={`flex items-center justify-center w-4 h-4 rounded border ${
                  item.completed 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {item.completed && <CheckSquare className="w-3 h-3" />}
              </button>
              <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : textColor}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress and Metadata */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Comments and Attachments */}
        <div className="flex items-center gap-2 ml-auto">
          {todo.comments?.length > 0 && (
            <div className="flex items-center gap-1 text-gray-500">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-xs">{todo.comments.length}</span>
            </div>
          )}
          {todo.attachments?.length > 0 && (
            <div className="flex items-center gap-1 text-gray-500">
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-xs">{todo.attachments.length}</span>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}

interface TodoListProps {
  onEditTask: (todo: Todo) => void;
}

function TodoList({ onEditTask }: TodoListProps) {
  const { filteredTodos } = useTodo();
  const { theme } = useTheme();
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const todos = filteredTodos('all');

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEditTask}
        />
      ))}

      {todos.length === 0 && (
        <div className={`text-center py-8 ${textMutedColor}`}>
          No tasks found
        </div>
      )}
    </div>
  );
}

export default TodoList;
