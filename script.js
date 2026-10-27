
const contenedor = document.querySelector(".contenedor");
const frases = [...contenedor.querySelectorAll("p:not(.amor)")];
const centro = document.querySelector(".amor");

const ancho = 900;
const alto = 700;
const espacio = 9;

contenedor.style.width = `${ancho}px`;
contenedor.style.height = `${alto}px`;

contenedor.querySelectorAll("p").forEach(p => {
    p.style.position = "absolute";
    p.style.margin = "0";
    p.style.whiteSpace = "nowrap";
    p.style.fontSize = "11px";
});

centro.style.fontSize = "34px";

const puntos = [];
const total = 6000;

for (let i = 0; i <= total; i++) {
    const t = (i / total) * Math.PI * 2;

    puntos.push({
        x: 16 * Math.sin(t) ** 3,
        y: 13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t)
    });
}

const distancias = [0];

for (let i = 1; i < puntos.length; i++) {
    const dx = puntos[i].x - puntos[i - 1].x;
    const dy = puntos[i].y - puntos[i - 1].y;

    distancias.push(
        distancias[i - 1] + Math.hypot(dx, dy)
    );
}

const perimetro = distancias[total];

const anchos = frases.map(frase =>
    frase.getBoundingClientRect().width
);

const longitudNecesaria =
    anchos.reduce((suma, valor) => suma + valor, 0)
    + espacio * frases.length;

const escalaTexto = longitudNecesaria / perimetro;

const escalaMaxima = Math.min(
    (ancho - 100) / 32,
    (alto - 100) / 34
);

const escala = Math.min(escalaTexto, escalaMaxima);

const minimoX = Math.min(...puntos.map(p => p.x));
const maximoY = Math.max(...puntos.map(p => p.y));

const margenX = (ancho - 32 * escala) / 2;
const margenY = (alto - 34 * escala) / 2;

function buscarPunto(distancia) {
    let izquierda = 0;
    let derecha = distancias.length - 1;

    while (izquierda < derecha) {
        const medio = Math.floor((izquierda + derecha) / 2);

        if (distancias[medio] < distancia) {
            izquierda = medio + 1;
        } else {
            derecha = medio;
        }
    }

    return Math.max(1, Math.min(izquierda, total - 1));
}

let recorrido = 0;

frases.forEach((frase, indice) => {
    const anchoTexto = anchos[indice];

    const centroTexto =
        recorrido + anchoTexto / 2;

    const posicion = centroTexto / escala;
    const i = buscarPunto(posicion);

    const punto = puntos[i];
    const anterior = puntos[i - 1];
    const siguiente = puntos[i + 1];

    const x = margenX + (punto.x - minimoX) * escala;
    const y = margenY + (maximoY - punto.y) * escala;

    const dx = siguiente.x - anterior.x;
    const dy = -(siguiente.y - anterior.y);

    let angulo = Math.atan2(dy, dx) * 180 / Math.PI;

    if (angulo > 90) angulo -= 180;
    if (angulo < -90) angulo += 180;

    frase.style.left = `${x}px`;
    frase.style.top = `${y}px`;
    frase.style.transform =
        `translate(-50%, -50%) rotate(${angulo}deg)`;

    recorrido += anchoTexto + espacio;
});

centro.style.left = `${ancho / 2}px`;
centro.style.top = `${alto / 2 - 75}px`;
centro.style.transform = "translate(-50%, -50%)";
