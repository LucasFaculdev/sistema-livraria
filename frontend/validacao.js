/*
  validacao.js
  ------------
  Confere os campos de um formulário antes de deixar enviar.
  Cada função de validação devolve uma string com o erro,
  ou "" (vazio) quando o campo está ok.
*/

function validarTexto(valor, minimo = 2) {
  if (!valor || valor.trim().length < minimo) {
    return `Preencha com pelo menos ${minimo} caracteres.`;
  }
  return "";
}

function validarNumero(valor, { minimo = 0 } = {}) {
  if (valor === "" || valor === null) {
    return "Esse campo é obrigatório.";
  }
  const numero = Number(valor);
  if (Number.isNaN(numero) || numero < minimo) {
    return `Informe um número válido (mínimo ${minimo}).`;
  }
  return "";
}

function validarEmail(valor) {
  const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!valor || !padrao.test(valor)) {
    return "Informe um e-mail válido.";
  }
  return "";
}

function validarSenha(valor) {
  if (!valor || valor.length < 6) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  return "";
}

// Mostra (ou limpa) a mensagem de erro de um campo específico
function mostrarErro(idSpan, mensagem) {
  const span = document.getElementById(idSpan);
  if (!span) return;
  span.textContent = mensagem;
}

function mostrarMensagemForm(texto, tipo = "erro") {
  const msg = document.getElementById("form-msg");
  if (!msg) return;
  msg.textContent = texto;
  msg.hidden = false;
  msg.className = "form-msg form-msg--" + tipo;
}

/* ===== Formulário de cadastro de livro ===== */
function configurarValidacaoCadastro() {
  const form = document.getElementById("form-cadastro");
  if (!form) return;

  form.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const genero = document.getElementById("genero").value;
    const preco = document.getElementById("preco").value;
    const estoque = document.getElementById("estoque").value;

    const erros = {
      titulo: validarTexto(titulo, 2),
      autor: validarTexto(autor, 2),
      genero: genero ? "" : "Selecione um gênero.",
      preco: validarNumero(preco, { minimo: 0.01 }),
      estoque: validarNumero(estoque, { minimo: 0 })
    };

    mostrarErro("erro-titulo", erros.titulo);
    mostrarErro("erro-autor", erros.autor);
    mostrarErro("erro-genero", erros.genero);
    mostrarErro("erro-preco", erros.preco);
    mostrarErro("erro-estoque", erros.estoque);

    const temErro = Object.values(erros).some(mensagem => mensagem !== "");
    if (temErro) {
      mostrarMensagemForm("Corrija os campos destacados antes de salvar.", "erro");
      return;
    }

    const botao = form.querySelector("button[type='submit']");
    if (botao) botao.disabled = true;

    try {
      await adicionarLivro({
        titulo: titulo.trim(),
        autor: autor.trim(),
        genero: genero,
        preco: Number(preco),
        estoque: Number(estoque)
      });

      mostrarMensagemForm("Livro salvo! Redirecionando pro catálogo...", "sucesso");
      form.reset();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 900);
    } catch (erro) {
      mostrarMensagemForm(erro.message || "Não foi possível salvar o livro.", "erro");
      if (botao) botao.disabled = false;
    }
  });
}

/* ===== Formulário de login =====
   Ainda só valida os campos no navegador — não existe tabela
   de sessão/autenticação conectada no backend por enquanto. */
function configurarValidacaoLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const erroEmail = validarEmail(email);
    const erroSenha = validarSenha(senha);

    mostrarErro("erro-email", erroEmail);
    mostrarErro("erro-senha", erroSenha);

    if (erroEmail || erroSenha) {
      mostrarMensagemForm("Confira e-mail e senha.", "erro");
      return;
    }

    mostrarMensagemForm("Formulário válido. Falta conectar isso a um login de verdade.", "sucesso");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  configurarValidacaoCadastro();
  configurarValidacaoLogin();
});