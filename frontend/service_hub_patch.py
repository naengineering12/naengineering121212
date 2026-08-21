from pathlib import Path
import re

path = Path("src/App.js")
source = path.read_text()

# Keep the existing IT Services hub/navigation changes intact.
new_nav = "const nav=[['Home','/'],['Services','/services'],['IT Services','/it-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];"
source = source.replace("const nav=[['Home','/'],['Services','/services'],['Engineering Supplies & Services','/engineering-supplies-services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];", new_nav, 1)
source = source.replace("const nav=[['Home','/'],['Services','/services'],['General Order Supplies','/supplies'],['Industries','/industries'],['Our Clients','/clients'],['Contact','/contact']];", new_nav, 1)

# Requested service catalogue with service-matched imagery and detailed scope.
service_updates = [
("mechanical-electrical-supplies-services","Mechanical & Electrical Supplies and Services","Wrench","https://images.unsplash.com/photo-1473341304170-971dccb5ac1e","Supply of industrial motors, gearboxes, pumps, blowers, compressors, belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes, flanges and related accessories. Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories. Repair, maintenance, replacement, on-site troubleshooting and technical support, plus hand pallet lifter parts, hand trolleys, platform trolleys, pallet jacks, ropes, chains and cargo straps.",[
"Industrial motors, gearboxes, pumps, blowers and compressors","Belt conveyors, bearings, gaskets, valves, pneumatic fittings, SS/MS pipes and flanges","Electrical panels, breakers, contactors, relays, cables, lighting and wiring accessories","Repair, maintenance, replacement, troubleshooting and on-site technical support","Hand pallet lifter parts, hand trolleys, platform trolleys and pallet jacks","Ropes, chains and cargo straps"
]),
("utilities-facility-maintenance","Utilities & Facility Maintenance Supplies and Services","Wrench","https://images.unsplash.com/photo-1581092921461-eab62e97a780","Maintenance and repair support for water, compressed air, steam and other utility systems. Supply of gaskets, fasteners, seals, bearings and belts; preventive and corrective maintenance; AMC support; air compressor parts; and boiler parts as required.",[
"Water, compressed-air and steam utility maintenance support","Gaskets, fasteners, seals, bearings, belts and maintenance consumables","Preventive and corrective maintenance for plant and building facilities","AMC support according to client requirements","Air compressor parts supply and services","Boiler parts supply and services"
]),
("boiler-chemicals-supply-services","Boiler Chemicals – Supply and Services","FlaskConical","https://haoshpumps.com/wp-content/uploads/2024/01/Boiler-Chemical-for-Dosing-Pump.jpg","Supply of boiler water-treatment chemicals including scale inhibitors, oxygen scavengers and pH adjusters, dosing systems and monitoring solutions, on-site testing and analysis, and recommendations to improve boiler efficiency and protect equipment from corrosion and scaling.",[
"Scale inhibitors, oxygen scavengers and pH-control chemicals","Dosing systems and monitoring solutions","On-site testing, analysis and system recommendations","Support for boiler efficiency, corrosion control and scale prevention"
]),
("seamless-ms-ss-pipes-fittings","Seamless MS & SS Pipes and Fittings","Wrench","https://www.maxim-tube.com/wp-content/uploads/2023/05/stainless-steel-pipe-fittings.jpg","Supply of seamless Mild Steel and Stainless Steel pipes and fittings in different schedules, grades and sizes according to project requirements, including flanges, elbows, reducers, tees and related accessories.",[
"Seamless Mild Steel and Stainless Steel pipes and fittings","Different schedules, grades, sizes and project specifications","Flanges, elbows, reducers and tees","Sourcing for maintenance and project requirements"
]),
("wastewater-treatment-plant-supplies-services","Wastewater Treatment Plant (WWTP) Supplies and Services","Factory","https://static.wixstatic.com/media/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg/v1/fill/w_980%2Ch_735%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/b9b6ed_22bbec6674af4fb0b309bcc93509af32~mv2.jpg","WWTP equipment including pumps, blowers, diffusers and dosing systems; treatment chemicals such as coagulants, flocculants and disinfectants; operation and maintenance support; and technical guidance for performance improvement and compliance with standards.",[
"Pumps, blowers, diffusers and dosing systems","Coagulants, flocculants, disinfectants and treatment chemicals","Operation and maintenance support for existing WWTP systems","Technical guidance for performance improvement and compliance"
]),
("hvac-systems-supplies-services","HVAC Systems – Supplies and Services","Snowflake","https://mojoair.com.au/assets/images/web-image-industrial.jpg","Supply and installation of HVAC equipment including chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting. HVAC parts supply and services, preventive and corrective maintenance, filter replacement, duct cleaning and performance optimization for industrial and commercial facilities.",[
"Chillers, AHUs, FCUs, exhaust and fresh-air systems and ducting","HVAC parts supply and services","Preventive and corrective HVAC maintenance","Filter replacement, duct cleaning and performance optimization","Industrial and commercial HVAC support"
]),
("waterproofing-solutions","Waterproofing Solutions – Supplies and Services","Building2","https://www.constructionlondon.co.uk/gallery/6695/8f21032a-3505-476c-9dee-f9ffa11326ff.jpg","Supply and application of waterproof chemicals and membranes for roofs, basements, water tanks and wet areas, including leakage rectification and long-term protective solutions.",[
"Waterproof chemicals, coatings and membranes","Roof, basement, water-tank and wet-area waterproofing","Leakage inspection and rectification","Long-term protective waterproofing solutions"
]),
("pumps-valves-pneumatic-fittings","Pumps, Valves, and Pneumatic Fittings","Wrench","https://www.rivistacmi.it/uploads/tx_etim/RS_COMPONENTS-pneumatics-image.jpg","Supply of industrial centrifugal, submersible and dosing pumps; gate, globe, butterfly, check and ball valves; pneumatic fittings, hoses, regulators and accessories; and selection support according to process and application requirements.",[
"Centrifugal, submersible and dosing pumps","Gate, globe, butterfly, check and ball valves","Pneumatic fittings, hoses, regulators and accessories","Selection support based on process, pressure, flow and application"
])]

# Find the services array safely and replace/add only these requested entries.
services_start = source.find("const services = [")
if services_start != -1:
    array_end = source.find("];", services_start)
    if array_end != -1:
        block = source[services_start:array_end]
        for slug,title,icon,image,text,features in service_updates:
            escaped_title = re.escape(title)
            pattern = r'\{[^{}]*title:"' + escaped_title + r'"[^{}]*\},'
            obj = '{ slug:"%s", title:"%s", icon:%s, image:"%s", text:"%s" },' % (slug,title,icon,image,text.replace('"','\\"'))
            if re.search(pattern, block):
                block = re.sub(pattern, obj, block, count=1)
            else:
                block += "\n  " + obj
        source = source[:services_start] + block + source[array_end:]

# Add detailed feature lists used by individual service pages.
features_start = source.find("const detailFeatures=")
features_end = source.find(";\n", features_start) if features_start != -1 else -1
if features_start != -1 and features_end != -1:
    feature_entries = []
    for _,title,_,_,_,features in service_updates:
        feature_entries.append('"%s":[%s]' % (title, ",".join('"%s"' % x.replace('"','\\"') for x in features)))
    detail_obj = "const detailFeatures={" + ",".join(feature_entries) + "};"
    # Preserve the original six service feature entries and append the new ones.
    existing = source[features_start:features_end+2]
    if '"Mechanical & Electrical Supplies and Services"' not in existing:
        detail_obj = existing[:-2] + "," + ",".join(feature_entries) + "};"
        source = source[:features_start] + detail_obj + source[features_end+2:]

path.write_text(source)
print("Requested Services catalogue, detailed scopes and matched images applied.")
