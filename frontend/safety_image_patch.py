from pathlib import Path

path = Path("src/App.js")
source = path.read_text()
old_url = "https://www.buchen-group.be/fileadmin/_processed_/6/1/csm_BUCHEN-_DSC4125-2-FINAL_teaser_033546d692.webp"
new_url = "https://apiprocessing.com/wp-content/uploads/Essential-Steps-to-Obtain-Your-Florida-General-Contractor-License-Successfully-1024x574.png"
source = source.replace(old_url, new_url, 1)
path.write_text(source)
print("Safety & Security image updated to a helmet, safety cones and hi-vis PPE image.")
