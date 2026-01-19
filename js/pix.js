function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// === ADICIONAR AO CARRINHO ===
window.adicionarAoCarrinho = function (nome, preco, imagem) {
  const carrinho = obterCarrinho();

  carrinho.push({
    nome,
    preco,
    imagem
  });

  salvarCarrinho(carrinho);
  alert("Presente adicionado ao carrinho!");
};

// === RENDER CARRINHO ===
function renderCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("totalCarrinho");

  if (!lista || !totalEl) return;

  const carrinho = obterCarrinho();
  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;

    const div = document.createElement("div");
    div.className = "item-carrinho";

    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="img-carrinho">

      <div class="info-carrinho">
        <p>${item.nome}</p>
        <strong>R$ ${item.preco.toFixed(2)}</strong>
      </div>

      <button onclick="removerItem(${index})">✕</button>
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
// === FINALIZAR COMPRA ===
function renderResumoPix() {
  const resumo = document.getElementById("resumoPix");
  if (!resumo) return;

  const carrinho = obterCarrinho();
  let total = 0;

  resumo.innerHTML = "<h2>Resumo do presente</h2>";

  carrinho.forEach(item => {
    total += item.preco;

    resumo.innerHTML += `
    <p>
     <strong>${item.nome}</strong><br>
    R$ ${item.preco.toFixed(2)}
  </p>
`;

  });

  resumo.innerHTML += `
    <hr>
    <h3>Total: R$ ${total.toFixed(2)}</h3>
  `;
}

renderResumoPix();
function confirmarPagamento() {
  alert("Obrigado pelo presente!");
  localStorage.removeItem("carrinho");
  window.location.href = "index.html";
}
function copiarPix() {
  const chave = document.getElementById("pixKey").innerText;
  const btn = document.querySelector(".btn-copy");

  navigator.clipboard.writeText(chave).then(() => {
    const textoOriginal = btn.innerText;
    btn.innerText = "Copiado ✓";

    setTimeout(() => {
      btn.innerText = textoOriginal;
    }, 2000);
  });
}

function abrirModal() {
  const nome = obterNomeConvidado();

  if (!nome.trim()) {
    alert("Por favor, informe seu nome antes de finalizar o presente.");
    return;
  }
  document.getElementById("confirmModal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("confirmModal").style.display = "none";
}

function finalizarPagamento() {
  const mensagem = document.getElementById("mensagemNoivos")?.value || "";

  localStorage.setItem("mensagemNoivos", mensagem);
  localStorage.removeItem("carrinho");

  window.location.href = "index.html";
}
function finalizarPagamento() {
  const carrinho = obterCarrinho();
  const dados = JSON.parse(localStorage.getItem("presentesDados")) || [];

  carrinho.forEach(item => {
    dados.push(item.nome);
  });

  localStorage.setItem("presentesDados", JSON.stringify(dados));
  localStorage.removeItem("carrinho");

  window.location.href = "index.html";
}
function obterNomeConvidado() {
  return localStorage.getItem("nomeConvidado") || "";
}
const inputNome = document.getElementById("nomeConvidado");

if (inputNome) {
  inputNome.value = obterNomeConvidado();

  inputNome.addEventListener("input", () => {
    localStorage.setItem("nomeConvidado", inputNome.value);
  });
}

