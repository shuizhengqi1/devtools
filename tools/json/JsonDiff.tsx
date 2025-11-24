import React, { useState, useEffect } from 'react';
import * as Diff from 'diff';
import { X, RefreshCw, ToggleLeft, ToggleRight, Hash } from 'lucide-react';

interface JsonDiffProps {
  initialLeft?: string;
  initialRight?: string;
  onClose: () => void;
}

// Utility to recursively sort object keys AND array items for canonical comparison
const canonicalize = (obj: any): any => {
  if (Array.isArray(obj)) {
    const processedList = obj.map(canonicalize);
    return processedList.sort((a, b) => {
      return JSON.stringify(a).localeCompare(JSON.stringify(b));
    });
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(obj[key]);
        return acc;
      }, {} as any);
  }
  return obj;
};

// Helper to get stats label (e.g., "Object{5}" or "Array(10)")
const getStatsLabel = (jsonStr: string): string | null => {
  if (!jsonStr.trim()) return null;
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return `Array(${parsed.length})`;
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return `Object{${Object.keys(parsed).length}}`;
    }
    return typeof parsed;
  } catch (e) {
    return null;
  }
};

// Helper to try formatting JSON string
const tryFormat = (str: string): string => {
  try {
    const obj = JSON.parse(str);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return str;
  }
};

export const JsonDiff: React.FC<JsonDiffProps> = ({ initialLeft = '', initialRight = '', onClose }) => {
  // Initialize state with formatted JSON if possible
  const [left, setLeft] = useState(() => tryFormat(initialLeft));
  const [right, setRight] = useState(() => tryFormat(initialRight));
  
  const [diffs, setDiffs] = useState<Diff.Change[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ignoreOrder, setIgnoreOrder] = useState(true);

  // Calc stats
  const leftStats = getStatsLabel(left);
  const rightStats = getStatsLabel(right);

  useEffect(() => {
    const calculateDiff = () => {
      try {
        // 1. Attempt to parse both inputs as JSON
        let leftObj = JSON.parse(left);
        let rightObj = JSON.parse(right);

        if (ignoreOrder) {
          // Mode 1: Ignore Order (Structural Diff with Set semantics for Arrays)
          leftObj = canonicalize(leftObj);
          rightObj = canonicalize(rightObj);
          
          setDiffs(Diff.diffJson(leftObj, rightObj));
        } else {
          // Mode 2: Strict Order (Line-by-Line Diff of Formatted JSON)
          const leftStr = JSON.stringify(leftObj, null, 2);
          const rightStr = JSON.stringify(rightObj, null, 2);
          setDiffs(Diff.diffLines(leftStr, rightStr));
        }
        setError(null);

      } catch (e) {
        // Fallback: Simple Line Diff on raw text
        setDiffs(Diff.diffLines(left, right));
      }
    };

    const timer = setTimeout(calculateDiff, 300);
    return () => clearTimeout(timer);
  }, [left, right, ignoreOrder]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
       {/* Header */}
       <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center">
               <RefreshCw className="w-4 h-4 mr-2 text-blue-500" /> 
               JSON 对比 (Diff)
            </span>
            
            {/* Toggle Switch */}
            <button 
              onClick={() => setIgnoreOrder(!ignoreOrder)}
              className="flex items-center space-x-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              title={ignoreOrder ? "当前：忽略对象 Key 的顺序，且忽略数组元素顺序（视为集合）" : "当前：严格匹配顺序"}
            >
               {ignoreOrder ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
               <span>忽略顺序</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {error && <span className="text-xs text-red-500 hidden md:inline-block">{error}</span>}
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
       </div>

       {/* Inputs */}
       <div className="flex-1 flex flex-col lg:flex-row min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Left Pane */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-red-600/80 dark:text-red-400/80 uppercase flex justify-between items-center">
              <span>原数据 (Old)</span>
              {leftStats && (
                <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-1.5 py-0.5 rounded-full font-mono flex items-center">
                  <Hash className="w-3 h-3 mr-1" /> {leftStats}
                </span>
              )}
            </div>
            <textarea 
              className="flex-1 p-4 bg-transparent resize-none outline-none font-mono text-sm custom-scrollbar text-slate-800 dark:text-slate-300"
              value={left}
              onChange={e => setLeft(e.target.value)}
              placeholder="在此粘贴旧版本 JSON..."
              spellCheck={false}
            />
          </div>
          
          {/* Right Pane */}
          <div className="flex-1 flex flex-col min-h-0">
             <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-green-600/80 dark:text-green-400/80 uppercase flex justify-between items-center">
              <span>新数据 (New)</span>
              {rightStats && (
                <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-1.5 py-0.5 rounded-full font-mono flex items-center">
                  <Hash className="w-3 h-3 mr-1" /> {rightStats}
                </span>
              )}
            </div>
            <textarea 
              className="flex-1 p-4 bg-transparent resize-none outline-none font-mono text-sm custom-scrollbar text-slate-800 dark:text-slate-300"
              value={right}
              onChange={e => setRight(e.target.value)}
              placeholder="在此粘贴新版本 JSON..."
              spellCheck={false}
            />
          </div>
       </div>

       {/* Diff Visualization (Bottom) */}
       <div className="h-[45%] border-t border-slate-200 dark:border-slate-800 flex flex-col min-h-0">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 flex justify-between items-center">
            <span>差异预览 {ignoreOrder ? "(结构对比 - 忽略数组顺序)" : "(严格顺序)"}</span>
            <div className="flex space-x-3 text-[10px]">
                <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> 新增</span>
                <span className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> 删除</span>
                <span className="flex items-center"><span className="w-2 h-2 bg-slate-400 rounded-full mr-1"></span> 未变</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm custom-scrollbar bg-white dark:bg-slate-950 leading-relaxed">
            {diffs.map((part, index) => {
              let className = "text-slate-600 dark:text-slate-400 opacity-80"; 
              
              if (part.added) {
                className = "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 block border-l-2 border-green-500 pl-2";
              } else if (part.removed) {
                className = "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 block border-l-2 border-red-500 pl-2";
              }

              return (
                <span key={index} className={`${className} whitespace-pre-wrap break-all`}>
                  {part.value}
                </span>
              )
            })}
            {diffs.length === 0 && left && right && (
                 <div className="text-slate-400 italic text-center mt-4">无差异</div>
            )}
             {!left && !right && (
                 <div className="text-slate-400 italic text-center mt-4 opacity-50">请输入需要对比的 JSON 内容</div>
            )}
          </div>
       </div>
    </div>
  );
};