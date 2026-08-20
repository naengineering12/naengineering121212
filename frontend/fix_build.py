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

# Expand the footer vertically while preserving the existing layout and responsive behavior.
css_path = path.parent / "App.css"
css = css_path.read_text()
footer_css = "\n/* Expanded footer layout */\n.footer{padding:105px 0 30px;min-height:500px}.footer-grid{gap:60px}.footer-intro{max-width:310px;margin:28px 0}.footer h4{margin-bottom:28px}.footer-grid>div:not(:first-child){gap:16px}.footer-grid a,.footer-grid span{font-size:13px;line-height:1.75}.footer-bottom{margin-top:82px;padding-top:22px}\n@media(max-width:800px){.footer{padding:80px 0 26px;min-height:0}.footer-grid{gap:42px}.footer-bottom{margin-top:55px}}\n@media(max-width:480px){.footer{padding:70px 0 24px}.footer-grid{gap:36px}.footer-bottom{margin-top:45px}}\n"
if "/* Expanded footer layout */" not in css:
    css_path.write_text(css + footer_css)

print("Frontend syntax repairs, homepage copy, and expanded footer styling applied before build.")
