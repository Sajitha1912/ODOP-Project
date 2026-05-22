import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Package, DollarSign, TrendingUp, Plus, Image as ImageIcon, X } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/security';

const ArtisanDashboard = () => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', district: '', category: '', artisanStory: '', materials: ''
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (currentUser) {
            fetchProducts();
        }
    }, [currentUser]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "products"), where("artisanId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(items);
        } catch (error) {
            console.error("Error fetching artisan products:", error);
        }
        setLoading(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile || !formData.name || !formData.price || !formData.district) return;

        setUploading(true);
        setUploadProgress(0);
        try {
            // 1. Upload Image to Storage with Progress
            const storageRef = ref(storage, `products/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            const imageUrl = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    }, 
                    (error) => reject(error), 
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(url);
                    }
                );
            });

            // 2. Save Product to Firestore
            await addDoc(collection(db, "products"), {
                ...formData,
                price: Number(formData.price),
                imageUrl: imageUrl,
                artisanId: currentUser.uid,
                artisanName: currentUser.displayName || 'Unknown Artisan',
                isApproved: false,
                createdAt: serverTimestamp()
            });

            await logActivity(currentUser.uid, "PRODUCT_UPLOADED", { productName: formData.name });

            // 3. Reset and Refresh
            setShowUploadForm(false);
            setFormData({ name: '', description: '', price: '', district: '', category: '', artisanStory: '', materials: '' });
            setImageFile(null);
            setUploadProgress(0);
            fetchProducts();

        } catch (error) {
            console.error("Error uploading product:", error);
            alert("Failed to upload product. Please try again.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0A192F] text-[#CCD6F6]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#233554] pb-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-[#D4AF37]">Artisan Studio</h1>
                        <p className="text-[#8892B0] text-sm mt-1">Manage your crafts and track your success.</p>
                    </div>
                    <button 
                        onClick={() => setShowUploadForm(!showUploadForm)}
                        className="bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95 w-fit"
                    >
                        {showUploadForm ? <X size={20} /> : <Plus size={20} />}
                        {showUploadForm ? 'Cancel Upload' : 'Add New Product'}
                    </button>
                </div>

                {showUploadForm ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-[#112240] rounded-2xl p-8 border border-[#233554] shadow-2xl mb-12"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-[#233554] pb-4">Create Product Listing</h2>
                        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Image Upload Area */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Product Image *</label>
                                <div className="border-2 border-dashed border-[#233554] hover:border-[#D4AF37] rounded-xl p-8 text-center bg-[#0A192F] transition-colors relative">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        required
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {imageFile ? (
                                        <div className="text-[#D4AF37] font-medium flex flex-col items-center">
                                            <ImageIcon size={32} className="mb-2" />
                                            {imageFile.name}
                                        </div>
                                    ) : (
                                        <div className="text-[#8892B0] flex flex-col items-center">
                                            <Upload size={32} className="mb-2" />
                                            <span className="font-medium">Click or drag image to upload</span>
                                            <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Product Name *</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Handwoven Silk Saree" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Price (₹) *</label>
                                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="2500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">District *</label>
                                <input required type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Varanasi" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Category *</label>
                                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37] appearance-none">
                                    <option value="" disabled>Select Category</option>
                                    <option value="textiles">Textiles & Handlooms</option>
                                    <option value="pottery">Pottery & Ceramics</option>
                                    <option value="woodwork">Woodwork & Carving</option>
                                    <option value="metalwork">Metal & Brassware</option>
                                    <option value="art">Paintings & Art</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Materials Used *</label>
                                <input required type="text" value={formData.materials} onChange={e => setFormData({...formData, materials: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Organic Cotton, Natural Dyes" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Product Description *</label>
                                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Describe the materials and process..."></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">The Artisan's Story (Optional)</label>
                                <textarea rows="2" value={formData.artisanStory} onChange={e => setFormData({...formData, artisanStory: e.target.value})} className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Share the history or emotion behind this craft..."></textarea>
                            </div>

                            <div className="md:col-span-2 flex flex-col gap-4 mt-4">
                                {uploading && uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="w-full bg-[#0A192F] rounded-full h-2">
                                        <div className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                )}
                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={() => setShowUploadForm(false)} className="px-6 py-2 text-[#8892B0] hover:text-white transition-colors font-medium">Cancel</button>
                                    <button type="submit" disabled={uploading} className="bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] px-8 py-2 rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        {uploading ? <span className="animate-spin border-2 border-[#0A192F] border-t-transparent rounded-full w-5 h-5"></span> : <Upload size={18} />}
                                        {uploading ? 'Uploading...' : 'Publish Product'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <StatCard icon={<Package />} title="Active Listings" value={products.length} color="text-blue-400" />
                            <StatCard icon={<TrendingUp />} title="Items Sold" value="0" color="text-green-400" />
                            <StatCard icon={<DollarSign />} title="Total Earnings" value="₹0" color="text-[#D4AF37]" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-6">Your Catalog</h2>
                        
                        {loading ? (
                            <div className="text-center py-20 text-[#8892B0]">Loading your products...</div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-[#112240] rounded-2xl border border-[#233554] border-dashed">
                                <Package size={48} className="mx-auto text-[#8892B0] mb-4 opacity-50" />
                                <h3 className="text-white font-bold text-lg mb-2">No products yet</h3>
                                <p className="text-[#8892B0] mb-6">Start your digital journey by uploading your first craft.</p>
                                <button onClick={() => setShowUploadForm(true)} className="bg-[#233554] hover:bg-[#30476D] text-white px-6 py-2 rounded-lg transition-colors font-medium">Upload Now</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <div key={product.id} className="bg-[#112240] rounded-xl overflow-hidden border border-[#233554] group hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="h-48 overflow-hidden bg-[#0A192F]">
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-white font-bold truncate pr-2">{product.name}</h3>
                                                <span className="text-[#D4AF37] font-bold text-sm">₹{product.price}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {product.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                                <p className="text-[#8892B0] text-xs truncate">{product.district} • {product.category}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-[#233554] hover:bg-[#30476D] text-white text-xs py-2 rounded transition-colors">Edit</button>
                                                <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs py-2 rounded transition-colors">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-[#112240] p-6 rounded-2xl border border-[#233554] shadow-lg flex items-center justify-between">
        <div>
            <h3 className="text-[#8892B0] text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-display font-bold text-white">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-full bg-[#0A192F] border border-[#233554] flex items-center justify-center ${color}`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
    </div>
);

export default ArtisanDashboard;
