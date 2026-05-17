import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Zap, Award, Clock, ArrowRight, Code2, Cpu, Settings, LayoutGrid } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { CHAPTERS } from '../data/chapters'
import GifCard from '../components/GifCard'
import TrainingPanel from '../components/TrainingPanel'

const STATS = [
  { icon: BookOpen,    label: '10 Chapters', sub: 'Overview to lab' },
  { icon: Zap,         label: '600+ Quizzes', sub: 'All five languages' },
  { icon: Clock,       label: '~5 Hours',    sub: 'Total study time' },
  { icon: Award,       label: 'Cert Ready',  sub: 'ISA CAP & CCST' },
]

const HERO_OPTIONS = [
  { id: '3oEjHWPTo7c0ajPwty',  caption: `Five languages, one standard. IEC 61131-3 contains multitudes.`,  tooltip: `IEC 61131-3 defines five PLC programming languages: Ladder (for electricians), FBD (for controls engineers), ST (for software developers), IL (for masochists), and SFC (for process engineers). All standardized. All running on the same hardware.` },
  { id: 'LmNwrBhejkK9EFP504',  caption: `Writing Structured Text after years of Ladder Diagram.`,          tooltip: `Structured Text looks like Pascal. Ladder Diagram looks like a relay circuit schematic. Both compile to the same machine code on the same PLC. IEC 61131-3 is why an electrical engineer and a software developer can program the same controller without either one being wrong.` },
  { id: 'xT0xeJpnrWC4XWblEk',  caption: `Function blocks: write once, instantiate everywhere.`,            tooltip: `IEC 61131-3 function blocks are like objects with persistent state. Write a PID controller once, instantiate it 50 times — each instance has its own memory and tuning. This is why Siemens, Rockwell, and Beckhoff can all ship the same standard and have it work.` },
  { id: '3oEjHFOscgNwdSRRDy',  caption: `Sequential Function Chart: state machines for process engineers.`, tooltip: `SFC is IEC 61131-3's sequential control language — steps, transitions, actions. It maps directly to P&ID process sequences. If your background is process engineering rather than electrical or software, SFC was the language the standard designed specifically for you.` },
  { id: 'g9582DNuQppxC',        caption: `PLC scan cycle complete. No faults. Outputs written on time.`,    tooltip: `A PLC runs its scan cycle — read inputs, execute program, write outputs — typically every 1 to 20 milliseconds. IEC 61131-3 guarantees deterministic execution. No garbage collection, no OS scheduler preemption, no mystery pauses. Reliable cycles, every time.` },
]
export default function Home() {
  const { overallProgress, reset } = useProgress()
  const [heroIdx] = useState(() => Math.floor(Math.random() * HERO_OPTIONS.length))
  const prog = overallProgress()

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto py-10 px-4 space-y-10">

      {/* Hero */}
      <motion.div variants={item} className="text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-100 leading-tight mb-4">
              IEC 61131-3<br />
              <span className="text-mblue-600">Five Languages. One Standard.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
              The international standard for PLC programming — ladder logic, structured text,
              function blocks, and more. Write it once, run it anywhere.
            </p>
            <div className="flex gap-3 mt-6">
              <Link to="/intro" className="btn-primary flex items-center gap-2">
                Start Learning <ArrowRight size={16} />
              </Link>
              {prog.pct > 0 && <Link to="/lab" className="btn-secondary">Practice Lab</Link>}
            </div>
          </div>
          <div className="flex-shrink-0">
            <GifCard gifId={HERO_OPTIONS[heroIdx].id} caption={HERO_OPTIONS[heroIdx].caption} tooltip={HERO_OPTIONS[heroIdx].tooltip} side="right" />
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      {prog.pct > 0 && (
        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-100">Your Progress</h3>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-red-400 transition-colors">Reset</button>
          </div>
          <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full bg-mblue-600 rounded-full" initial={{ width: 0 }} animate={{ width: `${prog.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>{prog.visited}/{prog.total} chapters read</span>
            <span className="font-bold text-mblue-600">{prog.pct}% complete</span>
            <span>{prog.quizzes}/{prog.total} quizzes passed</span>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="card text-center">
            <div className="w-10 h-10 bg-mblue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <s.icon size={20} className="text-mblue-600" />
            </div>
            <div className="font-bold text-slate-100">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Why it matters */}
      <motion.div variants={item} className="bg-gradient-to-r from-navy-700 to-mblue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} className="flex-shrink-0" /> Why IEC 61131-3 Is the Language of Automation</h2>
            <ul className="text-sm text-blue-100 space-y-1 list-none">
              <li className="flex items-center gap-2"><Code2 size={13} className="flex-shrink-0" /> Five standardized languages — write in whichever makes sense for the task</li>
              <li className="flex items-center gap-2"><LayoutGrid size={13} className="flex-shrink-0" /> Vendor-agnostic — Siemens, Rockwell, Beckhoff, SEL RTAC all speak IEC 61131-3</li>
              <li className="flex items-center gap-2"><Settings size={13} className="flex-shrink-0" /> POUs let you build reusable logic blocks once and deploy everywhere</li>
              <li className="flex items-center gap-2"><Zap size={13} className="flex-shrink-0" /> The SEL RTAC runs IEC 61131-3 natively — if you touch substations, you need this</li>
            </ul>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="text-5xl font-black text-amber-400">5</div>
            <div className="text-blue-200 text-sm">Programming languages</div>
            <div className="text-xs text-blue-300 mt-1">One standard, any vendor</div>
          </div>
        </div>
      </motion.div>

      {/* Chapter grid */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold text-mblue-600 mb-4">Chapters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHAPTERS.filter(c => c.id !== 'home' && c.id !== 'flashcards').map((ch) => (
            <Link key={ch.id} to={ch.path} className="card flex items-center gap-4 hover:border-mblue-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-mblue-50 flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-mblue-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-100 group-hover:text-mblue-600 transition-colors">{ch.label}</div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-mblue-400 transition-colors" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Training */}
      <motion.div variants={item}>
        <TrainingPanel course="iec61131" />
      </motion.div>

      {/* Footer */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-slate-400 text-sm italic">
          "Ladder logic is just electrical drawings that happen to control factories. You've got this."
        </p>
      </motion.div>
    </motion.div>
  )
}
