export interface IProduto{
    id: number;
    nome: string;
    codigo: string;
    preco: number;
    quantidade: number
}

export interface IMovimentacao{
    produto: IProduto;
    quantidade: number;
}