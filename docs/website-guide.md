# Jaz's website guide

The floating chat icon opens a React/native-dialog website guide on every page. The separate scheduling action still links to `/booking#book`.

## Behaviour and scope

- Answers come from reviewed website information in `src/utils/websiteGuide.js`, with programme links and client-story references drawn from the existing JSON data.
- Replies contain plain text and allowlisted local navigation links. This is a deterministic intent-based guide, not a general-purpose language model or live chat with Jaz.
- It does not use an AI API, execute instructions, send messages, manage appointments, place orders, generate personalised plans or provide medical advice.
- Unrecognised questions receive an honest fallback with FAQ/contact links; unpublished prices, qualifications and availability are not invented.
- Recent conversation stays in React memory across client-side page navigation. Clear chat or reload to reset it; no chat database, browser storage or external AI service is used. No chat analytics events have been added.

## Maintaining answers

Review the answer text and intent patterns when programme details, FAQs or biography information change. Keep each answer tied to its source page. Update `tests/websiteGuide.test.js` when adding supported intents, and retain tests for out-of-scope tasks, unknown facts, private data and allowed destinations.

The guide is mounted once in `src/App.jsx`; its interface is in `src/components/WebsiteGuide.jsx`. Dialog focus, Escape/backdrop dismissal, keyboard viewport sizing, bounded message history and mobile floating-button spacing are handled in the component and shared styles.

Run all tests with `node --test tests/*.test.js`, then `npm run build`.
