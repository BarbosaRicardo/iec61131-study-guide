import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { ANALOGIES } from '../data/chapters'
import { IEC_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function LadderDiagram() {
  return (
    <ChapterLayout
      chapterId="ld"
      title="Ladder Diagram (LD)"
      emoji="🪜"
      prev="st"
      next="fbd"
    >
      <p>
        Ladder Diagram was designed by Modicon engineers in the late 1960s to give relay-panel electricians a way to read PLC programs without retraining. If you understood a hard-wired relay schematic, you could read a ladder diagram. This was a brilliant design decision. It is also why, in 2026, ladder logic is still the default language in most PLC training programs.
      </p>
      <p>
        The visual metaphor is a ladder: two vertical power rails (left and right) connected by horizontal rungs. Each rung is a logical expression evaluated left to right. Power "flows" from the left rail through contacts to a coil on the right rail. If the logical path is TRUE, the coil energizes.
      </p>

      <Callout type="key" title="Power Rail Metaphor">
        The left vertical rail represents logical TRUE (power available). The right vertical rail is the output side. A rung "passes power" when all conditions in its horizontal path evaluate to TRUE. The coil on the right activates when the rung is TRUE. This maps directly to a relay circuit where power flows through closed contacts to energize a coil.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Basic Elements</h2>

      <div className="overflow-x-auto rounded-xl my-4" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-300" style={{ background: 'rgba(37,99,235,0.2)' }}>
              <th className="px-4 py-3 text-left font-semibold">Symbol</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Behavior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              ['—| |—', 'Normally Open (NO) Contact', 'Passes power when variable is TRUE'],
              ['—|/|—', 'Normally Closed (NC) Contact', 'Passes power when variable is FALSE'],
              ['—( )—', 'Output Coil', 'Sets variable TRUE when rung is TRUE'],
              ['—(/)—', 'Negated Coil', 'Sets variable FALSE when rung is TRUE'],
              ['—(S)—', 'Set Coil (Latch)', 'Sets variable TRUE and holds it (latching)'],
              ['—(R)—', 'Reset Coil (Unlatch)', 'Resets variable to FALSE'],
              ['—[TON]—', 'Timer On-Delay', 'Delays turning output ON after input is TRUE'],
              ['—[TOF]—', 'Timer Off-Delay', 'Delays turning output OFF after input is FALSE'],
              ['—[CTU]—', 'Count Up Counter', 'Increments count on each rising edge'],
            ].map(([sym, name, desc], i) => (
              <tr key={name} className={i % 2 === 0 ? 'bg-white/5/5' : ''}>
                <td className="px-4 py-2.5 font-mono font-bold text-mcyan-500 whitespace-nowrap">{sym}</td>
                <td className="px-4 py-2.5 font-medium text-slate-200">{name}</td>
                <td className="px-4 py-2.5 text-slate-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Simple Rung: Motor Start/Stop</h2>
      <p>
        The classic ladder logic example is a motor start/stop circuit. This is the "Hello World" of PLC programming.
      </p>

      <pre>{`(* Equivalent ST for the ladder below:
   bRunning := (bStart OR bRunning) AND NOT bStop AND bPermissive; *)

Rung 1: START LATCH
  |--[bStart]--+--[bRunning]--+--[bPermissive]--[/bStop]---(bRunning)---|
               |              |
               +------/-------+

Rung 2: FAULT RESET
  |--[bFaultReset]--[bFaultActive]--(R bFaultActive)---|

Rung 3: PERMISSIVE CHECK
  |--[/bEmergencyStop]--[/bFaultActive]--(bPermissive)---|`}</pre>

      <Callout type="key" title="Parallel Branches = OR Logic">
        Parallel branches in ladder are OR logic. If either branch can pass power, the rung is TRUE. Series contacts are AND logic — all must be TRUE for power to pass. This maps directly to relay circuit topology: series = AND, parallel = OR.
      </Callout>

      <FunFact index={3} />

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Standard Timers: TON, TOF, TP</h2>
      <p>
        IEC 61131-3 defines three standard timer Function Blocks. These are available in all languages including LD, where they appear as rectangular blocks on a rung.
      </p>

      <pre>{`TON — Timer On-Delay
  When IN transitions TRUE, starts timing.
  Q goes TRUE after PT (preset time) elapses.
  Q goes FALSE immediately when IN goes FALSE.
  Use for: delayed start, minimum run time

  Inputs:  IN (BOOL), PT (TIME)
  Outputs: Q (BOOL), ET (TIME — elapsed)

TOF — Timer Off-Delay
  When IN goes TRUE, Q goes TRUE immediately.
  When IN goes FALSE, starts timing.
  Q goes FALSE after PT elapses.
  Use for: run-on timer, seal-in logic

  Inputs:  IN (BOOL), PT (TIME)
  Outputs: Q (BOOL), ET (TIME)

TP — Pulse Timer
  When IN transitions TRUE, Q goes TRUE for exactly PT.
  Subsequent IN transitions are ignored during pulse.
  Use for: fixed-duration output pulses

  Inputs:  IN (BOOL), PT (TIME)
  Outputs: Q (BOOL), ET (TIME)`}</pre>

      <Callout type="field" title="Timer Instances Must Be Declared">
        In LD (and all IEC 61131-3 languages), timers are Function Block instances. You must declare a variable of type TON (or TOF or TP) in your VAR section before using it. Two separate timers require two separate variable declarations. Using the same timer instance for two different purposes creates very confusing timing behavior that is surprisingly difficult to debug.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Counters: CTU, CTD, CTUD</h2>

      <pre>{`CTU — Count Up
  Inputs:  CU (BOOL — count up pulse), R (BOOL — reset), PV (INT — preset)
  Outputs: Q (BOOL — CV >= PV), CV (INT — current value)
  Q goes TRUE when CV reaches PV.

CTD — Count Down
  Inputs:  CD (BOOL — count down pulse), LD (BOOL — load), PV (INT — preset)
  Outputs: Q (BOOL — CV <= 0), CV (INT — current value)
  Q goes TRUE when CV reaches 0.

CTUD — Count Up/Down (combined)
  Has both CU and CD inputs plus QU and QD outputs.`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Set and Reset Coils</h2>
      <p>
        Set (S) and Reset (R) coils implement SR flip-flop behavior in ladder. Unlike a normal output coil (which is driven by the rung state every scan), a Set coil only writes TRUE when its rung is TRUE — and the value stays TRUE even after the rung goes FALSE. A Reset coil does the opposite.
      </p>

      <Callout type="warning" title="Output Coil Scan Order Dependency">
        In ladder diagram, if the same variable is driven by multiple output coils on different rungs, the last rung executed wins. Rungs are evaluated top to bottom, left to right. This is a known source of bugs when multiple rungs write the same output. The IEC standard permits this but warns against it. Use Set/Reset coils or refactor into a single controlling rung.
      </Callout>

      <div className="flex items-start gap-6 my-6">
        <p className="flex-1 text-sm text-slate-400 leading-relaxed">Ladder logic scans left-to-right, top-to-bottom, every cycle. A coil written in rung 10 is immediately visible to a contact in rung 50 during the same scan. A contact in rung 10 reading a coil set by rung 50 sees the previous scan's value. This single-scan cross-rung visibility causes subtle timing bugs in complex ladder programs — draw your logic to minimize dependencies between rungs that are far apart.</p>
        <GifCard gifKey="cables" caption="RS-485 wiring vs. ladder wiring — same energy" />
      </div>

      <div className="rounded-2xl p-5 my-6" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}>
        <p className="text-sm italic text-slate-300">"{ANALOGIES.ld.text}"</p>
        <p className="text-xs text-blue-400 mt-2">— {ANALOGIES.ld.author}</p>
      </div>

      <Callout type="pro" title="When to Use LD vs ST">
        Use LD when: (1) the audience includes electricians who don't write code, (2) the logic maps naturally to relay-style interlocks, or (3) you are debugging with field personnel who need to read it on a laptop. Use ST when: logic is complex, involves math, requires loops or CASE, or when you need maintainable long-term code. Most RTAC projects end up primarily ST.
      </Callout>

      <QuizLevels chapterId="ld" />

      <ChapterExercise exercise={IEC_CHAPTER_EXERCISES.ld} />
    </ChapterLayout>
  )
}
