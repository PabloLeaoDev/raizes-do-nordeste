import database from "@src/infra/db/database";
import * as bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("Iniciando seed...");
    await database.query({ text: "BEGIN" });

    const passwordHash = await bcrypt.hash("admin123", 10);
    const adminRes = await database.query({
      text: `
      INSERT INTO usuario (nome, email, senha_hash, perfil)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `,
      values: ["Administrador", "admin@raizes.com", passwordHash, "ADMIN"],
    });

    if (adminRes.rows.length > 0) {
      console.log("Admin inserido com sucesso.");
    } else {
      console.log("Admin já existente.");
    }

    await database.query({
      text: `
      INSERT INTO unidade (nome, endereco) VALUES 
      ('Raízes - Centro', 'Rua Central, 123'),
      ('Raízes - Shopping', 'Av das Compras, 456')
    `,
    });
    console.log("Unidades inseridas.");

    const unitRes = await database.query({ text: `SELECT id FROM unidade` });
    const unitIds = unitRes.rows.map((row) => row.id as string);

    await database.query({
      text: `
      INSERT INTO produto (nome, descricao, preco, estoque_total, unidade_id) VALUES 
      ('Tapioca de Carne de Sol', 'Deliciosa tapioca recheada com carne de sol', 15.90, 100, $1),
      ('Cuscuz com Queijo', 'Clássico cuscuz nordestino com queijo coalho', 12.50, 50, $2),
      ('Bolo de Rolo', 'Autêntico bolo de rolo pernambucano', 8.00, 20, $3)
    `,
      values: [unitIds[0], unitIds[1], unitIds[0]],
    });
    console.log("Produtos inseridos.");

    await database.query({ text: "COMMIT" });
    console.log("Seed concluído com sucesso!");
  } catch (error) {
    await database.query({ text: "ROLLBACK" });
    console.error("Erro no seed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
