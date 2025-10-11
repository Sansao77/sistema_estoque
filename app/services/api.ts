import { DatabaseSync } from "node:sqlite";
import { Entrada, Produto, Saida } from "../classes/classes.ts";
import { IProduto } from "../classes/interfaces.ts";

const url_db = "app/data/estoque.db";

function getProdutosContagem() {
  const db = new DatabaseSync(url_db);

  try {
    const data = db.prepare("SELECT COUNT(*) FROM produtos").get() as {
      "COUNT(*)": number;
    };

    return data["COUNT(*)"];
  } catch (error) {
    console.log("\nNão foi possível pegar os dados de produtos");
    console.log("ERROR: " + (error as Error).message);
  } finally {
    db.close();
  }
}

function getEstoqueValorTotal() {
  const db = new DatabaseSync(url_db);

  try {
    const data = db.prepare("SELECT SUM(valor_total) FROM produtos").get() as {
      "SUM(valor_total)": number;
    };

    return data["SUM(valor_total)"];
  } catch (error) {
    console.log("\nNão foi possível pegar os dados de produtos");
    console.log("ERROR: " + (error as Error).message);
  } finally {
    db.close();
  }
}

export function getProdutoByNome(nome: string) {
  const db = new DatabaseSync(url_db);

  try {
    const data = db.prepare("SELECT * FROM produtos WHERE nome = ?").get(
      nome,
    ) as IProduto | undefined;

    const produto = new Produto(
      data?.nome ?? "",
      data?.codigo ?? "",
      data?.preco ?? 0,
      data?.quantidade ?? 0,
      data?.valorTotal ?? 0,
      data?.id,
    );

    return produto;
  } catch (error) {
    console.log("\nNão foi possível pegar os dados de produtos");
    console.log("ERROR: " + (error as Error).message);
  } finally {
    db.close();
  }
}

export function getProdutos() {
  const db = new DatabaseSync(url_db);

  try {
    const data = db.prepare("SELECT * FROM produtos").all();

    const plainData: IProduto[] | undefined = JSON.parse(JSON.stringify(data));

    if (plainData === undefined) {
      console.log("\nO estoque está vazio no momento");

      return;
    }

    const produtos: Produto[] = plainData.map((item) =>
      new Produto(
        item.nome,
        item.codigo,
        item.preco,
        item.quantidade,
        item.valorTotal,
        item.id,
      )
    );

    return produtos;
  } catch (error) {
    console.log("\nNão foi possível pegar os dados do Estoque");
    console.log("ERROR: " + (error as Error).message);
  } finally {
    db.close();
  }

  db.close();
}

export function postProduto(produto: Produto) {
  const db = new DatabaseSync(url_db);

  try {
    db
      .prepare(
        "INSERT INTO produtos (nome, codigo, preco, quantidade, valor_total) VALUES (?, ?, ?, ?, ?)",
      )
      .run(
        produto.getNome(),
        produto.getCodigo(),
        produto.getPreco(),
        produto.getQuantidade(),
        produto.getValorTotal(),
      );

    console.log("\nProduto foi armazenado no estoque");
  } catch (error) {
    console.log("\nNão foi possível registrar o produto");
    console.log("ERROR: " + (error as Error).message);
  } finally {
    db.close();
  }
}

export function postEntrada(entrada: Entrada) {
  const db = new DatabaseSync(url_db);

  try {
    db
      .prepare("INSERT INTO entradas (produto_id, quantidade) VALUES (?, ?)")
      .run(entrada.getProduto().getID() ?? 0, entrada.getQuantidade());

    const resultado = entrada.getProduto().getQuantidade() +
      entrada.getQuantidade();

    db.prepare(
      "UPDATE produtos SET quantidade = ?, valor_total = ? WHERE id = ?",
    ).run(
      resultado,
      entrada.getProduto().getPreco() * resultado,
      entrada.getProduto().getID() ?? 0,
    );

    console.log("\nEntrada do produto foi registrada");
  } catch (error) {
    console.log("\nNão foi possível registrar a entrada do produto");
    console.log("ERROR: " + (error as Error).message);
  } finally {
    db.close();
  }
}

export function postSaida(saida: Saida) {
  const db = new DatabaseSync(url_db);

  try {
    db
      .prepare("INSERT INTO saidas (produto_id, quantidade) VALUES (?, ?)")
      .run(saida.getProduto().getID() ?? 0, saida.getQuantidade());

    const resultado = saida.getProduto().getQuantidade() -
      saida.getQuantidade();

    db.prepare(
      "UPDATE produtos SET quantidade = ?, valor_total = ? WHERE id = ?",
    ).run(
      resultado,
      saida.getProduto().getPreco() * resultado,
      saida.getProduto().getID() ?? 0,
    );

    console.log("\nSaida do produto foi registrada");

    if (resultado < 5) {
      console.log(
        "ALERTA: O produto " + saida.getProduto().getNome() +
          " está com quantidade abaixo do limite!",
      );
      console.log(
        "ALERTA: é necessário adicionar mais " + (5 - resultado) +
          " para o estoque ficar com quantidade adequada",
      );
    }
  } catch (error) {
    console.log("\nNão foi possível registrar a saida do produto");
    console.log("ERROR: " + (error as Error).message);
  } finally {
    db.close();
  }
}

export function listarProdutosNomes() {
  const produtos: Produto[] | undefined = getProdutos();
  console.log("\nLista de Produtos Cadastrados (Nomes):");
  produtos?.forEach((produto) => {
    console.log("   - " + produto.getNome());
  });

  console.log("");
}

export function mostrarLogs() {
  const produtos: Produto[] | undefined = getProdutos();

  console.log("\nLogs do Estoque");
  console.log("Quantidade de Produtos: " + getProdutosContagem());

  if (produtos?.length !== 0) {
    console.log(
      "Valor Total do Estoque: R$ " + getEstoqueValorTotal()?.toFixed(2),
    );
    console.log("Lista de Produtos Cadastrados");

    produtos?.forEach((produto) => {
      console.log("\nID: " + produto.getID());
      console.log("   Nome: " + produto.getNome());
      console.log("   Código: " + produto.getCodigo());
      console.log("   Preço: R$" + produto.getPreco().toFixed(2));
      console.log("   Quantidade: " + produto.getQuantidade());
    });
  } else {
    console.log("Nenhum produto cadastrado");
  }
}
