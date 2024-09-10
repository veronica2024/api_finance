
const dotenv = require('dotenv'); // Importa o pacote dotenv para gerenciar variáveis de ambiente


//--------------------------------Configurar as Variáveis de ambiente-----------------------------------


dotenv.config(); // Carrega as variáveis definidas no arquivo '.env' para process.env(processos)


//------------------------------------------Importar as Bibliotecas-----------------------------------------------


const express = require('express'); // Importa o framework Express
const cors = require('cors'); // Importa o pacote cors para permitir requisições de diferentes origens
const bodyParser = require('body-parser'); // Importa o pacote body-parser para analisar o corpo das requisições HTTP

const db = require('./config/db'); // Importa a conexão com o banco de dados

//------------------------------- Importar as rotas de transações e autenticação ---------------------------------------------

const transactionsRoutes = require('./routes/transactions'); // Importa as rotas de transações 
const authRoutes = require('./routes/auth'); // Importa as rotas de autenticação 


//-------------------------------------inicializar nova aplicação Express----------------------------------------------------

const app = express(); // Inicializa uma nova aplicação Express


//-------------------------------------------configurar o CORS e o bady-Parse-----------------------------------------------------

app.use(cors()); // Habilita o CORS para todas as rotas
app.use(bodyParser.json()); // Configura o body-parser para analisar requisições JSON


// --------------------------------Usar as rotas de transações e autenticação para as requisições ----------------------------------------------
app.use('/api/transactions', transactionsRoutes); // Configura o servidor para usar as rotas de transações 
app.use('/api/auth', authRoutes); // Configura o servidor para usar as rotas de autenticação


//---------------------------------------------Rota inicial para testar o servidor-------------------------------------------------

app.get('/', (req, res) => {
    res.send(`Servidor está rodando na porta ${PORT}`); // Define uma rota inicial para testar o servidor
  });



//--------------------------Configurar o servidor para uma porta específica----------------------------------------


const PORT = process.env.PORT || 3000; // Define a porta a partir da variável de ambiente ou usa a porta 3000 como padrão
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); // Loga uma mensagem informando que o servidor está rodando
});