import React, { ReactNode, useState } from 'react';
import { tools } from '../config/tools-config';
import { ThemeMode } from '../types';
import { 
  Menu, 
  Moon, 
  Sun, 
  Monitor, 
  Search,
  Github
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPath: string;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

// Translate Category Names
const categoryMap: Record<string, string> = {
  'Development': '开发工具',
  'Utility': '常用工具',
  'System': '系统工具'
};

export const Layout: React.FC<LayoutProps> = ({ children, currentPath, theme, setTheme }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  // Manual navigation handler
  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.hash = path;
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 cursor-pointer" onClick={(e) => handleNavClick(e, '/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
             <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            DevToolbox
          </span>
        </div>

        <div className="p-4">
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          >
            <div className="flex items-center">
              <Search className="w-4 h-4 mr-2" />
              <span>搜索工具...</span>
            </div>
            <kbd className="hidden lg:inline-block text-xs bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 font-mono">⌘K</kbd>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {['Development', 'Utility'].map(category => (
            <div key={category}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {categoryMap[category] || category}
              </h3>
              <div className="space-y-1">
                {tools.filter(t => t.category === category).map(tool => {
                  const isActive = currentPath.startsWith(tool.path);
                  const Icon = tool.icon;
                  return (
                    <a
                      key={tool.id}
                      href={`#${tool.path}`}
                      onClick={(e) => handleNavClick(e, tool.path)}
                      className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'}
                      `}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                      {tool.name}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
             <Github className="w-5 h-5 mr-3" />
             GitHub 仓库
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {tools.find(t => currentPath.startsWith(t.path))?.name || '首页'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
               title={`主题: ${theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色' : '深色'}`}
             >
               {getThemeIcon()}
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};