import { DatabaseSync } from "node:sqlite";
import { Entrada, Produto, Saida } from "../classes/classes.ts";
import { IProduto } from "../classes/interfaces.ts";

const url_db = "app/data/estoque.db"

export function getProdutoByNome(nome: string){
    const db = new DatabaseSync(url_db);

    try{
        const data = db.prepare("SELECT * FROM produtos WHERE nome = ?").get(nome) as IProduto | undefined;

        const produto = new Produto(data?.nome ?? "", data?.codigo ?? "", data?.preco ?? 0, data?.quantidade ?? 0, data?.id)

        db.close();
        return produto
    }
    catch(error){
        console.log("\nNão foi possível pegar os dados de produtos")
        console.log("ERROR: " + (error as Error).message);
    }

}

export function getProdutos(){
    const db = new DatabaseSync(url_db);

    try{
        const data = JSON.stringify(db.prepare("SELECT * FROM produtos").all());

        const produtos = JSON.parse(data) as IProduto[];

        if(produtos.length === 0){
            console.log("\nO estoque está vazio no momento");
            db.close()

            return;
        }

        produtos.forEach((produto) =>{
            console.log("\nID: " + produto.id);
            console.log("Nome: " + produto.nome);
            console.log("Código: " + produto.codigo);
            console.log("Preço: " + produto.preco);
            console.log("Quantidade: " + produto.quantidade);
        })
    }
    catch(error){
        console.log("\nNão foi possível pegar os dados de produtos");
        console.log("ERROR: " + (error as Error).message);
    }

    db.close();
}


export function postProduto(produto: Produto){
    const db = new DatabaseSync(url_db);

    try{
        db
        .prepare("INSERT INTO produtos (nome, codigo, preco, quantidade) VALUES (?, ?, ?, ?)")
        .run(produto.getNome(), produto.getCodigo(), produto.getPreco(), produto.getQuantidade());

        console.log("\nProduto foi armazenado no estoque")
    }
    catch(error){
        console.log("\nNão foi possível registrar o produto")
        console.log("ERROR: " + (error as Error).message);
    }

    db.close();
}

export function postEntrada(entrada: Entrada){
    const db = new DatabaseSync(url_db);

    try{
        db
        .prepare("INSERT INTO entradas (produto_id, quantidade) VALUES (?, ?)")
        .run(entrada.getProduto().getID() ?? 0, entrada.getQuantidade());

        const resultado = entrada.getProduto().getQuantidade() + entrada.getQuantidade();

        console.log("Teste");

        db.prepare("UPDATE produtos SET quantidade = ? WHERE id = ?").run(resultado, entrada.getProduto().getID() ?? 0);
        console.log("\nEntrada do produto foi registrada");
    }
    catch(error){
        console.log("\nNão foi possível registrar a entrada do produto")
        console.log("ERROR: " + (error as Error).message);
    }

    db.close();
}

export function postSaida(saida: Saida){
    const db = new DatabaseSync(url_db);

    try{
        db
        .prepare("INSERT INTO saidas (produto_id, quantidade) VALUES (?, ?)")
        .run(saida.getProduto().getID() ?? 0, saida.getQuantidade());

        const resultado = saida.getProduto().getQuantidade() - saida.getQuantidade();

        console.log("Teste");

        db.prepare("UPDATE produtos SET quantidade = ? WHERE id = ?").run(resultado, saida.getProduto().getID() ?? 0);
        console.log("\nSaida do produto foi registrada");
    }
    catch(error){
        console.log("\nNão foi possível registrar a saida do produto")
        console.log("ERROR: " + (error as Error).message);
    }

    db.close();
}