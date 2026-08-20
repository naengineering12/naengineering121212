from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()

# Remove the Safety & Security service object from the services array.
source = re.sub(
    r'\n?\s*\{ slug:"safety-security", title:"Safety & Security", icon:ShieldCheck, image:"[^"]+", text:"[^"]+" \},',
    '',
    source,
    count=1,
)

# Remove its detail-page feature entry.
source = re.sub(
    r',?"Safety & Security":\[[^\]]*\]',
    '',
    source,
    count=1,
)

# Remove it from the home-page marquee.
source = source.replace(',"Safety & Security"]', ']')

# Remove any previous listing-only filter; the service itself is now gone from the data.
source = source.replace('services.filter(s=>s.slug!=="safety-security")', 'services')

# Remove the obsolete safety/security route if the app defines an explicit slug route.
source = source.replace('service.slug!=="safety-security"', 'true')

path.write_text(source)
print("Safety & Security service removed from the frontend source before build.")
