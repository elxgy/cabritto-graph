from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tree_backend import identify_tree

app = Flask(__name__)
CORS(app)

@app.route('/tree', methods=['POST'])
def create_tree():
    try:
        request_data = request.json
        if not request_data:
            return jsonify({'error': 'No tree data provided'}), 400

        processed_tree = {}
        children_data = request_data.get('children', {})

        for node, children in children_data.items():
            processed_children = []
            for child in children:
                if child == "None":
                    processed_children.append(None)
                else:
                    processed_children.append(int(child))
            
            processed_tree[int(node)] = processed_children

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