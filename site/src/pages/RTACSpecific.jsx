import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import Quiz from '../components/Quiz'
import { ANALOGIES } from '../data/chapters'
import { QUIZZES } from '../data/quizzes'

export default function RTACSpecific() {
  return (
    <ChapterLayout
      chapterId="rtac"
      title="IEC 61131-3 on the SEL RTAC"
      emoji="⚡"
      prev="pou"
      next="troubleshoot"
    >
      <p>
        The SEL RTAC (Real-Time Automation Controller) is a substation automation device that runs IEC 61131-3 programs alongside protocol stacks (DNP3, IEC 61850, Modbus, SEL protocols). You program it using ACSELERATOR RTAC, SEL's proprietary IDE. The IEC 61131-3 runtime executes as one or more cyclic tasks on a deterministic real-time kernel.
      </p>
      <p>
        Understanding how IEC 61131-3 integrates with the RTAC's data model — how relay inputs become ST variables, how ST variables become DNP3 points — is the practical core of RTAC programming.
      </p>

      <Callout type="key" title="ACSELERATOR RTAC Is the IDE">
        ACSELERATOR RTAC (formerly AcSELerator RTAC) is SEL's configuration and programming software for the SEL-3505, SEL-3530, SEL-3555, and related RTACs. It handles both the IEC 61131-3 programming environment and the protocol configuration. Your ST code and your DNP3 mapping live in the same project file.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Task Configuration</h2>
      <p>
        An RTAC IEC 61131-3 project contains one or more tasks. Each task has a configurable scan period and priority. Tasks execute their assigned PROGRAMs cyclically.
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-700 text-white">
              <th className="px-4 py-3 text-left font-semibold">Scan Period</th>
              <th className="px-4 py-3 text-left font-semibold">Typical Use</th>
              <th className="px-4 py-3 text-left font-semibold">Caution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ['1 ms', 'Fast protection logic, time-critical interlocks', 'Very tight budget — even small inefficiencies cause overrun'],
              ['10 ms', 'Control logic, analog processing, state machines', 'Common for most RTAC IEC 61131-3 programs'],
              ['100 ms', 'Status update logic, protocol data refresh', 'Comfortable budget, not suitable for fast control'],
              ['1 s', 'Logging, diagnostic updates, non-critical housekeeping', 'No time pressure at all — ideal for complex setup logic'],
              ['Free-running', 'Runs as fast as possible, no period guarantee', 'Avoid in production — unpredictable timing'],
            ].map(([period, use, caution], i) => (
              <tr key={period} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-2.5 font-mono font-bold text-mcyan-500 whitespace-nowrap">{period}</td>
                <td className="px-4 py-2.5 text-slate-700">{use}</td>
                <td className="px-4 py-2.5 text-slate-500 text-xs">{caution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="Scan Time Budget Is Real">
        If your IEC 61131-3 program takes longer to execute than its configured scan period, the RTAC generates a scan overrun event. Repeated overruns trigger a watchdog trip, restarting the IEC 61131-3 runtime. At 1ms scan rate, you have approximately 1ms of CPU time. That sounds obvious until you accidentally add a 500-iteration FOR loop.
      </Callout>

      <FunFact index={3} />

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">Data Mapping: From Protocol to ST Variables</h2>
      <p>
        The RTAC bridges protocol data and IEC 61131-3 variables through a data model. Protocol clients (DNP3 master, IEC 61850 client, Modbus master) bring data into the RTAC data model. IEC 61131-3 programs access this data through mapped global variables.
      </p>

      <pre>{`(* Data flow in a typical RTAC project:

1. External device (relay, meter) sends DNP3 analog input
2. RTAC DNP3 slave receives and stores in data model
3. ACSELERATOR mapping connects data model point to GVL variable
4. IEC 61131-3 program reads gBus1_Voltage each scan
5. ST logic processes it, writes gTrip_Command if needed
6. ACSELERATOR maps gTrip_Command to a DNP3 binary output
7. RTAC DNP3 master sends CROB (control relay output block)
8. Remote device receives trip command

The IEC 61131-3 code never touches the wire protocol directly.
The RTAC data model is the interface layer. *)

(* In your ST code you just use the variables: *)
IF gBus1_Voltage < 10.0 THEN
    gUnderVoltage_Trip := TRUE;
END_IF;`}</pre>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">SEL-Specific Function Blocks</h2>
      <p>
        ACSELERATOR RTAC provides a library of SEL-specific Function Blocks beyond the IEC 61131-3 standard. These FBs interface with the RTAC hardware and protocol stack.
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-4 py-3 text-left font-semibold">FB Category</th>
              <th className="px-4 py-3 text-left font-semibold">Examples</th>
              <th className="px-4 py-3 text-left font-semibold">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ['Communication', 'DNP3_SendCROB, IEC61850_SendCmd', 'Issue commands to remote devices'],
              ['Data Quality', 'CheckQuality, SetQuality', 'Read/set DNP3 or IEC 61850 data quality flags'],
              ['Time', 'GetSystemTime, SyncTime', 'Read RTAC clock (IRIG-B or GPS synced)'],
              ['Event Logging', 'LogEvent, CreateSOE', 'Write to RTAC event log and SOE records'],
              ['I/O', 'ReadAnalogInput, WriteDigitalOut', 'Direct hardware I/O on RTAC I/O cards'],
              ['Diagnostics', 'GetScanTime, GetTaskLoad', 'Monitor task execution performance'],
            ].map(([cat, ex, purpose], i) => (
              <tr key={cat} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-2.5 font-medium text-navy-700">{cat}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-morange-500">{ex}</td>
                <td className="px-4 py-2.5 text-slate-600">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="field" title="SEL FB Names and Signatures Change Between Firmware Versions">
        SEL updates ACSELERATOR RTAC regularly. Function Block names, input/output signatures, and available features change between firmware versions. A project configured for firmware 2.x may not compile cleanly on firmware 3.x. Always check the firmware release notes and the ACSELERATOR RTAC Instruction Manual for your specific firmware version before building production projects.
      </Callout>

      <h2 className="text-xl font-bold text-navy-700 mt-8 mb-3">IEC 61850 Integration</h2>
      <p>
        When your RTAC serves as an IEC 61850 server, your ST variables can be mapped to IEC 61850 data objects (DO). The ACSELERATOR configuration screen handles the binding between your ST BOOL or REAL variables and the corresponding IEC 61850 Logical Node attributes (e.g., XCBR1.Pos.stVal for breaker position).
      </p>

      <pre>{`(* IEC 61850 GOOSE publishing — concept *)
(* In ACSELERATOR: map gBreaker_Trip to PTRC1.Tr.general *)
(* Then in IEC 61131-3: *)

IF rCurrentMagnitude > rPickupThreshold THEN
    gBreaker_Trip := TRUE;   (* This maps to GOOSE publisher *)
END_IF;

(* The RTAC GOOSE stack publishes the change automatically
   when gBreaker_Trip transitions — no additional ST code needed.
   The mapping handles the protocol side. *)`}</pre>

      <GifCard gifKey="robot" caption="RTAC executing IEC 61131-3 at 1ms scan rate" side="right" />

      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 my-6">
        <p className="text-sm italic text-purple-800">"{ANALOGIES.rtac.text}"</p>
        <p className="text-xs text-purple-500 mt-2">— {ANALOGIES.rtac.author}</p>
      </div>

      <Callout type="pro" title="Build on a Supported RTAC Firmware Version">
        Pick one firmware version for a project and do not change it during development. Upgrading firmware mid-project can change FB signatures, data model behavior, and compilation settings. Test firmware upgrades in a lab environment against your full project before applying to a production device. This is not optional advice.
      </Callout>

      {QUIZZES.rtac && QUIZZES.rtac.length > 0 && (
        <Quiz chapterId="rtac" questions={QUIZZES.rtac} level={1} />
      )}
    </ChapterLayout>
  )
}
