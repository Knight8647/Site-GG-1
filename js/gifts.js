
const giftList = document.getElementById("gift-list");

function obterComprasViaSite() {
  return JSON.parse(localStorage.getItem("comprasViaSite")) || [];
}

function salvarCompraViaSite(nomePresente) {
  const compras = obterComprasViaSite();

  if (!compras.includes(nomePresente)) {
    compras.push(nomePresente);
    localStorage.setItem("comprasViaSite", JSON.stringify(compras));
  }
}

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-site");
  if (!btn) return;

  // BLOQUEIA SE NÃO ESTIVER LOGADO
  if (!usuarioLogado()) {
    e.preventDefault();
    abrirModalLogin();
    return;
  }

  e.preventDefault();

  const nomePresente = btn.dataset.nome;
  const link = btn.dataset.link;

  const confirmar = confirm("Deseja confirmar sua compra via site?");

  if (confirmar) {
    salvarCompraViaSite(nomePresente);
    renderGifts(categoriaAtiva); // some com o botão
  }

  // SEMPRE abre o site
  window.open(link, "_blank");
});

function renderGifts(category) {
  if (!giftList) return;

  giftList.innerHTML = "";

  const filtered = gifts.filter(g => g.category === category);
  const dados = JSON.parse(localStorage.getItem("presentesDados")) || [];

  filtered.forEach(gift => {
    const jaDado = dados.includes(gift.name);
    const comprasViaSite =
    JSON.parse(localStorage.getItem("comprasViaSite")) || [];

    const compradoNoSite = comprasViaSite.includes(gift.name);
    const card = document.createElement("div");
    card.className = "gift-card";

    card.innerHTML = `
      <img src="${gift.image}" alt="${gift.name}">
      <h3>${gift.name}</h3>
      <p class="price">R$ ${gift.price.toFixed(2)}</p>

      <button
        class="btn btn-add"
        data-nome="${gift.name}"
        data-preco="${gift.price}"
        data-imagem="${gift.image}"
      >
        Doar por Pix
      </button>

      ${compradoNoSite ? "" : `
        <a
          href="${gift.link}"
          class="btn outline btn-site"
          data-nome="${gift.name}"
          data-link="${gift.link}"
        >
          Comprar no site
        </a>
      `}
      </div>
      
    `;
    giftList.appendChild(card);
  });
}
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  e.preventDefault();

  if (!usuarioLogado()) {
    abrirModalLogin();
    return;
  }

  adicionarAoCarrinho(
    btn.dataset.nome,
    btn.dataset.preco,
    btn.dataset.imagem
  );

  alert("Presente adicionado ao carrinho!");
});

