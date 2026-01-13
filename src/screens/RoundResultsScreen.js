import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, Trophy, CheckCircle2, AlertTriangle, Redo, Play, Share } from 'lucide-react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { TRANSLATIONS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const RoundResultsScreen = ({ route, navigation }) => {
    const { score, words } = route.params;
    const { language } = useLanguage();
    const viewShotRef = useRef();

    const correctWords = words.filter(w => w.status === 'correct');
    const tabooWords = words.filter(w => w.status === 'taboo');
    const skippedWords = words.filter(w => w.status === 'pass');

    const t = TRANSLATIONS[language];

    const handleShare = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                alert("Sharing is not available on this device");
            }
        } catch (error) {
            console.error("Error sharing result:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-game-deep">
            <View className="flex-1 px-4 py-6">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    <TouchableOpacity onPress={() => navigation.navigate('Selection')} className="size-12 items-center justify-start">
                        <ArrowLeft color="white" size={28} />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold">{t.round_results}</Text>
                    <TouchableOpacity onPress={handleShare} className="size-12 items-center justify-center bg-white/10 rounded-xl">
                        <Share color="white" size={20} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
                        <View className="bg-game-deep pb-4">
                            {/* Score Card */}
                            <View className="bg-white/5 rounded-[32px] p-8 items-center border border-white/10 mb-8">
                                <View className="size-16 bg-game-yellow/20 rounded-full items-center justify-center mb-4">
                                    <Trophy color="#F2F20D" size={32} />
                                </View>
                                <Text className="text-white/60 text-xs font-black tracking-[4px] uppercase mb-1">{t.total_score}</Text>
                                <Text className="text-6xl font-black text-white italic">{score}</Text>
                            </View>

                            {/* Stats */}
                            <View className="flex-row gap-3 mb-8">
                                <View className="flex-1 bg-game-green/10 rounded-2xl p-4 border border-game-green/20 items-center">
                                    <CheckCircle2 color="#4ADE80" size={20} />
                                    <Text className="text-white font-black text-xl mt-1">{correctWords.length}</Text>
                                    <Text className="text-white/40 text-[8px] font-bold uppercase tracking-widest">{t.correct}</Text>
                                </View>
                                <View className="flex-1 bg-game-red/10 rounded-2xl p-4 border border-game-red/20 items-center">
                                    <AlertTriangle color="#F87171" size={20} />
                                    <Text className="text-white font-black text-xl mt-1">{tabooWords.length}</Text>
                                    <Text className="text-white/40 text-[8px] font-bold uppercase tracking-widest">{t.taboo}</Text>
                                </View>
                                <View className="flex-1 bg-game-blue/10 rounded-2xl p-4 border border-game-blue/20 items-center">
                                    <Redo color="#60A5FA" size={20} />
                                    <Text className="text-white font-black text-xl mt-1">{skippedWords.length}</Text>
                                    <Text className="text-white/40 text-[8px] font-bold uppercase tracking-widest">{t.pass}</Text>
                                </View>
                            </View>
                        </View>
                    </ViewShot>

                    {/* List */}
                    <Text className="text-[10px] font-black uppercase tracking-widest text-game-yellow/80 mb-4 px-1">{t.round_results}</Text>
                    <View className="gap-3 mb-8">
                        {words.map((word, index) => (
                            <View key={index} className="bg-white/5 rounded-2xl p-4 flex-row items-center justify-between border border-white/5">
                                <View>
                                    <Text className="text-white font-bold text-lg">{word.target}</Text>
                                    <Text className="text-white/30 text-[10px] uppercase font-bold tracking-widest">{word.status}</Text>
                                </View>
                                {word.status === 'correct' ? (
                                    <CheckCircle2 color="#4ADE80" size={20} />
                                ) : word.status === 'taboo' ? (
                                    <AlertTriangle color="#F87171" size={20} />
                                ) : (
                                    <Redo color="#60A5FA" size={20} />
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Actions */}
                <View className="gap-3">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Selection')}
                        className="w-full bg-game-yellow h-16 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg shadow-yellow-500/50"
                    >
                        <Play color="black" size={24} fill="black" />
                        <Text className="text-game-deep text-lg font-black">{t.play_again}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Landing')}
                        className="w-full bg-white/5 h-16 rounded-2xl items-center justify-center border border-white/10"
                    >
                        <Text className="text-white text-lg font-bold">{t.main_menu}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default RoundResultsScreen;
