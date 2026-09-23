const CategoriaService = require("../services/CategoriaService");
const asyncHandler = require("../utils/asyncHandler");
const parseId = require("../utils/parseId");

module.exports = {
  criar: asyncHandler(async (req, res) => {
    const registro = await CategoriaService.criar(req.body);
    res.status(201).json(registro);
  }),

  listar: asyncHandler(async (req, res) => {
    res.json(await CategoriaService.listar(req.query));
  }),

  buscarPorId: asyncHandler(async (req, res) => {
    res.json(await CategoriaService.buscarPorId(parseId(req.params.id)));
  }),

  atualizar: asyncHandler(async (req, res) => {
    res.json(await CategoriaService.atualizar(parseId(req.params.id), req.body));
  }),

  excluir: asyncHandler(async (req, res) => {
    await CategoriaService.excluir(parseId(req.params.id));
    res.status(204).send();
  }),
};
