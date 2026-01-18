// 1️⃣ Importar cliente Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.32.1/dist/supabase.min.js'

// 2️⃣ Configurar Supabase
const supabaseUrl = 'https://dswpuihwbauodryjteae.supabase.co';
const supabaseKey = 'sb_publishable_Vw21DCri973G1wca9xbHPQ_bTf1dLDI';
const supabase = createClient(supabaseUrl, supabaseKey);

// 3️⃣ Elementos HTML
const loginForm = document.getElementById("login-form");
const loginContainer = document.getElementById("login-container");
const listaPresentes = document.getElementById("lista-presentes");

// 4️⃣ Login simples
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if(nome && email){
    localStorage.setItem("userNome", nome);
    localStorage.setItem("userEmail", email);

    loginContainer.style.display = "none";
    listaPresentes.style.display = "block";

    carregarPresentes();
  }
});

// 5️⃣ Carregar presentes do Supabase
async function carregarPresentes(){
  const container = document.getElementById("presentes-container");
  container.innerHTML = "";

  const { data, error } = await supabase
    .from('presentes')
    .select('*');

  if(error){
    console.error(error);
    container.innerHTML = "<p>Erro ao carregar produtos</p>";
    return;
  }

  data.forEach(presente => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${presente.nome}</h3>
      <p>R$ ${presente.preco}</p>
      <button onclick="adicionarCarrinho(${presente.id}, '${presente.nome}', ${presente.preco})">
        Adicionar
      </button>
    `;
    container.appendChild(div);
  });
}

// 6️⃣ Carrinho local
window.adicionarCarrinho = (id, nome, preco) => {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push({ id, nome, preco });
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert(`${nome} adicionado ao carrinho!`);
};

// 7️⃣ Finalizar compra e salvar no Supabase
window.finalizarCompra = async () => {
  const nome = localStorage.getItem("userNome");
  const email = localStorage.getItem("userEmail");
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if(carrinho.length === 0){
    alert("Seu carrinho está vazio!");
    return;
  }

  const { data, error } = await supabase
    .from('compras')
    .insert([
      { nome, email, itens: carrinho }
    ]);

  if(error){
    console.error(error);
    alert("Erro ao registrar compra");
    return;
  }

  alert("Compra registrada com sucesso!");
  localStorage.removeItem("carrinho");
};
