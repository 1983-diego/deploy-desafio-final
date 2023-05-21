const joi = require("joi")

const schemaCliente = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    cpf: joi.string().min(11).max(11).required(),
    cep: joi.string().min(8).max(8),
    rua: joi.string(),
    numero: joi.string(),
    bairro: joi.string(),
    cidade: joi.string(),
    estado: joi.string().min(2).max(2)
})

module.exports = schemaCliente