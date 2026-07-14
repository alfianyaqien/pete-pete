function splitProportional(total, weights) {
  const n = weights.length;
  if (n === 0) return [];
  const sum = weights.reduce((a, b) => a + b, 0);
  const w = sum === 0 ? weights.map(() => 1) : weights;
  const wSum = sum === 0 ? n : sum;
  const exact = w.map((x) => total * x / wSum);
  const floored = exact.map(Math.floor);
  let remainder = total - floored.reduce((a, b) => a + b, 0);
  const order = exact.map((x, i) => ({ i, frac: x - Math.floor(x) })).sort((a, b) => b.frac - a.frac);
  const out = floored.slice();
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    out[order[k].i]++;
  }
  return out;
}
function itemsSubtotal(entry) {
  return entry.items.reduce((a, it) => a + it.qty * it.priceEach, 0);
}
function sharedOrderTotal(entry) {
  const sub = itemsSubtotal(entry);
  const tax = Math.round(sub * entry.fees.taxPercent / 100);
  return sub + tax + entry.fees.service + entry.fees.other - entry.discount;
}
function allocateEntry(entry) {
  const shares = {};
  const payments = {};
  const add = (rec, id, amt) => {
    var _a;
    rec[id] = ((_a = rec[id]) != null ? _a : 0) + amt;
  };
  if (entry.type === "simple") {
    for (const s of entry.sharers) add(shares, s.participantId, s.share);
    for (const p of entry.payers) add(payments, p.participantId, p.amount);
    const total2 = entry.payers.reduce((a, p) => a + p.amount, 0);
    return { shares, payments, total: total2 };
  }
  const sub = itemsSubtotal(entry);
  const total = sharedOrderTotal(entry);
  const perPersonItems = {};
  for (const item of entry.items) {
    const cost = item.qty * item.priceEach;
    const parts = splitProportional(cost, item.orderedBy.map(() => 1));
    item.orderedBy.forEach((id, i) => {
      add(perPersonItems, id, parts[i]);
      add(shares, id, parts[i]);
    });
  }
  const feesNet = total - sub;
  if (feesNet !== 0) {
    const ids = Object.keys(perPersonItems);
    const feeParts = splitProportional(
      Math.abs(feesNet),
      ids.map((id) => perPersonItems[id])
    );
    ids.forEach((id, i) => add(shares, id, feesNet < 0 ? -feeParts[i] : feeParts[i]));
  }
  add(payments, entry.payerId, total);
  return { shares, payments, total };
}
function computeBalances(bill) {
  var _a, _b;
  const spent = {};
  const paid = {};
  for (const p of bill.participants) {
    spent[p.id] = 0;
    paid[p.id] = 0;
  }
  for (const entry of bill.entries) {
    const { shares, payments } = allocateEntry(entry);
    for (const [id, amt] of Object.entries(shares)) spent[id] = ((_a = spent[id]) != null ? _a : 0) + amt;
    for (const [id, amt] of Object.entries(payments)) paid[id] = ((_b = paid[id]) != null ? _b : 0) + amt;
  }
  return bill.participants.map((p) => {
    var _a2, _b2, _c, _d;
    return {
      participantId: p.id,
      spent: (_a2 = spent[p.id]) != null ? _a2 : 0,
      paid: (_b2 = paid[p.id]) != null ? _b2 : 0,
      balance: ((_c = paid[p.id]) != null ? _c : 0) - ((_d = spent[p.id]) != null ? _d : 0)
    };
  });
}
function settle(balances) {
  const creditors = balances.filter((b) => b.balance > 0).map((b) => ({ id: b.participantId, amt: b.balance }));
  const debtors = balances.filter((b) => b.balance < 0).map((b) => ({ id: b.participantId, amt: -b.balance }));
  creditors.sort((a, b) => b.amt - a.amt);
  debtors.sort((a, b) => b.amt - a.amt);
  const transfers = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci];
    const d = debtors[di];
    const amount = Math.min(c.amt, d.amt);
    if (amount > 0) transfers.push({ from: d.id, to: c.id, amount });
    c.amt -= amount;
    d.amt -= amount;
    if (c.amt === 0) ci++;
    if (d.amt === 0) di++;
  }
  return transfers;
}
function settleBill(bill) {
  const balances = computeBalances(bill);
  return { balances, transfers: settle(balances) };
}

export { settleBill as a, sharedOrderTotal as b, computeBalances as c, splitProportional as s };
//# sourceMappingURL=settle.mjs.map
