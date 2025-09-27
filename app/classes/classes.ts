export class Produto{
    constructor(
        private nome: string | null,
        private codigo: string | null,
        private preco: number,
        private quantidade: number
    ){}

    getNome(){ return this.nome; }

    setNome(nome: string){ this.nome = nome; }

    getCodigo(){ return this.codigo; }

    setCodigo(codigo: string){ this.codigo = codigo; }

    getPreco(){ return this.preco; }

    setPreco(preco: number){ this.preco = preco; }

    getQuantidade(){ return this.quantidade; }

    setQuantidade(quantidade: number){ this.quantidade = quantidade; }
}

abstract class Movimentacao{

}

class Entrada extends Movimentacao{

}

class Saida extends Movimentacao{

}

class Estoque{
    constructor(private produtos?: Produto[]){}

    getProdutos(){ return this.produtos; }

    setProdutos(produtos: Produto[]){ this.produtos = produtos; }
}