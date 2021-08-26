const buscarCiudad = document.querySelector("#buscar-ciudad")
const cerrar = document.querySelector("#cerrar")
const gps = document.querySelector("#gps")
const body = document.querySelector("#body")

function closeNav(ev){
    const menu = document.getElementById("menu-lateral")
    menu.classList.remove("aparecer")
    menu.classList.add("ocultar")
}

buscarCiudad.addEventListener("click", function(ev){
    const menu = document.getElementById("menu-lateral")
    menu.classList.add("aparecer")
    menu.classList.remove("ocultar")
    input.focus()
})

cerrar.addEventListener("click", closeNav )

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
    {nombre: "Showers", icono: "./images/Shower.png"},
    {nombre: "Heavy Cloud", icono: "./images/HeavyCloud.png"},
    {nombre: "Light Cloud", icono: "./images/LightCloud.png"},
    {nombre: "Clear", icono: "./images/Clear.png"},
]

// datos iniciales por defecto
const buscarClima = (ciudad)=>{

    fetch(`https://www.metaweather.com/api/location/search/?query=${ciudad}`)
    .then(response => response.json())
    .then(data=>{
        fetch2(data[0].woeid);
    });
    closeNav()
    
    function fetch2(num){
        fetch(`https://www.metaweather.com/api/location/${num}/`)
        .then(response => response.json())
        .then(data=> {
            datosAside(data);
            datosSemana(data);
            highlights(data);
        })
    }
    
}

buscarClima("lima")



// generar formato de fecha 

const fechaActual = (data)=>{
    const arrayFecha = data.applicable_date.split("-")
    const semana =["Sun","Mon", "Tue", "Wed","Thu","Fri","Sat",];
    const meses = ["Jan", "Feb", "Mar", "Apr" ,"May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"]
    const numero = arrayFecha[2]
    const mes = meses[parseInt(arrayFecha[1])-1] 
    const diaDe = new Date(`${mes} ${numero}, ${arrayFecha[0]}`)
    const diaSemana = semana[diaDe.getDay()]
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

    const lugar = data
    const diaPintar = lugar.consolidated_weather[0]

    temperatura.innerHTML = `${parseInt(diaPintar.the_temp)} <span>°C</span>`;
    clima.innerText = diaPintar.weather_state_name
    fecha.innerText = `${fechaActual(diaPintar)}`;
    pais.innerHTML = `<i class="fas fa-map-marker-alt"></i>${lugar.title}`;
 
    const climaDia = arrayClima.filter(function(el){
        return el.nombre === diaPintar.weather_state_name
    })
    imagen.setAttribute("src", climaDia[0].icono)
}


// agregando datos a las tarjetas de la semana a falta de agregar fecha

function datosSemana(data){
     // seleccionando elementos
     const tarjetas = body.children[2].children[1]

     //Variables de Data
     const lugar = data
     const diaPintar = lugar.consolidated_weather

     // recorriendo las tarjetas pintandolas
     for(let i=0, j=1 ; i<5 ; i++, j++){
        const titulo = tarjetas.children[i].firstElementChild
        const imagen = tarjetas.children[i].children[1];
        const temperatura = tarjetas.children[i].children[2];

        const climaDia = arrayClima.filter(function(el){
            return el.nombre === diaPintar[i].weather_state_name
        })
        titulo.innerHTML = fechaActual(diaPintar[j])

        imagen.setAttribute("src", climaDia[0].icono)

        temperatura.children[0].innerHTML = `${parseInt(data.consolidated_weather[0].max_temp)} <span>°C</span>`;
        temperatura.children[1].innerHTML = `${parseInt(data.consolidated_weather[0].min_temp)} <span>°C</span>`
     }
     
}

// pintando detalle de datos día seleccionado

function highlights(data){
    //Variables de Data
    const lugar = data
    const diaPintar = lugar.consolidated_weather[0]

    const container = body.children[2].children[2].children[1];
    const viento = container.children[0].children[1]
    const humedad = container.children[1].children[1]
    const progreso = document.getElementById("progreso")
    const visibilidad = container.children[2].children[1]
    const Presion = container.children[3].children[1]

    viento.innerHTML = `${parseInt(diaPintar.wind_speed)}<span>mph</span>`;
    humedad.innerHTML = `${diaPintar.humidity} <span>&#37</span>`;
    progreso.value = diaPintar.humidity
    visibilidad.innerHTML = `${(diaPintar.visibility).toFixed(1)} <span>miles</span>`;
    Presion.innerHTML = `${diaPintar.air_pressure} <span>mb</span>`;

}


// guardando busquedas recientes y enviando el valor a buscar
const input = document.querySelector("#ciudad")
const buscarButon = document.querySelector("#buscar")
buscarButon.addEventListener("click", agregar)
const ultimasBusquedas = ["lima", "bogotá", "los angeles", "berlin"];
const busquedas = document.querySelector("#ultimas-busquedas")
busquedas.addEventListener("click", agregarUltimasBusquedas)

function agregar(ev){

    if(input.value ===""){
        ev.preventDefault()
        return pintarError() 

    } else {
        const label = document.querySelector("#label")
        label.classList.add("hide")
        input.classList.remove("error")

        buscarClima(input.value)
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
}

function agregarUltimasBusquedas(ev){
        const target = ev.target
        if(target.classList.contains("ultimas-busquedas__card")){
            const targetBuscar = target.firstElementChild.innerText
            buscarClima(targetBuscar)
            ultimasBusquedas.unshift(targetBuscar)
            
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
        }

        
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

const pintarError = (ev) => {
    input.classList.add("error")
    const label = document.querySelector("#label")
    label.classList.remove("hide")
    label.innerText = "Agregue un valor valido (solo capitales)"
}