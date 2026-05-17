import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { ANALOGIES } from '../data/chapters'
import { IEC_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function FunctionBlockDiagram() {
  return (
    <ChapterLayout
      chapterId="fbd"
      title="Function Block Diagram (FBD)"
      emoji="🔲"
      prev="ld"
      next="sfc"
    >
      <p>
        Function Block Diagram is the graphical data-flow language of IEC 61131-3. You draw boxes with inputs on the left and outputs on the right, then connect them with wires. Signal flows left to right. If you can describe your logic as a flowchart or signal-processing diagram, FBD is your language.
      </p>
      <p>
        FBD is especially natural for analog processing, PID control loops, signal conditioning, and any logic that resembles a block diagram from a controls textbook. Process engineers who think in P&IDs often find FBD more intuitive than ST.
      </p>

      <Callout type="key" title="Data Flow, Not Scan Order">
        In FBD, the execution order of blocks is determined by data dependencies — a block executes when all its input wires have been driven by upstream blocks. This is different from ladder (top-to-bottom scan) and ST (statement sequence). Modern FBD compilers resolve execution order automatically from the wiring topology.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Basic Blocks</h2>

      <pre>{`(* FBD text representation — actual FBD is graphical *)

AND Block:
  Input1 ─────┐
              AND ──── Output (TRUE if ALL inputs TRUE)
  Input2 ─────┘

OR Block:
  Input1 ─────┐
              OR  ──── Output (TRUE if ANY input TRUE)
  Input2 ─────┘

NOT Block:
  Input ──── NOT ──── Output (inverts BOOL)

XOR Block:
  Input1 ─────┐
              XOR ──── Output (TRUE if exactly one TRUE)
  Input2 ─────┘

ADD Block:
  Value1 ─────┐
              ADD ──── Sum (REAL + REAL)
  Value2 ─────┘`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Function Block Instances in FBD</h2>
      <p>
        Just as in ST, using a Function Block in FBD requires declaring an instance. In the graphical FBD editor, you place the FB instance as a block on the diagram, then wire its input and output pins.
      </p>

      <pre>{`(* FBD wiring diagram — text approximation *)

bStartCmd ──────────────────────┐
                                TON.IN
                                TON.PT ← T#5s
bRunning  ────── AND.In1 ─────── AND.Out ──── TON.IN
bPermissive ──── AND.In2

After 5s: TON.Q ──── bDelayedStart

(* The AND block drives the TON timer input.
   The TON output Q drives bDelayedStart.
   Data flows strictly left to right. *)

(* FB instance declared in VAR section:
   tStartDelay : TON;  *)`}</pre>

      <Callout type="key" title="Negation in FBD">
        In graphical FBD, you invert a BOOL signal by adding a small circle (negation bubble) to an input or output pin — identical to the convention in logic gate diagrams. You can also insert an explicit NOT block. Both are equivalent. The negation bubble is faster to draw; the NOT block is easier to spot in a complex diagram.
      </Callout>

      <FunFact index={9} />

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">PID Control in FBD</h2>
      <p>
        FBD is the preferred language for PID control loops. The CTRL_PID function block (standard in most IEC 61131-3 implementations including CODESYS) takes a setpoint and process variable as inputs and outputs a control signal. In FBD, the wiring makes the feedback loop visually obvious.
      </p>

      <pre>{`(* PID loop — FBD wiring concept *)

rSetpoint ───────── CTRL_PID.W
rProcessVar ──────  CTRL_PID.X
                    CTRL_PID.KP ← rProportionalGain
                    CTRL_PID.TI ← rIntegralTime
                    CTRL_PID.TD ← rDerivativeTime
                    CTRL_PID.Y  ──── rControlOutput

(* rControlOutput feeds the analog output module
   which drives the control valve or VFD *)`}</pre>

      <Callout type="field" title="FBD Execution Order Gotcha">
        If two blocks have no data dependency between them, the compiler must pick an execution order. Different compilers may choose differently, and reordering can change behavior in edge cases involving shared state. If execution order matters, ensure all blocks are connected in a proper data-flow chain. In CODESYS you can also set explicit execution order numbers.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Combining Languages in One Project</h2>
      <p>
        IEC 61131-3 allows different POUs in the same project to be written in different languages. A common pattern on RTAC projects: write the main scan logic in ST (complex conditionals, state machines), implement signal conditioning in FBD (clearer for analog math), and use LD for simple permissive interlocks that electricians need to read.
      </p>
      <p>
        Each POU is its own language. A ST program can call an FBD function block. An LD rung can call an ST function. The languages interoperate freely at the POU boundary.
      </p>

      <div className="flex items-start gap-6 my-6">
        <p className="flex-1 text-sm text-slate-400 leading-relaxed">FBD execution order is determined at compile time based on data flow — the compiler traces which block outputs feed which inputs and orders execution accordingly. This means execution order is NOT necessarily top-to-bottom or left-to-right. Two blocks with no data dependency can execute in either order. Feedback loops (an output feeding back as an input) require a memory block to break the cycle. If your FBD behaves unexpectedly, check what the compiled execution order actually is — it may not match what you drew.</p>
        <GifCard gifKey="math" caption="FBD designer connecting a PID loop at 11pm" />
      </div>

      <div className="rounded-2xl p-5 my-6" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}>
        <p className="text-sm italic text-slate-300">"{ANALOGIES.fbd.text}"</p>
        <p className="text-xs text-blue-400 mt-2">— {ANALOGIES.fbd.author}</p>
      </div>

      <Callout type="pro" title="FBD for Documentation">
        A well-drawn FBD diagram is nearly self-documenting. When presenting control logic to a customer, a process engineer, or a regulator who doesn't write code, an FBD diagram communicates the signal flow without requiring any programming background. Print it, paste it in the design document, and watch the questions become more specific.
      </Callout>

      <QuizLevels chapterId="fbd" />

      <ChapterExercise exercise={IEC_CHAPTER_EXERCISES.fbd} />
    </ChapterLayout>
  )
}
