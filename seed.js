const axios = require('axios');
const Aluno = require('./models/aluno');
const Oficina = require('./models/oficina');
const Professor = require('./models/professor');

const BASE_URL = 'http://localhost:3000';

async function seed() {
  try {
    console.log('Deletando dados existentes para criação do novo banco...');
    await Aluno.deleteMany();
    await Oficina.deleteMany();
    await Professor.deleteMany();

    console.log('Criando alunos...');

    const aluno1 = await axios.post(`${BASE_URL}/alunos`, {
      user: { email: 'a1@email.com', senha: '123' },
      periodo: 1,
      ra: 101
    });

    const aluno2 = await axios.post(`${BASE_URL}/alunos`, {
      user: { email: 'a2@email.com', senha: '123' },
      periodo: 2,
      ra: 102
    });

    const aluno3 = await axios.post(`${BASE_URL}/alunos`, {
      user: { email: 'a3@email.com', senha: '123' },
      periodo: 3,
      ra: 103
    });

    console.log('Criando oficina...');

    const oficina = await axios.post(`${BASE_URL}/oficinas`, {
      id: 1,
      nome: 'Oficina de Lógica',
      alunos: [
        aluno1.data._id,
        aluno2.data._id,
        aluno3.data._id
      ]
    });

    console.log('Criando professor...');

    await axios.post(`${BASE_URL}/professores`, {
      idP: 1001,
      user: { email: 'prof@email.com', senha: 'senha123' },
      oficinas: [oficina.data._id]
    });

    console.log('Seed finalizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar seed:', error.message);
    process.exit(1);
  }
}

seed();