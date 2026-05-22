import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Global helper to log significant security and system activities directly to Firestore.
 * 
 * @param {string} userId - The Firebase Auth UID
 * @param {string} action - The action constant (e.g. "LOGIN", "SIGNUP")
 * @param {object} metadata - Any additional contextual data (e.g. email, productName)
 */
export const logActivity = async (userId, action, metadata = {}) => {
    try {
        if (!userId) return; // Silent return if undefined to prevent crashes
        
        await addDoc(collection(db, "activityLogs"), {
            userId,
            action,
            ...metadata,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent
        });
    } catch (error) {
        console.error("Failed to log security activity:", error);
    }
};
