"""Lembar pratinjau 2 x 5 foto depan: python scripts/contact-sheet.py <keluaran.png> [view]"""
import glob, sys
from PIL import Image
out = sys.argv[1]; view = sys.argv[2] if len(sys.argv) > 2 else "front"
fs = sorted(glob.glob(f"public/products/*-{view}.webp"))
W, H = 645, 1000
sheet = Image.new("RGB", (W * 5, H * 2), (238, 237, 234))
for i, f in enumerate(fs):
    im = Image.open(f).convert("RGBA"); sheet.paste(im, ((i % 5) * W, (i // 5) * H), im)
sheet.save(out)
