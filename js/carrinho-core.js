function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarAoCarrinho(nome, preco, imagem) {
  if (!nome || !preco) {
    console.warn("Item inválido ignorado:", nome, preco);
    return;
  }

  const carrinho = obterCarrinho();

  carrinho.push({
    nome,
    preco: Number(preco),
    imagem
  });

  salvarCarrinho(carrinho);
}


function calcularTotalCarrinho() {
  const carrinho = obterCarrinho();
  return carrinho.reduce((t, i) => t + Number(i.preco || 0), 0);
}

