import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import * as wordService from '../services/wordService';
import { CATEGORIES as OFFLINE_CATEGORIES } from '../data/mockData';

const GameDataContext = createContext(null);

export function GameDataProvider({ children }) {
    const { isOnline } = useNetworkStatus();
    const [categories, setCategories] = useState(OFFLINE_CATEGORIES);
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState('offline'); // 'online' | 'cache' | 'offline'

    useEffect(() => {
        loadCategories();
    }, [isOnline]);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const cats = await wordService.getCategories(isOnline);
            setCategories(cats);
            setDataSource(isOnline ? 'online' : 'cache');
        } catch (error) {
            console.log('Using offline categories');
            setCategories(OFFLINE_CATEGORIES);
            setDataSource('offline');
        } finally {
            setIsLoading(false);
        }
    };

    const getWordsForCategory = async (categoryId, language) => {
        try {
            return await wordService.getWords(categoryId, language, isOnline);
        } catch (error) {
            // Fallback to offline data
            const category = OFFLINE_CATEGORIES.find(c => c.id === categoryId);
            return category?.words[language] || [];
        }
    };

    const refreshData = async () => {
        await loadCategories();
    };

    const value = {
        categories,
        isLoading,
        isOnline,
        dataSource,
        getWordsForCategory,
        refreshData
    };

    return (
        <GameDataContext.Provider value={value}>
            {children}
        </GameDataContext.Provider>
    );
}

export function useGameData() {
    const context = useContext(GameDataContext);
    if (!context) {
        throw new Error('useGameData must be used within a GameDataProvider');
    }
    return context;
}
