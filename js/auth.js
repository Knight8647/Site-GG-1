function obterConvidado() {
  return JSON.parse(localStorage.getItem("convidado"));
}

function salvarConvidado() {
  const nome = document.getElementById("nomeConvidado").value.trim();
  const contato = document.getElementById("contatoConvidado").value.trim();

  if (!nome || !contato) {
    alert("Por favor, preencha seu nome e um contato.");
    return;
  }

  const convidado = { nome, contato };
  localStorage.setItem("convidado", JSON.stringify(convidado));

  fecharModalLogin();
  atualizarAreaLogin();
}

function abrirModalLogin() {
  document.getElementById("loginModal").classList.add("active");
}

function fecharModalLogin() {
  document.getElementById("loginModal").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarAreaLogin();
});


function acessarCarrinho() {
  const carrinho = obterCarrinho();

  if (!usuarioLogado()) {
    abrirModalLogin();
    return;
  }

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  window.location.href = "carrinho.html";
}

function acaoProtegida(acao) {
  if (!usuarioLogado()) {
    abrirModalLogin();
    return;
  }

  acao();
}

function comprarNoSite(link, nomePresente) {
  if (!usuarioLogado()) {
    abrirModalLogin();
    return;
  }

  const confirmar = confirm(
    "Você será redirecionado para comprar no site. Deseja continuar?"
  );

  if (!confirmar) return;

  // (futuro: marcar como comprado no site)
  window.open(link, "_blank");
}
function atualizarAreaLogin() {
  const area = document.getElementById("loginArea");
  if (!area) return;

  const convidado = obterConvidado();

  if (!convidado) {
    area.innerHTML = `
      <button class="btn btn-login" onclick="abrirModalLogin()">
        Fazer login
      </button>
    `;
    return;
  }

  area.innerHTML = `
    <div class="usuario-menu">
      <button class="btn btn-login" onclick="toggleMenuUsuario()">
        Olá, ${convidado.nome} 👋
      </button>

      <div class="dropdown-usuario" id="dropdownUsuario">
        <button onclick="trocarUsuario()">Trocar usuário</button>
        <button onclick="logoutUsuario()">Sair</button>
      </div>
    </div>
  `;
}
function toggleMenuUsuario() {
  const menu = document.getElementById("dropdownUsuario");
  if (!menu) return;

  menu.classList.toggle("active");
}

function trocarUsuario() {
  localStorage.removeItem("convidado");
  atualizarAreaLogin();
  abrirModalLogin();
}

function logoutUsuario() {
  localStorage.removeItem("convidado");
  atualizarAreaLogin();
}
document.addEventListener("click", (e) => {
  const menu = document.getElementById("dropdownUsuario");
  const area = document.querySelector(".usuario-menu");

  if (!menu || !area) return;

  if (!area.contains(e.target)) {
    menu.classList.remove("active");
  }
});



const btnCarrinho = document.getElementById("btnCarrinho");

if (btnCarrinho) {
  btnCarrinho.addEventListener("click", () => {
    if (!usuarioLogado()) {
      abrirModalLogin();
      return;
    }

    window.location.href = "carrinho.html";
  });
}
window.usuarioLogado = function () {
  return !!localStorage.getItem("convidado");
};