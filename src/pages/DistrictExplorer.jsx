import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, Navigation, ShoppingBag } from 'lucide-react';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ALL_DISTRICTS = [
  { name: "Kanchipuram", state: "Tamil Nadu", craft: "Silk Sarees", lat: 12.8185, lng: 79.6947 },
  { name: "Jaipur", state: "Rajasthan", craft: "Blue Pottery", lat: 26.9124, lng: 75.7873 },
  { name: "Varanasi", state: "Uttar Pradesh", craft: "Banarasi Silk", lat: 25.3176, lng: 82.9739 },
  { name: "Moradabad", state: "Uttar Pradesh", craft: "Brassware", lat: 28.8386, lng: 78.7733 },
  { name: "Kutch", state: "Gujarat", craft: "Embroidery", lat: 23.7337, lng: 69.8597 },
  { name: "Channapatna", state: "Karnataka", craft: "Wooden Toys", lat: 12.6520, lng: 77.2090 },
  { name: "Kolhapur", state: "Maharashtra", craft: "Kolhapuri Chappals", lat: 16.7050, lng: 74.2433 },
  { name: "Thanjavur", state: "Tamil Nadu", craft: "Tanjore Paintings", lat: 10.7870, lng: 79.1378 },
  { name: "Srinagar", state: "Jammu & Kashmir", craft: "Pashmina", lat: 34.0837, lng: 74.7973 },
  { name: "Darjeeling", state: "West Bengal", craft: "Tea Craft", lat: 27.0360, lng: 88.2627 },
  { name: "Lucknow", state: "Uttar Pradesh", craft: "Chikankari", lat: 26.8467, lng: 80.9462 },
  { name: "Amritsar", state: "Punjab", craft: "Phulkari", lat: 31.6340, lng: 74.8723 },
  { name: "Mysore", state: "Karnataka", craft: "Silk Sarees", lat: 12.2958, lng: 76.6394 },
  { name: "Puri", state: "Odisha", craft: "Pattachitra", lat: 19.8135, lng: 85.8312 },
  { name: "Madhubani", state: "Bihar", craft: "Madhubani Paintings", lat: 26.3544, lng: 86.0712 },
  { name: "Jodhpur", state: "Rajasthan", craft: "Bandhej", lat: 26.2389, lng: 73.0243 },
  { name: "Agra", state: "Uttar Pradesh", craft: "Marble Inlay", lat: 27.1767, lng: 78.0081 },
  { name: "Udaipur", state: "Rajasthan", craft: "Miniature Paintings", lat: 24.5854, lng: 73.7125 },
  { name: "Pochampally", state: "Telangana", craft: "Ikat Weaving", lat: 17.3333, lng: 79.0167 },
  { name: "Bhagalpur", state: "Bihar", craft: "Tussar Silk", lat: 25.2425, lng: 86.9842 },
  { name: "Bidar", state: "Karnataka", craft: "Bidriware", lat: 17.9104, lng: 77.5199 },
  { name: "Sambalpur", state: "Odisha", craft: "Sambhalpuri Sarees", lat: 21.4669, lng: 83.9812 },
  { name: "Patan", state: "Gujarat", craft: "Patola Weaving", lat: 23.8493, lng: 72.1266 },
  { name: "Bishnupur", state: "West Bengal", craft: "Baluchari Sarees", lat: 23.0747, lng: 87.3194 },
  { name: "Kullu", state: "Himachal Pradesh", craft: "Woolen Shawls", lat: 31.9592, lng: 77.1089 }
];

// Helper component for fly to
function FlyToMarker({ activeMarker }) {
    const map = useMap();
    useEffect(() => {
        if (activeMarker) {
            map.flyTo([activeMarker.lat, activeMarker.lng], 8, {
                animate: true,
            });
        }
    }, [activeMarker, map]);
    return null;
}

export default function DistrictExplorer() {
    const [activeMarker, setActiveMarker] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All States');
    const markerRefs = useRef({});

    const states = useMemo(() => {
        const uniqueStates = [...new Set(ALL_DISTRICTS.map(d => d.state))].sort();
        return ['All States', ...uniqueStates];
    }, []);

    const filteredDistricts = useMemo(() => {
        return ALL_DISTRICTS.filter(d => {
            const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  d.craft.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  d.state.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesState = selectedState === 'All States' || d.state === selectedState;
            return matchesSearch && matchesState;
        });
    }, [searchTerm, selectedState]);

    const handleDistrictClick = (district) => {
        setActiveMarker(district);
        const marker = markerRefs.current[district.name];
        if (marker) {
            marker.openPopup();
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full bg-[#0A192F] mt-16 overflow-hidden relative">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4 h-[40vh] md:h-full bg-[#112240] border-r border-[#233554] flex flex-col z-[1000] shadow-2xl relative">
                <div className="p-6 border-b border-[#233554]">
                    <h1 className="text-2xl font-display font-bold text-[#D4AF37] mb-2 flex items-center gap-2">
                        <MapPin size={24} /> District Explorer
                    </h1>
                    <p className="text-[#8892B0] text-sm mb-4">Discover ancient artisan hubs across India's rich landscape.</p>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={18} />
                        <input
                            type="text"
                            placeholder="Search district, craft, or state..."
                            className="w-full bg-[#0A192F] border border-[#233554] rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <select 
                            className="w-full bg-[#0A192F] border border-[#233554] rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm appearance-none cursor-pointer"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#8892B0]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {filteredDistricts.length === 0 ? (
                        <div className="text-center py-8 text-[#8892B0] text-sm">
                            No districts found matching your search.
                        </div>
                    ) : (
                        filteredDistricts.map(district => (
                            <motion.div
                                key={district.name}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDistrictClick(district)}
                                className={`p-4 rounded-xl cursor-pointer border transition-colors flex flex-col ${
                                    activeMarker?.name === district.name 
                                    ? 'bg-[#233554] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                                    : 'bg-[#0A192F] border-[#233554] hover:border-[#D4AF37]/50'
                                }`}
                            >
                                <h3 className="text-white font-bold text-lg mb-1">{district.name}</h3>
                                <p className="text-[#8892B0] text-xs flex items-center gap-1 mb-3">
                                    <Navigation size={12} className="text-[#D4AF37]" /> {district.state}
                                </p>
                                <div className="self-start px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/20 rounded-md">
                                    {district.craft}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Map Area */}
            <div className="w-full md:w-2/3 lg:w-3/4 h-[60vh] md:h-full relative z-[1]">
                <MapContainer 
                    center={[20.5937, 78.9629]} 
                    zoom={5} 
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    
                    {ALL_DISTRICTS.map((district) => (
                        <Marker 
                            key={district.name}
                            position={[district.lat, district.lng]}
                            ref={(r) => {
                                markerRefs.current[district.name] = r;
                            }}
                            eventHandlers={{
                                click: () => {
                                    setActiveMarker(district);
                                },
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="min-w-[180px] p-1">
                                    <h2 className="text-lg font-bold text-[#D4AF37] mb-1 leading-tight">{district.name}</h2>
                                    <p className="text-gray-600 text-xs mb-3 font-medium">{district.state}</p>
                                    
                                    <div className="bg-[#0A192F] text-white p-3 rounded-lg mb-4">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Renowned Craft</p>
                                        <p className="text-[#D4AF37] font-bold text-sm flex items-center gap-1">
                                            {district.craft}
                                        </p>
                                    </div>
                                    
                                    <Link 
                                        to={`/shop?district=${district.name}`}
                                        className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
                                    >
                                        <ShoppingBag size={14} /> View Products
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    
                    <FlyToMarker activeMarker={activeMarker} />
                </MapContainer>
            </div>
            
        </div>
    );
}
