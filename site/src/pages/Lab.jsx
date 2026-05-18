import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import CodeLab from '../components/CodeLab'
import { ANALOGIES } from '../data/chapters'
import { IEC_LAB } from '../data/labExercises'

export default function Lab() {
  return (
    <ChapterLayout
      chapterId="lab"
      title="Lab & Practice"
      emoji="🧪"
      prev="troubleshoot"
    >
      <section>
        <h2 className="text-xl font-bold text-white mb-2">IEC 61131-3 Code Lab</h2>
        <p className="text-slate-400">
          Six exercises across three levels: validate IEC data types, emulate a TON timer, implement
          R_TRIG/F_TRIG edge detection with a scan cycle simulator, build an SFC interpreter,
          program a dual-channel safety interlock, and execute Instruction List (IL) programs.
        </p>
      </section>

      <CodeLab exercises={IEC_LAB} />

      <p>
        There is exactly one way to learn IEC 61131-3 programming: write programs. Reading about Structured Text syntax does not build the intuition for scan-cycle thinking, state machine design, or FB instance management. You need to run code, break things, fix them, and understand why they broke.
      </p>
      <p>
        The good news is that everything you need for practice is free.
      </p>

      <Callout type="key" title="Free Tools You Need to Install Today">
        <ul className="space-y-1 list-disc list-inside">
          <li><strong>CODESYS</strong> — Full IEC 61131-3 IDE with built-in soft PLC simulator. Free for development. Download at codesys.com.</li>
          <li><strong>OpenPLC Runtime</strong> — Open-source IEC 61131-3 runtime. Runs on Linux, Windows, Raspberry Pi. Free. openplcproject.com.</li>
          <li><strong>OpenPLC Editor</strong> — Paired editor for OpenPLC. Supports LD, FBD, ST, SFC. Free.</li>
          <li><strong>BEREMIZ</strong> — Python-based open source IEC 61131-3 IDE. beremiz.org.</li>
        </ul>
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Exercise 1: Motor Interlock in Ladder Diagram</h2>
      <p>
        Start here. Build a motor start/stop interlock in ladder diagram. This is the canonical PLC exercise — every PLC engineer has built this.
      </p>

      <pre>{`Requirements:
- BOOL inputs: bStart, bStop, bEmergencyStop, bFaultReset
- BOOL inputs: bOverloadRelay (TRUE = fault present)
- BOOL outputs: bMotorRun, bFaultLamp, bReadyLamp

Logic:
1. Motor starts when bStart is pressed AND bEmergencyStop is NOT active
   AND no fault is present
2. Motor latches ON (keeps running after bStart releases)
3. Motor stops when bStop is pressed OR bEmergencyStop is active
4. If bOverloadRelay activates while running, latch fault and stop motor
5. Fault lamp stays ON until bFaultReset is pressed and fault is cleared
6. Ready lamp = no fault AND not running (available to start)

Build this in LD. Then verify behavior by simulation in CODESYS.`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Exercise 2: Same Logic in Structured Text</h2>
      <p>
        Take the exact same motor interlock and implement it in ST using a CASE state machine. The behavior must be identical to the LD version.
      </p>

      <pre>{`(* Suggested state structure *)
CASE nMotorState OF
    0: (* IDLE / READY *)
       bMotorRun  := FALSE;
       bReadyLamp := NOT bFaultLatch;
       IF bStart AND NOT bEmergencyStop AND NOT bFaultLatch THEN
           nMotorState := 1;
       END_IF;

    1: (* RUNNING *)
       bMotorRun  := TRUE;
       bReadyLamp := FALSE;
       IF bStop OR bEmergencyStop THEN
           nMotorState := 0;
       END_IF;
       IF bOverloadRelay THEN
           bFaultLatch := TRUE;
           nMotorState := 2;
       END_IF;

    2: (* FAULT *)
       bMotorRun  := FALSE;
       bFaultLamp := TRUE;
       IF bFaultReset AND NOT bOverloadRelay THEN
           bFaultLatch := FALSE;
           bFaultLamp  := FALSE;
           nMotorState := 0;
       END_IF;
END_CASE;`}</pre>

      <FunFact index={1} />

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Exercise 3: Encapsulate as a FUNCTION_BLOCK</h2>
      <p>
        Take your ST motor interlock and encapsulate it in a FUNCTION_BLOCK named <code>FB_MotorInterlock</code>. Then instantiate it three times in a PROGRAM to control three independent motors. Verify that each instance has independent state.
      </p>

      <pre>{`FUNCTION_BLOCK FB_MotorInterlock
VAR_INPUT
    bStart        : BOOL;
    bStop         : BOOL;
    bEmergencyStop: BOOL;
    bFaultInput   : BOOL;
    bFaultReset   : BOOL;
END_VAR
VAR_OUTPUT
    bMotorRun     : BOOL;
    bFaultLamp    : BOOL;
    bReadyLamp    : BOOL;
END_VAR
VAR
    nState        : INT := 0;
    bFaultLatch   : BOOL := FALSE;
END_VAR
(* ... your CASE logic ... *)
END_FUNCTION_BLOCK

(* In PROGRAM: *)
PROGRAM MotorControl
VAR
    Motor1 : FB_MotorInterlock;
    Motor2 : FB_MotorInterlock;
    Motor3 : FB_MotorInterlock;
END_VAR
(* Call each instance each scan *)
END_PROGRAM`}</pre>

      <Callout type="pro" title="Add a Timer to the Fault Logic">
        Once you have the basic FB working, add a TON timer instance inside it for a start-failure detection: if the motor doesn't confirm running within 5 seconds of bMotorRun going TRUE, latch a fault. This teaches you timer FB instantiation inside an FB — a pattern you will use constantly on RTAC projects.
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Exercise 4: FBD Implementation</h2>
      <p>
        In CODESYS, draw the motor interlock logic using Function Block Diagram. Use AND, OR, NOT blocks for the boolean logic. Use Set/Reset FBs for the latch. Compare the FBD graphical representation with your ST CASE implementation — notice that the parallel nature of FBD makes the combinational logic visible but makes state machine flow less obvious.
      </p>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Exercise 5: Analog Scaling FUNCTION</h2>
      <p>
        Write a FUNCTION named <code>FC_ScaleAnalog</code> that scales a raw analog value from one range to an engineering unit range. Use it in a PROGRAM to process three different analog inputs with different scale factors.
      </p>

      <pre>{`(* Test cases for FC_ScaleAnalog:
   Raw 0-4095 (12-bit ADC) → 0.0-100.0 bar
   Raw 0-32767 (15-bit) → -100.0 to +100.0 °C
   Raw 4000-20000 (4-20mA, 0-27648 range) → 0.0-138.0 kV

Verify:
   ScaleAnalog(2047.5, 0, 4095, 0, 100) = 50.0
   ScaleAnalog(0, 0, 4095, 0, 100) = 0.0
   ScaleAnalog(4095, 0, 4095, 0, 100) = 100.0
   ScaleAnalog(0, 0, 32767, -100, 100) = -100.0
*)`}</pre>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Exercise 6: SFC Startup Sequence</h2>
      <p>
        Implement a substation equipment startup sequence in SFC (or as a CASE state machine in ST if your platform doesn't support native SFC). The sequence: (1) verify all permissives, (2) close bus tie breaker, (3) wait 2 seconds, (4) energize bus, (5) verify bus voltage, (6) signal ready. Include a timeout at each step that goes to a fault state if the step doesn't complete in the allotted time.
      </p>

      <GifCard gifKey="done" caption="Commissioning complete, all tags green" side="right" body="Six exercises across six language domains: LD contacts and coils, ST data manipulation, FBD signal routing, SFC state machines, POU structuring, and RTAC-specific SELOGIC. Engineers who complete all six have touched every pattern they will encounter in substation automation work." />

      <div className="rounded-2xl p-5 my-6" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}>
        <p className="text-sm italic text-slate-300">"{ANALOGIES.lab.text}"</p>
        <p className="text-xs text-blue-400 mt-2">— {ANALOGIES.lab.author}</p>
      </div>

      <Callout type="field" title="The RTAC Transfer Checklist">
        Before taking any RTAC project from CODESYS/simulation to ACSELERATOR/hardware:
        <ol className="mt-2 space-y-1 list-decimal list-inside text-sm">
          <li>Replace standard IEC FBs with SEL equivalents (timers, etc.) where required</li>
          <li>Map all global variables to RTAC data model points in ACSELERATOR</li>
          <li>Configure task scan periods appropriately for logic complexity</li>
          <li>Mark all setpoints and critical state variables as RETAIN</li>
          <li>Test in ACSELERATOR simulation mode before connecting to hardware</li>
          <li>Review scan time utilization after first compile — address any overrun warnings</li>
          <li>Document all forced values used during testing and clear them before handover</li>
        </ol>
      </Callout>

      <h2 className="text-xl font-bold text-blue-400 mt-8 mb-3">Where to Go Next</h2>
      <p>
        After completing the exercises in this guide:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-300">
        <li>Download the SEL RTAC instruction manual for your specific firmware version from selinc.com and read the IEC 61131-3 chapter completely.</li>
        <li>Work through the SEL application guide for IEC 61850 GOOSE publishing — it walks through a complete RTAC configuration with IEC 61131-3 integration.</li>
        <li>Build a complete protection logic application: overcurrent trip in ST, breaker failure logic in LD, data quality check in FBD.</li>
        <li>Take the SEL University RTAC configuration course — it covers the ACSELERATOR-specific aspects that go beyond the IEC standard itself.</li>
      </ul>

      <QuizLevels chapterId="lab" />
    </ChapterLayout>
  )
}
