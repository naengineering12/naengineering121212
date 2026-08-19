from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()
pattern = r"const parts=buf\.split\('[^']*'\);"
fixed = re.sub(
    pattern,
    lambda _: "const parts=buf.split('\\n\\n');",
    source,
    count=1,
)
if fixed != source:
    path.write_text(fixed)
    print("Fixed malformed chat stream split before build.")
else:
    print("Chat stream split is already valid.")
