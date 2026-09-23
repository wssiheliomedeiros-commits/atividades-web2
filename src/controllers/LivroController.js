const LivroService = require("../services/LivroService");
const asyncHandler = require("../utils/asyncHandler");
const parseId = require("../utils/parseId");

module.exports = {
  criar: asyncHandler(async (req, res) => {
    const registro = await LivroService.criar(req.body);
    res.status(201).json(registro);
  }),

  listar: asyncHandler(async (req, res) => {
    res.json(await LivroService.listar(req.query));
  }),

  buscarPorId: asyncHandler(async (req, res) => {
    res.json(await LivroService.buscarPorId(parseId(req.params.id)));
  }),

  atualizar: asyncHandler(async (req, res) => {
    res.json(await LivroService.atualizar(parseId(req.params.id), req.body));
  }),

  excluir: asyncHandler(async (req, res) => {
    await LivroService.excluir(parseId(req.params.id));
    res.status(204).send();
  }),

  // POST /livros/:livroId/categorias/:categoriaId
  associarCategoria: asyncHandler(async (req, res) => {
    const livroId = parseId(req.params.livroId, "livroId");
    const categoriaId = parseId(req.params.categoriaId, "categoriaId");
    res.status(201).json(await LivroService.associarCategoria(livroId, categoriaId));
  }),

  // DELETE /livros/:livroId/categorias/:categoriaId
  desassociarCategoria: asyncHandler(async (req, res) => {
    const livroId = parseId(req.params.livroId, "livroId");
    const categoriaId = parseId(req.params.categoriaId, "categoriaId");
    res.json(await LivroService.desassociarCategoria(livroId, categoriaId));
  }),
};
