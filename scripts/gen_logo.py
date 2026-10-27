#!/usr/bin/env python3
"""Generate CONCAVE's logo.svg from the supplied pincushion mark.

The mark is a symmetric shape with four protruding rounded corners and four
concave sides: in polar form r(theta) = R - k*cos(4*theta). This script keeps
the derivation reproducible next to the asset.
"""
import math

R = 270.0   # base radius
K = 66.0    # concavity depth (corner bulge)
CX = CY = 256.0
FILL = "#000000"
N = 720     # samples — smooth at 512px

def pt(theta):
    r = R - K * math.cos(4 * theta)
    return (CX + r * math.cos(theta), CY + r * math.sin(theta))

pts = [pt(2 * math.pi * i / N) for i in range(N)]
d = "M " + " L ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z"

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="CONCAVE">
  <title>CONCAVE</title>
  <path d="{d}" fill="{FILL}"/>
</svg>'''

import pathlib
out = pathlib.Path(__file__).resolve().parent.parent / "public" / "logo.svg"
out.write_text(svg)
print(f"wrote {out} ({len(svg)} bytes, {N} points)")
