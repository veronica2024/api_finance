
const db = require('../config/db'); // Importa a configuração do banco de dados 
const bcrypt = require('bcrypt'); // Importa o bcrypt para criptografar senhas 
const jwt = require('jsonwebtoken'); // Importa o jsonwebtoken para gerar tokens JWT 

//------------------------------------------------- Função para registrar um novo usuário ---------------------------------------------
const registerUser = async (req, res) => { 
 const { name, email, password, birth_date } = req.body; // Desestrutura os dados do corpo da requisição 

 // --------------------------------------Verificar se o usuário já existe no banco de dados ----------------------------------------------


 try { 
 const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', 
[email]); 
 if (existingUser.length > 0) { 
 return res.status(400).send('Usuário já registrado'); 
 } 

 //------------------------------------------------- Criptografar a senha usando bcrypt ---------------------------------------------------


 const hashedPassword = await bcrypt.hash(password, 10); 

 //----------------------------------------------------- Inserir o novo usuário no banco de dados ---------------------------------------------------------


 await db.promise().query( 
 'INSERT INTO users (name, email, password, birth_date) VALUES (?, ?, ?, ?)', 
 [name, email, hashedPassword, birth_date] 
 ); 
 res.status(201).send('Usuário registrado com sucesso'); 
 } catch (err) { 
 console.error('Erro ao registrar usuário:', err); 
 res.status(500).send('Erro ao registrar usuário'); 
 } 
}; 

//---------------------------------------------------- Função para autenticar um usuário -----------------------------------------


const loginUser = async (req, res) => { 
 const { email, password } = req.body; // Desestrutura os dados do corpo da requisição 

 //----------------------------------------- Verificar se o usuário existe no banco de dados-------------------------------------------------

 try { 
 const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]); 
 if (user.length === 0) { 
 return res.status(400).send('Credenciais inválidas'); 
 } 


 //--------------------------------------- Comparar a senha fornecida com a senha criptografada no banco de dados ---------------------------------------


 const isMatch = await bcrypt.compare(password, user[0].password); 
 if (!isMatch) { 
 return res.status(400).send('Credenciais inválidas'); 
 } 

 //-------------------------------------------------------- Gerar um token JWT -----------------------------------------------


 const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
 res.json({ token }); 
 } catch (err) { 
 console.error('Erro ao autenticar usuário:', err); 
 res.status(500).send('Erro ao autenticar usuário'); 
 } 
}; 



module.exports = { 
 registerUser, 
 loginUser 
};
