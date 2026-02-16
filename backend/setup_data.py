#!/usr/bin/env python3
"""
setup_data.py — Download and prepare the OpenOA dataset for local development.

This script replicates what the Dockerfile does:
  1. Shallow-clones the OpenOA repository (NatLabRockies fork)
  2. Unzips the La Haute Borne sample dataset
  3. Patches OpenOA source to lazy-import unused heavy deps
  4. Installs OpenOA with --no-deps + only the required dependencies

Works on Windows, macOS, and Linux.

Usage:
    python setup_data.py
"""

import os
import sys
import subprocess
import zipfile

REPO_URL = "https://github.com/NatLabRockies/OpenOA.git"
REPO_DIR = "OpenOA_Repo"
DATA_ZIP = os.path.join(REPO_DIR, "examples", "data", "la_haute_borne.zip")
DATA_DIR = os.path.join(REPO_DIR, "examples", "data", "la_haute_borne")

# Only the deps our code paths actually use (matches Dockerfile)
REQUIRED_DEPS = [
    "numpy>=1.24",
    "pandas>=2.2,<3",
    "scipy>=1.7",
    "scikit-learn>=1.0,<1.7",
    "statsmodels>=0.13.3",
    "matplotlib>=3.6",
    "pygam>=0.11.0",
    "attrs>=22.2",
    "tqdm>=4.28.1",
    "pyproj>=3.5",
    "shapely>=1.8",
    "tabulate",
    "pytz",
    "pyyaml",
]


def run(cmd: list[str], cwd: str | None = None):
    """Run a command and exit on failure."""
    print(f"  → {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd)
    if result.returncode != 0:
        print(f"  ✖ Command failed with exit code {result.returncode}")
        sys.exit(1)


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print("=" * 60)
    print("  SUBHAG — OpenOA Data Setup (Slim)")
    print("=" * 60)

    # ── Step 1: Clone repository ──────────────────────────────
    if os.path.isdir(REPO_DIR):
        print(f"\n✓ Repository already exists at ./{REPO_DIR}, skipping clone.")
    else:
        print(f"\n[1/4] Cloning OpenOA repository (shallow)...")
        run(["git", "clone", "--depth", "1", REPO_URL, REPO_DIR])
        print("  ✓ Clone complete.")

    # ── Step 2: Extract dataset ───────────────────────────────
    if os.path.isdir(DATA_DIR) and os.listdir(DATA_DIR):
        print(f"\n✓ Dataset already extracted at ./{DATA_DIR}, skipping.")
    elif os.path.isfile(DATA_ZIP):
        print(f"\n[2/4] Extracting La Haute Borne dataset...")
        os.makedirs(DATA_DIR, exist_ok=True)
        with zipfile.ZipFile(DATA_ZIP, "r") as zf:
            zf.extractall(DATA_DIR)
        print(f"  ✓ Extracted to ./{DATA_DIR}")
    else:
        print(f"\n✖ ERROR: ZIP file not found at {DATA_ZIP}")
        print("  The repository may have changed. Please check manually.")
        sys.exit(1)

    # ── Step 2.5: Remove .git folder to save space ────────────────
    git_dir = os.path.join(REPO_DIR, ".git")
    if os.path.exists(git_dir):
        print(f"\n  Removing .git folder to save space...")
        try:
            import shutil
            def on_error(func, path, exc_info):
                import stat
                if not os.access(path, os.W_OK):
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                else:
                    raise
            shutil.rmtree(git_dir, onerror=on_error)
            print("  ✓ .git folder removed.")
        except Exception as e:
            print(f"  ⚠️ Could not remove .git folder: {e}")

    # ── Step 3: Patch OpenOA source ───────────────────────────
    print(f"\n[3/4] Patching OpenOA source (lazy-import unused deps)...")
    patch_script = os.path.join(script_dir, "patch_openoa.py")
    if os.path.isfile(patch_script):
        run([sys.executable, patch_script, os.path.join(REPO_DIR, "openoa")])
    else:
        print("  ⚠️ patch_openoa.py not found, skipping patches.")

    # ── Step 4: Install OpenOA (--no-deps) + required deps ────
    print(f"\n[4/4] Installing OpenOA (slim, --no-deps) + required dependencies...")
    print("  (This may take a few minutes on first run)\n")

    # Install OpenOA package without its dependency tree
    run([sys.executable, "-m", "pip", "install", "--no-deps", "--default-timeout=300", "."], cwd=REPO_DIR)

    # Install only the deps we actually need
    run([sys.executable, "-m", "pip", "install", "--default-timeout=300"] + REQUIRED_DEPS)

    # ── Done ──────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("  ✓ Setup complete!")
    print("=" * 60)
    print(f"\n  Dataset: ./{DATA_DIR}")
    print(f"  Start the server with:")
    print(f"    uvicorn main:app --host 0.0.0.0 --port 8000 --reload\n")


if __name__ == "__main__":
    main()
