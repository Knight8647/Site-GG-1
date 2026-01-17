
const giftList = document.getElementById("gift-list");

function renderGifts(category) {
  giftList.innerHTML = "";

  const filtered = gifts.filter(g => g.category === category);

  filtered.forEach(gift => {
    const card = document.createElement("div");
    card.className = "gift-card";

    card.innerHTML = `
      <img src="${gift.image}" alt="${gift.name}">
      <h3>${gift.name}</h3>
      <p class="price">R$ ${gift.price.toFixed(2)}</p>

      <div class="actions">
        <a href="pix.html?id=${gift.id}" target="_blank" class="btn">
          Adicionar ao Carrinho (Doação em Dinheiro)
        </a>
        <a href="${gift.link}" target="_blank" class="btn outline">
          Comprar no site
        </a>
      </div>
    `;

    giftList.appendChild(card);
  });
}
