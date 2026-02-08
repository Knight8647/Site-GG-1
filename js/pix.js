function formatarBRL(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


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
        <strong>${formatarBRL(item.preco)}</strong>
      </div>

      <button onclick="removerItem(${index})">✕</button>
    `;

    lista.appendChild(div);
  });

  totalEl.textContent = formatarBRL(total);
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
    ${formatarBRL(item.preco)}

  </p>
`;

  });

  resumo.innerHTML += `
    <hr>
    <h3>Total: ${formatarBRL(total)}</h3>

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

  document.getElementById("confirmModal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("confirmModal").style.display = "none";
}

function finalizarPagamento() {
  const carrinho = obterCarrinho();
  const dados = JSON.parse(localStorage.getItem("presentesDados")) || [];
    const mensagem = document.getElementById("mensagemNoivos")?.value || "";

  localStorage.setItem("mensagemNoivos", mensagem);

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

document.addEventListener("DOMContentLoaded", () => {
  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    alert("Carrinho vazio.");
    window.location.href = "index.html";
    return;
  }

  const total = calcularTotalCarrinho();

});
