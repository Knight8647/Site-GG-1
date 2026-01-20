function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

window.adicionarAoCarrinho = function (nome, preco, imagem) {
  const carrinho = obterCarrinho();

  carrinho.push({ nome, preco, imagem });

  salvarCarrinho(carrinho);
  alert("Presente adicionado ao carrinho!");
};
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  adicionarAoCarrinho(
    btn.dataset.nome,
    Number(btn.dataset.preco),
    btn.dataset.imagem
  );
});

// === TOTAL DO CARRINHO ===
window.calcularTotalCarrinho = function () {
  const carrinho = obterCarrinho();

  return carrinho.reduce((total, item) => {
    return total + Number(item.preco || 0);
  }, 0);
};
