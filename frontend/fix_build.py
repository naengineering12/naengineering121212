"""Apply deterministic frontend syntax repairs and homepage copy updates before build."""
from pathlib import Path

path = Path("src/App.js")
source = path.read_text()

# About() must close its React fragment before Industries().
source = source.replace("</main>}\nfunction Industries", "</main></>}\nfunction Industries", 1)

# Keep the streamed chat parser's separator as a normal escaped literal.
source = source.replace("const parts=buf.split('\\n\\n');", "const parts=buf.split('\\n\\n');", 1)

# Replace the homepage partner copy with a warmer, service-rich introduction.
old_copy = "NA Engineering Solutions provides reliable engineering, construction, industrial and project support services along with general order supplies for commercial, industrial and construction requirements."
new_copy = "We help businesses move from requirement to reality with one dependable engineering partner. Our team brings together Civil Engineering, HVAC, Mechanical Engineering, PEB Works, Electrical Works, Fire Fighting and Safety & Security — backed by <strong style={{display:'inline-block',padding:'2px 10px',margin:'0 3px',background:'var(--amber)',color:'var(--ink)',borderRadius:'999px',fontWeight:800}}>General Order Supplies & Services</strong> for the materials, equipment and support your project needs. From planned work to urgent site requirements, we focus on practical solutions, clear communication and dependable execution."
source = source.replace(old_copy, new_copy, 1)

# If the older homepage wording is still present, replace that version as well.
old_copy_2 = "From the first conversation to the final handover, we make engineering and industrial work easier to manage. NA Engineering Solutions brings together practical engineering, dependable supplies, skilled installation and project support — so you have one trusted team to turn your requirements into real, workable solutions."
source = source.replace(old_copy_2, new_copy, 1)

path.write_text(source)
print("Frontend syntax repairs and homepage service-rich copy update applied before build.")
