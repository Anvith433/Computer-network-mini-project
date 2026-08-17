# server.py
import socket
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins by default (or specify origins below)
# If you want to restrict to React's origin only:
# CORS(app, resources={r"/ask": {"origins": "http://localhost:5173"}})

server_ip = "192.168.173.214"
port = 12345

@app.route('/ask', methods=['POST'])
def ask_question():
    question = request.json.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect((server_ip, port))
        client_socket.send(question.encode('utf-8'))
        answer = client_socket.recv(1024).decode('utf-8')
        client_socket.close()
        return jsonify({'answer': answer})
    except Exception as e:
        client_socket.close()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)