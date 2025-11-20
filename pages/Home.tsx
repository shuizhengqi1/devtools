import React from 'react';
import { tools } from '../config/tools-config';
import { ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  // Manual navigation handler
  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto py-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">
          开发者的必备工具箱
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          专为现代开发者工作流设计的隐私优先、离线可用的工具集合。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <a 
            key={tool.id} 
            href={`#${tool.path}`}
            onClick={(e) => handleNavClick(e, tool.path)}
            className="group relative bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 hover:shadow-lg hover:ring-blue-500/50 transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600 dark:text-blue-400">
                <tool.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {tool.category === 'Development' ? '开发' : '工具'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">
              {tool.description}
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
              打开工具 <ArrowRight className="ml-1 w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};