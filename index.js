const buscarCiudad = document.querySelector("#buscar-ciudad")
const cerrar = document.querySelector("#cerrar")
const gps = document.querySelector("#gps")
const body = document.querySelector("#body")



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

// obtener latitud y longitud 
gps.addEventListener("click", function(ev){
    navigator.geolocation.getCurrentPosition(
    function(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    });
})


// imágenes según clima
const arrayClima = [
    {nombre: "Snow", icono: "./images/Snow.png"},
    {nombre: "Sleet", icono: "./images/Sleet.png"},
    {nombre: "Hail", icono: "./images/Hail.png"},
    {nombre: "Thunderstorm", icono: "./images/Thunderstorm.png"},
    {nombre: "Heavy Rain", icono: "./images/HeavyRain.png"},
    {nombre: "Light Rain", icono: "./images/LightRain.png"},
    {nombre: "Showers", icono: "./images/Showers.png"},
    {nombre: "Heavy Cloud", icono: "./images/HeavyCloud.png"},
    {nombre: "Light Cloud", icono: "./images/LightCloud.png"},
    {nombre: "Clear", icono: "./images/Clear.png"},
]

// datos iniciales por defecto
let ciudad = "lima"
fetch(`https://www.metaweather.com/api/location/search/?query=${ciudad}`)
.then(response => response.json())
.then(data=>{
    fetch2(data[0].woeid);
})

function fetch2(num){
    fetch(`https://www.metaweather.com/api/location/${num}/`)
    .then(response => response.json())
    .then(data=> {
        // console.log(data);
        datosAside(data);
        datosSemana(data);
        highlights(data);
    })
}


// generar formato de fecha 

const fechaActual = ()=>{
    const semana =["Mon", "Tue", "Wed","Thu","Fri","Sat","Sun"];
    const meses = ["Jan", "Feb", "Mar", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const fecha = new Date;
    const numero = (fecha.getDate())
    const diaSemana = semana[(fecha.getDay()-1)]
    const mes = meses[fecha.getMonth()-1] 
    return `${diaSemana}, ${numero} ${mes}`
}



// agregando datos al aside
function datosAside(data){
    // seleccionando etiquetas  
    const aside = body.children[1];
    const temperatura = aside.children[2].children[0];
    const clima = aside.children[2].children[1];
    const dia = aside.children[2].children[2].children[0];
    const fecha = aside.children[2].children[2].children[2];
    const pais = aside.children[2].children[3];
    const imagen = aside.children[1].children[1]

    //pintando datos
    temperatura.innerHTML = `${parseInt(data.consolidated_weather[0].the_temp)} <span>°C</span>`;
    clima.innerText = data.consolidated_weather[0].weather_state_name
    fecha.innerText = `${fechaActual()}`;
    pais.innerHTML = `<i class="fas fa-map-marker-alt"></i>${data.title}`;
 
    const climaDia = arrayClima.filter(function(el){
        return el.nombre === data.consolidated_weather[0].weather_state_name
    })
    imagen.setAttribute("src", climaDia[0].icono)
}


// agregando datos a las tarjetas de la semana a falta de agregar fecha

function datosSemana(data){
     // seleccionando elementos
     const tarjetas = body.children[2].children[1]

     // recorriendo las tarjetas pintandolas
     for(let i=0; i<5; i++){
        const imagen = tarjetas.children[i].children[1];
        const temperatura = tarjetas.children[i].children[2];

        const climaDia = arrayClima.filter(function(el){
            return el.nombre === data.consolidated_weather[i].weather_state_name
        })
        imagen.setAttribute("src", climaDia[0].icono)

        temperatura.children[0].innerHTML = `${parseInt(data.consolidated_weather[0].max_temp)} <span>°C</span>`;
        temperatura.children[1].innerHTML = `${parseInt(data.consolidated_weather[0].min_temp)} <span>°C</span>`
     }
     
}

// pintando detalle de datos día seleccionado

function highlights(data){
    const container = body.children[2].children[2].children[1];
    const viento = container.children[0].children[1]
    const humedad = container.children[1].children[1]
    const visibilidad = container.children[2].children[1]
    const Presion = container.children[3].children[1]

    viento.innerHTML = `${parseInt(data.consolidated_weather[0].wind_speed)} <span>mph</span>`;
    humedad.innerText = `${data.consolidated_weather[0].humidity}%`;
    visibilidad.innerHTML = `${(data.consolidated_weather[0].visibility).toFixed(1)} <span>miles</span>`;
    Presion.innerHTML = `${data.consolidated_weather[0].air_pressure} <span>mb</span>`;

    console.log(data.consolidated_weather[0])
}


// guardando busquedas recientes
const input = document.querySelector("#ciudad")
input.addEventListener("change", agregar)
const ultimasBusquedas = ["lima", "bogotá", "los angeles", "berlin"];


function agregar(){
    ultimasBusquedas.unshift(input.value)
    
    localStorage.setItem("busqueda1", ultimasBusquedas[0])
    localStorage.setItem("busqueda2", ultimasBusquedas[1])
    localStorage.setItem("busqueda3", ultimasBusquedas[2])
    localStorage.setItem("busqueda4", ultimasBusquedas[3])


    const arrayBusquedas =[
        localStorage.getItem("busqueda1"), 
        localStorage.getItem("busqueda2"), 
        localStorage.getItem("busqueda3"),
        localStorage.getItem("busqueda4"),
    ]
    

        agregarBusquedaReciente(arrayBusquedas)
        input.value = "";
}

// pintando busquedas recientes
function agregarBusquedaReciente(array){
    const arraysBusqueda = array
    const menuBusquedas = body.children[0].children[0].children[2];

    for(let i=1; i <= arraysBusqueda.length; i++){
        const tarjeta = menuBusquedas.children[i].children[0]
        tarjeta.innerText = arraysBusqueda[i-1]
    }
}

