from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tree_backend import identify_tree

app = Flask(__name__)
CORS(app)

def replace_none_string(data):
    """Replace 'None' strings with Python None type in the data structure"""
    if isinstance(data, dict):
        return {k: replace_none_string(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_none_string(item) for item in data]
    elif data == "None":
        return None
    return data

@app.route('/tree', methods=['POST'])
def create_tree():
    try:
        request_data = request.json
        if not request_data:
            return jsonify({'error': 'No tree data provided'}), 400

        processed_tree = {}
        root = request_data.get('root')
        children_data = request_data.get('children', {})

        for node, children in children_data.items():
            processed_tree[int(node)] = [
                None if child == "None" or child is None else int(child)
                for child in children
            ]

        print("Processed tree:", processed_tree)
        result = identify_tree(processed_tree)
        return jsonify({
            'status': 'success',
            'data': result
        })
    except Exception as e:
        print("Error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500
        


if __name__ == '__main__':
    app.run(debug=True, port=5000)