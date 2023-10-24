const { format } = require("date-fns");
const dataTransacao = (numero_conta, valor) => {
  const dadosTransacao = {
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta: "",
    valor,
  };
  dadosTransacao.numero_conta = numero_conta;
  dadosTransacao.valor = valor;
  return dadosTransacao;
};

const dataTransacaoTranferencia = (
  numero_conta_origem,
  numero_conta_destino,
  valor
) => {
  const dadosTransacao = {
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta_origem: "",
    numero_conta_destino: "",
    valor,
  };
  dadosTransacao.numero_conta_origem = numero_conta_origem;
  dadosTransacao.numero_conta_destino = numero_conta_destino;
  dadosTransacao.valor = valor;
  return dadosTransacao;
};

module.exports = { dataTransacao, dataTransacaoTranferencia };
