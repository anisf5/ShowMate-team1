import pymupdf
import sys

path = r"C:\Users\Anis\Downloads\Club presentation-1 (1) (1).pdf"
doc = pymupdf.open(path)
out = []
out.append(f"pages: {doc.page_count}")
for i, page in enumerate(doc):
    out.append(f"\n===== PAGE {i + 1} =====")
    out.append(page.get_text("text").strip())
    images = page.get_images(full=True)
    if images:
        out.append(f"[images on page: {len(images)}]")

text = "\n".join(out)
with open(r"C:\Users\Anis\Desktop\test\.taste-skill\pdf-text.txt", "w", encoding="utf-8") as f:
    f.write(text)

print(text[:4000])
