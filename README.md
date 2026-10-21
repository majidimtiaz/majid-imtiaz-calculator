# Calculator

A standard, simple calculator that runs in the browser, like the basic calculator on a phone or desktop. It handles digits, a decimal point, `+ − × ÷`, equals, clear (AC), backspace and keyboard input.

## Who it is for

The app serves the two roles in [docs/app-roles.md](docs/app-roles.md):

- **R-1 Pointer user:** someone doing a quick everyday sum, such as splitting a bill or checking a receipt, by clicking or tapping buttons.
- **R-2 Keyboard user:** someone entering numbers quickly from a keyboard or numeric keypad while working at a desk.

## Why a simple standard calculator

I chose a small, familiar app on purpose. Everyone already knows how a basic calculator should behave, so a reviewer can test it without instructions. Keeping the scope small also meant I could make every behavior exact, including errors, rounding and keyboard input, instead of building more features less carefully.

## Prerequisites

A current version of Chrome, Edge, Firefox or Safari. No install, no accounts and no API keys. The app is plain HTML, CSS and JavaScript with no frameworks, libraries or build step.

## How to run

1. Open the `src` folder.
2. Double-click `index.html`, or drag it into a browser window.

**Optional, using a local server:** from inside the `src` folder, run

```
python -m http.server
```

(on some systems the command is `python3`), then open http://localhost:8000 in a browser.

## Testing

There are no automated tests. Every acceptance criterion in [docs/user-stories.md](docs/user-stories.md) was checked by hand in [the browsers I used].

## AI tool and model used

[I'll fill in, e.g. Claude Code with Claude Opus]

## Code changed by hand

[None / list them]

## Assumptions

- **Order of operations:** left to right, like a basic calculator, with no operator precedence. `2 + 3 × 4 =` gives `20`, not `14`.
- **Display limit:** 12 digits. The minus sign and decimal point don't count, but a leading `0` (as in `0.5`) does. Extra digits typed beyond 12 are ignored.
- **Errors:** dividing by zero shows `Cannot divide by zero`, and a result too large for 12 digits shows `Overflow`. While an error is showing, operators and `=` are ignored. A digit, `.`, AC or backspace clears it and starts fresh.
- **Floating-point rounding:** results are kept at full precision and rounded only for display, then trailing zeros are removed. So `0.1 + 0.2` shows `0.3`, and `1 ÷ 3 × 3` shows `1`. A result too small to show in 12 digits shows `0`.
- **Not included:** no calculation history, no memory keys (M+, MR), no percent or ± keys. Negative numbers can appear as results but can't be typed directly.

## Documents

- [docs/app-roles.md](docs/app-roles.md): who uses the app
- [docs/jobs-to-be-done.md](docs/jobs-to-be-done.md): what they need to get done
- [docs/user-stories.md](docs/user-stories.md): user stories, acceptance criteria and status

## Folder layout

```
README.md
docs/
  app-roles.md
  jobs-to-be-done.md
  user-stories.md
src/
  index.html   page structure and buttons
  style.css    layout and styling
  script.js    calculator logic and keyboard handling
```
