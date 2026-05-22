import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hammer, Mail, Lock, User, Phone, MapPin, AlignLeft, UserPlus } from 'lucide-react';
import { logActivity } from '../../utils/security';

const INDIAN_DISTRICTS = [
    "Agra", "Jaipur", "Kanchipuram", "Kutch", "Moradabad", "Mysore", "Puri", "Srinagar", "Thanjavur", "Varanasi", "Other"
];

const CRAFT_TYPES = [
    "Textiles & Handlooms", "Pottery & Ceramics", "Woodwork & Carving", "Metalwork & Brassware", "Paintings & Art", "Jewelry", "Leather Goods", "Other"
];

const ArtisanSignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [district, setDistrict] = useState('');
    const [craft, setCraft] = useState('');
    const [bio, setBio] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            
            // Calling AuthContext signup, which handles creating auth user and saving additional data to Firestore users collection
            const user = await signup(email, password, 'artisan', {
                name: name,
                district: district,
                craft: craft,
                bio: bio,
                phone: phone,
                isApproved: false
            });
            
            await logActivity(user.uid, "SIGNUP", { email: user.email });

            alert('Signup successful! Welcome to ODOP Connect. Your account is pending admin approval for selling.');
            navigate('/artisan-dashboard');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already associated with an account.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password (min 6 characters).');
            } else {
                setError('Failed to create artisan account: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A192F] px-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-[#112240] p-8 rounded-2xl shadow-2xl border border-[#233554] relative"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-[#D4AF37]">Artisan Registration</h2>
                    <p className="text-[#8892B0] mt-2">Join India's premium creator marketplace</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Full Name */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={18} />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={18} />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={18} />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="+91 xxxxxxxxxx"
                            />
                        </div>
                    </div>

                    {/* District Dropdown */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">District</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0] z-10" size={18} />
                            <select
                                required
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                            >
                                <option value="" disabled>Select Location</option>
                                {INDIAN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Craft Type Dropdown */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Primary Craft</label>
                        <div className="relative">
                            <Hammer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0] z-10" size={18} />
                            <select
                                required
                                value={craft}
                                onChange={(e) => setCraft(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                            >
                                <option value="" disabled>Select Craft</option>
                                {CRAFT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Bio Textarea */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Bio / Artisan Story</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-[#8892B0]" size={18} />
                            <textarea
                                required
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="Share your experience and story..."
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin border-2 border-[#0A192F] border-t-transparent rounded-full w-5 h-5"></div>
                            ) : (
                                <UserPlus size={20} />
                            )}
                            {loading ? 'Creating Account...' : 'Register as Artisan'}
                        </button>
                    </div>

                </form>

                <div className="mt-8 text-center text-sm text-[#8892B0]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#D4AF37] font-medium hover:underline">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ArtisanSignupPage;
