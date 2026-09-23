const BaseRepository = require("./BaseRepository");
const { Categoria } = require("../models");

class CategoriaRepository extends BaseRepository {
  constructor() {
    super(Categoria);
  }
}

module.exports = new CategoriaRepository();
