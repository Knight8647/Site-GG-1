import "./carrinho-core.js";
import { supabase } from "./supabase.js";
const itensSelecionados = obterItensSelecionados();
if (!itensSelecionados.length) {
  window.location.href = "/cart.html";
  throw new Error("Pix sem itens selecionados");
}

const PIX_CHAVE = "+5545988423562";
const PIX_NOME = "GUILHERME AUGUSTO DE OLIV";
const PIX_CIDADE = "SAO PAULO";

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

const carrinho = obterItensSelecionados();
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


function gerarPayloadPix(valor) {
  const valorFormatado = valor.toFixed(2);

  function campo(id, valor) {
    return id + String(valor.length).padStart(2, "0") + valor;
  }

  const payload =
    campo("00", "01") +
    campo("26",
      campo("00", "br.gov.bcb.pix") +
      campo("01", PIX_CHAVE)
    ) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("54", valorFormatado) +
    campo("58", "BR") +
    campo("59", PIX_NOME.substring(0, 25)) +
    campo("60", PIX_CIDADE.substring(0, 15)) +
    campo("62", campo("05", "CASAMENTO"));

  const crc = calcularCRC(payload + "6304");
  return payload + "6304" + crc;
}
function calcularCRC(str) {
  let crc = 0xFFFF;

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}


window.removerItem = function (index) {
  const carrinhoCompleto = obterCarrinho();
  const selecionados = obterItensSelecionados();

  const item = selecionados[index];
  if (!item) return;

  // desmarca o item no carrinho real
  carrinhoCompleto.forEach(i => {
    if (i.id === item.id) {
      i.selected = false;
    }
  });

  salvarCarrinho(carrinhoCompleto);

  renderCarrinho();
  renderResumoPix();
};




renderCarrinho();
// === FINALIZAR COMPRA ===
function renderResumoPix() {
  const resumo = document.getElementById("resumoPix");
  if (!resumo) return;

  const carrinho = obterItensSelecionados();
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
  const btnPix = document.querySelector(".btn-pix.mobile-fixed");
if (btnPix) {
  btnPix.textContent = `Já fiz o pagamento • ${formatarBRL(total)}`;
}
const payloadPix = gerarPayloadPix(total);

// texto copiável
document.getElementById("pixKey").innerText = payloadPix;

// QR Code
const qrContainer = document.getElementById("qrcode");
qrContainer.innerHTML = "";

if (window.QRCode) {
  new QRCode(qrContainer, {
    text: payloadPix,
    width: 220,
    height: 220
  });
} else {
  console.error("QRCode lib não carregada");
}


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
  document.body.style.overflow = "hidden";
  document.getElementById("confirmModal").style.display = "flex";
}

function fecharModal() {
  document.body.style.overflow = "";
  document.getElementById("confirmModal").style.display = "none";
}


async function finalizarPagamento() {

  const selecionados = obterItensSelecionados();

  const convidado =
    JSON.parse(localStorage.getItem("convidado"));

  if (!convidado?.id) {
    alert("Usuário não encontrado.");
    return;
  }

  if (!selecionados.length) {
    alert("Nenhum item selecionado.");
    return;
  }

  // =========================
  // mensagem
  // =========================

  const mensagem =
    document.getElementById("mensagemNoivos")?.value || "";

  // =========================
  // total
  // =========================

  const total = selecionados.reduce(
    (acc, item) => acc + item.preco,
    0
  );

  // =========================
  // cria pedido
  // =========================

  const { data: pedido, error: pedidoError } =
    await supabase
      .from("pix_orders")
      .insert({
        user_id: convidado.id,
        total,
        message: mensagem,
        status: "pending"
      })
      .select()
      .single();

  if (pedidoError) {
    console.error(pedidoError);
    alert("Erro ao criar pedido.");
    return;
  }

  // =========================
  // salva itens do pedido
  // =========================
console.log(selecionados);
  const itens = selecionados.map(item => ({
    order_id: pedido.id,
    gift_id: item.giftId,
    price: item.preco
  }));

  const { error: itensError } =
    await supabase
      .from("pix_order_items")
      .insert(itens);

  if (itensError) {
    console.error(itensError);
    alert("Erro ao salvar itens.");
    return;
  }

  // =========================
  // remove do carrinho local
  // =========================

  const carrinhoAtual = obterCarrinho();

  const restante = carrinhoAtual.filter(item =>
    !selecionados.some(sel => sel.id === item.id)
  );

  salvarCarrinho(restante);

  // =========================
  // remove do carrinho supabase
  // =========================

  for (const item of selecionados) {

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", convidado.id)
      .eq("gift_id", item.giftId);

  }

  // =========================
  // finalização
  // =========================

  fecharModal();

  alert("Pagamento registrado!");

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

window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.finalizarPagamento = finalizarPagamento;
window.copiarPix = copiarPix;