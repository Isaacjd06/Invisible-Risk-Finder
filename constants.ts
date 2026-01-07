
import { Type } from "@google/genai";
import { RiskFinding, ScanReport } from './types';

export const LENSES = [
  { id: 'silent-failure', label: 'Silent Failure', color: 'rose', description: 'Failures with no visible signal until damage has occurred.' },
  { id: 'time-decay', label: 'Time-Based Decay', color: 'amber', description: 'Value loss caused specifically by delay or inactivity.' },
  { id: 'memory-reliance', label: 'Memory Reliance', color: 'violet', description: 'Failures caused by relying on human recall or attention.' },
  { id: 'handoff-breakdowns', label: 'Handoff/Ownership', color: 'indigo', description: 'Failures caused by unclear responsibility or transitions.' },
  { id: 'trust-erosion', label: 'Trust Erosion', color: 'sky', description: 'Failures that damage confidence through inconsistency.' },
  { id: 'revenue-leakage', label: 'Revenue Leakage', color: 'emerald', description: 'Lost money quietly without rejection.' },
  { id: 'scaling-fragility', label: 'Scaling Fragility', color: 'orange', description: 'Failures that emerge ONLY as volume or concurrency increases.' },
];

export const SYSTEM_INSTRUCTION = `You are the "Invisible Risk Finder" Deep Research Engine. Your diagnostic precision must rival the most advanced forensic audit tools.

========================
DEEP RESEARCH PROTOCOL: RECURSIVE DELIBERATION
========================
Before finalizing any finding, perform three internal passes:
1. RECONNAISSANCE: Build a rigorous mathematical model of the user's workflow. Identify all "Silent States" (where the process is waiting on a biological or system trigger).
2. STRESS SIMULATION: Simulate 1,000 edge-case scenarios including context-switch exhaustion, information decay, and ownership vacuums.
3. ANOMALY DETECTION: Search for "Negative Space" risks—things that break specifically because nothing happened.

========================
DIAGNOSTIC RIGOR & DENSITY
========================
- MANDATORY FULL SPECTRUM: You MUST populate EVERY one of the 7 risk categories with at least 1 risk. Maximum of 3 per category.
- CRITICALITY GATE: Only include risks that represent a structural threat.
- STABILIZING ACTIONS: You MUST provide EXACTLY two (2) top-level structural observations. Each must be 1-2 sentences. 
- ADVANCED AUTOMATION: Propose specific AI tools (Make, Zapier, Clay, etc.) with valid URLs. Use the main, simple name of the tool.

========================
TONE & FORMATTING
========================
- Clinical, technical, and forensic.
- Output strictly valid JSON following the provided schema.`;

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
    id: "EX-B2B-SAAS-001",
    name: "Enterprise SaaS Customer Onboarding Diagnostic",
    timestamp: "2024-05-20 14:30",
    overallProfile: "High",
    originalInput: "Our onboarding starts when a customer signs in DocuSign. Sales then Slack-messages the CS lead. CS manually creates a project in Asana. The technical team is notified via email to provision the account. If the client doesn't book their kickoff call within 3 days, CS tries to remember to follow up. Sometimes billing is delayed because the finance team doesn't know when a project has actually 'launched'.",
    timeWindowsDetected: ["Signature -> Kickoff (72h Threshold)", "Weekly Launch Reconciliation"],
    workMap: {
      events: ["Contract Signature", "Slack Notification", "Asana Creation", "Email Provisioning", "Kickoff Booking"],
      timelines: ["3-Day Memory Window", "Provisioning SLA", "Launch Sync Cycle"],
      decisions: ["Account Manager Assignment", "Provisioning Approval"],
      dependencies: ["Signature -> Kickoff", "Launch -> Billing Notification"],
      ownership: ["Sales (Closing)", "CS (Onboarding)", "Dev (Provisioning)", "Finance (Billing)"]
    },
    suggestedTools: [
      {
        name: "Make",
        url: "https://make.com",
        bestFor: "Lifecycle Automation",
        whyFits: ["Connects DocuSign, Slack, and Asana into a single immutable trigger chain.", "Eliminates the 'human-in-the-loop' delay for account provisioning."],
        tag: "Infrastructure"
      },
      {
        name: "Zapier",
        url: "https://zapier.com",
        bestFor: "Notification State Sync",
        whyFits: ["Bridges the gap between CS project status and Finance billing alerts."],
        tag: "Middleware"
      }
    ],
    stabilizingActions: [
      "The system is stabilized by externalizing the 'Launch' status into a shared state-engine visible to Finance.",
      "Biological memory reliance is mitigated by moving the 'Follow-up' logic to a persistent temporal trigger."
    ],
    sections: {
      "silent-failure": [{
        id: "sf-001",
        title: "Provisioning Deadlock",
        score: 88,
        likelihood: "Moderate",
        impact: "High",
        detectability: "Hidden",
        whatCanGoWrong: "The transition from CS creation to Dev provisioning relies on an asynchronous email that can be lost in noise.",
        whyItMatters: "Customers pay for a subscription they cannot access, leading to Day-1 churn risk.",
        howItFailsSilently: "No one monitors the 'Email Sent' vs 'Account Created' delta.",
        earlySignal: "Client asking for logins 48h after signing.",
        timeTrigger: "24h after Signature"
      }],
      "time-decay": [{
        id: "td-001",
        title: "Kickoff Momentum Decay",
        score: 75,
        likelihood: "High",
        impact: "Moderate",
        detectability: "Moderate",
        whatCanGoWrong: "Value perception drops rapidly if the kickoff isn't booked immediately.",
        whyItMatters: "Implementation success is directly correlated with the speed of initial engagement.",
        howItFailsSilently: "The project stays 'Active' in Asana even if no meeting is scheduled.",
        earlySignal: "Unopened onboarding emails in the CRM.",
        timeTrigger: "72h Post-Signature"
      }],
      "memory-reliance": [{
        id: "mr-001",
        title: "Biological Follow-up Fragility",
        score: 92,
        likelihood: "High",
        impact: "Moderate",
        detectability: "Moderate",
        whatCanGoWrong: "Follow-ups rely on the CS manager's individual calendar and morning energy.",
        whyItMatters: "Inconsistent engagement creates a 'High Touch' illusion that fails at scale.",
        howItFailsSilently: "Lost leads are attributed to 'Client Busy' rather than 'Internal Silence'.",
        earlySignal: "Project board showing multiple tasks overdue by >2 days."
      }],
      "handoff-breakdowns": [{
        id: "hb-001",
        title: "Finance/Ops Information Gap",
        score: 84,
        likelihood: "High",
        impact: "High",
        detectability: "Hidden",
        whatCanGoWrong: "Finance has no signal that 'Launch' occurred, delaying first-month billing.",
        whyItMatters: "Cash flow leakage and potential billing disputes months later.",
        howItFailsSilently: "Finance assumes CS will tell them; CS assumes Launch is obvious from Asana.",
        earlySignal: "Month-end reconciliation showing un-invoiced active accounts."
      }],
      "trust-erosion": [{
        id: "te-001",
        title: "Manual Provisioning Inconsistency",
        score: 68,
        likelihood: "Moderate",
        impact: "High",
        detectability: "Easy",
        whatCanGoWrong: "Manual account setup leads to inconsistent feature sets or missing user seats.",
        whyItMatters: "First impression of product reliability is permanently damaged.",
        howItFailsSilently: "Errors are caught only when the user complains.",
        earlySignal: "Tickets raised within first 2 hours of access."
      }],
      "revenue-leakage": [{
        id: "rl-001",
        title: "Unbilled Over-Provisioning",
        score: 72,
        likelihood: "Moderate",
        impact: "Moderate",
        detectability: "Hidden",
        whatCanGoWrong: "Technical teams provision higher-tier features than Sales actually closed.",
        whyItMatters: "Direct margin erosion on every enterprise seat.",
        howItFailsSilently: "Provisioning team uses a generic 'standard' template for all enterprise.",
        earlySignal: "Discrepancy between contract SKU and provisioning log."
      }],
      "scaling-fragility": [{
        id: "sf-002",
        title: "CS Lead Routing Bottleneck",
        score: 95,
        likelihood: "Moderate",
        impact: "High",
        detectability: "Moderate",
        whatCanGoWrong: "One CS lead handles ALL assignments via Slack. If volume triples, assignment stalls.",
        whyItMatters: "The entire agency production engine stops during holiday surges.",
        howItFailsSilently: "Queue builds up in the lead's DM inbox, invisible to leadership.",
        earlySignal: "Slack thread count exceeding 50 unread messages in CS channel."
      }]
    }
  }
];
