"""
Membuat foto produk berlogo OFFDAY dari foto sumber di assets-src/products.
Jalankan dari akar proyek:  python scripts/make-mockups.py
Sumber tidak diubah. Hasil ditulis ke public/products (nama file sama).
Koordinat dalam piksel kanvas 645 x 1000. Ubah PLACEMENT lalu jalankan ulang untuk mengoreksi penempatan.
"""
import cv2
import numpy as np
from PIL import Image

SRC = "assets-src/products"
OUT = "public/products"
LOGO = Image.open("assets-src/logo-ink-full.png").convert("RGBA")
LOGO_AR = LOGO.width / LOGO.height  # ~2.04
INK = np.array([22, 20, 18], np.float32)
BONE = np.array([243, 238, 226], np.float32)

rng = np.random.default_rng(7)


def load(slug, view):
    return np.array(Image.open(f"{SRC}/{slug}-{view}.webp").convert("RGBA"))


def save(arr, slug, view):
    Image.fromarray(arr).save(f"{OUT}/{slug}-{view}.webp", quality=92, method=6)


def lum(rgb):
    return (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) / 255.0


def erase(img, roi, thr=22, dil=9, rad=6, clone=None):
    """Hapus tulisan lama di roi (x0,y0,x1,y1): deteksi piksel yang berbeda dari kain sekitar, lalu inpaint + butir kain."""
    x0, y0, x1, y1 = roi
    rgb = np.ascontiguousarray(img[..., :3])
    base = cv2.medianBlur(rgb, 51)
    diff = np.abs(rgb.astype(np.int16) - base.astype(np.int16)).max(-1)
    mask = np.zeros(diff.shape, np.uint8)
    mask[y0:y1, x0:x1] = (diff[y0:y1, x0:x1] > thr).astype(np.uint8) * 255
    mask &= (img[..., 3] > 200).astype(np.uint8) * 255
    mask = cv2.dilate(mask, np.ones((dil, dil), np.uint8))
    if clone:  # kain polos: isi dari area bersih yang digeser (lebih natural daripada inpaint)
        dx, dy = clone
        src = np.roll(np.roll(rgb, dy, 0), dx, 1)
        out = np.where(mask[..., None] > 0, src, rgb)
        mask = cv2.dilate(mask, np.ones((5, 5), np.uint8))
        out = np.where(cv2.GaussianBlur(mask, (0, 0), 2)[..., None] > 0, out, rgb)
    else:
        out = cv2.inpaint(rgb, mask, rad, cv2.INPAINT_TELEA)
    # butir kain: samakan noise dengan sekitar roi yang bersih
    clean = ~(cv2.dilate(mask, np.ones((25, 25), np.uint8)) > 0)
    ring = np.zeros_like(clean)
    ring[max(0, y0 - 40):y1 + 40, max(0, x0 - 40):x1 + 40] = True
    ring &= clean & (img[..., 3] > 250)
    hp = rgb.astype(np.float32) - cv2.GaussianBlur(rgb, (0, 0), 2).astype(np.float32)
    sd = float(hp[ring].std()) if ring.any() else 2.0
    soft = cv2.GaussianBlur(mask, (0, 0), 2).astype(np.float32)[..., None] / 255.0
    if clone:
        soft = np.clip(cv2.GaussianBlur(mask, (0, 0), 7).astype(np.float32)[..., None] / 255.0 * 1.5, 0, 1)
        res0 = img.copy(); res0[..., :3] = np.clip(img[..., :3] * (1 - soft) + out * soft, 0, 255).astype(np.uint8)
        return res0
    n = rng.normal(0, sd * 0.9, out.shape[:2])[..., None].astype(np.float32)
    n = cv2.GaussianBlur(n[..., 0], (0, 0), 0.6)[..., None]
    out = np.clip(out.astype(np.float32) + n * soft, 0, 255)
    res = img.copy()
    res[..., :3] = np.where(soft > 0, out, img[..., :3]).astype(np.uint8)
    return res


def fabric_shade(img):
    """Pencahayaan frekuensi rendah kain, dinormalkan terhadap median."""
    L = lum(img[..., :3].astype(np.float32))
    low = cv2.GaussianBlur(L.astype(np.float32), (0, 0), 18)
    med = np.median(low[img[..., 3] > 250])
    return np.clip(low / max(med, 1e-3), 0.7, 1.2)


def logo_layer(shape, cx, cy, width, angle=0.0, persp=0.0, ink=None):
    """Kanvas RGBA float: logo dengan alpha, diputar & sedikit perspektif (persp = selisih tinggi kiri/kanan, 0.04 = 4%)."""
    h = int(width / LOGO_AR)
    lg = np.array(LOGO.resize((int(width), h), Image.LANCZOS))
    a = lg[..., 3].astype(np.float32) / 255.0
    src = np.float32([[0, 0], [width, 0], [width, h], [0, h]])
    k = persp * h
    dst = src + np.float32([[0, k], [0, -k], [0, k * 0 - k], [0, k]])  # placeholder diganti di bawah
    dst = np.float32([[0, k], [width, -k], [width, h + k], [0, h - k]])
    M = cv2.getPerspectiveTransform(src, dst)
    R = cv2.getRotationMatrix2D((width / 2, h / 2), angle, 1.0)
    R3 = np.vstack([R, [0, 0, 1]])
    T = np.float32([[1, 0, cx - width / 2], [0, 1, cy - h / 2], [0, 0, 1]])
    full = T @ R3 @ M
    H, W = shape[:2]
    warped = cv2.warpPerspective(a, full, (W, H), flags=cv2.INTER_AREA if False else cv2.INTER_LINEAR)
    return cv2.GaussianBlur(warped, (0, 0), 0.55)


def apply_logo(img, cx, cy, width, angle=0.0, persp=0.0, force=None, opacity=0.94, region=None):
    rgb = img[..., :3].astype(np.float32)
    a = logo_layer(img.shape, cx, cy, width, angle, persp)
    garment = (img[..., 3].astype(np.float32) / 255.0)
    a = a * garment
    # warna kain tepat di bawah sablon
    m = a > 0.05
    if not m.any():
        raise RuntimeError("logo di luar kain")
    ys, xs = np.where(m)
    area = rgb[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    under = np.median(area.reshape(-1, 3), 0)
    L = float(lum(under[None, :])[0])
    dark_fabric = L < 0.45
    ink = (BONE if dark_fabric else INK) if force is None else (BONE if force == "bone" else INK)
    shade = fabric_shade(img)[..., None]
    hp = rgb - cv2.GaussianBlur(rgb, (0, 0), 1.6)
    tex = (lum(hp + 128) - 0.5)[..., None]  # serat kain
    col = ink[None, None, :] * (0.55 + 0.45 * shade) + tex * 55
    # pada kain gelap, sablon putih sedikit menyerap warna kain
    col = col * 0.94 + under[None, None, :] * 0.06
    col = np.clip(col, 0, 255)
    al = np.clip(a * opacity, 0, 1)[..., None]
    out = rgb * (1 - al) + col * al
    res = img.copy()
    res[..., :3] = np.clip(out, 0, 255).astype(np.uint8)
    return res, ("bone" if dark_fabric else "ink")


def patch(img, cx, cy, w, h, logo_w, angle=0.0):
    """Patch kain polos bertepi jahitan halus sebagai dudukan logo (untuk kain bergaris)."""
    H, W = img.shape[:2]
    rgb = img[..., :3].astype(np.float32)
    shade = fabric_shade(img)[..., None]
    canvas = np.zeros((H, W), np.uint8)
    box = cv2.boxPoints(((cx, cy), (w, h), angle)).astype(np.int32)
    cv2.fillConvexPoly(canvas, box, 255)
    shadow = cv2.GaussianBlur(np.roll(np.roll(canvas, 3, 0), 2, 1).astype(np.float32) / 255, (0, 0), 3)[..., None] * 0.28
    m = (canvas.astype(np.float32) / 255)[..., None]
    m = cv2.GaussianBlur(m[..., 0], (0, 0), 0.7)[..., None]
    garment = (img[..., 3:4].astype(np.float32) / 255)
    cloth = np.array([241, 236, 224], np.float32)[None, None, :] * (0.6 + 0.4 * shade)
    n = rng.normal(0, 2.2, (H, W, 1)).astype(np.float32)
    cloth = cloth + n
    out = rgb * (1 - shadow * garment)
    out = out * (1 - m) + cloth * m
    # jahitan putus-putus di dalam tepi
    inset = cv2.boxPoints(((cx, cy), (w - 12, h - 12), angle))
    stitch = np.zeros((H, W), np.uint8)
    for i in range(4):
        p, q = inset[i], inset[(i + 1) % 4]
        d = np.linalg.norm(q - p)
        steps = int(d / 7)
        for s in range(steps):
            if s % 2 == 0:
                a_ = p + (q - p) * (s / steps)
                b_ = p + (q - p) * ((s + 0.62) / steps)
                cv2.line(stitch, tuple(np.round(a_).astype(int)), tuple(np.round(b_).astype(int)), 255, 1, cv2.LINE_AA)
    st = (stitch.astype(np.float32) / 255)[..., None] * 0.8
    out = out * (1 - st) + np.array([40, 46, 72], np.float32) * st
    res = img.copy()
    res[..., :3] = np.clip(out, 0, 255).astype(np.uint8)
    res, _ = apply_logo(res, cx, cy, logo_w, angle, force="ink")
    return res


# ---------------------------------------------------------------- penempatan
# cx, cy = pusat logo, w = lebar logo (px). Ukur terhadap kain: kaos/hoodie/sweatshirt ~45-55% lebar badan.
FRONT = {
    "kaos-heavyweight-tulang": dict(erase=(395, 292, 505, 335), thr=14, logo=(322, 318, 208, 0, 0.0)),
    "kaos-grafis-arang": dict(erase=(150, 285, 495, 400), thr=12, dil=19, clone=(0, 120), logo=(322, 322, 210, 0, 0.0)),
    "kaos-oversized-oker": dict(erase=(375, 285, 478, 330), thr=30, logo=(322, 300, 214, 0, 0.0)),
    "hoodie-fleece-heather": dict(erase=(195, 295, 455, 410), thr=26, logo=(322, 368, 212, 0, 0.0)),
    "sweatshirt-crewneck-lilac": dict(erase=(190, 280, 450, 390), thr=16, logo=(322, 318, 212, 0, 0.0)),
    "kemeja-oxford-langit": dict(erase=(395, 305, 485, 355), thr=12, logo=(438, 326, 130, 0, 0.0)),
    "polo-pique-hutan": dict(erase=(380, 308, 480, 352), thr=24, logo=(434, 332, 126, 0, 0.0)),
    "henley-bata": dict(logo=(434, 332, 132, 0, 0.0)),
    "kardigan-rajut-zaitun": dict(logo=(454, 388, 126, 0, 0.0)),
}
BRETON = dict(cx=322, cy=345, w=236, h=134, logo_w=176, angle=0)

BACK = {
    "kaos-grafis-arang": dict(erase=(270, 185, 375, 225), thr=12, dil=15, clone=(0, 40), logo=(322, 207, 96, 0, 0.0)),
    "kaos-oversized-oker": dict(erase=(180, 240, 470, 500), thr=30, logo=(325, 345, 268, 0, 0.0)),
}
SIDE_CLEAN = {
    "kaos-grafis-arang": dict(erase=(235, 250, 315, 420), thr=35),
    "sweatshirt-crewneck-lilac": dict(erase=(300, 290, 345, 400), thr=22),
    "hoodie-fleece-heather": dict(erase=(250, 280, 330, 420), thr=60),
}


def main():
    slugs = sorted({p.split("-front")[0] for p in __import__("glob").glob(f"{SRC}/*-front.webp")})
    slugs = [s.split("/")[-1].split("\\")[-1] for s in slugs]
    only = __import__("sys").argv[1:]
    for slug in slugs:
        if only and slug not in only:
            continue
        # semua sudut mulai dari sumber
        for view in ("front", "back", "side"):
            img = load(slug, view)
            if view == "front":
                if slug == "breton-lengan-panjang":
                    img = patch(img, **BRETON)
                else:
                    cfg = FRONT[slug]
                    if "erase" in cfg:
                        img = erase(img, cfg["erase"], cfg.get("thr", 22), dil=cfg.get("dil", 9), clone=cfg.get("clone"))
                    cx, cy, w, ang, pr = cfg["logo"]
                    img, tone = apply_logo(img, cx, cy, w, ang, pr)
            elif view == "back" and slug in BACK:
                cfg = BACK[slug]
                img = erase(img, cfg["erase"], cfg["thr"], dil=cfg.get("dil", 11), clone=cfg.get("clone"))
                cx, cy, w, ang, pr = cfg["logo"]
                img, tone = apply_logo(img, cx, cy, w, ang, pr)
            elif view == "side" and slug in SIDE_CLEAN:
                cfg = SIDE_CLEAN[slug]
                img = erase(img, cfg["erase"], cfg["thr"], dil=7, clone=cfg.get("clone"))
                if slug == "kaos-grafis-arang":  # sisa tepi putih sablon lama di siluet samping
                    x0, y0, x1, y1 = cfg["erase"]
                    reg = img[y0:y1, x0:x1]
                    bright = (lum(reg[..., :3].astype(np.float32)) > 0.28) & (reg[..., 3] > 0)
                    bright = cv2.dilate(bright.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
                    reg[..., :3][bright & (reg[..., 3] > 0)] = (34, 34, 34)
            save(img, slug, view)
            print("ok", slug, view)


if __name__ == "__main__":
    main()
