import http.server
import ssl
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

server = http.server.HTTPServer(
    ("localhost", 8765), http.server.SimpleHTTPRequestHandler
)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("localhost.pem", "localhost-key.pem")
server.socket = ctx.wrap_socket(server.socket, server_side=True)
print("Serving at https://localhost:8765/")
server.serve_forever()
