import { Entrada, Produto, Saida } from "./app/classes/classes.ts";
import {
  getProdutoByNome,
  getProdutos,
  listarProdutosNomes,
  mostrarLogs,
  postEntrada,
  postProduto,
  postSaida,
} from "./app/services/api.ts";

export function menu() {
  console.log("\nSistemas de Monitoramento de Pedidos em Estoque");
  console.log("1 - Cadastrar Produto");
  console.log("2 - Registrar Entrada");
  console.log("3 - Registrar Saida");
  console.log("4 - Gerar relatório de estoque");
  console.log("5 - Sair do sistema");

  const resposta = Number(prompt("R:"));

  return resposta;
}

function cadastrarProduto() {
  let nome: string | undefined | null,
    codigo: string | undefined | null,
    preco: number,
    quantidade: number;

  console.log("\nCadastro de Novo Produto:");
  listarProdutosNomes();

  while (true) {
    console.log("Qual o Nome do produto?");
    nome = prompt("R:");

    try {
      if (nome?.trim().length === 0) {
        throw new Error("O nome não pode estar vazio. Tente novamente");
      }

      if (getProdutoByNome(nome ?? "")?.getNome() !== "") {
        throw new Error("O produto já está registrado no estoque, tente outro");
      }
    } catch (error) {
      console.log("\nERROR:", (error as Error).message + "\n");
      continue;
    }

    nome = nome?.trim().toLowerCase();

    break;
  }

  while (true) {
    console.log("Qual o Código do produto?");
    codigo = prompt("R:");

    try {
      if (codigo?.trim().length === 0) {
        throw new Error("O nome não pode estar vazio. Tente novamente");
      }
    } catch (error) {
      console.log("\nERROR:" + (error as Error).message + "\n");
      continue;
    }

    codigo = codigo?.trim().toLowerCase();

    break;
  }

  while (true) {
    console.log("Qual o Preço do produto?");
    preco = Number(prompt("R:"));

    try {
      if (Number.isNaN(preco) || preco <= 0) {
        throw new Error(
          "O valor de preço não pode ser 0 ou menor, nem vazio. Tente novamente",
        );
      }
    } catch (error) {
      console.log("\nERROR:" + (error as Error).message + "\n");
      continue;
    }

    break;
  }

  while (true) {
    console.log("Qual a Quantidade Inicial do produto?");
    quantidade = Number(prompt("R:"));

    try {
      if (Number.isNaN(quantidade) || quantidade < 5) {
        throw new Error(
          "A quantidade deve ser no mínimo 5 unidades. Tente novamente",
        );
      }
    } catch (error) {
      console.log("\nERROR:" + (error as Error).message + "\n");
      continue;
    }

    break;
  }

  const produto = new Produto(
    nome || "",
    codigo || "",
    preco,
    quantidade,
    preco * quantidade,
  );
  postProduto(produto);
}

function registrarEntrada() {
  if (getProdutos()?.length === 0) {
    console.log(
      "\nALERTA: Não existem produtos cadastrados, por favor cadastre antes de registrar entrada",
    );
    return;
  }

  let nome: string, quantidade: number, produto: Produto | undefined;

  console.log("\nRegistrar entrada no Estoque:");
  listarProdutosNomes();

  while (true) {
    console.log("Qual o nome do produto que vai entrar?");
    nome = prompt("R:") ?? "";

    try {
      if (nome?.trim().length === 0) {
        throw new Error("O nome não pode estar vazio. Tente novamente");
      }

      if (getProdutoByNome(nome)?.getNome() === "") {
        throw new Error("O produto não existe na lista, coloque outro produto");
      }
    } catch (error) {
      console.log("\nERROR:", (error as Error).message + "\n");
      continue;
    }

    produto = getProdutoByNome(nome);

    break;
  }

  while (true) {
    console.log("Qual a quantidade que vai entrar do produto?");
    quantidade = Number(prompt("R:"));

    try {
      if (Number.isNaN(quantidade) || quantidade < 0) {
        throw new Error(
          "Esse input não é válido, são aceito somente números inteiros positivos",
        );
      }
    } catch (error) {
      console.log("\nERROR:" + (error as Error).message + "\n");
      continue;
    }

    break;
  }

  if (produto !== undefined) {
    const entrada = new Entrada(produto, quantidade);

    //console.log(entrada);

    postEntrada(entrada);
  } else {
    console.log("Não foi possível realizar a entrada do produto");
  }
}

function registrarSaida() {
  if (getProdutos()?.length === 0) {
    console.log(
      "\nALERTA: Não existem produtos cadastrados, por favor cadastre antes de registrar saida",
    );
    return;
  }
  let nome: string, quantidade: number, produto: Produto | undefined;

  console.log("\nRegistrar saida no Estoque:");
  listarProdutosNomes();

  while (true) {
    console.log("Qual o nome do produto que vai sair?");
    nome = prompt("R:") ?? "";

    try {
      if (nome?.trim().length === 0) {
        throw new Error("O nome não pode estar vazio. Tente novamente");
      }

      if (getProdutoByNome(nome)?.getNome() === "") {
        throw new Error("O produto não existe na lista, coloque outro produto");
      }
    } catch (error) {
      console.log("\nERROR:", (error as Error).message + "\n");
      continue;
    }

    produto = getProdutoByNome(nome);

    break;
  }

  while (true) {
    console.log(
      "Qual a quantidade que vai sair do produto? (em estoque: " +
        produto?.getQuantidade() + ")",
    );
    quantidade = Number(prompt("R:"));

    try {
      if (Number.isNaN(quantidade) || quantidade < 0) {
        throw new Error(
          "Esse input não é válido, são aceito somente números inteiros positivos",
        );
      }

      if (quantidade > (produto?.getQuantidade() ?? 0)) {
        throw new Error(
          "A quantidade que vai sair não pode ser maior que a quantidade no estoque. Tente outro valor",
        );
      }
    } catch (error) {
      console.log("\nERROR:" + (error as Error).message + "\n");
      continue;
    }

    break;
  }

  if (produto !== undefined) {
    const saida = new Saida(produto, quantidade);

    postSaida(saida);
  } else {
    console.log("Não foi possível realizar a entrada do produto");
  }
}

function relatorioLogs() {
  mostrarLogs();
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  let continuar = true;

  do {
    switch (menu()) {
      case 1:
        cadastrarProduto();
        break;

      case 2:
        registrarEntrada();
        break;

      case 3:
        registrarSaida();
        break;

      case 4:
        relatorioLogs();
        break;

      case 5:
        console.log(
          "\nTERMINANDO O PROCESSO DE ESTOQUE, OBRIGADO E VOLTE SEMPRE!\n",
        );
        continuar = false;
        break;
      default:
        console.log("Esse comando não é válido, somente valores de 1 a 5");
    }
  } while (continuar);
}
