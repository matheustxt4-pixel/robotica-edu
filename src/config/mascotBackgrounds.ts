import bgLab from '../bg/01 laboratorio.avif';
import bgVale from '../bg/02  vale.avif';
import bgGrecia from '../bg/03 grecia.jpg';
import bgGalaxia from '../bg/04 galáxia.gif';
import bgCyberpark from '../bg/cyberpark 05.gif';

export interface MascotBackground {
  id: string;
  name: string;
  requiredXp: number;
  icon: string;
  description: string;
  badge?: string;
  bgStyle: string;
  imagePath?: string;
  floatingParticles: string[];
}

export const MASCOT_BACKGROUNDS: MascotBackground[] = [
  {
    id: 'default',
    name: 'Estúdio Padrão',
    requiredXp: 0,
    icon: '🌤️',
    description: 'Ambiente clássico e iluminado de aprendizagem de robótica.',
    bgStyle: 'bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 border-3 border-slate-200 text-slate-800',
    floatingParticles: ['⚡', '💡']
  },
  {
    id: 'lab_robotics',
    name: '01 Laboratório de Robótica',
    requiredXp: 1000,
    icon: '🧪',
    description: 'Laboratório tecnológico de alta precisão com luzes reluzentes.',
    badge: '1.000 XP',
    imagePath: bgLab,
    bgStyle: 'border-3 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    floatingParticles: ['🧪', '⚡', '💻', '💡']
  },
  {
    id: 'space_station',
    name: '02 Vale Iluminado',
    requiredXp: 2000,
    icon: '🌄',
    description: 'Paisagem encantadora do Vale do Conhecimento para robôs exploradores.',
    badge: '2.000 XP',
    imagePath: bgVale,
    bgStyle: 'border-3 border-sky-400 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.4)]',
    floatingParticles: ['🌄', '✨', '🍃', '☀️']
  },
  {
    id: 'magical_temple',
    name: '03 Templo da Grécia',
    requiredXp: 3000,
    icon: '️',
    description: 'Templo grego da sabedoria milenar e arquitetura clássica.',
    badge: '3.000 XP',
    imagePath: bgGrecia,
    bgStyle: 'border-3 border-amber-400 text-amber-100 shadow-[0_0_22px_rgba(251,191,36,0.45)]',
    floatingParticles: ['🏛️', '⚙️', '👑', '🏛️']
  },
  {
    id: 'cosmic_galaxy',
    name: '04 Galáxia Cósmica (GIF)',
    requiredXp: 5000,
    icon: '�',
    description: 'Cenário animado do cosmos estrelado com poeira estelar cintilante!',
    badge: '5.000 XP',
    imagePath: bgGalaxia,
    bgStyle: 'border-4 border-purple-400 text-purple-100 shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    floatingParticles: ['🌌', '✨', '🪐', '💫']
  },
  {
    id: 'cyber_city',
    name: '05 Cyberpark Neon Supremacia (GIF)',
    requiredXp: 10000,
    icon: '🏙️',
    description: 'O cenário animado definitivo! Cidade futurista reluzente em néon!',
    badge: '10.000 XP (SUPREMO)',
    imagePath: bgCyberpark,
    bgStyle: 'border-4 border-amber-400 text-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.7)] animate-pulse-subtle',
    floatingParticles: ['🏙️', '🏆', '💎', '💜', '⚡']
  }
];
