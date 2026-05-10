// IEC 61131-3 Code Lab — 3 difficulty levels
// Covers structured text logic, function blocks, timers, state machines, and scan cycle concepts

export const IEC_LAB = [
  // ─────────────────────────────────────────────────────────────
  // LEVEL 1 — Foundations: ST logic, data types, scan cycle
  // ─────────────────────────────────────────────────────────────
  {
    id: 'iec-l1-1',
    level: 1,
    title: 'IEC 61131-3 Data Type Validator',
    scenario: `IEC 61131-3 defines strict data types that map directly to PLC memory.
Understanding them prevents the #1 cause of PLC bugs: integer overflow and implicit conversion.

Standard integer types and their ranges:
  BOOL    : true | false
  SINT    : -128 to 127                 (8-bit signed)
  INT     : -32768 to 32767             (16-bit signed)
  DINT    : -2147483648 to 2147483647   (32-bit signed)
  LINT    : -2^63 to 2^63-1            (64-bit signed)
  USINT   : 0 to 255
  UINT    : 0 to 65535
  UDINT   : 0 to 4294967295
  REAL    : single precision float (approx ±3.4e38)
  LREAL   : double precision float

Implement validateType(typeName, value) that returns:
  { valid: boolean, type: string, range: [min, max]|null, reason: string }`,
    hint: 'JavaScript numbers are 64-bit doubles — they can represent all IEC integer types exactly except LINT/ULINT extremes. Use the range table directly.',
    starter: `const TYPE_RANGES = {
  SINT:  [-128, 127],
  INT:   [-32768, 32767],
  DINT:  [-2147483648, 2147483647],
  USINT: [0, 255],
  UINT:  [0, 65535],
  UDINT: [0, 4294967295],
};

function validateType(typeName, value) {
  const upper = typeName.toUpperCase();

  if (upper === 'BOOL') {
    const valid = value === true || value === false || value === 0 || value === 1;
    return { valid, type: 'BOOL', range: null, reason: valid ? 'OK' : 'BOOL must be true/false or 0/1' };
  }

  if (upper === 'REAL' || upper === 'LREAL') {
    const valid = typeof value === 'number' && isFinite(value);
    return { valid, type: upper, range: null, reason: valid ? 'OK' : 'Must be a finite number' };
  }

  const range = TYPE_RANGES[upper];
  if (!range) {
    return { valid: false, type: upper, range: null, reason: 'Unknown IEC type: ' + typeName };
  }

  if (!Number.isInteger(value)) {
    return { valid: false, type: upper, range, reason: 'Integer types require integer values' };
  }

  const valid = value >= range[0] && value <= range[1];
  return {
    valid,
    type: upper,
    range,
    reason: valid ? 'OK' : \`Value \${value} out of \${upper} range [\${range[0]}, \${range[1]}]\`,
  };
}

const solution = validateType;

console.log(validateType('INT', 32767));    // valid
console.log(validateType('INT', 32768));    // invalid: overflow
console.log(validateType('USINT', -1));     // invalid: negative
console.log(validateType('BOOL', true));    // valid`,
    tests: [
      { description: 'validateType("INT", 32767) → valid:true' },
      { description: 'validateType("INT", 32768) → valid:false (overflow)' },
      { description: 'validateType("USINT", -1) → valid:false (unsigned, negative)' },
      { description: 'validateType("REAL", 3.14) → valid:true' },
    ],
    testRunner: function(solution) {
      if (typeof solution !== 'function') return [{ passed: false, error: 'not a function' }]
      const cases = [
        { args: ['INT',   32767], check: r => r?.valid === true },
        { args: ['INT',   32768], check: r => r?.valid === false },
        { args: ['USINT', -1],    check: r => r?.valid === false },
        { args: ['REAL',  3.14],  check: r => r?.valid === true },
      ]
      return cases.map(c => {
        try { const r = solution(...c.args); return { passed: c.check(r), actual: r } }
        catch(e) { return { passed: false, error: e.message } }
      })
    },
  },

  {
    id: 'iec-l1-2',
    level: 1,
    title: 'TON Timer Emulator',
    scenario: `TON (Timer On-Delay) is the most used function block in IEC 61131-3 PLCs.
Every motor start, valve sequence, and safety interlock uses it.

TON behavior:
  Inputs:  IN (BOOL), PT (preset time in ms)
  Outputs: Q (BOOL - timer done), ET (elapsed time in ms)

Logic:
  - When IN rises TRUE: start counting elapsed time
  - When ET >= PT: set Q = TRUE
  - When IN goes FALSE: reset ET = 0, Q = FALSE immediately
  - Q stays TRUE as long as IN is TRUE and ET >= PT

Implement a TON class:
  constructor(presetMs)
  update(inSignal, dtMs)  → { Q: bool, ET: number }
  reset()

Note: IEC PLCs call update() every scan cycle (typically 10-100ms).
The 'dt' parameter represents one scan cycle duration.`,
    hint: 'ET accumulates while IN is true. Q goes true only when ET >= PT. When IN goes false, reset ET to 0 (and Q to false) immediately — this is what makes it an "on-delay" not an "off-delay".',
    starter: `class TON {
  constructor(presetMs) {
    this.PT = presetMs;
    this.ET = 0;
    this.Q = false;
  }

  update(inSignal, dtMs) {
    if (inSignal) {
      this.ET = Math.min(this.ET + dtMs, this.PT); // accumulate, cap at PT
      this.Q = this.ET >= this.PT;
    } else {
      this.ET = 0;
      this.Q = false;
    }
    return { Q: this.Q, ET: this.ET };
  }

  reset() {
    this.ET = 0;
    this.Q = false;
  }
}

const solution = TON;

// Simulate 5-second on-delay with 100ms scan cycle
const timer = new TON(5000); // 5000ms preset
let elapsed = 0;
for (let scan = 0; scan < 55; scan++) {
  const { Q, ET } = timer.update(true, 100);
  elapsed += 100;
  if (scan === 49 || scan === 54) {
    console.log(\`t=\${elapsed}ms: Q=\${Q}, ET=\${ET}ms\`);
  }
}
// t=5000ms: Q=true, ET=5000
// t=5500ms: Q=true, ET=5000 (ET stays at PT)`,
    tests: [
      { description: 'Q=false while ET < PT (IN=true for 3 scans of 1000ms vs PT=5000ms)' },
      { description: 'Q=true when ET >= PT (after 5 scans of 1000ms, PT=5000ms)' },
      { description: 'IN=false resets ET=0 and Q=false immediately' },
      { description: 'ET does not exceed PT (capped at preset time)' },
    ],
    testRunner: function(solution) {
      if (typeof solution !== 'function') return [{ passed: false, error: 'not a class' }]
      const results = []
      // Test 1: Q false before PT
      try {
        const t = new solution(5000)
        let r
        for (let i = 0; i < 3; i++) r = t.update(true, 1000)
        results.push({ passed: r?.Q === false, actual: r })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 2: Q true after PT
      try {
        const t = new solution(5000)
        let r
        for (let i = 0; i < 5; i++) r = t.update(true, 1000)
        results.push({ passed: r?.Q === true && r?.ET === 5000, actual: r })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 3: IN=false resets
      try {
        const t = new solution(5000)
        for (let i = 0; i < 5; i++) t.update(true, 1000)
        const r = t.update(false, 1000)
        results.push({ passed: r?.Q === false && r?.ET === 0, actual: r })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 4: ET capped at PT
      try {
        const t = new solution(1000)
        for (let i = 0; i < 20; i++) t.update(true, 100) // run well past PT
        const r = t.update(true, 100)
        results.push({ passed: r?.ET === 1000, actual: r?.ET })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      return results
    },
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL 2 — Applied: function blocks, edge detection, sequences
  // ─────────────────────────────────────────────────────────────
  {
    id: 'iec-l2-1',
    level: 2,
    title: 'R_TRIG / F_TRIG Edge Detection',
    scenario: `Edge detection is fundamental to IEC 61131-3 programming.
Without it, a single button press in a SCADA screen would be processed 50+ times per second.

R_TRIG (Rising Trigger): Q goes TRUE for exactly ONE scan cycle when IN transitions FALSE→TRUE
F_TRIG (Falling Trigger): Q goes TRUE for exactly ONE scan cycle when IN transitions TRUE→FALSE

Implement both as classes with update(inSignal) → { Q: bool }

Then implement a ScanCycleSimulator that runs a list of function blocks each scan:
  class ScanCycleSimulator {
    constructor(scanTimeMs)
    addBlock(name, block)     // block must have update() method
    run(signals, scanCount)   // signals = {name: boolValue}, runs scanCount cycles
    // Returns array of { scan, outputs: {name: {Q, ET, ...}} }
  }

This is how PLC IDEs (CODESYS, Studio 5000, TIA Portal) execute your program.`,
    hint: 'R_TRIG stores the previous IN value. Q = (current IN === true && prev IN === false). Update prev AFTER computing Q. F_TRIG is the inverse.',
    starter: `class R_TRIG {
  constructor() {
    this._prev = false;
  }
  update(inSignal) {
    const Q = inSignal === true && this._prev === false;
    this._prev = inSignal;
    return { Q };
  }
}

class F_TRIG {
  constructor() {
    this._prev = false;
  }
  update(inSignal) {
    const Q = inSignal === false && this._prev === true;
    this._prev = inSignal;
    return { Q };
  }
}

class ScanCycleSimulator {
  constructor(scanTimeMs = 10) {
    this.scanTimeMs = scanTimeMs;
    this.blocks = {};
  }

  addBlock(name, block) {
    this.blocks[name] = block;
    return this;
  }

  run(signals, scanCount) {
    const history = [];
    for (let scan = 0; scan < scanCount; scan++) {
      const outputs = {};
      for (const [name, block] of Object.entries(this.blocks)) {
        // Pass the signal matching the block name, or false if not provided
        const signal = signals[name] !== undefined ? signals[name] : false;
        // Signal can be a function (dynamic) or static value
        const inVal = typeof signal === 'function' ? signal(scan) : signal;
        outputs[name] = block.update(inVal);
      }
      history.push({ scan, outputs });
    }
    return history;
  }
}

const solution = { R_TRIG, F_TRIG, ScanCycleSimulator };

// Test: pushbutton press (high for 2 scans)
const trig = new R_TRIG();
const signals = [false, false, true, true, false]; // push then release
signals.forEach((s, i) => {
  const { Q } = trig.update(s);
  console.log(\`Scan \${i}: IN=\${s}, Q=\${Q}\`);
});
// Only scan 2 should have Q=true`,
    tests: [
      { description: 'R_TRIG: Q=true only on the rising edge scan (FALSE→TRUE transition)' },
      { description: 'R_TRIG: Q=false on second and subsequent true scans (held high)' },
      { description: 'F_TRIG: Q=true only on the falling edge scan (TRUE→FALSE transition)' },
      { description: 'ScanCycleSimulator runs blocks and returns scan history' },
    ],
    testRunner: function(solution) {
      if (!solution || typeof solution.R_TRIG !== 'function') return [{ passed: false, error: 'solution must be {R_TRIG, F_TRIG, ScanCycleSimulator}' }]
      const { R_TRIG, F_TRIG, ScanCycleSimulator } = solution
      const results = []
      // Test 1: R_TRIG rising edge
      try {
        const t = new R_TRIG()
        t.update(false)
        const r1 = t.update(true)  // rising edge → Q=true
        const r2 = t.update(true)  // held → Q=false
        results.push({ passed: r1?.Q === true && r2?.Q === false, actual: {r1, r2} })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 2: R_TRIG stays false when held
      try {
        const t = new R_TRIG()
        t.update(true) // start high (no edge)
        const r = t.update(true)
        results.push({ passed: r?.Q === false, actual: r })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 3: F_TRIG falling edge
      try {
        const t = new F_TRIG()
        t.update(true)
        const r1 = t.update(false) // falling edge → Q=true
        const r2 = t.update(false) // held low → Q=false
        results.push({ passed: r1?.Q === true && r2?.Q === false, actual: {r1, r2} })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 4: ScanCycleSimulator
      try {
        const sim = new ScanCycleSimulator(10)
        sim.addBlock('myTrig', new R_TRIG())
        const history = sim.run({ myTrig: (scan) => scan === 2 }, 5)
        const edgeScan = history.find(h => h.outputs?.myTrig?.Q === true)
        results.push({ passed: edgeScan?.scan === 2, actual: history.map(h => ({scan: h.scan, Q: h.outputs?.myTrig?.Q})) })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      return results
    },
  },

  {
    id: 'iec-l2-2',
    level: 2,
    title: 'Sequential Function Chart (SFC) Interpreter',
    scenario: `Sequential Function Charts (SFC) are a graphical IEC 61131-3 language for step-based sequences.
They appear everywhere in batch processes, startup sequences, and safety interlocks.

SFC elements:
  - Steps: discrete states with associated actions
  - Transitions: conditions that move between steps
  - The initial step is always marked (typically Step 0)

Implement an SFC interpreter:
  class SFC {
    constructor(steps, transitions)
    // steps: [{id, name, action}]
    // transitions: [{from, to, condition}]  condition is a function(inputs)→bool

    update(inputs)          // returns {activeStep, actionOutput, transitioned}
    getCurrentStep()
    reset()
  }

Example sequence: pump startup
  Step 0 (IDLE)   → [valve_open=true] → Step 1 (PRIMING)
  Step 1 (PRIMING) → [pressure_ok=true] → Step 2 (RUNNING)
  Step 2 (RUNNING) → [stop_cmd=true]  → Step 0 (IDLE)`,
    hint: 'On each update(): check all transitions FROM the current step. When a condition returns true, move to that step. Execute the new step\'s action. Only check transitions once per update (no chaining in one scan).',
    starter: `class SFC {
  constructor(steps, transitions) {
    this.steps = steps;
    this.transitions = transitions;
    this.currentStepId = steps[0]?.id ?? 0;
  }

  update(inputs) {
    // Find transitions from current step
    const availTransitions = this.transitions.filter(t => t.from === this.currentStepId);
    let transitioned = false;

    for (const trans of availTransitions) {
      if (trans.condition(inputs)) {
        this.currentStepId = trans.to;
        transitioned = true;
        break; // only one transition per scan
      }
    }

    const activeStep = this.steps.find(s => s.id === this.currentStepId);
    const actionOutput = activeStep?.action ? activeStep.action(inputs) : {};

    return {
      activeStep: activeStep?.name ?? 'Unknown',
      actionOutput,
      transitioned,
    };
  }

  getCurrentStep() {
    return this.steps.find(s => s.id === this.currentStepId);
  }

  reset() {
    this.currentStepId = this.steps[0]?.id ?? 0;
  }
}

const solution = SFC;

// Pump startup sequence
const steps = [
  { id: 0, name: 'IDLE',    action: () => ({ pump: false, valve: false }) },
  { id: 1, name: 'PRIMING', action: () => ({ pump: false, valve: true }) },
  { id: 2, name: 'RUNNING', action: () => ({ pump: true,  valve: true }) },
];

const transitions = [
  { from: 0, to: 1, condition: inputs => inputs.start_cmd === true },
  { from: 1, to: 2, condition: inputs => inputs.pressure_ok === true },
  { from: 2, to: 0, condition: inputs => inputs.stop_cmd === true },
];

const sfc = new SFC(steps, transitions);
console.log(sfc.update({ start_cmd: true }));  // → PRIMING
console.log(sfc.update({ pressure_ok: true })); // → RUNNING
console.log(sfc.update({ pump: true }));        // stays RUNNING (no stop)
console.log(sfc.update({ stop_cmd: true }));    // → IDLE`,
    tests: [
      { description: 'start_cmd=true transitions from IDLE to PRIMING' },
      { description: 'pressure_ok=true transitions from PRIMING to RUNNING' },
      { description: 'No matching transition: stays in current step' },
      { description: 'reset() returns to initial step (IDLE)' },
    ],
    testRunner: function(solution) {
      if (typeof solution !== 'function') return [{ passed: false, error: 'not a class' }]
      const steps = [
        { id: 0, name: 'IDLE',    action: () => ({ pump: false }) },
        { id: 1, name: 'PRIMING', action: () => ({ pump: false, valve: true }) },
        { id: 2, name: 'RUNNING', action: () => ({ pump: true,  valve: true }) },
      ]
      const transitions = [
        { from: 0, to: 1, condition: i => i.start_cmd === true },
        { from: 1, to: 2, condition: i => i.pressure_ok === true },
        { from: 2, to: 0, condition: i => i.stop_cmd === true },
      ]
      const results = []
      try {
        const sfc = new solution(steps, transitions)
        const r1 = sfc.update({ start_cmd: true })
        results.push({ passed: r1?.activeStep === 'PRIMING', actual: r1?.activeStep })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      try {
        const sfc = new solution(steps, transitions)
        sfc.update({ start_cmd: true })
        const r2 = sfc.update({ pressure_ok: true })
        results.push({ passed: r2?.activeStep === 'RUNNING', actual: r2?.activeStep })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      try {
        const sfc = new solution(steps, transitions)
        sfc.update({ start_cmd: true }) // go to PRIMING
        const r3 = sfc.update({})       // no matching condition
        results.push({ passed: r3?.activeStep === 'PRIMING' && r3?.transitioned === false, actual: r3 })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      try {
        const sfc = new solution(steps, transitions)
        sfc.update({ start_cmd: true })
        sfc.update({ pressure_ok: true })
        sfc.reset()
        results.push({ passed: sfc.getCurrentStep()?.name === 'IDLE', actual: sfc.getCurrentStep()?.name })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      return results
    },
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL 3 — Expert: safety programming, FB instances, scan timing
  // ─────────────────────────────────────────────────────────────
  {
    id: 'iec-l3-1',
    level: 3,
    title: 'Safety Interlock Function Block (Category 1)',
    scenario: `IEC 62061 and ISO 13849 define safety categories for control systems.
Category 1 requires: use of well-tried components, proof-test intervals, and redundant safety logic.

In practice, most PLC safety interlocks implement the "dual-channel with discrepancy check" pattern:
  - Two independent input channels (e.g., two limit switches)
  - Both must agree for normal operation
  - If they disagree for > discrepancyTimeMs → fault condition
  - Manual reset required to clear fault

Implement SafetyInterlock:
  class SafetyInterlock {
    constructor(discrepancyTimeMs, scanTimeMs)
    update(ch1, ch2)        // ch1 and ch2 are BOOL signals
    // Returns { safeState: bool, fault: bool, discrepancyMs: number, faultReason: string }
    reset(authCode)         // authCode must be 1234 (simulated key switch)
  }

Rules:
  - safeState = (ch1 === ch2 === true) AND NOT fault
  - fault latches when discrepancy exceeds limit
  - Once faulted, remains faulted until reset() with correct authCode
  - Track discrepancyMs as elapsed time channels disagree`,
    hint: 'This pattern appears in E-stop circuits, safety doors, and light curtains across all industrial safety PLCs. The dual-channel design ensures a single component failure does not cause a hazardous state.',
    starter: `class SafetyInterlock {
  constructor(discrepancyTimeMs = 500, scanTimeMs = 10) {
    this.discrepancyTimeMs = discrepancyTimeMs;
    this.scanTimeMs = scanTimeMs;
    this._fault = false;
    this._faultReason = '';
    this._discrepancyMs = 0;
  }

  update(ch1, ch2) {
    if (this._fault) {
      // Latched fault — only reset() can clear
      return {
        safeState: false,
        fault: true,
        discrepancyMs: this._discrepancyMs,
        faultReason: this._faultReason,
      };
    }

    const agree = (ch1 === ch2);

    if (!agree) {
      this._discrepancyMs += this.scanTimeMs;
      if (this._discrepancyMs >= this.discrepancyTimeMs) {
        this._fault = true;
        this._faultReason = \`CH1=\${ch1}, CH2=\${ch2} disagree for \${this._discrepancyMs}ms\`;
      }
    } else {
      this._discrepancyMs = 0; // reset discrepancy timer when channels agree
    }

    const safeState = ch1 === true && ch2 === true && !this._fault;

    return {
      safeState,
      fault: this._fault,
      discrepancyMs: this._discrepancyMs,
      faultReason: this._fault ? this._faultReason : '',
    };
  }

  reset(authCode) {
    if (authCode !== 1234) {
      return { success: false, reason: 'Invalid authorization code' };
    }
    // TODO: clear fault state — allow reset only if both channels now agree
    // Return { success: true } or { success: false, reason: string }
    this._fault = false;
    this._faultReason = '';
    this._discrepancyMs = 0;
    return { success: true };
  }
}

const solution = SafetyInterlock;

// Test dual-channel discrepancy
const interlock = new SafetyInterlock(500, 100); // 500ms limit, 100ms scan

// Normal operation
console.log(interlock.update(true, true));   // safeState=true
console.log(interlock.update(false, false)); // safeState=false (both off, no fault)

// Discrepancy — simulate 6 scans of disagreement (600ms > 500ms limit)
for (let i = 0; i < 6; i++) interlock.update(true, false);
console.log(interlock.update(true, false));  // fault=true, latched

console.log(interlock.reset(9999));          // wrong code
console.log(interlock.reset(1234));          // correct code, clears fault`,
    tests: [
      { description: 'Both channels TRUE → safeState:true, fault:false' },
      { description: 'Discrepancy > limit → fault latches, safeState:false' },
      { description: 'Wrong authCode → reset fails, fault remains' },
      { description: 'Correct authCode (1234) → reset clears fault' },
    ],
    testRunner: function(solution) {
      if (typeof solution !== 'function') return [{ passed: false, error: 'not a class' }]
      const results = []
      // Test 1: both true → safeState
      try {
        const s = new solution(500, 100)
        const r = s.update(true, true)
        results.push({ passed: r?.safeState === true && r?.fault === false, actual: r })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 2: discrepancy → fault latches
      try {
        const s = new solution(500, 100)
        for (let i = 0; i < 6; i++) s.update(true, false) // 600ms > 500ms
        const r = s.update(true, false)
        results.push({ passed: r?.fault === true && r?.safeState === false, actual: r })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 3: wrong auth code
      try {
        const s = new solution(500, 100)
        for (let i = 0; i < 6; i++) s.update(true, false)
        const reset1 = s.reset(9999)
        const r = s.update(true, true) // still faulted?
        results.push({ passed: reset1?.success === false && r?.fault === true, actual: {reset1, r} })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 4: correct auth code
      try {
        const s = new solution(500, 100)
        for (let i = 0; i < 6; i++) s.update(true, false)
        const reset2 = s.reset(1234)
        results.push({ passed: reset2?.success === true, actual: reset2 })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      return results
    },
  },

  {
    id: 'iec-l3-2',
    level: 3,
    title: 'Structured Text to Instruction List Analyzer',
    scenario: `PLCopen and IEC 61131-3 define Instruction List (IL) as the assembly language of PLCs.
While modern PLCs use Structured Text (ST) or Ladder, older Allen-Bradley, Siemens S5, and legacy
GE equipment still uses IL. You'll encounter it in brownfield projects.

IL uses a simple accumulator model (like a virtual register called the "result"):

Common IL instructions:
  LD  x   → result = x
  ST  y   → y = result (store)
  AND x   → result = result AND x
  OR  x   → result = result OR x
  NOT     → result = NOT result
  ANDN x  → result = result AND (NOT x)
  ORN  x  → result = result OR (NOT x)

Implement an IL interpreter:
  function runIL(instructions, variables)
  // instructions: array of strings like ["LD Start_PB", "ANDN E_Stop", "ST Motor_Run"]
  // variables: object { Start_PB: true, E_Stop: false, ... }
  // Returns { result: any, variables: updated_object, log: string[] }

This is the exact execution model of every IL-capable PLC.`,
    hint: 'Parse each instruction: split on whitespace, first token is opcode, second (if any) is operand. Maintain a "current result" (accumulator). Boolean AND/OR are logical (not bitwise). Log each instruction execution.',
    starter: `function runIL(instructions, variables) {
  let result = undefined;
  const vars = { ...variables }; // don't mutate original
  const log = [];

  for (const line of instructions) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('(*')) continue;

    const [op, operand] = trimmed.split(/\\s+/);
    const val = operand !== undefined ? vars[operand] : undefined;

    switch (op.toUpperCase()) {
      case 'LD':
        result = val;
        log.push(\`LD \${operand} → result = \${result}\`);
        break;
      case 'ST':
        vars[operand] = result;
        log.push(\`ST \${operand} → \${operand} = \${result}\`);
        break;
      case 'AND':
        result = result && val;
        log.push(\`AND \${operand} → result = \${result}\`);
        break;
      case 'OR':
        result = result || val;
        log.push(\`OR \${operand} → result = \${result}\`);
        break;
      case 'NOT':
        result = !result;
        log.push(\`NOT → result = \${result}\`);
        break;
      case 'ANDN':
        result = result && !val;
        log.push(\`ANDN \${operand} → result = \${result}\`);
        break;
      case 'ORN':
        result = result || !val;
        log.push(\`ORN \${operand} → result = \${result}\`);
        break;
      default:
        log.push(\`UNKNOWN: \${op}\`);
    }
  }

  return { result, variables: vars, log };
}

const solution = runIL;

// Classic motor run circuit: Start_PB OR (Seal_In AND NOT E_Stop)
const program = [
  'LD  Start_PB',
  'OR  Seal_In',
  'ANDN E_Stop',
  'ST  Motor_Run',
];

const vars1 = { Start_PB: true, Seal_In: false, E_Stop: false, Motor_Run: false };
const result1 = runIL(program, vars1);
console.log('Motor_Run:', result1.variables.Motor_Run); // true

const vars2 = { Start_PB: false, Seal_In: true, E_Stop: true, Motor_Run: true };
const result2 = runIL(program, vars2);
console.log('Motor_Run (E-Stop active):', result2.variables.Motor_Run); // false`,
    tests: [
      { description: 'LD + ST: load variable and store to another' },
      { description: 'ANDN E_Stop: E-Stop active (true) causes result to go false' },
      { description: 'OR Seal_In: seal-in contact keeps motor running after start released' },
      { description: 'Full motor circuit: start=false, sealin=true, estop=false → Motor_Run=true' },
    ],
    testRunner: function(solution) {
      if (typeof solution !== 'function') return [{ passed: false, error: 'not a function' }]
      const results = []
      // Test 1: LD + ST
      try {
        const r = solution(['LD A', 'ST B'], { A: true, B: false })
        results.push({ passed: r?.variables?.B === true, actual: r?.variables })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 2: ANDN with estop true
      try {
        const r = solution(['LD Start', 'ANDN EStop', 'ST Out'], { Start: true, EStop: true, Out: false })
        results.push({ passed: r?.variables?.Out === false, actual: r?.variables })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 3: OR seal-in
      try {
        const r = solution(['LD Start', 'OR Seal', 'ST Out'], { Start: false, Seal: true, Out: false })
        results.push({ passed: r?.variables?.Out === true, actual: r?.variables })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      // Test 4: full motor circuit
      try {
        const prog = ['LD Start_PB', 'OR Seal_In', 'ANDN E_Stop', 'ST Motor_Run']
        const r = solution(prog, { Start_PB: false, Seal_In: true, E_Stop: false, Motor_Run: false })
        results.push({ passed: r?.variables?.Motor_Run === true, actual: r?.variables?.Motor_Run })
      } catch(e) { results.push({ passed: false, error: e.message }) }
      return results
    },
  },
]
