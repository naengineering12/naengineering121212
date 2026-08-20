from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

# Use the same Safety & Security photo on the service listing and its detail page.
# Construction-site PPE photo: white hard hat, hi-vis vest and safety cones.
new_url = "https://apiprocessing.com/wp-content/uploads/Essential-Steps-to-Obtain-Your-Florida-General-Contractor-License-Successfully-1024x574.png"
urls = [
    "https://www.buchen-group.be/fileadmin/_processed_/6/1/csm_BUCHEN-_DSC4125-2-FINAL_teaser_033546d692.webp",
    "https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc",
    "https://www.lsh.sg/cdn/shop/files/worker-on-construction-site.jpg?v=1701737515",
]
for old_url in urls:
    source = source.replace(old_url, new_url)

path.write_text(source)
print("Safety & Security listing and detail pages now use the same PPE/cones image.")
