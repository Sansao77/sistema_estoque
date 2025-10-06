import { DatabaseSync } from "node:sqlite";
import { Entrada, Produto, Saida } from "../classes/classes.ts";
import { IProduto } from "../classes/interfaces.ts";

const url_db = "app/data/estoque.db"

function getProdutosContagem(){
    const db = new DatabaseSync(url_db);

    try{
        const data = db.prepare("SELECT COUNT(*) FROM produtos").get() as {"COUNT(*)": number};

        db.close();
        return data["COUNT(*)"];
    }
    catch(error){
        console.log("\nNão foi possível pegar os dados de produtos")
        console.log("ERROR: " + (error as Error).message);
    }
}

export function getProdutoByNome(nome: string){
    const db = new DatabaseSync(url_db);

    try{
        const data = db.prepare("SELECT * FROM produtos WHERE nome = ?").get(nome) as IProduto | undefined;

        const produto = new Produto(data?.nome ?? "", data?.codigo ?? "", data?.preco ?? 0, data?.quantidade ?? 0, data?.id);

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
        const data = db.prepare("SELECT * FROM produtos").all();

        const plainData:IProduto[] | undefined = JSON.parse(JSON.stringify(data));

        console.log(plainData);


        if(plainData === undefined){
            console.log("\nO estoque está vazio no momento");
            db.close()

            return;
        }

        const produtos:Produto[] = plainData.map(item => new Produto(item.nome, item.codigo, item.preco, item.quantidade, item.id));

        console.log("\nLogs do Estoque:\n")
        console.log("Quantidade de Produtos: " + getProdutosContagem());

        produtos?.forEach((produto) =>{
            console.log("\nID: " + produto.getID());
            console.log("   Nome: " + produto.getNome());
            console.log("   Código: " + produto.getCodigo());
            console.log("   Preço: " + produto.getPreco());
            console.log("   Quantidade: " + produto.getQuantidade());
        })
    }
    catch(error){
        console.log("\nNão foi possível pegar os dados do Estoque");
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