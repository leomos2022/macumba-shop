import { SeparadorRombo, Rombo } from "./rombo";

const DATOS = [
  { valor: "100%", etiqueta: "Textiles reciclados" },
  { valor: "1/1", etiqueta: "Cada pieza no se repite" },
  { valor: "2", etiqueta: "Artistas, un colectivo" },
];

export function Historia() {
  return (
    <section
      id="historia"
      aria-labelledby="titulo-historia"
      className="relative overflow-hidden bg-crema"
    >
      <div
        className="textura-tejido pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-marca text-verde">
          QUIÉNES SOMOS
        </p>
        <h2
          id="titulo-historia"
          className="mt-3 font-display text-4xl text-tinta sm:text-5xl"
        >
          Viste Arte
        </h2>
        <SeparadorRombo className="mt-5" />

        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-left text-base leading-relaxed text-tinta/80">
          <p>
            Macumba Shop nace en Bogotá con una idea sencilla y poderosa: la
            ropa que ya existe merece una segunda vida, y merece que esa vida
            sea arte. Rescatamos textiles —denim, lana, algodones— que otros
            descartaron y los convertimos en chaquetas y abrigos que nadie más
            tendrá.
          </p>
          <p>
            Detrás de cada pieza hay un colectivo de artistas locales.{" "}
            <strong className="text-tinta">Robert</strong> pinta a mano:
            jaguares, colibríes, flores que suben por las mangas.{" "}
            <strong className="text-tinta">Arley</strong> borda: hilo por hilo,
            pétalos y palmas que tardan horas y no se apresuran. Ellos son los
            autores; tú, quien viste la obra.
          </p>
          <p>
            No producimos en serie. Cada pieza es única, firmada por el
            proceso: el textil que rescatamos, la mano que la intervino y la
            historia que ahora te pones. Por eso cada compra sostiene arte
            local y le quita una prenda más al vertedero.
          </p>
        </div>

        <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
          {DATOS.map((d) => (
            <div
              key={d.etiqueta}
              className="rounded-2xl border border-border/70 bg-card/70 px-4 py-6"
            >
              <dt className="sr-only">{d.etiqueta}</dt>
              <dd>
                <p className="font-display text-4xl text-morado">{d.valor}</p>
                <p className="mt-1 text-sm text-tinta/70">{d.etiqueta}</p>
              </dd>
            </div>
          ))}
        </dl>

        <Rombo className="mx-auto mt-12 h-6 w-6 text-pistacho" />
      </div>
    </section>
  );
}
