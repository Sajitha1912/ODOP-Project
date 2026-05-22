import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, ShieldAlert, Check, Activity, Trash2, Ban, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/security';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'artisans', 'security'
    
    const [stats, setStats] = useState({
        totalArtisans: 0,
        totalProducts: 0,
        pendingApprovals: 0,
    });
    
    const [pendingProducts, setPendingProducts] = useState([]);
    const [approvedProducts, setApprovedProducts] = useState([]);
    const [artisans, setArtisans] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [securityAlerts, setSecurityAlerts] = useState([]);
    const [unresolvedCount, setUnresolvedCount] = useState(0);

    useEffect(() => {
        fetchStats();

        // Real-time listener for Security Alerts
        const alertQuery = query(collection(db, "securityAlerts"), orderBy("timestamp", "desc"));
        const unsubscribeAlerts = onSnapshot(alertQuery, (snapshot) => {
            const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSecurityAlerts(alerts);
            setUnresolvedCount(alerts.filter(a => !a.resolved).length);
        });

        // Real-time listener for Activity Logs (Part 3 Request)
        const logsQuery = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"), limit(50));
        const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
            setActivityLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeAlerts();
            unsubscribeLogs();
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'pending') fetchPendingProducts();
        if (activeTab === 'approved') fetchApprovedProducts();
        if (activeTab === 'artisans') fetchArtisans();
    }, [activeTab]);


    const fetchStats = async () => {
        try {
            const artisansQuery = query(collection(db, "users"), where("role", "==", "artisan"));
            const approvedQuery = query(collection(db, "products"), where("isApproved", "==", true));
            const pendingQuery = query(collection(db, "products"), where("isApproved", "==", false));
            
            const [artSnap, appSnap, penSnap] = await Promise.all([
                getDocs(artisansQuery),
                getDocs(approvedQuery),
                getDocs(pendingQuery)
            ]);

            setStats({
                totalArtisans: artSnap.size,
                totalProducts: appSnap.size + penSnap.size,
                pendingApprovals: penSnap.size
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchPendingProducts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "products"), where("isApproved", "==", false));
            const snapshot = await getDocs(q);
            setPendingProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching pending products:", error);
        }
        setLoading(false);
    };

    const fetchApprovedProducts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "products"), where("isApproved", "==", true));
            const snapshot = await getDocs(q);
            setApprovedProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching approved products:", error);
        }
        setLoading(false);
    };

    const fetchArtisans = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("role", "==", "artisan"));
            const snapshot = await getDocs(q);
            setArtisans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching artisans:", error);
        }
        setLoading(false);
    };

    const approveProduct = async (id, name) => {
        try {
            await updateDoc(doc(db, "products", id), { isApproved: true });
            setPendingProducts(pendingProducts.filter(p => p.id !== id));
            await logActivity(currentUser.uid, "PRODUCT_APPROVED", { productName: name });
            fetchStats();
        } catch (error) {
            console.error("Error approving product:", error);
        }
    };

    const rejectProduct = async (id, name) => {
        if (!window.confirm(`Are you sure you want to reject and delete "${name}"?`)) return;
        try {
            await deleteDoc(doc(db, "products", id));
            setPendingProducts(pendingProducts.filter(p => p.id !== id));
            await logActivity(currentUser.uid, "PRODUCT_REJECTED", { productName: name });
            fetchStats();
        } catch (error) {
            console.error("Error rejecting product:", error);
        }
    };

    const removeProduct = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove "${name}" from the marketplace?`)) return;
        try {
            await deleteDoc(doc(db, "products", id));
            setApprovedProducts(approvedProducts.filter(p => p.id !== id));
            await logActivity(currentUser.uid, "PRODUCT_REMOVED", { productName: name });
            fetchStats();
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };

    const banArtisan = async (id, name, isBanned) => {
        const actionStr = isBanned ? 'unban' : 'ban';
        if (!window.confirm(`Are you sure you want to ${actionStr} artisan "${name}"?`)) return;
        try {
            await updateDoc(doc(db, "users", id), { isBanned: !isBanned });
            setArtisans(artisans.map(a => a.id === id ? { ...a, isBanned: !isBanned } : a));
            await logActivity(currentUser.uid, isBanned ? 'ARTISAN_UNBANNED' : 'ARTISAN_BANNED', { target: name });
        } catch (error) {
            console.error(`Error trying to ${actionStr} artisan:`, error);
        }
    };

    const resolveAlert = async (id, reason) => {
        try {
            await updateDoc(doc(db, "securityAlerts", id), { resolved: true });
            await logActivity(currentUser.uid, "ALERT_RESOLVED", { reason });
        } catch (error) {
            console.error("Error resolving alert:", error);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0A192F] text-[#CCD6F6]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8 border-b border-[#233554] pb-6">
                    <ShieldAlert size={32} className="text-[#D4AF37]" />
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Admin Control Center</h1>
                        <p className="text-[#8892B0] text-sm mt-1">Manage artisans, products, and platform security.</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard icon={<Users />} title="Total Artisans" value={stats.totalArtisans} color="text-blue-400" />
                    <StatCard icon={<Package />} title="Total Products" value={stats.totalProducts} color="text-purple-400" />
                    <StatCard icon={<ShieldAlert />} title="Pending Approvals" value={stats.pendingApprovals} color="text-yellow-400" />
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-[#233554] pb-4">
                    <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={<Check size={18} />}>Pending Products</TabButton>
                    <TabButton active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} icon={<Package size={18} />}>Approved Products</TabButton>
                    <TabButton active={activeTab === 'artisans'} onClick={() => setActiveTab('artisans')} icon={<Users size={18} />}>Artisan Management</TabButton>
                    
                    {/* Security Tab */}
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-2 relative ${
                            activeTab === 'security' 
                                ? 'bg-[#112240] text-red-500 border-red-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]' 
                                : 'bg-transparent text-[#8892B0] border-transparent hover:text-white hover:bg-[#112240]/50'
                        }`}
                    >
                        <Lock size={18} className={activeTab === 'security' ? 'text-red-500' : ''} /> Security Monitoring
                        {unresolvedCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                {unresolvedCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="bg-[#112240] rounded-2xl border border-[#233554] p-6 shadow-xl min-h-[400px]">
                    {loading && activeTab !== 'security' ? (
                        <div className="text-center py-20 text-[#8892B0]">Loading data...</div>
                    ) : (
                        <>
                            {activeTab === 'pending' && (
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-6">Pending Product Approvals</h2>
                                    {pendingProducts.length === 0 ? (
                                        <EmptyState icon={<Check size={48} />} message="No pending products to review." />
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {pendingProducts.map(product => (
                                                <ProductCard 
                                                    key={product.id} 
                                                    product={product} 
                                                    actions={
                                                        <div className="flex gap-2 w-full">
                                                            <button onClick={() => approveProduct(product.id, product.name)} className="flex-1 bg-green-500/20 hover:bg-green-500 hover:text-white text-green-400 text-xs py-2 rounded transition-colors font-bold">Approve</button>
                                                            <button onClick={() => rejectProduct(product.id, product.name)} className="flex-1 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 text-xs py-2 rounded transition-colors font-bold">Reject</button>
                                                        </div>
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'approved' && (
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-6">Approved Products Catalog</h2>
                                    {approvedProducts.length === 0 ? (
                                        <EmptyState icon={<Package size={48} />} message="No approved products in the marketplace." />
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {approvedProducts.map(product => (
                                                <ProductCard 
                                                    key={product.id} 
                                                    product={product} 
                                                    actions={
                                                        <button onClick={() => removeProduct(product.id, product.name)} className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 text-xs py-2 rounded transition-colors font-bold">
                                                            <Trash2 size={14} /> Remove Product
                                                        </button>
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'artisans' && (
                                <div className="overflow-x-auto">
                                    <h2 className="text-xl font-bold text-white mb-6">Artisan Management</h2>
                                    {artisans.length === 0 ? (
                                        <EmptyState icon={<Users size={48} />} message="No artisans found." />
                                    ) : (
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="border-b border-[#233554] text-[#8892B0] text-sm">
                                                    <th className="py-4 px-4 font-normal">Name</th>
                                                    <th className="py-4 px-4 font-normal">Email</th>
                                                    <th className="py-4 px-4 font-normal">District</th>
                                                    <th className="py-4 px-4 font-normal">Craft</th>
                                                    <th className="py-4 px-4 font-normal">Status</th>
                                                    <th className="py-4 px-4 text-right font-normal">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {artisans.map(artisan => (
                                                    <tr key={artisan.id} className="border-b border-[#233554]/50 hover:bg-[#233554]/20 transition-colors">
                                                        <td className="py-4 px-4 font-medium text-white">{artisan.displayName || artisan.email}</td>
                                                        <td className="py-4 px-4 text-[#8892B0] text-sm">{artisan.email}</td>
                                                        <td className="py-4 px-4 text-[#8892B0] text-sm">{artisan.district || '-'}</td>
                                                        <td className="py-4 px-4 text-[#8892B0] text-sm">{artisan.craft || '-'}</td>
                                                        <td className="py-4 px-4">
                                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${artisan.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                                {artisan.isBanned ? 'Banned' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <button 
                                                                onClick={() => banArtisan(artisan.id, artisan.displayName || artisan.email, !!artisan.isBanned)} 
                                                                className={`text-xs px-4 py-2 rounded font-bold transition-colors ${artisan.isBanned ? 'bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white' : 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white'}`}
                                                            >
                                                                {artisan.isBanned ? 'Unban User' : <span className="flex items-center gap-1 justify-center"><Ban size={14} /> Ban User</span>}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-12">
                                    
                                    {/* --- Section 1: Security Alerts --- */}
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Lock className="text-red-500"/> Intrusion Detection & System Alerts
                                            </h2>
                                        </div>
                                        {securityAlerts.length === 0 ? (
                                            <div className="bg-[#0A192F] p-8 rounded-xl border border-green-500/30 flex flex-col items-center justify-center text-center">
                                                <CheckCircle size={48} className="text-green-500 mb-4" />
                                                <h3 className="text-white font-bold text-lg mb-2">Systems Secure</h3>
                                                <p className="text-[#8892B0]">No intrusion attempts or anomalous behavior detected.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {securityAlerts.map(alert => (
                                                    <div key={alert.id} className={`p-5 rounded-xl border transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${alert.resolved ? 'bg-[#0A192F] border-[#233554] opacity-70' : 'bg-[#112240] border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                {!alert.resolved && (
                                                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse">
                                                                        <AlertTriangle size={12}/> HIGH THREAT
                                                                    </span>
                                                                )}
                                                                <span className="text-[#8892B0] text-xs">
                                                                    {alert.timestamp ? new Date(alert.timestamp.toDate()).toLocaleString() : 'Just now'}
                                                                </span>
                                                            </div>
                                                            <h3 className={`font-bold text-lg mb-1 ${alert.resolved ? 'text-[#8892B0]' : 'text-white'}`}>{alert.reason}</h3>
                                                            <p className="text-sm text-[#8892B0]">Target Email/ID: <span className="font-mono text-[#CCD6F6]">{alert.userId}</span></p>
                                                        </div>
                                                        
                                                        <div className="w-full md:w-auto mt-2 md:mt-0">
                                                            {alert.resolved ? (
                                                                <div className="flex items-center gap-2 text-green-500 font-bold text-sm px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20 w-fit">
                                                                    <CheckCircle size={16}/> Resolved
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => resolveAlert(alert.id, alert.reason)} className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition-colors shadow-lg">
                                                                    Acknowledge & Resolve
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* --- Section 2: Real-time Activity Logs --- */}
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Activity className="text-blue-500"/> Recent Activity Logs
                                            </h2>
                                        </div>
                                        {activityLogs.length === 0 ? (
                                            <EmptyState icon={<Activity size={48} />} message="No activity recorded yet." />
                                        ) : (
                                            <div className="overflow-x-auto bg-[#0A192F] rounded-xl border border-[#233554]">
                                                <table className="w-full text-left border-collapse min-w-[800px]">
                                                    <thead>
                                                        <tr className="border-b border-[#233554] text-[#8892B0] text-xs uppercase tracking-wider">
                                                            <th className="py-4 px-6 font-medium">Action</th>
                                                            <th className="py-4 px-6 font-medium">User ID / Email</th>
                                                            <th className="py-4 px-6 font-medium">Ext. Details</th>
                                                            <th className="py-4 px-6 font-medium">Time</th>
                                                            <th className="py-4 px-6 font-medium">Device Info</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activityLogs.map(log => {
                                                            // Determine Color Tagging based on action
                                                            let colorClass = "text-gray-400 bg-gray-500/10 border border-gray-500/20";
                                                            let textClass = "text-gray-400";
                                                            
                                                            if (log.action === 'LOGIN') {
                                                                colorClass = "text-green-400 bg-green-500/10 border border-green-500/20";
                                                                textClass = "text-green-400";
                                                            } else if (log.action === 'SIGNUP') {
                                                                colorClass = "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
                                                                textClass = "text-yellow-400";
                                                            } else if (log.action === 'PRODUCT_UPLOADED' || log.action === 'PRODUCT_APPROVED') {
                                                                colorClass = "text-blue-400 bg-blue-500/10 border border-blue-500/20";
                                                                textClass = "text-blue-400";
                                                            }

                                                            return (
                                                                <tr key={log.id} className="border-b border-[#233554]/50 hover:bg-[#112240] transition-colors">
                                                                    <td className="py-3 px-6">
                                                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${colorClass}`}>
                                                                            {log.action}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-3 px-6 text-[#CCD6F6] text-sm font-medium">
                                                                        {log.email || log.userId}
                                                                    </td>
                                                                    <td className="py-3 px-6 text-[#8892B0] text-xs">
                                                                        {log.productName ? `Item: ${log.productName}` : log.reason ? `Reason: ${log.reason}` : '-'}
                                                                    </td>
                                                                    <td className="py-3 px-6 text-[#8892B0] text-xs whitespace-nowrap">
                                                                        {log.timestamp ? new Date(log.timestamp.toDate()).toLocaleString() : 'Just now'}
                                                                    </td>
                                                                    <td className="py-3 px-6 text-[#8892B0] text-[10px] max-w-[150px] truncate" title={log.userAgent}>
                                                                        {log.userAgent || '-'}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#112240] p-6 rounded-2xl border border-[#233554] shadow-lg relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
            {React.cloneElement(icon, { size: 80, className: color })}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-center mb-4 ${color}`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="text-[#8892B0] text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
    </motion.div>
);

const TabButton = ({ active, onClick, icon, children }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-2 ${
            active 
                ? 'bg-[#112240] text-[#D4AF37] border-[#D4AF37] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]' 
                : 'bg-transparent text-[#8892B0] border-transparent hover:text-white hover:bg-[#112240]/50'
        }`}
    >
        {icon} {children}
    </button>
);

const EmptyState = ({ icon, message }) => (
    <div className="text-center py-20 bg-[#0A192F] rounded-xl border border-[#233554] border-dashed">
        <div className="flex justify-center text-[#8892B0] mb-4 opacity-50">{icon}</div>
        <p className="text-[#8892B0] font-medium">{message}</p>
    </div>
);

const ProductCard = ({ product, actions }) => (
    <div className="bg-[#0A192F] rounded-xl overflow-hidden border border-[#233554] group hover:border-[#D4AF37]/50 transition-colors flex flex-col h-full">
        <div className="h-48 w-full overflow-hidden bg-[#112240]">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold truncate pr-2 w-3/4" title={product.name}>{product.name}</h3>
                <span className="text-[#D4AF37] font-bold text-sm">₹{product.price}</span>
            </div>
            <p className="text-[#8892B0] text-xs truncate">Artisan: <span className="text-[#CCD6F6]">{product.artisanName}</span></p>
            <p className="text-[#8892B0] text-xs truncate mb-4">District: <span className="text-[#CCD6F6]">{product.district}</span></p>
            <div className="mt-auto pt-4 border-t border-[#233554]/50 w-full">
                {actions}
            </div>
        </div>
    </div>
);

export default AdminDashboard;
