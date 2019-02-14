"use strict";

//variables
var nombre = document.forms[0].elements[0];
var email = document.getElementById("email");
var telefono = document.getElementById('tlfno');
var fechaReserva = document.getElementById("fechaReserva");
var fechaSalida = document.getElementById("fechaSalida");
var botonEnviar = document.forms[0].elements[9];
var capaIntentos = document.getElementById("intentos");

/////Eventos al cargar la página
window.addEventListener("load", function () {
    nombre.addEventListener('blur', mayusculasNombre);
    email.addEventListener("blur", validarEmail);
    telefono.addEventListener("keypress", validarTelefono);
    fechaReserva.addEventListener('blur', validarFechaReserva);
    fechaSalida.addEventListener("keypress", validarFechaSalida);
    fechaSalida.addEventListener('blur', validaSalidaCorrecta); //este para comprobar fecha correcta en salida
    //la fecha correcta en entrada la compruebo en su función blur
    botonEnviar.addEventListener("click", comprobar);

    capaIntentos.innerHTML = "Nº de intentos en el envio de datos: " + mostrarCookie();
});

/////////////////////FUNCIONES PARA COMPROBAR QUE LOS DATOS SEAN COMO QUEREMOS ////////////////////7
//4 Cada vez que el campo Nombre y Apellidos pierda el foco(blur),
//el contenido que se haya escrito en esos campos se convertirá a mayúsculas.                                 
function mayusculasNombre() {
    var nombre = (document.forms[0].elements[0].value);
    document.forms[0].elements[0].value = nombre.toUpperCase();
}

//5. Validar mediante expresión regular el e-mail  Si se produce algún error mostrar el mensaje en el span 
//y no permitir que el campo pierda el foco

function validarEmail() {

    //Empieza con al menos un caracter letra números y determinados caracteres aceptados, una @ que debe estar seguida
    //al menos de otro caracter casi igual que los anteriores, aunque ya no acepta el guión bajo, después 
    //un punto obligatoriamente seguido de uno o más caracteres permitidos.
    let patron = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");
    //validamos que el texto coincida con el patrón con un if, y el método test para el patron
    if (patron.test(document.getElementById("email").value)) {
        document.getElementById("errorEmail").innerHTML = "";
    } else {
        document.getElementById("errorEmail").innerHTML = "Introduzca un email válido";
        document.getElementById("email").focus();
        //pasar el pasar el foco a input si se equivoca

    }
}

//6. Validar el Teléfono no permitiendo visualizar nada más que números y el espacio, utilizando el método keypress.
function validarTelefono(e) {
    //keypress nos permite saber el código ascii de los números. Entre 48 y 57 en ascii son números.
    //invalidamos con preventDefault... si no está en ese rango
    //Por defecto event nos coge el evento del keypress, pero hay navegadores que no. Hacemos esto:

    let oTelefono = document.getElementById("tlfno");
    let evento = e || event;
    if (oTelefono.value.length != 3 && oTelefono.value.length != 6 && oTelefono.value.length != 9) {
        validarNum(evento); //valida todas las posiciones excepto las que quiero que sean espacio
    } else if (evento.which != 32) {
        evento.preventDefault(); //invalida el evento
    }
}

//7. Validar el campo Fecha llegada utilizando una expresión regular. Debe cumplir el formato: dd/mm/aaaa. 
//Se pide validar que sea una fecha de calendario correcta antes de perder el foco Si se produce algún error mostrar 
//el mensaje en el span y poner el foco en el campo Fecha llegada. Explicar las partes de la expresión regular mediante 
//comentarios. 
function validarFechaReserva() { //compruebo el patrón y que sea correcta la fecha 
    //PATRON: o bien comienza por cero y otro número, o por 1 o 2 seguidos de otro hasta el 9, o si empieza por por 3
    //solo puede ser seguido por 1 o 2. Eso con respecto al día. Seguirá con la barra y para el mes se piden tambien 2
    //dígitos que en el caso de empezar por 0 irá seguido de un dígito entre uno y nueve, y para las unidades entre 0
    // y dos. Para el año se piden que empiece por 2 seguido de tres dígitos
    var expresion = /^([0][1-9]|[12][0-9]|3[01])(\/)([0][1-9]|[1][0-2])(\/)(2\d{3})$/;
    if (expresion.test(document.getElementById("fechaReserva").value) && validoFechaCorrecta(fechaReserva.value)) {
        document.getElementById("errorfechaReserva").innerHTML = "";
    } else {
        document.getElementById("errorfechaReserva").innerHTML = "La fecha no es correcta";
        document.getElementById("fechaReserva").focus();
    }
}

/*8. Validar el campo Fecha salida utilizando el método keypress (no se mostrarán nada más que números y '/'. 
Debe cumplir el formato: dd/mm/aaaa. Se pide validar que sea una fecha de calendario correcta antes de perder el foco.*/
function validarFechaSalida(e) {

    let evento = e || event;
    if (this.value.length == 2 || this.value.length == 5) {
        if (evento.which != 47) {
            evento.preventDefault();
        }
    } else if ((evento.which < 48 || evento.which > 57) && (evento.which != 31)) {
        evento.preventDefault(); //invalida la aparación del caracter si no es númerico o barra 
    } else if (this.value.length > 9) {
        evento.preventDefault(); //para controlar la longitud
    }


}

function validaSalidaCorrecta() {
    if (validoFechaCorrecta(fechaSalida.value)) {
        document.getElementById("errorfechaSalida").innerHTML = "";

    } else {
        document.getElementById("errorfechaSalida").innerHTML = "No es una fecha válida";
        document.getElementById("fechaSalida").focus();
    }
}

function validarNum(e) {
    //keypress nos permite saber el código ascii de los números. Entre 48 y 57 en ascii son números.
    //invalidaríamos con preventDefault... si no está en ese rango
    //Por defecto event nos coge el evento del keypress, pero hay navegadores que no. Hacemos esto:
    // el e es el evento , está implícito. O me coge el event o el evento
    //which es ascii
    let evento = e || event;
    if (evento.which < 48 || evento.which > 57) {
        evento.preventDefault(); //invalida el evento
    }
}


//////////////FUNCIONES PARA COMPROBAR QUE LOS CAMPOS NO ESTÉN VACÍOS//////////////////
function comprobarCaptcha() {
    let check = true;
    if (grecaptcha.getResponse() == "") {
        document.getElementById("errorCaptcha").innerHTML = "Completa este campo";
        check = false;
    } else {
        document.getElementById("errorCaptcha").innerHTML = "";

    }
    return check;
}

function comprobarNombre() {
    let check = true;

    //si el nombre está vacio
    //establecidos en la etiqueta de html, si es false.....
    if (nombre.value == "") { //si no se cumple las condiciones
        document.getElementById("errorNomApe").innerHTML = "Campo nombre es requerido"; //se adapta al error, required
        //visualizamos el mensaje de error y ponenmos el booleano a false 
        check = false;

    } else {
        document.getElementById("errorNomApe").innerHTML = ""; //vacía el texto del span por si viene de una segunda pasada
    }
    return check;
}

function comprobarGenero() { //CON EL RADIO USAMOS LA PROPIEDAD CHECKED
    let check = false; //O SE PUEDE EMPEZAR A TRUE Y DESPUES EN EL IF PREGUNTAR SI EL CHECKED IS FALSE
    //recorrer los elementos cuyo atributo name es 'genero'
    for (let ele of document.getElementsByName("genero")) { //se usa el byName porque son varios, no sirve el byID
        //elements en plural
        if (ele.checked == true) { //se usa la propiedad checked
            check = true;
        }
    }
    if (!check) { //si check es false
        document.getElementById("errorGenero").innerHTML = "\t Selecciona una opción"; //A mano, aquí no sirve el validation messagge
    } else {
        document.getElementById("errorGenero").innerHTML = "";
    }
    return check;
}

function comprobarTelefono() {
    let check = true;
    if (telefono.value == "") { //está vacío
        document.getElementById("errorTelefono").innerHTML = "Teléfono es requerido"; //se imprime el error
        check = false;
    } else {
        document.getElementById("errorTelefono").innerHTML = "";
    }
    return check;
}

function comprobarEmail() {
    let check = true;
    if (document.getElementById("email").value == "") { //si NO se valida
        document.getElementById("errorEmail").innerHTML = "Email es requerido"; //se imprime el error
        check = false;
    } else {
        document.getElementById("errorEmail").innerHTML = ""; //element en singular
    }
    return check;
}



function comprobarFechaReserva() {
    let check = true;
    if (document.getElementById("fechaReserva").value == "") {
        document.getElementById("errorfechaReserva").innerHTML = "Fecha reserva es requerida";

        check = false;
    } else {
        document.getElementById("errorfechaReserva").innerHTML = "";

    }
    return check;
}

function comprobarFechaSalida() {
    let check = true;
    if (document.getElementById("fechaSalida").value == "") {
        document.getElementById("errorfechaSalida").innerHTML = "Fecha salida es requerida";
  
        check = false;
    } else {
        document.getElementById("errorfechaSalida").innerHTML = "";

    }
    return check;
}




function comprobarProvincia() { //CON SELECT USAMOS SELECTEDINDEX
    let check = false;
    if (document.getElementById("provincia").selectedIndex == 0) { //sería el elige provincia, el primero
        document.getElementById("errorProvincia").innerHTML = " Debes seleccionar una provincia";

    } else {
        document.getElementById("errorProvincia").innerHTML = "";
        check = true;
    }
    return check;
}

/*3. Almacenar en una cookie el número de intentos de envío del formulario que se van produciendo y mostrar un mensaje
en el contenedor "Nº de intentos en el envío de datos:  X". Es decir, cada vez que se pulsa el botón de enviar y 
los datos son correctos, tendrá que incrementar el valor de la cookie en 1 y mostrar su contenido en el div antes
mencionado. Nota: para poder actualizar el contenido de un contenedor o div, la propiedad ha modificar para ese objeto
es innerHTML.*/
function mostrarCookie() {
    let aCookie, intentos = 0; //inicializo a 0 el resultado para la primera vez
    if (document.cookie != "") {
        aCookie = document.cookie.split("; ");
        for (let ele of aCookie) {
            let dato = ele.split("=");
            if (dato[0] == "contador") {
                intentos = parseInt(dato[1]);
            }
        }
    }
    return intentos;
}

function crearCookie() {
    let aCookie, intentos;
    if (mostrarCookie() === 0) { //la primera vez
        document.cookie = "contador=0";
    }

    aCookie = document.cookie.split("; ");
    for (let ele of aCookie) {
        let datos = ele.split("=");
        if (datos[0] = "contador") {
            intentos = parseInt(datos[1]);
            intentos++;
            document.cookie = "contador=" + intentos;
        }
    }

}



function comprobar(e) {
    let arrayErrores = new Array();
    let evento = e || event;
    let valido = true;
    arrayErrores.push(comprobarNombre());
    arrayErrores.push(comprobarGenero());
    arrayErrores.push(comprobarEmail());
    arrayErrores.push(comprobarTelefono());
    arrayErrores.push(comprobarProvincia());
    arrayErrores.push(comprobarFechaReserva());
    arrayErrores.push(comprobarFechaSalida());
    arrayErrores.push(comprobarCaptcha());
    for (let ele of arrayErrores) {
        if (!ele) {
            valido = false;
        }

    }
    if (valido) {
        if (confirm("Los datos son correctos. ¿Desea enviar el formulario con sus datos?")) {
            crearCookie();
            evento.preventDefault();
            alert("Datos enviados. Cookie creada");

            location.reload();
        }
        // location.reload();}
        else {
            evento.preventDefault();
            alert("envío cancelado");
            document.getElementById("errorEmail").innerHTML = "";
        }
    } else {
        evento.preventDefault();
        alert("Hay campos sin completar");
    }
}


function validoFechaCorrecta(fechaString) {

    var fechaSplit;
    var fechaDate;
    var valida = true;

    fechaSplit = fechaString.split("/"); //la paso a array
    fechaString = fechaSplit[2] + "/" + fechaSplit[1] + "/" + fechaSplit[0];
    fechaDate = new Date(fechaString); //utilizo date() para pasarlo a fecha

    // comprobaciones de fechas correctas
    if (fechaSplit[2] != fechaDate.getFullYear()) {
        valida = false;
    }
    if (fechaSplit[1] != fechaDate.getMonth() + 1) {
        valida = false;
    }
    if (fechaSplit[0] != fechaDate.getDate()) {
        valida = false;
    }


    return valida;
}