import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import { ANALOGIES } from '../data/chapters'

export default function DataTypes() {
  return (
    <ChapterLayout
      chapterId="datatypes"
      title="Data Types & Variables"
      emoji="🔢"
      prev="intro"
      next="st"
    >
      <p>
        IEC 61131-3 is strongly typed. This means you cannot assign a REAL value to an INT variable without an explicit type conversion function. At first this feels like the language is arguing with you. By the third time it catches a real engineering error, you will appreciate it.
      </p>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Elementary Data Types</h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200 my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-700 text-white">
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Size</th>
              <th className="px-4 py-3 text-left font-semibold">Range / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ['BOOL', '1 bit', 'TRUE or FALSE. The workhorse of PLC logic.'],
              ['BYTE', '8 bits', '0–255. Unsigned. Used for bit manipulation.'],
              ['WORD', '16 bits', '0–65535. Unsigned. Common for status registers.'],
              ['DWORD', '32 bits', '0–4294967295. Unsigned. Large bit fields.'],
              ['INT', '16 bits', '−32768 to +32767. Signed integer.'],
              ['DINT', '32 bits', '−2,147,483,648 to +2,147,483,647. Signed.'],
              ['UINT', '16 bits', '0–65535. Unsigned integer.'],
              ['UDINT', '32 bits', '0–4294967295. Unsigned.'],
              ['REAL', '32 bits', 'IEEE 754 single precision float. ~7 sig. digits.'],
              ['LREAL', '64 bits', 'IEEE 754 double precision float. ~15 sig. digits.'],
              ['TIME', '32 bits', 'Duration. Literal: T#5s, T#500ms, T#1m30s'],
              ['DATE', '32 bits', 'Calendar date. Literal: D#2026-05-09'],
              ['STRING', 'variable', 'Fixed-length. Default STRING[80]. 1 byte/char.'],
            ].map(([type, size, notes], i) => (
              <tr key={type} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-2.5 font-mono font-bold text-morange-500">{type}</td>
                <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">{size}</td>
                <td className="px-4 py-2.5 text-slate-700">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="STRING Truncation Is Silent">
        Assigning a 25-character string to a <code>STRING[20]</code> variable does not throw an exception on most platforms — including ACSELERATOR RTAC. The extra characters are silently discarded. Always declare STRING variables with adequate length, or you will spend an evening wondering why your DNP3 device name shows up truncated in the SCADA.
      </Callout>

      <FunFact index={5} />

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Variable Declaration Sections</h2>
      <p>
        Every POU in IEC 61131-3 declares its variables in typed sections at the top of the code block. This is not optional and not stylistic — it is required syntax. The sections define the variable's scope, direction, and storage behavior.
      </p>

      <pre>{`(* Variable declaration sections in a FUNCTION_BLOCK *)
FUNCTION_BLOCK MotorControl
VAR_INPUT
    bStart     : BOOL;         (* Start command from HMI *)
    bStop      : BOOL;         (* Stop command from HMI *)
    bFaultReset: BOOL;         (* Fault reset command *)
END_VAR

VAR_OUTPUT
    bRunning   : BOOL;         (* Motor running status *)
    bFault     : BOOL;         (* Fault present *)
END_VAR

VAR
    bInternalState : BOOL;     (* Internal — not visible outside FB *)
    tStartDelay    : TON;      (* Timer instance *)
    nStartCount    : DINT := 0;(* Initialized to 0 *)
END_VAR

VAR RETAIN
    nTotalStarts   : DINT;     (* Survives power cycle *)
END_VAR`}</pre>

      <div className="overflow-x-auto rounded-xl border border-slate-200 my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-4 py-3 text-left font-semibold">Section</th>
              <th className="px-4 py-3 text-left font-semibold">Scope</th>
              <th className="px-4 py-3 text-left font-semibold">Writable by caller?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ['VAR', 'Local to POU', 'No — internal only'],
              ['VAR_INPUT', 'Readable by POU, set by caller', 'Yes — caller writes on each call'],
              ['VAR_OUTPUT', 'Written by POU, read by caller', 'No — POU writes, caller reads'],
              ['VAR_IN_OUT', 'Passed by reference', 'Yes — bidirectional'],
              ['VAR_GLOBAL', 'Shared across all POUs', 'Any POU with access'],
              ['VAR RETAIN', 'Survives power cycle (NVM)', 'Same as VAR'],
              ['VAR CONSTANT', 'Read-only within POU', 'Never writable'],
            ].map(([sec, scope, write], i) => (
              <tr key={sec} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-2.5 font-mono font-bold text-mcyan-500">{sec}</td>
                <td className="px-4 py-2.5 text-slate-700">{scope}</td>
                <td className="px-4 py-2.5 text-slate-500 text-xs">{write}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="key" title="RETAIN Variables — The Power Cycle Trap">
        A <code>VAR RETAIN</code> variable is stored in battery-backed or flash NVM and survives power loss. Use RETAIN for setpoints, accumulated totals, and configuration values that must persist. Forget to mark a trip counter as RETAIN and your post-fault analysis data evaporates with every power cycle. Ask how anyone knows this.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">VAR_GLOBAL and Global Variable Lists</h2>
      <p>
        Global variables are declared outside any POU, typically in a Global Variable List (GVL) file. They are accessible from any POU in the project with an access declaration. In ACSELERATOR RTAC, global variables are how you share data between IEC 61131-3 tasks and the protocol data model (DNP3 points, IEC 61850 data objects).
      </p>

      <pre>{`(* Global Variable List — GVL_System *)
VAR_GLOBAL
    gBus1_Voltage      : REAL;      (* kV, from relay analog *)
    gBus1_Current      : REAL;      (* A, from relay analog *)
    gBreaker1_Status   : BOOL;      (* TRUE = closed *)
    gTrip_Command      : BOOL;      (* TRUE = trip *)
    gAlarm_Active      : BOOL;      (* Any alarm present *)
END_VAR`}</pre>

      <Callout type="field" title="Global Variable Naming Convention">
        On real RTAC projects, use a consistent prefix scheme for globals. A common convention: <code>g</code> prefix for globals, subsystem abbreviation, signal name. For example: <code>gB1_Volts</code> (Bus 1 Voltage). You will have hundreds of globals on a real project. Find a naming convention before you start, not after.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Type Conversion Functions</h2>
      <p>
        Because IEC 61131-3 is strongly typed, you must use explicit conversion functions when assigning across types. There are no implicit conversions for values (only widening conversions are sometimes permitted in expression contexts, depending on vendor).
      </p>

      <pre>{`(* Type conversion examples in ST *)
VAR
    nInt    : INT;
    rReal   : REAL;
    nDint   : DINT;
    sStr    : STRING[20];
END_VAR

nInt  := 42;
rReal := INT_TO_REAL(nInt);    (* INT → REAL *)
nDint := INT_TO_DINT(nInt);    (* INT → DINT widening *)
nInt  := REAL_TO_INT(rReal);   (* Rounds to nearest *)
sStr  := INT_TO_STRING(nInt);  (* Integer to string *)
rReal := STRING_TO_REAL(sStr); (* Parse string as float *)`}</pre>

      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 my-6">
        <p className="text-sm italic text-purple-800">"{ANALOGIES.datatypes.text}"</p>
        <p className="text-xs text-purple-500 mt-2">— {ANALOGIES.datatypes.author}</p>
      </div>
    </ChapterLayout>
  )
}
