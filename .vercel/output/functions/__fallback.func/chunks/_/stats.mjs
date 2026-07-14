import { c as computeBalances, b as sharedOrderTotal } from './settle.mjs';

function entryTotalOf(entry) {
  return entry.type === "simple" ? entry.amount : sharedOrderTotal(entry);
}
function billTotal(bill) {
  return bill.entries.reduce((sum, e) => sum + entryTotalOf(e), 0);
}
function billStats(bill) {
  const balances = computeBalances(bill);
  return {
    total: billTotal(bill),
    souls: bill.participants.length,
    entries: bill.entries.length,
    settled: balances.filter((b) => b.balance === 0).length,
    balances,
    fronted: balances.reduce((s, b) => s + b.paid, 0)
  };
}
function seasonStats(bills) {
  let total = 0;
  let cleared = 0;
  let souls = 0;
  let open = 0;
  let lunas = 0;
  for (const b of bills) {
    const t = billTotal(b);
    total += t;
    souls += b.participants.length;
    if (b.lunas) {
      cleared += t;
      lunas++;
    } else {
      open++;
    }
  }
  return { total, cleared, unsettled: total - cleared, souls, open, lunas };
}

export { billStats as b, entryTotalOf as e, seasonStats as s };
//# sourceMappingURL=stats.mjs.map
