const knex = require("../conexao")

const cadastrarProduto = async (req, res) => {
    const {descricao, quantidade_estoque, valor, categoria_id} = req.body

    try {
        const novoProduto = await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning("*")

        if(!novoProduto) {
            return res.status(400).json({mensagem: "Não foi possível cadastrar o produto"})
        }

        return res.status(201).json({mensagem: `Produto ${descricao} cadastrado com sucesso`})
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const atualizarProduto = async (req, res) => {
    const {id} = req.params
    const {descricao, quantidade_estoque, valor, categoria_id} = req.body

    try {
        const editarProduto = await knex('produtos').update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).where({id})

        if (!editarProduto) {
            return res.status(400).json({ mensagem: "Não foi possível alterar os dados do produto"})
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const listarProdutos = async (req, res) => {
    const {categoria_id} = req.query

    try {
        if (categoria_id) {
            const produtosCategoria = await knex('produtos').where({categoria_id}).returning("*")

            return res.status(200).json(produtosCategoria)
        }
            
        const produtos = await knex('produtos').returning('*')

        if (!produtos) {
            return res.status(404).json({mensagem: "Produto(s) não encontrado(s)."})
        }

        return res.status(200).json(produtos)
        
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const detalharProduto = async (req, res) => {
    const {id} = req.params

    try {
        const produto = await knex('produtos').where({id}).first()

        if (!produto) {
            return res.status(404).json({mensagem: "Produto não encontrado."})
        }

        return res.status(200).json(produto)

    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const excluirProduto = async (req, res) => {
    const {id} = req.params

    try {
        const produtoExiste = await knex('produtos').where({id}).first()
        
        if (!produtoExiste) {
            return res.status(404).json({mensagem: "Produto não encontrado para exclusão."})
        
        }

        const produto = await knex('produtos').del().where({id}).returning('id')

        if (!produto) {
            return res.status(400).json({mensagem: "Não foi possível excluir o produto"})
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}


module.exports = {
    cadastrarProduto,
    atualizarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto
}