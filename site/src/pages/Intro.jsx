import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import { ANALOGIES } from '../data/chapters'
import { QUIZZES } from '../data/quizzes'

export default function Intro() {
  return (
    <ChapterLayout
      chapterId="intro"
      title="IEC 61131-3 Overview"
      emoji="📋"
      next="datatypes"
    >
      <p>
        In 1993, the International Electrotechnical Commission published IEC 61131-3 — the first serious attempt to standardize how humans program industrial controllers. Before this, every PLC vendor had their own language, their own IDE, their own notation. Migrating a Siemens plant to Allen-Bradley was effectively a complete rewrite. The committee decided this was unacceptable.
      </p>
      <p>
        They standardized five programming languages. Thirty-three years later, every major vendor claims full compliance. Porting code between them still requires significant effort. Progress.
      </p>

      <Callout type="key" title="The Five Languages">
        IEC 61131-3 defines five POU (Program Organization Unit) languages:
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li><strong>Structured Text (ST)</strong> — Pascal-like text language. Most powerful.</li>
          <li><strong>Ladder Diagram (LD)</strong> — Graphical relay logic. Most familiar to electricians.</li>
          <li><strong>Function Block Diagram (FBD)</strong> — Graphical data flow. Signals flow left to right.</li>
          <li><strong>Sequential Function Chart (SFC)</strong> — State machine / flow chart. Best for sequences.</li>
          <li><strong>Instruction List (IL)</strong> — Assembly-like. Deprecated in 3rd edition (2013). Do not use.</li>
        </ul>
      </Callout>

      <GifCard gifKey="welcome" caption="First time opening ACSELERATOR RTAC" side="right" />

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Why It Matters for RTAC Work</h2>
      <p>
        The SEL RTAC (Real-Time Automation Controller) runs IEC 61131-3 natively. When you open ACSELERATOR RTAC, you are writing Structured Text and building Function Block programs that execute on a deterministic real-time kernel. This is not a simulation. Your code controls breakers, reads relay inputs, and communicates over DNP3 and IEC 61850.
      </p>
      <p>
        A scan time overrun at 1ms doesn't produce a warning dialog. It produces a watchdog trip. Understanding the standard — not just the ACSELERATOR UI — is what separates engineers who commission cleanly from engineers who spend commissioning day chasing mysterious resets.
      </p>

      <Callout type="warning" title="Platform Fragmentation Is Real">
        IEC 61131-3 compliance is not binary. Every vendor implements vendor-specific extensions — SEL has its own FB libraries for relay I/O, DNP3 mapping, and IEC 61850. Code written for CODESYS will not compile on ACSELERATOR RTAC without modification. The standard gives you transferable knowledge, not transferable binaries.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Structure of This Guide</h2>
      <p>
        This guide covers IEC 61131-3 from first principles through practical RTAC application. You will learn data types and variable declaration, all four active languages in detail, the POU system (Program, Function, Function Block), and then RTAC-specific implementation. Debugging and a hands-on lab chapter close it out.
      </p>
      <p>
        Each chapter has quiz stubs that will be populated with questions. For now, focus on reading and understanding the concepts before you touch hardware.
      </p>

      <FunFact index={0} />

      <Callout type="pro" title="Use CODESYS First">
        CODESYS is a free IEC 61131-3 IDE with a built-in soft PLC simulator. Download it, write a motor interlock in ST, simulate it, then translate it to LD, then FBD. Do this before touching ACSELERATOR RTAC. The concepts transfer directly. The muscle memory transfers too.
      </Callout>

      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 my-6">
        <p className="text-sm italic text-purple-800">"{ANALOGIES.intro.text}"</p>
        <p className="text-xs text-purple-500 mt-2">— {ANALOGIES.intro.author}</p>
      </div>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Historical Context</h2>
      <p>
        Before IEC 61131-3, ladder diagram was dominant — inherited directly from relay logic panels. Electricians who understood hard-wired relay circuits could read PLC ladder programs without additional training. This was intentional design. The same design rationale explains why LD is still the default language in most entry-level PLC training.
      </p>
      <p>
        Structured Text emerged from PASCAL, giving software engineers a familiar syntax for complex algorithms. Function Block Diagram was influenced by signal flow diagrams used in process control. SFC came from GRAFCET, a French standard for sequential process control developed at AFCET in the 1970s.
      </p>
      <p>
        Instruction List was included for compatibility with low-level PLC programming that existed before the standard. It was deprecated in the third edition (2013) when the committee acknowledged what everyone already knew: nobody should write new IL code.
      </p>

      <Callout type="field" title="The RTAC Reality Check">
        The SEL RTAC supports Structured Text as its primary IEC 61131-3 language. LD and FBD are available for some use cases. SFC integration depends on firmware version. IL is not supported and never will be. Focus your study time on ST and FBD — these are what you will write in the field.
      </Callout>
    </ChapterLayout>
  )
}
