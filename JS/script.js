var name_pok = [];
var link_img_pok = [];
var pokemons = [];
var pokFilterTemp = []
var get_pok_name = false;

const totalPokemon = 151

var contPokeView = 0

//entra em contato com a pokeAPI
function getXMLHttpREquest(requestURL){

    //nova instância de objeto de solicitação
    var request = new XMLHttpRequest();

    //nova solicitação, GET para recuperando dados
    request.open('GET', requestURL)

    //definindo o  responseType como JSON, para que o XHR saiba que o servidor retornará o JSON 
    //vai ser convertido depois para JavaScript
    request.responseType = 'json';
    //solicitação com o método send()

    request.send();

    //guardar a resposta retornar do servidor. !!! ASSINCRONO !!!
    request.onload = function () { Filter(request.response);}


    //metodo alternativo para fazer requisição
    //var data = fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    //.then(data => {return data.json();})
    //.then(post => {console.log(post);});
}

//verifica se já fez a lista de nomes para fazer a lista de links das sprites dos pokemons
Filter = results => get_pok_name == false ? GetNamePokemon(results): GetSpriteLink(results);


//constroi uma lista com apenas os nomes dos pokemons
function GetNamePokemon(results){

    //if(results == null || results == undefined || results['results'].length <= 0 ){ return console.log("Erro: Não foi possivel pegar informações")}

    get_pok_name = true;

    for (let index = 0; index < totalPokemon; index++) {
        try {
            _name = results['results'][index]['name'];
        } catch (error) {
            return console.log("erro: Não foi possivel encontrar o nome dos pokemons.");
        }

        name_pok.push(_name);
        console.log("get names..."+index);
    }

    if(name_pok.length == totalPokemon){
    console.log("--------------------------------------------");
    console.log("Nomes gravados com sucesso!")
    console.log("--------------------------------------------");
    }

    Verificador();
    RequestSpritePok();
}

//constroi uma lista de link das sprites dos pokemon
var RequestSpritePok = _nameTemp => {
    let nametemp = name_pok[link_img_pok.length];
    getXMLHttpREquest('https://pokeapi.co/api/v2/pokemon/'+ nametemp);}

GetSpriteLink = results => {

    link_img_pok.push(results['sprites']['front_default']);
    console.log("get Sprites..."+link_img_pok.length);

    if (link_img_pok.length < totalPokemon) {
        RequestSpritePok();
        return;
    }

    if(link_img_pok.length == totalPokemon){
        console.log("--------------------------------------------");
        console.log("Sprites gravados com sucesso!")
        console.log("--------------------------------------------");
    }
}

//verifica se ja terminou de pegar todos os sprites, se sim, pula para a proxima etapa
Verificador = () => {

    setTimeout (() => {
        if(link_img_pok.length < totalPokemon) {

            console.log("GRAVANDO DATA...");
            Verificador();
        }
        else{CreateData();}}
    , 1000 )

}

//junta os array de nome e link sprite em apenas 1
function CreateData(){

    for (let index = 0; index < totalPokemon; index++) { 
        let n = name_pok[index];
        let i = link_img_pok[index];
        let a = [n,i];
        pokemons.push(a);
    }

    console.log("--------------------------------------------");
    console.log("Lista pokemons:");
    console.log(name_pok);
    console.log(link_img_pok);
    console.log(pokemons);
    console.log("--------------------------------------------");

    confStart()
}

//configurações iniciais
confStart = () =>{

    let d = document.getElementsByClassName("disabled")
    for (let index = 0; index < d.length; index++) { d[index].disabled = false; }

    document.getElementById("loading").remove()
    make_pokemons(9)
}

//cria no html uma div com a sprite do pokemon e seu nome
function pokeShow(id){

    console.log("Id Log:"+id)

    let divCard = document.createElement("div");

    let n = document.createTextNode(pokemons[id][0]);
    let _name = document.createElement("p");
    _name.appendChild(n);

    let img = document.createElement("img");
    let i = pokemons[id][1];
    img.src = i;

    divCard.appendChild(img);
    divCard.appendChild(_name);

    document.getElementById("pokedex_view").appendChild(divCard);
}

//Verifica se esta usando filtro ou botão "mostrar mais". E cria a quantidade desejada de elementos visuais na pagina.
function make_pokemons(quantPokeShow){

    for (let index = 0 ; index < quantPokeShow; index++) {

        if (contPokeView > totalPokemon - 1){
            break;}

        if (pokFilterTemp.length > 0){ pokeShow(pokFilterTemp[index]) }
        else {
            pokeShow(contPokeView);
            contPokeView += 1;
            console.log("Total de pokemons na Tela:  "+contPokeView)
        }
    }
}

//Pega os apertor de tecla do input
document.getElementById("filter").addEventListener("keyup", () => {

    //busca os posiveis nomes de pokemon
    let t = document.getElementById("filter").value;
    let a = name_pok.filter( el => el.toLowerCase().indexOf(t.toLowerCase()) > -1);

    console.log("Filtro:"+a)

    pokFilterTemp = []

    //Pega o index do pokemon atravez de uma pesquisa por nome
    for (let index = 0; index < a.length; index++) {
        pokFilterTemp[index] = name_pok.findIndex(pok => pok == a[index] )
    }

    console.log("data temp:"+pokFilterTemp)

    eraser()
    t != ""?make_pokemons(pokFilterTemp.length): showMore(9);
})

//apaga os elementos visuais
eraser = () => {
    document.getElementById("pokedex_view").innerHTML = '';
    contPokeView = 0;
    }

//botão mostrar mais/Limpa o filtro
showMore = quant => { 

    if (pokFilterTemp.length > 0){ 
        eraser()
        pokFilterTemp = []
        document.getElementById("filter").value = ""
    }
    make_pokemons(quant)
}

btnshow = () =>{
    let b = document.getElementsByClassName("btnshow")
    if(pokFilterTemp.length < 0){return}
    for (let index = 0; index < b.length; index++) {
        b[index].style.display != "none" ? b[index].style.display = "none" : b[index].style.display = "flex"
        
    }
}

//Iniciar//


getXMLHttpREquest('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')


