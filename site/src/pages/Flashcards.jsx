import React, { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight, Check, X, BookOpen, Keyboard } from 'lucide-react'

const STORAGE_KEY = 'iec61131_flashcard_v1'

const FLASHCARD_CHAPTERS = [
  { id: 'all', label: 'All Topics' },
  { id: 'languages', label: '💻 Five Languages' },
  { id: 'datatypes', label: '📐 Data Types' },
  { id: 'functions', label: '⚙️ Function Blocks' },
  { id: 'sfc', label: '🔄 Sequential Function Charts' },
  { id: 'safety', label: '🛡️ Safety & Best Practices' },
]

const FLASHCARDS = [
  // FIVE LANGUAGES
  { id: 'l01', chapter: 'languages', front: 'Five IEC 61131-3 programming languages', back: 'IEC 61131-3 defines five programming languages: (1) LD — Ladder Diagram (graphical, relay logic; most common in North America). (2) FBD — Function Block Diagram (graphical, data-flow oriented; common in process industry). (3) ST — Structured Text (textual, Pascal-like; most expressive). (4) IL — Instruction List (textual, assembly-like; largely obsolete, removed from 3rd edition). (5) SFC — Sequential Function Chart (graphical, state-machine; complex sequences).' },
  { id: 'l02', chapter: 'languages', front: 'Ladder Diagram (LD)', back: 'LD is the most widely used PLC language, modeled after electrical relay ladder diagrams. Each rung has left and right power rails. Contacts (inputs) on the left: normally open (—|  |—), normally closed (—|/|—). Coils (outputs) on the right: standard (—( )—), set (—(S)—), reset (—(R)—). Execution: left-to-right, top-to-bottom, one rung per scan. Strengths: familiar to electricians, great for interlock logic. Weakness: complex math or strings are awkward.' },
  { id: 'l03', chapter: 'languages', front: 'Function Block Diagram (FBD)', back: 'FBD is a graphical language where function blocks are drawn as boxes with inputs on the left and outputs on the right. Data flows between blocks via connecting lines. Example: an AND block takes two BOOL inputs and outputs one BOOL. FBD excels at signal processing, PID loops, and data transformation sequences. Execution order is determined by data flow dependencies, not left-to-right scanning. Common in DCS and process control PLCs.' },
  { id: 'l04', chapter: 'languages', front: 'Structured Text (ST)', back: 'ST is a textual language similar to Pascal or Ada. It supports: assignment (:=), arithmetic (+,-,*,/,MOD,**), comparison (=, <>, <, >, <=, >=), Boolean (AND, OR, NOT, XOR), IF-THEN-ELSIF-ELSE-END_IF, CASE-OF-ELSE-END_CASE, FOR-TO-BY-DO-END_FOR, WHILE-DO-END_WHILE, REPEAT-UNTIL-END_REPEAT. Can call functions and function blocks. Most flexible IEC 61131-3 language. Preferred for complex algorithms, string handling, math.' },
  { id: 'l05', chapter: 'languages', front: 'Sequential Function Chart (SFC)', back: 'SFC is a graphical state-machine language. It consists of: Steps (rectangular boxes — each represents a stable state; actions execute while the step is active), Transitions (horizontal bars — boolean conditions that trigger moving to the next step), and Directed Links (lines connecting steps to transitions). Entry point: the Initial Step (double border). SFC is IEC 848 / Grafcet derived. Best for multi-step batch sequences, startup/shutdown procedures.' },
  { id: 'l06', chapter: 'languages', front: 'Instruction List (IL)', back: 'IL is a low-level textual language resembling assembly. It uses an accumulator (result register): LD loads a value, ST stores, AND/OR/XOR perform logic, ADD/SUB/MUL/DIV do math, JMPC jumps conditionally, CALC conditionally calls a function. IL was defined in the 2nd edition; the 3rd edition (2013) marks it as obsolete. It remains in many legacy systems. Most manufacturers still support it but new code should use ST instead.' },
  { id: 'l07', chapter: 'languages', front: 'LD normally open vs normally closed contact', back: 'Normally Open (NO): —|  |— passes power (logic 1) only when the associated variable is TRUE. Like a push-button that closes when pressed. Normally Closed (NC): —|/|— passes power when the associated variable is FALSE. Like a safety interlock that opens when fault is detected. A rung with multiple contacts in series = logical AND. Contacts in parallel branches = logical OR. Mixing series and parallel creates complex logic.' },
  { id: 'l08', chapter: 'languages', front: 'FBD vs LD — when to use which', back: 'LD is preferred for: interlock logic, relay replacement, simple sequential control, maintenance electricians who read it. FBD is preferred for: analog signal processing, PID control, data conversion chains, systems where data flow visualization aids understanding. ST is preferred for: complex math, string operations, large state machines, any algorithm that would be incomprehensible in a graphical language. SFC is preferred for: multi-step sequences with clear states and transitions.' },
  { id: 'l09', chapter: 'languages', front: 'ST assignment vs comparison', back: 'ST assignment uses := (colon-equals): xMotorRun := TRUE; copies the value. ST comparison uses = (single equals): IF xMotorRun = TRUE THEN — evaluates to BOOL. A common bug: using = instead of := in an assignment silently compiles as a comparison (the result is discarded). In ST: xValve := (xPressure > 50.0) AND NOT xInterlock; is a valid assignment of a BOOL expression. The := operator is the only way to store a value.' },
  { id: 'l10', chapter: 'languages', front: 'IL accumulator model', back: 'IL operates on a single implicit accumulator (RESULT register). Instructions: LD xVar — loads xVar into accumulator. AND xOther — ANDs xOther with accumulator. ST xOutput — stores accumulator to xOutput. JMPC Label — jumps to Label if accumulator is TRUE. Example: LD Start / AND NOT Stop / OR Run / ST Run implements a start-stop latch. Each instruction modifies or uses the accumulator; results chain implicitly.' },

  // DATA TYPES
  { id: 'dt01', chapter: 'datatypes', front: 'Elementary data types in IEC 61131-3', back: 'BOOL (1 bit: TRUE/FALSE). Integer family: SINT (8-bit signed, -128 to 127), INT (16-bit signed, -32768 to 32767), DINT (32-bit signed, -2^31 to 2^31-1), LINT (64-bit signed). Unsigned: USINT, UINT, UDINT, ULINT. Real: REAL (32-bit float), LREAL (64-bit double). Bit strings: BYTE (8-bit), WORD (16-bit), DWORD (32-bit), LWORD (64-bit). Time: TIME, DATE, TIME_OF_DAY, DATE_AND_TIME. String: STRING (variable-length ASCII).' },
  { id: 'dt02', chapter: 'datatypes', front: 'BYTE vs BOOL vs INT in PLCs', back: 'BOOL: single bit, logic only — use for status flags, interlock signals. BYTE: 8-bit bit string — use for register bytes, packed I/O, protocol bytes. No arithmetic semantics — BYTEs can be ANDed/ORed but not added as numbers. INT: 16-bit signed integer — arithmetic operations defined. Mixing types requires explicit type conversion: WORD_TO_INT(), INT_TO_REAL(). Implicit conversions vary by vendor — always cast explicitly for portability.' },
  { id: 'dt03', chapter: 'datatypes', front: 'TIME literal syntax', back: 'TIME literals use the prefix T# or TIME#. Examples: T#5s (5 seconds), T#10m30s (10 minutes 30 seconds), T#1h (1 hour), T#500ms (500 milliseconds), T#1d2h3m4s5ms (complex). TIME values represent durations (not timestamps). Arithmetic: TIME values can be added and subtracted. TON preset is TIME type. Internally stored as milliseconds in most implementations. DATE# and DT# similarly prefix date/datetime literals.' },
  { id: 'dt04', chapter: 'datatypes', front: 'Enumeration data types (ENUM)', back: 'ENUMs define a named set of ordered integer constants. Declaration: TYPE Color : (Red, Green, Blue) END_TYPE — Red=0, Green=1, Blue=2. Variables: xLightColor : Color := Red. ENUMs improve readability vs raw integers. In ST: IF xLightColor = Green THEN... Comparison is type-checked at compile time — prevents assigning a speed value to a color variable. Supported in IEC 61131-3 3rd edition; support varies by vendor.' },
  { id: 'dt05', chapter: 'datatypes', front: 'STRUCT data type', back: 'STRUCT groups multiple variables into a single type. Declaration: TYPE MotorData : STRUCT xRunning : BOOL; rSpeed : REAL; iCurrent : INT; END_STRUCT END_TYPE. Usage: xMotor1 : MotorData. Access: xMotor1.xRunning := TRUE. STRUCTs can be passed as a single parameter to functions. Arrays of STRUCTs enable data tables. Equivalent to a C struct. Essential for organizing related data in large programs.' },
  { id: 'dt06', chapter: 'datatypes', front: 'Array declarations', back: 'Arrays: arrData : ARRAY[0..9] OF INT — 10-element array of INT indexed 0 to 9. Multi-dimensional: arrMatrix : ARRAY[1..3, 1..3] OF REAL. Access: arrData[0] := 42; rVal := arrMatrix[2,2]. Arrays can hold any elementary or derived type. Array size must be known at compile time (no dynamic arrays in standard IEC 61131-3). Many vendors limit array index to start at 0 or 1 — check your target platform.' },
  { id: 'dt07', chapter: 'datatypes', front: 'VAR declaration sections', back: 'IEC 61131-3 variable declarations: VAR — local to the POU, persistent across scans. VAR_INPUT — values received from the caller (read-only inside FB). VAR_OUTPUT — values sent to the caller. VAR_IN_OUT — bidirectional, passed by reference. VAR_EXTERNAL — reference to a global variable. VAR_GLOBAL — global scope, accessed by multiple POUs. VAR RETAIN — survives power loss (stored in non-volatile memory). VAR CONSTANT — read-only named constant.' },
  { id: 'dt08', chapter: 'datatypes', front: 'Type conversion functions', back: 'IEC 61131-3 type conversions follow the pattern: FROMTYPE_TO_TOTYPE(). Examples: INT_TO_REAL(42) → 42.0, REAL_TO_INT(3.7) → 3 (truncation, not rounding), DINT_TO_WORD(65535) → 16#FFFF, BOOL_TO_INT(TRUE) → 1, INT_TO_STRING(42) → "42". Widening conversions (INT→DINT, REAL→LREAL) are always safe. Narrowing may lose data — the compiler typically warns. Always convert explicitly when mixing types in expressions.' },
  { id: 'dt09', chapter: 'datatypes', front: 'STRING type in IEC 61131-3', back: 'STRING stores ASCII character sequences. Default length is implementation-defined (often 80 chars). Fixed-length: STRING[20] limits to 20 characters. Operations: LEN(s) returns length, LEFT(s, n) returns leftmost n chars, RIGHT(s, n), MID(s, pos, n), CONCAT(s1, s2) concatenates, FIND(s1, s2) finds substring position. No dynamic allocation — strings are fixed-size at compile time. WSTRING handles Unicode (vendor extension in many PLCs).' },
  { id: 'dt10', chapter: 'datatypes', front: 'Hexadecimal and binary literals', back: 'Numeric literals with base prefixes: 16# = hexadecimal (16#FF = 255), 8# = octal (8#377 = 255), 2# = binary (2#11111111 = 255). Type-prefixed: BYTE#16#A0, WORD#16#FFFF, INT#-1. BOOL literals: TRUE and FALSE (not 1 and 0 — using integers as BOOLs is not standard; some vendors accept it). Time: T#1500ms. ENUMs referenced by name. Literal types must be compatible with the receiving variable type.' },

  // FUNCTION BLOCKS
  { id: 'fb01', chapter: 'functions', front: 'TON — Timer On Delay', back: 'TON: timer that delays turning on. Inputs: IN (BOOL, start signal), PT (TIME, preset time). Outputs: Q (BOOL, TRUE after PT elapsed while IN is TRUE), ET (TIME, elapsed time). Behavior: when IN goes TRUE, ET counts up from T#0. When ET >= PT, Q goes TRUE. When IN goes FALSE, ET and Q reset immediately. Use: start motor X seconds after command, delay alarm activation.' },
  { id: 'fb02', chapter: 'functions', front: 'TOF — Timer Off Delay', back: 'TOF: timer that delays turning off. Inputs: IN (BOOL), PT (TIME). Outputs: Q (BOOL), ET (TIME). Behavior: Q is TRUE whenever IN is TRUE. When IN goes FALSE, ET starts counting. When ET >= PT, Q goes FALSE. If IN goes TRUE again during the delay, ET resets. Use: fan runs for PT seconds after motor stops, coast-down time logic. Q is TRUE when IN is TRUE — opposite timing from TON.' },
  { id: 'fb03', chapter: 'functions', front: 'TP — Timer Pulse', back: 'TP: generates a fixed-duration output pulse. Inputs: IN (BOOL, trigger), PT (TIME, pulse duration). Outputs: Q (BOOL, output pulse), ET (TIME, elapsed). Behavior: on rising edge of IN, Q goes TRUE and ET counts to PT, then Q goes FALSE. Retriggering IN during the pulse has no effect — the pulse runs for exactly PT from the original trigger. Use: timed seal-in, fixed-duration output commands, one-shot watchdog pings.' },
  { id: 'fb04', chapter: 'functions', front: 'R_TRIG and F_TRIG edge detectors', back: 'R_TRIG (Rising Trigger): detects FALSE→TRUE transition. Input: CLK (BOOL). Output: Q (BOOL, TRUE for exactly one scan cycle when CLK rises). F_TRIG (Falling Trigger): detects TRUE→FALSE transition. Both are function blocks — they have instance memory (internal M_Q state) to compare current vs previous CLK state. Critical: instantiate one R_TRIG or F_TRIG per detection point; sharing an instance across multiple points causes missed edges.' },
  { id: 'fb05', chapter: 'functions', front: 'SR and RS latches', back: 'SR (Set dominant): S input sets Q TRUE and holds it; R input resets Q FALSE. If both S and R are TRUE simultaneously, S wins (Q=TRUE). RS (Reset dominant): S sets Q TRUE; R resets Q FALSE. If both TRUE simultaneously, R wins (Q=FALSE). Both have outputs Q and Q1 (negated). Use SR for safety-critical applications where the set condition must win on simultaneous input. Use RS when the reset (safe state) must take priority.' },
  { id: 'fb06', chapter: 'functions', front: 'CTU — Count Up', back: 'CTU: counts rising edges of CU input. Inputs: CU (BOOL, count up trigger), R (BOOL, reset), PV (INT, preset value). Outputs: Q (BOOL, TRUE when CV >= PV), CV (INT, current count). CV increments by 1 on each CU rising edge. CV resets to 0 when R is TRUE. CV holds at max INT value (32767) when full. Use: count parts, cycles, events. Pair with CTD (count down) for up/down counting.' },
  { id: 'fb07', chapter: 'functions', front: 'Function (FC) vs Function Block (FB)', back: 'Function (FC): stateless, no internal memory, no instance. Inputs → output only. Same inputs always produce same output. Examples: SQRT(), ABS(), type conversions, standard mathematical operations. Function Block (FB): has state (instance data). Each FB call requires a named instance: TON_1 : TON. The instance stores internal state (ET counter, M_Q bit) between calls. FBs remember history; FCs do not. Use FB when state is needed; FC for pure computation.' },
  { id: 'fb08', chapter: 'functions', front: 'Standard function library', back: 'IEC 61131-3 standard functions include: Numeric: ABS, SQRT, EXP, LN, LOG, SIN, COS, TAN, ASIN, ACOS, ATAN, ATAN2. Arithmetic: ADD, MUL, SUB, DIV, MOD, EXPT. Comparison: GT, GE, EQ, LE, LT, NE. Selection: SEL (2-input mux), MUX (multi-input mux), LIMIT (clamp), MAX, MIN. String: LEN, LEFT, RIGHT, MID, CONCAT, INSERT, DELETE, REPLACE, FIND. Type conversion: INT_TO_REAL, REAL_TO_INT, etc. Bistable: SR, RS. Timers: TON, TOF, TP.' },
  { id: 'fb09', chapter: 'functions', front: 'Program Organization Units (POUs)', back: 'IEC 61131-3 defines three POU types: Program (PROGRAM) — the top-level POU linked to a task; can access global variables; only one instance per declaration. Function Block (FUNCTION_BLOCK) — reusable, stateful, must be instantiated before use; can contain timers, counters, sub-FBs. Function (FUNCTION) — stateless, returns exactly one value; can be called with parentheses like a mathematical function. POUs are the modular building blocks of all IEC 61131-3 programs.' },
  { id: 'fb10', chapter: 'functions', front: 'Calling a function block in ST', back: 'FB instances are declared in VAR section: myTimer : TON. Called in the code body: myTimer(IN:=xStart, PT:=T#5s); After the call, outputs are accessed: IF myTimer.Q THEN xDone := TRUE; The FB name followed by () is the call syntax; inputs are named parameters inside the parentheses. All unspecified inputs default to their initial values. The instance retains ET and Q state between calls across PLC scan cycles.' },
  { id: 'fb11', chapter: 'functions', front: 'Task configuration — cyclic vs event-driven', back: 'Tasks control when POUs execute. Cyclic task: runs every N milliseconds (e.g., every 10ms for fast I/O, every 100ms for slow HMI updates). Event-driven task: runs when a specific boolean variable triggers (useful for interrupt-driven logic). Priority: lower number = higher priority. Most PLCs allow 1-4 tasks. Fast tasks for safety/control, slow tasks for communication and diagnostics. Assign critical Programs to fast tasks; HMI-facing Programs to slower tasks.' },

  // SEQUENTIAL FUNCTION CHARTS
  { id: 'sfc01', chapter: 'sfc', front: 'SFC step and transition', back: 'Step: a rectangular box representing a stable state in the sequence. Active step executes its associated actions each scan. Transition: a horizontal line below each step containing a boolean condition. When the transition condition is TRUE and the preceding step is active, the token moves to the next step and the preceding step becomes inactive. Exactly one initial step (double border) is active at program start.' },
  { id: 'sfc02', chapter: 'sfc', front: 'SFC action qualifiers', back: 'Actions attached to SFC steps have qualifiers: N (Non-stored): action executes every scan while the step is active; stops immediately when step deactivates. S (Set): action is latched ON when step becomes active; stays active until explicitly reset. R (Reset): resets (deactivates) a previously set action. P (Pulse): executes for exactly one scan when step becomes active. D (Delayed): starts after a time delay. L (Limited): runs for a limited time. SD (Stored + Delayed). Most common in practice: N and S/R.' },
  { id: 'sfc03', chapter: 'sfc', front: 'SFC divergence and convergence', back: 'OR divergence (alternative branch): multiple transitions below one step; the first TRUE transition is taken — mutually exclusive paths. OR convergence: multiple paths merge back into one step. AND divergence (parallel/simultaneous branch): all branches become active simultaneously (a horizontal double line above). AND convergence: all parallel branches must complete before proceeding (double line below, token waits until all active). AND is used for concurrent operations; OR for conditional branching.' },
  { id: 'sfc04', chapter: 'sfc', front: 'SFC token model', back: 'SFC uses a "token" metaphor. A token in a step means that step is active. At startup, the token is in the Initial Step. When a transition fires, the token moves forward. In an AND divergence, the token is duplicated — one per parallel branch. In an AND convergence, all tokens must arrive before a single token proceeds. Tokens cannot "stack" in a step (each step is either active or not). Tokens enable visual tracing of sequence state during debugging.' },
  { id: 'sfc05', chapter: 'sfc', front: 'SFC in IEC 61131-3 vs Grafcet', back: 'Grafcet (IEC 848) was the predecessor standard from which SFC was derived. The core concepts are identical: steps, transitions, AND/OR divergence. Key differences: IEC 61131-3 SFC integrates with the other four languages (actions can be written in LD, FBD, or ST). Grafcet is a standalone graphical notation. IEC 61131-3 SFC adds explicit action qualifiers (N, S, R, P, D, L, SD) not originally in Grafcet. All modern PLCs use IEC 61131-3 SFC terminology.' },

  // SAFETY & BEST PRACTICES
  { id: 's01', chapter: 'safety', front: 'IEC 62061 vs IEC 61508 — safety standards', back: 'IEC 61508: functional safety standard for electrical/electronic/programmable electronic systems; defines SIL 1-4 (Safety Integrity Level). SIL 4 = highest (nuclear, aerospace); SIL 1 = lowest. IEC 62061: applies 61508 specifically to machinery safety control systems. Defines SILCL (SIL Claim Limit) for subsystems. EN ISO 13849-1: performance level (PLa-PLe) for machinery safety, maps to SIL: PLc≈SIL1, PLd≈SIL2, PLe≈SIL3.' },
  { id: 's02', chapter: 'safety', front: 'SIL 1/2/3 requirements', back: 'SIL targets probability of dangerous failure on demand (PFD): SIL 1: 10^-1 to 10^-2 (1 in 10 to 1 in 100 failures on demand). SIL 2: 10^-2 to 10^-3. SIL 3: 10^-3 to 10^-4. SIL 4: 10^-4 to 10^-5. Higher SIL requires: hardware redundancy, diagnostic coverage, proof testing frequency, restricted software languages (no dynamic memory, no recursion in safety-critical code). IEC 61508 Part 3 restricts language features for SIL 3/4 software.' },
  { id: 's03', chapter: 'safety', front: 'Safety PLCs — language restrictions', back: 'Safety PLCs (TUV-certified, SIL-capable: SEL, Siemens F-CPU, Rockwell GuardLogix) enforce IEC 61508 software requirements: No dynamic memory allocation; no recursion; no global variable modification from multiple tasks without semaphores; formal proof of no unintended transitions. Safety code is typically segregated from standard code and independently certified. Structured Text is allowed if restricted to safe language subset.' },
  { id: 's04', chapter: 'safety', front: 'PLe / Category 4 for safety PLCs', back: 'EN ISO 13849-1 Performance Level e (PLe) and Category 4: highest machine safety level. Category 4: single fault does not cause loss of safety function; faults are detected before or at next safety demand; typically requires dual-channel (1oo2) architecture with cross-monitoring. PLe requires MTTFd ≥ 100 years per channel, DCavg ≥ 99%, and Category 4 architecture. Equivalent to SIL 3 in IEC 62061.' },
  { id: 's05', chapter: 'safety', front: 'IEC 61131-3 best practices — variable naming', back: 'Common naming conventions for IEC 61131-3: Prefix with type indicator: x=BOOL, r=REAL, i=INT, di=DINT, by=BYTE, w=WORD, s=STRING, t=TIME, arr=ARRAY, st=STRUCT. Suffix with I/O direction: _I=input, _O=output, _G=global. Example: xMotorRun_I (BOOL input), rSpeed_O (REAL output), arrBuffer_G (global array). Consistent naming prevents type confusion and improves maintainability across teams.' },
  { id: 's06', chapter: 'safety', front: 'Modular PLC programming principles', back: 'IEC 61131-3 best practices: (1) One FB per physical device (motor, valve, pump). (2) Programs contain only sequence logic; all device logic is in FBs. (3) No global variables except for genuine cross-program data. (4) All constants are named VAR CONSTANTs — no magic numbers. (5) State machines use CASE statements, not nested IFs. (6) Timer instances are 1-per-use — never reuse timer instances. (7) Comment every POU header with function, author, and revision history.' },
  { id: 's07', chapter: 'safety', front: 'Scan cycle and watchdog timer', back: 'The PLC scan cycle: (1) Read inputs (update input image table from physical I/O). (2) Execute program (run all tasks in priority order). (3) Write outputs (write output image table to physical I/O). Cycle time: typically 1-100ms depending on program size and task configuration. Watchdog timer: hardware timer that resets the PLC if the scan cycle exceeds a maximum (e.g., 150ms). A runaway FOR loop or communication stall that exceeds the watchdog causes a controlled shutdown, protecting the process.' },
  { id: 's08', chapter: 'safety', front: 'Testing IEC 61131-3 programs', back: 'Testing approaches: (1) Software simulation — run on PC before hardware; Codesys, TIA Portal all support offline simulation. (2) Force I/O — override input/output values during commissioning to test logic. (3) Step-by-step execution in SFC/debugger. (4) Automated unit tests — some platforms (Codesys, Beckhoff) support TDD frameworks for PLC code. (5) Factory Acceptance Test (FAT) on hardware before site. (6) Site Acceptance Test (SAT) after installation. Document all test cases — required for SIL-rated systems.' },
  { id: 's09', chapter: 'safety', front: 'Dealing with scan time dependencies', back: 'Avoid scan-time-dependent code: (1) Never use FOR loops as delays (loop count depends on CPU speed and compiler). (2) Use TON timers, not counter-based delays. (3) Edge detection R_TRIG/F_TRIG works correctly regardless of scan time (one-shot per edge). (4) Communications and file I/O should be in slow tasks or background threads, not the fast control task. (5) RETAIN variables survive power loss but not hot-swaps — document which variables are RETAIN and test them.' },
  { id: 's10', chapter: 'safety', front: 'Memory organization in PLCs', back: 'PLC memory areas (varies by vendor): Process Image Input (I) — snapshot of physical inputs at scan start. Process Image Output (Q) — written to physical outputs at scan end. Merker/Flags (M) — internal bit/byte/word memory. Data Blocks (DB in Siemens) — structured data storage. Retentive memory — non-volatile, survives power loss. I/O direct access (reads physical I/O mid-scan, not recommended for consistency). The input image is latched at scan start — the same input value is used for the entire scan regardless of physical changes during execution.' },
  { id: 's11', chapter: 'safety', front: 'VAR RETAIN usage', back: 'RETAIN variables persist their values through a power cycle (stored in battery-backed RAM or flash). Use for: production counters, batch recipe parameters, maintenance setpoints, machine state after controlled shutdown. Do not use for: I/O status (always re-read from hardware after startup), safety state (always start from known safe state). On firmware update or project download, RETAIN values are typically cleared — document this in commissioning procedures.' },
]

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function saveProgress(prog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prog))
}

function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s ^ (s >>> 15), s | 1) ^ (s + Math.imul(s ^ (s >>> 7), s | 61))) >>> 0
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Flashcards() {
  const [chapter, setChapter] = useState('all')
  const [progress, setProgress] = useState(loadProgress)
  const [shuffled, setShuffled] = useState(false)
  const [seed, setSeed] = useState(Date.now())
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const baseCards = chapter === 'all' ? FLASHCARDS : FLASHCARDS.filter(c => c.chapter === chapter)
  const cards = shuffled ? seededShuffle(baseCards, seed) : baseCards
  const current = cards[index] || null

  const isMastered = current ? !!progress[current.id]?.mastered : false
  const isSeen = current ? !!progress[current.id]?.seen : false
  const seenCount = cards.filter(c => progress[c.id]?.seen).length
  const masteredCount = cards.filter(c => progress[c.id]?.mastered).length
  const pct = cards.length ? Math.round((masteredCount / cards.length) * 100) : 0

  const go = useCallback((dir) => {
    if (animating) return
    setAnimating(true)
    setFlipped(false)
    setTimeout(() => {
      setIndex(i => {
        const next = i + dir
        if (next < 0) return cards.length - 1
        if (next >= cards.length) return 0
        return next
      })
      setAnimating(false)
    }, 200)
  }, [animating, cards.length])

  const flip = useCallback(() => {
    if (animating) return
    setFlipped(f => !f)
    if (current) {
      const p = { ...progress }
      p[current.id] = { ...p[current.id], seen: true }
      setProgress(p)
      saveProgress(p)
    }
  }, [animating, current, progress])

  const markMastered = useCallback(() => {
    if (!current) return
    const p = { ...progress }
    p[current.id] = { ...p[current.id], seen: true, mastered: true }
    setProgress(p)
    saveProgress(p)
    go(1)
  }, [current, progress, go])

  const markNeeds = useCallback(() => {
    if (!current) return
    const p = { ...progress }
    p[current.id] = { ...p[current.id], seen: true, mastered: false }
    setProgress(p)
    saveProgress(p)
    go(1)
  }, [current, progress, go])

  const resetProgress = () => {
    setProgress({})
    saveProgress({})
    setIndex(0)
    setFlipped(false)
  }

  const doShuffle = () => { setSeed(Date.now()); setShuffled(true); setIndex(0); setFlipped(false) }
  const unShuffle = () => { setShuffled(false); setIndex(0); setFlipped(false) }

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); flip() }
      if (e.code === 'ArrowRight' || e.code === 'KeyL') go(1)
      if (e.code === 'ArrowLeft' || e.code === 'KeyH') go(-1)
      if (e.code === 'KeyM') markMastered()
      if (e.code === 'KeyN') markNeeds()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, go, markMastered, markNeeds])

  useEffect(() => { setIndex(0); setFlipped(false) }, [chapter])

  if (!current) return (
    <div className="p-8 text-center text-slate-400">No cards for this category yet.</div>
  )

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ background: 'linear-gradient(135deg, #060e1a, #0f1e37, #0a1628)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen size={24} style={{ color: '#22d3ee' }} />
              IEC 61131-3 Flashcards
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{FLASHCARDS.length} cards · Space to flip · ← → navigate · M mastered · N needs review</p>
          </div>
          <button
            onClick={() => setShowHint(h => !h)}
            className="p-2 rounded-xl text-slate-400 transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            title="Keyboard shortcuts"
          >
            <Keyboard size={20} />
          </button>
        </div>

        {showHint && (
          <div className="mb-4 p-4 rounded-2xl text-xs text-slate-500 grid grid-cols-2 gap-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.1)' }}>Space</kbd> Flip card</div>
            <div><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.1)' }}>← →</kbd> Navigate</div>
            <div><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.1)' }}>M</kbd> Mark mastered</div>
            <div><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.1)' }}>N</kbd> Needs review</div>
          </div>
        )}

        {/* Chapter filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FLASHCARD_CHAPTERS.map(ch => (
            <button
              key={ch.id}
              onClick={() => setChapter(ch.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={chapter === ch.id
                ? { background: '#0077a8', color: 'white', boxShadow: '0 0 12px rgba(0,180,216,0.4)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-6 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>{index + 1} / {cards.length} cards</span>
            <div className="flex gap-4">
              <span className="text-amber-500 font-semibold">{seenCount} seen</span>
              <span className="font-semibold" style={{ color: '#34d399' }}>{masteredCount} mastered</span>
              <span className="font-bold" style={{ color: '#22d3ee' }}>{pct}%</span>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="absolute left-0 top-0 h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${cards.length ? (seenCount / cards.length) * 100 : 0}%` }} />
            <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
              style={{ width: `${cards.length ? (masteredCount / cards.length) * 100 : 0}%`, background: '#34d399' }} />
          </div>
          {cards.length <= 25 && (
            <div className="flex gap-1 mt-2 justify-center flex-wrap">
              {cards.map((c, i) => (
                <button key={c.id} onClick={() => { setIndex(i); setFlipped(false) }}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-200"
                  style={{
                    transform: i === index ? 'scale(1.5)' : 'scale(1)',
                    background: i === index ? '#22d3ee' : progress[c.id]?.mastered ? '#34d399' : progress[c.id]?.seen ? '#fbbf24' : 'rgba(255,255,255,0.15)',
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* Card */}
        <div onClick={flip} className="relative cursor-pointer select-none mb-6"
          style={{ perspective: '1200px', minHeight: 300 }}>
          <div className="relative w-full transition-transform duration-500"
            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: 300 }}>

            {/* Front */}
            <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <div className="h-full min-h-[300px] rounded-3xl p-8 flex flex-col"
                style={{ background: 'rgba(10,22,40,0.95)', border: '2px solid rgba(0,180,216,0.3)', boxShadow: '0 0 40px rgba(0,180,216,0.1)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ background: 'rgba(0,180,216,0.15)', color: '#22d3ee' }}>
                    {FLASHCARD_CHAPTERS.find(c => c.id === current.chapter)?.label || current.chapter}
                  </span>
                  {isMastered && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                      style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                      <Check size={12} /> Mastered
                    </span>
                  )}
                  {isSeen && !isMastered && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>Review</span>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl font-semibold text-white text-center leading-relaxed">{current.front}</p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-sm">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center animate-bounce">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#475569' }} />
                  </div>
                  <span>Tap to reveal</span>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="h-full min-h-[300px] rounded-3xl p-8 flex flex-col"
                style={{ background: 'linear-gradient(135deg, rgba(6,14,26,0.98), rgba(0,40,70,0.95))', border: '2px solid rgba(0,180,216,0.2)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                    {current.front}
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Definition</span>
                </div>
                <div className="flex-1 flex items-start justify-center overflow-y-auto">
                  <p className="text-sm leading-relaxed text-left w-full" style={{ color: '#cbd5e1' }}>{current.back}</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={(e) => { e.stopPropagation(); markNeeds() }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                    <X size={16} /> Needs Review
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); markMastered() }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
                    style={{ background: 'rgba(52,211,153,0.15)', color: '#6ee7b7' }}>
                    <Check size={16} /> Got It
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button onClick={() => go(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-slate-300 transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ChevronLeft size={18} /> Prev
          </button>

          <div className="flex gap-2">
            <button onClick={shuffled ? unShuffle : doShuffle}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              style={shuffled
                ? { background: '#0077a8', color: 'white', boxShadow: '0 0 12px rgba(0,180,216,0.3)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }
              }>
              <Shuffle size={16} /> {shuffled ? 'Shuffled' : 'Shuffle'}
            </button>
            <button onClick={resetProgress}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl font-semibold text-sm text-slate-500 transition-all active:scale-95 hover:text-red-400"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              title="Reset progress">
              <RotateCcw size={16} />
            </button>
          </div>

          <button onClick={() => go(1)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-slate-300 transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
