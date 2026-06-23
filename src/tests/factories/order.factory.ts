export const generateOrder = (
  unidade_id: string,
  produto_id: string,
  overrides = {},
) => {
  return {
    unidade_id,
    canal: "APP",
    itens: [
      {
        produto_id,
        quantidade: 2,
      },
    ],
    ...overrides,
  };
};
