const yt = (q, title) => ({ type: 'youtube', title, searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}` })
const doc = (title, url) => ({ type: 'doc', title, url })
const book = (title, author, chapter, page) => ({ type: 'book', title, author, chapter, page })
const tanenbaum = (ch, pg) => book('Modern Operating Systems', 'Tanenbaum, 4th ed.', ch, pg)
const stevens = (ch, pg) => book('Advanced Programming in the UNIX Environment', 'Stevens & Rago, 3rd ed.', ch, pg)
const dowd = (ch, pg) => book('The Art of Software Security Assessment', 'Dowd, McDonald & Schuh', ch, pg)

export const DEEP_DIVE = {
  intro: {
    level1: [
      yt('IEC 61131-3 overview five programming languages explained', 'IEC 61131-3 — Five Languages Explained'),
      yt('PLC programming languages comparison ST LD FBD SFC', 'PLC Programming Languages: Which One Should You Use?'),
      doc('CODESYS — Free IEC 61131-3 IDE', 'https://www.codesys.com'),
    ],
    level2: [
      yt('IEC 61131-3 third edition changes IL deprecated', 'IEC 61131-3 3rd Edition — What Changed?'),
      tanenbaum('Chapter 1: Introduction to Operating Systems', '1'),
    ],
  },
  datatypes: {
    level1: [
      yt('IEC 61131-3 data types BOOL INT REAL TIME STRING tutorial', 'IEC 61131-3 Data Types — Complete Tutorial'),
      yt('PLC variable declaration VAR VAR_INPUT VAR_OUTPUT explained', 'IEC 61131-3 Variable Sections Explained'),
    ],
    level2: [
      yt('IEC 61131-3 retain variables non-volatile memory PLC', 'RETAIN Variables — Non-Volatile Memory in PLCs'),
      tanenbaum('Chapter 10: File Systems — Data Types and Storage', '702'),
    ],
  },
  st: {
    level1: [
      yt('IEC 61131-3 structured text tutorial beginner complete', 'Structured Text Tutorial — Complete Beginner Guide'),
      yt('structured text IF CASE FOR WHILE examples PLC', 'Structured Text Control Structures — IF, CASE, FOR, WHILE'),
      doc('CODESYS ST Reference', 'https://help.codesys.com/api-content/2/codesys/3.5.12.0/en/_cds_operator_st/'),
    ],
    level2: [
      yt('structured text RTAC SEL ACSELERATOR programming', 'Structured Text on SEL RTAC — ACSELERATOR Basics'),
      stevens('Chapter 8: Process Control', '243'),
    ],
  },
  ld: {
    level1: [
      yt('IEC 61131-3 ladder diagram tutorial PLC beginner', 'Ladder Diagram Tutorial — From Relay Logic to PLC'),
      yt('ladder logic contacts coils timer counter PLC tutorial', 'Ladder Logic: Contacts, Coils, Timers, Counters'),
      doc('OpenPLC — Open Source Ladder Runtime', 'https://openplcproject.com'),
    ],
    level2: [
      yt('ladder diagram TON TOF TP timer function block IEC', 'IEC 61131-3 Timer Function Blocks in Ladder'),
      tanenbaum('Chapter 2: Processes and Threads', '85'),
    ],
  },
  fbd: {
    level1: [
      yt('IEC 61131-3 function block diagram tutorial FBD PLC', 'Function Block Diagram Tutorial — Data Flow Programming'),
      yt('FBD AND OR NOT function blocks PLC signal flow', 'FBD Logic Blocks — AND, OR, NOT, XOR'),
    ],
    level2: [
      yt('FBD PID control block CTRL_PID function block diagram', 'PID Control in FBD — CTRL_PID Block'),
      tanenbaum('Chapter 2: Interprocess Communication', '115'),
    ],
  },
  sfc: {
    level1: [
      yt('IEC 61131-3 sequential function chart SFC tutorial steps transitions', 'SFC Tutorial — Steps, Transitions, and Actions'),
      yt('SFC parallel branches batch process PLC sequence', 'SFC Parallel Sequences and Batch Control'),
    ],
    level2: [
      yt('SFC startup shutdown sequence motor control PLC', 'SFC Motor Startup/Shutdown Sequence'),
      tanenbaum('Chapter 6: Deadlocks — Sequential State Machines', '420'),
    ],
  },
  pou: {
    level1: [
      yt('IEC 61131-3 POU program function function block explained', 'POUs Explained — Program, Function, Function Block'),
      yt('IEC 61131-3 function block instance call method', 'Function Block Instances — Declaration and Calling'),
    ],
    level2: [
      yt('IEC 61131-3 methods properties OOP PLC CODESYS', 'OOP Extensions in IEC 61131-3 — Methods and Properties'),
      tanenbaum('Chapter 2: Threads vs Processes — State and Statefulness', '95'),
    ],
  },
  rtac: {
    level1: [
      yt('SEL RTAC ACSELERATOR programming IEC 61131-3 tutorial', 'SEL RTAC Programming with ACSELERATOR RTAC'),
      yt('SEL RTAC task configuration cyclic scan period', 'RTAC Task Configuration — Scan Rates and Priorities'),
      doc('SEL RTAC Product Page', 'https://selinc.com/products/3530/'),
    ],
    level2: [
      yt('SEL RTAC DNP3 data mapping IEC 61131-3 variables', 'RTAC DNP3 Data Mapping to IEC 61131-3 Variables'),
      tanenbaum('Chapter 2: Real-Time Systems', '130'),
    ],
  },
  troubleshoot: {
    level1: [
      yt('PLC online monitoring debugging watch variables CODESYS', 'PLC Online Monitoring — Watch Variables and Debugging'),
      yt('IEC 61131-3 scan time overrun watchdog PLC task', 'Scan Time Overruns and Watchdog Trips in PLCs'),
    ],
    level2: [
      yt('CODESYS online change PLC debugging live modification', 'CODESYS Online Change — Modify Code While Running'),
      dowd('Chapter 2: Vulnerability Assessment Methodology', '45'),
    ],
  },
  lab: {
    level1: [
      yt('CODESYS tutorial install simulate IEC 61131-3 first program', 'CODESYS Tutorial — Install, Simulate, First Program'),
      yt('OpenPLC Raspberry Pi IEC 61131-3 free simulator', 'OpenPLC on Raspberry Pi — Free PLC Simulator'),
      doc('CODESYS Store — Free IDE Download', 'https://store.codesys.com/en/codesys.html'),
    ],
    level2: [
      yt('BEREMIZ open source IEC 61131-3 Python PLC IDE', 'BEREMIZ — Open Source IEC 61131-3 IDE'),
      doc('OpenPLC Project', 'https://openplcproject.com'),
    ],
  },
}
