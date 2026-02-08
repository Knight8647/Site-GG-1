const cart = obterCarrinho();

let cartItems = obterCarrinho().map(item => ({
  nome: item.nome,
  preco: item.preco,
  imagem: item.imagem,
  selected: item.selected ?? true
}));

// salva já com selected
salvarCarrinho(cartItems);

// ===============================
// ELEMENTOS
// ===============================
const listEl = document.querySelector(".cart-list");
const footerTotalEl = document.querySelector(".cart-footer-total strong");
const summaryTotalEl = document.querySelector(".cart-summary-line strong");
const footerBtn = document.querySelector(".cart-footer .cart-btn-primary");
const summaryBtn = document.querySelector(".cart-summary .cart-btn-primary");

const selectAllCheckboxes = document.querySelectorAll(".select-all");

// ===============================
// HELPERS
// ===============================
function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// ===============================
// RENDER
// ===============================
function renderCart() {
  
  listEl.innerHTML = "";

  cartItems.forEach((item, index) => {
    const itemEl = document.createElement("div");
    const imagem = item.imagem.startsWith("http") 
  ? item.imagem 
  : item.imagem.startsWith("/") 
    ? item.imagem 
    : `../${item.imagem}`;
    itemEl.className = "cart-item";
    
    itemEl.innerHTML = `
      <input 
        type="checkbox" 
        class="item-checkbox"
        ${item.selected ? "checked" : ""} 
        data-index="${index}"
      >

    <img 
  src="${item.imagem || 'assets/default.png'}"
  alt="${item.nome}"
  class="cart-item-img"
>


      <div class="cart-item-info">
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-price">${formatBRL(item.preco)}</div>
      </div>

      <button class="cart-remove" data-index="${index}">🗑️</button>
    `;

    listEl.appendChild(itemEl);
  });

  bindItemEvents();
  updateTotals();
  syncSelectAll();
}

// ===============================
// EVENTOS DOS ITENS
// ===============================
function bindItemEvents() {
  // checkbox individual
  document.querySelectorAll(".item-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      const index = Number(cb.dataset.index);
      cartItems[index].selected = cb.checked;
      salvarCarrinho(cartItems);
      updateTotals();
      syncSelectAll();
    });
  });

  // remover item
  document.querySelectorAll(".cart-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      cartItems.splice(index, 1);
      salvarCarrinho(cartItems);
      renderCart();
    });
  });
}

// ===============================
// TOTAL / BOTÕES
// ===============================
function updateTotals() {
  const selectedItems = cartItems.filter(i => i.selected);
  const total = selectedItems.reduce((sum, i) => sum + i.preco, 0);
  const count = selectedItems.length;

  const formatted = formatBRL(total);

  if (footerTotalEl) footerTotalEl.textContent = formatted;
  if (summaryTotalEl) summaryTotalEl.textContent = formatted;

  if (footerBtn) {
    footerBtn.textContent = `Finalizar (${count})`;
    footerBtn.disabled = count === 0;
    footerBtn.classList.toggle("disabled", count === 0);
  }

  if (summaryBtn) {
    summaryBtn.disabled = count === 0;
    summaryBtn.classList.toggle("disabled", count === 0);
  }
}

// ===============================
// SELECIONAR TODOS (mobile + desktop)
// ===============================
function syncSelectAll() {
  const allSelected =
    cartItems.length > 0 &&
    cartItems.every(item => item.selected);

  selectAllCheckboxes.forEach(cb => {
    cb.checked = allSelected;
  });
}

selectAllCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const checked = cb.checked;

    cartItems.forEach(item => {
      item.selected = checked;
    });

    salvarCarrinho(cartItems);
    renderCart();
  });
});

// ===============================
// FINALIZAR (PIX)
// ===============================
function finalizarCompra() {
  if (cartItems.filter(i => i.selected).length === 0) return;
  window.location.href = "pix.html";
}

if (footerBtn) footerBtn.addEventListener("click", finalizarCompra);
if (summaryBtn) summaryBtn.addEventListener("click", finalizarCompra);

// ===============================
// INIT
// ===============================
renderCart();

