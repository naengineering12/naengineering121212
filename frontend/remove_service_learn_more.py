from pathlib import Path

app = Path("src/App.js")
source = app.read_text()
old = '<div><Button to={`/services/${s.slug}`} secondary testid={`learn-more-${s.slug}`}>Learn More</Button></div>'
new = '{i < 6 && <div><Button to={`/services/${s.slug}`} secondary testid={`learn-more-${s.slug}`}>Learn More</Button></div>}'
if old not in source:
    raise SystemExit("Services Learn More button markup not found")
source = source.replace(old, new, 1)
app.write_text(source)
print("Removed Learn More buttons from service categories added after the original six services.")
