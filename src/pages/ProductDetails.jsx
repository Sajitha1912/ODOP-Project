import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Share2, MapPin, Camera, ChevronRight, Play, CheckCircle, Package, X, RotateCw, Move, Maximize } from 'lucide-react';
import { products } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id || '1'));
    const [activeImage, setActiveImage] = useState(product?.image);
    const [showAR, setShowAR] = useState(false);
    const { addToCart } = useCart();

    if (!product) return <div className="text-white text-center py-20 flex flex-col items-center"><Package size={48} className="mb-4 text-[#8892B0]" />Product not found</div>;

    return (
        <div className="bg-[#0A192F] min-h-screen pt-8 pb-20 font-body relative">

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex items-center gap-2 text-[#8892B0] text-sm">
                    <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link> <ChevronRight size={14} />
                    <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link> <ChevronRight size={14} />
                    <span className="text-[#D4AF37] font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Images & AR (Sticky on desktop) */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-2xl overflow-hidden border border-[#233554] bg-[#112240] h-[500px] shadow-2xl group"
                    >
                        <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />

                        {/* AR Button Overlay */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full px-6 flex justify-center">
                            <button
                                onClick={() => setShowAR(true)}
                                className="bg-[#D4AF37]/90 hover:bg-[#D4AF37] backdrop-blur-sm text-[#0A192F] px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-[#D4AF37]/50 transition-all active:scale-95 w-full md:w-auto justify-center"
                            >
                                <Camera size={20} /> Try Before You Buy (AR)
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        {[product.image, product.image, product.image].map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all hover:opacity-100 ${activeImage === img ? 'border-[#D4AF37] opacity-100 ring-2 ring-[#D4AF37]/30' : 'border-transparent opacity-60 hover:border-[#8892B0]'}`}
                            >
                                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details & Story */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[#D4AF37] font-bold text-xs tracking-[0.2em] uppercase bg-[#D4AF37]/10 px-2 py-1 rounded">Artisan Masterpiece</span>
                                <div className="flex gap-2">
                                    <button className="text-[#8892B0] hover:text-white transition-colors"><Share2 size={20} /></button>
                                    <button className="text-[#8892B0] hover:text-[#D4AF37] transition-colors"><Heart size={20} /></button>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-3 leading-tight tracking-tight">{product.name}</h1>

                            <div className="flex items-center gap-4 text-[#8892B0] text-sm mb-6 border-b border-[#233554] pb-6">
                                <div className="flex items-center gap-1 text-[#D4AF37]">
                                    <Star size={16} fill="#FFD700" />
                                    <Star size={16} fill="#FFD700" />
                                    <Star size={16} fill="#FFD700" />
                                    <Star size={16} fill="#FFD700" />
                                    <Star size={16} fill="#FFD700" stroke="none" className="opacity-50" />
                                    <span className="ml-1 text-white font-semibold">{product.rating}</span>
                                    <span className="text-[#8892B0] ml-1">(124 Reviews)</span>
                                </div>
                                <span className="w-1 h-1 bg-[#8892B0] rounded-full"></span>
                                <div className="flex items-center gap-1 hover:text-[#D4AF37] cursor-pointer transition-colors">
                                    <MapPin size={16} /> {product.district}, {product.state}
                                </div>
                                <span className="w-1 h-1 bg-[#8892B0] rounded-full"></span>
                                <div className="flex items-center gap-1 text-green-400 font-medium">
                                    <CheckCircle size={14} /> In Stock
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                                <span className="text-[#8892B0] text-xl line-through mb-1">₹{(product.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded mb-2">20% OFF</span>
                            </div>
                            <p className="text-[#8892B0] text-sm">Inclusive of all taxes</p>
                        </div>

                        <p className="text-[#CCD6F6] text-lg leading-relaxed mb-8 font-light">
                            {product.description} Handcrafted with precision and care, this piece represents centuries of tradition passed down through generations.
                            Each purchase supports the local artisan community directly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button 
                                onClick={() => addToCart(product)}
                                className="flex-1 bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] py-4 rounded-full font-bold text-lg shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:-translate-y-1 active:scale-95"
                            >
                                Add to Cart
                            </button>
                            <Link to="/checkout" onClick={() => addToCart(product)} className="flex-1 flex items-center justify-center border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 py-4 rounded-full font-bold text-lg transition-all active:scale-95">
                                Buy Now
                            </Link>
                        </div>

                        {/* Artisan Story Card */}
                        <div className="bg-[#112240] rounded-2xl p-8 border border-[#233554] hover:border-[#D4AF37]/30 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <h3 className="text-[#D4AF37] font-display font-bold text-xl mb-6">Meet the Artisan</h3>

                                <div className="flex items-start gap-6">
                                    <div className="relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974"
                                            alt="Artisan"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-[#112240] shadow-xl"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] rounded-full p-1 border-2 border-[#112240]">
                                            <UserVerifiedIcon size={12} className="text-[#0A192F]" />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-xl mb-1">{product.artisan}</h4>
                                        <p className="text-[#8892B0] text-sm mb-3">3rd Generation Weaver • 25 Years Exp.</p>
                                        <p className="text-[#CCD6F6] text-sm italic mb-4 leading-relaxed border-l-2 border-[#D4AF37] pl-3">
                                            "Weaving is not just our livelihood, it is our prayer. Every thread carries the blessings of our ancestors. When you buy this, you take a piece of our soul with you."
                                        </p>

                                        <button className="text-[#D4AF37] hover:text-white text-sm font-bold flex items-center gap-2 group/btn transition-colors">
                                            <div className="bg-[#D4AF37]/20 p-2 rounded-full group-hover/btn:bg-[#D4AF37] group-hover/btn:text-[#0A192F] transition-colors">
                                                <Play size={14} fill="currentColor" />
                                            </div>
                                            Watch Their Journey
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* AR Modal with AnimatePresence */}
            <AnimatePresence>
                {showAR && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAR(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#000] rounded-3xl overflow-hidden border border-[#333] shadow-2xl aspect-[4/3] md:aspect-[16/9]"
                        >

                            {/* Camera Feed Mockup Background */}
                            <div className="absolute inset-0 bg-[#1a1a1a]">
                                {/* Grid Overlay */}
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10 pointer-events-none">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className="border border-white/20"></div>
                                    ))}
                                </div>

                                {/* Abstract Room Placeholder */}
                                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#0f0f0f] to-transparent opacity-50"></div>
                            </div>

                            {/* 3D Object Mockup */}
                            <motion.div
                                drag
                                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                                className="absolute top-1/2 left-1/2 cursor-grab active:cursor-grabbing w-64 md:w-80"
                                style={{ x: '-50%', y: '-50%' }}
                            >
                                <img
                                    src={product.image}
                                    alt="AR Object"
                                    className="w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                                />
                                {/* Selection Box / Ring */}
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/10 rounded-[100%] border border-white/30 blur-sm"></div>
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/80 rounded-full animate-ping"></div>
                            </motion.div>

                            {/* UI Overlays */}
                            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Live AR View</span>
                                </div>

                                <button
                                    onClick={() => setShowAR(false)}
                                    className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Controls */}
                            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="flex items-center gap-6 text-white/50 text-sm font-medium">
                                    <div className="flex flex-col items-center gap-2">
                                        <Move size={20} className="text-white" />
                                        <span>Drag to Move</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div className="flex flex-col items-center gap-2">
                                        <RotateCw size={20} className="text-white" />
                                        <span>Pinch to Rotate</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Maximize size={20} className="text-white" />
                                        <span>Zoom</span>
                                    </div>
                                </div>

                                <button className="bg-[#D4AF37] text-[#0A192F] px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all">
                                    Place in Room
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

// Simple Icon for verification
const UserVerifiedIcon = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
)

export default ProductDetails;
