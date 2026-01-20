// pix-protect.js
(function () {
  function obterCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
  }

  const carrinho = obterCarrinho();

  if (!Array.isArray(carrinho) || carrinho.length === 0) {
    alert("Seu carrinho está vazio. Escolha um presente antes de continuar.");
    window.location.href = "index.html";
  }
})();
