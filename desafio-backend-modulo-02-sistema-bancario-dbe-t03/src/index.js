const app = require('./servidor');
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
