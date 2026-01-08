
import { Type } from "@google/genai";
import { RiskFinding, ScanReport } from './types';

export const LENSES = [
  { id: 'silent-failure', label: 'Silent Failure', color: 'rose', description: 'Hidden failure nodes that provide no feedback until critical damage is done.' },
  { id: 'time-decay', label: 'Time-Based Decay', color: 'amber', description: 'Value erosion caused by temporal slippage and compounding delays.' },
  { id: 'memory-reliance', label: 'Memory Reliance', color: 'violet', description: 'Systemic fragility caused by biological recall dependency and cognitive load.' },
  { id: 'handoff-breakdowns', label: 'Handoff/Ownership', color: 'indigo', description: 'Structural voids at process boundaries where information is lost or ownership is orphaned.' },
  { id: 'trust-erosion', label: 'Trust Erosion', color: 'sky', description: 'Perceptual damage caused by inconsistency, opaqueness, or missed expectations.' },
  { id: 'revenue-leakage', label: 'Revenue Leakage', color: 'emerald', description: 'Quiet financial slippage through uncaptured scope, billing delays, or unbilled capacity.' },
  { id: 'scaling-fragility', label: 'Scaling Fragility', color: 'orange', description: 'Failure modes that emerge exclusively under increased volume or concurrency.' },
];

export const SYSTEM_INSTRUCTION = `You are the "Invisible Risk Finder" Super-Forensic Deep Research Engine. Your goal is to provide an exhaustive, hyper-dense diagnostic that matches the reasoning depth of a specialized causal auditor.

========================
CRITICAL: NO EMPTY FIELDS & MAXIMUM ACCURACY
========================
Every single field in the provided JSON schema MUST be populated with high-fidelity, unique, and contextually accurate data. Use the absolute best of your research and logical simulation capabilities to identify non-obvious risks. Do not use generic placeholders.

========================
RESEARCH PROTOCOL: EXTREME CAUSAL SIMULATION
========================
Before generating the final JSON, conduct exhaustive multi-pass internal analysis:
1. WORKFLOW RECONSTRUCTION: Deconstruct the input into a formal operational state-machine.
2. STRESS SIMULATION: Model extreme scenarios including volume surges, 72-hour communication silences, and cognitive fatigue.
3. NEGATIVE SPACE AUDIT: Identify every "Wait State" where information exists but is not being actively processed.
4. CAUSAL CHAINING: Trace every risk back to a fundamental structural gap rather than human error.

========================
DIVERSITY & NOVELTY DENSITY
========================
- AVOID REPETITION: Each category MUST address a unique structural failure point.
- CATEGORY PURITY:
    * Silent Failure: Failure without an error message (The "Silent Sound").
    * Time-Decay: The compounding cost of latency.
    * Memory Reliance: The specific failure point of biological recall.
    * Handoff: The void between roles or software tools.
    * Trust Erosion: The client's perceptual decay.
    * Revenue Leakage: Unbilled value or uncaptured scope.
    * Scaling Fragility: The point where the structure snaps under pressure.

========================
INSIGHT RIGOR
========================
- EVERY CATEGORY MANDATORY: 1 high-density risk per category.
- STABILIZING ACTIONS: EXACTLY 2 actions per report. 
- AI AUTOMATION STRATEGY: Propose 2 real-world tools with high integration capability.

========================
OUTPUT FORMAT
========================
- Return ONLY strictly valid JSON. 
- Tone: Clinical, forensic, objective.
- Do not include conversational text outside the JSON structure.`;

const riskProperties = {
  id: { type: Type.STRING },
  title: { type: Type.STRING },
  score: { type: Type.INTEGER },
  likelihood: { type: Type.STRING },
  impact: { type: Type.STRING },
  detectability: { type: Type.STRING },
  whatCanGoWrong: { type: Type.STRING },
  whyItMatters: { type: Type.STRING },
  howItFailsSilently: { type: Type.STRING },
  earlySignal: { type: Type.STRING },
  timeTrigger: { type: Type.STRING }
};

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    overallProfile: { type: Type.STRING, enum: ["Low", "Moderate", "High"] },
    timeWindowsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
    workMap: {
      type: Type.OBJECT,
      properties: {
        events: { type: Type.ARRAY, items: { type: Type.STRING } },
        timelines: { type: Type.ARRAY, items: { type: Type.STRING } },
        decisions: { type: Type.ARRAY, items: { type: Type.STRING } },
        dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
        ownership: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    suggestedTools: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          url: { type: Type.STRING },
          bestFor: { type: Type.STRING },
          whyFits: { type: Type.ARRAY, items: { type: Type.STRING } },
          tag: { type: Type.STRING }
        }
      }
    },
    stabilizingActions: { type: Type.ARRAY, items: { type: Type.STRING } },
    sections: {
      type: Type.OBJECT,
      properties: {
        "silent-failure": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: riskProperties } },
        "time-decay": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: riskProperties } },
        "memory-reliance": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: riskProperties } },
        "handoff-breakdowns": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: riskProperties } },
        "trust-erosion": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: riskProperties } },
        "revenue-leakage": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: riskProperties } },
        "scaling-fragility": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: riskProperties } }
      }
    }
  },
  required: ["name", "overallProfile", "timeWindowsDetected", "workMap", "sections", "suggestedTools", "stabilizingActions"]
};

export const MOCK_REPORTS: ScanReport[] = [
  {
    id: "SOLO-STUDIO-AUDIT",
    name: "Solo Design Studio Audit",
    timestamp: new Date().toLocaleString(),
    overallProfile: "High",
    originalInput: "I run a small design studio and handle sales and delivery myself. Inquiries come via email. I reply when I see them. If it fits, I send a proposal. I keep track of projects by memory and checking threads. Some clients take days to reply, and I usually wait for them. When busy, it's hard to tell which projects have stalled.",
    timeWindowsDetected: ["Inquiry-to-Reply", "Proposal Acceptance", "Active Project Polling"],
    workMap: {
      events: ["Inquiry Arrival", "Context Sorting", "Proposal Issuance", "Context-Switching", "Mental Polling"],
      timelines: ["Wait-State Duration", "Latency"],
      decisions: ["Fit Assessment", "Prioritization"],
      dependencies: ["Reply -> Interaction", "Agreement -> Production"],
      ownership: ["Designer-as-Sales", "Designer-as-Producer"]
    },
    suggestedTools: [
      {
        name: "Trello",
        url: "https://trello.com",
        bestFor: "Externalized State Tracking",
        whyFits: ["Visualizes 'Wait States' to prevent project amnesia.", "Decouples status from fragmented chat threads."],
        tag: "Core Workflow"
      },
      {
        name: "Make",
        url: "https://make.com",
        bestFor: "Lead Consolidation",
        whyFits: ["Aggregates inquiries into a single audit log.", "Eliminates inquiries dropping during peak delivery."],
        tag: "Automation"
      }
    ],
    stabilizingActions: [
      "Externalize project state from memory into a visual Kanban system.",
      "Replace manual polling with automated interrupt-driven notifications."
    ],
    sections: {
      "silent-failure": [{
        id: "sf-solo-1",
        title: "Proposal Decay Sinkhole",
        score: 85,
        likelihood: "High",
        impact: "High",
        detectability: "Hidden",
        whatCanGoWrong: "Sent proposals lack follow-up triggers, causing leads to evaporate silently.",
        whyItMatters: "Revenue is lost simply because of re-engagement failure.",
        howItFailsSilently: "No automated tracking exists for pending proposal resolution status.",
        earlySignal: "Finding unread sent emails from two weeks ago."
      }],
      "time-decay": [{
        id: "td-solo-1",
        title: "Lead Cooling Latency",
        score: 72,
        likelihood: "Moderate",
        impact: "Moderate",
        detectability: "Moderate",
        whatCanGoWrong: "Ad-hoc replies cause maximum delay during high production cycles.",
        whyItMatters: "Lead conversion probability drops as response time increases.",
        howItFailsSilently: "Delay is perceived as busyness rather than a systemic bottleneck.",
        earlySignal: "Clients stating they found another provider already.",
        timeTrigger: "4h Post-Inquiry"
      }],
      "memory-reliance": [{
        id: "mr-solo-1",
        title: "Context-Switch Metadata Loss",
        score: 91,
        likelihood: "High",
        impact: "High",
        detectability: "Hidden",
        whatCanGoWrong: "Switching between Sales and Design relies entirely on biological recall.",
        whyItMatters: "Missing subtle client requirements leads to significant project rework.",
        howItFailsSilently: "Failure is misattributed to personal error rather than system gaps.",
        earlySignal: "Re-reading the same Slack thread multiple times."
      }],
      "handoff-breakdowns": [{
        id: "hb-solo-1",
        title: "Agreement-to-Asset Gap",
        score: 76,
        likelihood: "Moderate",
        impact: "Moderate",
        detectability: "Easy",
        whatCanGoWrong: "Starting work depends on unrequested client assets, causing stalls.",
        whyItMatters: "Projects stall immediately due to lack of a formal request.",
        howItFailsSilently: "Both parties assume the other will initiate asset transfer.",
        earlySignal: "Active projects with zero files in the folder."
      }],
      "trust-erosion": [{
        id: "te-solo-1",
        title: "Wait-State Opacity",
        score: 64,
        likelihood: "Moderate",
        impact: "Moderate",
        detectability: "Hidden",
        whatCanGoWrong: "Clients lack visibility into whether work is progressing or waiting.",
        whyItMatters: "Invisibility is perceived as unreliability, damaging potential referrals.",
        howItFailsSilently: "Client feels ignored during silent backend production periods.",
        earlySignal: "Receiving 'just checking in' messages regularly."
      }],
      "revenue-leakage": [{
        id: "rl-solo-1",
        title: "Scope Drift Leakage",
        score: 82,
        likelihood: "High",
        impact: "Moderate",
        detectability: "Hidden",
        whatCanGoWrong: "Informal chat requests often include unbilled scope expansions.",
        whyItMatters: "Unbilled capacity lowers the effective hourly rate significantly.",
        howItFailsSilently: "Scope creep is misidentified as routine client favors.",
        earlySignal: "Final file counts doubling initial project estimates."
      }],
      "scaling-fragility": [{
        id: "sf-solo-2",
        title: "Mental Buffer Saturation",
        score: 96,
        likelihood: "Moderate",
        impact: "High",
        detectability: "Moderate",
        whatCanGoWrong: "The mental workflow model fails completely beyond three active projects.",
        whyItMatters: "Business hits a growth ceiling despite having physical time.",
        howItFailsSilently: "Growth limitations are misidentified as simple time management issues.",
        earlySignal: "Closing the laptop because pending tasks feel overwhelming."
      }]
    }
  }
];
