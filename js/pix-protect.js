// pix-protect.js
document.addEventListener("DOMContentLoaded", () => {
  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    alert("Você não pode pagar sem itens no carrinho.");
    window.location.href = "index.html";
  }
});

