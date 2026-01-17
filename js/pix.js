const params = new URLSearchParams(window.location.search);
const giftId = parseInt(params.get("id"));

const gift = gifts.find(g => g.id === giftId);

const container = document.getElementById("pix-content");

if (!gift) {
  container.innerHTML = "<p>Presente não encontrado.</p>";
} else {
  container.innerHTML = `
    <h1>${gift.name}</h1>
    <p class="price">R$ ${gift.price.toFixed(2)}</p>

    <textarea id="pixCode" readonly>${gift.pixCode}</textarea>

    <button class="btn" onclick="copyPix()">Copiar código Pix</button>
    <p class="thanks">Obrigado por fazer parte da nossa história!</p>
  `;
}

function copyPix() {
  const textarea = document.getElementById("pixCode");
  textarea.select();
  document.execCommand("copy");
  alert("Código Pix copiado!");
}
