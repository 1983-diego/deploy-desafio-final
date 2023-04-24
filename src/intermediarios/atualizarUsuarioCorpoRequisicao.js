const joi = require("joi")
const knex = require("../conexao")

const intermediarioAtualizarUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body

    try {
        const schemaUsuario = joi.object({
            nome: joi.string().required(),
            email: joi.string().email().required(),
            senha: joi.string().required()
        })

        await schemaUsuario.validateAsync({ nome, email, senha })

        const verificarEmail = await knex('usuarios').where({email}).first()
        
        if (verificarEmail && verificarEmail.email !== req.usuario.email) {
            return res.status(400).json({mensagem: "O email já consta em nosso cadastro"})
        }
    } catch (error) {
        return res.status(400).json({mensagem: "Erro na validação do usuário"})
    }

    next()
}

module.exports = intermediarioAtualizarUsuario