const joi = require("joi")

const schemaPedido = joi.object({
    cliente_id:joi.number().required().messages({
        'any.required':'O campo id é obrigatório',
        'number.base':'O campo id deve ser um número válido'
    }),
    observacao:joi.string(),
    pedido_produtos:joi.array().min(1).items(
        joi.object({
            produto_id: joi.number().required().messages({
                'any.required':'O campo id do produto é obrigatório',
                'number.base':'O campo id do produto deve ser um número válido'
            }),
            quantidade_produto: joi.number().min(1).required().messages({
                'any.required':'O campo quantidade é obrigatório',
                'number.base':'O campo quantidade deve ser um número válido'
            })
        })
    ).messages({
        'array.min': 'É necessário ao menos um produto para o pedido',
        'any.required':'O campo pedido é obrigatório'
    })
});

module.exports = schemaPedido