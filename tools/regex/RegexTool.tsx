import React, { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle2, Copy, RefreshCcw } from 'lucide-react';

const CHEATSHEET = [
  { label: '任意字符', code: '.' },
  { label: '数字', code: '\\d' },
  { label: '非数字', code: '\\D' },
  { label: '字母数字下划线', code: '\\w' },
  { label: '空白字符', code: '\\s' },
  { label: '行首', code: '^' },
  { label: '行尾', code: '$' },
  { label: '零次或多次', code: '*' },
  { label: '一次或多次', code: '+' },
  { label: '零次或一次', code: '?' },
  { label: '分组', code: '(...)' },
  { label: '集合', code: '[abc]' },
];

export const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState('([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+)');
  const [flags, setFlags] = useState('gm');
  const [testString, setTestString] = useState(
    "Hello, my email is test@example.com and support@devtoolbox.pro.\nFeel free to contact me!"
  );

  // Regex Validation & compilation
  const regex = useMemo(() => {
    try {
      return new RegExp(pattern, flags);
    } catch (e) {
      return null;
    }
  }, [pattern, flags]);

  // Handle Highlighting
  const renderHighlightedText = () => {
    if (!regex || !pattern) return testString;

    let matches: RegExpMatchArray[] = [];
    try {
        // Clone regex to ensure we don't mess up state if it's global
        const rx = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
        matches = Array.from(testString.matchAll(rx));
    } catch (e) {
        // fallback
        return testString;
    }

    if (matches.length === 0) return testString;

    const elements: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      if (match.index === undefined) return;
      
      // Push text before match
      if (match.index > lastIndex) {
        elements.push(testString.slice(lastIndex, match.index));
      }

      // Push match
      elements.push(
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/50 text-slate-900 dark:text-white rounded-sm px-0.5">
          {match[0]}
        </mark>
      );

      lastIndex = match.index + match[0].length;
    });

    // Push remaining text
    if (lastIndex < testString.length) {
      elements.push(testString.slice(lastIndex));
    }

    return <>{elements}</>;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Panel: Input & Test */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        
        {/* Regex Input */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">正则表达式 (Regular Expression)</label>
            {regex ? (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> 有效
              </span>
            ) : (
              <span className="text-xs text-red-500 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> 语法错误
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
             <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">/</span>
                <input 
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className={`w-full pl-6 pr-3 py-2 font-mono text-sm rounded-lg border bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 ${!regex ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">/</span>
             </div>
             <input 
               type="text"
               value={flags}
               onChange={(e) => setFlags(e.target.value)}
               placeholder="flags"
               className="w-16 py-2 px-2 font-mono text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500 text-center"
             />
          </div>
        </div>

        {/* Test String & Results */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm flex flex-col overflow-hidden relative">
           <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">测试文本</span>
              <button 
                onClick={() => setTestString('')} 
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center"
              >
                <RefreshCcw className="w-3 h-3 mr-1" /> 清空
              </button>
           </div>
           
           <div className="flex-1 relative overflow-auto custom-scrollbar group">
              {/* Editor Textarea */}
              <textarea 
                className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-6 bg-transparent text-transparent caret-slate-900 dark:caret-white z-10 outline-none resize-none whitespace-pre-wrap break-all"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                spellCheck={false}
              />
              
              {/* Highlight Layer */}
              <div className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-6 whitespace-pre-wrap break-all text-slate-600 dark:text-slate-400 pointer-events-none z-0">
                 {renderHighlightedText()}
              </div>
           </div>
        </div>
      </div>

      {/* Right Panel: Cheatsheet */}
      <div className="w-full lg:w-64 bg-white dark:bg-slate-900 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm flex flex-col overflow-hidden">
         <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">常用语法速查</span>
         </div>
         <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <div className="grid grid-cols-1 gap-1">
              {CHEATSHEET.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => setPattern(prev => prev + item.code)}
                  className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-left group"
                >
                   <div className="flex flex-col">
                      <code className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded w-fit mb-1">
                        {item.code}
                      </code>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
                   </div>
                   <Copy className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};