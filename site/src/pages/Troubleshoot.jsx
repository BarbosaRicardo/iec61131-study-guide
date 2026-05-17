import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { ANALOGIES } from '../data/chapters'
import { IEC_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function Troubleshoot() {
  return (
    <ChapterLayout
      chapterId="troubleshoot"
      title="Debugging & Troubleshooting"
      emoji="🔍"
      prev="rtac"
      next="lab"
    >
      <p>
        Debugging a PLC program is different from debugging application software. The program runs continuously, on real hardware, controlling real equipment. You cannot pause the process to inspect state. You observe it while it runs. This requires a different mental model than stepping through code in a desktop debugger.
      </p>
      <p>
        The tools exist — watch windows, online monitoring, RTAC diagnostic tags, CODESYS breakpoints in simulation — but they work within the constraints of a running real-time system.
      </p>

      <Callout type="key" title="The Program Never Stops for You">
        On a live RTAC, your IEC 61131-3 program executes every scan whether you are connected or not. ACSELERATOR RTAC's online monitoring shows you the current state of variables — updated each scan. It does not pause execution. You observe, not freeze. Design your debugging strategy around this fact.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Online Monitoring (Watch Window)</h2>
      <p>
        When connected to a live RTAC from ACSELERATOR, you can open a watch window and observe the current value of any variable in your project. The values update each scan. You can also force values to a specific value for testing — this overrides the program logic temporarily.
      </p>

      <Callout type="warning" title="Forcing Values in Production">
        Forcing a variable in a live production system bypasses the control logic that drives it. If you force a BOOL to TRUE and then disconnect, the forced value stays until the program writes to it again (or until you clear forces). In a production substation, a forgotten force can leave a trip output in an unexpected state. Always clear all forces before disconnecting from a production device.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Scan Time Overruns</h2>
      <p>
        A scan time overrun occurs when your IEC 61131-3 program takes longer to execute than its configured scan period. ACSELERATOR RTAC logs these events. Persistent overruns lead to watchdog trips.
      </p>

      <pre>{`(* Common causes of scan time overruns: *)

1. Unbounded loops
   WHILE condition DO
       (* If condition never becomes FALSE, loop runs forever *)
   END_WHILE;

2. Excessive iterations
   FOR i := 0 TO 100000 DO  (* 100K iterations at 1ms scan = disaster *)
       ...
   END_FOR;

3. Expensive string operations
   (* STRING operations in IEC 61131-3 are slow *)
   (* Don't concatenate strings in a 1ms task *)

4. Recursion (compile error — won't build, but worth knowing)

5. Calling blocking SEL FBs in a fast task
   (* Some SEL FBs that initiate protocol actions have *)
   (* higher execution cost — read the FB documentation *)`}</pre>

      <Callout type="field" title="Diagnose With GetScanTime FB">
        ACSELERATOR RTAC provides diagnostic FBs including <code>GetScanTime</code> and <code>GetTaskLoad</code>. Instantiate these in your program and log their outputs to a global variable or RTAC event log. Knowing your actual scan time utilization (e.g., "87% of 1ms budget") lets you make informed decisions before you hit the watchdog.
      </Callout>

      <FunFact index={3} />

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Watchdog Trips</h2>
      <p>
        When the IEC 61131-3 runtime detects a persistent task overrun, it trips the watchdog. This restarts the IEC 61131-3 runtime — not the entire RTAC, but the IEC 61131-3 execution engine. All non-RETAIN variables reset to their initial values. RETAIN variables survive. Protocol stacks (DNP3, IEC 61850) continue running.
      </p>

      <pre>{`(* Watchdog trip recovery sequence on RTAC:
1. IEC 61131-3 runtime restarts
2. All VAR variables re-initialize (initial values)
3. VAR RETAIN variables keep their last values
4. All FB instances re-initialize (timers reset to 0)
5. State machine variables reset to 0 (initial state)
6. Protocol data model continues — no communication gap
7. ACSELERATOR logs the watchdog trip event with timestamp

Implication: after a watchdog trip, your system is in its
INITIAL STATE. Not its pre-fault state. If your process
cannot tolerate a restart from initial state, your RETAIN
variable strategy needs rethinking. *)`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">No Recursion — Compiler Enforcement</h2>
      <p>
        IEC 61131-3 prohibits recursion at the language level. The ACSELERATOR RTAC compiler performs a call graph analysis and will reject any project where a FUNCTION or FUNCTION_BLOCK directly or indirectly calls itself. This error manifests at compile time, not runtime.
      </p>

      <pre>{`(* This will NOT compile — direct recursion *)
FUNCTION Factorial : DINT
VAR_INPUT n : DINT; END_VAR
IF n <= 1 THEN
    Factorial := 1;
ELSE
    Factorial := n * Factorial(n - 1);  (* COMPILE ERROR *)
END_IF;
END_FUNCTION

(* Correct approach — iterative *)
FUNCTION Factorial : DINT
VAR_INPUT n : DINT; END_VAR
VAR
    i : DINT;
    result : DINT := 1;
END_VAR
FOR i := 2 TO n DO
    result := result * i;
END_FOR;
Factorial := result;
END_FUNCTION`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">CODESYS Breakpoints (Simulation)</h2>
      <p>
        In CODESYS with the built-in soft PLC simulator, you can set breakpoints that pause execution at a specific line of ST code. This is not available on a production RTAC — live systems cannot pause. But in development and testing, CODESYS breakpoints let you step through logic, inspect variable state, and validate behavior before deploying to hardware.
      </p>

      <Callout type="pro" title="Test Everything in CODESYS First">
        Build your complete IEC 61131-3 logic in CODESYS, simulate it fully including edge cases and fault conditions, verify all state transitions, and only then adapt it for ACSELERATOR RTAC. The adaptation is mostly FB library substitution (standard IEC timers → SEL timer FBs, etc.). The logic validation work is the same in both environments — but CODESYS gives you breakpoints.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">RTAC Diagnostic Tags</h2>
      <p>
        ACSELERATOR RTAC exposes internal diagnostic information as "tags" — values accessible through the data model. Useful diagnostic tags include: task execution time, watchdog trip counter, last fault time, DNP3 communication quality, IEC 61850 connection status, and hardware I/O health.
      </p>
      <p>
        Map these diagnostic tags to your SCADA or historian. When something goes wrong at 3am, the data you need to diagnose it is already recorded.
      </p>

      <GifCard gifKey="error" caption="When you realize the watchdog trip was a missing RETAIN" side="right"
        body="IEC 61131-3 variables marked RETAIN persist their values through a power cycle — stored in non-volatile memory. Variables without RETAIN reset to their initial values on restart. A watchdog trip caused by a missing RETAIN is a silent failure: the PLC restarts, the variable resets to its default, and the process behaves incorrectly until someone notices the wrong initial state. RETAIN declarations are the first thing to audit after an unexpected restart."
      />

      <div className="rounded-2xl p-5 my-6" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}>
        <p className="text-sm italic text-slate-300">"{ANALOGIES.troubleshoot.text}"</p>
        <p className="text-xs text-blue-400 mt-2">— {ANALOGIES.troubleshoot.author}</p>
      </div>

      <Callout type="field" title="Common RTAC IEC 61131-3 Bugs">
        In order of how often they are encountered in the field:
        <ol className="mt-2 space-y-1 list-decimal list-inside text-sm">
          <li>State variable not initialized to correct initial state after watchdog trip (RETAIN fix or explicit init logic)</li>
          <li>Timer instance shared between two logical uses (allocate one timer instance per logical timer)</li>
          <li>Wrong type conversion — comparing INT to REAL without conversion (compiler usually catches this)</li>
          <li>VAR_GLOBAL not mapped to RTAC data model point (variable always reads 0 or FALSE)</li>
          <li>Scan period too aggressive for logic complexity (move non-time-critical logic to slower task)</li>
        </ol>
      </Callout>

      <QuizLevels chapterId="troubleshoot" />

      <ChapterExercise exercise={IEC_CHAPTER_EXERCISES.troubleshoot} />
    </ChapterLayout>
  )
}
