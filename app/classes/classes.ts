export class Produto{
    constructor(
        protected nome: string | null,
        protected codigo: string | null,
        protected preco: number,
        protected quantidade: number,
        private id?: number,
    ){}

    getNome(){ return this.nome; }

    setNome(nome: string){ this.nome = nome; }

    getCodigo(){ return this.codigo; }

    setCodigo(codigo: string){ this.codigo = codigo; }

    getPreco(){ return this.preco; }

    setPreco(preco: number){ this.preco = preco; }

    getQuantidade(){ return this.quantidade; }

    setQuantidade(quantidade: number){ this.quantidade = quantidade; }

    getID(){ return this.id; }
}

abstract class Movimentacao{
    constructor(protected produto: Produto, protected quantidade: number){}

    getProduto(){ return this.produto; }

    getQuantidade(){ return this.quantidade; }
}

export class Entrada extends Movimentacao{
    constructor(produto: Produto, quantidade: number){
        super(produto, quantidade)
    }
}

export class Saida extends Movimentacao{
    constructor(produto: Produto, quantidade: number){
        super(produto, quantidade)
    }
}

class Estoque{
    constructor(private produtos?: Produto[]){}

    getProdutos(){ return this.produtos; }

    setProdutos(produtos: Produto[]){ this.produtos = produtos; }
}