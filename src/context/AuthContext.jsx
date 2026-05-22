import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'user', 'artisan', 'admin'
    const [loading, setLoading] = useState(true);

    // Sign up function
    async function signup(email, password, role, additionalData = {}) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: role,
                ...additionalData,
                createdAt: new Date().toISOString(),
            });

            setUserRole(role);
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Login function
    async function login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Role will be fetched in onAuthStateChanged
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    // Logout function
    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setLoading(true);
                if (user) {
                    // Fetch user role from Firestore
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserRole(userData.role);
                        setCurrentUser({ ...user, ...userData });
                    } else {
                        setCurrentUser(user);
                        setUserRole('user');
                    }
                } else {
                    setCurrentUser(null);
                    setUserRole(null);
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                setUserRole('user'); // Fallback
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[#8892B0] font-display animate-pulse">Initializing ODOP Connect...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
}
