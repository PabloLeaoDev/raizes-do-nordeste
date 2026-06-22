import { UserProfile, OrderStatus, OrderChannel } from "@src/domain/enums";
export { UserProfile, OrderStatus, OrderChannel };

export interface User {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: UserProfile;
  created_at: Date;
}

export interface Unit {
  id: string;
  nome: string;
  endereco: string;
  created_at: Date;
}

export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque_total: number;
  created_at: Date;
}

export interface OrderItem {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
}

export interface Order {
  id: string;
  usuario_id: string;
  unidade_id: string;
  status: OrderStatus;
  canal: OrderChannel;
  total: number;
  created_at: Date;
  itens?: OrderItem[];
}
