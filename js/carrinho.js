if (!localStorage.getItem("convidado")) {
  window.location.href = "/";
}
const lista = document.getElementById("carrinho-lista");
const totalEl = document.getElementById("total");



function renderCarrinho() {
  
  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("totalCarrinho");
  
  if (!lista || !totalEl) {
    return;
  }

  const carrinho = obterCarrinho();
  lista.innerHTML = "";
  let total = 0;

if (carrinho.length === 0) {
  lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
  totalEl.textContent = "0,00";
  return;
}


  carrinho.forEach((item, index) => {
    total += item.preco;

    const div = document.createElement("div");
    div.className = "carrinho-item";

div.innerHTML = `
  <input type="checkbox" class="item-check" data-index="${index}" checked>

  <img src="${item.imagem}" class="img-carrinho">

  <div class="info-carrinho">
    <p>${item.nome}</p>
    <strong>R$ ${item.preco.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}</strong>
  </div>

  <button class="remover" onclick="removerItem(${index})">✕</button>
`;


    lista.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

function removerItem(index) {
  const carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  renderCarrinho();
  atualizarBadgeCarrinho();
}


function irParaPagamentoPix() {
  window.location.href = "pix.html";
}

renderCarrinho();


function atualizarTotalSelecionado() {
  const carrinho = obterCarrinho();
  const checks = document.querySelectorAll(".item-check");

  let total = 0;
  let quantidade = 0;

  checks.forEach((check, i) => {
    if (check.checked) {
      total += carrinho[i].preco;
      quantidade++;
    }
  });

  const totalEl = document.getElementById("totalSelecionado");
  if (totalEl) {
    totalEl.textContent = total.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const btn = document.querySelector(".btn-prosseguir");
  if (btn) {
    btn.textContent = `Prosseguir (${quantidade})`;
  }
}

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("item-check")) {
    atualizarTotalSelecionado();
  }

  if (e.target.id === "checkTodos") {
    document.querySelectorAll(".item-check").forEach(chk => {
      chk.checked = e.target.checked;
    });
    atualizarTotalSelecionado();
  }
});

document.addEventListener("DOMContentLoaded", atualizarTotalSelecionado);
