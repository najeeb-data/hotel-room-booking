// Minimal test runner using Node's built-in `assert` module, so the
// assessment stays dependency-free. Run with: node tests/booking.test.js
import assert from "node:assert/strict";
import { calculateNights } from "../js/utils/dateUtils.js";
import { calculateTotal } from "../js/services/bookingService.js";

let passed = 0;

function test(description, fn) {
  fn();
  passed += 1;
  console.log(`  ok - ${description}`);
}

console.log("calculateNights");
test("20 Sep -> 23 Sep = 3 nights", () => {
  assert.equal(calculateNights("2026-09-20", "2026-09-23"), 3);
});
test("20 Sep -> 21 Sep = 1 night", () => {
  assert.equal(calculateNights("2026-09-20", "2026-09-21"), 1);
});
test("20 Sep -> 20 Sep = invalid (null)", () => {
  assert.equal(calculateNights("2026-09-20", "2026-09-20"), null);
});
test("23 Sep -> 20 Sep = invalid (null)", () => {
  assert.equal(calculateNights("2026-09-23", "2026-09-20"), null);
});

console.log("calculateTotal");
test("3 nights x 3500 = 10500", () => {
  assert.equal(calculateTotal(3, 3500), 10500);
});
test("2 nights x 5800 = 11600", () => {
  assert.equal(calculateTotal(2, 5800), 11600);
});
test("5 nights x 4200 = 21000", () => {
  assert.equal(calculateTotal(5, 4200), 21000);
});
test("0 nights returns null (no misleading total)", () => {
  assert.equal(calculateTotal(0, 4200), null);
});

console.log(`\n${passed} passing`);
