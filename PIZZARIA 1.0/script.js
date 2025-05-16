let pizzaria = [];
let pizzaParaAlterar = null;

function mostrarSecao(secao) {
  // Esconde todas as seções
  document.getElementById("Cadastro").classList.add("hidden");

  // Mostra a seção selecionada
  document.getElementById(secao).classList.remove("hidden");
}

function adicionarPizza() {
  const nome = document.getElementById("nome").value;
  const ingredientes = document.getElementById("ingredientes").value;
  const preco = parseFloat(document.getElementById("preco").value);
  
  if (nome && ingredientes && preco) {
    pizzaria.push({ nome, ingredientes, preco });
    document.getElementById("nome").value = "";
    document.getElementById("ingredientes").value = "";
    document.getElementById("preco").value = "";
    atualizarLista();
    {mensagem}("Pizza adicionada com sucesso!");
  } else {
    {mensagem}("Por favor, preencha todos os campos.");
  }
}

function buscarPizza() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const resultados = pizzaria.filter((pizza) =>
    pizza.nome.toLowerCase().includes(busca)
  );
  atualizarLista(resultados);
}

function buscarPizzaParaAlterar() {
  const busca = document.getElementById("busca-alterar").value.toLowerCase();
  pizzaParaAlterar = pizzaria.find((pizza) =>
    pizza.nome.toLowerCase().includes(busca)
  );

  if (pizzaParaAlterar) {
    document.getElementById("form-alterar").classList.remove("hidden");
    document.getElementById("novo-nome").value = pizzaParaAlterar.nome;
    document.getElementById("novo-ingredientes").value = pizzaParaAlterar.ingredientes;
    document.getElementById("novo-preco").value = pizzaParaAlterar.preco;
  } else {
    alert("Pizza não encontrada.");
  }
}

function alterarPizza() {
  if (pizzaParaAlterar) {
    const novoNome = document.getElementById("novo-nome").value;
    const novoIngredientes = document.getElementById("novo-ingredientes").value;
    const novoPreco = parseFloat(document.getElementById("novo-preco").value);

    if (novoNome && novoIngredientes && novoPreco) {
      pizzaParaAlterar.nome = novoNome;
      pizzaParaAlterar.ingredientes = novoIngredientes;
      pizzaParaAlterar.preco = novoPreco;

      atualizarLista();
      alert("Pizza alterada com sucesso!");
      document.getElementById("form-alterar").classList.add("hidden");
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  }
}

function atualizarLista(lista = pizzaria) {
  const tabela = document.getElementById("lista-pizzas");
  tabela.innerHTML = "pizza adicionada com sucesso!";

  lista.forEach((pizza) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${pizza.nome}</td>
      <td>${pizza.ingredientes}</td>
      <td>R$ ${pizza.preco.toFixed(2)}</td>
    `;
    tabela.appendChild(linha);
  });
}