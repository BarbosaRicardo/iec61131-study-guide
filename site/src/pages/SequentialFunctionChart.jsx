import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { ANALOGIES } from '../data/chapters'
import { IEC_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function SequentialFunctionChart() {
  return (
    <ChapterLayout
      chapterId="sfc"
      title="Sequential Function Chart (SFC)"
      emoji="🔀"
      prev="fbd"
      next="pou"
    >
      <p>
        Sequential Function Chart is IEC 61131-3's language for sequential process control. It looks like a flowchart: rectangular boxes (steps) connected by horizontal lines (transitions). The active step executes its actions. When the transition condition below it becomes TRUE, execution moves to the next step.
      </p>
      <p>
        SFC is derived from GRAFCET (Graphe Fonctionnel de Commande Étape Transition), a French standard developed in the 1970s for batch process control. It is the cleanest language in the standard — when the problem is inherently sequential, SFC expresses it more clearly than any textual language.
      </p>

      <Callout type="key" title="Steps and Transitions">
        <strong>Steps</strong> are the states. One (or more) steps are active at any time. The initial step is marked with a double border. Each step has an associated action that executes while the step is active.<br /><br />
        <strong>Transitions</strong> are the conditions that move execution from one step to the next. A transition is a BOOL expression. When it evaluates TRUE and its preceding step is active, execution advances.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">SFC Structure — Text Representation</h2>

      <pre>{`(* Motor Startup Sequence — SFC concept *)

  ┌─────────────────┐
  │  STEP: Idle     │  ← Initial step (double border)
  │  Action: None   │
  └────────┬────────┘
           │ bStartCmd AND bPermissive   ← Transition condition
  ┌────────┴────────┐
  │  STEP: PreCheck │
  │  Action: N bCheckOutputs │  ← N = Non-stored (active while step active)
  └────────┬────────┘
           │ tPreCheck.Q   ← Transition: timer elapsed
  ┌────────┴────────┐
  │  STEP: Starting │
  │  Action: N bMotorRun  │
  │  Action: N tStartTON  │
  └────────┬────────┘
           │ tStart.Q OR bRunFeedback  ← Transition
  ┌────────┴────────┐
  │  STEP: Running  │
  │  Action: N bMotorRun  │
  └────────┬────────┘
           │ bStopCmd OR bFaultActive   ← Transition
  ┌────────┴────────┐
  │  STEP: Stopping │
  │  Action: S bCoastdown │  ← S = Set (latched)
  └────────┬────────┘
           │ NOT bMotorRun
           │
  (back to Idle)`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Action Qualifiers</h2>
      <p>
        Each action attached to a step has a qualifier that determines when and how the action executes.
      </p>

      <div className="overflow-x-auto rounded-xl my-4" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-300" style={{ background: 'rgba(37,99,235,0.2)' }}>
              <th className="px-4 py-3 text-left font-semibold">Qualifier</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Behavior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              ['N', 'Non-stored', 'Active while step is active. Deactivates when step deactivates.'],
              ['S', 'Set (Stored)', 'Activates when step activates. Stays active until Reset.'],
              ['R', 'Reset', 'Resets a previously Set action.'],
              ['P', 'Pulse', 'Activates for exactly one scan when step activates.'],
              ['L', 'Time-limited', 'Active for specified duration after step activates.'],
              ['D', 'Time-delayed', 'Activates after specified delay, stays active while step is.'],
              ['SD', 'Stored & Delayed', 'Like S but with a delay before activating.'],
              ['DS', 'Delayed & Stored', 'Like D but stays active after step exits.'],
            ].map(([q, name, desc], i) => (
              <tr key={q} className={i % 2 === 0 ? 'bg-white/5/5' : ''}>
                <td className="px-4 py-2.5 font-mono font-bold text-morange-500">{q}</td>
                <td className="px-4 py-2.5 font-medium text-slate-200">{name}</td>
                <td className="px-4 py-2.5 text-slate-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="Set Actions Must Be Explicitly Reset">
        An action with qualifier S (Set/Stored) remains active even after its step deactivates. If you forget to add a matching R (Reset) action somewhere downstream, the action runs forever. This is the most common SFC bug: a stored action that never gets reset, causing a device to stay energized long after the sequence completes.
      </Callout>

      <FunFact index={7} />

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Parallel Sequences (AND Divergence)</h2>
      <p>
        When you need two sequences to run simultaneously, SFC supports parallel branching. A double horizontal line below a step/transition indicates simultaneous activation of all branches below it. A double horizontal line above a step indicates waiting for all parallel branches to complete before proceeding.
      </p>

      <pre>{`(* Parallel sequence — AND divergence *)

           ┌─ bStartAll ─┐
           │             │
  ══════════════════════════  ← AND Divergence (double line)
  │                       │
  ┌────────┐         ┌────────┐
  │ PumpA  │         │ PumpB  │   ← Both activate simultaneously
  └────┬───┘         └────┬───┘
       │                   │
  bPumpA_Running    bPumpB_Running
  ══════════════════════════  ← AND Convergence (wait for both)
           │
  ┌────────────────┐
  │ BothRunning    │
  └────────────────┘`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Exclusive Selections (OR Divergence)</h2>
      <p>
        A single horizontal line with multiple branches is an OR divergence — exactly one branch activates based on which transition is TRUE first. This implements a decision point: the sequence goes one way or another based on conditions.
      </p>

      <Callout type="field" title="SFC Availability on RTAC">
        SFC support in ACSELERATOR RTAC varies by firmware version and configuration. For complex sequential logic, many RTAC engineers implement state machines in Structured Text using CASE statements rather than native SFC. The CASE approach has equivalent expressiveness and is universally supported. Check your RTAC firmware documentation before committing to a native SFC implementation.
      </Callout>

      <div className="rounded-2xl p-5 my-6" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}>
        <p className="text-sm italic text-slate-300">"{ANALOGIES.sfc.text}"</p>
        <p className="text-xs text-blue-400 mt-2">— {ANALOGIES.sfc.author}</p>
      </div>

      <GifCard gifKey="thinking" caption="Tracing an SFC with a parallel branch and a stored action" side="right"
      />

      <QuizLevels chapterId="sfc" />

      <ChapterExercise exercise={IEC_CHAPTER_EXERCISES.sfc} />
    </ChapterLayout>
  )
}
