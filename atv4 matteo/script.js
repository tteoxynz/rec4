let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

const form = document.getElementById("form-produto");
const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("busca");

const modal = document.getElementById("modal-confirmacao");
const btnSim = document.getElementById("btn-sim");
const btnNao = document.getElementById("btn-nao");

let indexParaRemover = null;

function salvarNoLocalStorage() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function renderizarProdutos(filtrados = null) {
  const lista = filtrados || produtos;

  // Remover itens antigos com fade-out
  const itensAtuais = Array.from(listaProdutos.children);
  itensAtuais.forEach(li => li.classList.add("remover"));

  setTimeout(() => {
    listaProdutos.innerHTML = "";
    if (lista.length === 0) {
      listaProdutos.innerHTML = "<li>Nenhum produto cadastrado.</li>";
      return;
    }

    lista.forEach((produto, index) => {
      const realIndex = filtrados ? produtos.indexOf(produto) : index;
      const item = document.createElement("li");

      // Span com informações
      const span = document.createElement("span");
      span.innerHTML = `<strong>${produto.nome}</strong> - ${produto.quantidade} unidades - R$ ${produto.preco.toFixed(2)}`;

      // Editar ao clicar
      span.addEventListener("click", () => {
        const inputNome = document.createElement("input");
        const inputQuantidade = document.createElement("input");
        const inputPreco = document.createElement("input");
        const btnSalvar = document.createElement("button");
        const btnCancelar = document.createElement("button");

        inputNome.type = "text"; inputNome.value = produto.nome;
        inputQuantidade.type = "number"; inputQuantidade.value = produto.quantidade;
        inputPreco.type = "number"; inputPreco.step = "0.01"; inputPreco.value = produto.preco.toFixed(2);

        btnSalvar.textContent = "Salvar"; btnCancelar.textContent = "Cancelar";

        item.innerHTML = "";
        item.appendChild(inputNome);
        item.appendChild(inputQuantidade);
        item.appendChild(inputPreco);
        item.appendChild(btnSalvar);
        item.appendChild(btnCancelar);

        btnSalvar.addEventListener("click", () => {
          const novoNome = inputNome.value.trim();
          const novaQuantidade = parseInt(inputQuantidade.value);
          const novoPreco = parseFloat(inputPreco.value);

          if (!novoNome || isNaN(novaQuantidade) || isNaN(novoPreco)) {
            alert("Preencha todos os campos corretamente.");
            return;
          }

          produtos[realIndex] = { nome: novoNome, quantidade: novaQuantidade, preco: novoPreco };
          salvarNoLocalStorage();
          filtrarProdutos();
        });

        btnCancelar.addEventListener("click", () => {
          filtrarProdutos();
        });
      });

      // Botão excluir
      const btnExcluir = document.createElement("button");
      btnExcluir.className = "btn-excluir";
      btnExcluir.setAttribute("data-index", realIndex);
      btnExcluir.title = "Remover";
      btnExcluir.textContent = "🗑️";

      item.appendChild(span);
      item.appendChild(btnExcluir);
      listaProdutos.appendChild(item);

      // Fade-in
      setTimeout(() => item.classList.add("mostrar"), 50);

      // Efeito highlight se filtrado
      if (filtrados) {
        item.classList.add("highlight");
        setTimeout(() => item.classList.remove("highlight"), 1200);
      }
    });
  }, 300);
}

// Abrir modal ao clicar na lixeira
listaProdutos.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-excluir")) {
    indexParaRemover = parseInt(e.target.getAttribute("data-index"));
    modal.classList.add("mostrar");
  }
});

// Confirmar exclusão
btnSim.addEventListener("click", () => {
  if (indexParaRemover !== null) {
    const liParaRemover = listaProdutos.querySelector(`li:nth-child(${indexParaRemover + 1})`);
    if (liParaRemover) {
      liParaRemover.classList.add("remover");
      setTimeout(() => {
        produtos.splice(indexParaRemover, 1);
        salvarNoLocalStorage();
        filtrarProdutos();
        indexParaRemover = null;
      }, 400);
    }
  }
  modal.classList.remove("mostrar");
});

// Cancelar exclusão
btnNao.addEventListener("click", () => {
  modal.classList.remove("mostrar");
  indexParaRemover = null;
});

// Cadastro de produtos
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const preco = parseFloat(document.getElementById("preco").value);

  if (!nome || isNaN(quantidade) || isNaN(preco)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  produtos.push({ nome, quantidade, preco });
  salvarNoLocalStorage();
  form.reset();
  filtrarProdutos();
});

// Busca ao vivo
campoBusca.addEventListener("input", filtrarProdutos);

// Filtrar produtos
function filtrarProdutos() {
  const termo = campoBusca.value.toLowerCase().trim();
  if (termo === "") {
    renderizarProdutos();
    return;
  }
  const filtrados = produtos.filter(produto => produto.nome.toLowerCase().includes(termo));
  renderizarProdutos(filtrados);
}

// Inicializa
renderizarProdutos();