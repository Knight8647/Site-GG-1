import { supabase } from "./supabase.js";

function obterConvidado() {
  return JSON.parse(localStorage.getItem("convidado"));
}

async function salvarConvidado() {
  const nomeInput = document.getElementById("nomeConvidado");
  const telInput = document.getElementById("telefoneConvidado");
  const emailInput = document.getElementById("emailConvidado");

  const erroNome = document.getElementById("erroNome");
  const erroTel = document.getElementById("erroTelefone");
  const erroEmail = document.getElementById("erroEmail");

  [nomeInput, telInput, emailInput].forEach(i => i.classList.remove("invalido"));
  [erroNome, erroTel, erroEmail].forEach(e => e.textContent = "");

  const nome = nomeInput.value.trim();
  const telefone = telInput.value.replace(/\D/g, "");
  const email = emailInput.value.trim() || null;

  if (!nome) {
    erroNome.textContent = "Informe seu nome.";
    nomeInput.focus();
    return;
  }

  if (telefone.length < 10) {
    erroTel.textContent = "Informe um telefone válido.";
    telInput.focus();
    return;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erroEmail.textContent = "Email inválido.";
    emailInput.focus();
    return;
  }

  // 🔑 UPSERT no Supabase (telefone identifica o usuário)
  const { data, error } = await supabase
    .from("users")
    .upsert(
      { nome, telefone, email },
      { onConflict: "telefone" }
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    alert("Erro ao salvar usuário. Tente novamente.");
    return;
  }

  // salva cache local (continua compatível)
  localStorage.setItem("convidado", JSON.stringify({
    id: data.id,
    nome: data.nome,
    telefone: data.telefone,
    email: data.email
  }));

  fecharModalLogin();
  atualizarAreaLogin();
}

["nomeConvidado", "telefoneConvidado", "emailConvidado"].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;

  input.addEventListener("input", () => {
    input.classList.remove("invalido");
    const erro = document.getElementById(
      "erro" + id.replace("Convidado", "")
    );
    if (erro) erro.textContent = "";
  });
});

const telInput = document.getElementById("telefoneConvidado");

if (telInput) {
  telInput.addEventListener("input", () => {
    telInput.value = telInput.value.replace(/\D/g, "");
  });
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

  window.location.href = "/cart.html";
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

    window.location.href = "cart.html";
  });
}
window.usuarioLogado = function () {
  return !!localStorage.getItem("convidado");
    return !!user;
};
// === EXPOR FUNÇÕES PARA O HTML ===
window.abrirModalLogin = abrirModalLogin;
window.fecharModalLogin = fecharModalLogin;
window.salvarConvidado = salvarConvidado;
window.acessarCarrinho = acessarCarrinho;
window.comprarNoSite = comprarNoSite;
window.toggleMenuUsuario = toggleMenuUsuario;
window.trocarUsuario = trocarUsuario;
window.logoutUsuario = logoutUsuario;
