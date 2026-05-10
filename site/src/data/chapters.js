export const CHAPTERS = [
  { id: 'intro', label: 'Ch 1: IEC 61131-3 Overview',        title: 'IEC 61131-3 Overview',              emoji: '📋', path: '/',            next: 'datatypes' },
  { id: 'datatypes', label: 'Ch 2: Data Types & Variables',    title: 'Data Types & Variables',            emoji: '🔢', path: '/datatypes',   prev: 'intro',      next: 'st' },
  { id: 'st', label: 'Ch 3: Structured Text',           title: 'Structured Text (ST)',               emoji: '💻', path: '/st',          prev: 'datatypes',  next: 'ld' },
  { id: 'ld', label: 'Ch 4: Ladder Diagram',           title: 'Ladder Diagram (LD)',                emoji: '🪜', path: '/ld',          prev: 'st',         next: 'fbd' },
  { id: 'fbd', label: 'Ch 5: Function Block Diagram',          title: 'Function Block Diagram (FBD)',       emoji: '🔲', path: '/fbd',         prev: 'ld',         next: 'sfc' },
  { id: 'sfc', label: 'Ch 6: Sequential Function Chart',          title: 'Sequential Function Chart (SFC)',    emoji: '🔀', path: '/sfc',         prev: 'fbd',        next: 'pou' },
  { id: 'pou', label: 'Ch 7: POUs',          title: 'POUs — Program, Function, FB',      emoji: '🧩', path: '/pou',         prev: 'sfc',        next: 'rtac' },
  { id: 'rtac', label: 'Ch 8: IEC 61131-3 on RTAC',         title: 'IEC 61131-3 on the SEL RTAC',       emoji: '⚡', path: '/rtac',        prev: 'pou',        next: 'troubleshoot' },
  { id: 'troubleshoot', label: 'Ch 9: Debugging & Troubleshooting', title: 'Debugging & Troubleshooting',        emoji: '🔍', path: '/troubleshoot',prev: 'rtac',       next: 'lab' },
  { id: 'lab', label: 'Ch 10: Lab & Practice',          title: 'Lab & Practice',                    emoji: '🧪', path: '/lab',         prev: 'troubleshoot' },
  { id: 'flashcards', label: 'Flashcards', emoji: '🃏', path: '/flashcards' },
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
  { text: "IEC 61131-3 was first published in 1993. It standardized five programming languages for PLCs. Thirty-three years later, the 'standard' is interpreted differently by every vendor. The spirit of standards compliance lives on.", emoji: "📜" },
  { text: "Instruction List (IL) was deprecated in the 3rd edition of IEC 61131-3 (2013). It was essentially assembly language for PLCs. Its removal was mourned by nobody under age 50.", emoji: "⚰️" },
  { text: "CODESYS, one of the most widely used IEC 61131-3 IDEs, is free. The runtime license costs money, but the development environment is free. There is literally no excuse to not practice.", emoji: "💸" },
  { text: "The SEL RTAC scans IEC 61131-3 tasks as fast as 1ms. At 1ms scan rate, your code executes 1,000 times per second, 60,000 times per minute, 86,400,000 times per day. Make sure that WHILE loop terminates.", emoji: "⏱️" },
  { text: "IEC 61131-3 forbids recursion. A function cannot call itself, directly or indirectly. This is because PLCs need deterministic stack memory usage. The committee decided infinite recursion was unacceptable in a 500kV substation.", emoji: "🔄" },
  { text: "A RETAIN variable in IEC 61131-3 survives a power cycle. The PLC stores it in non-volatile memory. Forgetting to mark a setpoint as RETAIN is how you wake up at 2am to a process running at wrong setpoints after a power blip.", emoji: "💾" },
  { text: "The := assignment operator in Structured Text is NOT the same as =. Using = when you mean := is a compile error. Using = for comparison when you mean := is... also a compile error. The standard was thorough about this one.", emoji: "🟰" },
  { text: "SFC (Sequential Function Chart) is the one IEC 61131-3 language directly derived from Petri nets. IEC TC65 borrowed it from GRAFCET, a French standard. The French contribution to PLC programming is both elegant and underappreciated.", emoji: "🇫🇷" },
  { text: "IEC 61131-3 STRING types are fixed-length. STRING[20] holds 20 characters. Attempting to assign a 25-character string to a STRING[20] variable truncates silently on most platforms. There is no overflow exception. The extra characters just vanish.", emoji: "✂️" },
  { text: "A Function Block in IEC 61131-3 has internal state. The same FB type can be instantiated many times, and each instance maintains its own state. It is literally object-oriented programming — just with ladder rungs instead of inheritance hierarchies.", emoji: "🧩" },
]
