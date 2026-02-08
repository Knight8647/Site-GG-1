
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
  <p class="price">R$ ${gift.price.toLocaleString("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}
  </p>
  <button
    class="btn btn-ver-item"
    data-id="${gift.id}"
  >
    Ver item
  </button>
`;

    giftList.appendChild(card);
  });
}
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-ver-item");
  if (!btn) return;

  const id = parseInt(btn.dataset.id, 10);
  abrirModalPresente(id);
});

function abrirModalPresente(id) {
  const comprasViaSite =
  JSON.parse(localStorage.getItem("comprasViaSite")) || [];

const btnSite = document.getElementById("modalBtnSite");
  const gift = gifts.find(g => g.id === id);
  if (!gift) return;

if (comprasViaSite.includes(gift.name)) {
  btnSite.style.display = "none";
} else {
  btnSite.style.display = "block";
}


  document.getElementById("modalPresenteImg").src = gift.image;
  document.getElementById("modalPresenteNome").textContent = gift.name;
  document.getElementById("modalPresentePreco").textContent =
    `R$ ${gift.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

document.getElementById("modalBtnPix").onclick = () => {
  if (typeof adicionarAoCarrinho !== "function") {
    alert("Erro ao adicionar ao carrinho.");
    return;
  }

 adicionarAoCarrinho(
  gift.name,
  gift.price,
gift.image
);

atualizarBadgeCarrinho();

  fecharModalPresente();
  alert("Presente adicionado ao carrinho.");
};

  document.getElementById("modalBtnSite").onclick = () => {
      if (!usuarioLogado()) {
    abrirModalLogin();
    return;
      }
  
  const confirmar = confirm(
    "Você deseja confirmar que comprou este presente pelo site?"
  );
  if (confirmar) {
    salvarCompraViaSite(gift.name);

    // atualiza a lista de presentes
    renderGifts(categoriaAtiva);

    // opcional: feedback visual
    alert("Obrigado! Registramos sua compra");
  }

  // SEMPRE redireciona para o site
  window.open(gift.link, "_blank");
};

  document.getElementById("modalPresente").classList.add("active");
}

function fecharModalPresente() {
  document.getElementById("modalPresente").classList.remove("active");
}
document.getElementById("modalPresente").addEventListener("click", (e) => {
  if (e.target.id === "modalPresente") {
    fecharModalPresente();
  }
});
