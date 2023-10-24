const express = require('express');
const rotas = express();
const { listarContas, criarContas, atualizarContaUsuario, deletarContaUsuario, depositar, sacar, transferir, consultaSaldo, extrato } = require('./controladores/contas');
const intermediario = require('./intermediarios');

rotas.get('/contas',intermediario, listarContas);
rotas.post('/contas', criarContas);
rotas.put('/contas/:numeroConta/usuario', atualizarContaUsuario);
rotas.delete('/contas/:numeroConta',deletarContaUsuario)
rotas.post('/transacoes/depositar',depositar)
rotas.post('/transacoes/sacar',sacar)
rotas.post('/transacoes/transferir',transferir)
rotas.get('/contas/saldo',consultaSaldo)
rotas.get('/contas/extrato',extrato)
module.exports = rotas;
 