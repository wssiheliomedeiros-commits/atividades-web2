const { Router } = require("express");
const controller = require("../controllers/LivroController");

const router = Router();

router.post("/", controller.criar);
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

// Associação Livro ↔ Categoria (tabela livro_categorias)
router.post("/:livroId/categorias/:categoriaId", controller.associarCategoria);
router.delete("/:livroId/categorias/:categoriaId", controller.desassociarCategoria);

module.exports = router;
