const express = require("express")
const { listarCategorias } = require("./controladores/categorias")
const { cadastrarUsuario, realizarLogin, detalharUsuario, atualizarUsuario } = require("./controladores/usuarios")
const verificarLogin = require("./intermediarios/login")


const rotas = express()

rotas.get("/categoria", listarCategorias)
rotas.post("/usuario", cadastrarUsuario)
rotas.post("/login", realizarLogin)

rotas.use(verificarLogin)

rotas.get("/usuario", detalharUsuario)
rotas.put("/usuario", atualizarUsuario)

module.exports = rotas