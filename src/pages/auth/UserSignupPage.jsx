import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { logActivity } from '../../utils/security';

const UserSignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const user = await signup(email, password, 'user', { 
                displayName: name,
                approved: true 
            });
            await logActivity(user.uid, "SIGNUP", { email: user.email });
            navigate('/shop');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key' || err.code === 'auth/invalid-api-key') {
                setError('Invalid Firebase API Key. Please check your configuration.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Email is already associated with an account.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password.');
            } else if (err.code === 'auth/network-request-failed') {
                setError('Network error. Please check your internet connection.');
            } else {
                setError('Failed to create an account: ' + err.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A192F] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-[#112240] p-8 rounded-lg shadow-2xl border border-[#233554]"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-[#CCD6F6]">Create Account</h2>
                    <p className="text-[#8892B0] mt-2">Join the community of culture enthusiasts</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={20} />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 pl-10 pr-4 text-[#CCD6F6] focus:outline-none focus:border-[#64FFDA] transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 pl-10 pr-4 text-[#CCD6F6] focus:outline-none focus:border-[#64FFDA] transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 pl-10 pr-4 text-[#CCD6F6] focus:outline-none focus:border-[#64FFDA] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#64FFDA] hover:bg-[#64FFDA]/90 text-[#0A192F] font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                        <UserPlus size={20} />
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[#8892B0]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#64FFDA] hover:underline">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default UserSignupPage;
