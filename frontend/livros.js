/*
  livros.js
  ---------
  Fala com o backend (backend/teste.php) pra listar e cadastrar
  livros. O caminho "../backend/teste.php" assume que as pastas
  frontend/ e backend/ estão lado a lado, como no seu projeto.
*/

const API_URL = "../backend/teste.php";

// Uma cor de lombada por gênero, só pro card ficar identificável
// de longe. Gênero que não está no mapa cai na cor "outro".
const COR_GENERO = {
  "Ficção": "#6b4226",
  "Clássico": "#2f4a3f",
  "Tecnologia": "#8a5a2b",
  "Poesia": "#4a2f4a",
  "Fantasia": "#1f3a52",
  "História": "#6b3a3a",
  "outro": "#4a4a4a"
};

// Busca a lista de livros no backend
async function carregarLivros() {
  const resposta = await fetch(API_URL);
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os livros.");
  }
  return resposta.json();
}

// Envia um livro novo pro backend salvar no banco
async function adicionarLivro(livro) {
  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(livro)
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || "Não foi possível salvar o livro.");
  }

  return resposta.json();
}

// Filtra uma lista já carregada — a busca acontece no navegador,
// não precisa ir no backend de novo a cada letra digitada.
function buscarLivros(lista, termo) {
  if (!termo) return lista;

  const alvo = termo.trim().toLowerCase();
  return lista.filter(livro =>
    livro.titulo.toLowerCase().includes(alvo) ||
    livro.autor.toLowerCase().includes(alvo)
  );
}

// Monta o HTML de um card de livro
function criarCardLivro(livro) {
  const card = document.createElement("article");
  card.className = "book-card" + (livro.estoque === 0 ? " book-card--out" : "");

  const cor = COR_GENERO[livro.genero] || COR_GENERO.outro;
  const precoFormatado = Number(livro.preco).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const textoEstoque = livro.estoque === 0 ? "esgotado" : `${livro.estoque} em estoque`;

  card.innerHTML = `
    <div class="book-spine" style="--spine: ${cor};">
      <span class="spine-label">${livro.genero}</span>
    </div>
    <div class="book-info">
      <h3>${livro.titulo}</h3>
      <p class="book-author">${livro.autor}</p>
      <div class="book-meta">
        <span class="book-price">R$ ${precoFormatado}</span>
        <span class="book-stock${livro.estoque === 0 ? " book-stock--zero" : ""}">${textoEstoque}</span>
      </div>
    </div>
  `;

  return card;
}

// Desenha a lista inteira de livros dentro do #book-grid
function renderizarLivros(lista) {
  const grid = document.getElementById("book-grid");
  const mensagemVazia = document.getElementById("empty-msg");
  if (!grid) return;

  grid.innerHTML = "";

  if (lista.length === 0) {
    if (mensagemVazia) {
      mensagemVazia.textContent = "Nenhum livro encontrado.";
      mensagemVazia.hidden = false;
    }
    return;
  }

  if (mensagemVazia) mensagemVazia.hidden = true;
  lista.forEach(livro => grid.appendChild(criarCardLivro(livro)));
}

function atualizarContagem(lista) {
  const contador = document.getElementById("hero-count");
  if (!contador) return;
  const total = lista.length;
  contador.textContent = total === 1 ? "acervo de 1 título" : `acervo de ${total} títulos`;
}