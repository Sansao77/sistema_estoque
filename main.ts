import { Produto } from "./app/classes/classes.ts";

export function menu(){
  console.log("Sistemas de Monitoramento de Pedidos em Estoque");
  console.log("1 - Cadastrar Produto");
  console.log("2 - Registrar Entrada");
  console.log("3 - Registrar Saida");
  console.log("4 - Gerar relatório de estoque");
  console.log("5 - Sair do sistema");

  const resposta = Number(prompt("R: "));

  return resposta;
}

function cadastrarProduto(){
  console.log("\nCadastro de Novo Produto:");
  let nome:string | null, codigo: string | null, preco: number, quantidade: number;

  while(true){

    console.log("Qual o Nome do produto?");
    nome = prompt("R: ");

    try{
      if(nome?.trim().length === 0){
        throw new Error('O nome não pode estar vazio. Tente novamente');
      }
    }
    catch(error){
      console.log("\nERROR: ", (error as Error).message + "\n");
      continue;
    }

    break;
  }

  while(true){
    console.log("Qual o Código do produto?");
    codigo = prompt("R: ");

    try{
      if(codigo?.trim().length === 0){
        throw new Error('O nome não pode estar vazio. Tente novamente');
      }
    }
    catch(error){
      console.log("\nERROR: " + (error as Error).message + "\n");
      continue;
    }

    break;
  }
  
  while(true){
    console.log("Qual o Preço do produto?");
    preco = Number(prompt("R: "));

    try{
      if(Number.isNaN(preco) || preco <= 0){
        throw new Error('O valor de preço não pode ser 0 ou menor, nem vazio. Tente novamente');
      }
    }
    catch(error){
      console.log("\nERROR: " + (error as Error).message + "\n");
      continue;
    }

    break;
  }

  while(true){
    console.log("Qual a Quantidade Inicial do produto?");
    quantidade = Number(prompt("R: "));

    try{
      if(Number.isNaN(quantidade) || quantidade < 5){
        throw new Error('A quantidade deve ser no mínimo 5 unidades. Tente novamente');
      }
    }
    catch(error){
      console.log("\nERROR: " + (error as Error).message + "\n");
      continue;
    }

    break;
  }

  const produto = new Produto(nome, codigo, preco, quantidade);
  console.log(produto);
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  switch(menu()){
    case 1: cadastrarProduto();
  }
}
