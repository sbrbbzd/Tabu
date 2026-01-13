import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { ArrowLeft, AlertTriangle, Redo, CheckCircle2 } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { TRANSLATIONS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useGameData } from '../context/GameDataContext';

const GamePlayScreen = ({ route, navigation }) => {
    const { categoryId, time, passLimit } = route.params;
    const { language } = useLanguage();
    const { getWordsForCategory, categories } = useGameData();

    const category = categories.find(c => c.id === categoryId);
    const [wordsList, setWordsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wordIndex, setWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(time);
    const [roundWords, setRoundWords] = useState([]);
    const [isGameActive, setIsGameActive] = useState(true);
    const [passesUsed, setPassesUsed] = useState(0);
    const timerRef = useRef(null);

    const t = TRANSLATIONS[language];
    const currentWord = wordsList[wordIndex];

    // Load words from Firebase or offline
    useEffect(() => {
        async function loadWords() {
            setIsLoading(true);
            try {
                const words = await getWordsForCategory(categoryId, language);

                // Shuffle words (Fisher-Yates)
                for (let i = words.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [words[i], words[j]] = [words[j], words[i]];
                }

                setWordsList(words);
            } catch (error) {
                console.error('Error loading words:', error);
                setWordsList([]);
            } finally {
                setIsLoading(false);
            }
        }
        loadWords();
    }, [categoryId, language]);

    // Clear timer when leaving the screen
    useFocusEffect(
        React.useCallback(() => {
            setIsGameActive(true);
            return () => {
                setIsGameActive(false);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }, [])
    );

    // Timer and Game End Logic
    useEffect(() => {
        if (!isGameActive) return;

        if (timeLeft <= 0) {
            navigation.navigate('Results', { score, words: roundWords });
            return;
        }

        timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timeLeft, isGameActive, score, roundWords, navigation]);

    const nextWord = (status) => {
        if (!currentWord) return;

        setRoundWords(prev => [...prev, { ...currentWord, status }]);
        setWordIndex(prev => (prev + 1) % wordsList.length);
    };

    const handleCorrect = () => {
        setScore(prev => prev + 1);
        nextWord('correct');
    };

    const handleTaboo = () => {
        setScore(prev => prev - 1);
        nextWord('taboo');
    };

    const handlePass = () => {
        if (passLimit !== '∞' && passesUsed >= passLimit) {
            return;
        }
        setPassesUsed(prev => prev + 1);
        nextWord('pass');
    };

    const handleQuit = () => {
        // Stop the timer and navigate to results
        setIsGameActive(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        navigation.navigate('Results', { score, words: roundWords });
    };

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-game-deep items-center justify-center">
                <ActivityIndicator size="large" color="#F2F20D" />
                <Text className="text-white mt-4">{t.loading || 'Loading...'}</Text>
            </SafeAreaView>
        );
    }

    // No words available
    if (!currentWord || wordsList.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-game-deep items-center justify-center px-6">
                <Text className="text-white text-xl text-center mb-4">No words available</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-game-yellow px-6 py-3 rounded-full"
                >
                    <Text className="text-game-deep font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-game-deep">
            <View className="flex-1 px-4 py-4">
                {/* Header with Timer */}
                <View className="items-center mb-4">
                    <View className="flex-row w-full items-center justify-between mb-4">
                        <TouchableOpacity onPress={handleQuit} className="size-10 bg-white/10 rounded-xl items-center justify-center">
                            <ArrowLeft color="white" size={24} />
                        </TouchableOpacity>
                        <View className="size-10" />
                    </View>

                    {/* SVG Timer Circle */}
                    <View className="relative items-center justify-center">
                        <Svg width={80} height={80} style={{ transform: [{ rotate: '-90deg' }] }}>
                            <Circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="transparent"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={4}
                            />
                            <Circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="transparent"
                                stroke="#F2F20D"
                                strokeWidth={4}
                                strokeDasharray={2 * Math.PI * 34}
                                strokeDashoffset={2 * Math.PI * 34 * (1 - timeLeft / time)}
                                strokeLinecap="round"
                            />
                        </Svg>
                        <View className="absolute inset-0 items-center justify-center">
                            <Text className="text-2xl font-black text-white leading-none">{timeLeft}</Text>
                            <Text className="text-[10px] uppercase font-bold text-white/60">{t.sec}</Text>
                        </View>
                    </View>
                </View>

                {/* Card */}
                <View className="flex-1 items-center justify-center">
                    <View className="w-full bg-white rounded-[32px] p-6 items-center shadow-2xl shadow-black/30">
                        <Text className="text-gray-400 text-[9px] font-black tracking-[3px] uppercase mb-2">{t.current_word}</Text>
                        <Text className="text-4xl font-black text-game-deep text-center mb-4 tracking-tight">{currentWord.target}</Text>

                        <View className="w-full h-[1px] bg-gray-200 mb-4" />

                        <Text className="text-gray-400 text-[8px] font-black tracking-[2px] uppercase mb-3">{t.taboo_words}</Text>
                        <View className="w-full gap-2">
                            {currentWord.taboo.map((w, i) => (
                                <View key={i} className="bg-gray-100 py-3 rounded-xl items-center">
                                    <Text className="text-game-deep text-lg font-bold">{w}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3 pt-4 pb-2">
                    <TouchableOpacity
                        onPress={handleTaboo}
                        className="flex-1 h-20 bg-white/10 rounded-3xl items-center justify-center border border-white/20"
                    >
                        <AlertTriangle color="#f87171" size={24} />
                        <Text className="text-game-red text-[12px] font-black tracking-wider mt-1">{t.taboo}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlePass}
                        activeOpacity={passLimit !== '∞' && passesUsed >= passLimit ? 1 : 0.7}
                        className={`flex-1 h-20 rounded-3xl items-center justify-center border border-white/20 ${passLimit !== '∞' && passesUsed >= passLimit ? 'bg-white/5 opacity-50' : 'bg-white/10'}`}
                    >
                        <Redo color="#60a5fa" size={24} />
                        <Text className="text-game-blue text-[12px] font-black tracking-wider mt-1">
                            {t.pass} {passLimit !== '∞' ? `(${passesUsed}/${passLimit})` : ''}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleCorrect}
                        className="flex-1 h-20 bg-white/10 rounded-3xl items-center justify-center border border-white/20"
                    >
                        <CheckCircle2 color="#4ade80" size={24} />
                        <Text className="text-game-green text-[12px] font-black tracking-wider mt-1">{t.correct}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default GamePlayScreen;
