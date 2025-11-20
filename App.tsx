import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { JsonTool } from './tools/json/JsonTool';
import { TimestampTool } from './tools/timestamp/TimestampTool';
import { RegexTool } from './tools/regex/RegexTool';
import { Home } from './pages/Home';
import { CommandPalette } from './components/CommandPalette';
import { ThemeMode } from './types';

const App: React.FC = () => {
  // Simple Hash-based routing
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash.slice(1) || '/');
  const [theme, setTheme] = useState<ThemeMode>('system');

  // Handle Theme
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const appliedTheme = theme === 'system' ? systemTheme : theme;

    if (appliedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle Routing
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.slice(1) || '/';
      setCurrentPath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    if (currentPath.startsWith('/tools/json')) return <JsonTool />;
    if (currentPath.startsWith('/tools/timestamp')) return <TimestampTool />;
    if (currentPath.startsWith('/tools/regex')) return <RegexTool />;
    return <Home />;
  };

  return (
    <>
      <Layout currentPath={currentPath} theme={theme} setTheme={setTheme}>
        {renderContent()}
      </Layout>
      <CommandPalette currentPath={currentPath} />
    </>
  );
};

export default App;