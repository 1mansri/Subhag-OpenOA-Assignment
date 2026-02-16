#!/usr/bin/env python3
"""
patch_openoa.py — Patch OpenOA source files to lazy-import unused heavy deps.

Replaces top-level imports of bokeh, IPython, and eia with try/except blocks.
This allows us to skip installing these packages (~130MB+ savings):
  - bokeh (~80MB)  — used only in plot.py for interactive wind farm maps
  - IPython (~30MB) — used only in plant.py for notebook display
  - ipywidgets (~20MB) — transitive dep of IPython
  - eia-python — used only in metadata_fetch.py for EIA API

Run this AFTER cloning the repo and BEFORE starting the server.
Works on all platforms (Windows, macOS, Linux).
"""

import os
import sys


def patch_file(filepath: str, replacements: list[tuple[str, str]]) -> bool:
    """Replace exact strings in a file. Returns True if any changes were made."""
    if not os.path.isfile(filepath):
        print(f"  ⚠ File not found: {filepath}")
        return False

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    for old, new in replacements:
        content = content.replace(old, new)

    if content == original:
        print(f"  ⚠ No changes needed in {os.path.basename(filepath)} (already patched?)")
        return False

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    return True


def main():
    openoa_dir = sys.argv[1] if len(sys.argv) > 1 else "OpenOA_Repo/openoa"

    print("🔧 Patching OpenOA source files to lazy-import unused dependencies...")

    # ── 1. Patch openoa/utils/plot.py (bokeh) ──
    plot_file = os.path.join(openoa_dir, "utils", "plot.py")
    if patch_file(plot_file, [
        (
            "from bokeh.models import WMTSTileSource, ColumnDataSource\n"
            "from bokeh.palettes import Category10, viridis\n"
            "from bokeh.plotting import figure",

            "try:\n"
            "    from bokeh.models import WMTSTileSource, ColumnDataSource\n"
            "    from bokeh.palettes import Category10, viridis\n"
            "    from bokeh.plotting import figure\n"
            "except ImportError:\n"
            "    WMTSTileSource = ColumnDataSource = None\n"
            "    Category10 = viridis = None\n"
            "    figure = None"
        ),
    ]):
        print("  ✓ Patched plot.py (bokeh → lazy import)")

    # ── 2. Patch openoa/plant.py (IPython) ──
    plant_file = os.path.join(openoa_dir, "plant.py")
    if patch_file(plant_file, [
        (
            "from IPython.display import Markdown, display",
            "try:\n"
            "    from IPython.display import Markdown, display\n"
            "except ImportError:\n"
            "    Markdown = display = None"
        ),
    ]):
        print("  ✓ Patched plant.py (IPython.display → lazy import)")

    # ── 3. Patch openoa/utils/metadata_fetch.py (eia) ──
    meta_file = os.path.join(openoa_dir, "utils", "metadata_fetch.py")
    if patch_file(meta_file, [
        (
            "import eia",
            "try:\n"
            "    import eia\n"
            "except ImportError:\n"
            "    eia = None"
        ),
    ]):
        print("  ✓ Patched metadata_fetch.py (eia → lazy import)")

    print("✅ All patches applied.")


if __name__ == "__main__":
    main()
