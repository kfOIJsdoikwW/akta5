# A.K.T.A. – 5. akta (grooming) – Robotzsaru Adattár

Telefonra tervezett oldal. Minden szereplő, név, cég és adat kitalált.

## Feltöltés GitHub Pages-re
Töltsd fel az `index.html`, `style.css`, `app.js` fájlokat és az `img/` mappát egy repó gyökerébe,
majd Settings → Pages → Branch: `main`, mappa: `/ (root)`. A `MEGOLDOKULCS.md` fájlt NE töltsd fel.

## A plüss képe
Cseréld le az `img/pluss.jpg` fájlt a saját képedre, ugyanezen a néven. A metaadat-elemző a feltöltött
képet a szerveren lévő `img/pluss.jpg`-vel veti össze kis felbontáson, így a telefon általi
újratömörítés nem zavarja. A megjelenített metaadatok az `app.js`-ben vannak, a képbe nem kell
valódi EXIF-adatot írni. Helyi (file://) megnyitásnál az összehasonlítás nem működik, ott bármilyen
kép elfogadott; GitHub Pages-en már csak a helyes.

## Beállítás az app.js elején
`SHOW_LILI_REPLIES = false` esetén a Dani–Lili beszélgetésben csak a Lilinek címzett üzenetek látszanak.

## Csoportváltás
A főoldal alján a „RENDSZER LEZÁRÁSA” gomb minden haladást töröl.
