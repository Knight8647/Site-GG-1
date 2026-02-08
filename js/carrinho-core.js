const CART_KEY = "cartItems";

function obterItensSelecionados() {
  return obterCarrinho().filter(item => item.selected);
}

function obterCarrinho() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
}

function adicionarAoCarrinho(nome, preco, imagem) {
  const carrinho = obterCarrinho();


  carrinho.push({
    id: Date.now(),
    nome: nome,
    preco: preco,
    imagem: imagem, //  ESSENCIAL
    selected: true
  });

  salvarCarrinho(carrinho);
  atualizarBadgeCarrinho(); //  ESSENCIAL
}


function removerDoCarrinho(id) {
  const carrinho = obterCarrinho().filter(item => item.id !== id);
  salvarCarrinho(carrinho);
}
function atualizarBadgeCarrinho() {
  const badge = document.querySelector("#badgeCarrinho");
  if (!badge) return;

  const carrinho = obterCarrinho();
  badge.textContent = carrinho.length;

  badge.style.display = carrinho.length > 0 ? "inline-flex" : "none";
}
document.addEventListener("DOMContentLoaded", atualizarBadgeCarrinho);
