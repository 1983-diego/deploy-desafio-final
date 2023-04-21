const knex = require("../conexao")
const jwt = require('jsonwebtoken')


const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({mensagem: "Usuário não logado."})
    }

    const token = authorization.split(" ")[1]

    try {
        const { id } = jwt.verify(token, process.env.SENHA_JWT)
        
        const usuario = await knex('usuarios').where({id}).returning('*')

        if (!usuario[0]) {
            return res.status(401).json({mensagem: "Usuário não autorizado"})
        }

        const { senha: _, ...usuarioVerificado} = usuario[0]
        
        req.usuario = usuarioVerificado
        
        next()
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

module.exports = verificarLogin

