import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Users, Trophy, TrendingUp, HandHeart } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const Impact = () => {
    const [stats, setStats] = useState({
        artisans: 0,
        districts: 0,
        productsSold: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a production app, these would be aggregated via Cloud Functions.
        // For this demo, we'll fetch existing users/orders and combine with base numbers.
        const fetchImpactData = async () => {
            try {
                // Fetch actual registered artisans
                const usersSnap = await getDocs(collection(db, "users"));
                let artisanCount = 42; // Base number
                usersSnap.forEach(doc => {
                    if (doc.data().role === 'artisan' && doc.data().approved) artisanCount++;
                });

                // Fetch actual orders
                const ordersSnap = await getDocs(collection(db, "orders"));
                let salesCount = 1205; // Base number
                let revenueSum = 4500000; // Base number
                
                ordersSnap.forEach(doc => {
                    const data = doc.data();
                    salesCount += (data.items?.length || 1);
                    revenueSum += (data.totalPrice || 0);
                });

                setStats({
                    artisans: artisanCount,
                    districts: 75, // UP has 75 districts
                    productsSold: salesCount,
                    revenue: revenueSum
                });
            } catch (error) {
                console.error("Error fetching impact data:", error);
            }
            setLoading(false);
        };

        fetchImpactData();
    }, []);

    return (
        <div className="bg-[#0A192F] min-h-screen pt-24 pb-20 px-4 font-body text-[#CCD6F6]">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-6 relative">
                        <Heart size={32} className="text-red-400" fill="currentColor" />
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-red-400 rounded-full mix-blend-screen"
                        />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold font-display text-white mb-6">Our Impact, <span className="text-[#D4AF37]">Together.</span></h1>
                    <p className="text-xl text-[#8892B0] max-w-3xl mx-auto leading-relaxed">
                        Every purchase on ODOP Connect transcends commerce. It is a lifeline to centuries of heritage, sustaining communities and empowering the artisans who weave the fabric of India's cultural identity.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <ImpactCard delay={0.1} icon={<Users />} value={loading ? "..." : `${stats.artisans}+`} label="Artisans Empowered" desc="Families supported through direct trade" />
                    <ImpactCard delay={0.2} icon={<Globe />} value={loading ? "..." : `${stats.districts}`} label="Districts Connected" desc="Across the state of Uttar Pradesh" />
                    <ImpactCard delay={0.3} icon={<Trophy />} value={loading ? "..." : `${stats.productsSold.toLocaleString('en-IN')}+`} label="Crafts Delivered" desc="Pieces of heritage shared globally" />
                    <ImpactCard delay={0.4} icon={<TrendingUp />} value={loading ? "..." : `₹${(stats.revenue / 100000).toFixed(1)}L+`} label="Revenue Generated" desc="Direct earnings for artisan clusters" />
                </div>

                {/* Story Section */}
                <div className="relative rounded-3xl overflow-hidden mb-20">
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <img src="https://images.unsplash.com/photo-1605814571932-3c8b417be10c?auto=format&fit=crop&q=80" alt="Artisan impact" className="w-full h-[600px] object-cover scale-105" />
                    
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-[#0A192F] via-transparent to-transparent">
                        <HandHeart size={64} className="text-[#D4AF37] mb-8" />
                        <h2 className="text-4xl text-white font-display font-bold mb-6 max-w-4xl leading-tight">"Before ODOP Connect, our craft was dying. We had no access to cities. Now, people from across the country wear our family's weaves."</h2>
                        <p className="text-lg text-yellow-200 font-medium tracking-wider uppercase">— The Weavers of Varanasi</p>
                    </div>
                </div>

                {/* Transparency Report */}
                <div className="bg-[#112240] rounded-2xl border border-[#233554] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-bl-full"></div>
                    <h3 className="text-3xl font-display font-bold text-white mb-6">100% Platform Transparency</h3>
                    <p className="text-[#8892B0] max-w-2xl mx-auto mb-10 text-lg">
                        Unlike traditional middlemen who take up to 60% margins, ODOP Connect operates on an absolute zero-commission model for artisans. 
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
                        <div className="bg-[#0A192F] border border-[#D4AF37]/30 p-6 rounded-xl w-full md:w-64">
                            <span className="block text-4xl font-bold text-[#D4AF37] mb-2">100%</span>
                            <span className="text-sm text-[#8892B0]">Goes specifically to the creator and their cluster.</span>
                        </div>
                        <span className="text-[#233554] hidden md:block text-4xl font-light">+</span>
                        <div className="bg-[#0A192F] border border-blue-500/30 p-6 rounded-xl w-full md:w-64">
                            <span className="block text-4xl font-bold text-blue-400 mb-2">0%</span>
                            <span className="text-sm text-[#8892B0]">Platform fees, listing fees, or hidden commission.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImpactCard = ({ icon, value, label, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="bg-[#112240] p-8 rounded-2xl border border-[#233554] shadow-lg hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-300 group"
    >
        <div className="w-16 h-16 rounded-2xl bg-[#0A192F] border border-[#233554] flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/10 transition-all duration-300">
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <h3 className="text-4xl font-display font-bold text-white mb-2">{value}</h3>
        <p className="text-[#D4AF37] font-medium mb-3">{label}</p>
        <p className="text-[#8892B0] text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

export default Impact;
