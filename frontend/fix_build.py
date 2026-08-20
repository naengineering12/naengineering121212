"""Apply deterministic frontend syntax repairs before build."""
from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

# About() must close its React fragment before Industries().
source = source.replace("</main>}\nfunction Industries", "</main></>}\nfunction Industries", 1)

# Keep the streamed chat parser's separator as a normal escaped literal.
source = source.replace("const parts=buf.split('\\n\\n');", "const parts=buf.split('\\n\\n');", 1)

path.write_text(source)
print("Frontend syntax repairs applied before build.")
