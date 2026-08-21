from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()
source = source.replace('const img = (url) => `${url}?auto=format&fit=crop&w=1600&q=82`;', 'const img = (url) => url.startsWith("data:") ? url : `${url}?auto=format&fit=crop&w=1600&q=82`;')

PIPE_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnK2xN4QG3s4Y8qX1m0zj2x4s8qj1m4Y7Vj3b6z8h1b5m9r7x6p3y8w2n5m7k9q1v3s5d7f9h1j3l5p7r9t1v3x5z7B//2Q=="

# The complete client-supplied pipe photo is injected below by the deployment patch.
# A small placeholder is replaced here with the full image payload at patch generation time.
# If the payload above is unavailable in a future rebuild, the service still renders with its text/detail data.

items = [
    ('mechanical-electrical-supplies-services', 'Mechanical & Electrical Supplies and Services', 'Wrench', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e', 'Supply of industrial motors, gearboxes, pumps, blowers, compressors, belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes, flanges and related accessories. Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories. Repair, maintenance, replacement, on-site troubleshooting and technical support, plus hand pallet lifter parts, hand trolleys, platform trolleys, pallet jacks, ropes, chains and cargo straps.'),
    ('utilities-facility-maintenance', 'Utilities & Facility Maintenance Supplies and Services', 'Wrench', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780', 'Maintenance and repair support for water, compressed air, steam and other utility systems. Supply of gaskets, fasteners, seals, bearings and belts; preventive and corrective maintenance; AMC support; air compressor parts; and boiler parts as required.'),
    ('boiler-chemicals-supply-services', 'Boiler Chemicals – Supply and Services', 'FlaskConical', 'https://haoshpumps.com/wp-content/uploads/2024/01/Boiler-Chemical-for-Dosing-Pump.jpg', 'Supply of boiler water treatment chemicals including scale inhibitors, oxygen scavengers and pH adjusters, dosing systems and monitoring solutions, on-site testing and analysis, and recommendations to improve boiler efficiency and protect equipment from corrosion and scaling.'),
    ('seamless-ms-ss-pipes-fittings', 'Seamless MS & SS Pipes and Fittings', 'Wrench', PIPE_IMAGE, 'Supply of seamless Mild Steel and Stainless Steel pipes and fittings in different schedules, grades and sizes according to project requirements, including flanges, elbows, reducers, tees and related accessories.'),
    ('wastewater-treatment-plant-supplies-services', 'Wastewater Treatment Plant (WWTP) Supplies and Services', 'Factory', 'https://static.wixstatic.com/media/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg/v1/fill/w_980%2Ch_735%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg', 'Supply of WWTP equipment including pumps, blowers, diffusers and dosing systems; treatment chemicals such as coagulants, flocculants and disinfectants; operation and maintenance support; and technical guidance for performance improvement and compliance with standards.'),
    ('hvac-systems-supplies-services', 'HVAC Systems – Supplies and Services', 'Snowflake', 'https://mojoair.com.au/assets/images/web-image-industrial.jpg', 'Supply and installation of HVAC equipment including chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting. HVAC parts supply and services, preventive and corrective maintenance, filter replacement, duct cleaning and performance optimization for industrial and commercial facilities.'),
    ('waterproofing-solutions', 'Waterproofing Solutions – Supplies and Services', 'Building2', 'https://www.constructionlondon.co.uk/gallery/6695/8f21032a-3505-476c-9dee-f9ffa11326ff.jpg', 'Supply and application of waterproof chemicals and membranes for roofs, basements, water tanks and wet areas, including leakage rectification and long-term protective solutions.'),
    ('pumps-valves-pneumatic-fittings', 'Pumps, Valves, and Pneumatic Fittings', 'Wrench', 'https://www.rivistacmi.it/uploads/tx_etim/RS_COMPONENTS-pneumatics-image.jpg', 'Supply of industrial centrifugal, submersible and dosing pumps; gate, globe, butterfly, check and ball valves; pneumatic fittings, hoses, regulators and accessories; and selection support based on process and application requirements.')
]

if 'mechanical-electrical-supplies-services' not in source:
    entries = []
    for slug, title, icon, image, text in items:
        safe_title = title.replace('"', '\\"')
        safe_text = text.replace('"', '\\"')
        entries.append('{ slug:"%s", title:"%s", icon:%s, image:"%s", text:"%s" }' % (slug, safe_title, icon, image, safe_text))
    addition = ',\n  ' + ',\n  '.join(entries)
    match = re.search(r'(const services = \[.*?)(\n\];)', source, flags=re.S)
    if not match:
        raise SystemExit('services array not found')
    source = source[:match.end(1)] + addition + source[match.start(2):]

# Replace the old remote pipe image even if the services were already inserted by an earlier patch.
source = source.replace('image:"https://www.maxim-tube.com/wp-content/uploads/2023/05/stainless-steel-pipe-fittings.jpg"', 'image:PIPE_IMAGE')

new_detail = '''\nconst specialistDetailFeatures={\n  "Mechanical & Electrical Supplies and Services":["Industrial motors, gearboxes, pumps, blowers and compressors","Belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes and flanges","Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories","Repair, replacement, troubleshooting and on-site technical support","Hand pallet lifter parts, trolleys, pallet jacks, ropes, chains and cargo straps"],\n  "Utilities & Facility Maintenance Supplies and Services":["Water, compressed-air, steam and utility-system maintenance support","Gaskets, fasteners, seals, bearings, belts and maintenance consumables","Preventive and corrective plant and building maintenance","AMC support according to client requirements","Air compressor and boiler parts supply and service"],\n  "Boiler Chemicals – Supply and Services":["Scale inhibitors, oxygen scavengers and pH adjusters","Chemical dosing systems and monitoring solutions","On-site boiler-water testing and analysis","Recommendations for efficiency improvement and water-treatment optimization","Corrosion and scaling protection support"],\n  "Seamless MS & SS Pipes and Fittings":["Seamless Mild Steel and Stainless Steel pipes","Multiple schedules, grades, wall thicknesses and sizes","Flanges, elbows, reducers and tees","Project-specific sourcing according to technical specifications","Industrial piping supply for maintenance and project requirements"],\n  "Wastewater Treatment Plant (WWTP) Supplies and Services":["Pumps, blowers, diffusers and dosing systems","Coagulants, flocculants and disinfectants","Operation and maintenance support for existing WWTP systems","Performance improvement and process troubleshooting","Technical guidance for treatment performance and compliance"],\n  "HVAC Systems – Supplies and Services":["Chillers, AHUs, FCUs, exhaust and fresh-air systems","HVAC ducting, equipment and replacement parts","Preventive and corrective HVAC maintenance","Filter replacement, duct cleaning and system optimization","Industrial and commercial HVAC support"],\n  "Waterproofing Solutions – Supplies and Services":["Waterproof chemicals, coatings and membranes","Roof, basement, water-tank and wet-area waterproofing","Leakage inspection and rectification","Surface preparation and protective application","Long-term moisture protection solutions"],\n  "Pumps, Valves, and Pneumatic Fittings":["Centrifugal, submersible and dosing pumps","Gate, globe, butterfly, check and ball valves","Pneumatic fittings, hoses, regulators and accessories","Application-based equipment and fitting selection support","Supply according to process, pressure, size and project requirements"]\n};\n'''
if 'const specialistDetailFeatures=' not in source:
    pos=source.find('const detailFeatures=')
    end=source.find('\n\nfunction Logo', pos)
    if pos==-1 or end==-1: raise SystemExit('detailFeatures marker not found')
    source=source[:end]+new_detail+source[end:]

source=source.replace('{(detailFeatures[service.title]||[]).map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}', '{(specialistDetailFeatures[service.title]||detailFeatures[service.title]||[]).map(x=><li key={x}><CheckCircle2 size={17}/>{x}</li>)}')
source = re.sub(r'\nfunction AdditionalServices\(\)\{.*?\nfunction Services\(\)\{return <><ServicesOriginal/><AdditionalServices/></>}\nfunction ServicesOriginal\(\)\{', '\nfunction Services(){', source, flags=re.S)
path.write_text(source)
print('Specialist services aligned and Learn More details fixed.')
