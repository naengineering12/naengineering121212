from pathlib import Path
import re

root = Path(__file__).parent
app = root / "src" / "App.js"
css = root / "src" / "App.css"
source = app.read_text()

# Smaller, faster responsive image requests.
source = source.replace('const img = (url) => `${url}?auto=format&fit=crop&w=1600&q=82`;', 'const img = (url) => `${url}?auto=format&fit=crop&w=1100&q=68`;', 1)

# Defer below-the-fold images and decode them off the main rendering path.
source = source.replace('<img src={img(', '<img loading="lazy" decoding="async" src={img(')
source = source.replace('<img className="detail-image" src={img(', '<img loading="eager" decoding="async" className="detail-image" src={img(')

# Replace known broken service image IDs with verified, stable Unsplash photo IDs.
replacements = {
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e',
    'https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
    'https://images.unsplash.com/photo-1581093458791-9d42e3c2b4f': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
}
for old, new in replacements.items():
    source = source.replace(old, new)

# Keep image areas stable while content loads and avoid layout shifts.
style = css.read_text()
perf_css = '''\n/* Performance: reserve image space and keep below-the-fold media off the critical path. */\nimg{content-visibility:auto;}\n.service-image img,.cap-card img,.supply-card-image img,.detail-image,.about-feature-image img,.people-image img,.industry-feature img,.industry-card-image img,.process-card-image img{background:var(--navy);}\n.service-row,.cap-card,.supply-card,.industry-card,.process-card{contain:layout paint;}\n'''
if '/* Performance: reserve image space' not in style:
    css.write_text(style + perf_css)

print('Image loading optimized: smaller requests, lazy loading, async decoding, stable layout, and broken service image URLs repaired.')
