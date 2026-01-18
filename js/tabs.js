const tabsContainer = document.getElementById("tabsContainer");
const prevBtn = document.getElementById("prevTab");
const nextBtn = document.getElementById("nextTab");

let categoriaAtiva = categorias[0].id;
const visiveis = 5;
let posicao = categorias.length; // 👈 começa no meio

function criarTabs() {
  const duplicadas = [...categorias, ...categorias, ...categorias];

  duplicadas.forEach(cat => {
    const tab = document.createElement("button");
    tab.className = "tab";
    tab.textContent = cat.nome;
    tab.dataset.category = cat.id;

    tab.onclick = () => {
      document.querySelectorAll(".tab").forEach(t =>
        t.classList.remove("active")
      );
      tab.classList.add("active");
      categoriaAtiva = cat.id;
      renderGifts(cat.id);
    };

    tabsContainer.appendChild(tab);
  });

  mover(true);
}

function mover(reset = false) {
  const largura = tabsContainer.children[0].offsetWidth + 10;

  if (reset) {
    tabsContainer.style.transition = "none";
  }

  tabsContainer.style.transform = `translateX(-${posicao * largura}px)`;

  if (reset) {
    tabsContainer.offsetHeight; // força repaint
    tabsContainer.style.transition = "transform 0.45s ease";
  }

  if (posicao >= categorias.length * 2) {
    setTimeout(() => {
      posicao = categorias.length;
      mover(true);
    }, 460);
  }
  if (posicao <= categorias.length - visiveis) {
    setTimeout(() => {
      posicao = categorias.length * 2 - visiveis;
      mover(true);
    }, 460);
  }
}

nextTab.onclick = () => {
  posicao++;
  mover();
};

prevTab.onclick = () => {
  posicao--;
  mover();
};

criarTabs();
renderGifts(categoriaAtiva);
