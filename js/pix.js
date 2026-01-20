
function normalizarTexto(texto, max = 25) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .substring(0, max);
}

function formatarCampo(id, valor) {
  const tamanho = valor.length.toString().padStart(2, "0");
  return id + tamanho + valor;
}
function calcularCRC16(payload) {
  const table = [
    0x0000,0x1021,0x2042,0x3063,0x4084,0x50A5,0x60C6,0x70E7,
    0x8108,0x9129,0xA14A,0xB16B,0xC18C,0xD1AD,0xE1CE,0xF1EF
  ];

  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    let c = payload.charCodeAt(i);
    crc ^= (c << 8);

    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000)
        ? ((crc << 1) ^ 0x1021)
        : (crc << 1);
      crc &= 0xFFFF;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}


function gerarPayloadPix({
  chavePix,
  nomeRecebedor,
  cidadeRecebedor,
  valor,
  descricao = "Lista de Casamento"
}) {
  const nome = normalizarTexto(nomeRecebedor, 25);
  const cidade = normalizarTexto(cidadeRecebedor, 15);
  const desc = normalizarTexto(descricao, 50);

  const payloadSemCRC =
    formatarCampo("00", "01") +
    formatarCampo("26",
      formatarCampo("00", "br.gov.bcb.pix") +
      formatarCampo("01", chavePix) +
      formatarCampo("02", desc)
    ) +
    formatarCampo("52", "0000") +
    formatarCampo("53", "986") +
    formatarCampo("54", valor.toFixed(2)) +
    formatarCampo("58", "BR") +
    formatarCampo("59", nome) +
    formatarCampo("60", cidade) +
    formatarCampo("62", formatarCampo("05", "0000")) +
    "6304";

  const crc = calcularCRC16(payloadSemCRC);
  return payloadSemCRC + crc;
}

function renderPix() {
  const total = calcularTotalCarrinho();

  const payload = gerarPayloadPix({
    chavePix: "+554598842356",
    nomeRecebedor: "Guilherme Augusto de Oliveira",
    cidadeRecebedor: "Cascavel",
    valor: total
  });

  // Mostrar payload para copiar
  const pixKeyEl = document.getElementById("pixKey");
  if (pixKeyEl) {
    pixKeyEl.textContent = payload;
  }

  // Gerar QR Code
  const qrContainer = document.getElementById("qrcode");
  if (!qrContainer) return;

  qrContainer.innerHTML = "";

  new QRCode(qrContainer, {
    text: payload,
    width: 260,
    height: 260,
    correctLevel: QRCode.CorrectLevel.H
  });
}

// Executa ao carregar a página
renderPix();


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

