import React, { useState, useRef } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { parseCSV } from '../utils/csvParser';
import SettingsSidebar from '../components/SettingsSidebar';
import ProfileSection from '../components/settings/ProfileSection';
import SecuritySection from '../components/settings/SecuritySection';
import ImportSection from '../components/settings/ImportSection';
import PreferencesSection from '../components/settings/PreferencesSection';
import NotificationsSection from '../components/settings/NotificationsSection';

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const styles = useThemeStyles();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSectionChange = async (section: string) => {
    if (section === 'signout') {
      try {
        await signOut();
        navigate('/auth');
      } catch (error) {
        console.error('Failed to sign out:', error);
      }
    } else {
      setActiveSection(section);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'import':
        return <ImportSection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${styles.bgColor} ${styles.textColor}`}>
      {/* Header */}
      <header className={`${styles.cardBgColor} border-b ${styles.borderColor} sticky top-0 z-50 shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden ${styles.textMutedColor} hover:${styles.textColor}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 ${styles.textMutedColor} hover:${styles.textColor}`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          
          <span className={`hidden md:block ${styles.textColor}`}>
            {user?.displayName}
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-64 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 ${styles.cardBgColor} lg:bg-transparent
          overflow-y-auto
        `}>
          <SettingsSidebar 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className={`${styles.cardBgColor} rounded-lg p-6 shadow-lg border ${styles.borderColor}`}>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}