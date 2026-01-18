import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.32.1/dist/supabase.min.js'

// 1️⃣ Configuração do Supabase
const supabaseUrl = 'SUA_SUPABASE_URL';
const supabaseKey = 'SUA_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// 2️⃣ Lista com os 54 produtos
const produtos = [
  { nome: "Cafeteira", preco: 350, descricao: "Cafeteira elétrica" },
  { nome: "Conjunto de pratos", preco: 220, descricao: "Pratos de porcelana" },
  { nome: "Jogo de cama", preco: 180, descricao: "Casal, 4 peças" },
  { nome: "Aspirador de pó", preco: 450, descricao: "Aspirador potente" },
  { nome: "Meia de compressão", preco: 325, descricao: "Meia de compressão médica" },
  { nome: "Bomba tira-leite", preco: 900, descricao: "Bomba elétrica Dellamed" },
  { nome: "Faixa lombar", preco: 120, descricao: "Suporte lombar Hidrolight" },
  { nome: "Cinta abdominal", preco: 150, descricao: "Modeladora Hidrolight" },
  { nome: "Lenços para banho", preco: 50, descricao: "Lenços Cremer 20 unidades" },
  { nome: "Meia-calça gestante", preco: 180, descricao: "Sigvaris confortável" },
  // ... continue preenchendo até os 54 produtos
];

// 3️⃣ Função para importar todos
async function importarProdutos() {
  for(const p of produtos){
    const { data, error } = await supabase
      .from('presentes')
      .insert([p]);
    
    if(error){
      console.error("Erro ao adicionar:", p.nome, error);
    } else {
      console.log("Produto adicionado:", p.nome);
    }
  }
  console.log("Todos os produtos foram importados!");
}

// 4️⃣ Executar
importarProdutos();
