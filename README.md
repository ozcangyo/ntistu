# MedAI MVP

Educational medication support web app. **No diagnosis, no prescribing, no individualized dose changes.**

## Stack
- Next.js App Router + TypeScript + Tailwind
- Prisma + PostgreSQL
- NextAuth credentials auth
- OpenAI Chat Completions (optional via `OPENAI_API_KEY`)
- Multilingual UI (English, Turkish, Sorani Kurdish)
- Hybrid drug search (local DB + openFDA fallback)

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create env:
   ```bash
   cp .env.example .env
   ```
3. Run migrations:
   ```bash
   pnpm prisma:migrate
   ```
4. Seed demo data:
   ```bash
   pnpm prisma:seed
   ```
5. Run web app:
   ```bash
   pnpm dev
   ```
6. Run reminder worker in separate terminal:
   ```bash
   node scripts/reminderWorker.ts
   ```
   (or `pnpm worker`)

## Admin login
- Email: `admin@medai.local`
- Password: `Admin123!`

## Key features
- Medication/supplement search with source links and external openFDA fallback
- My Regimen + schedule times
- Reminder notifications and dose logging (Taken/Snooze/Missed)
- Weekly adherence report + CSV export
- Missed-dose guidance text
- OTC/supplement rule-based interaction checker
- Red-flag triage (LOW/MODERATE/HIGH/EMERGENCY)
- AI Doctor chat (`/api/chat`) context-aware of regimen, with mandatory disclaimer
- Admin panel for medication CRUD, visibility toggle, links, interaction rules, audit logs

## Safety
All AI responses include: `This is not medical advice. Consult a licensed clinician/pharmacist.`
If emergency symptoms are detected (chest pain, trouble breathing, severe allergic reaction, stroke signs, suicidal thoughts, severe bleeding, overdose), the app shows an emergency banner and advises immediate care.


## Prompt governance
- Master system prompt reference: `docs/MASTER_PROMPT.md`
