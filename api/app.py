from flask import Flask , jsonify

app = Flask(__name__)

HOST = "127.0.0.1"
PORT = 5000
DEBUG = True
@app.route("/health")
def health():
    return jsonify({
        "status": "ok"
    })

if __name__ == "__main__":
    app.run(host=HOST,port=PORT,debug=DEBUG)
    


