const { Router } = require("express");
const controller = require("../controllers/EmprestimoController");

const router = Router();

router.post("/", controller.criar);
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.patch("/:id/devolucao", controller.devolver);

module.exports = router;
