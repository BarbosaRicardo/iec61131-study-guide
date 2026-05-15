import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { ANALOGIES } from '../data/chapters'
import { IEC_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function POUs() {
  return (
    <ChapterLayout
      chapterId="pou"
      title="POUs — Program, Function, FB"
      emoji="🧩"
      prev="sfc"
      next="rtac"
    >
      <p>
        Program Organization Units (POUs) are the building blocks of IEC 61131-3 software. There are exactly three types: PROGRAM, FUNCTION, and FUNCTION_BLOCK. Understanding the difference between them — especially the difference between FUNCTION and FUNCTION_BLOCK — is foundational to writing correct, maintainable IEC 61131-3 code.
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-300" style={{ background: 'rgba(37,99,235,0.2)' }}>
              <th className="px-4 py-3 text-left font-semibold">POU Type</th>
              <th className="px-4 py-3 text-left font-semibold">Has State?</th>
              <th className="px-4 py-3 text-left font-semibold">Return Value?</th>
              <th className="px-4 py-3 text-left font-semibold">Instantiated?</th>
              <th className="px-4 py-3 text-left font-semibold">Analogy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="bg-white/5">
              <td className="px-4 py-3 font-mono font-bold text-mcyan-500">PROGRAM</td>
              <td className="px-4 py-3">Yes</td>
              <td className="px-4 py-3">No</td>
              <td className="px-4 py-3">No (one global instance)</td>
              <td className="px-4 py-3 text-slate-500">main() in C</td>
            </tr>
            <tr className="bg-white/4">
              <td className="px-4 py-3 font-mono font-bold text-mgreen-500">FUNCTION</td>
              <td className="px-4 py-3">No (stateless)</td>
              <td className="px-4 py-3">Yes</td>
              <td className="px-4 py-3">No (called directly)</td>
              <td className="px-4 py-3 text-slate-500">Pure function</td>
            </tr>
            <tr className="bg-white/5">
              <td className="px-4 py-3 font-mono font-bold text-morange-500">FUNCTION_BLOCK</td>
              <td className="px-4 py-3">Yes (per instance)</td>
              <td className="px-4 py-3">No (outputs via VAR_OUTPUT)</td>
              <td className="px-4 py-3">Yes (multiple instances)</td>
              <td className="px-4 py-3 text-slate-500">Class with instance state</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">PROGRAM</h2>
      <p>
        A PROGRAM is the top-level execution unit. It has no return value and is not instantiated — there is exactly one instance of each PROGRAM, and the runtime calls it on each scan cycle. A PROGRAM can declare local variables (VAR section), access global variables (VAR_EXTERNAL), and call FUNCTIONs and FUNCTION_BLOCKs.
      </p>
      <p>
        On the SEL RTAC, each cyclic task runs one PROGRAM. You configure the scan period (1ms, 10ms, 100ms, etc.) for each task, and the runtime calls its associated PROGRAM at that interval.
      </p>

      <pre>{`PROGRAM MainControl
VAR
    tScanTimer   : TON;
    bSystemReady : BOOL := FALSE;
    rBusVoltage  : REAL;
END_VAR
VAR_EXTERNAL
    gBus1_Voltage : REAL;         (* Declared in GVL *)
    gTrip_Command : BOOL;
END_VAR

(* Copy global to local for this scan *)
rBusVoltage := gBus1_Voltage;

(* Call a function block instance *)
tScanTimer(IN := TRUE, PT := T#1s);

(* Call a function *)
bSystemReady := CheckPermissives(rBusVoltage, gBreaker_Status);
END_PROGRAM`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">FUNCTION</h2>
      <p>
        A FUNCTION is stateless. Given the same inputs, it always returns the same output — there is no internal memory between calls. This makes FUNCTIONs safe to call multiple times per scan with different arguments. They are ideal for calculations, conversions, scaling, and CRC computations.
      </p>

      <Callout type="key" title="FUNCTIONs Cannot Hold State">
        A FUNCTION's local variables are re-initialized on every call. If you need a variable to persist between calls — even for something as simple as a counter — use a FUNCTION_BLOCK instead. This is not a limitation; it is a deliberate design that makes FUNCTIONs safe to use as pure computation units.
      </Callout>

      <pre>{`(* A FUNCTION — stateless, returns a value *)
FUNCTION ScaleAnalog : REAL
VAR_INPUT
    rRaw       : REAL;    (* Raw ADC value *)
    rRawMin    : REAL;    (* Raw scale minimum *)
    rRawMax    : REAL;    (* Raw scale maximum *)
    rEngMin    : REAL;    (* Engineering unit minimum *)
    rEngMax    : REAL;    (* Engineering unit maximum *)
END_VAR
VAR
    rSpan      : REAL;
    rRawSpan   : REAL;
END_VAR

rRawSpan := rRawMax - rRawMin;
IF rRawSpan = 0.0 THEN
    ScaleAnalog := rEngMin;  (* Avoid divide-by-zero *)
    RETURN;
END_IF;

rSpan       := rEngMax - rEngMin;
ScaleAnalog := rEngMin + ((rRaw - rRawMin) / rRawSpan) * rSpan;
END_FUNCTION`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">FUNCTION_BLOCK</h2>
      <p>
        A FUNCTION_BLOCK is IEC 61131-3's answer to object-oriented programming. It has internal state that persists between calls. To use a FUNCTION_BLOCK, you declare an instance of it as a variable — just like declaring a variable of any other type. Each instance has its own independent copy of the FB's internal state.
      </p>

      <pre>{`(* Define the FUNCTION_BLOCK *)
FUNCTION_BLOCK MotorControl
VAR_INPUT
    bStartCmd  : BOOL;
    bStopCmd   : BOOL;
    bFaultInput: BOOL;
    bReset     : BOOL;
END_VAR
VAR_OUTPUT
    bMotorRun  : BOOL;
    bFaultLatch: BOOL;
    nState     : INT;
END_VAR
VAR
    tStartDelay : TON;       (* Timer — has its own state *)
END_VAR

CASE nState OF
    0: (* IDLE *)
        IF bStartCmd AND NOT bFaultLatch THEN
            nState := 1;
        END_IF;

    1: (* STARTING *)
        bMotorRun := TRUE;
        tStartDelay(IN := TRUE, PT := T#3s);
        IF tStartDelay.Q THEN
            nState := 2;
        END_IF;
        IF bFaultInput THEN
            nState := 3;
        END_IF;

    2: (* RUNNING *)
        bMotorRun := TRUE;
        IF bStopCmd THEN
            nState   := 0;
            bMotorRun := FALSE;
            tStartDelay(IN := FALSE);
        END_IF;
        IF bFaultInput THEN
            nState := 3;
        END_IF;

    3: (* FAULT *)
        bMotorRun   := FALSE;
        bFaultLatch := TRUE;
        tStartDelay(IN := FALSE);
        IF bReset AND NOT bFaultInput THEN
            bFaultLatch := FALSE;
            nState      := 0;
        END_IF;
END_CASE;
END_FUNCTION_BLOCK`}</pre>

      <pre>{`(* Using the FUNCTION_BLOCK — in a PROGRAM *)
PROGRAM MainControl
VAR
    Motor1 : MotorControl;    (* Instance 1 *)
    Motor2 : MotorControl;    (* Instance 2 — completely independent state *)
END_VAR

(* Call each instance each scan *)
Motor1(
    bStartCmd   := bHMI_Motor1_Start,
    bStopCmd    := bHMI_Motor1_Stop,
    bFaultInput := bRelay_Motor1_OL,
    bReset      := bHMI_FaultReset
);

Motor2(
    bStartCmd   := bHMI_Motor2_Start,
    bStopCmd    := bHMI_Motor2_Stop,
    bFaultInput := bRelay_Motor2_OL,
    bReset      := bHMI_FaultReset
);

(* Read outputs *)
bMotor1_Running := Motor1.bMotorRun;
bMotor2_Running := Motor2.bMotorRun;`}</pre>

      <FunFact index={9} />

      <Callout type="field" title="No Recursion Allowed">
        IEC 61131-3 explicitly forbids recursive calls — a FUNCTION or FUNCTION_BLOCK cannot call itself, directly or indirectly. This ensures deterministic stack usage, which is required for real-time systems. If you think you need recursion, redesign using iteration. The compiler will catch recursive calls and reject them.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">OOP Extensions (IEC 61131-3 3rd Edition)</h2>
      <p>
        The third edition added methods, properties, and inheritance to FUNCTION_BLOCKs. A METHOD is like a class method — it runs within the context of an FB instance and has access to its state. A PROPERTY is a getter/setter pair. EXTENDS allows one FB to inherit from another.
      </p>
      <p>
        CODESYS supports these fully. ACSELERATOR RTAC support depends on firmware version — check your specific RTAC documentation before designing around these features.
      </p>

      <div className="rounded-2xl p-5 my-6" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}>
        <p className="text-sm italic text-slate-300">"{ANALOGIES.pou.text}"</p>
        <p className="text-xs text-blue-400 mt-2">— {ANALOGIES.pou.author}</p>
      </div>

      <QuizLevels chapterId="pou" />

      <ChapterExercise exercise={IEC_CHAPTER_EXERCISES.pou} />
    </ChapterLayout>
  )
}
