# App Roles

The calculator has no accounts or logins. Every person who opens `index.html` gets the same app. The two roles below describe two real ways people use it, so later documents can check that both are served.

## R-1: Pointer user (mouse or touch)

A **Pointer user** is someone doing a quick everyday sum, such as splitting a bill or checking a price, by clicking or tapping the on-screen buttons, often with one hand and without looking closely at each press. They can see the current number or result in a clear display, press the digit, decimal point, operator, equals, AC and backspace buttons, and get the result of their calculation. They must never be shown a wrong result, have the app crash or freeze, or lose what they typed without an obvious reason (for example, an error such as division by zero must show a clear message, and the next button press must start cleanly).

## R-2: Keyboard user

A **Keyboard user** is someone entering numbers quickly from a physical keyboard or numeric keypad, such as checking figures while working at a desk, who expects to type without reaching for the mouse. They can do everything a Pointer user can do using keys alone: digits, `.`, `+ - * /`, `Enter` or `=` for equals, `Backspace` to delete the last digit, and `Escape` to clear, and see each key press reflected in the display straight away. They must never have a key press ignored or applied twice, have a key trigger an unexpected browser action instead of the calculator action (for example `/` opening quick find in Firefox), or be shown a wrong result.

### How their needs differ

R-1 needs large, clearly labelled buttons that respond to a click or tap. R-2 needs every action to be reachable from the keyboard, with predictable key mappings and no conflicts with browser shortcuts. Both need the same correct results and the same clear error handling.
