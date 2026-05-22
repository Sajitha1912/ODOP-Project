import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Map, Heart, TrendingUp, Smartphone, Users, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

const ALL_DISTRICTS = [
  // Andhra Pradesh
  { name: "Kondapalli", state: "Andhra Pradesh", craft: "Wooden Toys", 
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&fit=crop" },
  { name: "Tirupati", state: "Andhra Pradesh", craft: "Stone Carvings", 
    image: "https://images.unsplash.com/photo-1580654712603-eb43273aff33?w=400&fit=crop" },
  { name: "Nellore", state: "Andhra Pradesh", craft: "Pearl Jewelry", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&fit=crop" },
  { name: "Srikalahasti", state: "Andhra Pradesh", craft: "Kalamkari Textiles", 
    image: "https://images.unsplash.com/photo-1610189352649-6b97a91df62f?w=400&fit=crop" },

  // Assam
  { name: "Sualkuchi", state: "Assam", craft: "Muga Silk", 
    image: "https://images.unsplash.com/photo-1558618047-f4e60cee2bbc?w=400&fit=crop" },
  { name: "Dhubri", state: "Assam", craft: "Cane Craft", 
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&fit=crop" },

  // Bihar
  { name: "Madhubani", state: "Bihar", craft: "Madhubani Paintings", 
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&fit=crop" },
  { name: "Bhagalpur", state: "Bihar", craft: "Tussar Silk", 
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&fit=crop" },
  { name: "Muzaffarpur", state: "Bihar", craft: "Sitalpati Weaving", 
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=400&fit=crop" },

  // Chhattisgarh
  { name: "Bastar", state: "Chhattisgarh", craft: "Tribal Iron Craft", 
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&fit=crop" },
  { name: "Kondagaon", state: "Chhattisgarh", craft: "Terracotta", 
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&fit=crop" },

  // Gujarat
  { name: "Kutch", state: "Gujarat", craft: "Mirror Embroidery", 
    image: "https://images.unsplash.com/photo-1610189352649-6b97a91df62f?w=400&fit=crop" },
  { name: "Patan", state: "Gujarat", craft: "Patola Weaving", 
    image: "https://images.unsplash.com/photo-1558618047-f4e60cee2bbc?w=400&fit=crop" },
  { name: "Ahmedabad", state: "Gujarat", craft: "Bandhani Textiles", 
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&fit=crop" },
  { name: "Surat", state: "Gujarat", craft: "Zari Work", 
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&fit=crop" },

  // Haryana
  { name: "Panipat", state: "Haryana", craft: "Handloom Weaving", 
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=400&fit=crop" },
  { name: "Rohtak", state: "Haryana", craft: "Phulkari Embroidery", 
    image: "https://images.unsplash.com/photo-1610189352649-6b97a91df62f?w=400&fit=crop" },

  // Himachal Pradesh
  { name: "Kullu", state: "Himachal Pradesh", craft: "Woolen Shawls", 
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&fit=crop" },
  { name: "Chamba", state: "Himachal Pradesh", craft: "Chamba Rumal", 
    image: "https://images.unsplash.com/photo-1558618047-f4e60cee2bbc?w=400&fit=crop" },
  { name: "Kangra", state: "Himachal Pradesh", craft: "Miniature Paintings", 
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&fit=crop" },

  // Jammu & Kashmir
  { name: "Srinagar", state: "Jammu & Kashmir", craft: "Pashmina Shawls", 
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&fit=crop" },
  { name: "Anantnag", state: "Jammu & Kashmir", craft: "Carpet Weaving", 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop" },

  // Jharkhand
  { name: "Dumka", state: "Jharkhand", craft: "Sohrai Paintings", 
    image: "https://images.unsplash.com/photo-1600096194534-95cf5ece2cf4?w=400&fit=crop" },
  { name: "Ranchi", state: "Jharkhand", craft: "Dokra Metal Cast", 
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&fit=crop" },

  // Karnataka
  { name: "Channapatna", state: "Karnataka", craft: "Lacquer Wooden Toys", 
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&fit=crop" },
  { name: "Mysore", state: "Karnataka", craft: "Mysore Silk Sarees", 
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&fit=crop" },
  { name: "Bidar", state: "Karnataka", craft: "Bidriware Metal", 
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&fit=crop" },
  { name: "Dharwad", state: "Karnataka", craft: "Kasuti Embroidery", 
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&fit=crop" },

  // Kerala
  { name: "Thrissur", state: "Kerala", craft: "Bronze Casting", 
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&fit=crop" },
  { name: "Kasaragod", state: "Kerala", craft: "Kasavu Sarees", 
    image: "https://images.unsplash.com/photo-1558618047-f4e60cee2bbc?w=400&fit=crop" },
  { name: "Kannur", state: "Kerala", craft: "Handloom Weaving", 
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=400&fit=crop" },
  { name: "Wayanad", state: "Kerala", craft: "Bamboo Craft", 
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&fit=crop" },

  // Madhya Pradesh
  { name: "Chanderi", state: "Madhya Pradesh", craft: "Chanderi Silk Fabric", 
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&fit=crop" },
  { name: "Maheshwar", state: "Madhya Pradesh", craft: "Maheshwari Sarees", 
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&fit=crop" },
  { name: "Bhopal", state: "Madhya Pradesh", craft: "Zardozi Embroidery", 
    image: "https://images.unsplash.com/photo-1610189352649-6b97a91df62f?w=400&fit=crop" },

  // Maharashtra
  { name: "Kolhapur", state: "Maharashtra", craft: "Kolhapuri Chappals", 
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&fit=crop" },
  { name: "Pune", state: "Maharashtra", craft: "Paithani Sarees", 
    image: "https://images.unsplash.com/photo-1558618047-f4e60cee2bbc?w=400&fit=crop" },
  { name: "Nashik", state: "Maharashtra", craft: "Warli Paintings", 
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&fit=crop" },
  { name: "Aurangabad", state: "Maharashtra", craft: "Himroo Fabric", 
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=400&fit=crop" },

  // Odisha
  { name: "Puri", state: "Odisha", craft: "Pattachitra Paintings", 
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&fit=crop" },
  { name: "Sambalpur", state: "Odisha", craft: "Sambhalpuri Sarees", 
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&fit=crop" },
  { name: "Berhampur", state: "Odisha", craft: "Silk Weaving", 
    image: "https://images.unsplash.com/photo-1558618047-f4e60cee2bbc?w=400&fit=crop" },

  // Punjab
  { name: "Amritsar", state: "Punjab", craft: "Phulkari Embroidery", 
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=400&fit=crop" },
  { name: "Ludhiana", state: "Punjab", craft: "Woolen Shawls", 
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&fit=crop" },
  { name: "Patiala", state: "Punjab", craft: "Jutti Footwear", 
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&fit=crop" },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan", craft: "Blue Pottery", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&fit=crop" },
  { name: "Jodhpur", state: "Rajasthan", craft: "Bandhej Textiles", 
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=400&fit=crop" },
  { name: "Udaipur", state: "Rajasthan", craft: "Miniature Paintings", 
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&fit=crop" },
  { name: "Barmer", state: "Rajasthan", craft: "Applique Work", 
    image: "https://images.unsplash.com/photo-1610189352649-6b97a91df62f?w=400&fit=crop" },
  { name: "Jaisalmer", state: "Rajasthan", craft: "Stone Carving", 
    image: "https://images.unsplash.com/photo-1580654712603-eb43273aff33?w=400&fit=crop" },

  // Tamil Nadu
  { name: "Kanchipuram", state: "Tamil Nadu", craft: "Kanjivaram Silk Sarees", 
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&fit=crop" },
  { name: "Thanjavur", state: "Tamil Nadu", craft: "Tanjore Paintings", 
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&fit=crop" },
  { name: "Madurai", state: "Tamil Nadu", craft: "Sungudi Sarees", 
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&fit=crop" },
  { name: "Swamimalai", state: "Tamil Nadu", craft: "Bronze Casting", 
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&fit=crop" },

  // Telangana
  { name: "Pochampally", state: "Telangana", craft: "Ikat Weaving", 
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=400&fit=crop" },
  { name: "Nirmal", state: "Telangana", craft: "Nirmal Paintings", 
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&fit=crop" },

  // Uttar Pradesh
  { name: "Varanasi", state: "Uttar Pradesh", craft: "Banarasi Silk", 
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&fit=crop" },
  { name: "Moradabad", state: "Uttar Pradesh", craft: "Brassware", 
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&fit=crop" },
  { name: "Agra", state: "Uttar Pradesh", craft: "Marble Inlay", 
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&fit=crop" },
  { name: "Lucknow", state: "Uttar Pradesh", craft: "Chikankari", 
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&fit=crop" },
  { name: "Firozabad", state: "Uttar Pradesh", craft: "Glass Bangles", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&fit=crop" },
  { name: "Mirzapur", state: "Uttar Pradesh", craft: "Handmade Carpets", 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop" },

  // Uttarakhand
  { name: "Almora", state: "Uttarakhand", craft: "Copper Craft", 
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&fit=crop" },
  { name: "Dehradun", state: "Uttarakhand", craft: "Ringal Bamboo Craft", 
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&fit=crop" },

  // West Bengal
  { name: "Murshidabad", state: "West Bengal", craft: "Silk Weaving", 
    image: "https://images.unsplash.com/photo-1558618047-f4e60cee2bbc?w=400&fit=crop" },
  { name: "Bankura", state: "West Bengal", craft: "Terracotta Horse", 
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&fit=crop" },
  { name: "Darjeeling", state: "West Bengal", craft: "Tea & Bamboo Craft", 
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&fit=crop" },
  { name: "Bishnupur", state: "West Bengal", craft: "Baluchari Sarees", 
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&fit=crop" },
  { name: "Shantiniketan", state: "West Bengal", craft: "Leather Craft", 
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&fit=crop" },
];

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-[#112240] p-8 rounded-2xl border border-[#233554] hover:border-[#D4AF37]/50 hover:bg-[#1A2F55] transition-all group"
    >
        <div className="bg-[#0A192F] w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-[#233554]">
            <Icon className="text-[#D4AF37]" size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 font-display">{title}</h3>
        <p className="text-[#8892B0] leading-relaxed">
            {description}
        </p>
    </motion.div>
);

const Counter = ({ value, label, icon: Icon, suffix = "+" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (Number.isInteger(value)) {
                setDisplayValue(Math.floor(latest));
            } else {
                setDisplayValue(latest.toFixed(1));
            }
        });
    }, [springValue, value]);

    return (
        <div ref={ref} className="flex flex-col items-center p-6 bg-[#0A192F]/50 rounded-2xl border border-[#233554] backdrop-blur-sm w-full hover:border-[#D4AF37]/30 transition-colors">
            <div className="mb-4 p-3 bg-[#112240] rounded-full text-[#D4AF37] border border-[#233554]">
                <Icon size={32} />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white font-display mb-2 flex items-baseline">
                {displayValue}{suffix}
            </div>
            <div className="text-[#8892B0] font-medium tracking-wide uppercase text-sm">{label}</div>
        </div>
    );
};

const DistrictCard = ({ district }) => (
    <Link to={`/shop?district=${district.name}`} className="block min-w-[300px] md:min-w-[350px] snap-center group relative rounded-2xl overflow-hidden cursor-pointer h-[400px]">
        <img
            src={district.image}
            alt={district.name}
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src='https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&fit=crop'
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

        <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="bg-[#D4AF37] text-[#0A192F] text-xs font-bold px-2 py-1 rounded mb-2 inline-block shadow-md">
                {district.state}
            </span>
            <h3 className="text-2xl font-bold text-white font-display mb-1">{district.name}</h3>
            <p className="text-[#CCD6F6] text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                Famous for {district.craft}
            </p>
            <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                Explore Products <ArrowRight size={16} />
            </div>
        </div>
    </Link>
);

const Home = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-[#0A192F] min-h-screen font-body text-[#CCD6F6]">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#64FFDA]/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-[#112240] border border-[#233554] text-[#D4AF37] text-sm font-semibold tracking-wide mb-6">
                            One District, One Product
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white font-display mb-6 leading-tight tracking-tight">
                            Bringing <span className="text-[#D4AF37] relative">Tradition</span> <br /> to the Future.
                        </h1>
                        <p className="text-lg md:text-xl text-[#8892B0] mb-10 max-w-2xl mx-auto leading-relaxed">
                            ODOP Connect bridges the gap between India's finest artisans and the modern world.
                            Discover unique heritage products with cutting-edge AR technology.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/shop" className="bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2">
                                Explore Products <ArrowRight size={20} />
                            </Link>
                            <Link to="/district-explorer" className="bg-transparent border border-[#CCD6F6] text-[#CCD6F6] hover:bg-[#112240] hover:text-white hover:border-white font-semibold py-4 px-10 rounded-full transition-all flex items-center gap-2">
                                Meet the Artisans <Users size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#0A192F] relative z-10 border-t border-[#112240]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">Why Choose ODOP Connect?</h2>
                        <p className="text-[#8892B0] max-w-2xl mx-auto">
                            We combine centuries of tradition with modern technology to create a seamless shopping experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Smartphone}
                            title="AR Try Before You Buy"
                            description="Visualize paintings on your wall or handicrafts in your living room before purchasing with our advanced Augmented Reality feature."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Users}
                            title="Authentic Artisan Stories"
                            description="Know exactly who made your product. Read their story, watch them work, and support their livelihood directly."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Map}
                            title="District-Based Discovery"
                            description="Explore India's rich heritage through an interactive map. Discover unique specialities from every district."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-24 bg-[#112240] relative overflow-hidden border-t border-[#233554]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">Our Growing Impact</h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <Counter value={1250} label="Artisans Supported" icon={Heart} />
                        <Counter value={320} label="Districts Connected" icon={Globe} />
                        <Counter value={2.4} label="Cr Revenue Generated" icon={TrendingUp} suffix=" Cr" />
                    </div>
                </div>
            </section>

            {/* Carousel Section */}
            <section className="py-24 bg-[#0A192F] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-2">Featured Districts</h2>
                            <p className="text-[#8892B0]">Explore the diverse heritage of India.</p>
                        </div>
                        <div className="flex gap-2 self-start md:self-auto">
                            <button onClick={() => scroll('left')} className="bg-[#112240] border border-[#233554] text-white p-3 rounded-full hover:bg-[#D4AF37] hover:text-[#0A192F] transition-all"><ChevronLeft size={20} /></button>
                            <button onClick={() => scroll('right')} className="bg-[#112240] border border-[#233554] text-white p-3 rounded-full hover:bg-[#D4AF37] hover:text-[#0A192F] transition-all"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                    <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth">
                        {ALL_DISTRICTS.map(district => (
                            <DistrictCard key={district.id} district={district} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
