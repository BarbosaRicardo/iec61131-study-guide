import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import Quiz from '../components/Quiz'
import ChapterExercise from '../components/ChapterExercise'
import { ANALOGIES } from '../data/chapters'
import { QUIZZES } from '../data/quizzes'
import { IEC_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function StructuredText() {
  return (
    <ChapterLayout
      chapterId="st"
      title="Structured Text (ST)"
      emoji="💻"
      prev="datatypes"
      next="ld"
    >
      <p>
        Structured Text is the most expressive language in IEC 61131-3. It looks like Pascal and behaves like a very well-disciplined version of C — with mandatory semicolons, explicit type declarations, and no pointer arithmetic. If you have written any procedural code in your life, ST will feel familiar within an hour.
      </p>
      <p>
        On the SEL RTAC, ST is the primary language. Most engineers who program RTACs write almost exclusively in ST, occasionally calling Function Block instances for timers, counters, and SEL-specific protocol functions.
      </p>

      <Callout type="key" title="Assignment Is :=, Not =">
        In ST, assignment is <code>:=</code>. The equals sign <code>=</code> is used only for comparison in expressions. Using <code>=</code> when you mean <code>:=</code> is a compile error. This is one of the first things new ST programmers encounter and it trips everyone up exactly once.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Basic Syntax</h2>

      <pre>{`(* This is a block comment — spans multiple lines *)
// This is a line comment

PROGRAM MotorInterlock
VAR
    bPermissive  : BOOL;
    bRunCmd      : BOOL;
    bFaultActive : BOOL;
    rVoltage     : REAL;
    nCount       : INT := 0;
END_VAR

(* Assignment operator is := not = *)
bPermissive := TRUE;
nCount      := nCount + 1;
rVoltage    := 13.8;

(* Comparison uses = *)
IF bPermissive = TRUE THEN
    bRunCmd := TRUE;
END_IF;`}</pre>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">IF / THEN / ELSIF / ELSE / END_IF</h2>

      <pre>{`(* Conditional logic *)
IF rVoltage > 14.4 THEN
    bOvervoltage := TRUE;
    bRunCmd      := FALSE;
ELSIF rVoltage < 12.0 THEN
    bUndervoltage := TRUE;
    bRunCmd       := FALSE;
ELSE
    bOvervoltage  := FALSE;
    bUndervoltage := FALSE;
    bRunCmd       := bPermissive AND NOT bFaultActive;
END_IF;`}</pre>

      <Callout type="warning" title="END_IF Requires a Semicolon">
        Every statement terminator in ST is a semicolon. <code>END_IF;</code> not <code>END_IF</code>. Same for <code>END_FOR;</code>, <code>END_CASE;</code>, <code>END_WHILE;</code>. Missing a semicolon is a compile error on all platforms. ACSELERATOR RTAC will tell you exactly which line.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">CASE / OF / END_CASE</h2>
      <p>
        CASE is the ST equivalent of a switch statement. Use it for state machines and enumeration-based logic. It is far more readable than a chain of ELSIF statements when you have more than three conditions.
      </p>

      <pre>{`(* State machine using CASE *)
CASE nState OF
    0: (* IDLE *)
        bRunCmd    := FALSE;
        bFaultLamp := FALSE;
        IF bStartCmd AND bPermissive THEN
            nState := 1;
        END_IF;

    1: (* STARTING *)
        bRunCmd := TRUE;
        tStartTimer(IN := TRUE, PT := T#5s);
        IF tStartTimer.Q THEN
            nState := 2;
        END_IF;

    2: (* RUNNING *)
        bRunCmd := TRUE;
        IF bStopCmd OR bFaultActive THEN
            nState := 3;
        END_IF;

    3: (* STOPPING *)
        bRunCmd := FALSE;
        tStartTimer(IN := FALSE);
        nState  := 0;

    ELSE
        nState := 0; (* Catch unknown states *)
END_CASE;`}</pre>

      <FunFact index={6} />

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">FOR Loop</h2>

      <pre>{`(* FOR loop — bounded iteration *)
VAR
    i        : INT;
    arData   : ARRAY[0..9] OF REAL;
    rSum     : REAL := 0.0;
    rAverage : REAL;
END_VAR

FOR i := 0 TO 9 DO
    rSum := rSum + arData[i];
END_FOR;
rAverage := rSum / 10.0;

(* FOR with BY (step) *)
FOR i := 0 TO 8 BY 2 DO
    arData[i] := 0.0;  (* Zero even indices *)
END_FOR;`}</pre>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">WHILE and REPEAT Loops</h2>

      <pre>{`(* WHILE — checks condition before each iteration *)
WHILE nCount < 10 DO
    nCount := nCount + 1;
END_WHILE;

(* REPEAT — checks condition after each iteration (always runs once) *)
REPEAT
    nCount := nCount + 1;
UNTIL nCount >= 10
END_REPEAT;`}</pre>

      <Callout type="field" title="Infinite Loops Will Trip Your Watchdog">
        IEC 61131-3 does not prevent infinite loops. A <code>WHILE TRUE DO</code> with no exit condition will spin forever, consuming your entire scan time and triggering a watchdog trip on the RTAC. The RTAC will restart the IEC 61131-3 runtime. Every PLC programmer learns this the hard way once. Now you know beforehand.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Calling Function Blocks in ST</h2>
      <p>
        When you use a Function Block like a timer or counter, you must first declare an instance of it as a variable, then call it each scan with its inputs. This is the central pattern of ST programming on any IEC 61131-3 platform.
      </p>

      <pre>{`VAR
    tOnDelay  : TON;   (* Timer On-Delay instance *)
    tOffDelay : TOF;   (* Timer Off-Delay instance *)
    cCounter  : CTU;   (* Count Up counter instance *)
END_VAR

(* Call the timer each scan — update inputs, read outputs *)
tOnDelay(
    IN := bRunCmd,
    PT := T#5s
);

(* Read timer output *)
IF tOnDelay.Q THEN
    bTimedOut := TRUE;
END_IF;

(* Counter *)
cCounter(
    CU := bPulseInput,
    R  := bReset,
    PV := 100
);
nCurrentCount := cCounter.CV; (* Current value *)`}</pre>

      <GifCard gifKey="nerd" caption="When ST finally compiles on the first try" side="right" />

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Operators and Expressions</h2>

      <pre>{`(* Arithmetic *)
rResult := (rA + rB) * rC / 2.0;

(* Comparison — returns BOOL *)
bEqual   := (nA = nB);
bNotEq   := (nA <> nB);
bGreater := (nA > nB);
bLess    := (nA < nB);

(* Logical — operate on BOOL *)
bOut := bA AND bB;
bOut := bA OR bB;
bOut := NOT bA;
bOut := bA XOR bB;

(* Bitwise — operate on BYTE/WORD/DWORD *)
wResult := wA AND wB;   (* Bitwise AND *)
wResult := wA OR wB;    (* Bitwise OR *)
wResult := wA XOR wB;   (* Bitwise XOR *)
wResult := NOT wA;      (* Bitwise NOT *)
wResult := SHL(wA, 2);  (* Shift left 2 bits *)
wResult := SHR(wA, 2);  (* Shift right 2 bits *)`}</pre>

      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 my-6">
        <p className="text-sm italic text-purple-800">"{ANALOGIES.st.text}"</p>
        <p className="text-xs text-purple-500 mt-2">— {ANALOGIES.st.author}</p>
      </div>

      <Callout type="pro" title="Use Comments Aggressively">
        ST code without comments is maintenance debt. Power system code runs for 20+ years. The engineer who reads your code in 2044 may not have access to any context about why that trip threshold is 95% instead of 100%. Comment every non-obvious decision. Your future self is also in this audience.
      </Callout>

      {QUIZZES.st && QUIZZES.st.length > 0 && (
        <Quiz chapterId="st" questions={QUIZZES.st} level={1} />
      )}

      <ChapterExercise exercise={IEC_CHAPTER_EXERCISES.st} />
    </ChapterLayout>
  )
}
