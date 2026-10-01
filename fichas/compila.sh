#!/bin/sh
# Compila todas las fichas con XeLaTeX y deja los PDF en pdf/ (sh compila.sh)
set -e
cd "$(dirname "$0")"
mkdir -p pdf/2eso pdf/1eso pdf/profesor
for f in ficha-0*.tex clave.tex tiradores-recortables.tex; do
  xelatex -interaction=nonstopmode -halt-on-error "$f" > /dev/null
done
mv ficha-0?-*-1eso.pdf pdf/1eso/
mv ficha-0?-*.pdf pdf/2eso/
mv clave.pdf tiradores-recortables.pdf pdf/profesor/
rm -f *.aux *.log
echo "Hecho: pdf/2eso, pdf/1eso y pdf/profesor"
