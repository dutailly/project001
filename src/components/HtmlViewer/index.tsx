import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface HtmlViewerProps {
  content: string;
  className?: string;
}

export default function HtmlViewer({
  content,
  className = '',
}: HtmlViewerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`w-full ${className}`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        fontSize: '16px',
        color: isDark ? '#e5e5e5' : 'inherit',
      }}
      dangerouslySetInnerHTML={{ __html: content || '' }}
    />
  );
}