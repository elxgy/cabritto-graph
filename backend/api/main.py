import json
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sys
import os
import traceback
import glob 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tree_backend import identify_tree

app = Flask(__name__)
CORS(app)

def delete_old_images(except_filename=None):
    images_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'images')
    for image in glob.glob(os.path.join(images_dir, '*.png')):
        if except_filename and os.path.basename(image) == except_filename:
            continue
        try:
            os.remove(image)
            print(f"Deleted old image: {image}")
        except Exception as e:
            print(f"Error deleting {image}: {str(e)}")

@app.route('/tree', methods=['POST'])
def create_tree():
    try:
        delete_old_images()

        request_data = request.json
        if not request_data:
            return jsonify({'error': 'No tree data provided'}), 400

        tree_to_save = request_data.get('children', request_data)
    
        trees_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'trees')
        os.makedirs(trees_dir, exist_ok=True)
        txt_file_path = os.path.join(trees_dir, 'tree.txt')
        with open(txt_file_path, 'w') as f:
            f.write(json.dumps(tree_to_save, indent=2))
        print(f"Arquivo TXT salvo em: {txt_file_path}")

        # Processa a árvore enviada
        processed_tree = {}
        children_data = tree_to_save

        for node, children in children_data.items():
            try:
                # Aqui extraímos a parte numérica da chave composta
                node_key = int(node.split('-')[0])
            except Exception as e:
                print(f"Ignorando chave inválida: {node}. Erro: {e}")
                continue

            processed_children = []
            for child in children:
                if child == "None": 
                    processed_children.append(None)
                else:
                    try:
                        processed_children.append(int(child))
                    except ValueError:
                        print(f"Ignorando valor inválido: {child}")
                        processed_children.append(child)
            
            processed_tree[node_key] = processed_children

        print("Processed tree:", processed_tree)
        result = identify_tree(processed_tree)
        return jsonify({
            'status': 'success',
            'data': result,
            'txt_file': txt_file_path  
        })

    except Exception as e:
        print("Error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500
        
@app.route('/static/images/<path:filename>')
def serve_image(filename):
    try:
        # Delete all other images except the current one
        delete_old_images(except_filename=filename)
        return send_from_directory('../static/images', filename)
    except Exception as e:
        print("Error serving image:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/static/trees/<path:filename>')
def serve_txt(filename):
    try:
        trees_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'trees')
        return send_from_directory(trees_dir, filename, as_attachment=True)
    except Exception as e:
        print("Error serving txt:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    delete_old_images()
    app.run(debug=True, port=5000)
