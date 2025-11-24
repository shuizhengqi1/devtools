import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Server, Navigation, Locate } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Interface for API Response (ipwho.is)
interface IpData {
  ip: string;
  success: boolean;
  message?: string;
  type: string;
  continent: string;
  continent_code: string;
  country: string;
  country_code: string;
  region: string;
  region_code: string;
  city: string;
  latitude: number;
  longitude: number;
  is_eu: boolean;
  postal: string;
  calling_code: string;
  capital: string;
  borders: string;
  flag: {
    img: string;
    emoji: string;
  };
  connection: {
    asn: number;
    org: string;
    isp: string;
    domain: string;
  };
  timezone: {
    id: string;
    abbr: string;
    is_dst: boolean;
    offset: number;
    utc: string;
    current_time: string;
  };
}

// Component to handle map center updates
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Fix for default Leaflet markers in some build environments
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const IpTool: React.FC = () => {
  const [inputIp, setInputIp] = useState('');
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIpInfo = async (ipAddress: string = '') => {
    setLoading(true);
    setError(null);
    try {
      // ipwho.is is free, supports CORS, no key required
      const response = await fetch(`https://ipwho.is/${ipAddress}`);
      const jsonData = await response.json();

      if (!jsonData.success) {
        throw new Error(jsonData.message || '查询失败，请输入有效的 IP 地址');
      }
      
      setData(jsonData);
      if (!ipAddress) {
        setInputIp(jsonData.ip); // If searched empty (my ip), fill input
      }
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's IP on mount
  useEffect(() => {
    fetchIpInfo();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIpInfo(inputIp);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 h-[calc(100vh-8rem)]">
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              placeholder="输入 IPv4 或 IPv6 地址 (留空查询本机 IP)"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
               <>
                 <Search className="w-5 h-5 mr-2" /> 查询
               </>
            )}
          </button>
          <button
            type="button"
            onClick={() => fetchIpInfo('')}
            className="flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="查询我的 IP"
          >
            <Locate className="w-5 h-5" />
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {data && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Info Panel */}
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            
            {/* Main Location Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  地理位置
                </h3>
                <span className="text-2xl">{data.flag.emoji}</span>
              </div>
              <div className="space-y-3">
                <InfoRow label="IP 地址" value={data.ip} copyable />
                <InfoRow label="国家/地区" value={`${data.country} (${data.country_code})`} />
                <InfoRow label="城市" value={`${data.region}, ${data.city}`} />
                <InfoRow label="邮编" value={data.postal} />
                <InfoRow label="经纬度" value={`${data.latitude}, ${data.longitude}`} />
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
                <Server className="w-5 h-5 mr-2 text-purple-500" />
                网络信息
              </h3>
              <div className="space-y-3">
                <InfoRow label="ISP (运营商)" value={data.connection.isp} />
                <InfoRow label="组织 (Org)" value={data.connection.org} />
                <InfoRow label="ASN" value={`AS${data.connection.asn}`} />
                <InfoRow label="域名" value={data.connection.domain} />
              </div>
            </div>

            {/* Timezone Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
                <Navigation className="w-5 h-5 mr-2 text-green-500" />
                时区信息
              </h3>
              <div className="space-y-3">
                <InfoRow label="时区 ID" value={data.timezone.id} />
                <InfoRow label="UTC 偏移" value={data.timezone.utc} />
                <InfoRow label="当地时间" value={data.timezone.current_time} />
              </div>
            </div>

          </div>

          {/* Map Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden flex flex-col h-[400px] lg:h-auto relative z-0">
             <MapContainer 
                center={[data.latitude, data.longitude]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
             >
               <ChangeView center={[data.latitude, data.longitude]} zoom={13} />
               
               <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 className="map-tiles" 
               />
               
               <Marker position={[data.latitude, data.longitude]} icon={customIcon}>
                 <Popup>
                   <div className="text-slate-900">
                     <strong>{data.ip}</strong><br />
                     {data.city}, {data.country}
                   </div>
                 </Popup>
               </Marker>
             </MapContainer>
             
             {/* Dark Mode Overlay for Maps (Optional, simple filter approach) */}
             <div className="hidden dark:block absolute inset-0 pointer-events-none bg-slate-900 mix-blend-hue z-[400]"></div>
             <div className="hidden dark:block absolute inset-0 pointer-events-none bg-slate-900/20 z-[400]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string | number; copyable?: boolean }> = ({ label, value, copyable }) => (
  <div className="flex justify-between items-start text-sm">
    <span className="text-slate-500 dark:text-slate-400 shrink-0 mr-2">{label}</span>
    <div className="text-right font-medium text-slate-900 dark:text-slate-100 break-all">
      {value || '-'}
    </div>
  </div>
);
