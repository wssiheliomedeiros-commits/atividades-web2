const EmprestimoService = require("../services/EmprestimoService");
const asyncHandler = require("../utils/asyncHandler");
const parseId = require("../utils/parseId");

module.exports = {
  criar: asyncHandler(async (req, res) => {
    res.status(201).json(await EmprestimoService.emprestar(req.body));
  }),

  listar: asyncHandler(async (req, res) => {
    res.json(await EmprestimoService.listar());
  }),

  buscarPorId: asyncHandler(async (req, res) => {
    res.json(await EmprestimoService.buscarPorId(parseId(req.params.id)));
  }),

  devolver: asyncHandler(async (req, res) => {
    res.json(await EmprestimoService.devolver(parseId(req.params.id)));
  }),
};
