// Operações genéricas de banco (CRUD). Os repositórios específicos herdam daqui.
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  criar(dados, options = {}) {
    return this.model.create(dados, options);
  }

  listar(options = {}) {
    return this.model.findAll(options);
  }

  buscarPorId(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  // Retorna a instância atualizada ou null se o registro não existir.
  async atualizar(id, dados, options = {}) {
    const registro = await this.model.findByPk(id, options);
    if (!registro) return null;
    return registro.update(dados, options);
  }

  // Retorna o número de linhas removidas (0 ou 1).
  excluir(id, options = {}) {
    return this.model.destroy({ where: { id }, ...options });
  }
}

module.exports = BaseRepository;
