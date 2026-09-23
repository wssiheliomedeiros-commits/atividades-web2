const UsuarioService = require("../services/UsuarioService");
const asyncHandler = require("../utils/asyncHandler");
const parseId = require("../utils/parseId");

module.exports = {
  criar: asyncHandler(async (req, res) => {
    res.status(201).json(await UsuarioService.criar(req.body));
  }),

  listar: asyncHandler(async (req, res) => {
    res.json(await UsuarioService.listar());
  }),

  buscarPorId: asyncHandler(async (req, res) => {
    res.json(await UsuarioService.buscarPorId(parseId(req.params.id)));
  }),
};
