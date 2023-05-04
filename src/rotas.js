const express = require("express")
const { listarCategorias } = require("./controladores/categorias")
const { cadastrarUsuario, realizarLogin, detalharUsuario, atualizarUsuario } = require("./controladores/usuarios")
const verificarLogin = require("./intermediarios/login")
const validarCorpoRequisicao = require("./intermediarios/validarCorpoRequisicao")
const schemaCadastrarProduto = require("./schemas/schemaCadastrarProduto")
const { cadastrarProduto, atualizarProduto, listarProdutos, detalharProduto, excluirProduto } = require("./controladores/produtos")
const schemaAtualizarProduto = require("./schemas/schemaAtualizarProduto")
const schemaCadastrarCliente = require("./schemas/schemaCadastrarCliente")
const { cadastrarCliente, atualizarCliente, listarClientes, detalharCliente } = require("./controladores/clientes")
const schemaAtualizarCliente = require("./schemas/schemaAtualizarCliente")
const schemaCadastrarUsuario = require("./schemas/schemaCadastrarUsuario")
const schemaAtualizarUsuario = require("./schemas/schemaAtualizarUsuario")


const rotas = express()

rotas.get("/categoria", listarCategorias)
rotas.post("/usuario", validarCorpoRequisicao(schemaCadastrarUsuario),cadastrarUsuario)
rotas.post("/login", realizarLogin)

rotas.use(verificarLogin)

rotas.get("/usuario", detalharUsuario)
rotas.put("/usuario", validarCorpoRequisicao(schemaAtualizarUsuario), atualizarUsuario)

rotas.post("/produto", validarCorpoRequisicao(schemaCadastrarProduto), cadastrarProduto)
rotas.put("/produto/:id", validarCorpoRequisicao(schemaAtualizarProduto), atualizarProduto)
rotas.get("/produto", listarProdutos)
rotas.get("/produto/:id", detalharProduto)
rotas.delete("/produto/:id", excluirProduto)

rotas.post("/cliente", validarCorpoRequisicao(schemaCadastrarCliente), cadastrarCliente)
rotas.put("/cliente/:id",validarCorpoRequisicao(schemaAtualizarCliente), atualizarCliente) 
rotas.get("/cliente", listarClientes)
rotas.get("/cliente/:id", detalharCliente)

module.exports = rotas