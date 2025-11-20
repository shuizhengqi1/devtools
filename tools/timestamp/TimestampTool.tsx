import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, ArrowDown } from 'lucide-react';
import { TimeZone } from '../../types';

// Specific timezones requested by user
const TIMEZONES: TimeZone[] = [
  { name: 'UTC', label: 'UTC', offset: 0 },
  { name: 'Asia/Shanghai', label: '北京', offset: 8 },
  { name: 'Asia/Qatar', label: '卡塔尔', offset: 3 },
  { name: 'Asia/Kuwait', label: '科威特', offset: 3 },
  { name: 'Asia/Dubai', label: '阿联酋', offset: 4 },
  { name: 'America/Sao_Paulo', label: '巴西', offset: -3 },
];

export const TimestampTool: React.FC = () => {
  // Real-time clock state
  const [now, setNow] = useState(new Date());
  const [isPaused, setIsPaused] = useState(false);
  
  // Converter state
  const [inputVal, setInputVal] = useState<string>('');
  const [convertedDate, setConvertedDate] = useState<Date | null>(null);

  // Live Clock Effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Converter Logic
  useEffect(() => {
    if (!inputVal.trim()) {
      setConvertedDate(null);
      return;
    }

    // Try parsing
    let date: Date;
    // Check if numeric (Unix timestamp)
    if (/^\d+$/.test(inputVal)) {
      // Guess milliseconds vs seconds based on length
      if (inputVal.length <= 10) {
        date = new Date(parseInt(inputVal) * 1000); // Seconds
      } else {
        date = new Date(parseInt(inputVal)); // Milliseconds
      }
    } else {
      // Try ISO string or standard date string
      date = new Date(inputVal);
    }

    if (!isNaN(date.getTime())) {
      setConvertedDate(date);
    } else {
      setConvertedDate(null);
    }
  }, [inputVal]);

  const formatResult = (date: Date, zone?: string) => {
    try {
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: zone,
        hour12: false,
      }).format(date);
    } catch (e) {
      return '无效时区';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Hero: Current Time */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h2 className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-1">当前时间</h2>
             <p className="text-blue-50 text-xs opacity-80">Unix 时间戳 (秒)</p>
          </div>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
            title={isPaused ? "继续" : "暂停"}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="font-mono text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          {Math.floor(now.getTime() / 1000)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
           <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
             <span className="text-xs uppercase opacity-70 block mb-1">毫秒 (Milliseconds)</span>
             <span className="font-mono text-xl">{now.getTime()}</span>
           </div>
           <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
             <span className="text-xs uppercase opacity-70 block mb-1">ISO 8601 格式</span>
             <span className="font-mono text-xl truncate">{now.toISOString()}</span>
           </div>
        </div>
      </div>

      {/* Converter Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          时间转换器
        </h3>
        
        <div className="space-y-6">
          <div className="relative">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
               输入 (Unix 时间戳或日期字符串)
             </label>
             <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={`例如：${Math.floor(Date.now() / 1000)} 或 2023-10-27`}
                  className="flex-1 block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                />
                <button 
                  onClick={() => setInputVal('')}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="重置"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="text-slate-300 dark:text-slate-700 w-6 h-6" />
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Local Time */}
             <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
               <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">本地时间</div>
               <div className="font-mono text-lg text-slate-900 dark:text-slate-100">
                 {convertedDate ? convertedDate.toLocaleString('zh-CN') : '-'}
               </div>
             </div>

             {/* UTC */}
             <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
               <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">UTC</div>
               <div className="font-mono text-lg text-slate-900 dark:text-slate-100">
                 {convertedDate ? convertedDate.toUTCString() : '-'}
               </div>
             </div>
             
             {/* Custom Timezones */}
             {TIMEZONES.filter(t => t.name !== 'UTC').map(tz => (
               <div key={tz.name} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                 <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{tz.label}</div>
                 <div className="font-mono text-lg text-slate-900 dark:text-slate-100">
                   {convertedDate ? formatResult(convertedDate, tz.name) : '-'}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};