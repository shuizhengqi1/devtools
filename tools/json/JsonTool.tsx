import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  AlertCircle, 
  Minimize2, 
  Maximize2, 
  Trash2, 
  FileCode, 
  AlignLeft,
  Split,
  Wrench,
  ArrowLeftRight,
  Hash
} from 'lucide-react';
import { JsonTree } from './JsonTree';
import { JsonDiff } from './JsonDiff';

type ViewMode = 'split' | 'code' | 'tree' | 'diff';

const DEFAULT_JSON = '{\n  "welcome": "欢迎使用 DevToolbox Pro",\n  "features": [\n    "强大的 JSON 编辑器",\n    "实时时间戳转换",\n    "正则测试工具"\n  ],\n  "tips": "尝试点击左侧的格式化按钮！"\n}';

export const JsonTool: React.FC = () => {
  // Persist input in localstorage safely
  const [input, setInput] = useState<string>(() => {
    try {
      return localStorage.getItem('json_tool_input') || DEFAULT_JSON;
    } catch (e) {
      return DEFAULT_JSON;
    }
  });

  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [filter, setFilter] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Auto-parse effect
  useEffect(() => {
    try {
      localStorage.setItem('json_tool_input', input);
    } catch (e) {
      // Ignore storage errors
    }
    
    if (!input.trim()) {
      setParsedData(null);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setParsedData(null);
    }
  }, [input]);

  // Computed info label
  const getInfoLabel = () => {
    if (!parsedData) return null;
    if (Array.isArray(parsedData)) {
      return `Array(${parsedData.length})`;
    }
    if (typeof parsedData === 'object' && parsedData !== null) {
      return `Object{${Object.keys(parsedData).length}}`;
    }
    return typeof parsedData;
  };

  const formatJson = () => {
    if (parsedData) {
      setInput(JSON.stringify(parsedData, null, 2));
    }
  };

  const minifyJson = () => {
    if (parsedData) {
      setInput(JSON.stringify(parsedData));
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(input);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const clearAll = () => {
    if (window.confirm('确定要清空编辑器吗？')) {
      setInput('');
    }
  };

  // Safer Repair function (Regex based, no eval)
  const tryRepair = () => {
    try {
      // 1. Wrap unquoted keys in quotes: key: -> "key":
      // 2. Replace single quotes with double quotes: 'val' -> "val"
      // 3. Remove trailing commas: ,} -> }
      let fixed = input
        .replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":')
        .replace(/'/g, '"') 
        .replace(/,\s*([\]}])/g, '$1');

      const parsed = JSON.parse(fixed);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      alert("自动修复失败。请手动检查 JSON 语法。");
    }
  };

  if (viewMode === 'diff') {
    return (
      <div className="h-[calc(100vh-8rem)]">
        <JsonDiff 
          initialLeft={input}
          initialRight=""
          onClose={() => setViewMode('split')} 
        />
      </div>
    );
  }

  const infoLabel = getInfoLabel();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button 
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-md transition-all ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
              title="分栏视图"
            >
              <Split className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`p-2 rounded-md transition-all ${viewMode === 'code' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
              title="仅代码"
            >
              <FileCode className="w-4 h-4" />
            </button>
             <button 
              onClick={() => setViewMode('tree')}
              className={`p-2 rounded-md transition-all ${viewMode === 'tree' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
              title="仅树状图"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 shrink-0" />

          <button onClick={formatJson} disabled={!!error} className="btn-secondary text-xs flex items-center px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 font-medium whitespace-nowrap">
            <Maximize2 className="w-3 h-3 mr-2" /> 格式化
          </button>
          <button onClick={minifyJson} disabled={!!error} className="btn-secondary text-xs flex items-center px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 font-medium whitespace-nowrap">
            <Minimize2 className="w-3 h-3 mr-2" /> 压缩
          </button>
          
          <button onClick={() => setViewMode('diff')} className="btn-secondary text-xs flex items-center px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium whitespace-nowrap">
            <ArrowLeftRight className="w-3 h-3 mr-2" /> 对比
          </button>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
           {error && (
             <button onClick={tryRepair} className="text-xs px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 rounded-lg font-medium hover:bg-yellow-200 transition-colors flex items-center whitespace-nowrap">
               <Wrench className="w-3 h-3 mr-2" /> 自动修复
             </button>
           )}
           <button onClick={copyToClipboard} className="flex items-center px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap">
             {isCopied ? <Check className="w-3 h-3 mr-2 text-green-500" /> : <Copy className="w-3 h-3 mr-2" />}
             {isCopied ? '已复制' : '复制'}
           </button>
           <button onClick={clearAll} className="flex items-center px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors whitespace-nowrap">
             <Trash2 className="w-3 h-3 mr-2" />
             清空
           </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* Left: Input Code */}
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className={`flex-1 flex flex-col relative bg-white dark:bg-slate-900 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-hidden ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">JSON 输入</span>
                {infoLabel && !error && (
                   <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-mono flex items-center">
                     <Hash className="w-3 h-3 mr-1" />
                     {infoLabel}
                   </span>
                )}
              </div>
              {error && <span className="text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> 格式错误</span>}
            </div>
            <textarea
              className="flex-1 w-full p-4 pt-10 bg-transparent border-0 resize-none focus:ring-0 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 outline-none custom-scrollbar"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此粘贴 JSON..."
              spellCheck={false}
            />
            {error && (
               <div className="absolute bottom-0 left-0 right-0 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900/30 p-2 text-xs text-red-600 dark:text-red-400 font-mono break-all">
                 {error}
               </div>
            )}
          </div>
        )}

        {/* Right: Tree View */}
        {(viewMode === 'split' || viewMode === 'tree') && (
          <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-hidden ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="h-10 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center px-3 justify-between gap-2">
               <span className="text-xs font-medium text-slate-500 uppercase tracking-wider shrink-0">树状视图</span>
               <input 
                 type="text" 
                 placeholder="过滤 Key 或 Value..." 
                 className="h-7 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 min-w-[150px] focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
                 value={filter}
                 onChange={e => setFilter(e.target.value)}
               />
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              {parsedData ? (
                <JsonTree data={parsedData} filter={filter} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <FileCode className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">无效或空的 JSON</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};