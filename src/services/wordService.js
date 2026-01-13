import { collection, getDocs, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase';
import { CATEGORIES as OFFLINE_CATEGORIES, TRANSLATIONS } from '../data/mockData';

const CACHE_KEY_CATEGORIES = '@taboo_categories';
const CACHE_KEY_WORDS = '@taboo_words';

// Fetch categories from Firebase
export async function fetchCategoriesFromFirebase() {
    try {
        const snapshot = await getDocs(collection(db, 'categories'));
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Cache the data
        await AsyncStorage.setItem(CACHE_KEY_CATEGORIES, JSON.stringify(categories));

        return categories;
    } catch (error) {
        console.error('Error fetching categories from Firebase:', error);
        throw error;
    }
}

// Fetch words from Firebase
export async function fetchWordsFromFirebase(categoryId = null) {
    try {
        let q = collection(db, 'words');
        if (categoryId) {
            q = query(q, where('categoryId', '==', categoryId));
        }

        const snapshot = await getDocs(q);
        const words = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Cache the data
        const cacheKey = categoryId ? `${CACHE_KEY_WORDS}_${categoryId}` : CACHE_KEY_WORDS;
        await AsyncStorage.setItem(cacheKey, JSON.stringify(words));

        return words;
    } catch (error) {
        console.error('Error fetching words from Firebase:', error);
        throw error;
    }
}

// Get cached categories
export async function getCachedCategories() {
    try {
        const cached = await AsyncStorage.getItem(CACHE_KEY_CATEGORIES);
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
}

// Get cached words
export async function getCachedWords(categoryId = null) {
    try {
        const cacheKey = categoryId ? `${CACHE_KEY_WORDS}_${categoryId}` : CACHE_KEY_WORDS;
        const cached = await AsyncStorage.getItem(cacheKey);
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
}

// Get categories (with fallback logic)
export async function getCategories(isOnline) {
    let categories = [];
    if (isOnline) {
        try {
            categories = await fetchCategoriesFromFirebase();
        } catch {
            // Try cache first, then fall back to offline data
            const cached = await getCachedCategories();
            if (cached) categories = cached;
        }
    } else {
        // Offline - try cache first
        const cached = await getCachedCategories();
        if (cached) categories = cached;
    }

    // Default to offline data if nothing found
    if (!categories || categories.length === 0) {
        categories = OFFLINE_CATEGORIES;
    }

    // Filter out passive categories
    return categories.filter(c => c.isActive !== false);
}

// Get words for a category (with fallback logic)
export async function getWords(categoryId, language, isOnline) {
    let words = [];
    const isMixed = categoryId === 'mixed_all';

    if (isOnline) {
        try {
            if (isMixed) {
                // Fetch ALL words
                words = await fetchWordsFromFirebase(null);
            } else {
                words = await fetchWordsFromFirebase(categoryId);
            }
        } catch {
            // Try cache first
            if (isMixed) {
                // For mixed, we need to iterate or fetch all cached words
                // Simplified: try fetching all words cache if structure supports it, or iterate active categories
                const activeCategories = await getCategories(false); // get cached/offline active cats
                let allWords = [];
                for (const cat of activeCategories) {
                    const catWords = await getCachedWords(cat.id);
                    if (catWords) allWords = [...allWords, ...catWords];
                }
                words = allWords;
            } else {
                words = await getCachedWords(categoryId);
            }
        }
    } else {
        // Offline
        if (isMixed) {
            const activeCategories = await getCategories(false);
            let allWords = [];
            for (const cat of activeCategories) {
                const catWords = await getCachedWords(cat.id);
                if (catWords) allWords = [...allWords, ...catWords];

                // Fallback to offline data if cache missing for a category
                if (!catWords) {
                    const offlineCat = OFFLINE_CATEGORIES.find(c => c.id === cat.id);
                    if (offlineCat?.words) { // OFFLINE_CATEGORIES structure is { words: { EN: [...], ... } }
                        // We need to flatten the offline structure to match firebase format temporarily or just process it later
                        // The formatting logic below expects { target: {EN:...}, taboo: {EN:...} } structure usually found in Firebase
                        // BUT OFFLINE_CATEGORIES has words: { EN: [{target, taboo}], ... }
                        // This complexity suggests we should rely on what we have.
                        // Let's stick to the consistent return format.
                    }
                }
            }
            words = allWords.length > 0 ? allWords : null;
        } else {
            words = await getCachedWords(categoryId);
        }
    }

    // If still no words (and not mixed), try offline fallback specific category
    if ((!words || words.length === 0) && !isMixed) {
        const offlineCategory = OFFLINE_CATEGORIES.find(c => c.id === categoryId);
        // Transform offline data directly to return format since it doesn't need detailed filtering
        return offlineCategory?.words[language] || [];
    }

    // If mixed and still no words, load from ALL offline categories
    if ((!words || words.length === 0) && isMixed) {
        let allOfflineWords = [];
        // Filter OFFLINE_CATEGORIES that are effectively "active" (assuming hardcoded ones are always active)
        OFFLINE_CATEGORIES.forEach(cat => {
            if (cat.words[language]) {
                allOfflineWords = [...allOfflineWords, ...cat.words[language]];
            }
        });
        return allOfflineWords;
    }

    // Filter and Transform
    // For mixed, we also need to ensure we only include words from ACTIVE categories
    if (isMixed) {
        const activeCategories = await getCategories(isOnline);
        const activeCategoryIds = new Set(activeCategories.map(c => c.id));
        words = words.filter(w => activeCategoryIds.has(w.categoryId));
    }

    return words
        .filter(w => w.target && w.target[language] && w.taboo && Array.isArray(w.taboo[language]) && w.taboo[language].length > 0)
        .map(w => ({
            target: w.target[language],
            taboo: w.taboo[language]
        }));
}

// Clear all cached data
export async function clearCache() {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const tabooKeys = keys.filter(k => k.startsWith('@taboo_'));
        await AsyncStorage.multiRemove(tabooKeys);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}
