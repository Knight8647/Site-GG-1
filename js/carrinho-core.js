import { supabase } from "./supabase.js";

const CART_KEY = "cartItems";
function obterUsuarioId() {
  const convidado = JSON.parse(localStorage.getItem("convidado"));
  return convidado?.id || null;
}

function obterItensSelecionados() {
  return obterCarrinho().filter(item => item.selected);
}

function obterCarrinho() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
}

async function adicionarAoCarrinho(nome, preco, imagem, giftId) {
  const carrinho = obterCarrinho();
  const userId = obterUsuarioId();

  const item = {
    id: Date.now(),
    nome,
    preco,
    imagem,
    giftId,
    selected: true
  };

  carrinho.push(item);
  salvarCarrinho(carrinho);
  atualizarBadgeCarrinho();

  // 🔒 Salvar no Supabase
  if (userId && giftId) {
    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: userId,
        gift_id: giftId
      });

    if (error) console.error("Erro Supabase carrinho:", error);
  }
}


async function removerDoCarrinho(id, giftId) {
  const carrinho = obterCarrinho().filter(item => item.id !== id);
  salvarCarrinho(carrinho);
  atualizarBadgeCarrinho();

  const userId = obterUsuarioId();

  if (userId && giftId) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("gift_id", giftId);

    if (error) console.error("Erro ao remover do Supabase:", error);
  }
}


function atualizarBadgeCarrinho() {
  const badge = document.querySelector("#badgeCarrinho");
  if (!badge) return;

  const carrinho = obterCarrinho();
  badge.textContent = carrinho.length;

  badge.style.display = carrinho.length > 0 ? "inline-flex" : "none";
}
document.addEventListener("DOMContentLoaded", atualizarBadgeCarrinho);
// === EXPOR FUNÇÕES DO CARRINHO ===
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarBadgeCarrinho = atualizarBadgeCarrinho;
window.obterCarrinho = obterCarrinho;
window.obterItensSelecionados = obterItensSelecionados;
atualizarBadgeCarrinho();
