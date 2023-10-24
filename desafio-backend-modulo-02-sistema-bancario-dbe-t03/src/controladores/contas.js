const dados = require("../bancodedados");
const { format } = require("date-fns");
const {dataTransacao,dataTransacaoTranferencia} = require('./datas');

const listarContas = (req, res) => {
  return res.status(200).json(dados.contas);
};

const criarContas = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const conta = {
    numero: dados.identificador++,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ message: "Campos obrigatórios não preenchidos" });
  }
  dados.contas.push(conta);
  return res.status(201).json({ mensage: "Conta criada com sucesso" });
};

const atualizarContaUsuario = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const contaExistente = dados.contas.find(
    (conta) => conta.numero === Number(numeroConta)
  );

  if (!contaExistente) {
    return res
      .status(404)
      .json({ mensagem: "Servidor não encontrou conta com este número." });
  }

  if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
    return res
      .status(400)
      .json({ mensagem: "Você deve alterar pelo menos um campo." });
  }

  if (
    email &&
    dados.contas.some(
      (conta) =>
        conta.usuario.email === email && conta.numero !== Number(numeroConta)
    )
  ) {
    return res
      .status(400)
      .json({ mensagem: "E-mail já registrado em outra conta." });
  }

  if (
    cpf &&
    dados.contas.some(
      (conta) =>
        conta.usuario.cpf === cpf && conta.numero !== Number(numeroConta)
    )
  ) {
    return res
      .status(400)
      .json({ mensagem: "CPF já registrado em outra conta." });
  }

  const usuario = contaExistente.usuario;

  if (nome !== undefined) usuario.nome = nome;
  if (cpf !== undefined) usuario.cpf = cpf;
  if (data_nascimento !== undefined) usuario.data_nascimento = data_nascimento;
  if (telefone !== undefined) usuario.telefone = telefone;
  if (email !== undefined) usuario.email = email;
  if (senha !== undefined) usuario.senha = senha;

  return res.status(200).json({ mensagem: "Conta atualizada com sucesso." });
};

const deletarContaUsuario = (req, res) => {
  const numeroConta = req.params.numeroConta;
  const contaExistente = dados.contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  });

  if (!contaExistente) {
    return res
      .status(404)
      .json({ mensage: "Servidor não encontrou conta com esse valor" });
  }

  const indiceConta = dados.contas.indexOf(contaExistente);

  const saldo = dados.contas[indiceConta].saldo;

  if (saldo !== 0) {
    return res.status(400).json({
      message: "Não é possível deletar uma conta com saldo positivo",
    });
  }

  if (indiceConta !== -1) {
    dados.contas.splice(indiceConta, 1);
    return res.status(200).json({ mensagem: "Conta excluída com sucesso." });
  }
};

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  const contaExistente = dados.contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!contaExistente) {
    return res
      .status(404)
      .json({ mensage: "Servidor não encontrou conta com esse numero" });
  }

  if (!numero_conta || !valor) {
    return res
      .status(400)
      .json({ mensage: `Campos 'conta' e 'valor' são obrigatórios` });
  }

  if (valor <= 0) {
    return res.status(404).json({
      mensage: "Não é possível realizar um deposito com valor menor que 1",
    });
  }

  contaExistente.saldo += Number(valor);

  dados.depositos.push({
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta: numero_conta,
    valor: valor
  });

  return res
    .status(201)
    .json({
      mensage: "Valor depositado com sucesso ",
      dados: dataTransacao(numero_conta, valor),
    });
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  const contaExistente = dados.contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!contaExistente) {
    return res
      .status(404)
      .json({ mensage: "Servidor não encontrou conta com esse numero" });
  }

  if (!numero_conta || !valor || !senha) {
    return res
      .status(400)
      .json({ mensage: "Campos 'conta', 'valor' e 'senha' são obrigatórios" });
  }

  if (contaExistente.usuario.senha !== senha) {
    return res.status(401).json({
      mensage: "Senha Incorreta",
    });
  }

  if (valor > contaExistente.saldo) {
    return res.status(404).json({
      mensage:
        "Saldo insuficiente! Não é possível realizar um saque com valor maior que o saldo",
    });
  }

  contaExistente.saldo -= Number(valor);

  dados.saques.push({
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta: numero_conta,
    valor: valor
  });

  return res.status(201).json({
    mensage: "Valor sacado com sucesso",
    dados: dataTransacao(numero_conta, valor),
  });
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  const contaExistenteOrigem = dados.contas.find((conta) => {
    return conta.numero === Number(numero_conta_origem);
  });

  let contaExistenteDestino = dados.contas.find((conta) => {
    return conta.numero === Number(numero_conta_destino);
  });

  if (!contaExistenteOrigem || !contaExistenteDestino) {
    return res
      .status(404)
      .json({ mensage: "Servidor não encontrou conta com esse numero" });
  }
  if(numero_conta_origem===numero_conta_destino){
    return res.status(400).json({mensage:'Não é possível tranferir para a mesma conta'})
  }

  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    return res
      .status(400)
      .json({
        mensage:
          "Campos 'conta de origem', 'conta de destino', 'valor' e 'senha' são obrigatórios",
      });
  }
 
  if (contaExistenteOrigem.usuario.senha !== senha) {
    return res.status(401).json({
      mensage: "Senha Incorreta",
    });
  }

  if (valor > contaExistenteOrigem.saldo) {
    return res.status(400).json({
      mensage:
        "Saldo insuficiente! Não é possível realizar uma transferência de valor maior que o saldo",
    });
  }

  contaExistenteOrigem.saldo -= Number(valor);
  contaExistenteDestino.saldo += Number(valor);

  dados.transferencias.push({
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta_origem: contaExistenteOrigem.numero,
    numero_conta_destino: contaExistenteDestino.numero,
    valor: valor
  });

  return res.status(201).json({
    mensage: "Valor transferido com sucesso",
    dados: dataTransacaoTranferencia(
      numero_conta_origem,
      numero_conta_destino,
      valor
    ),
  });
};

const consultaSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;
  const contaExistente = dados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );

  if (!numero_conta || !senha) {
    return res
      .status(400)
      .json({ mensage: "Campos 'numero da conta 'senha' são obrigatórios" });
  }

  if (!contaExistente) {
    return res
      .status(404)
      .json({ mensage: "Servidor não encontrou conta com esse numero" });
  }

  if (contaExistente.usuario.senha !== senha) {
    return res.status(401).json({
      mensage: "Senha Incorreta",
    });
  }

  const saldo = contaExistente.saldo;

  return res
    .status(200)
    .json({ mensage: "Operação concluída com sucesso", saldo: saldo });
};

const extrato = (req, res) => {
  const { numeroConta, senha } = req.query;
  const contaExistente = dados.contas.find(
    (conta) => conta.numero === Number(numeroConta)
  );

  if (!numeroConta || !senha ) {
    return res
      .status(400)
      .json({ message: "Campos 'numero da conta' e 'senha' são obrigatórios" });
  }

  if (!contaExistente){
    return res.status(404).json({ mensage:'Servidor não encontrou conta com esse numero' });
  }

  if (contaExistente.usuario.senha !== senha) {
    return res.status(401).json({
      message: "Senha Incorreta",
    });
  }

  const depositos = dados.depositos.filter(deposito => deposito.numero_conta === numeroConta);
  const saques = dados.saques.filter(saques => saques.numero_conta ===numeroConta);
  const transferenciasEnviadas = dados.transferencias.filter(transferencia => transferencia.numero_conta_origem === Number(numeroConta));
  const transferenciasRecebidas = dados.transferencias.filter(transferencia => transferencia.numero_conta_destino === Number(numeroConta));

  const extrato = {
    depositos,
    saques,
    transferenciasEnviadas,
    transferenciasRecebidas
  };

  return res
    .status(200)
    .json({ message: "Extrato obtido com sucesso", extrato: extrato });
};

module.exports = {
  listarContas,
  criarContas,
  atualizarContaUsuario,
  deletarContaUsuario,
  depositar,
  sacar,
  transferir,
  consultaSaldo,
  extrato,
};