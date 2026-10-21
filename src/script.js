"use strict";

// Basic calculator. Left-to-right evaluation, no operator precedence.
// See docs/user-stories.md for the rules this file implements.

var MAX_DIGITS = 12;
var MESSAGE_DIVIDE_BY_ZERO = "Cannot divide by zero";
var MESSAGE_OVERFLOW = "Overflow";

// mode is one of: "entering", "afterOperator", "result", "error"
var state = createStartingState();

function createStartingState() {
  return {
    current: "0",       // number being typed, as text
    stored: null,       // first operand or last result, full precision
    pendingOp: null,    // "+", "−", "×", "÷" or null
    mode: "entering",
    errorMessage: null
  };
}

// ---------- Calculation helpers ----------

function calculate(a, op, b) {
  switch (op) {
    case "+": return { value: a + b };
    case "−": return { value: a - b };
    case "×": return { value: a * b };
    case "÷":
      if (b === 0) {
        return { error: MESSAGE_DIVIDE_BY_ZERO };
      }
      return { value: a / b };
    default:
      return { value: b };
  }
}

function countDigits(text) {
  return text.replace(/[^0-9]/g, "").length;
}

// Rounds a number so it fits in MAX_DIGITS digits and removes trailing zeros.
function formatNumber(value) {
  if (value === 0) {
    return "0"; // also covers -0
  }
  var absolute = Math.abs(value);
  var wholeDigits = absolute < 1 ? 1 : String(Math.floor(absolute)).length;
  var decimals = Math.max(0, MAX_DIGITS - wholeDigits);
  var text = value.toFixed(decimals);
  if (text.indexOf(".") !== -1) {
    text = text.replace(/0+$/, "").replace(/\.$/, "");
  }
  if (text === "-0") {
    text = "0";
  }
  return text;
}

function isOverflow(value) {
  if (!isFinite(value) || Math.abs(value) >= 1e12) {
    return true;
  }
  var wholePart = formatNumber(value).replace("-", "").split(".")[0];
  return wholePart.length > MAX_DIGITS;
}

// Applies the pending operation to the stored value and the given number.
// Returns false (and shows an error) if the result can't be shown.
function applyPendingOperation(nextNumber) {
  var outcome = calculate(state.stored, state.pendingOp, nextNumber);
  if (outcome.error) {
    showError(outcome.error);
    return false;
  }
  if (isOverflow(outcome.value)) {
    showError(MESSAGE_OVERFLOW);
    return false;
  }
  state.stored = outcome.value;
  return true;
}

function showError(message) {
  state = createStartingState();
  state.mode = "error";
  state.errorMessage = message;
}

// ---------- Key handlers ----------

function inputDigit(digit) {
  if (state.mode === "error" || state.mode === "result") {
    state = createStartingState();
    state.current = digit;
    return;
  }
  if (state.mode === "afterOperator") {
    state.current = digit;
    state.mode = "entering";
    return;
  }
  if (state.current === "0") {
    state.current = digit;
    return;
  }
  if (countDigits(state.current) >= MAX_DIGITS) {
    return;
  }
  state.current += digit;
}

function inputDecimal() {
  if (state.mode === "error" || state.mode === "result") {
    state = createStartingState();
    state.current = "0.";
    return;
  }
  if (state.mode === "afterOperator") {
    state.current = "0.";
    state.mode = "entering";
    return;
  }
  if (state.current.indexOf(".") !== -1 || countDigits(state.current) >= MAX_DIGITS) {
    return;
  }
  state.current += ".";
}

function inputOperator(op) {
  if (state.mode === "error") {
    return;
  }
  if (state.mode === "entering") {
    var typedNumber = parseFloat(state.current);
    if (state.pendingOp !== null) {
      if (!applyPendingOperation(typedNumber)) {
        return;
      }
    } else {
      state.stored = typedNumber;
    }
  }
  // "afterOperator": the new operator replaces the old one.
  // "result": continue from the stored result.
  state.pendingOp = op;
  state.mode = "afterOperator";
}

function inputEquals() {
  if (state.mode === "error" || state.mode === "result") {
    return;
  }
  if (state.mode === "entering") {
    var typedNumber = parseFloat(state.current);
    if (state.pendingOp !== null) {
      if (!applyPendingOperation(typedNumber)) {
        return;
      }
    } else {
      state.stored = typedNumber;
    }
  }
  // "afterOperator": the unfinished operator is dropped.
  state.pendingOp = null;
  state.mode = "result";
}

function inputBackspace() {
  if (state.mode === "error") {
    state = createStartingState();
    return;
  }
  if (state.mode !== "entering") {
    return; // results and stored operands are not edited digit by digit
  }
  state.current = state.current.slice(0, -1);
  if (state.current === "") {
    state.current = "0";
  }
}

function clearAll() {
  state = createStartingState();
}

function handleAction(action, value) {
  switch (action) {
    case "digit": inputDigit(value); break;
    case "decimal": inputDecimal(); break;
    case "operator": inputOperator(value); break;
    case "equals": inputEquals(); break;
    case "backspace": inputBackspace(); break;
    case "clear": clearAll(); break;
  }
  render();
}

// ---------- Display ----------

function getDisplayText() {
  if (state.mode === "error") {
    return state.errorMessage;
  }
  if (state.mode === "entering") {
    return state.current;
  }
  return formatNumber(state.stored);
}

function render() {
  if (typeof document === "undefined") {
    return;
  }
  var display = document.getElementById("display");
  display.textContent = getDisplayText();
  display.classList.toggle("is-message", state.mode === "error");
}

// ---------- Keyboard ----------

// Numpad keys are matched by their physical position (event.code), so they
// work whether NumLock is on or off, and whatever the decimal key prints.
var NUMPAD_ACTIONS = {
  NumpadDecimal: { action: "decimal" },
  NumpadAdd: { action: "operator", value: "+" },
  NumpadSubtract: { action: "operator", value: "−" },
  NumpadMultiply: { action: "operator", value: "×" },
  NumpadDivide: { action: "operator", value: "÷" },
  NumpadEnter: { action: "equals" }
};

function keyToAction(key, code) {
  var numpadDigit = /^Numpad([0-9])$/.exec(code || "");
  if (numpadDigit) return { action: "digit", value: numpadDigit[1] };
  if (NUMPAD_ACTIONS[code]) return NUMPAD_ACTIONS[code];
  if (/^[0-9]$/.test(key)) return { action: "digit", value: key };
  switch (key) {
    case ".": return { action: "decimal" };
    case "+": return { action: "operator", value: "+" };
    case "-": return { action: "operator", value: "−" };
    case "*": return { action: "operator", value: "×" };
    case "/": return { action: "operator", value: "÷" };
    case "Enter":
    case "=": return { action: "equals" };
    case "Backspace": return { action: "backspace" };
    case "Escape": return { action: "clear" };
    default: return null;
  }
}

function handleKeydown(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return; // leave browser shortcuts such as copy alone
  }
  var mapped = keyToAction(event.key, event.code);
  if (mapped === null) {
    return;
  }
  // Stops Firefox quick-find on "/", Backspace navigation, and Enter
  // also clicking a focused button (which would press it twice).
  event.preventDefault();
  handleAction(mapped.action, mapped.value);
}

// ---------- Setup ----------

function setUp() {
  var buttons = document.querySelectorAll(".key");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      var button = event.currentTarget;
      handleAction(button.getAttribute("data-action"), button.getAttribute("data-value"));
    });
  }
  document.addEventListener("keydown", handleKeydown);
  render();
}

if (typeof document !== "undefined") {
  setUp();
}
