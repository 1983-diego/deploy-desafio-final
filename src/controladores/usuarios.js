const knex = require("../conexao")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const emailRepetido = await knex('usuarios').where({email}).first()
        
        if (emailRepetido) {
            return res.status(400).json({mensagem: "Email já existe no cadastro"})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await knex('usuarios').insert({
            nome,
            email,
            senha: senhaCriptografada
        }).returning('*')
        
        if (!novoUsuario[0]) {
            return res.status(400).json({mensagem: "Não foi possível cadastrar o usuário"})
        }

        return res.status(201).json({mensagem: `Usuário: ${nome} cadastrado com sucesso`})
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const realizarLogin = async (req, res) => {
    const {email, senha} = req.body

    if (!senha || !email) {
        return res.status(400).json({mensagem: "Email e/ou senha inválidos"})
    }
    try {
        const usuario = await knex('usuarios').where({email}).returning('*')
        
        if (!usuario[0]) {
            return res.status(400).json({mensagem: "Usuário e/ou senha inválidos"})
        }

        const verificarSenha = await bcrypt.compare(senha, usuario[0].senha)

        if (!verificarSenha) {
            return res.status(400).json({mensagem: "Email e/ou senha inválidos"})
        }

        const token = jwt.sign({ id: usuario[0].id}, process.env.SENHA_JWT, {expiresIn: "6h"})

        const {senha: _, ...usuarioLogado } = usuario[0]

        return res.json({
            usuario: usuarioLogado,
            token
        })
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const detalharUsuario = async (req, res) => {
    const {id} = req.usuario
    try {
        const usuarioDetalhado = await knex('usuarios').where({id}).returning('*')
        
        const {senha: _, ...usuario} = usuarioDetalhado[0]
        
        return res.status(200).json(usuario)
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const atualizarUsuario = async (req, res) => {
    const { id } = req.usuario
    const { nome, email, senha } = req.body

    try {    
        const verificarEmail = await knex('usuarios').where({email}).first()
        
        if (verificarEmail && verificarEmail.email !== req.usuario.email) {
            return res.status(400).json({mensagem: "O email já consta em nosso cadastro"})
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await knex('usuarios').where({id}).update({ nome, email, senha: senhaCriptografada })
        
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

module.exports = {
    cadastrarUsuario,
    realizarLogin,
    detalharUsuario,
    atualizarUsuario
}