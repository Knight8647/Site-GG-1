const lista = document.getElementById("carrinho-lista");
const totalEl = document.getElementById("total");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


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
    totalEl.textContent = "0";
    return;
  }

  carrinho.forEach((item, index) => {
    total += item.preco;

    const div = document.createElement("div");
    div.className = "carrinho-item";

    div.innerHTML = `
      <img src="${item.imagem}" class="img-carrinho">
      <div>
        <p>${item.nome}</p>
        <strong>R$ ${item.preco.toFixed(2)}</strong>
      </div>
      <button onclick="removerItem(${index})">✕</button>
    `;

    lista.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderCarrinho();
}

function irParaPagamentoPix() {
  window.location.href = "pix.html";
}

renderCarrinho();


