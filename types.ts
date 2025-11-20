import { LucideIcon } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
  category: 'Development' | 'Utility' | 'System';
}

export interface JsonNodeProps {
  keyName: string;
  value: any;
  isLast: boolean;
  level: number;
}

export interface TimeZone {
  name: string;
  label: string;
  offset: number; // Hours from UTC
}