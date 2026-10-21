# User Stories

Roles are defined in `docs/app-roles.md` and jobs in `docs/jobs-to-be-done.md`.

## Rules that apply to every story

- **Evaluation order: left to right**, like a basic phone or desktop calculator. There is no operator precedence. `2 + 3 × 4 =` gives `20`, not `14`.
- **Display limit: 12 digits.** The minus sign and decimal point do not count. A leading `0` before the decimal point does count.
- **Results are stored at full precision and rounded only for display.** A result is rounded to as many decimal places as fit in 12 digits, and trailing zeros are removed. The full value is carried into the next calculation.
- **Error messages (exact text):** `Cannot divide by zero` and `Overflow`.
- **Starting state:** when the page loads, or after AC, the display shows `0` and no operation is pending.
- **Keys on screen:** `0`–`9`, `.`, `+`, `−`, `×`, `÷`, `=`, `AC`, `⌫` (backspace). Negative numbers can appear in results, but there is no key for typing a negative number.

---

## S-1: Enter numbers

**As a** Pointer user (R-1), **I want** to enter whole and decimal numbers, **so that** I can type in the prices from a receipt.
**Serves:** J-2
**Status:** Implemented

**Acceptance criteria**

1. Given the display shows `0`, when I press `7`, then the display shows `7`.
2. Given the display shows `7`, when I press `2`, then the display shows `72`.
3. Given the display shows `0`, when I press `0` three times, then the display still shows `0` (no leading zeros).
4. Given the display shows `0`, when I press `.`, then the display shows `0.`.
5. Given the display shows `0.`, when I press `5`, then the display shows `0.5`.
6. Given the display shows `1.2`, when I press `.` again, then nothing changes, and pressing `3` shows `1.23` (only one decimal point per number).
7. Given the display shows `123456789012` (12 digits), when I press `3`, then the display still shows `123456789012` (extra digits are ignored).
8. Given the display shows `0.1234567890` (11 digits), when I press `1` then `2`, then the display shows `0.12345678901` (12 digits) and the `2` is ignored.

## S-2: Add, subtract, multiply and divide

**As a** Pointer user (R-1), **I want** to do one operation on two numbers and see the result, **so that** I can work out each person's share of a bill.
**Serves:** J-1
**Status:** Implemented

**Acceptance criteria**

1. Given the starting state, when I press `8 + 5 =`, then the display shows `13`.
2. Given the starting state, when I press `2 − 5 =`, then the display shows `-3`.
3. Given the starting state, when I press `6 × 7 =`, then the display shows `42`.
4. Given the starting state, when I press `90 ÷ 4 =`, then the display shows `22.5`.
5. Given the starting state, when I press `1 . 5 × 2 =`, then the display shows `3`.
6. **Operator first:** Given the starting state, when I press `+ 5 =`, then the display shows `5` (the starting `0` is the first number).
7. **Two operators in a row:** Given the starting state, when I press `5 + × 2 =`, then the display shows `10` (the second operator replaces the first).
8. **Equals with no second number:** Given the starting state, when I press `5 + =`, then the display shows `5` (the unfinished operator is dropped).
9. **Equals twice:** Given the display shows the result `13` after `8 + 5 =`, when I press `=` again, then the display still shows `13`.
10. **No negative zero:** Given the starting state, when I press `0 − 3 =` then `× 0 =`, then the display shows `0`, not `-0`.

## S-3: Chain several operations

**As a** Pointer user (R-1), **I want** to keep adding, subtracting, multiplying or dividing without pressing equals each time, **so that** I can total a whole receipt in one go.
**Serves:** J-2
**Status:** Implemented

**Acceptance criteria**

1. Given the starting state, when I press `2 + 3 × 4 =`, then the display shows `20` (left to right).
2. Given the starting state, when I press `2 + 3 ×`, then the display shows `5` (the pending result appears when the next operator is pressed).
3. Given the starting state, when I press `10 − 2 − 3 =`, then the display shows `5`.
4. Given the starting state, when I press `12.5 + 7.25 + 3 =`, then the display shows `22.75`.
5. Given the starting state, when I press `2 + 3 × − 1 =`, then the display shows `4` (`−` replaces `×`, so the calculation is `5 − 1`).

## S-4: Accurate results within the display limit

**As a** Keyboard user (R-2), **I want** every result to be exactly right and to fit the display, **so that** I can trust the totals in an invoice before I send it.
**Serves:** J-5
**Status:** Implemented

**Acceptance criteria**

1. Given the starting state, when I enter `0.1 + 0.2 =`, then the display shows `0.3` (not `0.30000000000000004`).
2. Given the starting state, when I enter `1.1 × 3 =`, then the display shows `3.3`.
3. Given the starting state, when I enter `0.3 − 0.1 =`, then the display shows `0.2`.
4. Given the starting state, when I enter `2 ÷ 3 =`, then the display shows `0.66666666667` (rounded to 12 digits).
5. Given the starting state, when I enter `10 ÷ 3 =`, then the display shows `3.33333333333`.
6. Given the starting state, when I enter `1 ÷ 3 × 3 =`, then the display shows `1` (full precision is carried forward, not the rounded display value).
7. Given the starting state, when I enter `999999999999 + 0 =`, then the display shows `999999999999` (the largest number that fits).
8. Given the starting state, when I enter `0.00000000001 ÷ 10 =`, then the display shows `0` (a result too small to show in 12 digits rounds to `0`).

## S-5: Clear error messages, and carrying on after an error

**As a** Keyboard user (R-2), **I want** to be told plainly when a calculation has no valid answer, **so that** I never act on a wrong number.
**Serves:** J-5
**Status:** Implemented

**Acceptance criteria**

1. **Division by zero:** Given the starting state, when I enter `7 ÷ 0 =`, then the display shows `Cannot divide by zero`. It never shows `Infinity`, `NaN` or a number.
2. Given the starting state, when I enter `0 ÷ 0 =`, then the display shows `Cannot divide by zero`.
3. Given the starting state, when I enter `5 ÷ 0 +`, then the display shows `Cannot divide by zero` (the error appears when the next operator triggers the calculation).
4. **Overflow:** Given the starting state, when I enter `999999999999 + 1 =`, then the display shows `Overflow`.
5. Given the starting state, when I enter `0 − 999999999999 − 999999999999 =`, then the display shows `Overflow` (applies to large negative results too).
6. **Recovery with a digit:** Given the display shows an error, when I press `4`, then the display shows `4` and a new calculation starts.
7. **Recovery with a decimal point:** Given the display shows an error, when I press `.`, then the display shows `0.`.
8. **Recovery with AC or backspace:** Given the display shows an error, when I press `AC` or `⌫`, then the display shows `0`.
9. **Ignored keys during an error:** Given the display shows an error, when I press `+`, `−`, `×`, `÷` or `=`, then the error message stays and nothing else happens.
10. **No crash:** Given any error is showing, when I then enter `2 + 2 =`, then the display shows `4` and no errors appear in the browser console.

## S-6: Carry on after a result

**As a** Pointer user (R-1), **I want** to either start a new sum or keep working with the last result, **so that** I can move quickly from the bill total to each person's share.
**Serves:** J-1
**Status:** Implemented

**Acceptance criteria**

1. **Digit after equals starts fresh:** Given the display shows `13` after `8 + 5 =`, when I press `4`, then the display shows `4`, and pressing `+ 1 =` shows `5`.
2. **Operator after equals continues:** Given the display shows `13` after `8 + 5 =`, when I press `÷ 2 =`, then the display shows `6.5`.
3. **Decimal point after equals starts fresh:** Given the display shows `13` after `8 + 5 =`, when I press `.`, then the display shows `0.`.
4. **Bill example:** Given the starting state, when I press `120 + 45 + 35 =` then `÷ 4 =`, then the display shows `200` and then `50`.

## S-7: Delete the last digit (backspace)

**As a** Pointer user (R-1), **I want** to remove the last digit I typed, **so that** I can fix a typing mistake without starting the whole sum again.
**Serves:** J-3
**Status:** Implemented

**Acceptance criteria**

1. Given the display shows `123`, when I press `⌫`, then the display shows `12`.
2. Given the display shows `7`, when I press `⌫`, then the display shows `0`.
3. Given the display shows `0.5`, when I press `⌫` twice, then the display shows `0.` and then `0`.
4. **Fix mid-sum:** Given I pressed `8 + 56`, when I press `⌫`, `7` and `=`, then the display shows `65` (the first number and the operator are kept).
5. **Backspace on a result:** Given the display shows `13` after `8 + 5 =`, when I press `⌫`, then the display still shows `13` (a result is not edited digit by digit).
6. **Backspace after an operator:** Given I pressed `8 +`, when I press `⌫`, then the display still shows `8`, and pressing `2 =` shows `10`.

## S-8: Clear everything (AC)

**As a** Pointer user (R-1), **I want** to wipe the current calculation in one press, **so that** I can start checking the next receipt from a clean state.
**Serves:** J-2
**Status:** Implemented

**Acceptance criteria**

1. Given I pressed `8 + 5`, when I press `AC`, then the display shows `0`, and pressing `2 =` shows `2` (the pending `8 +` is gone).
2. Given the display shows `13` after `8 + 5 =`, when I press `AC`, then the display shows `0`.
3. Given the display shows `0`, when I press `AC`, then the display still shows `0`.

## S-9: Use the keyboard for everything

**As a** Keyboard user (R-2), **I want** every calculator action on a key, **so that** I can run quick sums while typing at my desk without reaching for the mouse.
**Serves:** J-4
**Status:** Implemented

**Key mapping**

| Key | Action |
|---|---|
| `0`–`9` (main row or numpad) | digit |
| `.` (main row or numpad) | decimal point |
| `+` `-` `*` `/` (main row or numpad) | `+` `−` `×` `÷` |
| `Enter` or `=` (including numpad Enter) | `=` |
| `Backspace` | `⌫` |
| `Escape` | `AC` |

**Acceptance criteria**

1. Given the page has just loaded and nothing has been clicked, when I type `8+5` then `Enter`, then the display shows `13`.
2. Given the starting state, when I type `6*7=`, then the display shows `42`.
3. Given the starting state, when I type `9/2` then `Enter` using only the numpad, then the display shows `4.5`.
4. **No browser shortcut conflicts:** Given the page is open in Firefox, when I type `9/3` then `Enter`, then the display shows `3` and the browser's quick-find bar does not open.
5. Given the display shows `123`, when I press `Backspace`, then the display shows `12` and the browser does not navigate away.
6. Given I typed `8+5`, when I press `Escape`, then the display shows `0`.
7. **No double presses:** Given I clicked the `7` button with the mouse, when I then press `Enter`, then only `=` happens and `7` is not entered a second time.
8. Given the starting state, when I type letters such as `a`, `x` or `k`, then the display still shows `0`.
9. Given the display shows `Cannot divide by zero`, when I type `4`, then the display shows `4` (same recovery rules as S-5).

---

## Nice to have

## S-10: See recent calculations (nice to have)

**As a** Keyboard user (R-2), **I want** to see my last few calculations listed, **so that** I can double-check the totals in an invoice without re-entering them.
**Serves:** J-5
**Status:** Not implemented

**Acceptance criteria**

1. Given the starting state, when I enter `8 + 5 =`, then a history list shows `8 + 5 = 13`.
2. Given the history shows 5 entries, when I complete another calculation, then the oldest entry is removed and the list still shows 5 entries, newest at the top.
3. Given I entered `7 ÷ 0 =`, then the history shows `7 ÷ 0 = Cannot divide by zero`.
4. Given the history has entries, when I reload the page, then the history is empty (it is not saved between visits).
