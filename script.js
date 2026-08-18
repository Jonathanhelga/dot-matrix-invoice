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

  function exportToExcel() {
    const letterhead = document.querySelector('.letterhead-input').value;
    const city = document.querySelector('.city').value;
    const dateStr = dateDisplayEl.textContent + ' ' + weekdayEl.textContent;
    const recipient = document.querySelector('.recipient').value;
    const attnInputs = document.querySelectorAll('.attn');
    const attn1 = attnInputs[0] ? attnInputs[0].value : '';
    const attn2 = attnInputs[1] ? attnInputs[1].value : '';
    const notano = document.querySelector('.notano').value;
    const sigInputs = document.querySelectorAll('.sig-input');
    const penerima = sigInputs[0] ? sigInputs[0].value : '';
    const pengirim = sigInputs[1] ? sigInputs[1].value : '';

    const rows = [];
    if (letterhead) rows.push([letterhead]);
    rows.push([`${city}, ${dateStr}`.trim()]);
    rows.push(['Kepada Yth,']);
    rows.push([recipient]);
    if (attn1) rows.push(['up', attn1]);
    if (attn2) rows.push(['', attn2]);
    rows.push(['NOTA NO:', notano]);
    rows.push([]);
    rows.push(['NO', 'NAMA BARANG', 'QTY', 'UNIT', 'HARGA (Rp)', 'JUMLAH']);

    const itemRows = itemsBody.querySelectorAll('tr');
    itemRows.forEach((row, i) => {
      const nama = row.querySelector('.item-nama').value;
      const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
      const unit = row.querySelector('.item-unit').value;
      const harga = parseFloat(row.querySelector('.item-harga').value) || 0;
      const jumlah = parseFloat(row.dataset.jumlah) || 0;
      rows.push([i + 1, nama, qty, unit, harga, jumlah]);
    });

    let total = 0;
    itemRows.forEach(row => { total += parseFloat(row.dataset.jumlah) || 0; });
    rows.push(['', '', '', '', 'JUMLAH', total]);

    rows.push([]);
    rows.push(['Tanda Terima,', '', '', 'Hormat Kami,']);
    rows.push([]);
    rows.push([]);
    rows.push([`( ${penerima} )`, '', '', `( ${pengirim} )`]);

    const sheet = XLSX.utils.aoa_to_sheet(rows);
    sheet['!cols'] = [
      { wch: 4 }, { wch: 28 }, { wch: 6 }, { wch: 8 }, { wch: 14 }, { wch: 14 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Nota');

    const fileLabel = notano ? notano.replace(/[^a-z0-9-_]+/gi, '_') : (dateInput.value || 'nota');
    XLSX.writeFile(workbook, `Nota-${fileLabel}.xlsx`);
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

    document.getElementById('excelBtn').addEventListener('click', exportToExcel);

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
