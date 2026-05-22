import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0A192F] text-[#8892B0] border-t border-[#112240]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold font-display text-[#D4AF37] mb-4">ODOP Connect</h3>
                        <p className="text-sm leading-relaxed mb-4">
                            Empowering artisans across India by connecting them directly with you. Discover the soul of India, one district at a time.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Our Story</a></li>
                            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Artisans</a></li>
                            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Districts</a></li>
                            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><Mail size={16} /> support@odopconnect.in</li>
                            <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
                            <li className="flex items-center gap-2"><MapPin size={16} /> New Delhi, India</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Stay Connected</h4>
                        <p className="text-xs mb-3">Subscribe to get updates on new artisans and products.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#112240] text-white px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            />
                            <button className="bg-[#D4AF37] text-[#0A192F] px-4 py-2 rounded text-sm font-bold hover:bg-yellow-500 transition-colors">
                                Go
                            </button>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="hover:text-[#D4AF37]"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-[#D4AF37]"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-[#D4AF37]"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-[#D4AF37]"><Linkedin size={20} /></a>
                        </div>
                    </div>

                </div>
                <div className="border-t border-[#112240] mt-12 pt-8 text-center text-xs">
                    © 2026 ODOP Connect. All rights reserved. Made with ❤️ for India.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
