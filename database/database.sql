-- Banco de dados do Sistema de Livraria
-- Estrutura simples: uma tabela de livros e uma de usuários (login).

CREATE DATABASE IF NOT EXISTS livraria;
USE livraria;

-- ===== Tabela de livros =====
-- Os nomes das colunas são os mesmos campos que o front-end
-- já usa em livros.js (titulo, autor, genero, preco, estoque),
-- pra não precisar converter nome de campo entre front e back.
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(120) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0
);

-- ===== Tabela de usuários =====
-- Pra quando o login.html passar a falar com o banco de verdade.
-- IMPORTANTE: "senha" aqui é pra guardar o HASH da senha
-- (gerado com password_hash() no PHP), nunca a senha em texto puro.
-- Por isso o campo é grande (255) — um hash bcrypt ocupa mais
-- espaço que a senha original.
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

-- ===== Dados iniciais =====
-- Os mesmos livros que já estão no livros.json do front,
-- só pra a tabela não começar vazia.
INSERT INTO livros (titulo, autor, genero, preco, estoque) VALUES
('Torto Arado', 'Itamar Vieira Junior', 'Ficção', 54.90, 8),
('Dom Casmurro', 'Machado de Assis', 'Clássico', 29.90, 15),
('Código Limpo', 'Robert C. Martin', 'Tecnologia', 89.00, 3),
('A Rosa do Povo', 'Carlos Drummond de Andrade', 'Poesia', 42.50, 0),
('O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 64.90, 6),
('1808', 'Laurentino Gomes', 'História', 47.90, 11);