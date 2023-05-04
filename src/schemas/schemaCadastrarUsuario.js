const joi = require("joi")

const schemaCadastrarUsuario = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required()
})

module.exports = schemaCadastrarUsuario