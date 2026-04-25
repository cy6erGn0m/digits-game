#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

PORT = 8080

os.chdir(os.path.dirname(os.path.abspath(__file__)))

httpd = HTTPServer(('localhost', PORT), SimpleHTTPRequestHandler)
print(f'Serving at http://localhost:{PORT}')
httpd.serve_forever()