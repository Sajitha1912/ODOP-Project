import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A192F] border-l border-[#233554] z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#233554] bg-[#112240]">
                            <div className="flex items-center gap-3 text-white">
                                <ShoppingBag className="text-[#D4AF37]" size={24} />
                                <h2 className="text-xl font-display font-bold">Your Cart</h2>
                                <span className="bg-[#D4AF37] text-[#0A192F] text-xs font-bold px-2 py-1 rounded-full">{cartItems.length}</span>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="text-[#8892B0] hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[#8892B0] space-y-4">
                                    <ShoppingBag size={64} className="opacity-20" />
                                    <p className="text-lg">Your cart is empty</p>
                                    <button onClick={() => { setIsCartOpen(false); navigate('/shop'); }} className="text-[#D4AF37] hover:underline font-medium">Continue Shopping</button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.div key={item.id} layout className="flex gap-4 bg-[#112240] p-4 rounded-xl border border-[#233554]">
                                        <img src={item.image || item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-white font-medium line-clamp-1">{item.name}</h3>
                                                <button onClick={() => removeFromCart(item.id)} className="text-[#8892B0] hover:text-red-400 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[#8892B0] text-sm mb-auto line-clamp-1">{item.district}</p>
                                            <div className="flex justify-between items-end mt-2">
                                                <span className="text-[#D4AF37] font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                                <div className="flex items-center gap-3 bg-[#0A192F] border border-[#233554] rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#8892B0] hover:text-white"><Minus size={16}/></button>
                                                    <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#8892B0] hover:text-white"><Plus size={16}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-[#233554] bg-[#112240]">
                                <div className="flex justify-between items-center mb-6 text-white text-lg">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-bold text-[#D4AF37]">₹{getCartTotal().toLocaleString('en-IN')}</span>
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-95"
                                >
                                    Proceed to Checkout
                                </button>
                                <p className="text-center text-[#8892B0] text-xs mt-4">Shipping & taxes calculated at checkout</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
