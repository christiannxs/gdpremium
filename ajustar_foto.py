#!/usr/bin/env python3
"""Adiciona margem no topo da imagem para evitar o efeito de cabeças cortadas."""
import sys
from pathlib import Path

from PIL import Image


def main():
    if len(sys.argv) < 2:
        print("Uso: python ajustar_foto.py <caminho_da_imagem>")
        sys.exit(1)

    path_in = Path(sys.argv[1])
    if not path_in.exists():
        print(f"Arquivo não encontrado: {path_in}")
        sys.exit(1)

    img = Image.open(path_in).convert("RGB")
    w, h = img.size

    # Margem no topo: ~20% da altura para "abrir" o enquadramento
    margin_top = int(h * 0.22)
    new_h = h + margin_top

    # Amostrar a cor do fundo (média dos pixels do topo)
    top_strip = img.crop((0, 0, w, min(30, h)))
    r, g, b = 0, 0, 0
    n = 0
    for x in range(top_strip.width):
        for y in range(top_strip.height):
            p = top_strip.getpixel((x, y))
            r += p[0]
            g += p[1]
            b += p[2]
            n += 1
    if n:
        bg = (r // n, g // n, b // n)
    else:
        bg = (230, 230, 230)  # cinza claro fallback

    # Nova imagem com margem no topo
    new_img = Image.new("RGB", (w, new_h), bg)
    new_img.paste(img, (0, margin_top))

    # Salva no mesmo diretório; se falhar (ex.: sandbox), salva no diretório atual
    path_out = path_in.parent / f"{path_in.stem}_ajustada{path_in.suffix}"
    try:
        new_img.save(path_out, quality=95)
    except OSError:
        path_out = Path.cwd() / f"{path_in.stem}_ajustada{path_in.suffix}"
        new_img.save(path_out, quality=95)
    print(f"Salvo: {path_out}")
    return path_out


if __name__ == "__main__":
    main()
