"""Apply deterministic frontend syntax repairs and homepage copy updates before build."""
from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

# About() must close its React fragment before Industries().
source = source.replace("</main>}\nfunction Industries", "</main></>}\nfunction Industries", 1)

# Keep the streamed chat parser's separator as a normal escaped literal.
source = source.replace("const parts=buf.split('\\n\\n');", "const parts=buf.split('\\n\\n');", 1)

# Replace the generic homepage hero paragraph with warmer, more human copy.
old_copy = "Design, Manufacturing, Installation — all under one roof. NA Engineering Solutions is your trusted partner for engineering, construction, industrial solutions, general order supplies and project support."
new_copy = "From the first conversation to the final handover, we make engineering and industrial work easier to manage. NA Engineering Solutions brings together practical engineering, dependable supplies, skilled installation and project support — so you have one trusted team to turn your requirements into real, workable solutions."
source = source.replace(old_copy, new_copy, 1)

path.write_text(source)
print("Frontend syntax repairs and homepage copy update applied before build.")
