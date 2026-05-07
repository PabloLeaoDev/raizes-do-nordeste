import pool from './database';
import * as bcrypt from 'bcrypt';

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Iniciando seed...');
    await client.query('BEGIN');

    // Senha hash para 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Inserir Admin
    const adminRes = await client.query(`
      INSERT INTO usuario (nome, email, senha_hash, perfil)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `, ['Administrador', 'admin@raizes.com', passwordHash, 'ADMIN']);
    
    if (adminRes.rows.length > 0) {
      console.log('Admin inserido com sucesso.');
    } else {
      console.log('Admin já existente.');
    }

    // Inserir Unidades
    await client.query(`
      INSERT INTO unidade (nome, endereco) VALUES 
      ('Raízes - Centro', 'Rua Central, 123'),
      ('Raízes - Shopping', 'Av das Compras, 456')
    `);
    console.log('Unidades inseridas.');

    // Inserir Produtos
    await client.query(`
      INSERT INTO produto (nome, descricao, preco, estoque_total) VALUES 
      ('Tapioca de Carne de Sol', 'Deliciosa tapioca recheada com carne de sol', 15.90, 100),
      ('Cuscuz com Queijo', 'Clássico cuscuz nordestino com queijo coalho', 12.50, 50),
      ('Bolo de Rolo', 'Autêntico bolo de rolo pernambucano', 8.00, 20)
    `);
    console.log('Produtos inseridos.');

    await client.query('COMMIT');
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro no seed:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();
