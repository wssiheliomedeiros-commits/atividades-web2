const UsuarioRepository = require("../repositories/UsuarioRepository");
const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "email"];

class UsuarioService {
  criar(dados) {
    return UsuarioRepository.criar(pick(dados, CAMPOS));
  }

  listar() {
    return UsuarioRepository.listar({ order: [["id", "ASC"]] });
  }

  async buscarPorId(id) {
    const usuario = await UsuarioRepository.buscarPorId(id);
    if (!usuario) throw new AppError("Usuário não encontrado", 404);
    return usuario;
  }
}

module.exports = new UsuarioService();
