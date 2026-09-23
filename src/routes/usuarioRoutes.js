const { Router } = require("express");
const controller = require("../controllers/UsuarioController");

const router = Router();

router.post("/", controller.criar);
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);

module.exports = router;
