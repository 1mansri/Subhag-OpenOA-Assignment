#!/usr/bin/env python3
"""
setup_data.py — Download and prepare the OpenOA dataset for local development.

This script replicates what the Dockerfile does:
  1. Shallow-clones the OpenOA repository (NatLabRockies fork)
  2. Unzips the La Haute Borne sample dataset
  3. Installs OpenOA with example dependencies

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
    print("  SUBHAG — OpenOA Data Setup")
    print("=" * 60)

    # ── Step 1: Clone repository ──────────────────────────────
    if os.path.isdir(REPO_DIR):
        print(f"\n✓ Repository already exists at ./{REPO_DIR}, skipping clone.")
    else:
        print(f"\n[1/3] Cloning OpenOA repository (shallow)...")
        run(["git", "clone", "--depth", "1", REPO_URL, REPO_DIR])
        print("  ✓ Clone complete.")

    # ── Step 2: Extract dataset ───────────────────────────────
    if os.path.isdir(DATA_DIR) and os.listdir(DATA_DIR):
        print(f"\n✓ Dataset already extracted at ./{DATA_DIR}, skipping.")
    elif os.path.isfile(DATA_ZIP):
        print(f"\n[2/3] Extracting La Haute Borne dataset...")
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
        print(f"\n[2.5/3] Removing .git folder to save space...")
        try:
            import shutil
            # Change permission for read-only files (common in .git)
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

    # ── Step 3: Install OpenOA ────────────────────────────────
    print(f"\n[3/3] Installing OpenOA with example dependencies...")
    print("  (This may take a few minutes on first run)\n")
    run([sys.executable, "-m", "pip", "install", "--default-timeout=300", "."], cwd=REPO_DIR)

    # ── Done ──────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("  ✓ Setup complete!")
    print("=" * 60)
    print(f"\n  Dataset: ./{DATA_DIR}")
    print(f"  Start the server with:")
    print(f"    uvicorn main:app --host 0.0.0.0 --port 8000 --reload\n")


if __name__ == "__main__":
    main()
