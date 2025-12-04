import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Award,
  Shield,
  Trophy,
  Crown,
  Box,
  Clock,
  BookOpen,
  ListChecks,
  Music2,
  Info,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Level = {
  title: string;
  subtitle: string;
  hours?: number | string;
  words?: number | string;
  locked?: boolean;
  icon: React.ReactNode;
  // Oud-specific optional fields
  skills?: string;
  song?: string;
  // Boxing-specific details
  outcome?: string;
};

export function Levels({
  currentLevel = 4,
  variant = 'language',
}: {
  currentLevel?: number;
  variant?: 'language' | 'generic' | 'oud' | 'violin' | 'boxing' | 'gym';
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const languageLevels: Level[] = [
    { title: 'Level 1', subtitle: 'Starting from zero.', hours: 0, words: 0, icon: <Award className="h-6 w-6 text-rose-500" /> },
    { title: 'Level 2', subtitle: 'You know some common words.', hours: 50, words: 300, icon: <Shield className="h-6 w-6 text-pink-500" /> },
    { title: 'Level 3', subtitle: 'You can follow learner-friendly topics.', hours: 150, words: 1500, icon: <Trophy className="h-6 w-6 text-violet-500" /> },
  { title: 'Level 4', subtitle: 'You can understand patient speech.', hours: 300, words: 3000, icon: <Box className="h-6 w-6 text-indigo-500" /> },
    { title: 'Level 5', subtitle: 'Understand native speakers normally.', hours: 600, words: 5000, locked: true, icon: <Trophy className="h-6 w-6 text-slate-300" /> },
    { title: 'Level 6', subtitle: 'Comfortable with daily conversation.', hours: 1000, words: 7000, locked: true, icon: <Trophy className="h-6 w-6 text-slate-300" /> },
    { title: 'Level 7', subtitle: 'Use language effectively for practice.', hours: 1500, words: '12,000+', locked: true, icon: <Crown className="h-6 w-6 text-slate-300" /> },
  ];

  const oudLevels: Level[] = [
    {
      title: 'Level 1 – Absolute Beginner',
      subtitle: 'Starting with the fundamentals.',
      hours: '0–20',
      skills: 'Holding the oud and risha, tuning, producing clean notes.',
      song: 'None yet — focus only on mechanics.',
      icon: <Box className="h-6 w-6 text-purple-500" />,
    },
    {
      title: 'Level 2 – First Melodies',
      subtitle: 'Your first musical phrases.',
      hours: '20–60',
      skills: 'Open strings, simple exercises, first maqam (Rast).',
      song: 'Bint El Shalabeyya (Fairuz).',
      icon: <Box className="h-6 w-6 text-rose-500" />,
    },
    {
      title: 'Level 3 – Basic Songs & Scales',
      subtitle: 'Getting comfortable with scales.',
      hours: '60–150',
      skills: 'Scales in Rast and Bayati, slow folk songs, short phrases.',
      song: 'Ya Sahar El Layali (Fairuz).',
      icon: <Box className="h-6 w-6 text-violet-500" />,
    },
    {
      title: 'Level 4 – Traditional Repertoire Foundations',
      subtitle: 'Broader maqamat and rhythm practice.',
      hours: '150–300',
      skills: 'Learn Hijaz, Kurd, Nahawand, basic modulations, practice iqa‘.',
      song: 'Lamma Bada Yatathanna.',
      icon: <Box className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: 'Level 5 – Intermediate Player',
      subtitle: 'Confidence with repertoire and taqasim.',
      hours: '300–600',
      skills: 'Accompany singers, play folk/classical pieces, basic taqasim.',
      song: 'Ayyouha El Saki.',
      icon: <Box className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Level 6 – Advanced Repertoire & Improvisation',
      subtitle: 'Performance-ready expression.',
      hours: '600–1,000',
      skills: 'Confident taqasim, solid iqa‘at, expressive in multiple maqamat.',
      song: 'Alf Leila w Leila (Umm Kulthum) — simplified earlier, full with ornamentation now.',
      icon: <Box className="h-6 w-6 text-teal-500" />,
    },
    {
      title: 'Level 7 – Mastery & Artistic Identity',
      subtitle: 'Personal artistry and professional-level expression.',
      hours: '1,000–1,500+',
      skills: 'Mastery of maqamat, advanced modulations, composition/arrangement, free taqasim.',
      song: 'Samai Bayati Al-Aryan (or advanced samai/longa) + your own taqasim.',
      icon: <Crown className="h-6 w-6 text-amber-500" />,
      locked: true,
    },
  ];

  const violinLevels: Level[] = [
    {
      title: 'Level 1 – Absolute Beginner',
      subtitle: 'Learn posture, hold, and open strings.',
      hours: '0–20',
      skills: 'Posture, how to hold violin and bow, straight bow on open strings, basic tuning with help.',
      song: 'Twinkle Twinkle Little Star (Suzuki Book 1).',
      icon: <Box className="h-6 w-6 text-violet-500" />,
    },
    {
      title: 'Level 2 – First Notes & Simple Tunes',
      subtitle: 'First fingered notes and bow control.',
      hours: '20–80',
      skills: 'First fingered notes on A and E strings, smoother sound, simple rhythms in first position.',
      song: 'Ode to Joy (Beethoven, simplified).',
      icon: <Box className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: 'Level 3 – Basic Melodies & Scales',
      subtitle: 'Scales and simple duets.',
      hours: '80–200',
      skills: 'D and G major scales, all four fingers in first position, simple duets/folk songs.',
      song: 'Minuet No. 1 (Bach, Suzuki Book 1).',
      icon: <Box className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Level 4 – Building Control',
      subtitle: 'Intonation and dynamics.',
      hours: '200–400',
      skills: 'Better intonation, smoother bow changes, slurs and dynamics, musical expression.',
      song: 'Minuet in G (Beethoven/Bach).',
      icon: <Box className="h-6 w-6 text-cyan-500" />,
    },
    {
      title: 'Level 5 – Intermediate Player',
      subtitle: 'Positions and vibrato begin.',
      hours: '400–700',
      skills: 'Comfortable in first and starting 2nd/3rd positions, beginner vibrato, complex rhythms, ensemble playing.',
      song: 'Concerto in A minor (Vivaldi) – 1st movement.',
      icon: <Box className="h-6 w-6 text-teal-500" />,
    },
    {
      title: 'Level 6 – Advanced Repertoire',
      subtitle: 'Confident shifting and tone.',
      hours: '700–1,000',
      skills: 'Confident position shifts, solid vibrato, clean string crossings, advanced Baroque/Classical repertoire.',
      song: 'Concerto in G major (Haydn) – 1st movement.',
      icon: <Box className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Level 7 – Mastery & Artistic Voice',
      subtitle: 'Professional-level artistry.',
      hours: '1,000–1,500+',
      skills: 'Mastery of positions, bowing styles, and vibrato; musical phrasing; advanced concert/solo works.',
      song: 'Concerto in D major, Op. 35 (Tchaikovsky) or Bach Partita No. 2 (Chaconne).',
      icon: <Crown className="h-6 w-6 text-amber-500" />,
      locked: true,
    },
  ];

  const boxingLevels: Level[] = [
    {
      title: 'Level 1 – Fresh Beginner',
      subtitle: 'Start with stance, guard, footwork, basic jab & cross.',
      hours: '0–20 hrs',
      skills: 'Learn stance, guard, footwork, basic jab & cross. Start bag work.',
      outcome: '❌ Not fight-ready. Strictly fundamentals.',
      icon: <Box className="h-6 w-6 text-red-500" />,
    },
    {
      title: 'Level 2 – Fundamentals',
      subtitle: 'Add hooks, uppercuts, slips, blocks, basic combos.',
      hours: '20–80 hrs',
      skills: 'Add hooks, uppercuts, slips, blocks, basic combos. Light technical sparring possible.',
      outcome: '✅ Can complete 2–3 rounds of light sparring in the gym. Still not cleared for official competition.',
      icon: <Box className="h-6 w-6 text-orange-500" />,
    },
    {
      title: 'Level 3 – Novice / First-Fight Zone',
      subtitle: 'Fluid shadowboxing, combine offense/defense, moderate sparring.',
      hours: '80–150 hrs',
      skills: 'Shadowbox fluidly, throw combos (1–2–3, jab to body), mix offense/defense. Handle moderate sparring.',
      outcome: '🥊 Likely ready for first amateur fight (novice class). With fair matchmaking, could win first bout.',
      icon: <Box className="h-6 w-6 text-amber-500" />,
    },
    {
      title: 'Level 4 – Developing Boxer / Local Competitor',
      subtitle: 'Angles, feints, head–body combos, basic counterpunching.',
      hours: '150–300 hrs',
      skills: 'Use angles, feints, head–body combinations, basic counterpunching. Conditioning for 5+ rounds.',
      outcome: '🏆 Can win local tournaments / club championships. Record starts to build.',
      icon: <Box className="h-6 w-6 text-green-500" />,
    },
    {
      title: 'Level 5 – Regional Contender',
      subtitle: 'Confident movement and defense under pressure; style adaptation.',
      hours: '300–600 hrs',
      skills: 'Confident movement, consistent defense under pressure, adapt to styles, manage pace for 6–8 rounds.',
      outcome: '🥇 Compete for regional titles, possibly contend for national medals in smaller talent pools.',
      icon: <Box className="h-6 w-6 text-cyan-500" />,
    },
    {
      title: 'Level 6 – National-Level Boxer',
      subtitle: 'High ring IQ, 10+ rounds, advanced tactics.',
      hours: '600–1,000 hrs',
      skills: 'High ring IQ, stamina for 10+ rounds, sharp counter game, advanced tactics (cutting off ring, controlling tempo).',
      outcome: '🇪🇬🥈 Strong chance at national championships; potential medals at Mediterranean / Balkan-level events.',
      icon: <Box className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Level 7 – Elite Amateur / Pro-Ready',
      subtitle: 'Masterful timing, composure, and tempo control.',
      hours: '1,000–1,500+ hrs',
      skills: 'Masterful timing, creativity, composure under fatigue, command of fight tempo. Able to spar and compete with semi-pros.',
      outcome: '🌍 Win major national titles, qualify for international tournaments, or debut as pro. Beyond 1,500–2,000 hrs = pro-ready if record and age align.',
      icon: <Crown className="h-6 w-6 text-amber-500" />,
      locked: true,
    },
  ];

  const gymLevels: Level[] = [
    {
      title: 'Level 1 – Starting from Zero',
      subtitle: 'Just entered the gym, learning form.',
      skills:
        [
          'Struggles to lift own bodyweight confidently.',
          'Bench: empty bar (20 kg).',
          'Pull-up: none.',
          'Squat: < bodyweight.',
        ].join(' '),
      icon: <Box className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Level 2 – Basic Control',
      subtitle: 'You can hold positions and move her with effort.',
      skills:
        [
          'Bench: 60 kg (her torso weight).',
          'Squat: bodyweight for 8 reps.',
          'Hip Thrust: 1x bodyweight.',
          'Pull-up: 1 clean rep.',
        ].join(' '),
      icon: <Box className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Level 3 – Functional Lifter',
      subtitle: 'Pick up bridal-style, spin, and pin easily.',
      skills:
        [
          'Bench: 80 kg.',
          'Squat: 1.25x bodyweight.',
          'Hip Thrust: 1.5x bodyweight.',
          'Pull-up: 5 strict reps.',
          'Farmer Carry: bodyweight in each hand (10 m).',
        ].join(' '),
      icon: <Box className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Level 4 – Bed Dominator',
      subtitle: 'Dominate without strain; reposition at will.',
      skills:
        [
          'Bench: 100 kg.',
          'Squat: 1.5x bodyweight.',
          'Deadlift: 2x bodyweight.',
          'Hip Thrust: 2x bodyweight.',
          'Pull-ups: 5 reps with +10 kg.',
          'Overhead Press: 0.5x bodyweight.',
        ].join(' '),
      icon: <Box className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Level 5 – Alpha Controller',
      subtitle: 'Total command; lifting and pinning feel effortless.',
      skills:
        [
          'Bench: 120 kg.',
          'Squat: 1.75x bodyweight.',
          'Deadlift: 2.25x bodyweight.',
          'Hip Thrust: 2.5x bodyweight.',
          'Pull-ups: 8 reps with +20 kg.',
          'Overhead Press: 0.75x bodyweight.',
          'Farmer Carry: 2x bodyweight total (20 m).',
        ].join(' '),
      icon: <Box className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Level 6 – Savage Dominance',
      subtitle: 'Explosive strength and stamina; ragdoll playfully.',
      skills:
        [
          'Bench: 1.5x bodyweight.',
          'Squat: 2x bodyweight.',
          'Deadlift: 2.5x bodyweight.',
          'Hip Thrust: 3x bodyweight.',
          'Pull-ups: 12 reps with +20 kg.',
          'Olympic Lift: Clean & Press bodyweight.',
          'Core: Dragon flag; standing ab rollout.',
        ].join(' '),
      icon: <Box className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Level 7 – Apex Predator',
      subtitle: 'Peak dominance; any position, any weight.',
      skills:
        [
          'Bench: 1.75x bodyweight.',
          'Squat: 2.25x bodyweight.',
          'Deadlift: 3x bodyweight.',
          'Hip Thrust: 3.5x bodyweight.',
          'Pull-ups: 15+ with +20 kg.',
          'Overhead Press: bodyweight strict press.',
          'Farmer Carry: 2.5x bodyweight (30 m).',
          'Explosive Power: bodyweight snatch.',
        ].join(' '),
      icon: <Crown className="h-6 w-6 text-emerald-500" />,
      locked: true,
    },
  ];

  const levels =
    variant === 'language'
      ? languageLevels
      : variant === 'oud'
      ? oudLevels
      : variant === 'violin'
  ? violinLevels
  : variant === 'boxing'
  ? boxingLevels
  : variant === 'gym'
  ? gymLevels
  : languageLevels; // fallback for generic

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <div className="space-y-3">
          {levels.map((lvl, idx) => {
            const levelNum = idx + 1;
            const isActive = levelNum === currentLevel;
            const isLocked = !!lvl.locked && levelNum > currentLevel;
            const open = openIndex === idx;
            return (
              <>
                <Card
                  key={lvl.title}
                  className={cn(
                    'flex items-center justify-between p-4 border cursor-pointer',
                    isActive && 'ring-2 ring-indigo-300 shadow-sm',
                    isLocked && 'opacity-60'
                  )}
                  onClick={() => setOpenIndex(idx)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="p-3 rounded-lg bg-muted">{lvl.icon}</div>
                    <div className="flex-1">
                      <div className={cn('font-semibold', isActive ? 'text-indigo-700' : 'text-gray-800')}>{lvl.title}</div>
                      <div className="text-sm text-gray-600">{lvl.subtitle}</div>
                      <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs text-gray-600">
                        {typeof lvl.hours !== 'undefined' && (
                          <div>
                            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                            Hours: {lvl.hours}
                          </div>
                        )}
                        {typeof lvl.words !== 'undefined' && (
                          <div>
                            <span className="inline-block w-2 h-2 rounded-full bg-pink-500 mr-2" />
                            Known words: {lvl.words}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={cn('text-gray-400 transition-transform', open ? 'rotate-90' : '')}>{`>`}</div>
                </Card>
                <Dialog open={open} onOpenChange={(o) => setOpenIndex(o ? idx : null)}>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg">{lvl.title}</DialogTitle>
                    </DialogHeader>
                    {(() => {
                      // Split skills string into clean bullet items
                      const skillItems = useMemo(() => {
                        if (!lvl.skills) return [] as string[];
                        return lvl.skills
                          .split(/\.|;|\n/g)
                          .map((s) => s.trim())
                          .filter(Boolean);
                      }, [lvl.skills]);
                      return (
                        <div className="space-y-5">
                          {(typeof lvl.hours !== 'undefined' || typeof lvl.words !== 'undefined') && (
                            <div className="flex flex-wrap gap-2">
                              {typeof lvl.hours !== 'undefined' && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-medium">
                                  <Clock className="h-4 w-4" />
                                  {String(lvl.hours)} hours
                                </span>
                              )}
                              {typeof lvl.words !== 'undefined' && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 text-pink-700 px-3 py-1 text-xs font-medium">
                                  <BookOpen className="h-4 w-4" />
                                  {String(lvl.words)} words
                                </span>
                              )}
                            </div>
                          )}
                          {skillItems.length > 0 && (
                            <div>
                              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                                <ListChecks className="h-4 w-4 text-emerald-600" />
                                Skills & Capabilities
                              </div>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {skillItems.map((s, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-gray-700">{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {lvl.outcome && (
                            <div className="rounded-md border bg-muted/40 p-3 text-sm text-gray-800">
                              <div className="mb-1 flex items-center gap-2 font-semibold">
                                <Info className="h-4 w-4 text-blue-600" /> Outcome
                              </div>
                              <p className="text-gray-700 leading-relaxed">{lvl.outcome}</p>
                            </div>
                          )}
                          {lvl.song && (
                            <div className="rounded-md border bg-muted/40 p-3 text-sm text-gray-800">
                              <div className="mb-1 flex items-center gap-2 font-semibold">
                                <Music2 className="h-4 w-4 text-purple-600" /> Featured piece
                              </div>
                              <p className="text-gray-700 leading-relaxed">{lvl.song}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </DialogContent>
                </Dialog>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Levels;
