## Atividade prática web2 do meu querido professor Wemerson T. V. Porto - homem insigne, magnanimo, probo e altruista

## Integrantes

- Integrante 1: Wssihélio de Medeiros Vaconcelos
- Integrante 2: Ruan Jardelino Marinho

## Como instalar

```bash
npm install
```

## Como executar

```bash
npm start
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`). O banco `database/biblioteca.sqlite` e todas as tabelas são criados automaticamente na primeira execução.

Para desenvolvimento (reinicia ao salvar): `npm run dev`.

## Estrutura do projeto

```
biblioteca-api/
├── database/                 # arquivo biblioteca.sqlite (gerado)
├── src/
│   ├── config/database.js    # conexão Sequelize + SQLite
│   ├── models/               # Autor, Livro, Categoria (+ Usuario, Emprestimo) e associações
│   ├── repositories/         # acesso ao banco (Sequelize)
│   ├── services/             # regras de negócio
│   ├── controllers/          # camada HTTP (req/res)
│   ├── routes/               # definição das rotas
│   ├── middlewares/          # tratamento centralizado de erros
│   ├── utils/                # AppError, parseId, pick, asyncHandler
│   └── app.js
├── package.json
└── README.md
```

Fluxo: `HTTP → Controller → Service → Repository → Model Sequelize → SQL → SQLite`.

## Modelo de dados

- **Autor** (`id`, `nome`, `email` único e validado, `nacionalidade`)
- **Livro** (`id`, `titulo`, `isbn` único, `ano`, `disponivel` padrão `true`, `autorId`)
- **Categoria** (`id`, `nome` único, `descricao`)
- **Autor 1 ─ N Livro** (`hasMany` / `belongsTo`, chave `autorId`)
- **Livro N ─ N Categoria** (`belongsToMany` pela tabela `livro_categorias`, com `livroId` e `categoriaId`)

## Rotas disponíveis

### Autores

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /autores | Criar autor |
| GET | /autores | Listar autores |
| GET | /autores/:id | Buscar autor |
| PUT | /autores/:id | Atualizar autor |
| DELETE | /autores/:id | Excluir autor (bloqueado se houver livros) |

### Livros

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /livros | Criar livro |
| GET | /livros | Listar livros (com autor e categorias, filtros e paginação) |
| GET | /livros/:id | Buscar livro |
| PUT | /livros/:id | Atualizar livro |
| DELETE | /livros/:id | Excluir livro |
| POST | /livros/:livroId/categorias/:categoriaId | Associar categoria a um livro |
| DELETE | /livros/:livroId/categorias/:categoriaId | Remover categoria de um livro |

### Categorias

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /categorias | Criar categoria |
| GET | /categorias | Listar categorias |
| GET | /categorias/:id | Buscar categoria |
| PUT | /categorias/:id | Atualizar categoria |
| DELETE | /categorias/:id | Excluir categoria |

### Desafio extra — Empréstimos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /usuarios | Criar usuário |
| GET | /usuarios | Listar usuários |
| GET | /usuarios/:id | Buscar usuário |
| POST | /emprestimos | Emprestar livro (`{ "usuarioId": 1, "livroId": 1 }`) |
| GET | /emprestimos | Listar empréstimos |
| GET | /emprestimos/:id | Buscar empréstimo |
| PATCH | /emprestimos/:id/devolucao | Devolver livro |

O empréstimo só é criado se o livro estiver `disponivel = true`. Criar o empréstimo e marcar o livro como indisponível acontece dentro de **uma transação** (`sequelize.transaction`): se qualquer etapa falhar, é feito `ROLLBACK`; se tudo der certo, `COMMIT`. A devolução também é transacional.

## Filtros e paginação em `GET /livros`

Filtros (opcionais e combináveis):

```
GET /livros?titulo=dom
GET /livros?ano=1899
GET /livros?disponivel=true
GET /livros?titulo=dom&disponivel=true
```

Paginação (`page` padrão 1, `limit` padrão 10, máximo 100):

```
GET /livros?page=1&limit=10
```

```json
{
  "data": [ { "id": 1, "titulo": "Dom Casmurro", "Autor": { "id": 1, "nome": "Machado de Assis" } } ],
  "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

Sem `page`/`limit`, a rota devolve apenas o array de livros. O cálculo usado é `offset = (page - 1) * limit`.

## Exemplos

```bash
# criar autor
curl -X POST http://localhost:3000/autores -H "Content-Type: application/json" \
  -d '{"nome":"Machado de Assis","email":"machado@email.com","nacionalidade":"Brasileiro"}'

# criar livro
curl -X POST http://localhost:3000/livros -H "Content-Type: application/json" \
  -d '{"titulo":"Dom Casmurro","isbn":"9780000000001","ano":1899,"autorId":1}'

# associar categoria 2 ao livro 1
curl -X POST http://localhost:3000/livros/1/categorias/2
```

## Códigos de resposta e erros

Todos os erros seguem o formato `{ "erro": "mensagem" }`.

| Código | Quando |
|--------|--------|
| 400 | validação (e-mail inválido, campo obrigatório), ID ou parâmetro inválido, JSON malformado |
| 404 | autor, livro, categoria, usuário ou empréstimo não encontrado |
| 409 | valor único repetido (e-mail, ISBN, nome da categoria), exclusão bloqueada por vínculos, livro indisponível |

## Como um objeto JavaScript vira um registro no banco

`{ titulo: "Dom Casmurro", ... }` chega no `POST /livros` como JSON e o `express.json()` o transforma em `req.body`.

1. **Controller** (`LivroController.criar`) lê `req.body` e chama o Service.
2. **Service** (`LivroService.criar`) filtra os campos permitidos, aplica as regras de negócio (o autor precisa existir) e chama o Repository.
3. **Repository** (`LivroRepository.criar`) chama `Livro.create(dados)` no Model.
4. **Model Sequelize** valida os dados (`allowNull`, `isInt`, etc.) e monta o SQL: `INSERT INTO livros (titulo, isbn, ano, disponivel, autorId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`.
5. O **driver sqlite3** executa o SQL no arquivo `database/biblioteca.sqlite`, o registro é gravado e o Sequelize devolve uma instância com o `id` gerado, que sobe de volta por Repository → Service → Controller → resposta JSON (`201 Created`).
