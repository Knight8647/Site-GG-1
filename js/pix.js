// === CARRINHO ===
function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// ⬇⬇⬇ ISSO É O MAIS IMPORTANTE ⬇⬇⬇
window.adicionarAoCarrinho = function (nome, preco, imagem) {
  const carrinho = obterCarrinho();

  carrinho.push({
    nome,
    preco,
    imagem: "/" + imagem,
  });

  salvarCarrinho(carrinho);
  console.log("Carrinho:", carrinho);
  alert("Presente adicionado ao carrinho!");
};

// === RENDER CARRINHO ===
function renderCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("totalCarrinho");
  if (!lista || !totalEl) return;

  const carrinho = obterCarrinho();
  let total = 0;

  lista.innerHTML = "";

  carrinho.forEach((item, index) => {
    total += item.preco;

    const div = document.createElement("div");
    div.className = "item-carrinho";

   div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="img-carrinho">

      <div class="info-carrinho">
        <p class="nome">${item.nome}</p>
        <p class="preco">R$ ${item.preco.toFixed(2)}</p>
      </div>

      <button class="remover" onclick="removerItem(${index})">✕</button>
    `;

    lista.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

window.removerItem = function (index) {
  const carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  renderCarrinho();
};

renderCarrinho();
