const joi = require("joi")

const schemaProduto = joi.object({
    descricao: joi.string().required(),
    quantidade_estoque: joi.number().min(1).max(1000000).integer().required(),
    valor: joi.number().min(1).integer().required(),
    categoria_id: joi.number().min(1).max(9).integer().required(),
    produto_imagem: joi.any()
})

module.exports = schemaProduto