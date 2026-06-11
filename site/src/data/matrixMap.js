// Maps chapters to the company skills-matrix (survey) competencies they cover.
// Source: RTAC Automation matrix (wk 1 variables + wk 4 programming).
// A chapter listed here is "on the survey" — the material C-suite expects taught.

export const TRACKS = {
  scada: { label: 'SCADA OPS', color: '#fb923c' },
  rtac: { label: 'RTAC AUTO', color: '#818cf8' },
}

export const MATRIX_MAP = {
  intro: [
    { track: 'rtac', week: 4, category: 'Program Creation from Scratch',
      skills: ['Understand ST, LD, and CFC languages (foundation)'] },
  ],
  datatypes: [
    { track: 'rtac', week: 1, category: 'Tags & Data Mapping',
      skills: ['Understand global vs. local variable declarations',
               'Understand variable declaration types — IN/OUT/RETAIN etc.',
               'Assign variables using different list types in projects'] },
  ],
  st: [
    { track: 'rtac', week: 4, category: 'Program Creation from Scratch',
      skills: ['Understand ST, LD, and CFC languages',
               'Call function blocks, functions & variables to write programs'] },
  ],
  ld: [
    { track: 'rtac', week: 4, category: 'Program Creation from Scratch',
      skills: ['Understand ST, LD, and CFC languages'] },
  ],
  fbd: [
    { track: 'rtac', week: 4, category: 'Program Creation from Scratch',
      skills: ['Understand ST, LD, and CFC languages (CFC is the free-form sibling of FBD)'] },
  ],
  sfc: [
    { track: 'rtac', week: 4, category: 'Program Creation from Scratch',
      skills: ['Test programs for desired functionality (sequential logic)'] },
  ],
  pou: [
    { track: 'rtac', week: 4, category: 'FB & FN Development from Scratch',
      skills: ['Determine when to write a Function Block',
               'Script FBs and call them in programs',
               'Determine when to write a Function',
               'Script FNs and call them in programs; test FN functionality'] },
  ],
  rtac: [
    { track: 'rtac', week: 4, category: 'FB/PRG Import/Export Integration',
      skills: ['Determine when to import/export settings in XML format',
               'Import/export settings and modify for project-specific needs'] },
    { track: 'rtac', week: 1, category: 'SEL Tag Data Types',
      skills: ['Use timers, counters, data quality & timestamps in RTACs'] },
  ],
  troubleshoot: [
    { track: 'rtac', week: 4, category: 'Program Creation from Scratch',
      skills: ['Test programs for desired functionality'] },
    { track: 'rtac', week: 4, category: 'FB & FN Development from Scratch',
      skills: ['Test FBs for desired functionality'] },
  ],
  lab: [
    { track: 'rtac', week: 4, category: 'Program Creation from Scratch',
      skills: ['Call function blocks, functions & variables to write programs (hands-on)'] },
    { track: 'rtac', week: 4, category: 'FB/PRG Import/Export Integration',
      skills: ['Test the success of import/export tasks (hands-on)'] },
  ],
}

export const isOnMatrix = (chapterId) => Boolean(MATRIX_MAP[chapterId]?.length)
