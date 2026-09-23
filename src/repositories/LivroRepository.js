const { Op } = require("sequelize");
const BaseRepository = require("./BaseRepository");
const { Livro, Autor, Categoria } = require("../models");

const INCLUDE_PADRAO = [
  { model: Autor, attributes: ["id", "nome"] },
  {
    model: Categoria,
    as: "categorias",
    attributes: ["id", "nome"],
    through: { attributes: [] }, 
  },
];

class LivroRepository extends BaseRepository {
  constructor() {
    super(Livro);
  }

  buscarPorId(id, options = {}) {
    return super.buscarPorId(id, { include: INCLUDE_PADRAO, ...options });
  }

  // Monta o "where" a partir dos filtros e aplica paginação (limit/offset) quando informada.
  buscarComFiltros({ titulo, ano, disponivel } = {}, { limit, offset } = {}) {
    const where = {};
    if (titulo) where.titulo = { [Op.like]: `%${titulo}%` };
    if (ano !== undefined) where.ano = ano;
    if (disponivel !== undefined) where.disponivel = disponivel;

    return this.model.findAndCountAll({
      where,
      include: INCLUDE_PADRAO,
      order: [["id", "ASC"]],
      limit,
      offset,
      distinct: true, // evita contar linhas duplicadas geradas pelo JOIN N:N
    });
  }

  contarPorAutor(autorId) {
    return this.model.count({ where: { autorId } });
  }
}

module.exports = new LivroRepository();
