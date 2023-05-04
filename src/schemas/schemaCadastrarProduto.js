const joi = require("joi")

const schemaCadastrarProduto = joi.object({
    descricao: joi.string().required(),
    quantidade_estoque: joi.number().min(1).max(1000000).integer().required(),
    valor: joi.number().min(1).integer().required(),
    categoria_id: joi.number().min(1).max(9).integer().required()
})

module.exports = schemaCadastrarProduto