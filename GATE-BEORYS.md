# GATE BEORYS — UNIVERSAL AI TRIGGER

Version: 1.0 | Date: 2026-08-30 | Mode: DOCUMENTATION-ONLY
Canonical skill: `robertasarra/beorys-method/.ai/skills/gate-beorys-adversarial-architecture/SKILL.md`

## Trigger
Any AI with repository access must treat `GATE BEORYS`, `GATE BEORYS: PROPOSTA`, `GATE BEORYS: DESAFIO`, `GATE BEORYS: TRÉPLICA`, `GATE BEORYS: SÍNTESE` or `GATE BEORYS: COMPLETO` as a request to start this protocol. Inspect the repository first and record branch + commit SHA. Read the canonical skill when accessible; otherwise this file is binding.

## Protocol
1. PROPOSAL: evidence-backed current architecture, problem/root cause, solution, alternatives, risks, failure modes and decision matrix.
2. CHALLENGE: independent repository inspection; strengths, weaknesses, unsupported claims, hidden assumptions, failure scenarios, opportunities and better alternatives.
3. REBUTTAL: answer each material challenge as ACCEPT/REJECT/PARTIAL with evidence; revise when justified.
4. SYNTHESIS: neutrally verify disputes and combine the strongest validated elements.

## Evidence
Use `EV-001...` with repository, branch, commit SHA, file, lines or exact locator, observed behavior/excerpt, interpretation, relevance and confidence. Separate FACT, INFERENCE, HYPOTHESIS and RECOMMENDATION. Never invent code, paths, APIs, schemas, symbols, line numbers or runtime behavior.

## Files
Create `docs/adversarial-architecture/<YYYY-MM-DD>/<topic-slug>/` containing `00-context.md`, `01-proposal.md`, `02-challenge.md`, `03-rebuttal.md`, `04-synthesis.md`, `EVIDENCE.md`, `DECISION.md`. Preserve earlier phases; corrections use ERRATA.

## No-code gate
Until explicit user authorization after synthesis: no source/test/dependency/lockfile/migration/CI/CD/infrastructure/config/secrets changes, no merge, no deploy, no implementation authorization. State `Implementation-Authorized: NO`.

## Return contract
Every phase is dated and declaratively signed. Return exact saved path, analyzed branch+SHA, concise verdict, explicit no-code confirmation, and a complete copy/paste handoff for the next AI with repository snapshot, prior path, required output path, independent inspection and evidence requirements.

Decision rule: Evidence > confidence. Prefer repository-native, simpler and reversible architecture when outcomes are equivalent. Attack the architecture, attack the attack, then combine what survives evidence.

---
Prepared-By: OpenAI GPT-5.6 Sol
Role: GATE BEORYS distribution router
Timestamp: 2026-08-30T07:20:00-03:00
Implementation-Authorized: NO
Signature-Type: Declarative AI audit signature
---
