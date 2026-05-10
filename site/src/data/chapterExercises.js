export const IEC_CHAPTER_EXERCISES = {
  intro: {
    id: 'iec-ch1-ex',
    title: 'Classify a POU Type',
    scenario: `You're building a documentation tool for an IEC 61131-3 project. Given a POU type string, return an object with its canonical name and a one-line description of when you would use it.

Inputs: 'program' | 'function' | 'function_block'
Output: { type: string, description: string }

Examples:
  classifyPOU('program')        → { type: 'PROGRAM', description: 'Top-level execution unit; one instance per task' }
  classifyPOU('function')       → { type: 'FUNCTION', description: 'Stateless; same inputs always produce same output' }
  classifyPOU('function_block') → { type: 'FUNCTION_BLOCK', description: 'Stateful; retains values between scan cycles' }
  classifyPOU('unknown')        → { type: 'UNKNOWN', description: 'Not a valid IEC 61131-3 POU type' }`,
    hint: `Normalize the input to lowercase, then match against the three valid POU types. Use a lookup object or if/else chain. Return UNKNOWN for anything else.`,
    starter: `function classifyPOU(type) {
  // IEC 61131-3 defines three active POU types:
  //   PROGRAM       — executed directly by a task; holds global state for that task
  //   FUNCTION      — no internal state; deterministic output from inputs alone
  //   FUNCTION_BLOCK — has internal state (like a class instance); instantiated before use
  //
  // Step 1: Normalize input to lowercase for comparison
  // Step 2: Match against 'program', 'function', 'function_block'
  // Step 3: Return { type: 'PROGRAM'|'FUNCTION'|'FUNCTION_BLOCK'|'UNKNOWN', description: '...' }

  // TODO: Step 1 — normalize input
  // TODO: Step 2 — build lookup or if/else for each POU type
  // TODO: Step 3 — return matched object, or UNKNOWN fallback

  return { type: 'UNKNOWN', description: 'Not implemented yet' }
}
const solution = classifyPOU

console.log(classifyPOU('program'))
console.log(classifyPOU('function_block'))
console.log(classifyPOU('FUNCTION'))`,
    starterPy: `def classify_pou(type_str):
    # IEC 61131-3 defines three active POU types:
    #   PROGRAM       — executed directly by a task; holds global state
    #   FUNCTION      — stateless; deterministic output from inputs alone
    #   FUNCTION_BLOCK — stateful; retains values between scan cycles
    #
    # Step 1: Normalize input to lowercase
    # Step 2: Match 'program', 'function', 'function_block'
    # Step 3: Return dict with 'type' and 'description'

    # TODO: Step 1 — normalize
    # TODO: Step 2 — match POU type
    # TODO: Step 3 — return result dict

    return {"type": "UNKNOWN", "description": "Not implemented yet"}

solution = classify_pou

print(classify_pou("program"))
print(classify_pou("function_block"))`,
    starterJython: `def classify_pou(type_str):
    # Jython 2.7 — no f-strings, no type hints
    # Step 1: Normalize input to lowercase
    # Step 2: Match 'program', 'function', 'function_block'
    # Step 3: Return dict with 'type' and 'description'

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3

    return {"type": "UNKNOWN", "description": "Not implemented yet"}

solution = classify_pou`,
    tests: [
      { description: "classifyPOU('program') returns type 'PROGRAM'" },
      { description: "classifyPOU('function_block') returns type 'FUNCTION_BLOCK'" },
      { description: "classifyPOU('FUNCTION') (uppercase) returns type 'FUNCTION'" },
      { description: "classifyPOU('unknown') returns type 'UNKNOWN'" },
    ],
    testRunner: function(solution) {
      function check(input, expectedType) {
        try {
          const result = solution(input)
          const passed = result && result.type === expectedType && typeof result.description === 'string' && result.description.length > 0
          return { passed, expected: expectedType, actual: result ? result.type : result }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check('program', 'PROGRAM'),
        check('function_block', 'FUNCTION_BLOCK'),
        check('FUNCTION', 'FUNCTION'),
        check('unknown', 'UNKNOWN'),
      ]
    },
  },

  datatypes: {
    id: 'iec-ch2-ex',
    title: 'Validate an IEC Data Type Value',
    scenario: `You're writing a tag validation utility that checks whether a value falls within the legal range for a given IEC 61131-3 data type.

Inputs: typeName (string), value (number)
Output: { valid: boolean, reason: string }

Type ranges to handle:
  BOOL  → 0 or 1 only
  SINT  → -128 to 127
  INT   → -32768 to 32767
  DINT  → -2147483648 to 2147483647
  REAL  → any finite number (reject Infinity, NaN)
  UDINT → 0 to 4294967295

Examples:
  validateIECType('BOOL', 1)     → { valid: true, reason: 'OK' }
  validateIECType('BOOL', 2)     → { valid: false, reason: 'BOOL must be 0 or 1' }
  validateIECType('INT', 40000)  → { valid: false, reason: 'INT out of range: -32768..32767' }
  validateIECType('REAL', NaN)   → { valid: false, reason: 'REAL must be a finite number' }`,
    hint: `Use a lookup table (object) mapping type names to { min, max } ranges. For BOOL, check exactly 0 or 1. For REAL, use Number.isFinite(). Return { valid: false, reason: 'Unknown type: X' } for unrecognized types.`,
    starter: `function validateIECType(typeName, value) {
  // IEC 61131-3 numeric type ranges:
  //   BOOL : 0 or 1
  //   SINT : -128 to 127           (8-bit signed)
  //   INT  : -32768 to 32767       (16-bit signed)
  //   DINT : -2147483648 to 2147483647  (32-bit signed)
  //   UDINT: 0 to 4294967295       (32-bit unsigned)
  //   REAL : any finite float      (IEEE 754 single)
  //
  // Step 1: Handle BOOL as a special case (value must be exactly 0 or 1)
  // Step 2: Handle REAL — use Number.isFinite(value)
  // Step 3: For INT types, look up min/max and check range
  // Step 4: Return { valid: false, reason: 'Unknown type: X' } for anything else

  // TODO: Step 1 — BOOL check
  // TODO: Step 2 — REAL check
  // TODO: Step 3 — range check for SINT, INT, DINT, UDINT
  // TODO: Step 4 — unknown type fallback

  return { valid: false, reason: 'Not implemented' }
}
const solution = validateIECType

console.log(validateIECType('BOOL', 1))
console.log(validateIECType('INT', 40000))
console.log(validateIECType('REAL', NaN))`,
    starterPy: `import math

def validate_iec_type(type_name, value):
    # Step 1: Handle BOOL (value must be 0 or 1)
    # Step 2: Handle REAL (must be finite — not NaN or Inf)
    # Step 3: Range check for SINT, INT, DINT, UDINT
    # Step 4: Unknown type fallback

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4

    return {"valid": False, "reason": "Not implemented"}

solution = validate_iec_type

print(validate_iec_type("BOOL", 1))
print(validate_iec_type("INT", 40000))
print(validate_iec_type("REAL", float("nan")))`,
    starterJython: `def validate_iec_type(type_name, value):
    # Jython 2.7 — no f-strings, no math.isfinite (use not (value != value) and abs(value) != float('inf'))
    # Step 1: BOOL check (0 or 1)
    # Step 2: REAL check (finite)
    # Step 3: Range check for integer types
    # Step 4: Unknown type fallback

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4

    return {"valid": False, "reason": "Not implemented"}

solution = validate_iec_type`,
    tests: [
      { description: "validateIECType('BOOL', 1) → valid: true" },
      { description: "validateIECType('BOOL', 2) → valid: false (out of range)" },
      { description: "validateIECType('INT', 40000) → valid: false (exceeds 32767)" },
      { description: "validateIECType('REAL', 3.14) → valid: true" },
    ],
    testRunner: function(solution) {
      function check(typeName, value, expectedValid) {
        try {
          const r = solution(typeName, value)
          const passed = r && r.valid === expectedValid && typeof r.reason === 'string'
          return { passed, expected: expectedValid, actual: r ? r.valid : r }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check('BOOL', 1, true),
        check('BOOL', 2, false),
        check('INT', 40000, false),
        check('REAL', 3.14, true),
      ]
    },
  },

  st: {
    id: 'iec-ch3-ex',
    title: 'Simulate a Simple ST Expression',
    scenario: `You're building a mini Structured Text expression evaluator for a training tool. Given a simple boolean or arithmetic expression string and a variable map, return the evaluated result.

Support these expression forms only:
  - Variable lookup:  'MotorRun'  → vars['MotorRun']
  - NOT:              'NOT FaultActive'  → !vars['FaultActive']
  - AND:              'MotorRun AND DoorClosed'
  - OR:               'Alarm1 OR Alarm2'
  - Comparison:       'Speed > 50'  (variable on left, number literal on right, operators: > < >= <= = <>)

Inputs: expr (string), vars (object)
Output: the evaluated boolean or number

Examples:
  evalSTExpression('MotorRun', { MotorRun: true })  → true
  evalSTExpression('NOT FaultActive', { FaultActive: false })  → true
  evalSTExpression('Speed > 50', { Speed: 75 })  → true
  evalSTExpression('A AND B', { A: true, B: false })  → false`,
    hint: `Trim and split on ' AND ', ' OR ', or match 'NOT X'. For comparisons, split on the operator token and compare. Use vars[name] to resolve variable names. Don't worry about nested expressions — keep it flat.`,
    starter: `function evalSTExpression(expr, vars) {
  // Supported forms (flat, no nesting):
  //   'VarName'           → return vars[VarName]
  //   'NOT VarName'       → return !vars[VarName]
  //   'A AND B'           → return vars[A] && vars[B]
  //   'A OR B'            → return vars[A] || vars[B]
  //   'VarName > number'  → return vars[VarName] > number  (also <, >=, <=, =, <>)
  //
  // Step 1: Trim whitespace from expr
  // Step 2: Check for ' AND ' — split, resolve each side, return logical AND
  // Step 3: Check for ' OR '  — split, resolve each side, return logical OR
  // Step 4: Check for 'NOT '  — strip prefix, return NOT of variable
  // Step 5: Check for comparison operators (>, <, >=, <=, =, <>)
  // Step 6: Fall through — return vars[expr] (plain variable lookup)

  // TODO: Step 1
  // TODO: Step 2 — AND
  // TODO: Step 3 — OR
  // TODO: Step 4 — NOT
  // TODO: Step 5 — comparisons
  // TODO: Step 6 — variable lookup

  return undefined
}
const solution = evalSTExpression

console.log(evalSTExpression('MotorRun', { MotorRun: true }))
console.log(evalSTExpression('NOT FaultActive', { FaultActive: false }))
console.log(evalSTExpression('Speed > 50', { Speed: 75 }))
console.log(evalSTExpression('A AND B', { A: true, B: false }))`,
    starterPy: `def eval_st_expression(expr, vars):
    # Step 1: Trim whitespace
    # Step 2: Check for ' AND '
    # Step 3: Check for ' OR '
    # Step 4: Check for 'NOT '
    # Step 5: Check for comparison operators (>, <, >=, <=, =, <>)
    # Step 6: Fall through — plain variable lookup

    # TODO: Step 1
    # TODO: Step 2 — AND
    # TODO: Step 3 — OR
    # TODO: Step 4 — NOT
    # TODO: Step 5 — comparisons
    # TODO: Step 6 — variable lookup

    return None

solution = eval_st_expression

print(eval_st_expression("MotorRun", {"MotorRun": True}))
print(eval_st_expression("NOT FaultActive", {"FaultActive": False}))
print(eval_st_expression("Speed > 50", {"Speed": 75}))`,
    starterJython: `def eval_st_expression(expr, vars):
    # Jython 2.7 — no f-strings, no walrus operator
    # Same logic as Python 3 version

    # TODO: Step 1 — strip
    # TODO: Step 2 — AND
    # TODO: Step 3 — OR
    # TODO: Step 4 — NOT
    # TODO: Step 5 — comparisons
    # TODO: Step 6 — variable lookup

    return None

solution = eval_st_expression`,
    tests: [
      { description: "evalSTExpression('MotorRun', { MotorRun: true }) → true" },
      { description: "evalSTExpression('NOT FaultActive', { FaultActive: false }) → true" },
      { description: "evalSTExpression('Speed > 50', { Speed: 75 }) → true" },
      { description: "evalSTExpression('A AND B', { A: true, B: false }) → false" },
    ],
    testRunner: function(solution) {
      function check(expr, vars, expected) {
        try {
          const result = solution(expr, vars)
          return { passed: result === expected, expected, actual: result }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check('MotorRun', { MotorRun: true }, true),
        check('NOT FaultActive', { FaultActive: false }, true),
        check('Speed > 50', { Speed: 75 }, true),
        check('A AND B', { A: true, B: false }, false),
      ]
    },
  },

  ld: {
    id: 'iec-ch4-ex',
    title: 'Simulate a Ladder Rung',
    scenario: `You're building a Ladder Diagram rung simulator. Given an array of contact states and a rung configuration, determine whether the output coil energizes.

A rung is a series-parallel logic circuit:
  - contacts is an array of { name, state, type } objects
  - type is 'NO' (normally open) or 'NC' (normally closed)
  - series contacts: ALL must pass current (AND logic)
  - parallel contacts: provided as an array of series groups — ANY group passing current energizes the coil

Inputs:
  groups — array of arrays of contacts (outer = parallel, inner = series)
Output: boolean — true if coil energizes

Examples:
  simulateRung([[{ name:'A', state:true, type:'NO' }]])          → true
  simulateRung([[{ name:'A', state:false, type:'NC' }]])         → true  (NC, state:false = closed)
  simulateRung([[{ name:'A', state:true, type:'NO' }, { name:'B', state:false, type:'NO' }]])  → false  (series AND)
  simulateRung([[{ name:'A', state:false }], [{ name:'B', state:true }]])  → true  (parallel OR)`,
    hint: `For each contact: an NO contact passes current when state is true; an NC contact passes current when state is false. A series group (inner array) passes if ALL contacts pass. The rung output is true if ANY group passes (parallel = OR).`,
    starter: `function simulateRung(groups) {
  // Ladder rung logic:
  //   Normally Open (NO) contact  → passes current when state === true
  //   Normally Closed (NC) contact → passes current when state === false
  //   Missing type defaults to 'NO'
  //
  // Inner array = series contacts (AND)
  // Outer array = parallel branches (OR)
  //
  // Step 1: Write a helper contactPasses(contact) → boolean
  //         NO: return contact.state === true
  //         NC: return contact.state === false (closed when de-energized)
  // Step 2: For each group (inner array), check if ALL contacts pass → seriesPasses
  // Step 3: Return true if ANY group passes (parallel OR)

  // TODO: Step 1 — contactPasses helper
  // TODO: Step 2 — series group evaluation (every)
  // TODO: Step 3 — parallel evaluation (some)

  return false
}
const solution = simulateRung

const NO = (name, state) => ({ name, state, type: 'NO' })
const NC = (name, state) => ({ name, state, type: 'NC' })
console.log(simulateRung([[NO('A', true)]]))                            // true
console.log(simulateRung([[NC('A', false)]]))                           // true
console.log(simulateRung([[NO('A', true), NO('B', false)]]))            // false
console.log(simulateRung([[NO('A', false)], [NO('B', true)]]))          // true`,
    starterPy: `def simulate_rung(groups):
    # Step 1: contact_passes(contact) — NO passes when state True, NC when state False
    # Step 2: series group passes when ALL contacts pass
    # Step 3: rung coil fires when ANY group passes

    # TODO: Step 1 — contact_passes
    # TODO: Step 2 — series check (all)
    # TODO: Step 3 — parallel check (any)

    return False

solution = simulate_rung

NO = lambda name, state: {"name": name, "state": state, "type": "NO"}
NC = lambda name, state: {"name": name, "state": state, "type": "NC"}
print(simulate_rung([[NO("A", True)]]))
print(simulate_rung([[NC("A", False)]]))`,
    starterJython: `def simulate_rung(groups):
    # Jython 2.7 — same logic as Python 3
    # Step 1: contact_passes
    # Step 2: series AND
    # Step 3: parallel OR

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3

    return False

solution = simulate_rung`,
    tests: [
      { description: 'Single NO contact, state=true → coil energizes' },
      { description: 'Single NC contact, state=false → coil energizes (NC closed)' },
      { description: 'Series: A=true AND B=false → coil does NOT energize' },
      { description: 'Parallel: branch1=false OR branch2=true → coil energizes' },
    ],
    testRunner: function(solution) {
      const NO = (name, state) => ({ name, state, type: 'NO' })
      const NC = (name, state) => ({ name, state, type: 'NC' })
      function check(groups, expected) {
        try {
          const result = solution(groups)
          return { passed: result === expected, expected, actual: result }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check([[NO('A', true)]], true),
        check([[NC('A', false)]], true),
        check([[NO('A', true), NO('B', false)]], false),
        check([[NO('A', false)], [NO('B', true)]], true),
      ]
    },
  },

  fbd: {
    id: 'iec-ch5-ex',
    title: 'Resolve FBD Block Execution Order',
    scenario: `In Function Block Diagram, blocks must execute in data-flow order — a block cannot run until all its input blocks have completed. Given a list of blocks and their connections, return the correct execution order using topological sort.

Inputs:
  blocks      — array of block name strings
  connections — array of [from, to] pairs (from feeds into to)

Output: array of block names in valid execution order, or null if a cycle is detected.

Examples:
  connectBlocks(['A','B','C'], [['A','B'],['B','C']])  → ['A','B','C']
  connectBlocks(['A','B','C'], [['A','C'],['B','C']])  → ['A','B','C'] or ['B','A','C']
  connectBlocks(['A','B'], [['A','B'],['B','A']])      → null  (cycle detected)`,
    hint: `Use Kahn's algorithm: compute in-degree for each node, start with nodes that have in-degree 0, process them in a queue, decrement neighbors' in-degrees, enqueue any that reach 0. If the output length is less than blocks.length, there's a cycle.`,
    starter: `function connectBlocks(blocks, connections) {
  // Kahn's Algorithm (topological sort):
  //
  // Step 1: Build an adjacency list (outgoing edges) and in-degree map
  //         For each block, initialize inDegree[block] = 0
  //         For each [from, to] connection: adjacency[from].push(to), inDegree[to]++
  //
  // Step 2: Initialize queue with all blocks where inDegree === 0
  //
  // Step 3: Process queue:
  //         - Dequeue a block, push to result
  //         - For each neighbor in adjacency[block]:
  //             inDegree[neighbor]--
  //             if inDegree[neighbor] === 0, enqueue it
  //
  // Step 4: If result.length < blocks.length → cycle detected, return null

  // TODO: Step 1 — build adjacency list and in-degree map
  // TODO: Step 2 — initialize queue with zero-in-degree nodes
  // TODO: Step 3 — Kahn's main loop
  // TODO: Step 4 — cycle check

  return null
}
const solution = connectBlocks

console.log(connectBlocks(['A','B','C'], [['A','B'],['B','C']]))  // ['A','B','C']
console.log(connectBlocks(['A','B','C'], [['A','C'],['B','C']]))  // A,B before C
console.log(connectBlocks(['A','B'], [['A','B'],['B','A']]))      // null (cycle)`,
    starterPy: `from collections import deque

def connect_blocks(blocks, connections):
    # Step 1: Build adjacency list and in-degree map
    # Step 2: Queue of zero-in-degree nodes
    # Step 3: Kahn's loop
    # Step 4: Cycle check — if len(result) < len(blocks), return None

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4

    return None

solution = connect_blocks

print(connect_blocks(["A","B","C"], [["A","B"],["B","C"]]))
print(connect_blocks(["A","B"], [["A","B"],["B","A"]]))`,
    starterJython: `from collections import deque

def connect_blocks(blocks, connections):
    # Jython 2.7 — same algorithm as Python 3
    # Step 1: adjacency + in-degree
    # Step 2: zero-in-degree queue
    # Step 3: Kahn's loop
    # Step 4: cycle check

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4

    return None

solution = connect_blocks`,
    tests: [
      { description: "Linear chain A→B→C returns ['A','B','C']" },
      { description: 'Cycle A→B→A detected, returns null' },
      { description: 'Fan-in: A→C and B→C puts C last in order' },
      { description: 'Single block with no connections returns that block' },
    ],
    testRunner: function(solution) {
      function check(blocks, connections, validator) {
        try {
          const result = solution(blocks, connections)
          return { passed: validator(result), expected: 'valid order', actual: JSON.stringify(result) }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check(['A','B','C'], [['A','B'],['B','C']], r => Array.isArray(r) && r.join('') === 'ABC'),
        check(['A','B'], [['A','B'],['B','A']], r => r === null),
        check(['A','B','C'], [['A','C'],['B','C']], r => Array.isArray(r) && r.length === 3 && r[2] === 'C'),
        check(['X'], [], r => Array.isArray(r) && r[0] === 'X'),
      ]
    },
  },

  sfc: {
    id: 'iec-ch6-ex',
    title: 'Advance an SFC Step',
    scenario: `You're simulating a Sequential Function Chart engine. Given the current active step and a list of transitions, determine which step to move to next.

Each transition has: { from, to, condition } where condition is a boolean.
Rules:
  1. Find all transitions where from === currentStep AND condition === true
  2. If exactly one is active, return its 'to' step name
  3. If none are active, return currentStep (stay put)
  4. If more than one is active (divergence), return the first one found (priority divergence)

Inputs: currentStep (string), transitions (array of {from, to, condition})
Output: next step name (string)

Examples:
  nextSFCStep('S1', [{ from:'S1', to:'S2', condition:true }])   → 'S2'
  nextSFCStep('S1', [{ from:'S1', to:'S2', condition:false }])  → 'S1'
  nextSFCStep('S1', [{ from:'S1', to:'S2', condition:true }, { from:'S1', to:'S3', condition:true }])  → 'S2'`,
    hint: `Filter transitions where from === currentStep, then filter those where condition === true. If the filtered list is empty, return currentStep. Otherwise return filtered[0].to.`,
    starter: `function nextSFCStep(currentStep, transitions) {
  // SFC transition rules:
  //   - Only transitions from the current step are relevant
  //   - A transition fires when its condition is true
  //   - If no transition fires, stay in current step
  //   - Priority divergence: if multiple fire, take the first one
  //
  // Step 1: Filter transitions where t.from === currentStep
  // Step 2: From those, filter where t.condition === true
  // Step 3: If none active → return currentStep
  // Step 4: Return active[0].to (first active transition wins)

  // TODO: Step 1 — filter by from
  // TODO: Step 2 — filter by condition
  // TODO: Step 3 — no active transition case
  // TODO: Step 4 — return next step

  return currentStep
}
const solution = nextSFCStep

const T = (from, to, condition) => ({ from, to, condition })
console.log(nextSFCStep('S1', [T('S1','S2',true)]))                      // 'S2'
console.log(nextSFCStep('S1', [T('S1','S2',false)]))                     // 'S1'
console.log(nextSFCStep('S1', [T('S1','S2',true), T('S1','S3',true)]))  // 'S2'`,
    starterPy: `def next_sfc_step(current_step, transitions):
    # Step 1: Filter by from === current_step
    # Step 2: Filter by condition === True
    # Step 3: If none active, return current_step
    # Step 4: Return first active transition's 'to'

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4

    return current_step

solution = next_sfc_step

print(next_sfc_step("S1", [{"from":"S1","to":"S2","condition":True}]))
print(next_sfc_step("S1", [{"from":"S1","to":"S2","condition":False}]))`,
    starterJython: `def next_sfc_step(current_step, transitions):
    # Jython 2.7
    # Step 1: filter by 'from'
    # Step 2: filter by condition
    # Step 3: no-fire case
    # Step 4: return first active 'to'

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4

    return current_step

solution = next_sfc_step`,
    tests: [
      { description: "Active transition S1→S2 (condition=true) → returns 'S2'" },
      { description: "No active transition (condition=false) → stays at 'S1'" },
      { description: 'Priority divergence: two active transitions → first one wins' },
      { description: 'Transition from different step is ignored' },
    ],
    testRunner: function(solution) {
      const T = (from, to, condition) => ({ from, to, condition })
      function check(cur, transitions, expected) {
        try {
          const result = solution(cur, transitions)
          return { passed: result === expected, expected, actual: result }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check('S1', [T('S1','S2',true)], 'S2'),
        check('S1', [T('S1','S2',false)], 'S1'),
        check('S1', [T('S1','S2',true), T('S1','S3',true)], 'S2'),
        check('S1', [T('S2','S3',true), T('S1','S2',false)], 'S1'),
      ]
    },
  },

  pou: {
    id: 'iec-ch7-ex',
    title: 'Resolve POU Variable Scope',
    scenario: `IEC 61131-3 POUs have distinct scoping rules. Local variables (VAR) shadow global variables of the same name. VAR_INPUT and VAR_OUTPUT are also local. Given a variable name, a set of local vars, and a set of global vars, determine where the variable is found.

Inputs: varName (string), localVars (object), globalVars (object)
Output: { found: boolean, scope: 'local'|'global'|'not-found', value: any }

Lookup rules:
  1. Check localVars first — if found, scope = 'local'
  2. Then check globalVars — if found, scope = 'global'
  3. Otherwise — found: false, scope: 'not-found', value: undefined

Examples:
  resolvePOUScope('Speed', { Speed: 100 }, { Speed: 999, Temp: 25 })
    → { found: true, scope: 'local', value: 100 }
  resolvePOUScope('Temp', {}, { Temp: 25 })
    → { found: true, scope: 'global', value: 25 }
  resolvePOUScope('Missing', {}, {})
    → { found: false, scope: 'not-found', value: undefined }`,
    hint: `Use the 'in' operator (or hasOwnProperty) to check if a key exists — don't rely on truthiness, since a value of 0 or false is still a valid variable. Check local first, then global.`,
    starter: `function resolvePOUScope(varName, localVars, globalVars) {
  // IEC 61131-3 scope resolution order:
  //   1. Local scope (VAR, VAR_INPUT, VAR_OUTPUT, VAR_IN_OUT)
  //   2. Global scope (VAR_GLOBAL)
  //   Local variables SHADOW globals of the same name
  //
  // Important: use Object.prototype.hasOwnProperty or 'in' operator
  // to check existence — a value of 0 or false is still valid!
  //
  // Step 1: Check if varName is in localVars → return { found: true, scope: 'local', value: localVars[varName] }
  // Step 2: Check if varName is in globalVars → return { found: true, scope: 'global', value: globalVars[varName] }
  // Step 3: Not found → return { found: false, scope: 'not-found', value: undefined }

  // TODO: Step 1 — local check
  // TODO: Step 2 — global check
  // TODO: Step 3 — not found

  return { found: false, scope: 'not-found', value: undefined }
}
const solution = resolvePOUScope

console.log(resolvePOUScope('Speed', { Speed: 100 }, { Speed: 999, Temp: 25 }))
console.log(resolvePOUScope('Temp', {}, { Temp: 25 }))
console.log(resolvePOUScope('Missing', {}, {}))`,
    starterPy: `def resolve_pou_scope(var_name, local_vars, global_vars):
    # Step 1: Check local_vars (use 'in' operator, not truthiness)
    # Step 2: Check global_vars
    # Step 3: Return not-found

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3

    return {"found": False, "scope": "not-found", "value": None}

solution = resolve_pou_scope

print(resolve_pou_scope("Speed", {"Speed": 100}, {"Speed": 999, "Temp": 25}))
print(resolve_pou_scope("Temp", {}, {"Temp": 25}))
print(resolve_pou_scope("Missing", {}, {}))`,
    starterJython: `def resolve_pou_scope(var_name, local_vars, global_vars):
    # Jython 2.7 — same logic
    # Step 1: local check
    # Step 2: global check
    # Step 3: not found

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3

    return {"found": False, "scope": "not-found", "value": None}

solution = resolve_pou_scope`,
    tests: [
      { description: 'Local var shadows global of same name → scope: local' },
      { description: 'Var only in global → scope: global' },
      { description: 'Missing var → found: false, scope: not-found' },
      { description: 'Local var with value 0 (falsy) still found → scope: local' },
    ],
    testRunner: function(solution) {
      function check(varName, locals, globals, expectedFound, expectedScope) {
        try {
          const r = solution(varName, locals, globals)
          const passed = r && r.found === expectedFound && r.scope === expectedScope
          return { passed, expected: `found:${expectedFound} scope:${expectedScope}`, actual: r ? `found:${r.found} scope:${r.scope}` : r }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check('Speed', { Speed: 100 }, { Speed: 999 }, true, 'local'),
        check('Temp', {}, { Temp: 25 }, true, 'global'),
        check('Missing', {}, {}, false, 'not-found'),
        check('Counter', { Counter: 0 }, { Counter: 99 }, true, 'local'),
      ]
    },
  },

  rtac: {
    id: 'iec-ch8-ex',
    title: 'Parse an RTAC Tag Name',
    scenario: `RTAC tag names follow a naming convention that encodes the source device, signal type, and point name. Parse a tag string into its components.

Convention: DeviceName_SignalType_PointName
  - DeviceName: the IED alias (e.g., SEL351_1, Meter1)
  - SignalType: BI, BO, AI, AO, CNT, or TSS
  - PointName: the specific point name (e.g., CB1_Status, Trip)

Input: tag (string)
Output: { device: string, signalType: string, pointName: string } or null if invalid

Examples:
  parseRTACTagName('SEL351_1_BI_CB1_Status')
    → { device: 'SEL351_1', signalType: 'BI', pointName: 'CB1_Status' }
  parseRTACTagName('Meter1_AI_Voltage_A')
    → { device: 'Meter1', signalType: 'AI', pointName: 'Voltage_A' }
  parseRTACTagName('bad_tag')
    → null`,
    hint: `Split on '_' and scan for the first token that matches a known signal type (BI, BO, AI, AO, CNT, TSS). Everything before it is the device name (join with '_'), everything after is the point name. If no signal type token is found, return null.`,
    starter: `function parseRTACTagName(tag) {
  // RTAC tag convention: DeviceName_SignalType_PointName
  // Valid signal types: BI, BO, AI, AO, CNT, TSS
  //
  // Strategy: split on '_', find the index of the signal type token
  //   - device = parts before that index, joined with '_'
  //   - signalType = that token
  //   - pointName = parts after that index, joined with '_'
  //
  // Step 1: Define valid signal types array
  // Step 2: Split tag on '_'
  // Step 3: Find the index of the first token that is a valid signal type
  // Step 4: If not found, return null
  // Step 5: Build and return { device, signalType, pointName }

  // TODO: Step 1 — valid signal types
  // TODO: Step 2 — split tag
  // TODO: Step 3 — find signal type index
  // TODO: Step 4 — null if not found
  // TODO: Step 5 — construct result

  return null
}
const solution = parseRTACTagName

console.log(parseRTACTagName('SEL351_1_BI_CB1_Status'))
console.log(parseRTACTagName('Meter1_AI_Voltage_A'))
console.log(parseRTACTagName('bad_tag'))`,
    starterPy: `def parse_rtac_tag_name(tag):
    # Valid signal types: BI, BO, AI, AO, CNT, TSS
    # Step 1: define valid types
    # Step 2: split on '_'
    # Step 3: find signal type index
    # Step 4: return None if not found
    # Step 5: build result dict

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4
    # TODO: Step 5

    return None

solution = parse_rtac_tag_name

print(parse_rtac_tag_name("SEL351_1_BI_CB1_Status"))
print(parse_rtac_tag_name("Meter1_AI_Voltage_A"))
print(parse_rtac_tag_name("bad_tag"))`,
    starterJython: `def parse_rtac_tag_name(tag):
    # Jython 2.7 — same logic
    # Step 1: valid signal types list
    # Step 2: split
    # Step 3: find index
    # Step 4: None if not found
    # Step 5: return dict

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3
    # TODO: Step 4
    # TODO: Step 5

    return None

solution = parse_rtac_tag_name`,
    tests: [
      { description: "SEL351_1_BI_CB1_Status → device:'SEL351_1', signalType:'BI', pointName:'CB1_Status'" },
      { description: "Meter1_AI_Voltage_A → device:'Meter1', signalType:'AI', pointName:'Voltage_A'" },
      { description: "'bad_tag' (no valid signal type) → null" },
      { description: "DeviceName_TSS_Point parses TSS as signal type" },
    ],
    testRunner: function(solution) {
      function check(tag, expected) {
        try {
          const r = solution(tag)
          if (expected === null) return { passed: r === null, expected: 'null', actual: JSON.stringify(r) }
          const passed = r && r.device === expected.device && r.signalType === expected.signalType && r.pointName === expected.pointName
          return { passed: !!passed, expected: JSON.stringify(expected), actual: JSON.stringify(r) }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check('SEL351_1_BI_CB1_Status', { device: 'SEL351_1', signalType: 'BI', pointName: 'CB1_Status' }),
        check('Meter1_AI_Voltage_A', { device: 'Meter1', signalType: 'AI', pointName: 'Voltage_A' }),
        check('bad_tag', null),
        check('Relay_TSS_FaultTime', { device: 'Relay', signalType: 'TSS', pointName: 'FaultTime' }),
      ]
    },
  },

  troubleshoot: {
    id: 'iec-ch9-ex',
    title: 'Detect Scan Time Overruns',
    scenario: `You're writing a diagnostic tool for an RTAC technician. Given a list of task configurations and their measured execution times, identify which tasks are exceeding their configured scan period.

Each task has: { name, periodMs, measuredMs }
A task is overrunning if measuredMs > periodMs.

Return an array of objects for overrunning tasks:
  { name, periodMs, measuredMs, overrunMs }
where overrunMs = measuredMs - periodMs (rounded to 1 decimal).

If no tasks are overrunning, return an empty array.

Examples:
  detectScanTimeIssue([
    { name: 'FastTask', periodMs: 10, measuredMs: 12.3 },
    { name: 'SlowTask', periodMs: 100, measuredMs: 85 }
  ])
  → [{ name: 'FastTask', periodMs: 10, measuredMs: 12.3, overrunMs: 2.3 }]`,
    hint: `Filter tasks where measuredMs > periodMs, then map each to add overrunMs = Math.round((measuredMs - periodMs) * 10) / 10.`,
    starter: `function detectScanTimeIssue(tasks) {
  // Scan time overrun: measuredMs > periodMs
  // For overrunning tasks, compute: overrunMs = measuredMs - periodMs (1 decimal)
  //
  // Step 1: Filter tasks where task.measuredMs > task.periodMs
  // Step 2: Map filtered tasks to add overrunMs (round to 1 decimal place)
  //         Tip: Math.round(x * 10) / 10
  // Step 3: Return the mapped array (empty array if none)

  // TODO: Step 1 — filter overrunning tasks
  // TODO: Step 2 — add overrunMs field
  // TODO: Step 3 — return result

  return []
}
const solution = detectScanTimeIssue

console.log(detectScanTimeIssue([
  { name: 'FastTask', periodMs: 10, measuredMs: 12.3 },
  { name: 'SlowTask', periodMs: 100, measuredMs: 85 }
]))
// → [{ name:'FastTask', periodMs:10, measuredMs:12.3, overrunMs:2.3 }]`,
    starterPy: `def detect_scan_time_issue(tasks):
    # Step 1: Filter tasks where measured_ms > period_ms
    # Step 2: For each, add overrun_ms = round(measured - period, 1)
    # Step 3: Return result list

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3

    return []

solution = detect_scan_time_issue

tasks = [
    {"name": "FastTask", "periodMs": 10, "measuredMs": 12.3},
    {"name": "SlowTask", "periodMs": 100, "measuredMs": 85},
]
print(detect_scan_time_issue(tasks))`,
    starterJython: `def detect_scan_time_issue(tasks):
    # Jython 2.7 — same logic, no f-strings
    # Step 1: filter overrunning
    # Step 2: add overrunMs
    # Step 3: return

    # TODO: Step 1
    # TODO: Step 2
    # TODO: Step 3

    return []

solution = detect_scan_time_issue`,
    tests: [
      { description: 'Overrunning task is detected and overrunMs is correct' },
      { description: 'Non-overrunning task is excluded from results' },
      { description: 'Empty input → empty array' },
      { description: 'All tasks overrunning → all returned in result' },
    ],
    testRunner: function(solution) {
      function check(tasks, validator) {
        try {
          const result = solution(tasks)
          return { passed: validator(result), expected: 'see description', actual: JSON.stringify(result) }
        } catch(e) {
          return { passed: false, error: e.message }
        }
      }
      return [
        check(
          [{ name:'FastTask', periodMs:10, measuredMs:12.3 }, { name:'SlowTask', periodMs:100, measuredMs:85 }],
          r => Array.isArray(r) && r.length === 1 && r[0].name === 'FastTask' && r[0].overrunMs === 2.3
        ),
        check(
          [{ name:'FastTask', periodMs:10, measuredMs:12.3 }],
          r => Array.isArray(r) && !r.some(t => t.name === 'SlowTask')
        ),
        check([], r => Array.isArray(r) && r.length === 0),
        check(
          [{ name:'T1', periodMs:5, measuredMs:7 }, { name:'T2', periodMs:20, measuredMs:25 }],
          r => Array.isArray(r) && r.length === 2
        ),
      ]
    },
  },
}
