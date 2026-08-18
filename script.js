(() => {
  const DEFAULT_ROW_COUNT = 8;

  const itemsBody = document.getElementById('itemsBody');
  const grandTotalEl = document.getElementById('grandTotal');
  const dateInput = document.querySelector('.idate');
  const weekdayEl = document.querySelector('.weekday');
  const dateDisplayEl = document.querySelector('.date-display');

  function formatNumber(n) {
    if (!isFinite(n) || n === 0) return '';
    return n.toLocaleString('id-ID');
  }

  function buildRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="num row-no"></td>
      <td><input type="text" class="field item-nama"></td>
      <td class="num"><input type="number" class="field item-qty" min="0" step="1"></td>
      <td><input type="text" class="field item-unit"></td>
      <td class="money"><input type="number" class="field item-harga" min="0" step="1"></td>
      <td class="money item-jumlah"></td>
      <td class="no-print"><button type="button" class="remove-row-btn" title="Hapus baris">&times;</button></td>
    `;
    return tr;
  }

  function renumberRows() {
    const rows = itemsBody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      row.querySelector('.row-no').textContent = i + 1;
    });
  }

  function recalcRow(row) {
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const harga = parseFloat(row.querySelector('.item-harga').value) || 0;
    const jumlah = qty * harga;
    row.querySelector('.item-jumlah').textContent = formatNumber(jumlah);
    row.dataset.jumlah = jumlah;
    recalcTotal();
  }

  function recalcTotal() {
    const rows = itemsBody.querySelectorAll('tr');
    let total = 0;
    rows.forEach(row => { total += parseFloat(row.dataset.jumlah) || 0; });
    grandTotalEl.textContent = total.toLocaleString('id-ID');
  }

  function addRow() {
    const tr = buildRow();
    itemsBody.appendChild(tr);
    wireRow(tr);
    renumberRows();
  }

  function wireRow(tr) {
    tr.querySelector('.item-qty').addEventListener('input', () => recalcRow(tr));
    tr.querySelector('.item-harga').addEventListener('input', () => recalcRow(tr));
    tr.querySelector('.remove-row-btn').addEventListener('click', () => {
      tr.remove();
      renumberRows();
      recalcTotal();
    });
  }

  function updateWeekday() {
    if (!dateInput.value) { weekdayEl.textContent = ''; return; }
    const [y, m, d] = dateInput.value.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const day = dt.getDate();
    const month = dt.toLocaleDateString('en-US', { month: 'long' });
    const year = dt.getFullYear();
    const weekday = dt.toLocaleDateString('en-US', { weekday: 'short' });
    dateDisplayEl.textContent = `${day} ${month} ${year}`;
    weekdayEl.textContent = `(${weekday})`;
  }

  function init() {
    // default date = today
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    dateInput.value = iso;
    updateWeekday();
    dateInput.addEventListener('input', updateWeekday);

    for (let i = 0; i < DEFAULT_ROW_COUNT; i++) addRow();

    document.getElementById('addRowBtn').addEventListener('click', addRow);

    document.getElementById('printBtn').addEventListener('click', () => window.print());

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (!confirm('Kosongkan semua isian nota ini?')) return;
      document.querySelectorAll('input.field, textarea.letterhead-input').forEach(el => {
        el.value = '';
      });
      itemsBody.innerHTML = '';
      for (let i = 0; i < DEFAULT_ROW_COUNT; i++) addRow();
      dateInput.value = iso;
      updateWeekday();
      recalcTotal();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
