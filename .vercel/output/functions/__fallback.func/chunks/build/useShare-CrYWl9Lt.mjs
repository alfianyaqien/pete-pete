import { f as formatRupiah } from './useBill-NokyyOIb.mjs';

function billLink(billId) {
  return `/bill/${billId}`;
}
async function copyShareLink(billId) {
  try {
    await (void 0).clipboard.writeText(billLink(billId));
    return true;
  } catch {
    return false;
  }
}
function settlementRecap(bill, transfers) {
  const name = (id) => bill.participants.find((p) => p.id === id)?.name ?? "?";
  const lines = transfers.map((t) => `• ${name(t.from)} → ${name(t.to)}: ${formatRupiah(t.amount)}`);
  return [
    `🏔️ ${bill.title} — settle up`,
    `${transfers.length} transfer${transfers.length === 1 ? "" : "s"} clears everyone:`,
    ...lines,
    "",
    billLink(bill.id)
  ].join("\n");
}
function shareToWhatsApp(text) {
}

export { settlementRecap as a, copyShareLink as c, shareToWhatsApp as s };
//# sourceMappingURL=useShare-CrYWl9Lt.mjs.map
