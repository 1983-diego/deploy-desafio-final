const knex = require("../conexao")
const joi = require("joi")

const validarUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body

    try {
        const schemaUsuario = joi.object({
            nome: joi.string().required(),
            email: joi.string().email().required(),
            senha: joi.string().required()
        })

        await schemaUsuario.validateAsync({ nome, email, senha })

        const emailRepetido = await knex('usuarios').where({email}).first()
        
        if (emailRepetido) {
            return res.status(400).json({mensagem: "Email já existe no cadastro"})
        }

    } catch {
        return res.status(400).json({mensagem: "Não foi possível validar o usuário"})
    }

    next()
}

module.exports = validarUsuario