# Marca GLOps Labs — pipeline de assets (wireado 16-sep-2026)

Fuente de verdad: `logo-master.png` (lockup 855×605) + `isotipo.jpeg` (rocket puro
1070×992, fuente de `logo-mark.png` 1024×1024 con aire). Todo lo demás se
**regenera**, no se edita. Sin `potrace`/`imagemagick` en la máquina no hay
vectorización: PNG es el formato correcto, no se shippea un SVG auto-trazado mediocre.

Transparencia: `logo-mark.png`, `logo.png` y el set `icon-512/192` llevan fondo
transparente —el blanco se corta con flood-fill desde los bordes (`cutWhiteBackground`,
los blancos interiores de los nodos y de las letras sobreviven porque el fill no los alcanza,
y los bordes funden suave en vez de corte duro—. Ojo: los visores muestran la transparencia
como blanco, si se ven "iguales" al abrirlos es por eso; la prueba real es componer sobre
dark (verificado: sin cajas blancas). Los favicons `favicon-32/16.png` (+ `icon-32/16.png`)
van en tile blanco con boost (recorte 90% + contraste/saturación): la marca sola es
ilegible a 16px y el tile le da bordes. Solo `apple-touch-icon.png` sale opaco en blanco
(Apple lo exige: lo transparente sale negro en iOS) y va como `maskable` en el manifest.
El footer conserva su badge blanco a propósito: el navy sobre dark casi no se lee.
`logo-master.png` e `isotipo.jpeg` son archivo, siempre intactos.

## 1. Soltar el master (hecho)

`logo-master.png` + `logo-mark.png` ya están en esta carpeta.

Si consigues el vector original, súbelo como `logo-master.svg` y el pipeline pasa a
vector-first.

## 2. Generar derivados

```sh
pnpm brand
```

Produce: `logo.png` (lockup transparente ≤1200px), `logo-mark.png` (1024),
`icon-512/192.png`, `apple-touch-icon.png` (180, opaco), favicons en tile
blanco `favicon-32/16.png` + `icon-32/16.png`, y copia `app/icon.png` +
`app/apple-icon.png` (wire automático).

## 3. Wire en app (hecho 16-sep-2026)

- [x] `app/icon.png` + `app/apple-icon.png` (convenciones Next), `app/icon.svg` placeholder borrado
- [x] `app/manifest.ts` icons → `/brand/glops/icon-192.png` + `/brand/glops/icon-512.png`
- [x] `components/Nav.tsx` + `Footer.tsx` con `next/image` (`/brand/glops/logo-mark-mono-white.png`: pill navy en nav, footer sin badge — ver SPEC §§14-15)
- [x] `app/og/[locale]/route.tsx` con logo incrustado vía `readFile` + data URL
- [x] e2e valida `/icon.png` + `/apple-icon.png` + link `GLOps Labs — top` en header

## Paleta del logo (adoptada en tokens)

- Navy `#112255` medido del master (texto GLOps + líneas rocket) → `brand` en `config/tokens.json` + `--color-brand` en CSS
- Teal `#22AA99` (acentos circuito) → `teal` en `config/tokens.json` + `--color-teal` en CSS
- Fuente normativa: `BRANDBOOK_GLOPS.md` v1.0 (manda en todo lo visual)
- Regla: el naranja `#F97316` sigue siendo el acento UI; el logo manda en marca, no se re-tiñe
