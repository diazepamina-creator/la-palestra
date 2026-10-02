#!/bin/sh
# El álbum de teoría (solo 1.º): los cuatro niveles, los cromos oficiales y
# cada cromo oficial suelto, en pdf/album/ (sh compila-album.sh)
#   guiado → semiguiado → titulos → libre: el andamiaje se retira a lo largo
#   del curso; el oficial es siempre el guiado, relleno en boli.
set -e
cd "$(dirname "$0")"
A=album-enteros
mkdir -p pdf/album/sueltos
uno(){  # uno NOMBRE "definiciones"
  for i in 1 2; do  # dos pasadas: el índice y el total de cromos
    xelatex -interaction=nonstopmode -halt-on-error -jobname="$1" "$2\\input{$A.tex}" > /dev/null
  done
}
for n in guiado semiguiado titulos libre; do
  uno "$A-$n" "\\def\\nivel{$n}"
done
uno "$A-oficial" "\\def\\modo{oficial}"
uno "$A-sueltos" "\\def\\modo{sueltos}"
mv $A-guiado.pdf $A-semiguiado.pdf $A-titulos.pdf $A-libre.pdf $A-oficial.pdf pdf/album/
rm -f pdf/album/sueltos/*.pdf
pdfseparate $A-sueltos.pdf pdf/album/sueltos/cromo-%02d.pdf
rm -f $A-*.pdf $A-*.aux $A-*.log $A-*.cro
echo "Hecho: pdf/album"
