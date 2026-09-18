/*
  main.js
  -------
  Coisas gerais do site: marcar o link ativo no menu e,
  na página inicial, carregar (do backend) e ligar a busca de livros.
*/

// Deixa em destaque, no menu, o link da página em que você está
function marcarLinkAtivo() {
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(link => {
    const destino = link.getAttribute("href");
    if (destino === paginaAtual) {
      link.setAttribute("aria-current", "page");
    }
  });
}

// Só roda na index.html, onde existe #book-grid
async function iniciarCatalogo() {
  const grid = document.getElementById("book-grid");
  const mensagemVazia = document.getElementById("empty-msg");
  if (!grid) return;

  let livros;
  try {
    livros = await carregarLivros();
  } catch (erro) {
    grid.innerHTML = "";
    if (mensagemVazia) {
      mensagemVazia.textContent = "Não foi possível carregar os livros. O backend (teste.php) está rodando e o banco existe?";
      mensagemVazia.hidden = false;
    }
    return;
  }

  renderizarLivros(livros);
  atualizarContagem(livros);

  const formBusca = document.getElementById("search-form");
  const campoBusca = document.getElementById("busca");

  if (formBusca && campoBusca) {
    formBusca.addEventListener("submit", function (evento) {
      evento.preventDefault();
      renderizarLivros(buscarLivros(livros, campoBusca.value));
    });

    // Busca também enquanto digita, pra não precisar clicar em "Buscar"
    campoBusca.addEventListener("input", function () {
      renderizarLivros(buscarLivros(livros, campoBusca.value));
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  marcarLinkAtivo();
  iniciarCatalogo();
});