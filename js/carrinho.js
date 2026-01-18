const lista = document.getElementById("lista-carrinho");
const totalEl = document.getElementById("total");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


function renderCarrinho() {
  lista.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalEl.innerText = "";
    return;
  }

  carrinho.forEach((item, index) => {
    total += item.preco;

    const div = document.createElement("div");
    div.className = "gift-card";

    div.innerHTML = `
      <h3>${item.nome}</h3>
      <p>R$ ${item.preco.toFixed(2)}</p>
      <button class="btn outline" onclick="removerItem(${index})">
        Remover
      </button>
    `;

    lista.appendChild(div);
  });

  totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;
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


