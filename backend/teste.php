<?php
/*
  teste.php
  ---------
  API bem simples do sistema de livraria.
  GET  -> devolve todos os livros em JSON
  POST -> recebe um livro em JSON e salva no banco

  Ajuste $usuario e $senha se o seu MySQL não for o padrão
  do XAMPP/WAMP (usuário "root", sem senha).
*/

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$usuario = 'root';
$senha = '';
$banco = 'livraria';

$conexao = new mysqli($host, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    http_response_code(500);
    echo json_encode(['erro' => 'Não foi possível conectar ao banco: ' . $conexao->connect_error]);
    exit;
}

$conexao->set_charset('utf8mb4');

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    listarLivros($conexao);
} elseif ($metodo === 'POST') {
    adicionarLivro($conexao);
} else {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
}

$conexao->close();

// ===== GET: lista todos os livros =====
function listarLivros($conexao) {
    $resultado = $conexao->query('SELECT id, titulo, autor, genero, preco, estoque FROM livros ORDER BY id');

    if (!$resultado) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao consultar os livros.']);
        return;
    }

    $livros = [];
    while ($linha = $resultado->fetch_assoc()) {
        $livros[] = [
            'id' => (int) $linha['id'],
            'titulo' => $linha['titulo'],
            'autor' => $linha['autor'],
            'genero' => $linha['genero'],
            'preco' => (float) $linha['preco'],
            'estoque' => (int) $linha['estoque'],
        ];
    }

    echo json_encode($livros);
}

// ===== POST: cadastra um livro novo =====
function adicionarLivro($conexao) {
    $dados = json_decode(file_get_contents('php://input'), true);

    $titulo = trim($dados['titulo'] ?? '');
    $autor = trim($dados['autor'] ?? '');
    $genero = trim($dados['genero'] ?? '');
    $preco = isset($dados['preco']) ? (float) $dados['preco'] : null;
    $estoque = isset($dados['estoque']) ? (int) $dados['estoque'] : null;

    if ($titulo === '' || $autor === '' || $genero === '' || $preco === null || $estoque === null) {
        http_response_code(400);
        echo json_encode(['erro' => 'Preencha todos os campos: titulo, autor, genero, preco, estoque.']);
        return;
    }

    $stmt = $conexao->prepare('INSERT INTO livros (titulo, autor, genero, preco, estoque) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sssdi', $titulo, $autor, $genero, $preco, $estoque);

    if ($stmt->execute()) {
        echo json_encode([
            'id' => $stmt->insert_id,
            'titulo' => $titulo,
            'autor' => $autor,
            'genero' => $genero,
            'preco' => $preco,
            'estoque' => $estoque,
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Não foi possível salvar o livro.']);
    }

    $stmt->close();
}