import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { logActivity } from '../../utils/security';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout, userRole } = useAuth();
    const { cartItems, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (currentUser) {
                await logActivity(currentUser.uid, "LOGOUT", { email: currentUser.email });
            }
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#0A192F]/95 backdrop-blur-md border-b border-[#112240] text-[#CCD6F6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold font-display text-[#D4AF37]">ODOP</span>
                            <span className="text-sm font-light tracking-widest text-[#8892B0]">CONNECT</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/" className="hover:text-[#D4AF37] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to="/district-explorer" className="hover:text-[#D4AF37] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">District Explorer</Link>
                            <Link to="/shop" className="hover:text-[#D4AF37] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">Shop</Link>
                            <Link to="/impact" className="hover:text-[#D4AF37] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">Impact</Link>
                            <Link to="/skills" className="hover:text-[#D4AF37] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">Skill Intelligence</Link>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-6">
                        <button className="hover:text-[#D4AF37] transition-colors"><Search size={20} /></button>
                        <button onClick={() => setIsCartOpen(true)} className="hover:text-[#D4AF37] transition-colors relative">
                            <ShoppingCart size={20} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0A192F] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            )}
                        </button>

                        {currentUser ? (
                            <div className="relative group">
                                <button className="hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                                    <User size={20} />
                                    <span className="text-sm font-medium">{currentUser.displayName || 'User'}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-[#112240] rounded-md shadow-lg py-1 border border-[#233554] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <Link to={userRole === 'artisan' ? '/artisan-dashboard' : userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'} className="block px-4 py-2 text-sm text-[#CCD6F6] hover:bg-[#233554] hover:text-[#D4AF37]">Dashboard</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-[#CCD6F6] hover:bg-[#233554] hover:text-red-400">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-medium hover:text-[#64FFDA] transition-colors border border-[#64FFDA] px-4 py-2 rounded-md hover:bg-[#64FFDA]/10">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-[#CCD6F6] hover:text-white focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#0A192F] border-b border-[#112240]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/district-explorer" className="hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">District Explorer</Link>
                        <Link to="/shop" className="hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">Shop</Link>
                        <Link to="/impact" className="hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">Impact</Link>
                        <Link to="/skills" className="hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">Skill Intelligence</Link>

                        {currentUser ? (
                            <>
                                <div className="border-t border-[#233554] my-2"></div>
                                <button onClick={() => setIsCartOpen(true)} className="hover:text-[#D4AF37] flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium w-full text-left"><ShoppingCart size={18} /> Cart ({cartItems.length})</button>
                                <Link to={userRole === 'artisan' ? '/artisan-dashboard' : userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'} className="hover:text-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                <button onClick={handleLogout} className="text-left w-full hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="hover:text-[#0A192F] bg-[#D4AF37] block px-3 py-2 rounded-md text-base font-medium mt-4 text-center font-bold">Login / Sign Up</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
