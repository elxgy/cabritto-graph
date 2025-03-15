from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tree_backend import identify_tree

app = Flask(__name__)
CORS(app)

@app.route('/tree', methods=['POST'])
def create_tree():
    try:
        tree = request.json
        if not tree:
            return jsonify({'error': 'No tree data provided'}), 400

        result = identify_tree(tree)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')