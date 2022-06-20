/*De la suscripción del newletter en la Home*/

const formulario = document.getElementById("form");
const emailNewsletter = document.getElementById("email");
const alert1 = document.getElementById("alert1");
const alert2 = document.getElementById("alert2");

const regemailNewsletter = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

const MensajeExito = () => {
    alert1.classList.remove("d-none");
    alert1.textContent = "Thank you for suscribing!";
};

const MensajeError = (errores) => {
    errores.forEach((item) => {
        item.tipo.classList.remove("d-none");
        item.tipo.textContent = item.msg;
    });
};


formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    alert1.classList.add("d-none");
    const errores = [];

    if (!regemailNewsletter.test(emailNewsletter.value) || !emailNewsletter.value.trim()) {
        emailNewsletter.classList.add("is-invalid");

        errores.push({
            tipo: alert2,
            msg: "Please enter a valid email",
        });
    } else {
        emailNewsletter.classList.remove("is-invalid");
        emailNewsletter.classList.add("is-valid");
        alert2.classList.add("d-none");
    }

    if (errores.length !== 0) {
        pintarMensajeError(errores);
        return;
    }

    console.log("Thank you for suscribing!");
    MensajeExito();
});