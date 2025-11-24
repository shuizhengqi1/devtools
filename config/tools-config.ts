import { 
  Clock, 
  Hash, 
  Image, 
  Type,
  FileJson,
  Terminal,
  MapPin
} from 'lucide-react';
import { ToolConfig } from '../types';

export const tools: ToolConfig[] = [
  {
    id: 'json',
    name: 'JSON 编辑器',
    description: '查看、格式化、压缩及修复 JSON 数据。',
    path: '/tools/json',
    icon: FileJson,
    category: 'Development'
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: '多时区实时时间戳转换与查看。',
    path: '/tools/timestamp',
    icon: Clock,
    category: 'Utility'
  },
  {
    id: 'regex',
    name: '正则测试',
    description: '正则表达式编写测试与常用语法速查。',
    path: '/tools/regex',
    icon: Terminal,
    category: 'Development'
  },
  {
    id: 'ip',
    name: 'IP 查询 & 地图',
    description: '查询 IP 归属地、ISP 信息并进行地图定位。',
    path: '/tools/ip',
    icon: MapPin,
    category: 'Utility'
  },
  // Placeholders for roadmap
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: 'Base64 字符串编码与解码工具。',
    path: '/tools/base64',
    icon: Hash,
    category: 'Development'
  },
  {
    id: 'image',
    name: '图片工具',
    description: '图片压缩与格式转换。',
    path: '/tools/image',
    icon: Image,
    category: 'Utility'
  },
  {
    id: 'text',
    name: '文本分析',
    description: '文本对比、字数统计与格式处理。',
    path: '/tools/text',
    icon: Type,
    category: 'Utility'
  }
];