import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, Clock, Crown, CheckCircle2, Trophy, Wifi, WifiOff, Redo } from 'lucide-react-native';
import { TRANSLATIONS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useGameData } from '../context/GameDataContext';

const CategorySelectionScreen = ({ navigation }) => {
    const { language } = useLanguage();
    const { categories, isOnline, dataSource } = useGameData();
    const [selectedPack, setSelectedPack] = useState(categories[0]?.id || 'movies');
    const [selectedTime, setSelectedTime] = useState(90);
    const [selectedPassLimit, setSelectedPassLimit] = useState(3);

    const t = TRANSLATIONS[language];

    return (
        <SafeAreaView className="flex-1 bg-game-deep">
            <View className="flex-1 px-4 pt-2 pb-6" >
                {/* Header */}
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => navigation.navigate('Landing')} className="size-10 bg-white/10 rounded-xl items-center justify-center">
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-xl font-black text-white uppercase mr-10">{t.select_pack}</Text>
                    <View className="size-10 items-center justify-center">
                        {isOnline ? (
                            <Wifi color="#4ade80" size={18} />
                        ) : (
                            <WifiOff color="#f87171" size={18} />
                        )}
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-game-yellow/80 mb-2 px-1">{t.available_packs}</Text>

                    <View className="flex-row flex-wrap gap-2 mb-2">
                        {/* Mixed Category Card */}
                        <TouchableOpacity
                            onPress={() => setSelectedPack('mixed_all')}
                            className={`w-[30%] aspect-square rounded-2xl items-center justify-center gap-2 border ${selectedPack === 'mixed_all' ? 'bg-game-yellow/10 border-game-yellow' : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <View className={`size-10 rounded-xl items-center justify-center opacity-80`} style={{ backgroundColor: `#A855F720`, borderColor: `#A855F740`, borderWidth: 1 }}>
                                <Trophy color="#A855F7" size={24} />
                            </View>
                            <Text className="text-[10px] font-bold text-white text-center px-1">
                                {language === 'AZ' ? 'Qarışıq' :
                                    language === 'TR' ? 'Karışık' :
                                        language === 'RU' ? 'Смешанный' : 'Mixed'}
                            </Text>
                            {selectedPack === 'mixed_all' && (
                                <View className="absolute -top-1 -right-1">
                                    <CheckCircle2 color="#F2F20D" size={20} fill="#F2F20D" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {categories.filter(cat => cat.name && cat.name[language]).map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedPack(cat.id)}
                                className={`w-[30%] aspect-square rounded-2xl items-center justify-center gap-2 border ${selectedPack === cat.id ? 'bg-game-yellow/10 border-game-yellow' : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                <View className={`size-10 rounded-xl items-center justify-center opacity-80`} style={{ backgroundColor: `${cat.color}20`, borderColor: `${cat.color}40`, borderWidth: 1 }}>
                                    <Trophy color={cat.color} size={24} />
                                </View>
                                <Text className="text-[10px] font-bold text-white text-center px-1">{cat.name[language]}</Text>
                                {selectedPack === cat.id && (
                                    <View className="absolute -top-1 -right-1">
                                        <CheckCircle2 color="#F2F20D" size={20} fill="#F2F20D" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Time Selection */}
                    <View className="mb-4 -mt-24">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Clock color="#F2F20D" size={18} />
                            <Text className="text-sm font-black text-white uppercase tracking-wider">{t.select_time}</Text>
                        </View>
                        <View className="flex-row h-12 bg-white/5 rounded-2xl p-1 border border-white/10">
                            {[60, 90, 120].map((timeVal) => (
                                <TouchableOpacity
                                    key={timeVal}
                                    onPress={() => setSelectedTime(timeVal)}
                                    className={`flex-1 items-center justify-center rounded-xl ${selectedTime === timeVal ? 'bg-game-yellow' : ''}`}
                                >
                                    <Text className={`text-sm font-black ${selectedTime === timeVal ? 'text-game-deep' : 'text-white/50'}`}>{timeVal}s</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Pass Limit Selection */}
                    <View className="mb-6">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Redo color="#F2F20D" size={18} />
                            <Text className="text-sm font-black text-white uppercase tracking-wider">Pass Limit</Text>
                        </View>
                        <View className="flex-row h-12 bg-white/5 rounded-2xl p-1 border border-white/10">
                            {[3, 5, '∞'].map((limitVal) => (
                                <TouchableOpacity
                                    key={limitVal}
                                    onPress={() => setSelectedPassLimit(limitVal)}
                                    className={`flex-1 items-center justify-center rounded-xl ${selectedPassLimit === limitVal ? 'bg-game-yellow' : ''}`}
                                >
                                    <Text className={`text-sm font-black ${selectedPassLimit === limitVal ? 'text-game-deep' : 'text-white/50'}`}>{limitVal}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Premium Banner */}
                    <View className="bg-game-yellow rounded-2xl p-4 mb-6 overflow-hidden">
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="size-10 bg-black/10 rounded-xl items-center justify-center">
                                <Crown color="black" size={24} fill="black" />
                            </View>
                            <View className="bg-black/10 px-2 py-0.5 rounded-full">
                                <Text className="text-black text-[8px] font-black tracking-widest uppercase">{t.pro_bundle}</Text>
                            </View>
                        </View>
                        <Text className="text-black text-lg font-black leading-tight">{t.unlock_everything}</Text>
                        <Text className="text-black/70 text-[11px] font-bold mt-0.5 mb-4">{t.unlimited_cat}</Text>
                        <TouchableOpacity className="w-full h-10 bg-black rounded-xl items-center justify-center">
                            <Text className="text-white text-[11px] font-black">{t.get_premium}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Start Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Gameplay', { categoryId: selectedPack, time: selectedTime, passLimit: selectedPassLimit })}
                    className="w-full bg-game-yellow h-16 rounded-full flex-row items-center justify-center gap-2 shadow-xl shadow-yellow-500/40"
                >
                    <Text className="text-game-deep font-black text-xl uppercase tracking-tight">{t.start_game}</Text>
                    <Trophy color="#1A0033" size={26} fill="#1A0033" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CategorySelectionScreen;
