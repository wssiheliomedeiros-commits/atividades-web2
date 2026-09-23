const AutorService = require("../services/AutorService");
const asyncHandler = require("../utils/asyncHandler");
const parseId = require("../utils/parseId");

module.exports = {
  criar: asyncHandler(async (req, res) => {
    const registro = await AutorService.criar(req.body);
    res.status(201).json(registro);
  }),

  listar: asyncHandler(async (req, res) => {
    res.json(await AutorService.listar(req.query));
  }),

  buscarPorId: asyncHandler(async (req, res) => {
    res.json(await AutorService.buscarPorId(parseId(req.params.id)));
  }),

  atualizar: asyncHandler(async (req, res) => {
    res.json(await AutorService.atualizar(parseId(req.params.id), req.body));
  }),

  excluir: asyncHandler(async (req, res) => {
    await AutorService.excluir(parseId(req.params.id));
    res.status(204).send();
  }),
};
