import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Loader2, PackageX, ChevronDown, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Textiles', 'Pottery', 'Woodwork', 'Metalwork', 'Paintings', 'Jewelry'];

function Shop() {
    const { addToCart } = useCart();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [sortBy, setSortBy] = useState('latest'); // 'latest', 'priceLowHigh', 'priceHighLow'

    // Extract unique districts from fetched products for the dropdown
    const districts = useMemo(() => {
        const uniqueDistricts = new Set(products.map(p => p.district).filter(Boolean));
        return ['All', ...Array.from(uniqueDistricts).sort()];
    }, [products]);

    useEffect(() => {
        // Real-time listener for approved products
        const q = query(collection(db, "products"), where("isApproved", "==", true));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedProducts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(fetchedProducts);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // 1. Search Filter (name or district)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(term) || 
                p.district?.toLowerCase().includes(term)
            );
        }

        // 2. Category Filter
        if (selectedCategory !== 'All') {
            // Lowercase matching in case categories were saved lowercase
            const cat = selectedCategory.toLowerCase();
            // In the upload form the value is lowercase (e.g. 'textiles')
            result = result.filter(p => p.category?.toLowerCase() === cat);
        }

        // 3. District Filter
        if (selectedDistrict !== 'All') {
            result = result.filter(p => p.district === selectedDistrict);
        }

        // 4. Sorting
        switch (sortBy) {
            case 'priceLowHigh':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'priceHighLow':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'latest':
            default:
                result.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                    return timeB - timeA;
                });
                break;
        }

        return result;
    }, [products, searchTerm, selectedCategory, selectedDistrict, sortBy]);

    const handleAddToCart = (e, product) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <div className="min-h-screen bg-[#0A192F] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Artisan Marketplace</h1>
                    <p className="text-[#8892B0] text-lg max-w-2xl">Discover authentic, handcrafted goods directly from India's master artisans.</p>
                </div>

                {/* Filters & Search Section */}
                <div className="bg-[#112240] rounded-2xl border border-[#233554] p-4 md:p-6 mb-8 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-[#8892B0]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by product name or district..."
                                className="block w-full pl-10 pr-3 py-3 border border-[#233554] rounded-xl leading-5 bg-[#0A192F] text-white placeholder-[#8892B0] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* District Dropdown */}
                        <div className="relative md:w-48">
                            <select
                                className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm rounded-xl bg-[#0A192F] text-white border border-[#233554] appearance-none"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                {districts.map(d => (
                                    <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8892B0]">
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative md:w-56">
                            <select
                                className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm rounded-xl bg-[#0A192F] text-white border border-[#233554] appearance-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="latest">Sort: Latest</option>
                                <option value="priceLowHigh">Sort: Price (Low to High)</option>
                                <option value="priceHighLow">Sort: Price (High to Low)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8892B0]">
                                <Filter className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === category
                                        ? 'bg-[#D4AF37] text-[#0A192F] font-bold'
                                        : 'bg-[#0A192F] text-[#8892B0] border border-[#233554] hover:border-[#D4AF37] hover:text-[#CCD6F6]'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    // Loading Skeletons
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="bg-[#112240] rounded-2xl p-4 border border-[#233554] animate-pulse">
                                <div className="bg-[#233554] h-40 md:h-48 rounded-xl mb-4 w-full"></div>
                                <div className="bg-[#233554] h-6 rounded w-3/4 mb-2"></div>
                                <div className="bg-[#233554] h-4 rounded w-1/2 mb-4"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="bg-[#233554] h-6 rounded w-1/3"></div>
                                    <div className="bg-[#233554] h-8 rounded w-10"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    // Global Empty State
                    <div className="text-center py-20 bg-[#112240] rounded-2xl border border-[#233554] shadow-xl">
                        <PackageX className="h-16 w-16 text-[#8892B0] mx-auto mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold text-white mb-2">Marketplace Empty</h2>
                        <p className="text-[#8892B0]">There are currently no approved products available. Please check back soon.</p>
                    </div>
                ) : filteredAndSortedProducts.length === 0 ? (
                    // Filter Empty State
                    <div className="text-center py-16 bg-[#112240]/50 rounded-2xl border border-[#233554] border-dashed">
                        <Search className="h-12 w-12 text-[#8892B0] mx-auto mb-4 opacity-30" />
                        <h2 className="text-xl font-bold text-white mb-2">No Matches Found</h2>
                        <p className="text-[#8892B0]">We couldn't find any products matching your current filters.</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                                setSelectedDistrict('All');
                            }}
                            className="mt-4 text-[#D4AF37] hover:underline text-sm font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    // Product Grid
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredAndSortedProducts.map((product) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                key={product.id} 
                                className="bg-[#112240] rounded-2xl overflow-hidden border border-[#233554] hover:border-[#D4AF37]/50 transition-colors shadow-lg group flex flex-col h-full"
                            >
                                <Link to={`/product/${product.id}`} className="block relative overflow-hidden h-40 md:h-56 bg-[#0A192F]">
                                    {/* District Badge */}
                                    <div className="absolute top-2 right-2 z-10 bg-[#0A192F]/80 backdrop-blur-md px-2 py-1 rounded-md border border-[#233554]">
                                        <span className="text-[10px] md:text-xs font-medium text-[#CCD6F6]">{product.district}</span>
                                    </div>
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#112240] via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                </Link>
                                
                                <div className="p-3 md:p-5 flex flex-col flex-grow">
                                    <Link to={`/product/${product.id}`} className="block mb-1">
                                        <h3 className="text-sm md:text-lg font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                                    </Link>
                                    <p className="text-[#8892B0] text-[10px] md:text-xs mb-3 truncate">By <span className="text-[#CCD6F6]">{product.artisanName}</span></p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#233554]/50">
                                        <span className="text-[#D4AF37] font-bold text-sm md:text-lg">₹{Number(product.price).toLocaleString('en-IN')}</span>
                                        <button 
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="bg-[#233554] hover:bg-[#D4AF37] text-white hover:text-[#0A192F] p-2 md:px-4 md:py-2 rounded-lg transition-colors flex items-center justify-center group/btn"
                                            aria-label="Add to cart"
                                        >
                                            <ShoppingCart className="w-4 h-4 md:mr-2" />
                                            <span className="hidden md:inline font-bold text-sm">Add</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Shop;
