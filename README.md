# Macumba Shop 🌿 ◆

Tienda de moda arte — prendas únicas de denim reciclado intervenidas a mano por artistas bogotanos (Robert / Arley). Pedidos por WhatsApp con pago contra entrega.

Diseño **Selva Viva**: crema `#F7F3E9` · verde selva `#1E5631` · pistacho `#93C572` · morado `#5B2A86` (solo CTA) · tipografías Fraunces + Outfit · motivo rombo del bordado.

## Requisitos

- **Node.js 20 o superior** (recomendado 22 LTS) — [nodejs.org](https://nodejs.org)
- npm (viene con Node)
- Git (y opcionalmente [GitHub CLI](https://cli.github.com) `gh`)

## Montaje en local (localhost)

```bash
# 1. Clonar
gh repo clone leomos2022/macumba-shop
# o: git clone https://github.com/lemos2022/macumba-shop.git
cd macumba-shop

# 2. Instalar dependencias (genera el cliente de Prisma automáticamente)
npm install

# 3. Variables de entorno
cp .env.example .env
#    → ajusta DATABASE_URL si prefieres ruta absoluta

# 4. Crear la base de datos Y cargar el catálogo (un solo paso)
npm run db:setup

# 5. Levantar en localhost
npm run dev
```

Abre **http://localhost:3000** 🎉

> Si algún día la base de datos se daña o quieres partir de cero: borra `db/custom.db` y vuelve a correr `npm run db:setup`.
>
> ¿La Sala o el catálogo salen en blanco, sin prendas ni precios? Es la base de datos sin crear/sembrar: detén el servidor, corre `npm run db:setup` y vuelve a levantar `npm run dev`.

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `:3000` |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run db:push` | Sincroniza `prisma/schema.prisma` con SQLite |
| `npm run db:seed` | Carga el catálogo inicial (`scripts/seed.ts`) |
| `npm run db:setup` | Un solo paso: crea la base de datos y carga el catálogo |
| `npm run lint` | ESLint |

## Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Ruta de la SQLite (`file:../db/custom.db` por defecto) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número oficial de WhatsApp, sin `+` ni espacios (ej. `573204959889`) |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind 4 · shadcn/ui · Prisma + SQLite · Zustand (canasta persistente)

## Estructura

```
src/app/            Rutas (Inicio con hero video + La Sala + El Estudio + Historia)
src/components/     Componentes de la tienda
src/lib/macumba.ts  Utilidades (formato COP, enlaces wa.me, mensajes)
prisma/             Esquema de la base de datos
scripts/seed.ts     Catálogo inicial
public/tienda/      Fotos de pasarela, ghost mannequin y video del desfile
```

## Notas de diseño

- El arte es **intocable**: las fotos del catálogo son las piezas reales pintadas a mano — nunca aplicar filtros, recortes creativos ni IA sobre ellas.
- Tarjetas de prenda con esquinas cuadradas (`rounded-[10px]`) — los marcos de arco están retirados del sistema.
- El morado `#5B2A86` se reserva para acciones (CTA); nunca decorativo.
