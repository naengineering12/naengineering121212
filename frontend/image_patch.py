from pathlib import Path

# Keep the Electrical Works image directly relevant to industrial panel wiring,
# cabling and installation. This runs after fix_build.py so it overrides any
# older image mapping without changing the site's service structure.
path = Path("src/App.js")
source = path.read_text()

old = "https://www.eabel.com/wp-content/uploads/2024/11/Worker-adjusting-components-in-a-control-panel.webp"
new = "https://assets.kununu.com/images/images_company/202306/crop_760_760/bodo-wascher-gruppe_21d29c67b4f1f273973ce34b089d3ab5.jpg"

if old in source:
    source = source.replace(old, new, 1)
    path.write_text(source)
    print("Electrical Works image replaced with an industrial control-panel wiring image.")
else:
    print("Electrical Works image patch already applied or source mapping changed.")
