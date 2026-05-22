import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, ChevronRight, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: currentUser?.email || '', phone: '',
        address: '', city: '', state: '', zip: ''
    });

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setIsProcessing(true);
        try {
            // Calculate final amounts
            const subtotal = getCartTotal();
            const shipping = subtotal > 5000 ? 0 : 250;
            const total = subtotal + shipping;

            // Submit to Firestore
            const docRef = await addDoc(collection(db, "orders"), {
                userId: currentUser ? currentUser.uid : 'guest',
                customerInfo: formData,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    artisanId: item.artisanId || 'unknown'
                })),
                subtotal,
                shipping,
                totalPrice: total,
                status: "pending",
                createdAt: serverTimestamp()
            });

            setOrderId(docRef.id);
            setOrderComplete(true);
            clearCart();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Payment failed. Please try again.");
        }
        setIsProcessing(false);
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 bg-[#0A192F] flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#112240] p-12 rounded-3xl border border-[#233554] shadow-2xl text-center max-w-lg w-full"
                >
                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-4">Order Confirmed!</h1>
                    <p className="text-[#8892B0] mb-6">Your order <span className="text-[#D4AF37] font-mono">{orderId.slice(0, 8).toUpperCase()}</span> has been placed successfully. The artisan has been notified to start preparing your craft.</p>
                    
                    <div className="flex flex-col gap-4">
                        <Link to={currentUser ? "/user-dashboard" : "/shop"} className="bg-[#D4AF37] text-[#0A192F] font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors">
                            {currentUser ? "View Order Status" : "Continue Shopping"}
                        </Link>
                        <Link to="/" className="text-[#8892B0] hover:text-white transition-colors">Return to Home</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const shipping = subtotal > 5000 ? 0 : 250;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-[#0A192F] text-[#CCD6F6]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-2 text-[#8892B0] text-sm mb-8">
                    <Link to="/shop" className="hover:text-[#D4AF37]">Shop</Link> <ChevronRight size={14} />
                    <span className="cursor-pointer hover:text-[#D4AF37]">Cart</span> <ChevronRight size={14} />
                    <span className="text-[#D4AF37] font-medium">Checkout</span>
                </div>
                
                <h1 className="text-3xl font-display font-bold text-white mb-8">Secure Checkout</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-[#112240] rounded-2xl border border-[#233554]">
                        <h2 className="text-xl text-white mb-4">Your cart is empty.</h2>
                        <Link to="/shop" className="text-[#D4AF37] hover:underline">Return to Shop</Link>
                    </div>
                ) : (
                    <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Form */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Shipping Details */}
                            <div className="bg-[#112240] p-6 md:p-8 rounded-2xl border border-[#233554] shadow-lg">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Truck className="text-[#D4AF37]" size={20} /> Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-[#8892B0] mb-2">First Name</label>
                                        <input required type="text" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#8892B0] mb-2">Last Name</label>
                                        <input required type="text" value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="Doe" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-[#8892B0] mb-2">Email Address</label>
                                        <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="john@example.com" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-[#8892B0] mb-2">Street Address</label>
                                        <input required type="text" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="123 Artisan Lane, Apt 4" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#8892B0] mb-2">City</label>
                                        <input required type="text" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="New Delhi" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#8892B0] mb-2">State</label>
                                        <input required type="text" value={formData.state} onChange={e=>setFormData({...formData, state: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="Delhi" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#8892B0] mb-2">ZIP Code</label>
                                        <input required type="text" value={formData.zip} onChange={e=>setFormData({...formData, zip: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="110001" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#8892B0] mb-2">Phone Number</label>
                                        <input required type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] focus:border-[#D4AF37] rounded-lg px-4 py-3 text-white outline-none" placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment details (Mock) */}
                            <div className="bg-[#112240] p-6 md:p-8 rounded-2xl border border-[#233554] shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#112240] to-[#0A192F] z-0"></div>
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <CreditCard className="text-[#D4AF37]" size={20} /> Payment Method
                                    </h2>
                                    <div className="bg-[#0A192F] border border-[#233554] rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="w-4 h-4 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                                        </div>
                                        <span className="text-white">Pay on Delivery (Cash/UPI)</span>
                                    </div>
                                    <p className="text-[#8892B0] text-sm mt-4 flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-green-500" /> Secure transaction routing directly to the artisan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div>
                            <div className="bg-[#112240] p-6 rounded-2xl border border-[#233554] shadow-lg sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <img src={item.image || item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded shadow" />
                                            <div className="flex-1">
                                                <h3 className="text-white text-sm line-clamp-2">{item.name}</h3>
                                                <p className="text-[#8892B0] text-xs mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-[#D4AF37] font-medium whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#233554] pt-4 space-y-3 mb-6">
                                    <div className="flex justify-between text-[#8892B0]">
                                        <span>Subtotal</span>
                                        <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-[#8892B0]">
                                        <span>Shipping</span>
                                        <span className="text-white">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-[#233554]">
                                        <span className="text-white">Total</span>
                                        <span className="text-[#D4AF37]">₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-75"
                                >
                                    {isProcessing ? (
                                        <><span className="animate-spin border-2 border-[#0A192F] border-t-transparent rounded-full w-5 h-5"></span> Processing...</>
                                    ) : (
                                        <>Place Order (₹{total.toLocaleString('en-IN')})</>
                                    )}
                                </button>
                                
                                <p className="text-[#8892B0] text-xs text-center mt-4">By placing your order you agree to our Terms & Conditions.</p>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Checkout;
