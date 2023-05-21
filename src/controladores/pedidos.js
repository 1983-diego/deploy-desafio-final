const knex = require("../conexao")
const transporter = require("../email")

const cadastrarPedidos = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos} = req.body
    
    try {
        //checar cliente
        const cliente = await knex('clientes').where('id', '=', cliente_id).first()
            
        if (!cliente) {
            return res.status(404).json({mensagem: "Cliente inexistente."})
        } 
        
        let index = 0
        let arrayPrecoProdutos = []
        let arrayQuantidade = []
        while (pedido_produtos.length > index) {
            
            const produtoExiste = await knex('produtos').where('id', '=', pedido_produtos[index]['produto_id']).first()
            
            if (!produtoExiste) {
                return res.status(404).json({mensagem: `Produto de id: ${pedido_produtos[index]['produto_id']} inexistente.`})
            }

            arrayPrecoProdutos.push(produtoExiste['valor'])
            arrayQuantidade.push(pedido_produtos[index]['quantidade_produto'])

            const produtoEstoque = await knex('produtos').where('id', '=', pedido_produtos[index]['produto_id']).first()
            
            if (produtoEstoque.quantidade_estoque < pedido_produtos[index]['quantidade_produto']) {
                return res.status(400).json({mensagem: `A quantidade em estoque é de ${produtoEstoque.quantidade_estoque} e 
                    o cliente pediu ${pedido_produtos[index]['quantidade_produto']}`})
            }

            index++
        }
        //inserir o pedido nas tabelas de pedidos e pedido_produtos
        
        let pedidoValorTotal = 0
        for (let i = 0; i < pedido_produtos.length; i++) {
            pedidoValorTotal += arrayPrecoProdutos[i] * arrayQuantidade[i]
        }

        const pedido = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valor_total: pedidoValorTotal
        }).returning("*")

        if(!pedido) {
            return res.status(400).json({mensagem: "Não foi possível registrar o pedido"})
        }

        // inserir produto pedido na tabela pedido_produtos
        // atualizar o estoque na tabela produtos
        let contentTable = ''
        for (let i = 0; i < pedido_produtos.length; i++) {
            const inserirPedidoProduto = await knex('pedido_produtos').insert({
                pedido_id: pedido[0].id,
                produto_id: pedido_produtos[i]['produto_id'],
                quantidade_produto: pedido_produtos[i]['quantidade_produto'],
                valor_produto: arrayPrecoProdutos[i]
            })

            const produto = await knex('produtos').where('id', '=', pedido_produtos[i]['produto_id']).first()

            const atualizarEstoqueProduto = await knex('produtos').where('id', '=', pedido_produtos[i]['produto_id']).update({
                quantidade_estoque: produto.quantidade_estoque - pedido_produtos[i]['quantidade_produto']
            })

            contentTable += `
                <tr>
                    <td>${produto.descricao}</td>
                    <td>${pedido_produtos[i]['quantidade_produto']}</td>
                    <td>${arrayPrecoProdutos[i]}</td>

                </tr>
            `
        }
        
        const clienteEmail = await knex('clientes').where('id', '=', cliente_id).returning('*')

        let emailInfo = await transporter.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            //to: "diego.passos.santos2@gmail.com, diego.passos.santos2@gmail.com",
            to: `${clienteEmail[0].nome} <${clienteEmail[0].email}>`,
            subject: "Confirmação de Pedido ✔",
            html: ` <table>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor Unitário</th>
                            ${contentTable}
                            <p> Valor total: ${pedidoValorTotal}</p>
                    </table>`,
          });


        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query
    
    try {
        if (!cliente_id) {
            let pedidos = await knex('pedidos')

            let todosPedidosComItens = []
    
            for (const pedido of pedidos) {
                let pedidoProdutos = await knex('pedido_produtos').where('pedido_id', '=', pedido.id)
    
                todosPedidosComItens.push({
                    pedido,
                    pedidoProdutos
                })
            }
        
            return res.status(200).json(todosPedidosComItens)
        } else {
            const cliente = await knex('clientes').where('id', '=', cliente_id).first()
                
            if(!cliente) {
                return res.status(404).json({mensagem: "Cliente não encontrado"})
            }
            
            let pedidos = await knex.select('*').from('pedidos').where('pedidos.cliente_id', '=', cliente.id)

            let todosPedidosComItens = []
    
            for (const pedido of pedidos) {
                let pedidoProdutos = await knex('pedido_produtos').where('pedido_id', '=', pedido.id)
    
                todosPedidosComItens.push({
                    pedido,
                    pedidoProdutos
                })
            }
        
            return res.status(200).json(todosPedidosComItens)
        }
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

module.exports = {
    cadastrarPedidos,
    listarPedidos,
}