const buscarCiudad = document.querySelector("#buscar-ciudad")
const cerrar = document.querySelector("#cerrar")

buscarCiudad.addEventListener("click", function(ev){
    const menu = document.getElementById("menu-lateral")
    menu.classList.add("aparecer")
    menu.classList.remove("ocultar")
})

cerrar.addEventListener("click", function(ev){
    const menu = document.getElementById("menu-lateral")
    menu.classList.remove("aparecer")
    menu.classList.add("ocultar")
})