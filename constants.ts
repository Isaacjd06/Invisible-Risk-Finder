
import { Type } from "@google/genai";
import { RiskFinding, ScanReport } from './types';

export const LENSES = [
  { id: 'silent-failure', label: 'Silent Failure Points', description: 'Things that fail without obvious signals.' },
  { id: 'time-decay', label: 'Time-Based Decay Risks', description: 'Risk from delays or nothing happening.' },
  { id: 'memory-reliance', label: 'Memory Reliance / Cognitive Load', description: 'Where you are relying on human memory.' },
  { id: 'handoff-breakdowns', label: 'Handoff / Ownership Breakdowns', description: 'Who owns what, where things get dropped.' },
  { id: 'trust-erosion', label: 'Trust Erosion Risks', description: 'Relationship damage from small misses.' },
  { id: 'revenue-leakage', label: 'Revenue Leakage Risks', description: 'Lost money from missed actions.' },
  { id: 'scaling-fragility', label: 'Scaling Fragility', description: 'What breaks when volume grows.' },
];

export const SYSTEM_INSTRUCTION = `You are an expert AI analysis reliability engineer and the "Invisible Risk Finder" diagnostic engine.
Your task is to identify hidden workflow failure modes using absolute diagnostic rigor.

========================
CORE OBJECTIVE
========================
Ensure that every diagnostic report:
- Takes sufficient reasoning time (Deep Thinking).
- Does not return shallow or first-pass results.
- Does not silently fail into empty categories.
- Produces only high-quality risks — but never by skipping analysis.

========================
MANDATORY INTERNAL ANALYSIS PHASES
========================
Before producing ANY output, you MUST complete these internal phases:

PHASE 1 — Candidate Risk Generation
- Generate a wide internal set of candidate risks per category.
- Ignore max-3 limits temporarily.
- Focus on depth, not filtering.

PHASE 2 — Deep Reasoning Expansion
- For each candidate, fully reason:
  - Silent failure mechanism.
  - Early signal.
  - Second-order consequences.
  - Negative-space support.
  - Scaling relevance.

PHASE 3 — Constraint Filtering
- Apply exclusivity rules.
- Apply negative-space validity checks.
- Apply inevitability scoring rules.

PHASE 4 — Quality Ranking
- Rank remaining risks by: Diagnostic insight, Non-obviousness, and User “oh shit” potential.

PHASE 5 — Final Selection
- Select up to 3 risks per category.

========================
EMPTY-CATEGORY SAFEGUARD
========================
If a category ends up empty, you MUST internally justify it.
- Did this category truly have no valid risks, or were all candidates filtered out?
- If filtered out: Retry PHASES 2–4 with refined reasoning. Prefer rewriting over discarding.
- Empty categories are allowed ONLY if the absence itself is defensible.

========================
SELF-DIAGNOSTIC CHECKLIST
========================
Before returning output, verify:
- Each populated risk introduces NEW insight.
- No category exceeds 3 risks.
- Silent failure explanations are mechanism-based.
- Early signals are observable and early.
- Scaling claims have concrete thresholds.

========================
OUTPUT CONSTRAINTS
========================
- Return strictly valid JSON.
- Maintain a diagnostic, precise tone.
- Do not provide solutions; identify RISKS.`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "A concise name for this scan." },
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
          bestFor: { type: Type.STRING },
          whyFits: { type: Type.ARRAY, items: { type: Type.STRING } },
          tag: { type: Type.STRING }
        }
      }
    },
    sections: {
      type: Type.OBJECT,
      properties: {
        "silent-failure": { type: Type.ARRAY, maxItems: 3, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, score: { type: Type.INTEGER }, likelihood: { type: Type.STRING }, impact: { type: Type.STRING }, detectability: { type: Type.STRING }, whatCanGoWrong: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, howItFailsSilently: { type: Type.STRING }, earlySignal: { type: Type.STRING }, timeTrigger: { type: Type.STRING } } } },
        "time-decay": { type: Type.ARRAY, maxItems: 3, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, score: { type: Type.INTEGER }, likelihood: { type: Type.STRING }, impact: { type: Type.STRING }, detectability: { type: Type.STRING }, whatCanGoWrong: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, howItFailsSilently: { type: Type.STRING }, earlySignal: { type: Type.STRING }, timeTrigger: { type: Type.STRING } } } },
        "memory-reliance": { type: Type.ARRAY, maxItems: 3, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, score: { type: Type.INTEGER }, likelihood: { type: Type.STRING }, impact: { type: Type.STRING }, detectability: { type: Type.STRING }, whatCanGoWrong: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, howItFailsSilently: { type: Type.STRING }, earlySignal: { type: Type.STRING }, timeTrigger: { type: Type.STRING } } } },
        "handoff-breakdowns": { type: Type.ARRAY, maxItems: 3, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, score: { type: Type.INTEGER }, likelihood: { type: Type.STRING }, impact: { type: Type.STRING }, detectability: { type: Type.STRING }, whatCanGoWrong: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, howItFailsSilently: { type: Type.STRING }, earlySignal: { type: Type.STRING }, timeTrigger: { type: Type.STRING } } } },
        "trust-erosion": { type: Type.ARRAY, maxItems: 3, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, score: { type: Type.INTEGER }, likelihood: { type: Type.STRING }, impact: { type: Type.STRING }, detectability: { type: Type.STRING }, whatCanGoWrong: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, howItFailsSilently: { type: Type.STRING }, earlySignal: { type: Type.STRING }, timeTrigger: { type: Type.STRING } } } },
        "revenue-leakage": { type: Type.ARRAY, maxItems: 3, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, score: { type: Type.INTEGER }, likelihood: { type: Type.STRING }, impact: { type: Type.STRING }, detectability: { type: Type.STRING }, whatCanGoWrong: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, howItFailsSilently: { type: Type.STRING }, earlySignal: { type: Type.STRING }, timeTrigger: { type: Type.STRING } } } },
        "scaling-fragility": { type: Type.ARRAY, maxItems: 3, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, score: { type: Type.INTEGER }, likelihood: { type: Type.STRING }, impact: { type: Type.STRING }, detectability: { type: Type.STRING }, whatCanGoWrong: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, howItFailsSilently: { type: Type.STRING }, earlySignal: { type: Type.STRING }, timeTrigger: { type: Type.STRING } } } }
      }
    }
  },
  required: ["name", "overallProfile", "timeWindowsDetected", "workMap", "sections", "suggestedTools"]
};

export const MOCK_REPORTS: ScanReport[] = [
  {
    id: 'DIAG-RIGOR-V1',
    name: 'Creative Pipeline Forensic Scan',
    timestamp: '2023-11-01 09:00',
    overallProfile: 'High',
    originalInput: 'Our agency handles custom video production. Clients submit a request via a Google Form. I check the form every morning. If it looks good, I email them a quote. Once they pay the invoice, I message our lead editor on Slack to start the project. Sometimes projects stall if the client doesn\'t send assets, so I try to remember to follow up after a week.',
    timeWindowsDetected: ['Intake Window (09:00)', '7-Day Follow-up Buffer', 'Asset Delivery Deadline'],
    workMap: {
      events: ['Form Submission', 'Manual Review', 'Email Quote', 'Invoice Payment', 'Slack Activation', 'Asset Collection'],
      timelines: ['Daily 9AM check', 'Indefinite quote validity', '7-day manual follow-up'],
      decisions: ['Lead qualification', 'Pricing tier determination', 'Editor selection'],
      dependencies: ['Quote requires Owner Review', 'Payment requires Quote', 'Project start requires Payment'],
      ownership: ['Potential Client', 'Agency Owner', 'Lead Editor']
    },
    suggestedTools: [
      {
        name: "Make.com",
        bestFor: "Complex workflow orchestration",
        whyFits: ["Connects Google Forms directly to your invoicing system", "Eliminates the manual morning 'check' by pushing leads immediately"],
        tag: "Automation Platform"
      }
    ],
    sections: {
      'silent-failure': [
        {
          id: 'sf-1',
          title: 'Undefined Asset "Received" State',
          score: 93,
          likelihood: 'High',
          impact: 'High',
          detectability: 'Hidden',
          whatCanGoWrong: 'The process lacks a formal confirmation step for asset intake. Clients upload files to a shared drive, but since no notification trigger exists, the project enters a "stalled" state that looks identical to a "waiting" state.',
          whyItMatters: 'Direct delivery delay compounded by the user gradually stopping proactive progress checks as volume increases. Breakpoint: This holds for single projects, but once >2 clients are uploading simultaneously, the mental map of "who has sent what" collapses, causing a total production stall.',
          howItFailsSilently: 'Negative-space mechanism: There is no defined moment where "uploading" becomes "received." The absence of an explicit signal causes the team to misread client silence as "work in progress."',
          earlySignal: 'Cloud storage folder "Last Modified" dates advancing without a corresponding Slack update from the editor.',
          timeTrigger: '24h post-payment'
        }
      ],
      'memory-reliance': [
        {
          id: 'mr-1',
          title: 'Manual Activation Bottleneck',
          score: 87,
          likelihood: 'High',
          impact: 'High',
          detectability: 'Moderate',
          whatCanGoWrong: 'The lead editor is only activated when the owner remembers to verify payment and send a manual Slack message.',
          whyItMatters: 'Dependency on episodic memory. Breakpoint: This "memory-poll" model holds when project starts occur <2 times per week; once project volume hits a daily frequency, the probability of an overlapping "start" occurring during a distraction window approaches 100%.',
          howItFailsSilently: 'Memory substitution: The owner assumes "I would have seen the notification if they paid," failing to realize they have no notification system and must poll the bank manually.',
          earlySignal: 'Lead editor asking "Any news on X?" only at the end of the day, signaling they have been idle for multiple hours.',
        }
      ]
    }
  }
];
