import base64
import json
import os
import urllib.request
from email import policy
from email.parser import BytesParser
from http.server import BaseHTTPRequestHandler

MAX_FILE = 8 * 1024 * 1024
ALLOWED = {'.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.jpg', '.jpeg', '.png'}

def response(handler, status, payload):
    data = json.dumps(payload).encode('utf-8')
    handler.send_response(status)
    handler.send_header('Content-Type', 'application/json')
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type, Accept')
    handler.send_header('Content-Length', str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def send_resend(fields, attachment):
    api_key = os.environ.get('RESEND_API_KEY')
    if not api_key:
        raise RuntimeError('RESEND_API_KEY is not configured')
    to_email = os.environ.get('NOTIFY_EMAIL', 'na.engineeringsolutions2023@gmail.com')
    from_email = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
    rows = ''.join(
        f"<tr><td style='padding:8px 12px;border:1px solid #ddd;color:#555'>{k}</td>"
        f"<td style='padding:8px 12px;border:1px solid #ddd'>{v}</td></tr>"
        for k, v in fields.items()
    )
    payload = {
        'from': from_email,
        'to': [to_email],
        'reply_to': [fields.get('Email', '')],
        'subject': f"New Quote Request - {fields.get('Service', 'Website')}",
        'html': f"<div style='font-family:Arial,sans-serif'><h2>New Quote Request</h2><table style='border-collapse:collapse'>{rows}</table></div>"
    }
    if attachment:
        payload['attachments'] = [{
            'filename': attachment['name'],
            'content': base64.b64encode(attachment['data']).decode('ascii')
        }]
    req = urllib.request.Request(
        'https://api.resend.com/emails',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        if r.status < 200 or r.status >= 300:
            raise RuntimeError(f'Resend returned {r.status}')


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        response(self, 204, {})

    def do_POST(self):
        try:
            length = int(self.headers.get('content-length', '0'))
            if length > 10 * 1024 * 1024:
                return response(self, 413, {'detail': 'Request is too large'})
            body = self.rfile.read(length)
            content_type = self.headers.get('content-type', '')
            if 'multipart/form-data' not in content_type:
                return response(self, 415, {'detail': 'Multipart form data is required'})
            raw = (f'Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n').encode() + body
            msg = BytesParser(policy=policy.default).parsebytes(raw)
            fields = {}
            attachment = None
            for part in msg.iter_parts():
                name = part.get_param('name', header='content-disposition')
                filename = part.get_filename()
                if filename:
                    ext = os.path.splitext(filename)[1].lower()
                    data = part.get_payload(decode=True) or b''
                    if ext not in ALLOWED:
                        return response(self, 415, {'detail': 'Unsupported attachment type'})
                    if len(data) > MAX_FILE:
                        return response(self, 413, {'detail': 'Attachment must be smaller than 8 MB'})
                    attachment = {'name': filename, 'data': data}
                elif name:
                    value = part.get_content()
                    fields[name] = value.strip() if isinstance(value, str) else str(value)

            required = ['full_name', 'email', 'service_required', 'message']
            missing = [x for x in required if not fields.get(x)]
            if missing:
                return response(self, 422, {'detail': f"Missing required field(s): {', '.join(missing)}"})

            email_fields = {
                'Name': fields.get('full_name', ''),
                'Company': fields.get('company_name', '') or '-',
                'Email': fields.get('email', ''),
                'Phone': fields.get('phone', '') or '-',
                'Service': fields.get('service_required', ''),
                'Message': fields.get('message', ''),
                'Attachment': attachment['name'] if attachment else 'None'
            }
            send_resend(email_fields, attachment)
            return response(self, 200, {'success': True, 'message': 'Your request has been received.'})
        except Exception as exc:
            return response(self, 500, {'detail': str(exc)})
