import assert from 'node:assert/strict';
import { test } from 'node:test';
import { discount, formatCents, shipping, subtotal, total } from '../cart.js';

const mug = { priceCents: 1800, quantity: 2 };

test('subtotal adds price times quantity', () => {
  assert.equal(subtotal([mug]), 3600);
});

test('shipping is free from the threshold and on an empty cart', () => {
  assert.equal(shipping(0), 0);
  assert.equal(shipping(4999), 500);
  assert.equal(shipping(5000), 0);
});

test('total includes shipping', () => {
  assert.equal(total([mug]), 4100);
});

test('formatCents shows dollars', () => {
  assert.equal(formatCents(4100), '$41.00');
});

test('SAVE10 takes 10% off the subtotal', () => {
  assert.equal(discount(3600, 'SAVE10'), 360);
  assert.equal(total([mug], 'SAVE10'), 3740);
});

test('an unknown code gives no discount', () => {
  assert.equal(discount(3600, 'NOPE'), 0);
});

test('names inherited from Object.prototype are not coupons', () => {
  for (const code of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
    assert.equal(discount(3600, code), 0, code);
    assert.equal(total([mug], code), 4100, code);
  }
});
