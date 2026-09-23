const BaseRepository = require("./BaseRepository");
const { Autor } = require("../models");

class AutorRepository extends BaseRepository {
  constructor() {
    super(Autor);
  }
}

module.exports = new AutorRepository();
