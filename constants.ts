
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

export const SYSTEM_INSTRUCTION = `You are the "Invisible Risk Finder" Deep Research Engine. Your goal is to provide a forensic, high-density diagnostic that rivals advanced research reports.

========================
RESEARCH PROTOCOL: CAUSAL SIMULATION
========================
Before generating, conduct internal passes:
1. WORKFLOW RECONSTRUCTION: Map the stated process into a formal state machine.
2. STRESS SIMULATION: Model 1,000 scenarios (surges, absences, silence).
3. NEGATIVE SPACE AUDIT: Identify every "Silent Wait" state where no one is actively monitoring.

========================
DIVERSITY & NOVELTY DENSITY (CRITICAL)
========================
- AVOID SUBCONSCIOUS CLUSTERING: Do not repeat "I'm messy" or "I forget things" across categories.
- CATEGORY PURITY:
    * Silent Failure: Lack of system feedback (e.g. an inquiry that dies without a "declined" state).
    * Time-Decay: The specific cost of the clock (e.g. lead cooling).
    * Memory Reliance: Dependency on biological recall vs externalized truth.
    * Handoff: The gap between two distinct mental roles (e.g. Sales-Designer transition).
    * Trust Erosion: Perceptual damage to the client relationship.
    * Revenue Leakage: Unbilled work or uncaptured financial opportunities.
    * Scaling Fragility: Failure points that break only when volume increases.

========================
INSIGHT RIGOR
========================
- EVERY CATEGORY MANDATORY: 1-3 unique risks per category.
- STABILIZING ACTIONS: EXACTLY 2 actions. Bullet point format. 1-2 sentences each.
- AI AUTOMATION STRATEGY: Propose real tools (Make, Zapier, Trello, etc.) with valid URLs. Use main product names only.

========================
OUTPUT
========================
- Strictly valid JSON. Tone: Clinical, forensic, professional.`;

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
    name: "Solo Design Studio Forensic Diagnostic",
    timestamp: new Date().toLocaleString(),
    overallProfile: "High",
    originalInput: "I run a small design studio and handle both sales and delivery myself. New inquiries come in through email and social messages. I reply when I see them, have a few back-and-forth conversations, and if the project seems like a good fit I send a proposal and start work once the client agrees. I keep track of project status mostly by remembering recent conversations and checking messages when something feels overdue. Some clients respond quickly, others take days to reply, and I usually wait for them rather than pushing too hard. When I have multiple projects active at the same time, I switch between selling new work and finishing existing work. As things get busier, it becomes harder to tell which conversations still need attention, which projects are waiting on client input, and whether anything has stalled without me realizing it.",
    timeWindowsDetected: ["Inquiry-to-Reply (Variable)", "Proposal Acceptance Window", "Active Project Polling Cycle"],
    workMap: {
      events: ["Inquiry Arrival", "Manual Contextual Sorting", "Proposal Issuance", "Context-Switching (Sales/Delivery)", "Mental Polling"],
      timelines: ["Wait-State Duration", "Context-Switch Latency"],
      decisions: ["Fit Assessment", "Prioritization Trigger"],
      dependencies: ["Reply -> Interaction", "Agreement -> Production Start"],
      ownership: ["Designer-as-Sales", "Designer-as-Producer"]
    },
    suggestedTools: [
      {
        name: "Trello",
        url: "https://trello.com",
        bestFor: "Externalized State Tracking",
        whyFits: ["Visualizes 'Wait States' to prevent projects from vanishing into the mental archive.", "Decouples current project status from individual chat thread histories."],
        tag: "Core Workflow"
      },
      {
        name: "Make",
        url: "https://make.com",
        bestFor: "Multi-Channel Inbox Consolidation",
        whyFits: ["Aggregates social and email inquiries into a single immutable audit log.", "Eliminates the 'Silent Drop' of inquiries that occur during heavy production periods."],
        tag: "Automation"
      }
    ],
    stabilizingActions: [
      "The process is stabilized by externalizing the project state from biological memory into a visual kanban system with explicit 'Wait' triggers.",
      "The 'Context-Switching' bottleneck is mitigated by moving from a reactive polling model to an interrupt-driven notification system for client inputs."
    ],
    sections: {
      "silent-failure": [{
        id: "sf-solo-1",
        title: "Proposal Decay Sinkhole",
        score: 85,
        likelihood: "High",
        impact: "High",
        detectability: "Hidden",
        whatCanGoWrong: "Once a proposal is sent, there is no system alert if the client doesn't reply. The opportunity simply 'evaporates'.",
        whyItMatters: "Total revenue is lost not because of rejection, but because of a lack of a re-engagement trigger.",
        howItFailsSilently: "No system tracks the delta between 'Proposal Sent' and 'Status Resolved'.",
        earlySignal: "Finding a 2-week-old sent email with no reply while scrolling your inbox."
      }],
      "time-decay": [{
        id: "td-solo-1",
        title: "Reactionary Lead Cooling",
        score: 72,
        likelihood: "Moderate",
        impact: "Moderate",
        detectability: "Moderate",
        whatCanGoWrong: "The 'Reply when I see them' model ensures that high-value inquiries arrive when you are most focused on delivery, leading to maximum delay.",
        whyItMatters: "Lead conversion probability drops by 50% for every 4 hours of silence.",
        howItFailsSilently: "The delay is perceived as 'being busy,' but the system cost is a lower win-rate on premium projects.",
        earlySignal: "Clients responding that they've 'already found someone else' by the time you reply.",
        timeTrigger: "4h Post-Inquiry"
      }],
      "memory-reliance": [{
        id: "mr-solo-1",
        title: "Context-Switching Metadata Loss",
        score: 91,
        likelihood: "High",
        impact: "High",
        detectability: "Hidden",
        whatCanGoWrong: "Switching from 'Design Brain' to 'Sales Brain' relies on your ability to remember where a specific conversation left off.",
        whyItMatters: "You miss subtle client requirements or project constraints stated in chat, leading to rework.",
        howItFailsSilently: "The failure is attributed to 'Designer Error' rather than the structural lack of a centralized brief.",
        earlySignal: "Re-reading the same Slack thread three times before you can start work."
      }],
      "handoff-breakdowns": [{
        id: "hb-solo-1",
        title: "Agreement-to-Asset Gap",
        score: 76,
        likelihood: "Moderate",
        impact: "Moderate",
        detectability: "Easy",
        whatCanGoWrong: "The transition from 'Client Agrees' to 'Designer Starts' lacks a formal asset-collection event.",
        whyItMatters: "Projects 'start' but immediately stall because the designer is waiting for content that was never formally requested.",
        howItFailsSilently: "The designer assumes the client knows what to send; the client assumes the designer will ask.",
        earlySignal: "A project listed as 'Active' having zero files in the project folder."
      }],
      "trust-erosion": [{
        id: "te-solo-1",
        title: "Opacity-Induced Client Anxiety",
        score: 64,
        likelihood: "Moderate",
        impact: "Moderate",
        detectability: "Hidden",
        whatCanGoWrong: "Because you 'usually wait for them,' clients have no visibility into whether you are actually working or just waiting.",
        whyItMatters: "Invisibility is perceived as unreliability, preventing high-ticket referrals.",
        howItFailsSilently: "The client feels ignored during the 'Wait' state even if the designer is working hard on another project.",
        earlySignal: "Clients sending 'just checking in' messages on day 3 of silence."
      }],
      "revenue-leakage": [{
        id: "rl-solo-1",
        title: "Uncaptured Scope Drift",
        score: 82,
        likelihood: "High",
        impact: "Moderate",
        detectability: "Hidden",
        whatCanGoWrong: "Back-and-forth conversations in social messages often include new requests that aren't in the original proposal.",
        whyItMatters: "You spend 20% more time on projects than you billed for, effectively lowering your hourly rate.",
        howItFailsSilently: "The designer views these as 'quick favors' rather than unbilled structural scope expansion.",
        earlySignal: "Final project file count being 2x what was anticipated."
      }],
      "scaling-fragility": [{
        id: "sf-solo-2",
        title: "Mental Buffer Saturation",
        score: 96,
        likelihood: "Moderate",
        impact: "High",
        detectability: "Moderate",
        whatCanGoWrong: "The mental map works for 2 projects. At 5 active projects, the 'overdue feeling' becomes constant and paralyzed.",
        whyItMatters: "The business reaches an artificial 'Growth Ceiling' where you cannot take more work despite having time.",
        howItFailsSilently: "The ceiling is misidentified as a 'time' problem, but it is actually a 'RAM' (Memory) problem.",
        earlySignal: "Closing your laptop early because the number of pending replies feels overwhelming."
      }]
    }
  }
];
