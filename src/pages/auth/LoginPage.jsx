import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertTriangle } from 'lucide-react';
import { doc, getDoc, collection, addDoc, getDocs, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { logActivity } from '../../utils/security';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Rate Limiting States
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutTimer, setLockoutTimer] = useState(0);

    const { login, logout } = useAuth();
    const navigate = useNavigate();

    // Lockout countdown timer
    useEffect(() => {
        let interval = null;
        if (lockoutTimer > 0) {
            interval = setInterval(() => {
                setLockoutTimer((prev) => prev - 1);
            }, 1000);
        } else if (lockoutTimer === 0 && failedAttempts >= 3) {
            // Reset local strikes after wait
            setFailedAttempts(0);
        }
        return () => clearInterval(interval);
    }, [lockoutTimer, failedAttempts]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent action if rate limited
        if (lockoutTimer > 0) {
            setError(`Too many attempts. Wait ${lockoutTimer} seconds.`);
            return;
        }

        try {
            setError('');
            const userCredential = await login(email, password);
            const user = userCredential; // From AuthContext login mapping

            // Wait to fetch user doc to check role and ban status
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // CRITICAL SECURITY: Log out automatically if they are flagged as banned
                if (userData.isBanned) {
                    await logout();
                    setError("Account suspended due to suspicious activity.");
                    return;
                }

                // Successful login - clear local strikes
                setFailedAttempts(0);
                
                // Log safe login activity
                await logActivity(user.uid, "LOGIN", { email: user.email });

                const role = userData.role;
                if (role === 'admin') navigate('/admin-dashboard');
                else if (role === 'artisan') navigate('/artisan-dashboard');
                else navigate('/shop');
            } else {
                navigate('/shop');
            }
        } catch (err) {
            console.error(err);

            // Handle Local Rate Limiting Step 4
            const newFails = failedAttempts + 1;
            setFailedAttempts(newFails);
            if (newFails >= 3) {
                setLockoutTimer(30);
                setError(`Too many attempts. Wait 30 seconds.`);
            } else {
                if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                    setError('Invalid email or password.');
                } else if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key' || err.code === 'auth/invalid-api-key') {
                    setError('Invalid Firebase API Key. Please check your configuration.');
                } else if (err.code === 'auth/network-request-failed') {
                    setError('Network error. Please check your internet connection.');
                } else {
                    setError('Failed to log in: ' + err.message);
                }
            }

            // Client-Side Intrusion Detection Engine (Part 1)
            try {
                // 1. Log attempt
                await addDoc(collection(db, "failedLogins"), {
                    userId: email,
                    timestamp: serverTimestamp(),
                    userAgent: navigator.userAgent
                });

                // 2. Query last 10 minutes
                const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
                const q = query(
                    collection(db, "failedLogins"),
                    where("userId", "==", email),
                    where("timestamp", ">=", tenMinsAgo)
                );
                const snapshot = await getDocs(q);

                // 3. Execution Threshold Hit!
                if (snapshot.size >= 5) {
                    // Update user to banned
                    const usersRef = collection(db, "users");
                    const uq = query(usersRef, where("email", "==", email));
                    const uSnap = await getDocs(uq);
                    
                    if (!uSnap.empty) {
                        const userTarget = uSnap.docs[0];
                        await updateDoc(doc(db, "users", userTarget.id), { isBanned: true });
                    }

                    // Push Security Alert for Admins
                    await addDoc(collection(db, "securityAlerts"), {
                        userId: email,
                        reason: "5 failed login attempts",
                        severity: "high",
                        timestamp: serverTimestamp(),
                        resolved: false
                    });

                    // Lock screen instantly with max error
                    setError("Account suspended due to suspicious activity.");
                }

            } catch (logErr) {
                console.error("Error managing intrusion engine:", logErr);
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
                    <h2 className="text-3xl font-display font-bold text-[#CCD6F6]">Welcome Back</h2>
                    <p className="text-[#8892B0] mt-2">Sign in to continue your journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center font-bold flex items-center justify-center gap-2">
                        {lockoutTimer > 0 && <AlertTriangle size={16} />}
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={20} />
                            <input
                                type="email"
                                required
                                disabled={lockoutTimer > 0}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 pl-10 pr-4 text-[#CCD6F6] focus:outline-none focus:border-[#64FFDA] transition-colors disabled:opacity-50"
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
                                disabled={lockoutTimer > 0}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0A192F] border border-[#233554] rounded-md py-2 pl-10 pr-4 text-[#CCD6F6] focus:outline-none focus:border-[#64FFDA] transition-colors disabled:opacity-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={lockoutTimer > 0}
                        className="w-full bg-[#64FFDA] hover:bg-[#64FFDA]/90 text-[#0A192F] font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {lockoutTimer > 0 ? (
                            <>
                                <AlertTriangle size={20} />
                                Wait {lockoutTimer}s
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[#8892B0]">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#64FFDA] hover:underline">Sign up</Link>
                </div>
                <div className="mt-2 text-center text-sm text-[#8892B0]">
                    Are you an artisan?{' '}
                    <Link to="/artisan-signup" className="text-[#D4AF37] hover:underline">Join as Artisan</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
