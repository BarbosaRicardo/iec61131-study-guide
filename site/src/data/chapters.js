export const CHAPTERS = [
  { id: 'home',  label: 'Home',                                  icon: 'Home',     path: '/' },
  { id: 'intro', label: 'Ch 1: IEC 61131-3 Overview',        title: 'IEC 61131-3 Overview',              icon: 'BookOpen', path: '/intro',        next: 'datatypes' },
  { id: 'datatypes', label: 'Ch 2: Data Types & Variables',    title: 'Data Types & Variables',            icon: 'Binary', path: '/datatypes',   prev: 'intro',      next: 'st' },
  { id: 'st', label: 'Ch 3: Structured Text',           title: 'Structured Text (ST)',               icon: 'Code', path: '/st',          prev: 'datatypes',  next: 'ld' },
  { id: 'ld', label: 'Ch 4: Ladder Diagram',           title: 'Ladder Diagram (LD)',                icon: 'GitBranch', path: '/ld',          prev: 'st',         next: 'fbd' },
  { id: 'fbd', label: 'Ch 5: Function Block Diagram',          title: 'Function Block Diagram (FBD)',       icon: 'Share2', path: '/fbd',         prev: 'ld',         next: 'sfc' },
  { id: 'sfc', label: 'Ch 6: Sequential Function Chart',          title: 'Sequential Function Chart (SFC)',    icon: 'GitGraph', path: '/sfc',         prev: 'fbd',        next: 'pou' },
  { id: 'pou', label: 'Ch 7: POUs',          title: 'POUs — Program, Function, FB',      icon: 'Package', path: '/pou',         prev: 'sfc',        next: 'rtac' },
  { id: 'rtac', label: 'Ch 8: IEC 61131-3 on RTAC',         title: 'IEC 61131-3 on the SEL RTAC',       icon: 'Zap', path: '/rtac',        prev: 'pou',        next: 'troubleshoot' },
  { id: 'troubleshoot', label: 'Ch 9: Debugging & Troubleshooting', title: 'Debugging & Troubleshooting',        icon: 'Wrench', path: '/troubleshoot',prev: 'rtac',       next: 'lab' },
  { id: 'lab', label: 'Ch 10: Lab & Practice',          title: 'Lab & Practice',                    icon: 'FlaskConical', path: '/lab',         prev: 'troubleshoot' },
  { id: 'flashcards', label: 'Flashcards', icon: 'CreditCard', path: '/flashcards' },
]

export const ANALOGIES = {
  intro: { text: "IEC 61131-3 is like a recipe everyone claims to follow but everyone seasons differently. Your code will 'run on any platform' — after you fix the 47 vendor-specific compilation errors.", author: "Every controls engineer who tried to port PLC code" },
  datatypes: { text: "Strongly typed IEC 61131-3 is like a Swiss border crossing. You cannot pass an INT where a REAL is expected without showing your conversion papers. This is annoying until the day it saves your process.", author: "Type safety, industrial edition" },
  st: { text: "Structured Text is what happens when Pascal and a PLC have a child who grew up near a nuclear plant and developed a healthy fear of implicit behavior.", author: "IEC TC65 committee, unofficially" },
  ld: { text: "Ladder Diagram was designed so electricians could read PLC code without training. In 2026, it works so well that software engineers are the only ones confused by it.", author: "Relay logic diaspora" },
  fbd: { text: "Function Block Diagram is basically a flowchart that went to engineering school. If you can draw it on a whiteboard with boxes and arrows, you can implement it in FBD.", author: "Visual programming for adults" },
  sfc: { text: "SFC is the only IEC 61131-3 language that looks like it was designed by someone who actually understood process control. It was. The other four were designed by committee.", author: "Sequential control done right" },
  pou: { text: "A Function Block is like a class. A Function is like a pure function. A Program is like main(). You now understand 80% of IEC 61131-3. The other 20% is vendor extensions that break portability.", author: "OOP for ladder logic people" },
  rtac: { text: "The RTAC treats your IEC 61131-3 code the same way power systems treat ambiguity: with complete indifference. It either executes at 1ms scan or it doesn't.", author: "SEL field experience" },
  troubleshoot: { text: "Debugging a PLC program is like performing surgery on a patient who is still running the Boston Marathon. The system doesn't stop for you to look at it.", author: "Online monitoring, every time" },
  lab: { text: "CODESYS is free. There is no excuse to have never run a single line of Structured Text before touching a real RTAC. None.", author: "Pre-commissioning checklist, item 1" },
}

export const FUN_FACTS = [
  { text: "IEC 61131-3 was first published in 1993. It standardized five programming languages for PLCs. Thirty-three years later, the 'standard' is interpreted differently by every vendor. The spirit of standards compliance lives on.", icon: "Archive" },
  { text: "Instruction List (IL) was deprecated in the 3rd edition of IEC 61131-3 (2013). It was essentially assembly language for PLCs. Its removal was mourned by nobody under age 50.", icon: "AlertOctagon" },
  { text: "CODESYS, one of the most widely used IEC 61131-3 IDEs, is free. The runtime license costs money, but the development environment is free. There is literally no excuse to not practice.", icon: "DollarSign" },
  { text: "The SEL RTAC scans IEC 61131-3 tasks as fast as 1ms. At 1ms scan rate, your code executes 1,000 times per second, 60,000 times per minute, 86,400,000 times per day. Make sure that WHILE loop terminates.", icon: "Clock" },
  { text: "IEC 61131-3 forbids recursion. A function cannot call itself, directly or indirectly. This is because PLCs need deterministic stack memory usage. The committee decided infinite recursion was unacceptable in a 500kV substation.", icon: "RefreshCw" },
  { text: "A RETAIN variable in IEC 61131-3 survives a power cycle. The PLC stores it in non-volatile memory. Forgetting to mark a setpoint as RETAIN is how you wake up at 2am to a process running at wrong setpoints after a power blip.", icon: "HardDrive" },
  { text: "The := assignment operator in Structured Text is NOT the same as =. Using = when you mean := is a compile error. Using = for comparison when you mean := is... also a compile error. The standard was thorough about this one.", icon: "Hash" },
  { text: "SFC (Sequential Function Chart) is the one IEC 61131-3 language directly derived from Petri nets. IEC TC65 borrowed it from GRAFCET, a French standard. The French contribution to PLC programming is both elegant and underappreciated.", icon: "Globe" },
  { text: "IEC 61131-3 STRING types are fixed-length. STRING[20] holds 20 characters. Attempting to assign a 25-character string to a STRING[20] variable truncates silently on most platforms. There is no overflow exception. The extra characters just vanish.", icon: "Scissors" },
  { text: "A Function Block in IEC 61131-3 has internal state. The same FB type can be instantiated many times, and each instance maintains its own state. It is literally object-oriented programming — just with ladder rungs instead of inheritance hierarchies.", icon: "Package" },
]

export const FIELD_STORIES = [
  {
    title: "The TON Timer That Reset Itself",
    icon: "AlertTriangle",
    story: "A water pump sequencing program used a TON timer to delay the next pump start by 30 seconds. During commissioning, the scan cycle took slightly longer than expected due to heavy HMI polling. The timer's IN input was cycling TRUE/FALSE on every scan because the enabling condition depended on a mid-scan tag update. The timer never reached 30 seconds — it reset on every other scan. The pump sequencer appeared to work in testing (lighter load) but failed in production. The fix: latch the enabling condition into a separate BOOL before evaluating the timer. One extra line of Structured Text. Two days of debugging."
  },
  {
    title: "The RETAIN Variable That Survived",
    icon: "Ghost",
    story: "A packaging machine PLC used RETAIN variables to persist batch counts across power cycles. During a firmware upgrade, the RETAIN memory map changed — the old retained values were still present but now mapped to different variables. After the upgrade, the batch counter started at 47,239 instead of zero. The machine ran 47,239 batches worth of labels before anyone noticed the counter was wrong. The vendor's migration guide mentioned clearing RETAIN memory before firmware updates. Nobody read it. The lesson: RETAIN variables are not free — they survive reboots, firmware upgrades, and your assumptions."
  },
  {
    title: "The Codesys Global Variable That Everyone Wrote To",
    icon: "AlertOctagon",
    story: "A large CODESYS project had a global variable called 'g_EmergencyStop' used by 14 different function blocks. One FB set it TRUE under a specific fault condition. Another FB set it FALSE during its normal operation — overwriting the emergency stop request. The race depended on program organization order. In testing, program order was different from production. The emergency stop appeared to work in test. In production, it was silently cleared 40ms after being set. The fix: make emergency stop RETAIN and only allow it to be cleared by a dedicated reset routine. Never let multiple FBs own the same global write."
  },
  {
    title: "The Integer Division That Lost the Decimal",
    icon: "Binary",
    story: "A flow calculation in Structured Text divided two INT variables: flow_rate := total_volume / elapsed_time. In IEC 61131-3, INT / INT returns INT — the decimal is truncated, not rounded. At low flow rates (e.g., 3 liters over 4 seconds), the result was 0. The flow totalizer showed zero for 20% of readings. The process engineer thought the sensor was intermittent. The actual fix: cast to REAL before dividing. One REAL() function call. The sensor was fine. The code was wrong. Three weeks of sensor replacement work was wasted."
  },
  {
    title: "The SFC Step That Never Advanced",
    icon: "Archive",
    story: "A Sequential Function Chart controlled a chemical dosing sequence. Step 4 waited for a confirmation signal before advancing. During a sensor calibration, the confirmation sensor was temporarily bypassed. The bypass was removed but the bypassed state was written to a RETAIN variable that persisted through the PLC power cycle. The SFC waited forever at Step 4 in every subsequent run. The machine appeared to start normally, then hang silently. Operators cycled power repeatedly. Each power cycle restored the retained bypass state. The issue was found two days later when someone read the RETAIN variable list in the PLC monitor."
  },
]

export const CHAPTER_HOOKS = {
  intro:       "You need to write a control program that runs identically on a Siemens S7, a Beckhoff CX, and a SEL RTAC. IEC 61131-3 is supposed to make that possible. In practice, what are the three things that will definitely break between platforms?",
  datatypes:   "You assign a REAL value of 3.14159 to an INT variable in Structured Text. What actually gets stored — and what happens to the decimal part? Does the compiler warn you?",
  st:          "Structured Text looks like Pascal. It runs on PLCs. What does that mean for how you think about memory, scan cycles, and side effects — things you'd never worry about in Python?",
  ld:          "Ladder Diagram was designed so electricians could read PLC code without learning programming. In 2026, is that still a valid design goal — or has it become a liability?",
  fbd:         "A Function Block Diagram looks cleaner than Structured Text for a PID loop. What does it cost you in debuggability and version control?",
  sfc:         "A Sequential Function Chart hangs at Step 3 in production. The transition condition is TRUE. The step has been active for 6 hours. What's the first thing you check?",
  pou:         "What's the difference between a Function and a Function Block in IEC 61131-3 — and why does that difference matter when you need to control a pump that has state?",
  rtac:        "The SEL RTAC uses IEC 61131-3 with a 1ms scan cycle. You write a loop that iterates 1,000 times. What happens to the scan cycle — and what does the RTAC do about it?",
  troubleshoot:"A PLC program that worked fine in the CODESYS simulator fails on the real hardware. The logic is identical. What are the three most likely causes of the divergence?",
  lab:         "Before you write a single line of IEC 61131-3 code for a real PLC: what three things must you know about the target hardware that the simulator doesn't care about?",
}

export const CHAPTER_RETRIEVAL = {
  intro:       { q: "What are the five programming languages defined by IEC 61131-3?", a: "Ladder Diagram (LD), Function Block Diagram (FBD), Structured Text (ST), Instruction List (IL), Sequential Function Chart (SFC)" },
  datatypes:   { q: "In IEC 61131-3, what is the result of INT divided by INT when the result is not a whole number?", a: "The decimal is truncated — no rounding, no warning. Cast to REAL before dividing to preserve precision." },
  st:          { q: "What does the IEC 61131-3 RETAIN qualifier do to a variable?", a: "Preserves its value across a power cycle — stored in non-volatile memory" },
  ld:          { q: "What does a normally-closed contact do in Ladder Diagram when the coil it references is FALSE?", a: "It passes power (conducts) — it passes when the referenced bit is 0, blocks when the bit is 1" },
  fbd:         { q: "In IEC 61131-3, what is the difference between a Function and a Function Block?", a: "A Function has no internal state; same inputs always produce same outputs. A Function Block has persistent internal state between calls." },
  sfc:         { q: "In a Sequential Function Chart, what conditions must be true for a transition to fire?", a: "The preceding step must be active AND the transition condition must evaluate to TRUE" },
  pou:         { q: "What does POU stand for in IEC 61131-3?", a: "Program Organization Unit — the three types are Program, Function, and Function Block" },
  rtac:        { q: "What IEC 61131-3 timer type delays a rising edge — and what happens if the IN signal goes FALSE before PT elapses?", a: "TON (Timer On-Delay) — if IN goes FALSE before PT, the timer resets to zero and Q stays FALSE" },
  troubleshoot:{ q: "What is a 'scan cycle' in a PLC — and what happens if your code takes longer than one scan cycle?", a: "One pass through all program logic. If it overruns, the watchdog timer triggers a PLC fault/stop on most platforms." },
  lab:         { q: "Name a free IEC 61131-3 development environment used for practice and learning.", a: "CODESYS — available free for development; runtime licenses required for production deployment" },
}
