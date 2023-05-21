const knex = require("../conexao")
const aws = require("aws-sdk")
const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})

const cadastrarProduto = async (req, res) => {
    const {descricao, quantidade_estoque, valor, categoria_id, produto_imagem} = req.body

    try {
        const checarImagemRepetida = await knex('produtos').where('produto_imagem', '=', produto_imagem).first()

        if (checarImagemRepetida && checarImagemRepetida.produto_imagem != null) {
            return res.status(400).json({mensagem: "Já existe essa imagem atribuída a um produto"})
        }

        const novoProduto = await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem
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
    const {descricao, quantidade_estoque, valor, categoria_id, produto_imagem} = req.body

    try {
        const produto = await knex('produtos').where({id}).first()

        if(!produto){
            return res.status(404).json({mensagem: "Produto inexistente"})
        }
        
        if(produto.produto_imagem){
            const getPath = produto.produto_imagem.split(".com/")[1]
            
            await s3.deleteObject({
                Bucket: process.env.BUCKET,
                Key: getPath
            }).promise()
        }

        const editarProduto = await knex('produtos').update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: produto_imagem || null
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
        
        const verificarPedidos = await knex('pedido_produtos').where('produto_id', '=', id).returning("*")

        if (verificarPedidos.length > 0) {
            return res.status(400).json({mensagem: 'O produto não pode ser excluído por estar em pelo menos um pedido'})
        }

        if(produtoExiste.produto_imagem != null){
            const getPath = produtoExiste.produto_imagem.split(".com/")[1]

            await s3.deleteObject({
                Bucket: process.env.BUCKET,
                Key: getPath
            }).promise()
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