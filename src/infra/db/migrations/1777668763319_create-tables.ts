import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('perfil_usuario', ['ADMIN', 'GERENTE', 'ATENDENTE', 'CLIENTE']);
  
  pgm.createTable('usuario', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    nome: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    senha_hash: { type: 'varchar(255)', notNull: true },
    perfil: { type: 'perfil_usuario', notNull: true, default: 'CLIENTE' },
    criado_em: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createTable('unidade', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    nome: { type: 'varchar(255)', notNull: true },
    endereco: { type: 'text', notNull: true },
    criado_em: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createTable('produto', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    nome: { type: 'varchar(255)', notNull: true },
    descricao: { type: 'text', notNull: false },
    preco: { type: 'numeric(10, 2)', notNull: true },
    estoque_total: { type: 'integer', notNull: true, default: 0 },
    criado_em: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createType('status_pedido', [
    'AGUARDANDO_PAGAMENTO',
    'RECEBIDO',
    'EM_PREPARACAO',
    'PRONTO',
    'FINALIZADO',
    'CANCELADO'
  ]);

  pgm.createType('canal_pedido', ['APP', 'TOTEM', 'WEB']);

  pgm.createTable('pedido', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    usuario_id: { type: 'uuid', notNull: true, references: '"usuario"(id)' },
    unidade_id: { type: 'uuid', notNull: true, references: '"unidade"(id)' },
    status: { type: 'status_pedido', notNull: true, default: 'AGUARDANDO_PAGAMENTO' },
    canal: { type: 'canal_pedido', notNull: true },
    total: { type: 'numeric(10, 2)', notNull: true },
    data_criacao: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createTable('item_pedido', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    pedido_id: { type: 'uuid', notNull: true, references: '"pedido"(id)', onDelete: 'CASCADE' },
    produto_id: { type: 'uuid', notNull: true, references: '"produto"(id)' },
    quantidade: { type: 'integer', notNull: true },
    preco_unitario: { type: 'numeric(10, 2)', notNull: true },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('item_pedido');
  pgm.dropTable('pedido');
  pgm.dropType('canal_pedido');
  pgm.dropType('status_pedido');
  pgm.dropTable('produto');
  pgm.dropTable('unidade');
  pgm.dropTable('usuario');
  pgm.dropType('perfil_usuario');
}
