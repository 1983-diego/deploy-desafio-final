const express = require("express")
const multer = require("./multer")
const { listarCategorias } = require("./controladores/categorias")
const { cadastrarUsuario, realizarLogin, detalharUsuario, atualizarUsuario } = require("./controladores/usuarios")
const verificarLogin = require("./intermediarios/login")
const validarCorpoRequisicao = require("./intermediarios/validarCorpoRequisicao")
const { cadastrarProduto, atualizarProduto, listarProdutos, detalharProduto, excluirProduto } = require("./controladores/produtos")
const schemaProduto = require("./schemas/schemaProduto")
const schemaCliente = require("./schemas/schemaCliente")
const { cadastrarCliente, atualizarCliente, listarClientes, detalharCliente } = require("./controladores/clientes")
const schemaUsuario = require("./schemas/schemaUsuario")
const { cadastrarPedidos, listarPedidos } = require("./controladores/pedidos")
const schemaPedido = require("./schemas/schemaPedido")
const { uploadImagem, listarImagens } = require("./controladores/arquivos")

const rotas = express()

rotas.get("/categoria", listarCategorias)
rotas.post("/usuario", validarCorpoRequisicao(schemaUsuario),cadastrarUsuario)
rotas.post("/login", realizarLogin)

rotas.use(verificarLogin)

rotas.get("/usuario", detalharUsuario)
rotas.put("/usuario", validarCorpoRequisicao(schemaUsuario), atualizarUsuario)

rotas.post("/produto", validarCorpoRequisicao(schemaProduto), cadastrarProduto)
rotas.put("/produto/:id", validarCorpoRequisicao(schemaProduto), atualizarProduto)
rotas.get("/produto", listarProdutos)
rotas.get("/produto/:id", detalharProduto)
rotas.delete("/produto/:id", excluirProduto)

rotas.post("/cliente", validarCorpoRequisicao(schemaCliente), cadastrarCliente)
rotas.put("/cliente/:id",validarCorpoRequisicao(schemaCliente), atualizarCliente) 
rotas.get("/cliente", listarClientes)
rotas.get("/cliente/:id", detalharCliente)

rotas.post("/pedido", validarCorpoRequisicao(schemaPedido), cadastrarPedidos)
rotas.get("/pedido", listarPedidos)

rotas.post("/arquivo/upload", multer.single('arquivo'), uploadImagem),
rotas.get("/arquivo", listarImagens)

module.exports = rotas