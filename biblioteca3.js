let biblioteca = [];
let livroParaAlterar = null;
let livroParaEmprestar = null;
let livroParaVenda = null;
let vendas = [];

function mostrarSecao(secao) {
  document.getElementById("cadastro").classList.add("hidden");
  document.getElementById("consulta").classList.add("hidden");
  document.getElementById("alterar").classList.add("hidden");
  document.getElementById("emprestar").classList.add("hidden");
  document.getElementById("emprestados").classList.add("hidden");
  document.getElementById("venda").classList.add("hidden");
  document.getElementById("relatorio-vendas").classList.add("hidden");

  document.getElementById(secao).classList.remove("hidden");

  if (secao === "relatorio-vendas") {
    atualizarRelatorioVendas();
  } else if (secao === "consulta") {
    atualizarlista();
  } else if (secao === "emprestados") {
    atualizarListaEmprestados();
  }
}

function adicionarLivro() {
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const ano = document.getElementById("ano").value;
  const quantidade = parseInt(document.getElementById("quantidade").value) || 1;

  if (titulo && autor && ano) {
    biblioteca.push({
      titulo: titulo,
      autor: autor,
      ano: ano,
      quantidade: quantidade,
      emprestado: null
    });
    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("ano").value = "";
    document.getElementById("quantidade").value = "1";
    atualizarlista();
    alert("Livro adicionado com sucesso!");
  } else {
    alert("Preencha todos os campos!");
  }
}

function buscarLivro() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const resultados = biblioteca.filter((livro) =>
    livro.titulo.toLowerCase().includes(busca)
  );
  atualizarlista(resultados);
}

function buscarLivroParaAlterar() {
  const busca = document.getElementById("titulo-alterar").value.toLowerCase();
  livroParaAlterar = biblioteca.find((livro) =>
    livro.titulo.toLowerCase().includes(busca)
  );
  if (livroParaAlterar) {
    document.getElementById("novo-titulo").value = livroParaAlterar.titulo;
    document.getElementById("novo-autor").value = livroParaAlterar.autor;
    document.getElementById("novo-ano").value = livroParaAlterar.ano;
    document.getElementById("nova-quantidade").value = livroParaAlterar.quantidade || 1;
  } else {
    alert("Livro não encontrado!");
  }
}

function atualizarLivro() {
  if (livroParaAlterar) {
    livroParaAlterar.titulo = document.getElementById("novo-titulo").value;
    livroParaAlterar.autor = document.getElementById("novo-autor").value;
    livroParaAlterar.ano = document.getElementById("novo-ano").value;
    livroParaAlterar.quantidade = parseInt(document.getElementById("nova-quantidade").value) || 1;
    atualizarlista();
    alert("Livro alterado com sucesso!");
  }
}

function buscarLivroParaEmprestar() {
  const busca = document.getElementById("busca-emprestar").value.toLowerCase();
  const resultados = biblioteca.filter(livro => 
    livro.titulo.toLowerCase().includes(busca) && !livro.emprestado
  );
  
  const resultadoDiv = document.getElementById("resultado-busca-emprestar");
  resultadoDiv.innerHTML = "";
  
  if (resultados.length > 0) {
    resultados.forEach(livro => {
      const livroDiv = document.createElement("div");
      livroDiv.className = "livro-resultado";
      livroDiv.innerHTML = `
        <p><strong>${livro.titulo}</strong> - ${livro.autor} (${livro.ano})</p>
        <button onclick="selecionarLivroParaEmprestar('${livro.titulo}')">Selecionar</button>
      `;
      resultadoDiv.appendChild(livroDiv);
    });
  } else {
    resultadoDiv.innerHTML = "<p>Nenhum livro disponível encontrado</p>";
  }
}

function selecionarLivroParaEmprestar(titulo) {
  livroParaEmprestar = biblioteca.find(livro => livro.titulo === titulo);
  if (livroParaEmprestar) {
    document.getElementById("form-emprestar").classList.remove("hidden");
  }
}

function realizarEmprestimo() {
  const nomePessoa = document.getElementById("nome-pessoa").value;
  const dataEmprestimo = document.getElementById("data-emprestimo").value;
  const dataDevolucao = document.getElementById("data-devolucao").value;
  
  if (nomePessoa && dataEmprestimo && dataDevolucao && livroParaEmprestar) {
    livroParaEmprestar.emprestado = {
      pessoa: nomePessoa,
      dataEmprestimo: dataEmprestimo,
      dataDevolucao: dataDevolucao
    };
    
    alert(`Livro "${livroParaEmprestar.titulo}" emprestado para ${nomePessoa} com sucesso!`);
    
    // Limpar formulário
    document.getElementById("nome-pessoa").value = "";
    document.getElementById("data-emprestimo").value = "";
    document.getElementById("data-devolucao").value = "";
    document.getElementById("busca-emprestar").value = "";
    document.getElementById("resultado-busca-emprestar").innerHTML = "";
    document.getElementById("form-emprestar").classList.add("hidden");
    
    livroParaEmprestar = null;
    atualizarlista();
  } else {
    alert("Preencha todos os campos!");
  }
}

function atualizarlista(lista = biblioteca) {
  const tabela = document.getElementById("lista-livros");
  tabela.innerHTML = "";
  
  lista.forEach((livro) => {
    const linha = document.createElement("tr");
    const status = livro.emprestado ? 
      `Emprestado para ${livro.emprestado.pessoa} (devolução: ${livro.emprestado.dataDevolucao})` : 
      "Disponível";
    
    linha.innerHTML = `
      <td>${livro.titulo}</td>
      <td>${livro.autor}</td>
      <td>${livro.ano}</td>
      <td>${livro.quantidade || 1}</td>
      <td>${status}</td>
    `;
    tabela.appendChild(linha);
  });
}

function atualizarListaEmprestados() {
  const tabela = document.getElementById("lista-emprestados");
  tabela.innerHTML = "";
  
  const emprestados = biblioteca.filter(livro => livro.emprestado);
  
  emprestados.forEach((livro) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.emprestado.pessoa}</td>
          <td>${livro.emprestado.dataEmprestimo}</td>
          <td>${livro.emprestado.dataDevolucao}</td>
          <td>
              <button onclick="devolverLivro('${livro.titulo}')">Devolver</button>
          </td>
      `;
      tabela.appendChild(linha);
  });
}

function devolverLivro(titulo) {
  const livro = biblioteca.find(l => l.titulo === titulo);
  if (livro) {
      livro.emprestado = null;
      atualizarlista();
      atualizarListaEmprestados();
      alert(`Livro "${titulo}" devolvido com sucesso!`);
  }
}

function buscarLivroParaVenda() {
  const busca = document.getElementById("busca-venda").value.toLowerCase();
  const resultados = biblioteca.filter(livro => 
    livro.titulo.toLowerCase().includes(busca) && 
    (livro.quantidade === undefined || livro.quantidade > 0)
  );

  const resultadoDiv = document.getElementById("resultado-busca-venda");
  resultadoDiv.innerHTML = "";

  if (resultados.length > 0) {
    resultados.forEach(livro => {
      const livroDiv = document.createElement("div");
      livroDiv.className = "livro-resultado";
      livroDiv.innerHTML = `
        <p><strong>${livro.titulo}</strong> - ${livro.autor} (${livro.ano})</p>
        <p>Disponível: ${livro.quantidade || 1}</p>
        <button onclick="selecionarLivroParaVenda('${livro.titulo}')">Selecionar</button>
      `;
      resultadoDiv.appendChild(livroDiv);
    });
  } else {
    resultadoDiv.innerHTML = "<p>Nenhum livro disponível encontrado</p>";
  }
}

function selecionarLivroParaVenda(titulo) {
  livroParaVenda = biblioteca.find(livro => livro.titulo === titulo);
  if (livroParaVenda) {
    document.getElementById("form-venda").classList.remove("hidden");
    document.getElementById("quantidade-venda").max = livroParaVenda.quantidade || 1;
  }
}

function realizarVenda() {
  const quantidade = parseInt(document.getElementById("quantidade-venda").value);

  if (livroParaVenda && quantidade > 0) {
    const qtdDisponivel = livroParaVenda.quantidade || 1;
    
    if (qtdDisponivel >= quantidade) {
      // Atualiza a quantidade do livro
      if (livroParaVenda.quantidade !== undefined) {
        livroParaVenda.quantidade -= quantidade;
      }
      
      // Registra a venda
      vendas.push({
        titulo: livroParaVenda.titulo,
        autor: livroParaVenda.autor,
        quantidade: quantidade
      });

      alert(`Venda de ${quantidade} unidade(s) do livro "${livroParaVenda.titulo}" realizada com sucesso!`);

      // Limpar formulário
      document.getElementById("quantidade-venda").value = "";
      document.getElementById("busca-venda").value = "";
      document.getElementById("resultado-busca-venda").innerHTML = "";
      document.getElementById("form-venda").classList.add("hidden");

      livroParaVenda = null;
      atualizarlista();
    } else {
      alert(`Quantidade insuficiente! Disponível: ${qtdDisponivel}`);
    }
  } else {
    alert("Quantidade inválida ou livro não selecionado!");
  }
}

function atualizarRelatorioVendas() {
  const tabela = document.getElementById("lista-vendas");
  tabela.innerHTML = "";

  vendas.forEach(venda => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${venda.titulo}</td>
      <td>${venda.autor}</td>
      <td>${venda.quantidade}</td>
    `;
    tabela.appendChild(linha);
  });
}

biblioteca = [
  {
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    ano: "1899",
    quantidade: 5,
    emprestado: null
  },
  {
    titulo: "O Senhor dos Anéis",
    autor: "J.R.R. Tolkien",
    ano: "1954",
    quantidade: 3,
    emprestado: null
  }
];