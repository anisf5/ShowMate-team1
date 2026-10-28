import pymupdf
import os

path = r"C:\Users\Anis\Downloads\Club presentation-1 (1) (1).pdf"
outdir = r"C:\Users\Anis\Desktop\test\.taste-skill\pdf-pages"
os.makedirs(outdir, exist_ok=True)

doc = pymupdf.open(path)
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=110)
    pix.save(os.path.join(outdir, f"page-{i+1:02d}.png"))
    print(i + 1, pix.width, pix.height)
