from pathlib import Path

# Keep the Electrical Works image directly relevant to industrial panel installation,
# control-panel wiring, cabling and maintenance.
path = Path("src/App.js")
source = path.read_text()

old_urls = [
    "https://www.eabel.com/wp-content/uploads/2024/11/Worker-adjusting-components-in-a-control-panel.webp",
    "https://assets.kununu.com/images/images_company/202306/crop_760_760/bodo-wascher-gruppe_21d29c67b4f1f273973ce34b089d3ab5.jpg",
]
new = "https://isemc.com.mx/images/cableado-control-automatizacion/cableado-control-automatizacion.webp"

for old in old_urls:
    if old in source:
        source = source.replace(old, new, 1)
        path.write_text(source)
        print("Electrical Works image replaced with a service-specific industrial control-panel wiring image.")
        break
else:
    print("Electrical Works image patch already applied or source mapping changed.")
