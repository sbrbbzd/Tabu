import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import { Play, BookOpen, Settings, Ban, User, ChevronRight, BarChart2, Share2, Gift, Globe, Check } from 'lucide-react-native';
import { TRANSLATIONS } from '../data/mockData';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

import { useLanguage } from '../context/LanguageContext';

const LandingScreen = ({ navigation }) => {
    const { language, setLanguage } = useLanguage();
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const t = TRANSLATIONS[language];

    const languages = [
        { id: 'AZ', label: 'Azərbaycan', code: 'AZ' },
        { id: 'EN', label: 'English', code: 'EN' },
        { id: 'TR', label: 'Türkçe', code: 'TR' },
        { id: 'RU', label: 'Русский', code: 'RU' }
    ];

    return (
        <SafeAreaView className="flex-1 bg-game-deep">
            <StatusBar style="light" />

            <StyledView className="flex-1 px-6 justify-between py-10">
                {/* Logo Section */}
                <StyledView className="items-center mt-20">
                    <StyledView className="relative mb-12">
                        <StyledText className="text-game-yellow text-[64px] font-black leading-tight text-center italic tracking-tighter">
                            TABOO
                        </StyledText>
                        <StyledText className="text-white text-[64px] font-black leading-tight text-center italic tracking-tighter mt-[-20px] opacity-50">
                            FUN
                        </StyledText>
                        <StyledView className="absolute -top-4 -right-4 bg-white px-2 py-1 rounded-full">
                            <StyledText className="text-game-deep text-[8px] font-bold uppercase tracking-tighter">
                                {t.pro_bundle}
                            </StyledText>
                        </StyledView>
                    </StyledView>

                    {/* Main CTA */}
                    <StyledTouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Selection')}
                        className="w-full h-20 bg-game-yellow rounded-full flex-row items-center justify-center shadow-xl shadow-yellow-500/40"
                    >
                        <Play color="#1A0033" size={32} fill="#1A0033" />
                        <StyledText className="text-game-deep text-2xl font-black ml-3 tracking-tight">{t.start_game}</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>

                {/* Secondary Actions */}
                <StyledView className="gap-4 mt-20">
                    <StyledTouchableOpacity
                        onPress={() => setShowLanguageModal(true)}
                        className="flex-row items-center justify-between w-full h-14 px-6 bg-white/5 border border-white/5 rounded-full"
                    >
                        <StyledView className="flex-row items-center">
                            <Globe color="#f2f20d" size={20} />
                            <StyledText className="text-white font-semibold ml-3">
                                {language === 'AZ' ? 'Dil: Azərbaycan' : language === 'EN' ? 'Language: English' : language === 'TR' ? 'Dil: Türkçe' : 'Язык: Русский'}
                            </StyledText>
                        </StyledView>
                        <ChevronRight color="rgba(255,255,255,0.3)" size={20} />
                    </StyledTouchableOpacity>

                    <StyledTouchableOpacity className="flex-row items-center justify-between w-full h-14 px-6 bg-white/5 border border-white/5 rounded-full">
                        <StyledView className="flex-row items-center">
                            <BookOpen color="#f2f20d" size={20} />
                            <StyledText className="text-white font-semibold ml-3">{t.how_to_play}</StyledText>
                        </StyledView>
                        <ChevronRight color="rgba(255,255,255,0.3)" size={20} />
                    </StyledTouchableOpacity>

                    <StyledTouchableOpacity className="flex-row items-center justify-center w-full h-14 px-6 bg-transparent border border-white/10 rounded-full">
                        <Ban color="rgba(255,255,255,0.6)" size={16} />
                        <StyledText className="text-white/60 font-semibold text-sm uppercase ml-2 tracking-wider">{t.remove_ads}</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>

                {/* Bottom Nav */}
                <StyledView className="items-center gap-6">
                    <StyledView className="flex-row gap-8">
                        <BarChart2 color="rgba(255,255,255,0.4)" size={24} />
                        <Share2 color="rgba(255,255,255,0.4)" size={24} />
                        <Gift color="rgba(255,255,255,0.4)" size={24} />
                    </StyledView>
                    <StyledView className="w-32 h-1 bg-white/10 rounded-full" />
                </StyledView>
            </StyledView>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <StyledView className="flex-1 bg-black/60 items-center justify-center px-6">
                    <StyledView className="w-full bg-game-deep border border-white/10 rounded-[40px] p-6 shadow-2xl">
                        <StyledText className="text-game-yellow text-xl font-black mb-6 text-center tracking-widest uppercase">
                            {t.select_language}
                        </StyledText>

                        <StyledView className="gap-3">
                            {languages.map((lang) => (
                                <StyledTouchableOpacity
                                    key={lang.id}
                                    onPress={() => {
                                        setLanguage(lang.id);
                                        setShowLanguageModal(false);
                                    }}
                                    className={`flex-row items-center justify-between h-16 px-6 rounded-3xl border ${language === lang.id ? 'bg-game-yellow border-game-yellow' : 'bg-white/5 border-white/10'}`}
                                >
                                    <StyledView className="flex-row items-center">
                                        <StyledText className={`text-lg font-bold ${language === lang.id ? 'text-game-deep' : 'text-white'}`}>
                                            {lang.label}
                                        </StyledText>
                                    </StyledView>
                                    {language === lang.id && <Check color="#1A0033" size={24} />}
                                </StyledTouchableOpacity>
                            ))}
                        </StyledView>

                        <StyledTouchableOpacity
                            onPress={() => setShowLanguageModal(false)}
                            className="mt-8 h-12 items-center justify-center"
                        >
                            <StyledText className="text-white/40 font-bold uppercase tracking-widest text-xs">
                                {t.close}
                            </StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>
            </Modal>
        </SafeAreaView>
    );
};

export default LandingScreen;
