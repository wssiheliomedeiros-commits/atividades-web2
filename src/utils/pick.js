// Retorna só os campos permitidos que realmente foram enviados (evita mass assignment).
module.exports = (obj, campos) => {
  const origem = obj || {};
  return campos.reduce((acc, campo) => {
    if (origem[campo] !== undefined) acc[campo] = origem[campo];
    return acc;
  }, {});
};
