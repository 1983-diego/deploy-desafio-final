const express = require("express")
const { listarCategorias } = require("./controladores/categorias")
const { cadastrarUsuario, realizarLogin, detalharUsuario, atualizarUsuario } = require("./controladores/usuarios")
const verificarLogin = require("./intermediarios/login")
const validarUsuario = require("./intermediarios/validarUsuario")
const intermediarioAtualizarUsuario = require("./intermediarios/atualizarUsuarioCorpoRequisicao")


const rotas = express()

rotas.get("/categoria", listarCategorias)
rotas.post("/usuario", validarUsuario,cadastrarUsuario)
rotas.post("/login", realizarLogin)

rotas.use(verificarLogin)

rotas.get("/usuario", detalharUsuario)
rotas.put("/usuario", intermediarioAtualizarUsuario,atualizarUsuario)

module.exports = rotas