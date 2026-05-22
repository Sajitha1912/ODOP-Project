import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, MapPin, CheckCircle, Package, Clock } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            // Mocking order history for now since checkout isn't built yet
            setOrders([
                {
                    id: "ORD-9382",
                    date: "Oct 12, 2026",
                    total: 8500,
                    status: "shipped",
                    items: [
                        { name: "Varanasi Silk Saree", qty: 1, price: 5000 },
                        { name: "Brass Diya Set", qty: 2, price: 1750 }
                    ]
                },
                {
                    id: "ORD-9105",
                    date: "Sep 28, 2026",
                    total: 3200,
                    status: "delivered",
                    items: [
                        { name: "Khurja Pottery Vase", qty: 1, price: 3200 }
                    ]
                }
            ]);

            // Mocking wishlist
            setWishlist([
                { id: 1, name: "Pashmina Shawl", artisan: "Amina Begum", district: "Srinagar", price: 12000, image: "https://images.unsplash.com/photo-1603090123901-5cedb911c7fa?q=80&w=2000" },
                { id: 2, name: "Blue Pottery Plate", artisan: "Ram Kumar", district: "Jaipur", price: 1500, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2000" }
            ]);

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0A192F] text-[#CCD6F6]">
            <div className="max-w-7xl mx-auto">
                {/* Header Profile Section */}
                <div className="bg-[#112240] rounded-2xl border border-[#233554] p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] to-yellow-200 p-1">
                        <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center text-3xl font-display font-bold text-[#D4AF37]">
                            {currentUser?.displayName?.charAt(0) || 'U'}
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-display font-bold text-white mb-2">{currentUser?.displayName || 'Cultural Enthusiast'}</h1>
                        <p className="text-[#8892B0] flex items-center justify-center md:justify-start gap-2">
                            <MapPin size={16} /> Heritage Explorer • Joined Oct 2026
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-[#233554] mb-8 overflow-x-auto scrollbar-hide">
                    <TabButton 
                        active={activeTab === 'orders'} 
                        icon={<ShoppingBag size={18} />} 
                        label="Order History" 
                        onClick={() => setActiveTab('orders')} 
                    />
                    <TabButton 
                        active={activeTab === 'wishlist'} 
                        icon={<Heart size={18} />} 
                        label="My Wishlist" 
                        onClick={() => setActiveTab('wishlist')} 
                    />
                    <TabButton 
                        active={activeTab === 'artisans'} 
                        icon={<Star size={18} />} 
                        label="Saved Artisans" 
                        onClick={() => setActiveTab('artisans')} 
                    />
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64 text-[#8892B0]">Loading your space...</div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'orders' && (
                                <div className="space-y-6">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-[#112240] rounded-xl border border-[#233554] p-6 hover:border-[#D4AF37]/30 transition-colors">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#233554] pb-4 mb-4 gap-4">
                                                <div>
                                                    <h3 className="text-white font-bold font-display text-lg">Order {order.id}</h3>
                                                    <p className="text-[#8892B0] text-sm flex items-center gap-2">
                                                        <Clock size={14} /> Placed on {order.date}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-2xl font-bold text-[#D4AF37]">₹{order.total.toLocaleString('en-IN')}</span>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-[#0A192F] rounded text-[#8892B0] flex flex-col justify-center items-center font-bold text-xs"><Package size={16}/>x{item.qty}</div>
                                                            <span className="text-[#CCD6F6]">{item.name}</span>
                                                        </div>
                                                        <span className="text-[#8892B0]">₹{(item.price * item.qty).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-6 flex justify-end gap-3">
                                                <button className="text-[#8892B0] hover:text-white transition-colors text-sm font-medium px-4 py-2 border border-[#233554] rounded-lg hover:border-[#8892B0]">View Invoice</button>
                                                <button className="bg-[#233554] hover:bg-[#30476D] text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg">Track Package</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {wishlist.map(item => (
                                        <div key={item.id} className="bg-[#112240] rounded-xl border border-[#233554] overflow-hidden group">
                                            <div className="relative h-48">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <button className="absolute top-3 right-3 bg-white/10 backdrop-blur-md p-2 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors shadow-lg">
                                                    <Heart size={16} fill="currentColor" />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-white font-bold truncate pr-2" title={item.name}>{item.name}</h3>
                                                    <span className="text-[#D4AF37] font-bold">₹{item.price.toLocaleString()}</span>
                                                </div>
                                                <p className="text-[#8892B0] text-sm mb-4">By {item.artisan} • {item.district}</p>
                                                <Link to={`/product/${item.id}`} className="block w-full text-center bg-[#233554] hover:bg-[#D4AF37] hover:text-[#0A192F] text-white font-medium py-3 rounded-lg transition-colors">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'artisans' && (
                                <div className="text-center py-20 bg-[#112240] rounded-xl border border-[#233554] border-dashed">
                                    <Star size={48} className="mx-auto text-[#8892B0] mb-4 opacity-50" />
                                    <h3 className="text-white font-bold text-lg mb-2">No Saved Artisans</h3>
                                    <p className="text-[#8892B0]">Support your favorite creators by saving their profiles.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
            active ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-[#8892B0] hover:text-white hover:border-[#233554]'
        }`}
    >
        {icon} {label}
    </button>
);

const StatusBadge = ({ status }) => {
    switch(status) {
        case 'delivered':
            return <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold mt-1 uppercase tracking-wider"><CheckCircle size={12}/> Delivered</div>;
        case 'shipped':
            return <div className="flex items-center gap-1 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-xs font-bold mt-1 uppercase tracking-wider"><Package size={12}/> Shipped</div>;
        default:
            return <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-xs font-bold mt-1 uppercase tracking-wider"><Clock size={12}/> Pending</div>;
    }
};

export default UserDashboard;
