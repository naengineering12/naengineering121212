from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()

# Repair the malformed chat stream separator if it ever reappears.
source = re.sub(
    r"const parts=buf\.split\('[^']*'\);",
    lambda _: "const parts=buf.split('\\n\\n');",
    source,
    count=1,
)

# Repair the missing closing fragment in About(). The source may contain
# either one or multiple blank lines before the next component.
source = re.sub(
    r"</main>}\s*function Industries",
    "</main></>}\nfunction Industries",
    source,
    count=1,
)

path.write_text(source)
print("Frontend syntax repairs applied before build.")
