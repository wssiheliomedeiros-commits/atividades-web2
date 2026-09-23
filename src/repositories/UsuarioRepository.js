const BaseRepository = require("./BaseRepository");
const { Usuario } = require("../models");

class UsuarioRepository extends BaseRepository {
  constructor() {
    super(Usuario);
  }
}

module.exports = new UsuarioRepository();
