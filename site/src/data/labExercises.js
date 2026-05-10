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

  // TODO: Step 1 — Handle BOOL type: valid if value is true/false or 0/1
  //       Return { valid, type: 'BOOL', range: null, reason: '...' }

  // TODO: Step 2 — Handle REAL and LREAL: valid if typeof value === 'number' && isFinite(value)
  //       Return { valid, type: upper, range: null, reason: '...' }

  // TODO: Step 3 — Look up TYPE_RANGES[upper]; if not found return invalid with reason 'Unknown IEC type: ...'

  // TODO: Step 4 — Integer types: if !Number.isInteger(value) return invalid with reason

  // TODO: Step 5 — Check range[0] <= value <= range[1]; build reason string for out-of-range
  //       Return { valid, type: upper, range, reason }

  return { valid: false, type: upper, range: null, reason: 'Not implemented' };
}

const solution = validateType;

console.log(validateType('INT', 32767));    // valid
console.log(validateType('INT', 32768));    // invalid: overflow
console.log(validateType('USINT', -1));     // invalid: negative
console.log(validateType('BOOL', true));    // valid`,
    starterPy: `TYPE_RANGES = {
    'SINT':  [-128, 127],
    'INT':   [-32768, 32767],
    'DINT':  [-2147483648, 2147483647],
    'USINT': [0, 255],
    'UINT':  [0, 65535],
    'UDINT': [0, 4294967295],
}

def validate_type(type_name, value):
    upper = type_name.upper()

    # TODO: Step 1 — Handle BOOL: valid if value is True/False or 0/1
    #       Return {'valid': ..., 'type': 'BOOL', 'range': None, 'reason': '...'}

    # TODO: Step 2 — Handle REAL/LREAL: use isinstance(value, (int, float)) and math.isfinite
    #       Return {'valid': ..., 'type': upper, 'range': None, 'reason': '...'}

    # TODO: Step 3 — Look up TYPE_RANGES.get(upper); if None return invalid 'Unknown IEC type: ...'

    # TODO: Step 4 — Integer check: if not isinstance(value, int) or isinstance(value, bool) → invalid

    # TODO: Step 5 — Range check: range_[0] <= value <= range_[1]
    #       Build reason string for out-of-range case
    #       Return {'valid': ..., 'type': upper, 'range': range_, 'reason': ...}

    return {'valid': False, 'type': upper, 'range': None, 'reason': 'Not implemented'}

solution = validate_type

print(validate_type('INT', 32767))    # valid
print(validate_type('INT', 32768))    # invalid: overflow
print(validate_type('USINT', -1))     # invalid: negative
print(validate_type('BOOL', True))    # valid`,
    starterJython: `TYPE_RANGES = {
    'SINT':  [-128, 127],
    'INT':   [-32768, 32767],
    'DINT':  [-2147483648, 2147483647],
    'USINT': [0, 255],
    'UINT':  [0, 65535],
    'UDINT': [0, 4294967295],
}

def validate_type(type_name, value):
    upper = type_name.upper()

    # TODO: Step 1 — Handle BOOL: valid if value is True/False or 0/1
    #       Return {'valid': ..., 'type': 'BOOL', 'range': None, 'reason': '...'}

    # TODO: Step 2 — Handle REAL/LREAL: use isinstance and math.isfinite(float(value))
    #       Return {'valid': ..., 'type': upper, 'range': None, 'reason': '...'}

    # TODO: Step 3 — Look up TYPE_RANGES.get(upper); if None return invalid with reason

    # TODO: Step 4 — Integer check: if not isinstance(value, int) or isinstance(value, bool) → invalid

    # TODO: Step 5 — Range check: range_[0] <= value <= range_[1]
    #       Use .format() for the reason string (Jython 2.7 — no f-strings)
    #       Return {'valid': ..., 'type': upper, 'range': range_, 'reason': ...}

    return {'valid': False, 'type': upper, 'range': None, 'reason': 'Not implemented'}

solution = validate_type

print(validate_type('INT', 32767))
print(validate_type('INT', 32768))
print(validate_type('USINT', -1))
print(validate_type('BOOL', True))`,
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
    this.ET = 0;        // elapsed time in ms
    this.Q = false;     // output coil (timer done)
    // TODO: initialize any other internal state you need
  }

  update(inSignal, dtMs) {
    // TON (Timer On-Delay) logic:
    // Step 1: If inSignal is false — reset ET to 0 and Q to false, return {Q, ET}
    // Step 2: If inSignal is true — accumulate: ET += dtMs
    // Step 3: Cap ET at PT (don't let ET exceed preset)
    // Step 4: If ET >= PT — set Q = true; otherwise Q = false
    // Step 5: Return { Q: this.Q, ET: this.ET }
    // TODO: implement above

    return { Q: false, ET: 0 };
  }

  reset() {
    // TODO: reset ET and Q to initial state
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
    starterPy: `class TON:
    def __init__(self, preset_ms):
        self.PT = preset_ms
        self.ET = 0        # elapsed time in ms
        self.Q = False     # output coil (timer done)
        # TODO: initialize any other internal state you need

    def update(self, in_signal, dt_ms):
        # TON (Timer On-Delay) logic:
        # Step 1: If in_signal is False — reset ET to 0 and Q to False, return result
        # Step 2: If in_signal is True — accumulate: ET += dt_ms
        # Step 3: Cap ET at PT (don't let ET exceed preset)
        # Step 4: If ET >= PT — set Q = True; otherwise Q = False
        # Step 5: Return {'Q': self.Q, 'ET': self.ET}
        # TODO: implement above

        return {'Q': False, 'ET': 0}

    def reset(self):
        # TODO: reset ET and Q to initial state
        pass

solution = TON

# Simulate 5-second on-delay with 100ms scan cycle
timer = TON(5000)
elapsed = 0
for scan in range(55):
    result = timer.update(True, 100)
    elapsed += 100
    if scan == 49 or scan == 54:
        print('t={}ms: Q={}, ET={}ms'.format(elapsed, result['Q'], result['ET']))
# t=5000ms: Q=True, ET=5000
# t=5500ms: Q=True, ET=5000 (ET stays at PT)`,
    starterJython: `class TON:
    def __init__(self, preset_ms):
        self.PT = preset_ms
        self.ET = 0        # elapsed time in ms
        self.Q = False     # output coil (timer done)
        # TODO: initialize any other internal state you need

    def update(self, in_signal, dt_ms):
        # TON (Timer On-Delay) logic:
        # Step 1: If in_signal is False — reset ET to 0 and Q to False, return result
        # Step 2: If in_signal is True — accumulate: ET += dt_ms
        # Step 3: Cap ET at PT using min() (don't let ET exceed preset)
        # Step 4: If ET >= PT — set Q = True; otherwise Q = False
        # Step 5: Return {'Q': self.Q, 'ET': self.ET}
        # TODO: implement above

        return {'Q': False, 'ET': 0}

    def reset(self):
        # TODO: reset ET and Q to initial state
        pass

solution = TON

# Simulate 5-second on-delay with 100ms scan cycle
timer = TON(5000)
elapsed = 0
for scan in range(55):
    result = timer.update(True, 100)
    elapsed += 100
    if scan == 49 or scan == 54:
        print('t={0}ms: Q={1}, ET={2}ms'.format(elapsed, result['Q'], result['ET']))`,
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
    // TODO: initialize any state you need to detect a rising edge
  }

  update(inSignal) {
    // R_TRIG: Rising edge detector
    // Step 1: Q = true only when inSignal is true AND previous was false
    // Step 2: Store inSignal as _prev AFTER computing Q (order matters!)
    // Step 3: Return { Q }
    // TODO: implement above

    return { Q: false };
  }
}

class F_TRIG {
  constructor() {
    this._prev = false;
    // TODO: initialize any state you need to detect a falling edge
  }

  update(inSignal) {
    // F_TRIG: Falling edge detector (inverse of R_TRIG)
    // Step 1: Q = true only when inSignal is false AND previous was true
    // Step 2: Store inSignal as _prev AFTER computing Q
    // Step 3: Return { Q }
    // TODO: implement above

    return { Q: false };
  }
}

class ScanCycleSimulator {
  constructor(scanTimeMs = 10) {
    this.scanTimeMs = scanTimeMs;
    this.blocks = {};
  }

  addBlock(name, block) {
    // TODO: store block under name so run() can call it each scan
    return this;
  }

  run(signals, scanCount) {
    // Step 1: Loop scanCount times (each iteration = one scan cycle)
    // Step 2: For each block in this.blocks, read the signal value for that block name
    //         (signal can be a function(scan)→bool or a static bool value)
    // Step 3: Call block.update(inVal) and capture output
    // Step 4: Push { scan, outputs: {name: result, ...} } to history array
    // Step 5: Return the history array
    // TODO: implement above

    return [];
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
    starterPy: `class R_TRIG:
    def __init__(self):
        self._prev = False
        # TODO: initialize any state you need to detect a rising edge

    def update(self, in_signal):
        # R_TRIG: Rising edge detector
        # Step 1: Q = True only when in_signal is True AND _prev is False
        # Step 2: Store in_signal as _prev AFTER computing Q (order matters!)
        # Step 3: Return {'Q': Q}
        # TODO: implement above

        return {'Q': False}


class F_TRIG:
    def __init__(self):
        self._prev = False
        # TODO: initialize any state you need to detect a falling edge

    def update(self, in_signal):
        # F_TRIG: Falling edge detector (inverse of R_TRIG)
        # Step 1: Q = True only when in_signal is False AND _prev is True
        # Step 2: Store in_signal as _prev AFTER computing Q
        # Step 3: Return {'Q': Q}
        # TODO: implement above

        return {'Q': False}


class ScanCycleSimulator:
    def __init__(self, scan_time_ms=10):
        self.scan_time_ms = scan_time_ms
        self.blocks = {}

    def add_block(self, name, block):
        # TODO: store block under name
        return self

    def run(self, signals, scan_count):
        # Step 1: Loop scan_count times
        # Step 2: For each block, get signal value (callable or static)
        # Step 3: Call block.update(in_val) and collect outputs
        # Step 4: Append {'scan': scan, 'outputs': {name: result, ...}} to history
        # Step 5: Return history
        # TODO: implement above

        return []


solution = {'R_TRIG': R_TRIG, 'F_TRIG': F_TRIG, 'ScanCycleSimulator': ScanCycleSimulator}

# Test: pushbutton press (high for 2 scans)
trig = R_TRIG()
signals_list = [False, False, True, True, False]
for i, s in enumerate(signals_list):
    result = trig.update(s)
    print('Scan {}: IN={}, Q={}'.format(i, s, result['Q']))
# Only scan 2 should have Q=True`,
    starterJython: `class R_TRIG:
    def __init__(self):
        self._prev = False
        # TODO: initialize any state you need to detect a rising edge

    def update(self, in_signal):
        # R_TRIG: Rising edge detector
        # Step 1: Q = True only when in_signal is True AND _prev is False
        # Step 2: Store in_signal as _prev AFTER computing Q (order matters!)
        # Step 3: Return {'Q': Q}
        # TODO: implement above

        return {'Q': False}


class F_TRIG:
    def __init__(self):
        self._prev = False
        # TODO: initialize any state you need to detect a falling edge

    def update(self, in_signal):
        # F_TRIG: Falling edge detector (inverse of R_TRIG)
        # Step 1: Q = True only when in_signal is False AND _prev is True
        # Step 2: Store in_signal as _prev AFTER computing Q
        # Step 3: Return {'Q': Q}
        # TODO: implement above

        return {'Q': False}


class ScanCycleSimulator:
    def __init__(self, scan_time_ms=10):
        self.scan_time_ms = scan_time_ms
        self.blocks = {}

    def add_block(self, name, block):
        # TODO: store block under name
        return self

    def run(self, signals, scan_count):
        # Step 1: Loop scan_count times
        # Step 2: For each block name, get signal (callable or static bool)
        # Step 3: Call block.update(in_val) and collect outputs
        # Step 4: Append {'scan': scan, 'outputs': {name: result}} to history
        # Step 5: Return history
        # TODO: implement above
        # Note: Jython 2.7 — use self.blocks.items() or iterate keys
        return []


solution = {'R_TRIG': R_TRIG, 'F_TRIG': F_TRIG, 'ScanCycleSimulator': ScanCycleSimulator}

# Test: pushbutton press (high for 2 scans)
trig = R_TRIG()
signals_list = [False, False, True, True, False]
for i, s in enumerate(signals_list):
    result = trig.update(s)
    print('Scan {0}: IN={1}, Q={2}'.format(i, s, result['Q']))`,
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
    // Step 1: Find all transitions where t.from === this.currentStepId
    // Step 2: Loop through them; if condition(inputs) is true, update currentStepId
    //         Set transitioned = true and break (only one transition per scan)
    // Step 3: Find the active step object: this.steps.find(s => s.id === this.currentStepId)
    // Step 4: Call activeStep.action(inputs) if it exists, else actionOutput = {}
    // Step 5: Return { activeStep: activeStep.name, actionOutput, transitioned }
    // TODO: implement above

    return { activeStep: 'IDLE', actionOutput: {}, transitioned: false };
  }

  getCurrentStep() {
    // TODO: return the step object matching this.currentStepId
    return null;
  }

  reset() {
    // TODO: reset currentStepId to the first step's id
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
    starterPy: `class SFC:
    def __init__(self, steps, transitions):
        self.steps = steps
        self.transitions = transitions
        self.current_step_id = steps[0]['id'] if steps else 0

    def update(self, inputs):
        # Step 1: Find transitions where t['from'] == self.current_step_id
        # Step 2: Loop; if condition(inputs) is True → update current_step_id, set transitioned, break
        # Step 3: Find active step: next(s for s in self.steps if s['id'] == self.current_step_id)
        # Step 4: Call active_step['action'](inputs) if it exists, else action_output = {}
        # Step 5: Return {'activeStep': name, 'actionOutput': ..., 'transitioned': ...}
        # TODO: implement above

        return {'activeStep': 'IDLE', 'actionOutput': {}, 'transitioned': False}

    def get_current_step(self):
        # TODO: return step dict matching self.current_step_id
        return None

    def reset(self):
        # TODO: reset current_step_id to steps[0]['id']
        pass


solution = SFC

# Pump startup sequence
steps = [
    {'id': 0, 'name': 'IDLE',    'action': lambda inputs: {'pump': False, 'valve': False}},
    {'id': 1, 'name': 'PRIMING', 'action': lambda inputs: {'pump': False, 'valve': True}},
    {'id': 2, 'name': 'RUNNING', 'action': lambda inputs: {'pump': True,  'valve': True}},
]
transitions = [
    {'from': 0, 'to': 1, 'condition': lambda inputs: inputs.get('start_cmd') is True},
    {'from': 1, 'to': 2, 'condition': lambda inputs: inputs.get('pressure_ok') is True},
    {'from': 2, 'to': 0, 'condition': lambda inputs: inputs.get('stop_cmd') is True},
]
sfc = SFC(steps, transitions)
print(sfc.update({'start_cmd': True}))   # PRIMING
print(sfc.update({'pressure_ok': True})) # RUNNING
print(sfc.update({'pump': True}))        # stays RUNNING
print(sfc.update({'stop_cmd': True}))    # IDLE`,
    starterJython: `class SFC:
    def __init__(self, steps, transitions):
        self.steps = steps
        self.transitions = transitions
        self.current_step_id = steps[0]['id'] if steps else 0

    def update(self, inputs):
        # Step 1: Find transitions where t['from'] == self.current_step_id
        # Step 2: Loop; if condition(inputs) is True → update current_step_id, break
        # Step 3: Find active step by matching 'id' in self.steps (use a for loop — no next() in Jython 2.7)
        # Step 4: Call active_step['action'](inputs) if key exists, else action_output = {}
        # Step 5: Return {'activeStep': name, 'actionOutput': ..., 'transitioned': ...}
        # TODO: implement above

        return {'activeStep': 'IDLE', 'actionOutput': {}, 'transitioned': False}

    def get_current_step(self):
        # TODO: return step dict matching self.current_step_id (use a for loop)
        return None

    def reset(self):
        # TODO: reset current_step_id to steps[0]['id']
        pass


solution = SFC

steps = [
    {'id': 0, 'name': 'IDLE',    'action': lambda inputs: {'pump': False, 'valve': False}},
    {'id': 1, 'name': 'PRIMING', 'action': lambda inputs: {'pump': False, 'valve': True}},
    {'id': 2, 'name': 'RUNNING', 'action': lambda inputs: {'pump': True,  'valve': True}},
]
transitions = [
    {'from': 0, 'to': 1, 'condition': lambda inputs: inputs.get('start_cmd') is True},
    {'from': 1, 'to': 2, 'condition': lambda inputs: inputs.get('pressure_ok') is True},
    {'from': 2, 'to': 0, 'condition': lambda inputs: inputs.get('stop_cmd') is True},
]
sfc = SFC(steps, transitions)
print(sfc.update({'start_cmd': True}))
print(sfc.update({'pressure_ok': True}))
print(sfc.update({'pump': True}))
print(sfc.update({'stop_cmd': True}))`,
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
    // Step 1: If already faulted (_fault is true), return latched fault state immediately
    //         { safeState: false, fault: true, discrepancyMs: ..., faultReason: ... }

    // Step 2: Check if ch1 === ch2 (channels agree)

    // Step 3: If NOT agreeing — increment _discrepancyMs by scanTimeMs
    //         If _discrepancyMs >= discrepancyTimeMs → latch fault, set _faultReason string

    // Step 4: If agreeing — reset _discrepancyMs to 0

    // Step 5: Compute safeState = ch1 is true AND ch2 is true AND NOT faulted

    // Step 6: Return { safeState, fault: this._fault, discrepancyMs: ..., faultReason: ... }

    // TODO: implement above
    return { safeState: false, fault: false, discrepancyMs: 0, faultReason: '' };
  }

  reset(authCode) {
    // Step 1: If authCode !== 1234 → return { success: false, reason: 'Invalid authorization code' }
    // Step 2: Clear _fault, _faultReason, and _discrepancyMs
    // Step 3: Return { success: true }
    // TODO: implement above
    return { success: false, reason: 'Not implemented' };
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
    starterPy: `class SafetyInterlock:
    def __init__(self, discrepancy_time_ms=500, scan_time_ms=10):
        self.discrepancy_time_ms = discrepancy_time_ms
        self.scan_time_ms = scan_time_ms
        self._fault = False
        self._fault_reason = ''
        self._discrepancy_ms = 0

    def update(self, ch1, ch2):
        # Step 1: If self._fault is True, return latched fault state immediately

        # Step 2: Check if ch1 == ch2 (channels agree)

        # Step 3: If NOT agreeing — increment _discrepancy_ms by scan_time_ms
        #         If _discrepancy_ms >= discrepancy_time_ms → latch fault, set _fault_reason

        # Step 4: If agreeing — reset _discrepancy_ms to 0

        # Step 5: safe_state = ch1 is True and ch2 is True and not self._fault

        # Step 6: Return {'safeState': safe_state, 'fault': ..., 'discrepancyMs': ..., 'faultReason': ...}

        # TODO: implement above
        return {'safeState': False, 'fault': False, 'discrepancyMs': 0, 'faultReason': ''}

    def reset(self, auth_code):
        # Step 1: If auth_code != 1234 → return {'success': False, 'reason': 'Invalid authorization code'}
        # Step 2: Clear _fault, _fault_reason, _discrepancy_ms
        # Step 3: Return {'success': True}
        # TODO: implement above
        return {'success': False, 'reason': 'Not implemented'}


solution = SafetyInterlock

interlock = SafetyInterlock(500, 100)
print(interlock.update(True, True))    # safeState=True
print(interlock.update(False, False))  # safeState=False, no fault

for i in range(6):
    interlock.update(True, False)
print(interlock.update(True, False))   # fault=True, latched

print(interlock.reset(9999))           # wrong code
print(interlock.reset(1234))           # correct code, clears fault`,
    starterJython: `class SafetyInterlock:
    def __init__(self, discrepancy_time_ms=500, scan_time_ms=10):
        self.discrepancy_time_ms = discrepancy_time_ms
        self.scan_time_ms = scan_time_ms
        self._fault = False
        self._fault_reason = ''
        self._discrepancy_ms = 0

    def update(self, ch1, ch2):
        # Step 1: If self._fault is True, return latched fault state immediately

        # Step 2: Check if ch1 == ch2 (channels agree)

        # Step 3: If NOT agreeing — increment _discrepancy_ms by scan_time_ms
        #         If _discrepancy_ms >= discrepancy_time_ms → latch fault
        #         Use .format() for the fault reason string (no f-strings in Jython 2.7)

        # Step 4: If agreeing — reset _discrepancy_ms to 0

        # Step 5: safe_state = ch1 is True and ch2 is True and not self._fault

        # Step 6: Return {'safeState': ..., 'fault': ..., 'discrepancyMs': ..., 'faultReason': ...}

        # TODO: implement above
        return {'safeState': False, 'fault': False, 'discrepancyMs': 0, 'faultReason': ''}

    def reset(self, auth_code):
        # Step 1: If auth_code != 1234 → return {'success': False, 'reason': 'Invalid authorization code'}
        # Step 2: Clear _fault, _fault_reason, _discrepancy_ms
        # Step 3: Return {'success': True}
        # TODO: implement above
        return {'success': False, 'reason': 'Not implemented'}


solution = SafetyInterlock

interlock = SafetyInterlock(500, 100)
print(interlock.update(True, True))
print(interlock.update(False, False))

for i in range(6):
    interlock.update(True, False)
print(interlock.update(True, False))

print(interlock.reset(9999))
print(interlock.reset(1234))`,
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
    // Skip empty lines and comments starting with // or (*
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('(*')) continue;

    // TODO: Step 1 — Split trimmed on whitespace: [op, operand]
    //       Look up operand value in vars if operand exists

    // TODO: Step 2 — Implement a switch/if-else on op.toUpperCase():
    //   'LD'   → result = val; log push
    //   'ST'   → vars[operand] = result; log push
    //   'AND'  → result = result && val; log push
    //   'OR'   → result = result || val; log push
    //   'NOT'  → result = !result; log push (no operand)
    //   'ANDN' → result = result && !val; log push
    //   'ORN'  → result = result || !val; log push
    //   default → log push 'UNKNOWN: <op>'

    // TODO: implement above
  }

  // TODO: Step 3 — Return { result, variables: vars, log }
  return { result: undefined, variables: vars, log };
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
    starterPy: `import re

def run_il(instructions, variables):
    result = None
    vars_ = dict(variables)  # don't mutate original
    log = []

    for line in instructions:
        trimmed = line.strip()
        # Skip empty lines and comments
        if not trimmed or trimmed.startswith('//') or trimmed.startswith('(*'):
            continue

        # TODO: Step 1 — Split trimmed on whitespace: parts = re.split(r'\s+', trimmed)
        #       op = parts[0].upper(), operand = parts[1] if len(parts) > 1 else None
        #       val = vars_.get(operand) if operand else None

        # TODO: Step 2 — Implement if/elif chain on op:
        #   'LD'   → result = val; log.append(...)
        #   'ST'   → vars_[operand] = result; log.append(...)
        #   'AND'  → result = result and val; log.append(...)
        #   'OR'   → result = result or val; log.append(...)
        #   'NOT'  → result = not result; log.append(...)
        #   'ANDN' → result = result and not val; log.append(...)
        #   'ORN'  → result = result or not val; log.append(...)
        #   else   → log.append('UNKNOWN: ...')

        pass  # TODO: implement above

    # TODO: Step 3 — Return {'result': result, 'variables': vars_, 'log': log}
    return {'result': None, 'variables': vars_, 'log': log}


solution = run_il

# Classic motor run circuit
program = [
    'LD  Start_PB',
    'OR  Seal_In',
    'ANDN E_Stop',
    'ST  Motor_Run',
]

vars1 = {'Start_PB': True, 'Seal_In': False, 'E_Stop': False, 'Motor_Run': False}
result1 = run_il(program, vars1)
print('Motor_Run:', result1['variables']['Motor_Run'])  # True

vars2 = {'Start_PB': False, 'Seal_In': True, 'E_Stop': True, 'Motor_Run': True}
result2 = run_il(program, vars2)
print('Motor_Run (E-Stop active):', result2['variables']['Motor_Run'])  # False`,
    starterJython: `import re

def run_il(instructions, variables):
    result = None
    vars_ = dict(variables)
    log = []

    for line in instructions:
        trimmed = line.strip()
        # Skip empty lines and comments
        if not trimmed or trimmed.startswith('//') or trimmed.startswith('(*'):
            continue

        # TODO: Step 1 — Split: parts = re.split(r'\s+', trimmed)
        #       op = parts[0].upper(), operand = parts[1] if len(parts) > 1 else None
        #       val = vars_.get(operand) if operand is not None else None

        # TODO: Step 2 — Implement if/elif chain on op:
        #   'LD'   → result = val; log.append(...)
        #   'ST'   → vars_[operand] = result; log.append(...)
        #   'AND'  → result = result and val; log.append(...)
        #   'OR'   → result = result or val; log.append(...)
        #   'NOT'  → result = not result; log.append(...)
        #   'ANDN' → result = result and not val; log.append(...)
        #   'ORN'  → result = result or not val; log.append(...)
        #   else   → log.append('UNKNOWN: ...')
        #   Use .format() for log strings (Jython 2.7 — no f-strings)

        pass  # TODO: implement above

    # TODO: Step 3 — Return {'result': result, 'variables': vars_, 'log': log}
    return {'result': None, 'variables': vars_, 'log': log}


solution = run_il

program = [
    'LD  Start_PB',
    'OR  Seal_In',
    'ANDN E_Stop',
    'ST  Motor_Run',
]

vars1 = {'Start_PB': True, 'Seal_In': False, 'E_Stop': False, 'Motor_Run': False}
result1 = run_il(program, vars1)
print('Motor_Run:', result1['variables']['Motor_Run'])

vars2 = {'Start_PB': False, 'Seal_In': True, 'E_Stop': True, 'Motor_Run': True}
result2 = run_il(program, vars2)
print('Motor_Run (E-Stop active):', result2['variables']['Motor_Run'])`,
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
