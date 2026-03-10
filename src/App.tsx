/**
 * @file App.tsx
 * @description Główny komponent aplikacji "Ile mnie to kosztuje pracy?".
 * Odpowiada za logikę obliczeń, zarządzanie stanem oraz renderowanie interfejsu użytkownika.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Clock, 
  Home, 
  ShoppingCart, 
  TrendingDown, 
  Calendar, 
  Info,
  ArrowRight,
  Zap,
  Plus,
  Minus,
  Volume2,
  VolumeX
} from 'lucide-react';
import backgroundAudioFile from '/Breath In Slow Waves.mp3';

/**
 * Komponent przycisku z obsługą długiego naciśnięcia.
 * Umożliwia automatyczną inkrementację/dekrementację przy przytrzymaniu.
 */
const LongPressButton = ({ 
  onClick, 
  children, 
  className 
}: { 
  onClick: () => void, 
  children: React.ReactNode, 
  className?: string 
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Rozpoczyna proces naciśnięcia przycisku.
   * Wykonuje natychmiastową akcję i ustawia timer dla długiego naciśnięcia.
   */
  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Reaguj tylko na główny przycisk myszy
    if ('button' in e && e.button !== 0) return;
    
    // Zapobiegaj domyślnym zachowaniom przeglądarki (np. zaznaczaniu tekstu)
    if (e.cancelable) e.preventDefault();

    // Wykonaj akcję natychmiast po kliknięciu
    onClick();

    // Ustaw opóźnienie przed rozpoczęciem automatycznego powtarzania (1 sekunda)
    timerRef.current = setTimeout(() => {
      // Rozpocznij interwał powtarzania akcji co 50ms
      intervalRef.current = setInterval(() => {
        onClick();
      }, 50);
    }, 1000);
  };

  /**
   * Kończy proces naciśnięcia przycisku i czyści timery.
   */
  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Czyść timery przy odmontowaniu komponentu
  useEffect(() => {
    return () => endPress();
  }, []);

  return (
    <button
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      className={`${className} select-none touch-none`}
      type="button"
    >
      {children}
    </button>
  );
};

export default function App() {
  // Stan aplikacji: wynagrodzenie, godziny pracy, koszty stałe i cena przedmiotu
  const [salary, setSalary] = useState<number>(5000);
  const [hours, setHours] = useState<number>(160);
  const [fixedCosts, setFixedCosts] = useState<number>(3000);
  const [itemPrice, setItemPrice] = useState<number>(1200);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [theme, setTheme] = useState<'default' | 'light' | 'dark' | 'contrast'>('default');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(backgroundAudioFile);
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  /**
   * Obliczenia statystyk na podstawie wprowadzonych danych.
   * Wykorzystuje useMemo dla optymalizacji wydajności.
   */
  const stats = useMemo(() => {
    // Oblicz oszczędności (nadwyżkę finansową)
    const savings = Math.max(0, salary - fixedCosts);
    // Oblicz realną stawkę godzinową (ile zarabiasz "na czysto" na godzinę)
    const realHourlyRate = hours > 0 ? savings / hours : 0;
    // Oblicz ile godzin pracy potrzeba na zakup przedmiotu
    const hoursNeeded = realHourlyRate > 0 ? itemPrice / realHourlyRate : 0;
    // Przelicz godziny na pełne dni robocze (zakładając 8h dziennie)
    const daysNeeded = hoursNeeded / 8;
    // Oblicz jaki procent miesięcznych oszczędności pochłonie zakup
    const percentageOfSavings = savings > 0 ? (itemPrice / savings) * 100 : 0;

    return {
      savings,
      realHourlyRate,
      hoursNeeded,
      daysNeeded,
      percentageOfSavings
    };
  }, [salary, hours, fixedCosts, itemPrice]);

  /**
   * Pomocniczy komponent do renderowania przycisków sterujących +/-
   */
  const InputControls = ({ onDecrement, onIncrement }: { onDecrement: () => void, onIncrement: () => void }) => (
    <div className="flex gap-2 mt-2">
      <LongPressButton 
        onClick={onDecrement}
        className="flex-1 flex justify-center items-center py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-700/50"
      >
        <Minus size={14} />
      </LongPressButton>
      <LongPressButton 
        onClick={onIncrement}
        className="flex-1 flex justify-center items-center py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-700/50"
      >
        <Plus size={14} />
      </LongPressButton>
    </div>
  );

  return (
    <div className={`min-h-screen theme-${theme} transition-colors duration-300`}>
      <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
        {/* Nagłówek aplikacji */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4"
            >
              <Zap size={14} />
              <span>Świadome kupowanie</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Ile mnie to kosztuje <span className="text-emerald-500 italic">pracy?</span>
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-1 p-1 rounded-lg bg-zinc-900/50 border border-zinc-800">
              {[
                { id: 'default', label: 'Domyślny' },
                { id: 'light', label: 'Jasny' },
                { id: 'dark', label: 'Ciemny' },
                { id: 'contrast', label: 'Kontrast' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    theme === t.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button 
              onClick={toggleAudio}
              className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors border border-zinc-700/50"
            >
              {isAudioPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </header>

      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sekcja formularza - wprowadzanie danych */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Wallet className="text-emerald-500" size={20} />
              Twoje finanse
            </h2>
            
            <div className="space-y-5">
              {/* Pole: Wynagrodzenie */}
              <div>
                <label className="label-text">Wynagrodzenie netto (miesięcznie)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={salary} 
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="input-field pl-10 text-right"
                    placeholder="np. 5000"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">zł</span>
                </div>
                <InputControls 
                  onDecrement={() => setSalary(prev => Math.max(0, prev - 100))} 
                  onIncrement={() => setSalary(prev => prev + 100)} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Pole: Godziny pracy */}
                <div>
                  <label className="label-text">Godziny pracy</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={hours} 
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="input-field pl-10 text-right"
                      placeholder="160"
                    />
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  </div>
                  <InputControls 
                    onDecrement={() => setHours(prev => Math.max(0, prev - 1))} 
                    onIncrement={() => setHours(prev => prev + 1)} 
                  />
                </div>
                {/* Pole: Koszty stałe */}
                <div>
                  <label className="label-text">Koszty stałe</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={fixedCosts} 
                      onChange={(e) => setFixedCosts(Number(e.target.value))}
                      className="input-field pl-10 text-right"
                      placeholder="np. 3000"
                    />
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  </div>
                  <InputControls 
                    onDecrement={() => setFixedCosts(prev => Math.max(0, prev - 100))} 
                    onIncrement={() => setFixedCosts(prev => prev + 100)} 
                  />
                </div>
              </div>

              {/* Pole: Cena przedmiotu */}
              <div className="pt-4 border-t border-zinc-800">
                <label className="label-text">Cena przedmiotu</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={itemPrice} 
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="input-field pl-10 border-emerald-500/30 text-right"
                    placeholder="np. 1200"
                  />
                  <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                </div>
                <InputControls 
                  onDecrement={() => setItemPrice(prev => Math.max(0, prev - 100))} 
                  onIncrement={() => setItemPrice(prev => prev + 100)} 
                />
              </div>
            </div>
          </div>

          {/* Podsumowanie stawki godzinowej */}
          <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/10">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 h-fit">
                <TrendingDown size={24} />
              </div>
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">Realna stawka godzinowa</h3>
                <p className="text-3xl font-bold tracking-tight">
                  {stats.realHourlyRate.toFixed(2)} <span className="text-sm font-normal text-zinc-500">zł / h</span>
                </p>
                <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                  <Info size={12} />
                  Po odjęciu kosztów życia zostaje Ci {stats.savings} zł miesięcznie.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sekcja Dashboardu - wyniki i wizualizacje */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="glass-card p-8 h-full flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-1">Wynik analizy</h2>
                <p className="text-analysis-subtitle">Koszt zakupu wyrażony w czasie</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Wartość</p>
                <p className="text-2xl font-bold text-emerald-500">{itemPrice} zł</p>
              </div>
            </div>

            {/* Główne liczniki czasu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-zinc-400">
                  <Clock size={20} />
                  <span className="text-sm font-medium uppercase tracking-wider">Godziny pracy</span>
                </div>
                <p className="text-5xl font-bold tracking-tighter">
                  {Math.round(stats.hoursNeeded)}
                </p>
                <p className="text-zinc-500 mt-1 text-sm">godzin netto</p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-zinc-400">
                  <Calendar size={20} />
                  <span className="text-sm font-medium uppercase tracking-wider">Dni robocze</span>
                </div>
                <p className="text-5xl font-bold tracking-tighter">
                  {stats.daysNeeded.toFixed(1)}
                </p>
                <p className="text-zinc-500 mt-1 text-sm">pełnych dni (8h)</p>
              </div>
            </div>

            {/* Dynamiczna wizualizacja: Kalendarz lub Widok Roczny */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  {stats.daysNeeded > 20 ? 'Roczny Widok Zaangażowania' : 'Kalendarz Czasu do Zakupu'}
                </h3>
                <span className="text-xs text-zinc-500">
                  {stats.daysNeeded > 20 ? 'Perspektywa roczna' : 'Dni robocze (Pn-Pt)'}
                </span>
              </div>
              
              <div className="glass-card p-6 bg-zinc-950/50">
                <div className="mb-6">
                  <p className="text-lg font-medium text-zinc-200">
                    Będziesz posiadać ten przedmiot po przepracowaniu <span className={`${stats.daysNeeded > 20 ? 'text-violet-500' : 'text-emerald-500'} font-bold`}>{Math.ceil(stats.daysNeeded)}</span> dni roboczych.
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {stats.daysNeeded > 20 
                      ? `To około ${(stats.daysNeeded / 21).toFixed(1)} miesiąca Twojej pracy.`
                      : `Startując od dzisiaj (${new Date().toLocaleDateString('pl-PL')})`}
                  </p>
                </div>

                {/* Widok Kalendarza (dla krótkich okresów) */}
                {stats.daysNeeded <= 20 ? (
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => (
                      <div key={day} className="text-[10px] font-bold text-zinc-600 uppercase">{day}</div>
                    ))}
                    {(() => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = now.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      
                      const offset = firstDay === 0 ? 6 : firstDay - 1;
                      
                      const days = [];
                      for (let i = 0; i < offset; i++) {
                        days.push(<div key={`empty-${i}`} />);
                      }

                      let workDaysCounted = 0;
                      const targetWorkDays = Math.ceil(stats.daysNeeded);
                      const today = now.getDate();

                      for (let d = 1; d <= daysInMonth; d++) {
                        const date = new Date(year, month, d);
                        const isWorkDay = date.getDay() !== 0 && date.getDay() !== 6;
                        const isPast = d < today;
                        const isToday = d === today;
                        
                        let isHighlighted = false;
                        if (!isPast && isWorkDay && workDaysCounted < targetWorkDays) {
                          isHighlighted = true;
                          workDaysCounted++;
                        }

                        days.push(
                          <div 
                            key={d} 
                            className={`
                              aspect-square flex items-center justify-center rounded-lg text-xs transition-all border
                              ${isToday ? 'border-emerald-500/50' : 'border-transparent'}
                              ${isHighlighted ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-400' : 
                                isPast ? 'text-zinc-700 opacity-30' : 
                                isWorkDay ? 'bg-zinc-900 text-zinc-400 border-zinc-800' : 'bg-zinc-950 text-zinc-800 border-zinc-900'}
                            `}
                          >
                            {d}
                          </div>
                        );
                      }
                      return days;
                    })()}
                  </div>
                ) : (
                  /* Widok Roczny (dla długich okresów) */
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'].map((monthName, idx) => {
                      const workDaysPerMonth = 21; // Średnia liczba dni roboczych
                      const totalMonthsNeeded = stats.daysNeeded / workDaysPerMonth;
                      const fillLevel = Math.min(1, Math.max(0, totalMonthsNeeded - idx));
                      
                      return (
                        <div key={monthName} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">{monthName}</span>
                            {fillLevel > 0 && (
                              <span className="text-[9px] text-violet-400 font-mono">{(fillLevel * 100).toFixed(0)}%</span>
                            )}
                          </div>
                          <div className="h-12 w-full bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden relative">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${fillLevel * 100}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.05 }}
                              className="absolute bottom-0 left-0 right-0 bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                            />
                            {/* Efekt mikro-siatki wewnątrz kafelka miesiąca */}
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-px opacity-20">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="border-b border-r border-zinc-700" />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Dodatkowa informacja o skali rocznej */}
                {stats.daysNeeded > 20 && stats.daysNeeded <= 252 && (
                  <div className="mt-6 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-400 flex items-center gap-2">
                    <Info size={14} />
                    <span>Ten zakup pochłonie około {( (stats.daysNeeded / 252) * 100 ).toFixed(1)}% Twojego rocznego czasu pracy.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sekcja Wolnych Środków i Pasek Postępu */}
            <div className="mt-auto space-y-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Wolne środki</h3>
                  <span className="text-lg font-bold text-zinc-200">
                    {stats.percentageOfSavings > 100 ? '>100' : stats.percentageOfSavings.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, stats.percentageOfSavings)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      stats.percentageOfSavings > 100 ? 'bg-red-500' : 
                      stats.percentageOfSavings > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <p className="text-sm text-zinc-500 mt-3">
                  Ten zakup pochłonie <span className="text-zinc-300 font-medium">{stats.percentageOfSavings.toFixed(1)}%</span> Twoich miesięcznych oszczędności.
                </p>
              </div>

              {/* Zachęta do refleksji */}
              <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-zinc-400">Czy warto poświęcić tyle czasu?</span>
                </div>
                <ArrowRight className="text-zinc-600 group-hover:text-emerald-500 transition-colors" size={18} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="mt-20 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
      </footer>
    </div>
  );
}
