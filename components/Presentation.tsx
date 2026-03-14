'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Target, 
  MessageSquare, 
  Edit3, 
  ChevronRight, 
  ChevronLeft,
  Layout,
  ListChecks,
  Rocket,
  Users,
  Palette,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Upload,
  Image as ImageIcon,
  FileJson,
  FileCode,
  FileArchive,
  Video,
  Zap,
  Eye,
  BarChart3,
  TrendingUp,
  Activity,
  User,
  Smile,
  PlayCircle,
  ShoppingBag,
  Star,
  HelpCircle,
  Moon,
  Search,
  X,
  Presentation as PresentationIcon,
  Layers,
  Split,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import Link from 'next/link';
import JSZip from 'jszip';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface LessonData {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  objectives: string[];
  message: string;
  teacher: string;
  teacherRole: string;
  email: string;
  logoUrl?: string;
  videoUrl?: string;
  infographicUrl?: string;
  quizUrl?: string;
  claudeSlidesUrl?: string;
}

const steps = [
  // Modulo 1: Piano e Calendario
  { id: 'intro', title: 'Benvenuti', module: 'piano' },
  { id: 'concept', title: 'Piano vs Calendario', module: 'piano' },
  { id: 'visual', title: 'Il Potere del Visual', module: 'piano' },
  { id: 'neuro', title: 'Neuroscienze', module: 'piano' },
  { id: 'identity', title: 'Identità & Social', module: 'piano' },
  { id: 'journey', title: 'Il Viaggio del Cliente', module: 'piano' },
  { id: 'persona', title: 'Buyer Persona', module: 'piano' },
  { id: 'market', title: 'Analisi Mercato (UC 1655)', module: 'piano' },
  { id: 'offer', title: 'Configurazione Offerta (UC 1656)', module: 'piano' },
  { id: 'smart-goals', title: 'Obiettivi SMART', module: 'piano' },
  { id: 'new-content', title: 'Piano e Calendario Editoriale', module: 'piano' },
  { id: 'metrics', title: 'Metriche vs KPI', module: 'piano' },
  { id: 'vanity-insights', title: 'Vanity Metrics & Insights', module: 'piano' },
  { id: 'strategy', title: 'Il Piano Editoriale', module: 'piano' },
  { id: 'rubriche', title: 'Rubriche Creative', module: 'piano' },
  { id: 'calendar', title: 'Il Calendario Operativo', module: 'piano' },
  { id: 'ai-tools', title: 'AI per il Piano Editoriale', module: 'piano' },
  { id: 'competitors', title: 'Analisi Competitor & Insight', module: 'piano' },
  { id: 'youtube-tools', title: 'YouTube & Video Ecosystem', module: 'piano' },
  { id: 'trends-keywords', title: 'Google Trends & Keyword Research', module: 'piano' },
  { id: 'exercise', title: 'Esercitazione', module: 'piano' },
  
  // Modulo 2: Organizzazione Aziendale
  { id: 'org-intro', title: 'Organizzazione Aziendale', module: 'org' },
  { id: 'org-struttura', title: 'Strutture Organizzative', module: 'org' },
  { id: 'org-forme', title: 'Forme Organizzative (Dettaglio)', module: 'org' },
  { id: 'org-organigramma', title: 'L\'Organigramma', module: 'org' },
  { id: 'org-funzioni', title: 'Funzioni e Processi', module: 'org' },
  { id: 'org-cultura', title: 'Cultura e Valori', module: 'org' },

  // Modulo 3: Posizionamento
  { id: 'pos-intro', title: 'Posizionamento: Intro', module: 'pos' },
  { id: 'pos-segm', title: 'Segmentazione', module: 'pos' },
  { id: 'pos-target', title: 'Target Audience', module: 'pos' },
  { id: 'pos-persona', title: 'Buyer Personas', module: 'pos' },
  { id: 'pos-competitors', title: 'Analisi Concorrenza', module: 'pos' },
  { id: 'pos-price', title: 'Strategia: Prezzo', module: 'pos' },
  { id: 'pos-quality', title: 'Strategia: Qualità', module: 'pos' },
  { id: 'pos-lifestyle', title: 'Strategia: Lifestyle', module: 'pos' },
  { id: 'pos-diff', title: 'Strategia: Differenziazione', module: 'pos' },
  { id: 'pos-maps', title: 'Mappe Posizionamento', module: 'pos' },
  { id: 'pos-ex-coke', title: 'Esempio: Coke vs Pepsi', module: 'pos' },
  { id: 'pos-ex-tesla', title: 'Esempio: Tesla', module: 'pos' },
  { id: 'pos-social', title: 'Posizionamento & Social', module: 'pos' },
  { id: 'pos-tov', title: 'Tone of Voice', module: 'pos' },
  { id: 'pos-content', title: 'Content Strategy', module: 'pos' },
  { id: 'pos-ws1', title: 'Workshop: Gap Analysis', module: 'pos' },
  { id: 'pos-ws2', title: 'Workshop: Persona', module: 'pos' },
  { id: 'pos-ws3', title: 'Workshop: Pitch', module: 'pos' },
  { id: 'pos-errors', title: 'Errori Comuni', module: 'pos' },
  { id: 'pos-summary', title: 'Sintesi Finale', module: 'pos' },
];

// --- Initial Data ---
const INITIAL_DATA: LessonData = {
  title: "Marketing in Comunicazione",
  subtitle: "Lecce, Lunedì 2 Marzo 2026/16 Marzo 2026",
  date: "02 Marzo 2026/16 Marzo 2026",
  time: "14:30 - 20:30",
  location: "Forum Lab, Lecce",
  objectives: [
    "Comprendere le fasi di un piano di comunicazione",
    "Configurazione Offerta (UC 1656)",
    "Identificare le nuove regole del marketing digitale",
    "Saper definire obiettivi SMART e KPI",
    "Utilizzare l'AI per l'ottimizzazione dei processi"
  ],
  message: "Come trasformiamo un sogno in un segno\ne quel segno in un universo da vivere insieme?\nFinché morte non ci separi?",
  teacher: "Mari Indennitate",
  teacherRole: "aka Veravox",
  email: "veravox@indennitatedigital.it",
  logoUrl: "https://drive.google.com/uc?export=view&id=1PxU_d3N_FDouXPCRTy9HPOGPE0l4kOdI",
  videoUrl: "https://drive.google.com/file/d/1w-KVBVi-hb7qrX-M7cN9zk8HtfLNx3L_/view?usp=sharing",
  infographicUrl: "https://drive.google.com/file/d/1PUlnCGfJxfndwHYrQBtoJf26xUkCIeuA/view?usp=sharing",
  quizUrl: "https://notebooklm.google.com/notebook/b586f8c6-f924-4b4b-a552-81abdcc41d3d?artifactId=50f0331f-9ca3-4894-b052-187506fae9e4",
  claudeSlidesUrl: "https://claude.ai/public/artifacts/46019f78-850b-4c40-b8b1-4068b14ecc74"
};

// --- Components ---

// --- Positioning Module Components ---

const PositioningModule = ({ currentStepId }: { currentStepId: string }) => {
  return (
    <AnimatePresence mode="wait">
      {currentStepId === 'pos-intro' && (
        <motion.div key="pos-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 py-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Modulo 3</div>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-slate-900">Il Posizionamento di Marketing</h2>
            <p className="text-slate-500 text-xl italic">&quot;Se non sei una marca, sei una merce.&quot; — Philip Kotler</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3"><Target className="text-indigo-600" /> Cos&apos;è il Posizionamento?</h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-3"><CheckCircle2 className="text-indigo-500 shrink-0" size={20} /> Lo spazio mentale che occupi nel tuo cliente.</li>
                <li className="flex gap-3"><CheckCircle2 className="text-indigo-500 shrink-0" size={20} /> La ragione per cui scelgono te e non un altro.</li>
                <li className="flex gap-3"><CheckCircle2 className="text-indigo-500 shrink-0" size={20} /> Non è ciò che fai al prodotto, ma ciò che fai alla mente.</li>
              </ul>
            </div>
            <div className="bg-indigo-900 rounded-[32px] p-8 text-white flex flex-col justify-center space-y-4">
              <h4 className="text-xl font-bold text-indigo-300">L&apos;Obiettivo di Oggi</h4>
              <p className="text-indigo-100 leading-relaxed">Impareremo a identificare la vostra <b>Unique Selling Proposition (USP)</b> per smettere di competere solo sul prezzo e iniziare a competere sul valore.</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-segm' && (
        <motion.div key="pos-segm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Users size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">La Segmentazione del Mercato</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { t: "Demografica", d: "Età, genere, reddito, istruzione.", icon: User },
              { t: "Geografica", d: "Nazione, città, clima, densità.", icon: MapPin },
              { t: "Psicografica", d: "Stile di vita, valori, personalità.", icon: Smile },
              { t: "Comportamentale", d: "Abitudini d'uso, fedeltà, benefici.", icon: Activity }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <item.icon className="text-indigo-500" size={24} />
                <h4 className="font-bold text-slate-900">{item.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200">
            <p className="text-slate-600 italic">&quot;Parlare a tutti significa non parlare a nessuno. Segmentare permette di focalizzare il budget dove conta davvero.&quot;</p>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-target' && (
        <motion.div key="pos-target" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Target size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Identificare il Target Audience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Chi è il tuo cliente ideale?</h3>
              <p className="text-slate-600">Il target è il gruppo specifico di persone a cui rivolgi la tua comunicazione. Non è &quot;chiunque abbia i soldi per pagare&quot;, ma chi trae il massimo valore dalla tua offerta.</p>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 text-sm">Target vs Mercato</h4>
                  <p className="text-xs text-indigo-700">Il mercato è l&apos;oceano, il target è il banco di pesci specifico che vuoi pescare.</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6">
              <h4 className="text-xl font-bold text-indigo-400">Strumenti di Analisi</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm"><BarChart3 size={18} className="text-indigo-400" /> Insights dei Social Media</li>
                <li className="flex items-center gap-3 text-sm"><MessageSquare size={18} className="text-indigo-400" /> Sondaggi e Feedback Diretti</li>
                <li className="flex items-center gap-3 text-sm"><TrendingUp size={18} className="text-indigo-400" /> Ricerche di Mercato Online</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-persona' && (
        <motion.div key="pos-persona" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-medium">Le Buyer Personas</h2>
            <p className="text-slate-500">Diamo un volto e un nome ai nostri dati.</p>
          </div>
          <PersonaTemplate />
        </motion.div>
      )}

      {currentStepId === 'pos-competitors' && (
        <motion.div key="pos-competitors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Activity size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Analisi della Concorrenza</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-bold text-indigo-600 uppercase tracking-widest text-xs">Competitor Diretti</h4>
              <p className="text-sm text-slate-600">Vendono lo stesso prodotto allo stesso target. (es. Coca-Cola vs Pepsi)</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-bold text-indigo-600 uppercase tracking-widest text-xs">Competitor Indiretti</h4>
              <p className="text-sm text-slate-600">Risolvono lo stesso problema con prodotti diversi. (es. Cinema vs Netflix)</p>
            </div>
            <div className="bg-indigo-900 p-8 rounded-3xl text-white space-y-4">
              <h4 className="font-bold text-indigo-300 uppercase tracking-widest text-xs">Il &quot;Gap&quot;</h4>
              <p className="text-sm text-indigo-100">Cosa non stanno facendo? Quale bisogno del cliente è ancora insoddisfatto?</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-price' && (
        <motion.div key="pos-price" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><ShoppingBag size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Strategia: Il Prezzo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-indigo-900">Premium vs Convenienza</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900">Lusso/Premium</h4>
                  <p className="text-sm text-slate-500">Focus sull&apos;esclusività e lo status. (es. Apple, Rolex)</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900">Convenienza/Mass Market</h4>
                  <p className="text-sm text-slate-500">Focus sul risparmio e l&apos;accessibilità. (es. IKEA, Ryanair)</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100 flex flex-col justify-center text-center space-y-4">
              <AlertCircle className="mx-auto text-indigo-600" size={48} />
              <h4 className="text-xl font-bold text-indigo-900">Il Rischio della &quot;Terra di Mezzo&quot;</h4>
              <p className="text-indigo-700 italic">&quot;Non essere né carne né pesce disorienta il cliente e distrugge il margine.&quot;</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-quality' && (
        <motion.div key="pos-quality" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Star size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Strategia: La Qualità</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Eccellenza", d: "Materiali superiori e artigianalità.", icon: Palette },
              { t: "Affidabilità", d: "Durata nel tempo e garanzie.", icon: CheckCircle2 },
              { t: "Trasparenza", d: "Certificazioni e filiera controllata.", icon: Eye }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-center">
                <item.icon className="mx-auto text-indigo-500" size={32} />
                <h4 className="font-bold text-slate-900">{item.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-lifestyle' && (
        <motion.div key="pos-lifestyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Smile size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Strategia: Lifestyle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Vendere un&apos;Identità</h3>
              <p className="text-slate-600">Il prodotto non è il fine, ma il mezzo per appartenere a una &quot;tribù&quot;. Vendiamo chi il cliente vuole diventare.</p>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-500"><Zap className="text-indigo-500 shrink-0" size={18} /> Emozioni sopra le caratteristiche tecniche.</li>
                <li className="flex gap-3 text-sm text-slate-500"><Zap className="text-indigo-500 shrink-0" size={18} /> Storytelling visivo potente.</li>
                <li className="flex gap-3 text-sm text-slate-500"><Zap className="text-indigo-500 shrink-0" size={18} /> Community e senso di appartenenza.</li>
              </ul>
            </div>
            <div className="bg-slate-900 rounded-[40px] p-10 text-white text-center space-y-6">
              <h4 className="text-3xl font-black text-indigo-400 italic">&quot;Red Bull ti mette le ali&quot;</h4>
              <p className="text-slate-400">Non vendono una bibita gassata, vendono adrenalina e avventura.</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-diff' && (
        <motion.div key="pos-diff" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Zap size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Strategia: Differenziazione</h2>
          </div>
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-2xl font-bold text-center">Essere &quot;L&apos;unico che...&quot;</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">1</div>
                <h4 className="font-bold">USP</h4>
                <p className="text-xs text-slate-500">Unique Selling Proposition: la tua promessa unica al mercato.</p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">2</div>
                <h4 className="font-bold">Innovazione</h4>
                <p className="text-xs text-slate-500">Fare qualcosa in modo radicalmente diverso dagli altri.</p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">3</div>
                <h4 className="font-bold">Specializzazione</h4>
                <p className="text-xs text-slate-500">Diventare il leader indiscusso di una nicchia specifica.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-maps' && (
        <motion.div key="pos-maps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><BarChart3 size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Le Mappe di Posizionamento</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Visualizzare la Strategia</h3>
              <p className="text-slate-600">Uno strumento grafico per vedere dove si trovano i competitor e dove c&apos;è spazio libero.</p>
              <div className="p-6 bg-indigo-900 rounded-3xl text-white space-y-4">
                <h4 className="font-bold text-indigo-300">Come si legge?</h4>
                <p className="text-sm">Gli assi rappresentano variabili chiave (es. Prezzo e Qualità). I punti sono i brand.</p>
              </div>
            </div>
            <div className="aspect-square bg-white border-2 border-slate-100 rounded-[40px] relative p-10 shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-slate-200" />
                <div className="h-full w-0.5 bg-slate-200" />
              </div>
              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Alta Qualità</span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Bassa Qualità</span>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-400 [writing-mode:vertical-rl] rotate-180">Prezzo Basso</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-400 [writing-mode:vertical-rl]">Prezzo Alto</span>
              
              <div className="absolute top-[20%] right-[20%] w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">BRAND A</div>
              <div className="absolute bottom-[30%] left-[25%] w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold">COMP. 1</div>
              <div className="absolute top-[60%] right-[40%] w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold">COMP. 2</div>
              
              <div className="absolute top-[15%] left-[15%] w-16 h-16 border-2 border-dashed border-emerald-400 rounded-full flex items-center justify-center text-emerald-600 text-[10px] font-black text-center leading-none">SPAZIO<br/>VUOTO</div>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-ex-coke' && (
        <motion.div key="pos-ex-coke" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-medium">Esempi Reali: Coca-Cola vs Pepsi</h2>
            <p className="text-slate-500">Stesso prodotto, mondi opposti.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-600 p-10 rounded-[40px] text-white space-y-6">
              <h3 className="text-4xl font-black italic">Coca-Cola</h3>
              <p className="text-red-100 italic">&quot;Open Happiness&quot;</p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18} /> Felicità e Ottimismo</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18} /> Tradizione e Famiglia</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18} /> Universalità</li>
              </ul>
            </div>
            <div className="bg-blue-700 p-10 rounded-[40px] text-white space-y-6">
              <h3 className="text-4xl font-black italic">Pepsi</h3>
              <p className="text-blue-100 italic">&quot;For the Love of It&quot;</p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18} /> Giovinezza e Ribellione</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18} /> Musica e Pop Culture</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18} /> Sfida allo Status Quo</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-ex-tesla' && (
        <motion.div key="pos-ex-tesla" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><Zap size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Esempi Reali: Tesla</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-black text-slate-900">Non è solo un&apos;auto.</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Tesla non si posiziona come produttore di auto, ma come azienda tecnologica che accelera la transizione energetica.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-1">Target</h4>
                  <p className="text-sm font-bold">Early Adopters</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-1">Valore</h4>
                  <p className="text-sm font-bold">Innovazione</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 aspect-video rounded-[40px] flex items-center justify-center text-white p-10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
              </div>
              <p className="text-2xl font-display italic text-center relative z-10">&quot;Accelerating the world&apos;s transition to sustainable energy.&quot;</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-social' && (
        <motion.div key="pos-social" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><MessageSquare size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Posizionamento & Social Media</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Coerenza Visiva", d: "Colori e stile devono riflettere il tuo posizionamento.", icon: Palette },
              { t: "Scelta Canali", d: "Sii dove si trova il tuo target specifico.", icon: MapPin },
              { t: "Bio Strategica", d: "Dichiara subito chi sei e per chi sei.", icon: Edit3 }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <item.icon className="text-indigo-500" size={28} />
                <h4 className="font-bold text-slate-900">{item.t}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-tov' && (
        <motion.div key="pos-tov" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><MessageSquare size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Tone of Voice (ToV)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">La Voce del Brand</h3>
              <p className="text-slate-600 leading-relaxed">Il ToV è il modo in cui parliamo al nostro pubblico. Deve essere allineato al posizionamento e alla Buyer Persona.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Ceres</p>
                  <p className="text-sm font-bold text-indigo-600 italic">Ironico/Rottura</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Banca d&apos;Italia</p>
                  <p className="text-sm font-bold text-indigo-600 italic">Istituzionale</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-900 rounded-[40px] p-8 text-white flex flex-col justify-center space-y-6">
              <h4 className="text-xl font-bold text-indigo-300">Perché è importante?</h4>
              <p className="text-indigo-100 text-sm leading-relaxed italic">&quot;Il ToV rende il brand umano e riconoscibile anche senza vedere il logo.&quot;</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-content' && (
        <motion.div key="pos-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Layout size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Content Strategy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Educare", d: "Dimostra la tua autorità nel settore.", icon: Lightbulb },
              { t: "Ispirare", d: "Mostra il lifestyle legato al brand.", icon: Star },
              { t: "Rassicurare", d: "Testimonianze e casi studio reali.", icon: CheckCircle2 }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-center">
                <item.icon className="mx-auto text-indigo-500" size={32} />
                <h4 className="font-bold text-slate-900">{item.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-ws1' && (
        <motion.div key="pos-ws1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10 py-10">
          <div className="bg-indigo-900 rounded-[48px] p-10 text-white text-center space-y-8">
            <div className="inline-block px-4 py-1 bg-indigo-500 text-white rounded-full text-xs font-black uppercase tracking-widest">Workshop Parte 1</div>
            <h2 className="text-4xl md:text-5xl font-display font-medium">Analisi del Gap</h2>
            <div className="max-w-2xl mx-auto bg-white/10 p-8 rounded-[32px] text-left space-y-4">
              <p className="text-lg">Scegli un settore (es. pasticceria locale) e mappa i 3 principali competitor su un grafico <b>Prezzo / Innovazione</b>.</p>
              <p className="text-indigo-300 font-bold">Identifica un&apos;area libera: cosa manca in questa città?</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-ws2' && (
        <motion.div key="pos-ws2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10 py-10">
          <div className="bg-indigo-900 rounded-[48px] p-10 text-white text-center space-y-8">
            <div className="inline-block px-4 py-1 bg-indigo-500 text-white rounded-full text-xs font-black uppercase tracking-widest">Workshop Parte 2</div>
            <h2 className="text-4xl md:text-5xl font-display font-medium">Creazione Persona</h2>
            <div className="max-w-2xl mx-auto bg-white/10 p-8 rounded-[32px] text-left space-y-4">
              <p className="text-lg">Crea la Buyer Persona per il tuo nuovo posizionamento. Dagli un nome, un lavoro e un problema specifico che tu risolvi.</p>
              <p className="text-indigo-300 font-bold">Definisci 3 canali social dove questa persona passa il tempo.</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-ws3' && (
        <motion.div key="pos-ws3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10 py-10">
          <div className="bg-indigo-900 rounded-[48px] p-10 text-white text-center space-y-8">
            <div className="inline-block px-4 py-1 bg-indigo-500 text-white rounded-full text-xs font-black uppercase tracking-widest">Workshop Parte 3</div>
            <h2 className="text-4xl md:text-5xl font-display font-medium">Il Pitch di Posizionamento</h2>
            <div className="max-w-2xl mx-auto bg-white/10 p-8 rounded-[32px] text-left space-y-4">
              <p className="text-lg italic">&quot;Siamo gli unici che [fanno X] per [Target Y] affinché [Beneficio Z]&quot;</p>
              <p className="text-indigo-300 font-bold">Scrivi il tuo Elevator Pitch in massimo 20 parole.</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-errors' && (
        <motion.div key="pos-errors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white"><AlertCircle size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Errori Comuni da Evitare</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { t: "Cercare di piacere a tutti", d: "Si finisce per non piacere a nessuno." },
              { t: "Incoerenza", d: "Cambiare posizionamento distrugge la fiducia." },
              { t: "Sottovalutare i competitor", d: "Il mercato non è statico, muoviti." },
              { t: "Promettere e non mantenere", d: "Il posizionamento deve basarsi sulla realtà." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-4 items-start">
                <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 font-bold">!</div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.t}</h4>
                  <p className="text-sm text-slate-500">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {currentStepId === 'pos-summary' && (
        <motion.div key="pos-summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10 py-10">
          <div className="bg-slate-900 rounded-[48px] p-10 md:p-20 text-white text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-medium">Sintesi Finale</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <h4 className="font-bold text-indigo-400 mb-2">Strategia</h4>
                <p className="text-sm text-slate-400">Il posizionamento è una scelta consapevole, non un caso.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <h4 className="font-bold text-indigo-400 mb-2">Esecuzione</h4>
                <p className="text-sm text-slate-400">La coerenza tra ciò che diciamo e ciò che facciamo è tutto.</p>
              </div>
            </div>
            <p className="text-indigo-400 font-display text-2xl italic">&quot;Il tuo brand è ciò che gli altri dicono di te quando non sei nella stanza.&quot; — Jeff Bezos</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OrganizationModule = ({ currentStepId }: { currentStepId: string }) => {
  return (
    <AnimatePresence mode="wait">
      {currentStepId === 'org-intro' && (
        <motion.div key="org-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 py-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Modulo 2</div>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-slate-900">Cenni di Organizzazione Aziendale</h2>
            <p className="text-slate-500 text-xl italic">&quot;L&apos;organizzazione non è un fine, ma un mezzo per rendere produttive le risorse umane.&quot; — Peter Drucker</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3"><Users className="text-emerald-600" /> Cos&apos;è l&apos;Organizzazione?</h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-3"><CheckCircle2 className="text-emerald-500 shrink-0" size={20} /> Coordinamento di persone e risorse.</li>
                <li className="flex gap-3"><CheckCircle2 className="text-emerald-500 shrink-0" size={20} /> Definizione di ruoli, compiti e responsabilità.</li>
                <li className="flex gap-3"><CheckCircle2 className="text-emerald-500 shrink-0" size={20} /> Creazione di valore attraverso processi efficienti.</li>
              </ul>
            </div>
            <div className="bg-emerald-900 rounded-[32px] p-8 text-white flex flex-col justify-center space-y-4">
              <h4 className="text-xl font-bold text-emerald-300">Perché è importante?</h4>
              <p className="text-emerald-100 leading-relaxed">Senza un&apos;organizzazione chiara, anche la migliore strategia di marketing fallisce nell&apos;esecuzione. L&apos;azienda deve funzionare come un organismo sincronizzato.</p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'org-struttura' && (
        <motion.div key="org-struttura" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"><Layout size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Le Strutture Organizzative</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Funzionale", d: "Suddivisa per aree di competenza (Marketing, Produzione, HR). Semplice e chiara.", icon: Target },
              { t: "Divisionale", d: "Suddivisa per prodotti, mercati o clienti. Autonoma e flessibile.", icon: ShoppingBag },
              { t: "A Matrice", d: "Incrocio tra funzioni e progetti. Massima collaborazione, ma complessa.", icon: Activity }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <item.icon className="text-emerald-500" size={24} />
                <h4 className="font-bold text-slate-900">{item.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {currentStepId === 'org-forme' && (
        <motion.div key="org-forme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 py-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"><Layers size={24} /></div>
            <div className="space-y-1">
              <h2 className="text-3xl font-display font-medium">Le 4 Forme Organizzative</h2>
              <p className="text-sm text-slate-500 italic">Scegliere come organizzare la squadra: ogni modello ha un vantaggio e un problema.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. FUNZIONALE */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Target size={20} /></div>
                  <h3 className="font-bold text-lg">1. Funzionale</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full uppercase">Per Competenze</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le persone che fanno la stessa cosa stanno insieme (Marketing, Finanza, Produzione).
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin size={10} /> Esempio: Apple o McDonald&apos;s
                </div>
                <p className="text-[11px] text-slate-500 italic">&quot;Tutti i professori di economia nello stesso dipartimento.&quot;</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-[9px] font-black text-emerald-600 uppercase mb-1">Vantaggio</div>
                  <div className="text-[10px] font-bold text-emerald-800">Super Specializzazione</div>
                </div>
                <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-[9px] font-black text-red-600 uppercase mb-1">Problema</div>
                  <div className="text-[10px] font-bold text-red-800">Silos (Non comunicano)</div>
                </div>
              </div>
            </div>

            {/* 2. DIVISIONALE */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Split size={20} /></div>
                  <h3 className="font-bold text-lg">2. Divisionale</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full uppercase">Per Prodotto/Mercato</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                L&apos;azienda si divide per prodotto (Smartphone, TV) o mercato (Europa, Asia).
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin size={10} /> Esempio: Samsung o IKEA
                </div>
                <p className="text-[11px] text-slate-500 italic">&quot;Ogni divisione funziona come un&apos;azienda a sé.&quot;</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-[9px] font-black text-emerald-600 uppercase mb-1">Vantaggio</div>
                  <div className="text-[10px] font-bold text-emerald-800">Focus sul Cliente</div>
                </div>
                <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-[9px] font-black text-red-600 uppercase mb-1">Problema</div>
                  <div className="text-[10px] font-bold text-red-800">Spreco di Risorse</div>
                </div>
              </div>
            </div>

            {/* 3. A MATRICE */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Activity size={20} /></div>
                  <h3 className="font-bold text-lg">3. A Matrice</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full uppercase">Due Capi</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incrocio tra funzioni e progetti. Una persona risponde a due capi contemporaneamente.
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin size={10} /> Esempio: Philips o Google
                </div>
                <p className="text-[11px] text-slate-500 italic">&quot;A chi devo dire di sì per primo?&quot;</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-[9px] font-black text-emerald-600 uppercase mb-1">Vantaggio</div>
                  <div className="text-[10px] font-bold text-emerald-800">Massima Flessibilità</div>
                </div>
                <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-[9px] font-black text-red-600 uppercase mb-1">Problema</div>
                  <div className="text-[10px] font-bold text-red-800">Confusione Decisionale</div>
                </div>
              </div>
            </div>

            {/* 4. AGILE */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Zap size={20} /></div>
                  <h3 className="font-bold text-lg">4. Agile</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full uppercase">Piccoli Team</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Team piccoli, autonomi e multidisciplinari (Squads) che decidono velocemente.
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin size={10} /> Esempio: Spotify o Netflix
                </div>
                <p className="text-[11px] text-slate-500 italic">&quot;Tante piccole startup dentro l&apos;azienda.&quot;</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-[9px] font-black text-emerald-600 uppercase mb-1">Vantaggio</div>
                  <div className="text-[10px] font-bold text-emerald-800">Decisioni Rapidissime</div>
                </div>
                <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-[9px] font-black text-red-600 uppercase mb-1">Problema</div>
                  <div className="text-[10px] font-bold text-red-800">Caos se l&apos;azienda cresce</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-900 rounded-[32px] text-white text-center">
            <p className="text-sm font-medium italic">
              &quot;Ogni azienda deve trovare il suo equilibrio: troppa gerarchia porta lentezza, troppa libertà porta caos.&quot;
            </p>
          </div>
        </motion.div>
      )}

      {currentStepId === 'org-organigramma' && (
        <motion.div key="org-organigramma" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"><ListChecks size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">L&apos;Organigramma</h2>
          </div>
          <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-200 flex flex-col items-center space-y-8">
            <div className="w-48 p-4 bg-emerald-600 text-white rounded-xl text-center font-bold shadow-lg">Direzione Generale</div>
            <div className="w-1 h-8 bg-slate-300" />
            <div className="grid grid-cols-3 gap-8 w-full">
              <div className="flex flex-col items-center">
                <div className="w-full p-3 bg-white border border-emerald-200 rounded-xl text-center text-sm font-bold text-emerald-700 shadow-sm">Marketing</div>
                <div className="w-px h-6 bg-slate-300" />
                <div className="w-3/4 p-2 bg-slate-100 rounded-lg text-center text-[10px] text-slate-500">Social Media</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full p-3 bg-white border border-emerald-200 rounded-xl text-center text-sm font-bold text-emerald-700 shadow-sm">Produzione</div>
                <div className="w-px h-6 bg-slate-300" />
                <div className="w-3/4 p-2 bg-slate-100 rounded-lg text-center text-[10px] text-slate-500">Logistica</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full p-3 bg-white border border-emerald-200 rounded-xl text-center text-sm font-bold text-emerald-700 shadow-sm">Amministrazione</div>
                <div className="w-px h-6 bg-slate-300" />
                <div className="w-3/4 p-2 bg-slate-100 rounded-lg text-center text-[10px] text-slate-500">Contabilità</div>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm italic">L&apos;organigramma rende visibile l&apos;invisibile: la gerarchia e i flussi di comunicazione.</p>
        </motion.div>
      )}

      {currentStepId === 'org-funzioni' && (
        <motion.div key="org-funzioni" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"><Zap size={24} /></div>
            <h2 className="text-3xl md:text-4xl font-display font-medium">Funzioni e Processi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Le Funzioni (Verticali)</h3>
              <p className="text-sm text-slate-500">Raggruppano competenze simili. Sono i &quot;silos&quot; specialistici dell&apos;azienda.</p>
              <div className="space-y-2">
                {["Ricerca e Sviluppo", "Marketing e Vendite", "Operations", "Risorse Umane"].map((f, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl text-sm font-medium flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" /> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">I Processi (Orizzontali)</h3>
              <p className="text-sm text-slate-500">Attraversano le funzioni per consegnare valore al cliente finale.</p>
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  <span>Input</span>
                  <span>Valore</span>
                  <span>Output</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-10 bg-white rounded-lg border border-emerald-200 flex items-center justify-center text-xs font-bold">Ordine</div>
                  <ChevronRight className="text-emerald-300" />
                  <div className="flex-1 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">Produzione</div>
                  <ChevronRight className="text-emerald-300" />
                  <div className="flex-1 h-10 bg-white rounded-lg border border-emerald-200 flex items-center justify-center text-xs font-bold">Consegna</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {currentStepId === 'org-cultura' && (
        <motion.div key="org-cultura" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 py-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-display font-medium">Cultura e Valori</h2>
            <p className="text-slate-500">Il &quot;collante&quot; che tiene insieme l&apos;organizzazione.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600"><Eye size={32} /></div>
              <h3 className="text-xl font-bold">Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Dove vogliamo andare nel lungo termine. Il sogno dell&apos;azienda.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600"><Target size={32} /></div>
              <h3 className="text-xl font-bold">Mission</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Cosa facciamo ogni giorno per chi. Lo scopo pratico.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600"><Star size={32} /></div>
              <h3 className="text-xl font-bold">Valori</h3>
              <p className="text-sm text-slate-500 leading-relaxed">I principi non negoziabili che guidano i comportamenti.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PersonaTemplate = () => {
  const [persona] = useState({
    name: "Nome Persona",
    quote: "Una citazione che cattura il mindset di questo utente.",
    age: "25-45",
    work: "Job Title",
    family: "Sposato, 2 figli",
    location: "Milano, Italia",
    character: "Archetipo",
    traits: ["Innovatore", "Pragmatico", "Sociale", "Determinato"],
    goals: ["Aumentare la visibilità online", "Automatizzare i processi", "Migliorare il ROI"],
    frustrations: ["Mancanza di tempo", "Budget limitato", "Complessità tecnologica"],
    bio: "La bio dovrebbe essere un breve paragrafo che descrive il viaggio dell'utente. Dovrebbe includere parte della sua storia che porta a un caso d'uso corrente. Può essere utile incorporare le informazioni elencate nel modello e aggiungere dettagli pertinenti che potrebbero essere stati tralasciati.",
    motivation: {
      incentive: 80,
      fear: 30,
      growth: 90,
      power: 50,
      social: 70
    },
    brands: ["Apple", "Nike", "Spotify"]
  });

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 max-w-5xl mx-auto text-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-6">
          <div className="aspect-square bg-slate-100 rounded-3xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-slate-200">
            <User size={80} className="text-slate-300" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-xs font-bold">Carica Foto</span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 space-y-4">
            <div className="italic text-slate-600 text-sm text-center font-serif">
              &quot;{persona.quote}&quot;
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-purple-100 pb-1">
                <span className="font-bold text-purple-900 uppercase tracking-widest">Età</span>
                <span>{persona.age}</span>
              </div>
              <div className="flex justify-between border-b border-purple-100 pb-1">
                <span className="font-bold text-purple-900 uppercase tracking-widest">Lavoro</span>
                <span>{persona.work}</span>
              </div>
              <div className="flex justify-between border-b border-purple-100 pb-1">
                <span className="font-bold text-purple-900 uppercase tracking-widest">Famiglia</span>
                <span>{persona.family}</span>
              </div>
              <div className="flex justify-between border-b border-purple-100 pb-1">
                <span className="font-bold text-purple-900 uppercase tracking-widest">Luogo</span>
                <span>{persona.location}</span>
              </div>
              <div className="flex justify-between border-b border-purple-100 pb-1">
                <span className="font-bold text-purple-900 uppercase tracking-widest">Carattere</span>
                <span>{persona.character}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 space-y-8">
          <div className="flex flex-wrap gap-2">
            {persona.traits.map((trait, i) => (
              <span key={i} className="px-3 py-1 bg-purple-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                {trait}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-purple-900 flex items-center gap-2">
              <Target size={20} className="text-purple-500" />
              Obiettivi
            </h3>
            <ul className="space-y-2">
              {persona.goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-purple-900 flex items-center gap-2">
              <AlertCircle size={20} className="text-purple-500" />
              Frustrazioni
            </h3>
            <ul className="space-y-2">
              {persona.frustrations.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-purple-900">Bio</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {persona.bio}
            </p>
          </div>
        </div>

        <div className="md:col-span-3 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold text-purple-900">Motivazione</h3>
            {Object.entries(persona.motivation).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>{key}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-purple-900">Brand & Influencer</h3>
            <div className="grid grid-cols-3 gap-2">
              {persona.brands.map((brand, i) => (
                <div key={i} className="aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 text-center p-1 hover:border-purple-200 transition-colors">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableText = ({ 
  value, 
  onChange, 
  isEditing, 
  className,
  multiline = false 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
}) => {
  if (isEditing) {
    return multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-full bg-white/10 border border-white/20 rounded p-1 focus:outline-none focus:ring-1 focus:ring-emerald-500", className)}
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-full bg-white/10 border border-white/20 rounded p-1 focus:outline-none focus:ring-1 focus:ring-emerald-500", className)}
      />
    );
  }
  return <span className={className}>{value}</span>;
};

export default function Presentation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeModule, setActiveModule] = useState<'piano' | 'pos' | 'org'>('piano');
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<LessonData>(INITIAL_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredSteps = searchQuery.trim() === '' 
    ? [] 
    : steps.filter(step => 
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.module.toLowerCase().includes(searchQuery.toLowerCase())
      );
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const slideRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const generateImage = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: 'A vibrant illustration of diverse, smiling human figures connected by glowing lines or holding hands, in a professional yet warm atmosphere. The color palette should be dominated by emerald green and slate tones. The style should be modern, clean, and empathetic, suitable for a masterclass presentation. High quality, 16:9 aspect ratio.',
              },
            ],
          },
        });
        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            }
          }
        }
      } catch (error) {
        console.error("Image generation failed", error);
        // Fallback to a nice placeholder if generation fails (e.g. quota exceeded)
        setGeneratedImageUrl('https://picsum.photos/seed/marketing/1200/630');
      }
    };
    if (!generatedImageUrl && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      generateImage();
    }
  }, [generatedImageUrl]);

  const updateField = (field: keyof LessonData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('logoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lezione-${data.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const savePagesToJsonZip = async () => {
    const zip = new JSZip();
    
    steps.forEach((step, index) => {
      const pageData = {
        id: step.id,
        title: step.title,
        pageNumber: index + 1,
        lessonTitle: data.title,
        teacher: data.teacher,
        // Include the full lesson data in each page for context, 
        // or just in the first one. Let's include it in all for completeness 
        // as per "save as json each pages"
        content: step.id === 'intro' ? {
          subtitle: data.subtitle,
          date: data.date,
          time: data.time,
          location: data.location,
          objectives: data.objectives,
          message: data.message
        } : {
          // For other slides, we provide the title as the primary content
          // since the rest is currently hardcoded in JSX
          description: `Contenuto per la slide: ${step.title}`
        }
      };
      zip.file(`pagina_${(index + 1).toString().padStart(2, '0')}_${step.id}.json`, JSON.stringify(pageData, null, 2));
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pagine-json-${data.title.toLowerCase().replace(/\s+/g, '-')}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Errore durante la creazione dello ZIP JSON:", error);
      alert("Errore durante l'esportazione delle pagine in JSON");
    }
  };

  const uploadFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setData(json);
        } catch {
          alert("Errore nel caricamento del file JSON");
        }
      };
      reader.readAsText(file);
    }
  };

  const generateFullHtml = async () => {
    const originalStep = currentStep;
    const slidesHtml: string[] = [];

    // Collect HTML for all slides
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      // Wait for React to render the slide and animations to settle
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      if (slideRef.current) {
        let content = slideRef.current.innerHTML;
        
        // Fix Next.js images to use original URLs
        content = content.replace(/src="\/_next\/image\?url=([^&]+)&amp;[^"]+"/g, (match, url) => {
          return `src="${decodeURIComponent(url)}"`;
        });
        
        // Fix background images if any
        content = content.replace(/url\(['"]?\/_next\/image\?url=([^&]+)&amp;[^'"]+['"]?\)/g, (match, url) => {
          return `url("${decodeURIComponent(url)}")`;
        });

        slidesHtml.push(`
          <div class="slide-page">
            <div class="slide-header">Slide ${i + 1}: ${steps[i].title}</div>
            <div class="slide-content">
              ${content}
            </div>
          </div>
        `);
      }
    }
    
    // Restore original step
    setCurrentStep(originalStep);

    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - Full Presentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; background: #f1f5f9; padding: 40px 20px; margin: 0; }
      .slide-page { 
        max-width: 1152px; 
        margin: 0 auto 60px; 
        background: white; 
        border-radius: 40px; 
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); 
        overflow: hidden;
        position: relative;
        min-height: 600px;
      }
      .slide-header {
        background: #0f172a;
        color: white;
        padding: 12px 30px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.15em;
      }
      .slide-content {
        padding: 40px;
      }
      @media print {
        body { padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .slide-page { 
          margin: 0; 
          box-shadow: none; 
          page-break-after: always; 
          break-inside: avoid;
          overflow: visible;
          border-radius: 0; 
          border-bottom: none; 
        }
        img { page-break-inside: avoid; max-width: 100%; }
        @page { size: landscape; margin: 0; }
        /* Disable animations and force visibility */
        * {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
      .font-display { font-family: 'Inter', sans-serif; font-weight: 700; }
      /* Fix for images in exported HTML */
      img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 60px;">
      <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">${data.title}</h1>
      <p style="color: #64748b; font-size: 18px;">Masterclass by ${data.teacher}</p>
      <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">${data.date} - ${data.location}</p>
    </div>
    
    ${slidesHtml.join('')}
    
    <div style="text-align: center; padding: 60px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
      Generato da Formula Lab - Social Media Marketing Masterclass<br>
      Docente: ${data.teacher} (${data.email})
    </div>
</body>
</html>`;
  };

  const exportAllToHtml = async () => {
    setIsExporting(true);
    try {
      const html = await generateFullHtml();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `presentazione-${data.title.toLowerCase().replace(/\s+/g, '-')}.html`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      console.error("HTML Export failed");
      alert("Errore durante l'esportazione in HTML.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllToZipHtml = async () => {
    setIsExporting(true);
    const zip = new JSZip();

    try {
      const html = await generateFullHtml();
      zip.file("index.html", html);
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `presentazione-completa-${data.title.toLowerCase().replace(/\s+/g, '-')}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      console.error("ZIP HTML Export failed");
      alert("Errore durante l'esportazione dello ZIP.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportEachPageToHtmlZip = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    const originalStep = currentStep;

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (slideRef.current) {
          let content = slideRef.current.innerHTML;
          
          // Fix Next.js images to use original URLs
          content = content.replace(/src="\/_next\/image\?url=([^&]+)&amp;[^"]+"/g, (match, url) => {
            return `src="${decodeURIComponent(url)}"`;
          });
          
          // Fix background images if any
          content = content.replace(/url\(['"]?\/_next\/image\?url=([^&]+)&amp;[^'"]+['"]?\)/g, (match, url) => {
            return `url("${decodeURIComponent(url)}")`;
          });

          const slideHtml = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${steps[i].title} - ${data.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <style>
      :root {
        --font-sans: 'Inter', sans-serif;
        --font-display: 'Playfair Display', serif;
      }
      body { 
        font-family: var(--font-sans); 
        background: #fdfdfd; 
        color: #0f172a;
        margin: 0;
        padding: 40px 20px;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .slide-container {
        width: 100%;
        max-width: 1152px;
        background: white;
        border-radius: 40px;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        padding: 40px;
        position: relative;
      }
      .font-display { font-family: var(--font-display); }
      img { max-width: 100%; height: auto; border-radius: 20px; }
      .bg-slate-950 { background-color: #020617; }
      /* Ensure Tailwind classes work with the custom fonts */
      .font-sans { font-family: var(--font-sans); }
      .font-serif { font-family: var(--font-display); }
      
      @media print {
        body { padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .slide-container { 
          margin: 0; 
          box-shadow: none; 
          page-break-after: always; 
          break-inside: avoid;
          overflow: visible;
          border-radius: 0; 
          border-bottom: none; 
          max-width: none;
          padding: 0;
        }
        img { page-break-inside: avoid; max-width: 100%; }
        @page { size: landscape; margin: 0; }
        /* Disable animations and force visibility */
        * {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    </style>
</head>
<body>
    <div class="mb-8 text-center">
      <h1 class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">${data.title}</h1>
      <p class="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Slide ${i + 1} di ${steps.length}: ${steps[i].title}</p>
    </div>

    <div class="slide-container">
      ${content}
    </div>

    <div class="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-widest">
      Docente: ${data.teacher} &bull; ${data.date}
    </div>
</body>
</html>`;
          zip.file(`slide_${(i + 1).toString().padStart(2, '0')}_${steps[i].id}.html`, slideHtml);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pagine-html-${data.title.toLowerCase().replace(/\s+/g, '-')}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("HTML ZIP Export failed", error);
      alert("Errore durante l'esportazione delle pagine HTML.");
    } finally {
      setCurrentStep(originalStep);
      setIsExporting(false);
    }
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...data.objectives];
    newObjectives[index] = value;
    updateField('objectives', newObjectives);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        .export-mode * {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `}} />
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button 
              onClick={() => {
                setActiveModule('piano');
                setCurrentStep(0);
              }}
              className="w-16 h-16 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden bg-white hover:border-emerald-500 transition-all relative shadow-xl shadow-slate-200/60"
              title="Torna all'Indice"
            >
              {data.logoUrl ? (
                <NextImage 
                  src={data.logoUrl} 
                  alt="Logo" 
                  fill 
                  className="object-contain p-3"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ImageIcon size={20} className="text-slate-400" />
              )}
            </button>
            <label className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <Edit3 size={10} />
            </label>
          </div>
          
          <button 
            onClick={() => {
              setActiveModule('piano');
              setCurrentStep(0);
            }}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-emerald-100 group-hover:scale-110 transition-transform">
              FL
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:text-emerald-600 transition-colors">Formula Lab</h2>
              <p className="text-xs text-slate-500 font-medium">Torna all&apos;Indice</p>
            </div>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button 
              onClick={() => {
                setActiveModule('piano');
                setCurrentStep(0);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                activeModule === 'piano' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Piano Ed.
            </button>
            <button 
              onClick={() => {
                setActiveModule('pos');
                const firstPosIdx = steps.findIndex(s => s.module === 'pos');
                setCurrentStep(firstPosIdx);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                activeModule === 'pos' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Posizionamento
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full overflow-x-auto max-w-[500px] scrollbar-hide">
            {steps.filter(s => s.module === activeModule).map((step) => {
              const idx = steps.findIndex(s => s.id === step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                    currentStep === idx 
                      ? "bg-white text-emerald-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {step.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border-r border-slate-200 pr-4 mr-4">
            <button 
              onClick={saveToJson}
              title="Salva Dati Globali (JSON)"
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            >
              <FileJson size={18} />
              <span className="hidden xl:inline text-xs font-bold">DATI</span>
            </button>
            <button 
              onClick={savePagesToJsonZip}
              title="Esporta Tutte le Pagine (JSON ZIP)"
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            >
              <FileCode size={18} />
              <span className="hidden xl:inline text-xs font-bold">PAGINE JSON</span>
            </button>
            <label className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer">
              <input type="file" accept=".json" onChange={uploadFromJson} className="hidden" />
              <Upload size={18} />
              <span className="hidden xl:inline text-xs font-bold">CARICA</span>
            </label>
          </div>

          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            title="Cerca Slide"
          >
            <Search size={20} />
          </button>

          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            onDoubleClick={() => {
              setTimer(0);
              setIsTimerRunning(false);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all",
              isTimerRunning 
                ? "bg-red-50 text-red-600 animate-pulse" 
                : "bg-slate-100 text-slate-600"
            )}
            title="Timer (Click: Start/Stop, Double Click: Reset)"
          >
            <Clock size={14} />
            {formatTime(timer)}
          </button>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all",
              isEditing 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Edit3 size={16} />
            <span className="hidden sm:inline">{isEditing ? "Salva" : "Modifica"}</span>
          </button>
          
          <button 
            onClick={exportEachPageToHtmlZip}
            disabled={isExporting}
            title="Esporta Ogni Pagina Singolarmente (HTML ZIP)"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <FileArchive size={16} />
            )}
            <span className="hidden sm:inline">PAGINE HTML (ZIP)</span>
          </button>

          <button 
            onClick={exportAllToHtml}
            disabled={isExporting}
            title="Esporta Tutta la Presentazione (HTML)"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <FileCode size={16} />
            )}
            <span className="hidden sm:inline">HTML</span>
          </button>

          <button 
            onClick={exportAllToZipHtml}
            disabled={isExporting}
            title="Esporta Presentazione Completa (ZIP)"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 animate-pulse-subtle"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileArchive size={16} />
            )}
            <span className="hidden sm:inline">SCARICA TUTTO (ZIP)</span>
          </button>
        </div>
      </nav>

      <main className={cn("flex-1 max-w-6xl mx-auto w-full p-6 md:p-10", isExporting && "export-mode")} ref={slideRef}>
        {steps[currentStep].module === 'pos' ? (
          <PositioningModule currentStepId={steps[currentStep].id} />
        ) : steps[currentStep].module === 'org' ? (
          <OrganizationModule currentStepId={steps[currentStep].id} />
        ) : (
          <AnimatePresence mode="wait">
            {/* Main Slide Content */}
            {steps[currentStep].id === 'intro' && (
            <motion.div
              key="intro-slide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Main Header Card */}
              <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-[16/7] bg-white">
                <NextImage 
                  src="https://drive.google.com/uc?export=view&id=1GX8sHz4CINiBKuUTALIA_OvW3CePOYVU"
                  alt={data.title}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                  priority
                />
                
                {/* Logo Link Overlay */}
                <button 
                  onClick={() => {
                    setActiveModule('piano');
                    setCurrentStep(0);
                  }}
                  className="absolute top-0 left-0 w-[30%] h-full z-20 cursor-pointer"
                  title="Torna all'Indice"
                />

                {/* Video, Infografica, Quiz, Night Slides Buttons moved to the top */}
                <div className="absolute top-6 left-6 z-30 flex flex-wrap gap-2 max-w-[300px]">
                  {data.videoUrl && (
                    <a 
                      href={data.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-slate-900 hover:bg-white/80 transition-all shadow-sm"
                    >
                      <Video size={12} className="text-emerald-600" />
                      Video
                    </a>
                  )}
                  {data.infographicUrl && (
                    <a 
                      href={data.infographicUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-slate-900 hover:bg-white/80 transition-all shadow-sm"
                    >
                      <ImageIcon size={12} className="text-red-600" />
                      Infografica
                    </a>
                  )}
                  {data.claudeSlidesUrl && (
                    <a 
                      href={data.claudeSlidesUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-slate-900 hover:bg-white/80 transition-all shadow-sm"
                    >
                      <PresentationIcon size={12} className="text-blue-600" />
                      Slides
                    </a>
                  )}
                  <a 
                    href="https://drive.google.com/file/d/1-ljZMlKob332DorY5wJBgySn2GLeyjaX/view?usp=drive_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/80 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    <Moon size={12} className="text-indigo-200" />
                    Slides Notte
                  </a>
                </div>
              </div>
                

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Calendar, label: "DATA", value: data.date, field: 'date' },
                  { icon: Clock, label: "ORARIO", value: data.time, field: 'time' },
                  { icon: MapPin, label: "LUOGO", value: data.location, field: 'location' },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-semibold text-slate-900">
                        <EditableText 
                          value={item.value} 
                          onChange={(v) => updateField(item.field as keyof LessonData, v)} 
                          isEditing={isEditing} 
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Objectives */}
                <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Target className="text-emerald-600" />
                      Argomenti di discussione
                    </h3>
                    <Smile className="text-amber-400 opacity-50" size={24} />
                  </div>
                  <ul className="space-y-4">
                    {data.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                          <ChevronRight size={12} />
                        </div>
                        <EditableText 
                          value={obj} 
                          onChange={(v) => updateObjective(idx, v)} 
                          isEditing={isEditing} 
                          className="text-slate-600 leading-relaxed text-sm"
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Message Image */}
                <div className="rounded-[32px] overflow-hidden shadow-lg shadow-emerald-100 relative min-h-[400px]">
                  <NextImage 
                    src="https://drive.google.com/uc?export=view&id=1OBZ5NBMrWIflGOw7x3USOWUAeGg97iSa"
                    alt="Messaggio"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Slide Index Section */}
              <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                    <ListChecks className="text-emerald-600" />
                    Indice delle Slide
                  </h3>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Piano Ed.
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Org. Aziendale
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      Posizionamento
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {steps.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setActiveModule(step.module as 'piano' | 'pos' | 'org');
                        setCurrentStep(idx);
                      }}
                      className={cn(
                        "text-left p-4 rounded-2xl border transition-all group relative overflow-hidden",
                        step.module === 'piano' 
                          ? "border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50" 
                          : step.module === 'pos'
                            ? "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50"
                            : "border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50"
                      )}
                    >
                      <div className="flex items-start gap-3 relative z-10">
                        <span className={cn(
                          "text-xs font-black shrink-0 mt-0.5",
                          step.module === 'piano' ? "text-emerald-600" : step.module === 'pos' ? "text-indigo-600" : "text-emerald-600"
                        )}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 leading-tight block">
                            {step.title}
                          </span>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-[0.15em] block",
                            step.module === 'piano' ? "text-emerald-400" : step.module === 'pos' ? "text-indigo-400" : "text-emerald-400"
                          )}>
                            {step.module === 'piano' ? 'Piano Ed.' : step.module === 'pos' ? 'Posizionamento' : 'Org. Aziendale'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Hover Indicator */}
                      <div className={cn(
                        "absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300",
                        step.module === 'piano' ? "bg-emerald-500" : step.module === 'pos' ? "bg-indigo-500" : "bg-emerald-500"
                      )} />
                    </button>
                  ))}
                </div>
              </div>
          </motion.div>
        )}

          {steps[currentStep].id === 'concept' && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 py-10"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-display font-medium">Piano vs Calendario</h2>
                <p className="text-slate-500 text-lg">La differenza fondamentale tra strategia ed esecuzione.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layout size={80} />
                  </div>
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Layout size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">Il Piano Editoriale (PED)</h3>
                  <p className="text-slate-600 leading-relaxed">
                    È la tua <strong>sceneggiatura</strong>. Definisce il &quot;cosa&quot;, il &quot;perché&quot; e il &quot;per chi&quot;. È il documento strategico che guida la narrazione del brand.
                  </p>
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Metafora Visiva</p>
                    <p className="text-xs italic text-indigo-700">Come il copione di un film: scrive i dialoghi, le scene e il finale prima ancora di accendere la camera.</p>
                  </div>
                  <ul className="space-y-3 pt-2">
                    {["Obiettivi di business", "Analisi del Target", "Tone of Voice", "Contenuti Pilastro"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                        <CheckCircle2 size={16} className="text-indigo-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar size={80} />
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Calendar size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">Il Calendario Editoriale</h3>
                  <p className="text-slate-600 leading-relaxed">
                    È il tuo <strong>piano di riprese</strong>. Definisce il &quot;quando&quot; e il &quot;dove&quot;. È lo strumento operativo per la gestione quotidiana dei contenuti.
                  </p>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Metafora Visiva</p>
                    <p className="text-xs italic text-emerald-700">Come l&apos;ordine del giorno sul set: dice a che ora arriva l&apos;attore, dove si posiziona la luce e quando si grida &quot;Azione!&quot;.</p>
                  </div>
                  <ul className="space-y-3 pt-2">
                    {["Date e orari di pubblicazione", "Canali (IG, TikTok, FB)", "Copywriting finale", "Asset grafici pronti"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                        <CheckCircle2 size={16} className="text-emerald-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Lightbulb size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Metafora per Creativi</h4>
                  <p className="text-slate-400 italic leading-relaxed">
                    &quot;Il Piano Editoriale è il progetto architettonico di una casa. Il Calendario Editoriale è il cronoprogramma del cantiere che dice quando arrivano i mattoni e quando si monta il tetto.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'visual' && (
            <motion.div
              key="step-visual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Neuromarketing Visivo</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Il Cervello Preferisce le Immagini</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <ImageIcon size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                    <h3 className="text-4xl font-black text-blue-400 mb-4">Debunking: Il Mito del &quot;60.000x&quot;</h3>
                    
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/10">
                      <NextImage 
                        src="https://drive.google.com/uc?export=view&id=1cCEV1E9Zl_OFygzbhCghtb8PsajeZJlR"
                        alt="Debunking 60,000x myth"
                        fill
                        className="object-contain bg-white/5"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Molti report citano che processiamo le immagini 60.000 volte più velocemente del testo. In realtà, è un dato senza basi scientifiche solide.
                      </p>
                      <a 
                        href="https://www.visualisingdata.com/2019/10/60000-times-faster-than-text-the-myth-that-would-not-die/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ImageIcon size={14} />
                        Leggi l&apos;articolo originale del debunking
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <p className="text-3xl font-bold text-slate-900 mb-1">90%</p>
                      <p className="text-xs text-slate-500 leading-snug">Delle informazioni trasmesse al cervello sono visive.</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <p className="text-3xl font-bold text-slate-900 mb-1">80%</p>
                      <p className="text-xs text-slate-500 leading-snug">Ricordiamo ciò che vediamo, contro il 20% di ciò che leggiamo.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">La Battaglia per l&apos;Attenzione</h3>
                    <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">Un altro Mito?</div>
                  </div>
                  <p className="text-slate-600">In un contesto di &quot;Overload Informativo&quot;, l&apos;attenzione è la risorsa più scarsa. Ma attenzione ai dati...</p>
                  
                  <div className="space-y-4">
                    <div className="relative h-12 bg-slate-100 rounded-full overflow-hidden flex items-center px-6">
                      <div className="absolute left-0 top-0 h-full bg-slate-400 w-[100%] opacity-50" />
                      <span className="relative z-10 text-xs font-bold text-slate-700">Anno 2000: 12 Secondi (?)</span>
                    </div>
                    <div className="relative h-12 bg-slate-100 rounded-full overflow-hidden flex items-center px-6">
                      <div className="absolute left-0 top-0 h-full bg-red-400 w-[66%] opacity-50" />
                      <span className="relative z-10 text-xs font-bold text-slate-700">Oggi: 8 Secondi (?)</span>
                    </div>
                    <p className="text-[10px] text-red-500 font-bold italic">
                      * Il mito del &quot;pesce rosso&quot; è stato ampiamente smentito. L&apos;attenzione non sta diminuendo, sta diventando più selettiva.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="https://www.bbc.com/news/health-38896790" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ImageIcon size={10} /> BBC: Busting the myth
                      </a>
                      <a 
                        href="https://www.kcl.ac.uk/news/is-our-attention-span-really-shrinking" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ImageIcon size={10} /> King&apos;s College Study
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4">
                    {[
                      { title: "Selezione Percettiva", desc: "Ignoriamo la maggior parte degli stimoli non rilevanti." },
                      { title: "Vigilanza Percettiva", desc: "Notiamo ciò che risponde a un bisogno attuale." },
                      { title: "Adattamento", desc: "Gli stimoli troppo familiari vengono ignorati (Banner Blindness)." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Strategie per Social Media</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { 
                      title: "Hook nei Video", 
                      desc: "I primi 3 secondi sono vitali: usa un 'gancio' visivo o testuale immediato.",
                      icon: Video
                    },
                    { 
                      title: "Stop-Scrolling", 
                      desc: "Colori vivaci e contrasti forti catturano l'attenzione durante lo scrolling.",
                      icon: Zap
                    },
                    { 
                      title: "Gerarchia Visiva", 
                      desc: "Guida l'occhio verso l'elemento chiave usando dimensioni e posizionamento.",
                      icon: Eye
                    },
                    { 
                      title: "Coerenza di Brand", 
                      desc: "Usa stili visuali costanti per essere riconosciuto istantaneamente.",
                      icon: Palette
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                      <div className="text-blue-600">
                        <item.icon size={18} />
                      </div>
                      <p className="font-bold text-xs text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Lightbulb size={24} />
                  </div>
                  <p className="text-sm text-blue-900/70 leading-relaxed italic">
                    &quot;L&apos;immagine evoca, la parola descrive. In un mondo che corre, chi non colpisce l&apos;occhio non raggiunge il cuore.&quot;
                    <a 
                      href="https://tesi.luiss.it/20576/1/676831_SCANAGATTA_GINEVRA.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-1 font-bold text-[10px] uppercase tracking-widest hover:text-blue-800 transition-colors"
                    >
                      — Fonte: Tesi Luiss (G. Scanagatta)
                    </a>
                  </p>
                </div>
                
                <div className="pt-4 border-t border-blue-100 flex items-start gap-3">
                  <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Disclaimer: Verificate, sempre.</p>
                    <p className="text-xs text-blue-700/70 leading-relaxed">
                      Nota rispetto alla soglia dell&apos;attenzione: davvero così? Cerca con Google... 
                      <a 
                        href="https://www.ok-salute.it/psicologia/soglia-di-attenzione-ormai-solo-a-8-secondi/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 underline hover:text-blue-800"
                      >
                        Approfondisci qui
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'neuro' && (
            <motion.div
              key="step-neuro-2024"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Neuroscienze</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Mito vs Realtà Scientifica</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <AlertCircle size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold text-indigo-900">La Verità in 150ms</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Il cervello riconosce la struttura di una frase in circa <b>150 millisecondi</b> (un battito di ciglia). Questa rapidità è paragonabile alla percezione di una scena visiva complessa.
                    </p>
                    <p className="text-sm text-slate-500 italic">
                      La comprensione linguistica &quot;a colpo d&apos;occhio&quot; opera in modo simile al riconoscimento visivo: rapido e automatico.
                    </p>
                  </div>

                  <div className="bg-indigo-900 text-white p-8 rounded-[32px] shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Perché il mito dei &quot;60.000x&quot;?</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                      È una cifra suggestiva e facile da ricordare, utile in contesti motivazionali, ma <b>non ha basi neuroscientifiche</b>. Entrambi i sistemi sono rapidissimi, ma con funzioni diverse.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-slate-400">🔍 Studi Rilevanti (2024)</h3>
                  <div className="space-y-4">
                    {[
                      { source: "NYU", title: "Scanning, Scrolling and Swiping", desc: "Riconoscimento frase in 150ms, simile al visivo." },
                      { source: "Neuroscience News", title: "Sentence Structures as Fast as Visual Scenes", desc: "Comprensione istantanea comparabile alla percezione visiva." },
                      { source: "AAU", title: "Rapid Processing of Short Messages", desc: "Testi brevi processati quasi alla stessa velocità delle immagini." },
                      { source: "ACL Anthology", title: "Hierarchical Processing", desc: "Rappresentazione gerarchica e parallela di info visive e linguistiche." }
                    ].map((study, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase">{study.source}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{study.title}</p>
                        <p className="text-xs text-slate-500">{study.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'identity' && (
            <motion.div
              key="step-identity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Psicologia Social</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Dimmi cosa &apos;Likki&apos;...</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                  <Users size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold">La Costruzione dell&apos;Identità</h3>
                  <p className="text-slate-600 leading-relaxed">
                    I &quot;Mi Piace&quot; non sono solo approvazione, sono mattoni del nostro <strong>Self-concept</strong>. Usiamo i brand e le immagini per dire al mondo chi siamo (o chi vorremmo essere).
                  </p>
                  
                  <div className="relative h-64 flex items-center justify-center">
                    <div className="absolute w-40 h-40 bg-blue-200/40 rounded-full flex items-center justify-center border-2 border-blue-300 -translate-x-12 -translate-y-8 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-blue-800 uppercase">Actual Self</span>
                    </div>
                    <div className="absolute w-40 h-40 bg-pink-200/40 rounded-full flex items-center justify-center border-2 border-pink-300 translate-x-12 -translate-y-8 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-pink-800 uppercase">Ideal Self</span>
                    </div>
                    <div className="absolute w-40 h-40 bg-emerald-200/40 rounded-full flex items-center justify-center border-2 border-emerald-300 translate-y-12 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Social Self</span>
                    </div>
                    <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 z-10">
                      <span className="text-[8px] font-black text-slate-900 text-center leading-none">ENGAGE<br/>MENT</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8">
                  <h4 className="text-xl font-bold text-pink-400">La Scienza del &apos;Like&apos;</h4>
                  <div className="space-y-6">
                    {[
                      { label: "Volti", value: "+38%", desc: "Le immagini con volti umani ricevono più like." },
                      { label: "Luminosità", value: "+24%", desc: "Le immagini chiare performano meglio delle scure." },
                      { label: "Colore", value: "Blu > Rosso", desc: "Il blu genera un effetto calmante e di fiducia." },
                      { label: "Timing", value: "Sera/Weekend", desc: "Quando il cervello è in modalità &quot;svago&quot;." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <span className="text-xl font-black text-pink-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'journey' && (
            <motion.div
              key="step-journey"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Customer Journey</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Oltre l&apos;Acquisto</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 relative">
                  <Rocket size={32} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
                    <User size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Il Nuovo Viaggio Visivo</h3>
                  <div className="space-y-2">
                    {[
                      { step: "Inspire", desc: "Crea il desiderio (Pinterest style)", color: "bg-slate-100" },
                      { step: "Introduce", desc: "Presenta la soluzione", color: "bg-slate-200" },
                      { step: "Inform", desc: "Dettagli tecnici e valore", color: "bg-slate-300" },
                      { step: "Buy", desc: "L&apos;atto della conversione", color: "bg-slate-900 text-white" },
                      { step: "Celebrate", desc: "La condivisione (Instagram style)", color: "bg-emerald-500 text-white" }
                    ].map((item, i) => (
                      <div key={i} className={cn("p-4 rounded-2xl flex items-center justify-between transition-transform hover:scale-[1.02]", item.color)}>
                        <span className="font-bold uppercase tracking-widest text-xs">{item.step}</span>
                        <span className="text-xs opacity-70 italic">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-red-600">
                      <Palette size={20} />
                      <h4 className="font-bold">Aspirazione (Pinterest)</h4>
                    </div>
                    <p className="text-sm text-slate-500 italic leading-relaxed">
                      &quot;Cosa vorrei possedere&quot;. È la fase di scoperta e curatela dei desideri. Qui il brand deve essere pura ispirazione visiva.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-emerald-600">
                      <CheckCircle2 size={20} />
                      <h4 className="font-bold">Celebrazione (Instagram)</h4>
                    </div>
                    <p className="text-sm text-slate-500 italic leading-relaxed">
                      &quot;Cosa ho comprato&quot;. È la fase del Social Proof e dell&apos;UGC (User Generated Content). Il cliente diventa ambasciatore.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white flex gap-6 items-center">
                <div className="shrink-0 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center relative">
                  <Target size={28} />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
                    <Smile size={12} className="text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Show, don&apos;t tell.</h4>
                  <p className="text-slate-400 text-sm italic leading-relaxed">
                    &quot;Il viaggio non finisce con l&apos;acquisto. La fase di Celebration trasforma il cliente in un narratore del tuo brand.&quot;
                    <a 
                      href="https://tesi.luiss.it/20576/1/676831_SCANAGATTA_GINEVRA.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-1 font-bold text-[10px] uppercase tracking-widest hover:text-emerald-300 transition-colors"
                    >
                      — Fonte: Tesi Luiss (G. Scanagatta)
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'persona' && (
            <motion.div
              key="step-persona"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Target Audience</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Buyer Persona Template</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <User size={32} />
                </div>
              </div>

              <PersonaTemplate />
            </motion.div>
          )}

          {steps[currentStep].id === 'smart-goals' && (
            <motion.div
              key="step-smart-goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Strategia</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Obiettivi S.M.A.R.T.</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                  <Target size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { letter: "S", title: "Specific", desc: "Semplice, significativo, specifico.", color: "bg-red-500" },
                  { letter: "M", title: "Measurable", desc: "Misurabile, motivante.", color: "bg-orange-500" },
                  { letter: "A", title: "Achievable", desc: "Raggiungibile, concordato.", color: "bg-amber-500" },
                  { letter: "R", title: "Relevant", desc: "Rilevante, orientato ai risultati.", color: "bg-emerald-500" },
                  { letter: "T", title: "Time-bound", desc: "Temporizzato, basato sul tempo.", color: "bg-blue-500" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col items-center text-center">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold", item.color)}>
                      {item.letter}
                    </div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-[40px] p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-red-400">Esempio Obiettivo DEBOLE:</h4>
                    <p className="text-slate-400 italic">&quot;Voglio aumentare i follower su Instagram.&quot;</p>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs text-slate-300">Manca di specificità, tempo e non è chiaro il perché.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-emerald-400">Esempio Obiettivo SMART:</h4>
                    <p className="text-slate-400 italic">&quot;Voglio aumentare i follower del 15% entro 3 mesi pubblicando 3 Reel a settimana per attirare nuovi potenziali clienti.&quot;</p>
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <p className="text-xs text-emerald-300">Specifico, misurabile, raggiungibile, rilevante e temporizzato.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'new-content' && (
            <motion.div
              key="step-new-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Integrazione Strategica</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Dal Piano al Calendario</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <ListChecks size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">Sintesi Operativa</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Unire gli obiettivi SMART alla programmazione quotidiana significa trasformare la visione in azione costante.
                  </p>
                  <div className="space-y-4">
                    {[
                      { t: "Frequenza", d: "Quante volte pubblichiamo per raggiungere il target?" },
                      { t: "Mix di Contenuti", d: "Ispirazione, Educazione, Intrattenimento, Vendita." },
                      { t: "Canali", d: "Dove si trova il nostro pubblico in quel momento?" }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</div>
                        <div>
                          <p className="font-bold text-slate-900">{item.t}</p>
                          <p className="text-sm text-slate-500">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                    <Zap size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-400">Il Segreto del Successo</h4>
                  <p className="text-slate-400 italic leading-relaxed">
                    &quot;Non è la perfezione del singolo post, ma la costanza della tua presenza a costruire l&apos;autorità del brand.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'metrics' && (
            <motion.div
              key="step-metrics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Misurazione & Analisi</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Metriche vs KPI</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <BarChart3 size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Activity size={20} />
                      <h3 className="text-xl font-bold">Le Metriche (I Dati)</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Sono misurazioni quantitative di un&apos;attività. Ci dicono <strong>cosa sta succedendo</strong>, ma non necessariamente se stiamo andando bene.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {["Visualizzazioni", "Like", "Follower", "Click"].map((m, i) => (
                        <div key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 border border-slate-100">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-md space-y-4">
                    <div className="flex items-center gap-3 text-blue-600">
                      <Target size={20} />
                      <h3 className="text-xl font-bold">I KPI (Gli Obiettivi)</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Key Performance Indicators. Sono le metriche che contano davvero per il tuo business. Ci dicono <strong>se stiamo raggiungendo il successo</strong>.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {["Tasso di Conversione", "Costo per Lead", "ROI", "Engagement Rate"].map((k, i) => (
                        <div key={i} className="px-4 py-2 bg-blue-50 rounded-xl text-xs font-bold text-blue-700 border border-blue-100">
                          {k}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                  </div>
                  
                  <h4 className="text-2xl font-display font-medium text-blue-400 relative z-10">Infografica KPI Principali</h4>
                  
                  <div className="space-y-6 relative z-10">
                    {[
                      { label: "Awareness", icon: Eye, value: "Reach / Impression", color: "text-purple-400" },
                      { label: "Consideration", icon: MessageSquare, value: "Engagement / Click", color: "text-blue-400" },
                      { label: "Conversion", icon: ShoppingBag, value: "Sales / Signups", color: "text-emerald-400" },
                      { label: "Loyalty", icon: Star, value: "Retention / LTV", color: "text-amber-400" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 group">
                        <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                          <item.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</span>
                            <span className={cn("text-sm font-bold", item.color)}>{item.value}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${85 - i * 15}%` }}
                              transition={{ duration: 1, delay: i * 0.2 }}
                              className={cn("h-full bg-current", item.color)} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <User size={20} />
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      &quot;Le metriche sono vanità, i KPI sono sanità.&quot; — Ricorda di guardare oltre i numeri superficiali.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl space-y-4">
                <h4 className="text-amber-800 font-bold flex items-center gap-2">
                  <Lightbulb size={20} />
                  Termini Trasversali
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { term: "Benchmark", desc: "Confronto con il mercato" },
                    { term: "Funnel", desc: "Percorso di conversione" },
                    { term: "Insight", desc: "Verità nascosta nei dati" },
                    { term: "Optimization", desc: "Miglioramento continuo" }
                  ].map((t, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-bold text-sm text-amber-900">{t.term}</p>
                      <p className="text-[10px] text-amber-700/70">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'vanity-insights' && (
            <motion.div
              key="step-vanity-insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Analisi Avanzata</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Vanity Metrics vs Insights</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <Eye size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 text-red-500">
                    <AlertCircle size={24} />
                    <h3 className="text-xl font-bold">Vanity Metrics (Vanità)</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dati che sembrano belli sulla carta ma non correlano necessariamente con il successo del business. Possono gonfiare l&apos;ego ma non il portafoglio.
                  </p>
                  <div className="space-y-3">
                    {["Numero totale di Follower", "Numero di Like", "Visualizzazioni totali (senza tempo di visione)"].map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl text-xs text-red-700 border border-red-100">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {m}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <TrendingUp size={24} />
                    <h3 className="text-xl font-bold">Actionable Insights (Azione)</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dati che ti permettono di prendere decisioni strategiche. Ti dicono <strong>perché</strong> qualcosa sta funzionando o meno.
                  </p>
                  <div className="space-y-3">
                    {["Tasso di Engagement", "Salvataggi e Condivisioni", "Tempo medio di visualizzazione", "Click al sito web"].map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700 border border-emerald-100">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6">
                <h4 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Cosa sono gli Insight delle Pagine?
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Gli Insight sono la &quot;scatola nera&quot; del tuo profilo social. Non sono solo numeri, ma il comportamento reale del tuo pubblico.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <h5 className="font-bold text-sm text-white">Copertura (Reach)</h5>
                    <p className="text-[10px] text-slate-400">Quante persone uniche hanno visto i tuoi contenuti. Fondamentale per la crescita.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <h5 className="font-bold text-sm text-white">Interazioni</h5>
                    <p className="text-[10px] text-slate-400">Commenti, condivisioni, salvataggi. Indicano quanto il contenuto è rilevante.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <h5 className="font-bold text-sm text-white">Pubblico</h5>
                    <p className="text-[10px] text-slate-400">Età, genere, città e orari di attività. Ti dice a CHI stai parlando davvero.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'market' && (
            <motion.div
              key="step-market"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Competenza UC 1655</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Analizzare il Mercato</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <MapPin size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <User size={48} />
                  </div>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Il Paesaggio (I Competitor)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Chi altro sta dipingendo su questa tela? Analizzare i competitor non serve a copiare, ma a trovare lo spazio vuoto dove il tuo brand può brillare.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cosa cercare:</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• Il loro stile visivo</li>
                      <li>• Cosa dicono (e cosa NON dicono)</li>
                      <li>• Come interagiscono</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Smile size={48} />
                  </div>
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <Rocket size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Il Vento (I Trend)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    In che direzione soffia il gusto del pubblico? I trend sono correnti che possono spingere la tua barca, ma attento a non perdere la tua identità.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Strumenti:</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• <a href="https://trends.pinterest.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 transition-colors">Pinterest Trends</a></li>
                      <li>• <a href="https://trends.google.com/trends/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 transition-colors">Google Trends</a></li>
                      <li>• Osservazione Social</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Target size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Il Terreno (I Bisogni)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Cosa cercano davvero le persone? Non vendiamo solo oggetti o servizi, ma soluzioni a desideri estetici o funzionali insoddisfatti.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Focus:</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• Problemi da risolvere</li>
                      <li>• Emozioni da suscitare</li>
                      <li>• Valori condivisi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0 w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
                  <MapPin size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Metafora Visiva: La Mappa della Spedizione</h4>
                  <p className="text-slate-400 italic leading-relaxed">
                    &quot;Analizzare il mercato è come disegnare la mappa prima di una spedizione in terre ignote. Non ti dice dove andare, ma ti mostra dove sono le montagne insormontabili e dove si trovano le oasi di acqua fresca.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'offer' && (
            <motion.div
              key="step-offer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Competenza UC 1656</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Configurare l&apos;Offerta</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 relative">
                  <Palette size={32} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
                    <Smile size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Layout size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Il &quot;Cosa&quot;: Prodotto o Servizio</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Non vendi solo un oggetto, vendi un&apos;esperienza. Definisci le caratteristiche tecniche, ma soprattutto il <strong>valore aggiunto</strong> che offri.
                    </p>
                    <ul className="space-y-2 pt-2">
                      {["Qualità dei materiali", "Design unico", "Personalizzazione", "Assistenza post-vendita"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                          <CheckCircle2 size={16} className="text-blue-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <Target size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Il &quot;Quanto&quot;: Strategia di Prezzo</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Il prezzo comunica il posizionamento. È un brand di lusso o accessibile? Considera i costi, ma anche il valore percepito dal cliente.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Costi</p>
                        <p className="text-xs text-slate-600 italic">Materiali + Tempo + Spese fisse</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valore</p>
                        <p className="text-xs text-slate-600 italic">Unicità + Brand + Emozione</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Lightbulb size={120} />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <h4 className="text-2xl font-display font-medium text-emerald-400">Metafora Visiva: Il Menù dello Chef</h4>
                    <p className="text-slate-400 italic leading-relaxed">
                      &quot;Configurare l&apos;offerta è come creare il menù di un ristorante stellato. Non elenchi solo gli ingredienti, ma racconti una storia attraverso i piatti, decidi l&apos;ordine delle portate e crei abbinamenti che lasciano il segno.&quot;
                    </p>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <h5 className="font-bold text-sm uppercase tracking-widest text-slate-500">Gli Ingredienti del Successo:</h5>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { title: "L'Antipasto (Entry Level)", desc: "Un servizio/prodotto accessibile per farti conoscere." },
                        { title: "Il Piatto Forte (Core Offer)", desc: "Il tuo cavallo di battaglia, ciò per cui sei famoso." },
                        { title: "Il Dessert (Upselling)", desc: "Quel tocco in più che completa l'esperienza del cliente." }
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                          <h6 className="font-bold text-emerald-400 text-sm">{item.title}</h6>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl relative z-10">
                    <p className="text-xs text-emerald-400 font-medium">
                      <strong>Ricorda:</strong> Un&apos;offerta chiara riduce l&apos;attrito all&apos;acquisto. Se il cliente deve pensare troppo, probabilmente non comprerà.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'strategy' && (
            <motion.div
              key="step-strategy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Fase Strategica</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Costruire il Piano di Lancio</h2>
                </div>
                <Rocket className="text-slate-200" size={64} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Users, title: "Il Protagonista", subtitle: "Target", desc: "Ogni storia ha un eroe. Chi è il tuo? Cosa sogna? Quale drago deve sconfiggere?", color: "bg-blue-50 text-blue-600" },
                  { icon: Target, title: "La Bussola", subtitle: "Obiettivi", desc: "Senza nord si gira a vuoto. Awareness? Lead? Vendite? Segui la rotta SMART.", color: "bg-red-50 text-red-600" },
                  { icon: Palette, title: "La Colonna Sonora", subtitle: "Tone of Voice", desc: "È il mood che avvolge tutto. Amichevole? Istituzionale? Ironico? Rock o Jazz?", color: "bg-purple-50 text-purple-600" },
                  { icon: ListChecks, title: "Le Stanze della Mostra", subtitle: "Rubriche", desc: "Come organizzi il percorso del visitatore nel tuo mondo creativo?", color: "bg-emerald-50 text-emerald-600" },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.subtitle}</p>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.subtitle === "Obiettivi" ? (
                        <>Senza nord si gira a vuoto. Awareness? Lead? Vendite? Segui la rotta <a href="https://it.wikipedia.org/wiki/Obiettivi_SMART" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-700 transition-colors">SMART</a>.</>
                      ) : item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl space-y-4">
                <h4 className="text-amber-800 font-bold flex items-center gap-2">
                  <AlertCircle size={20} />
                  Consiglio da Pro: Non lanciare nel vuoto!
                </h4>
                <p className="text-amber-900/70 text-sm leading-relaxed">
                  Per un brand creativo, il lancio deve essere un <strong>evento narrativo</strong>. Inizia a creare curiosità (Teasing) almeno 15 giorni prima. Mostra il &quot;dietro le quinte&quot;, i bozzetti, la ricerca dei materiali. Coinvolgi le persone nel processo creativo.
                </p>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'rubriche' && (
            <motion.div
              key="step-rubriche"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Per il Brand Creativo</div>
                <h2 className="text-4xl md:text-5xl font-display font-medium">Rubriche per Professionisti Creativi</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                  Che tu sia un designer, un architetto, un illustratore o un artigiano digitale, queste rubriche servono a trasformare la tua competenza tecnica in narrazione coinvolgente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { 
                    title: "The Process", 
                    subtitle: "Il Bozzetto", 
                    content: "Timelapse di un'illustrazione, moodboard di interior design, la scelta dei tessuti. Umanizza il lavoro.",
                    example: "Reel: 15 secondi di pennellate veloci.",
                    metaphor: "Mostra il bozzetto prima del quadro finito: le persone amano il viaggio, non solo la meta."
                  },
                  { 
                    title: "Inspiration", 
                    subtitle: "La Bacheca dei Sogni", 
                    content: "Artisti che amiamo, architetture iconiche, palette colori naturali. Posiziona il brand culturalmente.",
                    example: "Carousel: 5 foto di architettura brutalista.",
                    metaphor: "Condividi le tue lenti: come vedi il mondo e cosa nutre la tua creatività ogni giorno."
                  },
                  { 
                    title: "The Why", 
                    subtitle: "Le Radici", 
                    content: "Perché abbiamo scelto quel materiale? Quale emozione vogliamo trasmettere? Crea connessione profonda.",
                    example: "Post: Foto macro del dettaglio di un mobile.",
                    metaphor: "Le radici dell&apos;albero: ciò che non si vede ma che rende solida e viva tutta la chioma."
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group">
                    <div className="h-32 bg-slate-900 p-6 flex flex-col justify-end relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <Palette size={64} className="text-white" />
                      </div>
                      <h4 className="text-white text-xl font-bold relative z-10">{item.title}</h4>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest relative z-10">{item.subtitle}</p>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                        <p className="text-xs italic text-slate-400 border-l-2 border-emerald-500 pl-3">{item.metaphor}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Esempio Pratico</p>
                        <p className="text-xs font-medium text-slate-700">{item.example}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'calendar' && (
            <motion.div
              key="step-calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-medium">Il Calendario Operativo</h2>
                <p className="text-slate-500 text-lg">Dalla strategia alla tabella di marcia.</p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giorno</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Canale</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rubrica</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contenuto / Copy</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { day: "Lunedì 02", channel: "Instagram Reel", topic: "The Process", content: "Timelapse creazione logo. 'Come nasce un'identità visiva'.", status: "Pronto", statusColor: "bg-emerald-100 text-emerald-700" },
                      { day: "Martedì 03", channel: "IG Stories", topic: "Daily Life", content: "Sondaggio: 'Quale palette preferite per il nuovo progetto?'", status: "In Corso", statusColor: "bg-amber-100 text-amber-700" },
                      { day: "Giovedì 05", channel: "LinkedIn", topic: "The Why", content: "Articolo: L'importanza del design sostenibile oggi.", status: "Da Fare", statusColor: "bg-slate-100 text-slate-700" },
                      { day: "Venerdì 06", channel: "TikTok", topic: "Inspiration", content: "Tour dello studio creativo con musica lo-fi.", status: "Pronto", statusColor: "bg-emerald-100 text-emerald-700" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-sm">{row.day}</td>
                        <td className="p-4 text-sm text-slate-600">{row.channel}</td>
                        <td className="p-4 text-sm font-medium text-emerald-600">{row.topic}</td>
                        <td className="p-4 text-sm text-slate-500 max-w-xs">{row.content}</td>
                        <td className="p-4">
                          <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", row.statusColor)}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                  <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <User size={64} />
                  </div>
                  <h4 className="font-bold flex items-center gap-2 text-red-600">
                    <AlertCircle size={18} />
                    Errori da Evitare
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• Pubblicare senza un obiettivo chiaro.</li>
                    <li>• Non rispondere ai commenti (il social è dialogo!).</li>
                    <li>• Usare immagini di bassa qualità (per voi è un peccato mortale).</li>
                    <li>• Essere troppo auto-referenziali.</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                  <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Smile size={64} />
                  </div>
                  <h4 className="font-bold flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={18} />
                    Best Practices
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• Mantieni una coerenza visiva (<a href="https://blog.hootsuite.com/instagram-grid-layout/" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-700 transition-colors">Grid aesthetics</a>).</li>
                    <li>• Scrivi copy che parlino al cuore del target.</li>
                    <li>• Analizza i dati ogni mese per aggiustare il tiro.</li>
                    <li>• Sperimenta nuovi formati (Reel, Carousel, Live).</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'ai-tools' && (
            <motion.div
              key="step-ai-tools"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wider">AI & Productivity</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">AI per il Piano Editoriale</h2>
                </div>
                <Zap className="text-purple-500 animate-pulse" size={64} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                      <Edit3 size={24} />
                    </div>
                    <h4 className="text-xl font-bold">Ideazione & Strategia</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">ChatGPT / Claude / Perplexity:</span>
                        <p className="text-sm text-slate-500">Ricerca trend, brainstorming rubriche e stesura copy (da revisionare sempre!).</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">AnswerThePublic:</span>
                        <p className="text-sm text-slate-500">Per capire cosa cercano le persone su Google riguardo al tuo settore.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Palette size={24} />
                    </div>
                    <h4 className="text-xl font-bold">Creazione Contenuti</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Canva Magic Studio:</span>
                        <p className="text-sm text-slate-500">Rimozione sfondi, espansione immagini e generazione grafiche da testo.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">CapCut AI:</span>
                        <p className="text-sm text-slate-500">Sottotitoli automatici, editing veloce e script-to-video.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="text-amber-400" size={40} />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <h4 className="font-bold text-xl">Regola d&apos;oro dell&apos;AI</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    L&apos;AI è il tuo assistente, non il tuo sostituto. Usala per velocizzare i processi noiosi (sbobinare, formattare, ricercare) ma lascia che sia la tua sensibilità artistica a dare il tocco finale.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'competitors' && (
            <motion.div
              key="step-competitors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-medium">Analisi Competitor & Insight</h2>
                <p className="text-slate-500 text-lg">Gli strumenti per guardare oltre il proprio giardino.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <BarChart3 size={24} />
                  </div>
                  <h4 className="font-bold">Meta Ad Library</h4>
                  <p className="text-sm text-slate-500">
                    Trasparenza totale: puoi vedere tutte le inserzioni attive di qualsiasi brand su Facebook e Instagram. Fondamentale per studiare le strategie di vendita dei competitor.
                  </p>
                  <a href="https://www.facebook.com/ads/library/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    Vai alla Libreria Inserzioni <ChevronRight size={14} />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <h4 className="font-bold">Google Trends</h4>
                  <p className="text-sm text-slate-500">
                    Lo strumento gratuito per eccellenza per capire cosa interessa alle persone in tempo reale. Confronta i volumi di ricerca e scopri i trend stagionali.
                  </p>
                  <a href="https://trends.google.it/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                    Esplora Google Trends <ChevronRight size={14} />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <h4 className="font-bold">Meta Business Suite</h4>
                  <p className="text-sm text-slate-500">
                    Lo strumento ufficiale per gestire Instagram e Facebook. Qui trovi gli Insight reali: copertura, interazioni e, soprattutto, i dati demografici del tuo pubblico.
                  </p>
                  <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                    Gestisci Business Suite <ChevronRight size={14} />
                  </a>
                </div>
              </div>

              <div className="bg-indigo-900 rounded-[32px] p-8 text-white">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4">
                    <h4 className="text-2xl font-bold">Cosa guardare nei competitor?</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <li className="flex items-center gap-2 text-indigo-200">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                        Frequenza di pubblicazione
                      </li>
                      <li className="flex items-center gap-2 text-indigo-200">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                        Tone of Voice nei commenti
                      </li>
                      <li className="flex items-center gap-2 text-indigo-200">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                        Formati più performanti
                      </li>
                      <li className="flex items-center gap-2 text-indigo-200">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                        Call to Action utilizzate
                      </li>
                    </ul>
                  </div>
                  <div className="w-full md:w-64 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <p className="text-xs italic text-indigo-100">
                      &quot;Non copiare il risultato, studia il processo. Se un competitor ha successo, chiediti quale bisogno sta soddisfacendo.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'youtube-tools' && (
            <motion.div
              key="step-youtube"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      <PlayCircle size={14} />
                      Video Strategy
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-slate-900 leading-tight">
                      YouTube & Video Ecosystem
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      YouTube non è solo un social, è il secondo motore di ricerca al mondo. Per dominare il video marketing servono gli strumenti giusti per l&apos;analisi e l&apos;ottimizzazione.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                        <BarChart3 size={24} />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">YouTube Studio</h3>
                      <p className="text-sm text-slate-500">
                        La tua cabina di regia. Analizza la <strong>Retention</strong> (quanto tempo restano) e il <strong>CTR</strong> (quanti cliccano sulla copertina).
                      </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <Zap size={24} />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">VidIQ / TubeBuddy</h3>
                      <p className="text-sm text-slate-500">
                        Estensioni per Chrome che ti dicono quali <strong>Tag</strong> usano i competitor e quali parole chiave hanno meno concorrenza.
                      </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Google Trends</h3>
                      <p className="text-sm text-slate-500">
                        Scopri cosa sta cercando il mondo in tempo reale. Fondamentale per cavalcare i <strong>Trend</strong> prima degli altri.
                      </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                        <Activity size={24} />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Social Blade</h3>
                      <p className="text-sm text-slate-500">
                        Monitora la crescita di qualsiasi canale o profilo social. Utile per fare <strong>Benchmarking</strong> serio sui competitor.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Star className="text-yellow-400" size={20} />
                      Pro Tip: La Regola del Video
                    </h4>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                        <p className="text-slate-300 text-sm italic">
                          &quot;La miniatura (Thumbnail) è il 50% del successo. Se non cliccano, il video non esiste.&quot;
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                        <p className="text-slate-300 text-sm italic">
                          &quot;I primi 30 secondi decidono la sorte del video. Vai dritto al punto, non perderti in intro infinite.&quot;
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                        <p className="text-slate-300 text-sm italic">
                          &quot;Usa le YouTube Shorts per attirare nuovo pubblico e i video lunghi per fidelizzare quello esistente.&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-red-50 rounded-[40px] border border-red-100">
                    <h4 className="font-bold text-red-900 mb-4 uppercase tracking-widest text-xs">Altri Strumenti Utili:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-red-800 text-sm">
                        <CheckCircle2 size={16} className="text-red-500" />
                        <strong>Epidemic Sound:</strong> Musica senza copyright di alta qualità.
                      </li>
                      <li className="flex items-center gap-3 text-red-800 text-sm">
                        <CheckCircle2 size={16} className="text-red-500" />
                        <strong>Pexels/Pixabay:</strong> Video stock gratuiti per i tuoi b-roll.
                      </li>
                      <li className="flex items-center gap-3 text-red-800 text-sm">
                        <CheckCircle2 size={16} className="text-red-500" />
                        <strong>AnswerThePublic:</strong> Per trovare i titoli che la gente cerca davvero.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'trends-keywords' && (
            <motion.div
              key="step-trends-keywords"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      <TrendingUp size={14} />
                      Market Intelligence
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-slate-900 leading-tight">
                      Google Trends & Keyword Research
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Capire cosa cercano le persone è la chiave per creare contenuti rilevanti. Google Trends ti permette di vedere la &quot;temperatura&quot; di un interesse nel tempo.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Rocket className="text-emerald-500" size={20} />
                        Come funziona Google Trends?
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex gap-3">
                          <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">1</div>
                          <p className="text-sm text-slate-600"><strong>Confronto:</strong> Inserisci due o più termini per vedere quale ha più volume di ricerca.</p>
                        </li>
                        <li className="flex gap-3">
                          <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">2</div>
                          <p className="text-sm text-slate-600"><strong>Geografia:</strong> Filtra per paese o regione per capire dove un trend è più forte.</p>
                        </li>
                        <li className="flex gap-3">
                          <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0 text-xs font-bold">3</div>
                          <p className="text-sm text-slate-600"><strong>Stagionalità:</strong> Identifica i picchi ricorrenti (es. &quot;regali di natale&quot; a novembre).</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
                      <ListChecks size={20} />
                      Keyword Research: Il Processo
                    </h4>
                    <div className="space-y-6">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <h5 className="font-bold text-sm mb-2">1. Seed Keywords</h5>
                        <p className="text-xs text-slate-400">Parti da concetti base legati al tuo business (es. &quot;illustrazione digitale&quot;).</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <h5 className="font-bold text-sm mb-2">2. Espansione (Long Tail)</h5>
                        <p className="text-xs text-slate-400">Usa strumenti come <strong>AnswerThePublic</strong> o i suggerimenti di Google per trovare frasi più lunghe (es. &quot;come iniziare con l&apos;illustrazione digitale su ipad&quot;).</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <h5 className="font-bold text-sm mb-2">3. Analisi Intento</h5>
                        <p className="text-xs text-slate-400">Chiediti: l&apos;utente vuole comprare, imparare o solo guardare? Crea il contenuto di conseguenza.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 mb-2 text-sm">Strumenti Gratuiti Consigliati:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-200">Google Keyword Planner</span>
                      <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-200">Ubersuggest (Free version)</span>
                      <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-200">Google Search Console</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {steps[currentStep].id === 'exercise' && (
            <motion.div
              key="step-exercise"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10 py-10"
            >
              <div className="bg-slate-900 rounded-[48px] p-10 md:p-20 text-white text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
                  <div className="absolute bottom-20 right-20 w-64 h-64 border border-white rounded-full" />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="inline-block px-4 py-1 bg-emerald-500 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest relative">
                    Esercitazione Pratica
                    <div className="absolute -top-6 -right-6">
                      <Smile size={32} className="text-emerald-400" />
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-display font-medium">Ora tocca a voi!</h2>
                  <p className="text-emerald-400 font-display text-xl italic">&quot;Costruite il vostro palcoscenico: il brand è lo show, voi siete i registi.&quot;</p>
                </div>

                <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[32px] text-left space-y-6 relative z-10">
                  <p className="text-xl leading-relaxed text-slate-200">
                    Scegliete un brand immaginario (o il vostro progetto personale) nel settore <strong>Design, Illustrazione o Moda</strong>.
                  </p>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Task:</h4>
                    <ol className="space-y-4 text-slate-300">
                      <li className="flex gap-4">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                        Definisci 3 rubriche fisse che valorizzino il tuo talento visivo.
                      </li>
                      <li className="flex gap-4">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                        Crea il calendario editoriale per la prima settimana di lancio.
                      </li>
                      <li className="flex gap-4">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                        Descrivi brevemente l&apos;asset visivo (foto/video) per ogni post.
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="pt-8 relative z-10 flex flex-col items-center gap-6">
                  <p className="text-emerald-400 font-display text-2xl italic">&quot;Il miglior modo per imparare il marketing è farlo.&quot;</p>
                  <button 
                    onClick={exportAllToZipHtml}
                    disabled={isExporting}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-slate-900 rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <div className="w-6 h-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <FileArchive size={24} />
                    )}
                    SCARICA TUTTA LA PRESENTAZIONE (ZIP)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="bg-white border-t border-slate-200 p-6 sticky bottom-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={20} />
              Indietro
            </button>

            <button 
              onClick={() => {
                setActiveModule('piano');
                setCurrentStep(0);
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <ListChecks size={20} className="text-emerald-600" />
              Indice
            </button>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  currentStep === i ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-200"
                )} 
              />
            ))}
          </div>

          <button 
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-30 disabled:hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
          >
            {currentStep === steps.length - 1 ? "Fine" : "Avanti"}
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-start justify-center pt-20 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div 
              initial={{ y: -20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -20, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <Search className="text-slate-400" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Cerca tra le slide..." 
                  className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-900 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 scrollbar-hide">
                {filteredSteps.length > 0 ? (
                  filteredSteps.map((step, idx) => {
                    const realIdx = steps.findIndex(s => s.id === step.id);
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          setActiveModule(step.module as 'piano' | 'pos');
                          setCurrentStep(realIdx);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                          step.module === 'piano' 
                            ? "border-slate-50 hover:border-emerald-200 hover:bg-emerald-50/50" 
                            : "border-slate-50 hover:border-indigo-200 hover:bg-indigo-50/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "text-xs font-black",
                            step.module === 'piano' ? "text-emerald-600" : "text-indigo-600"
                          )}>
                            {(realIdx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="font-bold text-slate-700 group-hover:text-slate-900">{step.title}</span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                          step.module === 'piano' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                        )}>
                          {step.module === 'piano' ? 'Piano Ed.' : 'Posizionamento'}
                        </span>
                      </button>
                    );
                  })
                ) : searchQuery.trim() !== '' ? (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <Search size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">Nessuna slide trovata per &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm italic">
                    Inizia a scrivere per cercare...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
