const { Router } = require("express");
const controller = require("../controllers/AutorController");

const router = Router();

router.post("/", controller.criar);
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;
