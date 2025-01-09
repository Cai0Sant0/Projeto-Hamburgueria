const menu = document.getElementById("menu");
const btnCarrinho = document.getElementById("cart-btn");
const modalCart = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const precoTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const fechaModal = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const inputEndereco = document.getElementById("address");
const avisoEndereco = document.getElementById("address-warn");

let cart = [];

btnCarrinho.addEventListener("click", () => {
  atualizaItemModal();
  modalCart.style.display = "flex";
});

modalCart.addEventListener("click", (evento) => {
  if (evento.target === modalCart) {
    modalCart.style.display = "none"; //Func para fechar o modal caso clique fora
  }
});

fechaModal.addEventListener("click", () => {
  modalCart.style.display = "none";
});

menu.addEventListener("click", (evento) => {
  let btnComprarItem = evento.target.closest(".btnCard"); // usar o método closest para pegar o elemento pai que contém a classe btnCard pois mesmo clicando no icone devolve o botão pai

  if (btnComprarItem) {
    const nomeProduto = btnComprarItem.getAttribute("data-name");
    const precoProduto = Number(btnComprarItem.getAttribute("data-price"));

    adicionarItemCart(nomeProduto, precoProduto);
  }
});

function adicionarItemCart(nomeProduto, precoProduto) {
  const itemExistente = cart.find((item) => item.nomeProduto === nomeProduto);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    cart.push({
      nomeProduto,
      precoProduto,
      quantidade: 1,
    });
  }

  atualizaItemModal();
}

function atualizaItemModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItem.innerHTML = `
        <div class ="flex items-center justify-between">
            <div>
                <p class = "font-bold">${item.nomeProduto}</p>
                <p>Qtd: ${item.quantidade}</p>
                <p class = "font-medium mt-1">Preço: ${item.precoProduto.toFixed(2)}</p>
            </div>
                <button class="btnRemoveItem" data-name="${
                  item.nomeProduto
                }">Remover</button>
        </div>
        `;

    total += item.precoProduto * item.quantidade;
    cartItemsContainer.appendChild(cartItem);
  });

  precoTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerText = cart.length; // pega o tamanho do array cart e coloca no contador de items do carrinho
}

cartItemsContainer.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btnRemoveItem")) {
    // dentro do container de itens do carrinho ele verifica se clicou no botão de remover por meio da classe
    const nomeItem = evento.target.getAttribute("data-name");

    removeItemCart(nomeItem);
  }
});

function removeItemCart(nome) {
  const index = cart.findIndex((item) => item.nomeProduto === nome);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantidade > 1) {
      item.quantidade -= 1;
      atualizaItemModal();
      return;
    }

    cart.splice(index, 1); // usa o splice para remover um item do array cart passando a posição do item e quantos serão deletados
    atualizaItemModal();
  }
}

inputEndereco.addEventListener("input", (evento) => {
  let valorInput = evento.target.value;  // pega o valor do input de endereço
  if(valorInput != ""){
    inputEndereco.classList.remove("border-red-500");
    avisoEndereco.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click",()=>{

    const estaAberto = checaRestauranteAberto();

    if(!estaAberto){
        Toastify({
            text: "Ops! O restaurante está fechado !",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast(); //Biblioteca de avisos 
        return;
    }

   

    if(cart.length === 0){
        return;
    }

    if(inputEndereco.value === ""){
        avisoEndereco.classList.remove("hidden");
        inputEndereco.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map((item)=>{
        return(
            `${item.nomeProduto} Quantidade: ${item.quantidade} Preço: R$ ${item.precoProduto} | `
        )
    }).join("");

    const mensagem = encodeURIComponent(cartItems);
    const telefone = "11932276446";

    window.open(`https://wa.me//${telefone}?text=${mensagem} Endereço: ${inputEndereco.value}`, "_blank"); // envianado para o zap

    cart = []; // limpando o carrinho
    inputEndereco.value = "";
    atualizaItemModal();

});

function checaRestauranteAberto(){
    const dataAtual = new Date();

    const hora = dataAtual.getHours();
    let diaSemana = dataAtual.getDay();
    return (hora >= 18 && hora < 23) && (diaSemana != 0 && diaSemana != 1 && diaSemana != 2 && diaSemana != 3 );
}

const cardHorario = document.getElementById("date-span");
const estaAberto = checaRestauranteAberto();

if(estaAberto){
    cardHorario.classList.remove("bg-red-500");
    cardHorario.classList.add("bg-green-600");
}else{
    cardHorario.classList.remove("bg-green-600");
    cardHorario.classList.add("bg-red-500");
}


