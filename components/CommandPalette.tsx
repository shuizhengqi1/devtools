import React, { useEffect, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { tools } from '../config/tools-config';

interface CommandPaletteProps {
  currentPath: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter tools based on query
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase())
  );

  // Open/Close keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Navigation keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredTools.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredTools.length) % filteredTools.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          window.location.hash = filteredTools[selectedIndex].path;
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, filteredTools, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleToolClick = (path: string) => {
    window.location.hash = path;
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6 md:p-20">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)} 
      />

      <div className="mx-auto max-w-xl transform divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 transition-all">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 sm:text-sm"
            placeholder="搜索工具..."
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <ul className="max-h-96 overflow-y-auto p-2 scroll-py-2">
          {filteredTools.length === 0 && (
            <li className="p-4 text-center text-sm text-slate-500">未找到相关工具。</li>
          )}
          {filteredTools.map((tool, index) => (
            <li key={tool.id}>
              <a
                href={`#${tool.path}`}
                onClick={(e) => { e.preventDefault(); handleToolClick(tool.path); }}
                className={`
                  group flex select-none items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${index === selectedIndex 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                <tool.icon 
                  className={`
                    h-5 w-5 flex-none mr-3
                    ${index === selectedIndex ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500'}
                  `} 
                />
                <span className="flex-auto">{tool.name}</span>
                {index === selectedIndex && <ArrowRight className="ml-3 h-4 w-4 flex-none text-white" />}
              </a>
            </li>
          ))}
        </ul>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex justify-between">
          <span>输入文字搜索</span>
          <span className="flex items-center gap-2">
            <kbd className="font-mono bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 px-1">↑↓</kbd> 导航
            <kbd className="font-mono bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 px-1">↵</kbd> 选择
            <kbd className="font-mono bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 px-1">esc</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  );
};