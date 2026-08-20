"""Apply deterministic frontend syntax repairs and homepage copy updates before build."""
from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

# About() must close its React fragment before Industries().
source = source.replace("</main>}\nfunction Industries", "</main></>}\nfunction Industries", 1)

# Keep the streamed chat parser's separator as a normal escaped literal.
source = source.replace("const parts=buf.split('\\n\\n');", "const parts=buf.split('\\n\\n');", 1)

# Homepage hero: make the introduction longer, distinctive and human-friendly.
hero_old_1 = "Design, Manufacturing, Installation — all under one roof. NA Engineering Solutions is your trusted partner for engineering, construction, industrial solutions, general order supplies and project support."
hero_old_2 = "From the first conversation to the final handover, we make engineering and industrial work easier to manage. NA Engineering Solutions brings together practical engineering, dependable supplies, skilled installation and project support — so you have one trusted team to turn your requirements into real, workable solutions."
hero_new = "From a single requirement to a complete project, NA Engineering Solutions brings people, engineering expertise and dependable supply together under one roof. We support businesses with Civil Engineering, HVAC, Mechanical Engineering, PEB Works, Electrical Works, Fire Fighting and Safety & Security solutions, along with General Order Supplies & Services. Whether you need a planned installation, reliable industrial materials or hands-on project support, our focus is simple: understand what you need, deliver the right solution and stay with you through execution."
source = source.replace(hero_old_1, hero_new, 1)
source = source.replace(hero_old_2, hero_new, 1)

# Partner section: keep the service-rich version separate from the hero.
partner_old = "NA Engineering Solutions provides reliable engineering, construction, industrial and project support services along with general order supplies for commercial, industrial and construction requirements."
partner_new = "We help businesses move from requirement to reality with one dependable engineering partner. Our team brings together Civil Engineering, HVAC, Mechanical Engineering, PEB Works, Electrical Works, Fire Fighting and Safety & Security — backed by General Order Supplies & Services for the materials, equipment and support your project needs. From planned work to urgent site requirements, we focus on practical solutions, clear communication and dependable execution."
source = source.replace(partner_old, partner_new, 1)

path.write_text(source)
print("Frontend syntax repairs, homepage hero update and service-rich partner copy applied before build.")
