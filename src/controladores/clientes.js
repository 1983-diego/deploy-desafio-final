const knex = require("../conexao")

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {

        const emailRepetido = await knex('clientes').where({email}).first()
        
        if (emailRepetido) {
            return res.status(400).json({mensagem: "Email do cliente já existe no cadastro"})
        }
        
        const cpfRepetido = await knex('clientes').where({cpf}).first()
        
        if (cpfRepetido) {
            return res.status(400).json({mensagem: "Cpf do cliente já existe no cadastro"})
        }

        const novoCliente = await knex("clientes").insert({
            nome, 
            email, 
            cpf, 
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        }).returning("*")

        if(!novoCliente) {
            return res.status(400).json({mensagem: "Não foi possível cadastrar o cliente"})
        }

        return res.status(201).json({mensagem: `Cliente ${nome} cadastrado com sucesso`})
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const atualizarCliente = async (req, res) => {
    const {id} = req.params
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {
        const emailRepetido = await knex('clientes').where({email}).first()
        
        if (emailRepetido && emailRepetido.id != id) {
            return res.status(400).json({mensagem: "Email do cliente já existe no cadastro"})
        }
        
        const cpfRepetido = await knex('clientes').where({cpf}).first()
        
        if (cpfRepetido && cpfRepetido.id != id) {
            return res.status(400).json({mensagem: "Cpf do cliente já existe no cadastro"})
        }

        const editarCliente = await knex('clientes').update({
            nome, 
            email, 
            cpf, 
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        }).where({id}).returning("*")

        if (!editarCliente) {
            return res.status(400).json({ mensagem: "Não foi possível alterar os dados do produto"})
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const listarClientes = async (req, res) => {
    try {
        const clientes = await knex("clientes").returning("*")

        return res.status(200).json(clientes)

    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const detalharCliente = async (req, res) => {
    const {id} = req.params

    try {
        const cliente = await knex("clientes").where({id}).first()

        if (!cliente) {
            return res.status(404).json({mensagem: "Cliente não encontrado"})
        }
        return res.status(200).json(cliente)

    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

module.exports = {
    cadastrarCliente,
    atualizarCliente,
    listarClientes,
    detalharCliente
}