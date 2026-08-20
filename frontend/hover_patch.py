from pathlib import Path

path = Path("src/App.css")
source = path.read_text()
marker = "/* NA SERVICES HOVER EFFECT */"

if marker not in source:
    source += r'''

/* NA SERVICES HOVER EFFECT */
.service-row{position:relative;transition:transform .45s cubic-bezier(.22,1,.36,1)}
.service-row:after{content:"";position:absolute;left:0;right:0;bottom:-24px;height:1px;background:linear-gradient(90deg,var(--amber),transparent);transform:scaleX(0);transform-origin:left;transition:transform .45s ease}
.service-row:hover{transform:translateY(-5px)}
.service-row:hover:after{transform:scaleX(1)}
.service-image{box-shadow:0 0 0 1px rgba(10,17,40,.04);transition:box-shadow .45s ease,transform .45s ease}
.service-image:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,17,40,.05),rgba(10,17,40,.5));opacity:0;transition:opacity .45s ease;pointer-events:none}
.service-image img{transition:transform .7s cubic-bezier(.22,1,.36,1),filter .5s ease}
.service-row:hover .service-image{box-shadow:0 22px 45px rgba(10,17,40,.16);transform:scale(1.012)}
.service-row:hover .service-image:after{opacity:1}
.service-row:hover .service-image img{transform:scale(1.07);filter:saturate(1.08) contrast(1.03)}
.service-image span{z-index:2;transition:transform .4s ease,background .4s ease}
.service-row:hover .service-image span{transform:translate(5px,5px);background:#ffc184}
.service-copy h2{position:relative;display:inline-block;transition:transform .4s ease,color .4s ease}
.service-copy h2:after{content:"";position:absolute;left:0;bottom:-7px;width:42px;height:3px;background:var(--amber);transform:scaleX(.35);transform-origin:left;transition:transform .45s ease}
.service-row:hover .service-copy h2{transform:translateX(5px);color:var(--blue)}
.service-row:hover .service-copy h2:after{transform:scaleX(1)}
.service-features span{transition:transform .35s ease,color .35s ease}
.service-row:hover .service-features span{transform:translateX(3px);color:var(--blue)}
.service-copy .button{transition:transform .35s ease,background .35s ease,box-shadow .35s ease}
.service-row:hover .service-copy .button{transform:translateY(-3px);box-shadow:0 10px 24px rgba(10,17,40,.12)}
@media(max-width:800px){.service-row:hover{transform:none}.service-row:after{display:none}.service-row:hover .service-image{transform:none;box-shadow:none}.service-row:hover .service-copy h2{transform:none}.service-row:hover .service-image img{transform:scale(1.02)}}
'''
    path.write_text(source)
    print("Services hover effects applied.")
else:
    print("Services hover effects already applied.")
