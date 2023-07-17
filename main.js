const apiUrl = "https://mindhub-xj03.onrender.com/api/amazing";
const currentPath = window.location.pathname; //obtiene la ruta actual del archivo HTML

let elementoMain = document.getElementById("main");
let events = [];
let allEvents = []; //para cargar los eventos una sola vez

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("id");


//FUNCION PARA CARGAR CONTENIDO EN LA VISTA INDEX.HTML
function loadIndexContent() {
//funcion para crear las cards de los eventos
function makeCard(event) {
  const {image, name, category, description, price } = event;

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("id", `card-${event._id}`); // agrega un id unico a cada tarjeta
  card.innerHTML = `
    <img src="${image}" alt="${name}" />
    <div class="card-body">
        <h3>${name}</h3>
        <h4>${category}</h4>
        <p>${description}</p>
        <div class="card-footer">
        <h3>Precio: $ ${price}</h3>
        </div>
    </div>
    `;
  elementoMain.appendChild(card); //agrega la tarjeta al contenedor del elementoMain

  //const cardButton = document.querySelector(`#card-${event.id} button`);
  const button = document.createElement("button");
    button.textContent = "Detalles";

    //agrega el evento click al boton
    button.addEventListener("click", () => {
        //redirige a details.html con el id del evento
        window.location.href = `details.html?id=${event._id}`;
    });

    card.appendChild(button); //agrega el boton a la tarjeta
}

//funcion para obtener todos los eventos
async function getEvents() {
  try {
    const response = await axios.get(apiUrl);
    allEvents = response.data.events;
    //console.log(events);
    allEvents.forEach((event) => {
      makeCard(event);
    });

    //despues de obtener los eventos creo un array para filtrarlos por categoria
    //map itera sobre el array allEvents y crea un  nuevo arreglo solo con las categorias 
    //...new Set elimina los duplicados y el operador spread ... convierte el objeto en un array
    const categories = [...new Set(allEvents.map((event) => event.category))];
    console.log(categories);
    createCheckboxes(categories);  
  } catch (error) {
    console.log(error.message);
  }
}

//funcion para crear los checkboxs
function createCheckboxes(categories) {
const checkboxContainer = document.querySelector(".checkbox-container");

//creo los checkbox
categories.forEach((category) => {
  const checkbox = document.createElement("div");
  checkbox.classList.add("form-check", "form-check-inline");
  checkbox.innerHTML = `
       <input class="form-check-input" type="checkbox" name="category" id="checkbox-${category}" value="${category}">
       <label class="form-check-label" for="checkbox-${category}">${category}</label>
    `;
  checkboxContainer.appendChild(checkbox);

  //agrego un event listener para manejar los cambios en los checkbox
  const checkboxInput = checkbox.querySelector(`#checkbox-${category}`);//obtengo el input del checkbox
  checkboxInput.addEventListener("click", handleCheckboxChange);//agrego el evento click al input y ejecuto la funcion handleCheckboxChange

  //agrego un event listener para manejar los cambios en el buscador
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", handleSearch);
});
}

//funcion para manejar los cambios en los checkboxS
function handleCheckboxChange() {
  const checkboxes = document.querySelectorAll("input[name='category']");//obtengo todos los checkbox que tengan el name category
  const selectedCategory = Array.from(checkboxes)//convierto los checkbox en un array para poder usar el metodo filter y map
  .filter((checkbox) => checkbox.checked) //filtro los checkbox que esten checked
  .map((checkbox) => checkbox.value); //creo un nuevo array solo con los valores de los checkbox que esten checked

   let filteredEvents = []; //creo un array vacio para guardar los eventos filtrados
   if(selectedCategory.length > 0){ //si hay algun checkbox checked, es decir, si hay categorias seleccionadas
         filteredEvents = allEvents.filter((event) => selectedCategory.includes(event.category)); //con filter creo un nuevo array con los eventos que coincidan con las categorias seleccionadas
   }else {
        filteredEvents = allEvents; // si no hay categorias seleccionadas, filteredEvents es igual a allEvents
   }

  //limpiar el contenedor principal
  elementoMain.innerHTML = "";
  //volver a crear las cards de los eventos filtrados
  filteredEvents.forEach((event) => {
    makeCard(event);
  });
}

//funcion para el buscador
function handleSearch(){
    let searchInput = document.getElementById("searchInput");
    let searchText = searchInput.value.toLowerCase();//obtengo el valor del input y lo convierte en minuscula
     
    let filteredEvents = allEvents;
    const checkboxes = document.querySelectorAll("input[name='category']");
    const checkedCategories = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

    if(checkedCategories.length > 0){
        filteredEvents = filteredEvents.filter((event) => checkedCategories.includes(event.category));
    }

      filteredEvents = filteredEvents.filter((event) => { //con filter creo un nuevo array con los eventos que coincidan con las categorias seleccionadas
        const eventName = event.name.toLowerCase(); //convierto el nombre y la descripcion del evento en minuscula
        const eventDescription = event.description.toLowerCase(); //convierto el nombre y la descripcion del evento en minuscula
        return eventName.includes(searchText) || eventDescription.includes(searchText); //devuelvo los eventos que coincidan con el texto ingresado en el buscador
    });
    //limpiar el contenedor principal
    elementoMain.innerHTML = "";
    //crear las cards de los eventos filtrados por busqueda y categoria
    filteredEvents.forEach((event) => {
        makeCard(event);
    });
    
}

  getEvents();
}

//FUNCION PARA CARGAR CONTENIDO EN LA VISTA UPCOMING.HTML
function loadUpcomingContent() {
//funcion cards upcoming

const elementSection = document.getElementById("sectionUpcoming");
   function makeCardUpcoming(event) {
    const {image, name, description, estimate,category, price} = event;
    
    if(!estimate){
        return; //si el evento no tiene estimados, no se muestra
    }
       const card = document.createElement("div");
       card.classList.add("card");
       card.setAttribute("id", `card-${event._id}`);
       card.innerHTML = `
       <img src="${image}" alt="${name}" />
       <div class="card-body">
           <h3>${name}</h3>
           <h4>${category}</h4>
           <p>${description}</p>
           <h4>Estimados: ${estimate}</h4>
           <div class="card-footer">
           <h3>Precio: $ ${price}</h3>
           </div>
       </div>
       `;
       elementSection.appendChild(card);

       //const cardButton = document.querySelector(`#card-${event.id} button`);
      const button = document.createElement("button");
      button.textContent = "Detalles";

       //agrega el evento click al boton
       button.addEventListener("click", () => {
      //redirige a details.html con el id del evento
      window.location.href = `details.html?id=${event._id}`;
    });

      card.appendChild(button); //agrega el boton a la tarjeta
   }

   //funcion obtener eventos upcoming
async function getEventsUpcoming(){
try{
    const response = await axios.get(apiUrl); // destructuring
    allEvents = response.data.events;
    console.log(events);

    allEvents.forEach((event) => {
        if(event.estimate){
            makeCardUpcoming(event);
        }
    });
     
    const categories = [...new Set(allEvents.map((event) => event.category))];
    createCheckboxes(categories);

    } catch (error) {
       console.log(error.message);
    }
  }

//funcion para crear los checkbox de las categorias de los eventos futuros
function createCheckboxes(categories) {
    const checkboxContainer = document.querySelector(".checkbox-container");

    categories.forEach((category) => {
        const checkbox = document.createElement("div");
        checkbox.classList.add("form-check", "form-check-inline");
        checkbox.innerHTML = `
        <input type="checkbox" name="category" value="${category}" id="${category}" />
        <label for="${category}">${category}</label>
        `;
        checkboxContainer.appendChild(checkbox);

        const checkboxInput = checkbox.querySelector(`#${category}`);
        checkboxInput.addEventListener("click", handleCheckboxChange);

        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", handleSearch);
    });
}

//funcion para manejar los cambios en los checkbox
function handleCheckboxChange() {
    const checkboxes = document.querySelectorAll(`input[name="category"]`);
    const selectedCategory = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

    let filteredEvents = [];
    if(selectedCategory.length > 0){
       filteredEvents = allEvents.filter((event) => selectedCategory.includes(event.category));
    }else{
        filteredEvents = allEvents;
    }

    elementSection.innerHTML = "";
    filteredEvents.forEach((event) => {
        makeCardUpcoming(event);
    });
}

//funcion para manejar los cambios en el input de busqueda
function handleSearch() {
    let searchInput = document.getElementById("searchInput");
    let searchText = searchInput.value.toLowerCase();

    let filteredEvents = allEvents;
    const checkboxes = document.querySelectorAll(`input[name="category"]`);
    const checkedCategories = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

    if(checkedCategories.length > 0){
        filteredEvents = filteredEvents.filter((event) => checkedCategories.includes(event.category));
    }

    filteredEvents = filteredEvents.filter((event) => {
        const eventName = event.name.toLowerCase();
        const eventDescription = event.description.toLowerCase();
        return eventName.includes(searchText) || eventDescription.includes(searchText);
    });
    elementSection.innerHTML = "";
    filteredEvents.forEach((event) => {
        makeCardUpcoming(event);
    });
}

 getEventsUpcoming();
}

//FUNCION PARA CARGAR CONTENIDO EN LA VISTA PAST EVENTS
function loadPastEventsContent() {
    const elementSectionPast = document.getElementById("sectionPastEvent");
    //function cards past events
function makeCardPast(event) {
    const {image, name, description, category,assistance, price} = event;

    if(!assistance){
        return; //si el evento no tiene assistance, no se muestra
    }

         const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("id", `card-${event._id}`);
            card.innerHTML = `
            <img src="${image}" alt="${name}" />
            <div class="card-body">
                <h3>${name}</h3>
                <h4>${category}</h4>
                <p>${description}</p>
                <h4>Asistentes: ${assistance}</h4>
                <div class="card-footer">
                <h3>Precio: $ ${price}</h3>
                </div>
            </div>
            `;
           
            elementSectionPast.appendChild(card);

          //const cardButton = document.querySelector(`#card-${event.id} button`);
         const button = document.createElement("button");
         button.textContent = "Detalles";

         //agrega el evento click al boton
         button.addEventListener("click", () => {
         //redirige a details.html con el id del evento
         window.location.href = `details.html?id=${event._id}`;
      });

      card.appendChild(button); //agrega el boton a la tarjeta
} 

//funcion obtener eventos past
async function getEventsPast(){
    try{
        const response = await axios.get(apiUrl); // destructuring
        allEvents = response.data.events;
        console.log(events);

        allEvents.forEach((event) => {
            if(event.assistance){
                makeCardPast(event);
            }
        });

        const categories = [...new Set(allEvents.map((event) => event.category))];
        createCheckboxes(categories);

       } catch (error) {
           console.log(error.message);
        }
  }

//funcion para crear los checkbox de las categorias de los eventos pasados
function createCheckboxes(categories) {
    const checkboxContainer = document.querySelector(".checkbox-container");

    categories.forEach((category) => {
        const checkbox = document.createElement("div");
        checkbox.classList.add("form-check", "form-check-inline");
        checkbox.innerHTML = `
        <input type="checkbox" name="category" value="${category}" id="${category}" />
        <label for="${category}">${category}</label>    
        `;
        checkboxContainer.appendChild(checkbox);

        const checkboxInput = checkbox.querySelector(`#${category}`);
        checkboxInput.addEventListener("click", handleCheckboxChange);

        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", handleSearch);
    });
}

//funcion para manejar los cambios en los checkbox
function handleCheckboxChange() {
    const checkboxes = document.querySelectorAll(`input[name="category"]`);
    const selectedCategory = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

    let filteredEvents = [];
    if(selectedCategory.length > 0){
         filteredEvents = allEvents.filter((event) => selectedCategory.includes(event.category));
    }else{
        filteredEvents = allEvents;
    }

    elementSectionPast.innerHTML = "";
    filteredEvents.forEach((event) => { 
        makeCardPast(event);
    });
  }

//funcion para manejar los cambios en el input de busqueda
function handleSearch() {
    let searchInput = document.getElementById("searchInput");
    let searchText = searchInput.value.toLowerCase();

    let filteredEvents = allEvents;
    const checkboxes = document.querySelectorAll(`input[name="category"]`);
    const checkedCategories = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

    if(checkedCategories.length > 0){
        filteredEvents = filteredEvents.filter((event) => checkedCategories.includes(event.category));
    }

    filteredEvents = filteredEvents.filter((event) => {
        const eventName = event.name.toLowerCase();
        const eventDescription = event.description.toLowerCase();
        return eventName.includes(searchText) || eventDescription.includes(searchText);
    });
    elementSectionPast.innerHTML = "";
    filteredEvents.forEach((event) => {
        makeCardPast(event);
    });
}

   getEventsPast(); 

}

//FUNCION PARA CARGAR CONTENIDO EN LA VISTA DETAILS.HTML
function loadDetailsContent() {
    //funcion para crear card del evento con los detalles
    function createEventCard(event) {
        const {image, name, category,date, description,place, price, capacity, assistance, estimate } = event;
        const card = document.createElement("div");
        card.classList.add("card-details");
        card.innerHTML = `
        <img src="${image}" alt="${name}" />
        <div class="card-body">
            <h3>${name}</h3>
            <h5>Categoría: ${category}</h5>
            <p>Fecha: ${date}</p>
            <p><em>Description: ${description}</em></p>
            <p>Lugar: ${place}</p>
            <p>Capacidad: ${capacity}</p>
            ${assistance ? `<p>Asistencia: ${assistance}</p>` : ""}
            ${estimate ? `<p>Estimacion: ${estimate}</p>` : ""}
            <div class="card-footer">
            <h3>Precio: $ ${price}</h3>
            </div>
        </div>
        `;
        return card;
    }
    
    //funcion para obtener el evento por id
    async function getEventById() {
        try{
            const response = await axios.get(apiUrl);
            const events = response.data.events;
            const event = events.find((event) => event._id === parseInt(eventId));
    
            if(event){
                const eventDetailsContainer = document.getElementById("event-details-container");
                const eventCard = createEventCard(event);
                eventDetailsContainer.appendChild(eventCard);
            }
            }catch(error){
                console.log(error.message);
            }
        }
    
        getEventById();
    }

//FUNCION PARA CARGAR CONTENIDO EN LA VISTA CONTACTO.HTML
function loadContactContent() {
    //funcion para enviar formulario
    function sendForm() {
       const form = document.createElement("div");
        form.classList.add("form");
        form.innerHTML = `
        <form action="" method="POST">
        <label for="name">Nombre</label>
        <input type="text" name="name" id="name" placeholder="Nombre" required />
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Email" required />
        <label for="message">Mensaje</label>
        <textarea name="message" id="message" placeholder="Mensaje" required></textarea>
        <button type="submit">Enviar</button>
        </form>
        `;
        const elementSectionContact = document.getElementById("sectionContact");
        elementSectionContact.appendChild(form);
    }
    sendForm();

}

//FUNCION PARA CARGAR CONTENIDO EN LA VISTA STATS.HTML

function loadStatsContent() {
   const elementSectionStats = document.getElementById("sectionStats");

 async function getStats(){
    const table = document.createElement("table");
    table.classList.add("table");
    table.innerHTML = `
    <thead>
    <tr>
    <td class="title" colspan="4">Events statistics</td>
    </tr>
    <tr>
        <th>Evento con mayor porcentaje de asistencia</th>
        <th>Evento con menor porcentaje de asistencia</th>
        <th>Evento con mayor capacidad</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td id="eventMaxAssistanceName"></td>
        <td id="evenMinAssistanceName"></td>
        <td id="eventMaxCapacityName"></td>
    </tr>
    </tbody>
    <thead>
    <tr>
    <td class="title" colspan="4">Upcoming Events statistics by categoría</td>
    </tr>
    <tr>
        <th>Categories</th>
        <th>Revenues</th>
        <th>Estimado</th>
    </tr>
    </thead>
    <tbody id="categoryStatsBodyUp">
    
    </tbody>
    <thead>
    <tr>
    <td class="title" colspan="4">Past Events statistics by categoría</td>
    </tr>
    <tr>
        <th>Categories</th>
        <th>Revenues</th>
        <th>% de asistencia</th>
    </tr>
    </thead>
    <tbody id="categoryStatsBody">
    </tbody>
    `;
   
    elementSectionStats.appendChild(table);
    
  //obtengo los datos de la api para las estadisticas y actualiza la tabla
    const response = await axios.get(apiUrl);
    allEvents = response.data.events;

    //obtener evento con mayor y menor porcentaje de asistencia
    //reduce recorre cada evento de la lista comparando el porcentaje de asistencia y devuelve el evento con mayor porcentaje de asistencia
    const eventMaxAssistance = allEvents.reduce((max, event) => {
        const percentageAssistance = (event.assistance / event.capacity) * 100;
        return (percentageAssistance > (max.assistance / max.capacity) * 100) ? event : max;
    });
   
    const eventMinAssistance = allEvents.reduce((min, event) => {
         const percentageAssistance = (event.assistance / event.capacity) * 100;
         return (percentageAssistance < (min.assistance / min.capacity) * 100) ? event : min;
        });

    //obtener el evento con mayor capacidad
    const eventMaxCapacity = allEvents.reduce((max, event) => (event.capacity > max.capacity) ? event : max);

    //actualizar los datos de la tabla
    const eventMaxAssistanceName = document.getElementById("eventMaxAssistanceName");
    const eventMinAssistanceName = document.getElementById("evenMinAssistanceName");
    const eventMaxCapacityName = document.getElementById("eventMaxCapacityName");

    eventMaxAssistanceName.textContent = `${eventMaxAssistance.name}: ${Math.round((eventMaxAssistance.assistance / eventMaxAssistance.capacity) * 100)}%`;
    eventMinAssistanceName.textContent = `${eventMinAssistance.name}: ${Math.round((eventMinAssistance.assistance / eventMinAssistance.capacity) * 100)}%`;
    eventMaxCapacityName.textContent = `${eventMaxCapacity.name}: ${eventMaxCapacity.capacity}`;

    //filtrar todos los eventos para obtener solo los pasados con datos de capacidad y asistencia
    const pastEvents = allEvents.filter(event => event.capacity && event.assistance);
    
    //calcular las estadisticas por categoria
    const categoryStatsBody = document.getElementById("categoryStatsBody");
    const categories = {}; //objeto vacio para guardar las estadisticas por categoria

    //recorrer los eventos pasados y calcular las estadisticas por categoria
    pastEvents.forEach(event => {
        if (!categories[event.category]){
            categories[event.category] = {
                revenues: 0,
                totalAttendance: 0,
                totalCapacity: 0,
            };
        }

         //calcular y actualizar los ingresos acumulados por categoria
        const revenue = event.price * event.assistance;
        categories[event.category].revenues += revenue; //sumar los ingresos de cada evento por categoria
        categories[event.category].totalAttendance += event.assistance; //sumar la asistencia de cada evento por categoria
        categories[event.category].totalCapacity += event.capacity; //sumar la capacidad de cada evento por categoria
    });
    //crear las filas de la tabla para cada categoria
    for(const category in categories){
        const revenue = categories[category].revenues;
        const totalAttendance = categories[category].totalAttendance;
        const capacity = categories[category].totalCapacity;
        const percentageAttendance = (totalAttendance / capacity) *100;

        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${category}</td>
        <td>$${revenue}</td>
        <td>${totalAttendance} (${Math.round(percentageAttendance)}%)</td>
        `;
        categoryStatsBody.appendChild(row);
    }

    const upcomingEvents = allEvents.filter(event => event.capacity && event.estimate);

    const categoryStatsBodyUp = document.getElementById("categoryStatsBodyUp");
    const categoriesUp = {};

    upcomingEvents.forEach(event => {
        if (!categoriesUp[event.category]){
            categoriesUp[event.category] = {
                revenues: 0,
                estimate: 0,
                totalCapacity: 0,
            };
        }

        const revenue = event.price * event.estimate;
        categoriesUp[event.category].revenues += revenue;
        categoriesUp[event.category].estimate += event.estimate;
        categoriesUp[event.category].totalCapacity += event.capacity;
    });

    for(const category in categoriesUp){
        const revenue = categoriesUp[category].revenues;
        const estimate = categoriesUp[category].estimate;
        const capacity = categoriesUp[category].totalCapacity;
        const percentageAttendance = (estimate / capacity) *100;

        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${category}</td>
        <td>$${revenue}</td>
        <td>${estimate} (${Math.round(percentageAttendance)}%)</td>
        `;
        categoryStatsBodyUp.appendChild(row);
    }
    
}
  
    getStats();
}


//DETERMINAR QUE CONTENIDO CARGAR EN FUNCION DE LA VISTA ACTUAL

if(currentPath.includes("index.html")){
    loadIndexContent();
}else if(currentPath.includes("details.html")){
    loadDetailsContent();
}else if(currentPath.includes("upcoming.html")){
    loadUpcomingContent();
}else if(currentPath.includes("pastEvents.html")){
    loadPastEventsContent();
}else if(currentPath.includes("contact.html")){
    loadContactContent();
}else if(currentPath.includes("stats.html")){
    loadStatsContent();
}else{
    loadIndexContent();
}



