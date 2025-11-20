import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Copy } from 'lucide-react';

interface JsonTreeProps {
  data: any;
  level?: number;
  isLast?: boolean;
  initiallyExpanded?: boolean;
  filter?: string;
}

const getType = (value: any) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

// Simple component to display scalar values
const ScalarValue: React.FC<{ value: any; type: string }> = ({ value, type }) => {
  if (type === 'string') return <span className="text-green-600 dark:text-green-400 break-all">"{value}"</span>;
  if (type === 'number') return <span className="text-orange-600 dark:text-orange-400">{value}</span>;
  if (type === 'boolean') return <span className="text-blue-600 dark:text-blue-400 font-bold">{value.toString()}</span>;
  if (type === 'null') return <span className="text-slate-400 italic">null</span>;
  return <span className="text-slate-900 dark:text-slate-100">{String(value)}</span>;
};

const JsonNode: React.FC<{ 
  name: string | null, 
  value: any, 
  isLast: boolean, 
  level: number,
  initiallyExpanded: boolean,
  filter: string
}> = ({ name, value, isLast, level, initiallyExpanded, filter }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded || (level < 2));
  const type = getType(value);
  const isObject = type === 'object' || type === 'array';
  const isEmpty = isObject && Object.keys(value).length === 0;

  // Filter Logic: Check if this node or its children match
  const matchesFilter = (val: any, key: string | null): boolean => {
    if (!filter) return true;
    const lowerFilter = filter.toLowerCase();
    if (key && key.toLowerCase().includes(lowerFilter)) return true;
    if (['string', 'number', 'boolean'].includes(getType(val))) {
        return String(val).toLowerCase().includes(lowerFilter);
    }
    if (typeof val === 'object' && val !== null) {
        return Object.entries(val).some(([k, v]) => matchesFilter(v, k));
    }
    return false;
  };

  if (!matchesFilter(value, name)) return null;

  // Auto-expand if filtering
  React.useEffect(() => {
    if (filter) setIsExpanded(true);
  }, [filter]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const renderPrefix = () => (
    <span className="mr-1 text-purple-600 dark:text-purple-400">
      {name && <span className="font-medium">"{name}"</span>}
      {name && <span className="text-slate-500 dark:text-slate-400 mr-1">:</span>}
    </span>
  );

  if (!isObject) {
    return (
      <div className="font-mono text-sm leading-6 hover:bg-slate-100 dark:hover:bg-slate-800/50 px-1 rounded">
        <span style={{ paddingLeft: `${level * 1.5}rem` }} className="flex items-center">
          {renderPrefix()}
          <ScalarValue value={value} type={type} />
          {!isLast && <span className="text-slate-400">,</span>}
        </span>
      </div>
    );
  }

  const keys = Object.keys(value);
  const size = keys.length;
  const bracketOpen = type === 'array' ? '[' : '{';
  const bracketClose = type === 'array' ? ']' : '}';
  const sizeLabel = type === 'array' ? `Array(${size})` : `Object{${size}}`;

  return (
    <div className="font-mono text-sm leading-6">
      <div 
        className="flex items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 px-1 rounded group"
        onClick={handleToggle}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        <span className="w-4 h-4 flex items-center justify-center mr-1 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
          {!isEmpty && (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
        </span>
        
        {renderPrefix()}
        
        <span className="text-slate-600 dark:text-slate-300">{bracketOpen}</span>
        
        {!isExpanded && !isEmpty && (
          <span className="mx-2 text-xs text-slate-400 italic select-none">{sizeLabel} ...</span>
        )}
        
        {(isEmpty || !isExpanded) && (
          <span className="text-slate-600 dark:text-slate-300">
            {bracketClose}
            {!isLast && <span className="text-slate-400">,</span>}
            {!isExpanded && !isEmpty && <span className="ml-2 text-xs text-slate-300 dark:text-slate-600 select-none">// {size} items</span>}
          </span>
        )}
      </div>

      {isExpanded && !isEmpty && (
        <div>
          {keys.map((key, index) => (
            <JsonNode
              key={key}
              name={type === 'array' ? null : key}
              value={value[key]}
              isLast={index === size - 1}
              level={level + 1}
              initiallyExpanded={initiallyExpanded}
              filter={filter}
            />
          ))}
          <div 
             className="hover:bg-slate-100 dark:hover:bg-slate-800/50 px-1 rounded"
             style={{ paddingLeft: `${level * 1.5 + 1.25}rem` }}
          >
            <span className="text-slate-600 dark:text-slate-300">
              {bracketClose}
              {!isLast && <span className="text-slate-400">,</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const JsonTree: React.FC<JsonTreeProps> = ({ data, filter }) => {
  return (
    <div className="w-full overflow-x-auto py-2">
      <JsonNode 
        name={null} 
        value={data} 
        isLast={true} 
        level={0} 
        initiallyExpanded={true}
        filter={filter || ''}
      />
    </div>
  );
};