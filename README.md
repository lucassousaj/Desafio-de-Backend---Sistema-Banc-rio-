<h1>Gerenciador de Finanças Pessoais</h1>
O projeto "DinDin" é um sistema de gerenciamento de finanças pessoais que permite aos usuários realizar o controle de suas transações financeiras.
Ele oferece funcionalidades como o cadastro de usuários, categorias e transações, além de permitir que os usuários detalhem, cadastrem, atualizem 
e excluam transações. O sistema também fornece um resumo do extrato financeiro do usuário, separando transações em entradas e saídas.
O projeto é desenvolvido em Node.js com o uso do framework Express e utiliza um banco de dados PostgreSQL para armazenar informações de usuários, 
categorias e transações. A segurança é mantida com a criptografia de senhas, autenticação via token JWT e autorização para acessar recursos específicos.

Os controladores intermediários implementados asseguram a validação e autorização das operações, garantindo que apenas usuários autenticados e 
autorizados possam acessar determinadas funcionalidades. O sistema também verifica se um email já está cadastrado antes de permitir um novo registro.

Em resumo, o "DinDin" é um aplicativo de gerenciamento financeiro pessoal que ajuda os usuários a controlar suas despesas e receitas, categorizar 
transações e manter um extrato detalhado de suas atividades financeiras. Você pode encontrá-lo neste repositório git: [https://github.com/lucassousaj/desafio-backend-03-dindin-dbe-t03#:~:text=Settings-,desafio%2Dbackend%2D03%2Ddindin%2Ddbe%2Dt03,-Private](https://github.com/lucassousaj/desafio-backend-03-dindin-dbe-t03)

## Instalação

Para executar este projeto, você precisará ter as seguintes dependências instaladas:

- [bcrypt](https://www.npmjs.com/package/bcrypt) - Versão 5.1.1

- [express](https://www.npmjs.com/package/express) - Versão 4.18.2

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Versão 9.0.2

- [pg](https://www.npmjs.com/package/pg) - Versão 8.11.3


Além disso, você também deve instalar as dependências de desenvolvimento:

- [nodemon](https://www.npmjs.com/package/nodemon) - Versão 3.0.1
  
  ```
  npm install -D nodemon
  ```

## Como Instalar

1. Clone este repositório em sua máquina local.
2. Abra o terminal na pasta do projeto.
3. Execute o seguinte comando para instalar as dependências:
   
- **npm install**
  
Isso instalará as dependências e as devDependencies listadas no arquivo `package.json`.

## Conectando ao banco de dados PostgreSQL

Antes de executar o projeto, é importante configurar a conexão com o banco de dados PostgreSQL. Certifique-se de ter o PostgreSQL instalado em seu ambiente.

1. Crie um banco de dados no PostgreSQL com o nome "dindin" usando o seguinte comando SQL:

   ```sql
   create database dindin;

Após criar o banco de dados, você precisará definir as informações de conexão no projeto. Para fazer isso, localize o arquivo conexao.js na pasta do projeto
e atualize as informações de conexão, como nome de usuário, senha, host e porta de acordo com as configurações do seu banco de dados PostgreSQL.
```
const { Pool } = require("pg");
const pool = new Pool({
  database: "dindin", // Nome do banco de dados
  user: "seu_usuario", // Nome de usuário do PostgreSQL
  password: "sua_senha", // Senha do PostgreSQL
  host: "localhost", // Host do banco de dados
  port: 5432, // Porta do PostgreSQL
});
module.exports = pool;
```


## Como Executar
Depois de instalar as dependências, você pode executar o projeto usando o seguinte comando:

- **npm run dev**

Isso iniciará o servidor local usando o Nodemon.

Certifique-se de configurar outras variáveis de ambiente necessárias antes de executar o projeto, se houver alguma.
## Modelo de disposição do projeto
[![arquitetura-dindin.png](https://i.postimg.cc/s2XgYShc/arquitetura-dindin.png)](https://postimg.cc/xXwQYXgJ)


