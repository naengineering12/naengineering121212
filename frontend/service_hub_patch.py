from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()

# Add the requested specialist services to the same `services` data source used
# by the main Services page. This keeps the existing alternating image/text row
# layout instead of creating a separate card grid.
items = [
    ('mechanical-electrical-supplies-services', 'Mechanical & Electrical Supplies and Services', 'Wrench', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e', 'Supply of industrial motors, gearboxes, pumps, blowers, compressors, belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes, flanges and related accessories. Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories. Repair, maintenance, replacement, on-site troubleshooting and technical support, plus hand pallet lifter parts, hand trolleys, platform trolleys, pallet jacks, ropes, chains and cargo straps.'),
    ('utilities-facility-maintenance', 'Utilities & Facility Maintenance Supplies and Services', 'Wrench', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780', 'Maintenance and repair support for water, compressed air, steam and other utility systems. Supply of gaskets, fasteners, seals, bearings and belts; preventive and corrective maintenance; AMC support; air compressor parts; and boiler parts as required.'),
    ('boiler-chemicals-supply-services', 'Boiler Chemicals – Supply and Services', 'FlaskConical', 'https://haoshpumps.com/wp-content/uploads/2024/01/Boiler-Chemical-for-Dosing-Pump.jpg', 'Supply of boiler water treatment chemicals including scale inhibitors, oxygen scavengers and pH adjusters, dosing systems and monitoring solutions, on-site testing and analysis, and recommendations to improve boiler efficiency and protect equipment from corrosion and scaling.'),
    ('seamless-ms-ss-pipes-fittings', 'Seamless MS & SS Pipes and Fittings', 'Wrench', 'https://www.maxim-tube.com/wp-content/uploads/2023/05/stainless-steel-pipe-fittings.jpg', 'Supply of seamless Mild Steel and Stainless Steel pipes and fittings in different schedules, grades and sizes according to project requirements, including flanges, elbows, reducers, tees and related accessories.'),
    ('wastewater-treatment-plant-supplies-services', 'Wastewater Treatment Plant (WWTP) Supplies and Services', 'Factory', 'https://static.wixstatic.com/media/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg/v1/fill/w_980%2Ch_735%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg', 'Supply of WWTP equipment including pumps, blowers, diffusers and dosing systems; treatment chemicals such as coagulants, flocculants and disinfectants; operation and maintenance support; and technical guidance for performance improvement and compliance with standards.'),
    ('hvac-systems-supplies-services', 'HVAC Systems – Supplies and Services', 'Snowflake', 'https://mojoair.com.au/assets/images/web-image-industrial.jpg', 'Supply and installation of HVAC equipment including chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting. HVAC parts supply and services, preventive and corrective maintenance, filter replacement, duct cleaning and performance optimization for industrial and commercial facilities.'),
    ('waterproofing-solutions', 'Waterproofing Solutions – Supplies and Services', 'Building2', 'https://www.constructionlondon.co.uk/gallery/6695/8f21032a-3505-476c-9dee-f9ffa11326ff.jpg', 'Supply and application of waterproof chemicals and membranes for roofs, basements, water tanks and wet areas, including leakage rectification and long-term protective solutions.'),
    ('pumps-valves-pneumatic-fittings', 'Pumps, Valves, and Pneumatic Fittings', 'Wrench', 'https://www.rivistacmi.it/uploads/tx_etim/RS_COMPONENTS-pneumatics-image.jpg', 'Supply of industrial centrifugal, submersible and dosing pumps; gate, globe, butterfly, check and ball valves; pneumatic fittings, hoses, regulators and accessories; and selection support based on process and application requirements.')
]

# The source has one compact `const services = [...]` declaration. Append only
# when the first requested slug is absent, so repeated Vercel builds stay idempotent.
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

# Remove the older separate AdditionalServices build-time section if an earlier
# version of this patch injected it. The main Services page now owns every row.
source = re.sub(r'\nfunction AdditionalServices\(\)\{.*?\nfunction Services\(\)\{return <><ServicesOriginal/><AdditionalServices/></>}\nfunction ServicesOriginal\(\)\{', '\nfunction Services(){', source, flags=re.S)

path.write_text(source)
print('Aligned requested services into the main alternating Services rows.')
