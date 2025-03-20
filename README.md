# cabritto-graph

A tool that allows users to construct tree structures visually and analyzes them, providing information about tree traversals and tree type.

## 📝 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tree Processing Logic](#tree-processing-logic)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Frontend-dev](#Frontend-dev)

## Overview

This project provides an interactive web interface to build tree data structures and performs analysis on them, identifying the tree type and displaying various traversal methods. It consists of a React-based frontend running in Docker and a Python backend service.

## Features

- Interactive UI for constructing tree structures
- Various traversal methods display (pre-order, in-order, post-order)
- Tree type identification (binary tree or regular tree) + (complete, full or incomplete)

## Architecture

The project is split into two main components:

1. **Frontend**: React application containerized with Docker
2. **Backend**: Python service for tree analysis

## Tree Processing Logic

The backend processes tree structures through several key steps:

1. **Tree Type Detection**: The system first determines if the structure is a binary tree or an N-ary tree by checking if any node has more than two children.

2. **Root Identification**: The algorithm finds the root node by identifying which node doesn't appear as a child of any other node.

3. **Tree Construction**: 
   - For binary trees: The system builds a binary tree structure by recursively processing nodes with their left and right children.
   - For N-ary trees: Similar recursive construction but handles multiple children per node.

4. **Analysis Functions**:
   - Height calculation for both binary and N-ary trees
   - Tree type classification (full, complete, or incomplete)
   - Various traversal methods:
     - Pre-order traversal (root → left → right)
     - In-order traversal (left → root → right, for binary trees only)
     - Post-order traversal (left → right → root)

5. **Visualization**: The system generates tree visualizations using matplotlib, saving them as PNG images for display in the frontend.

6. **Results Generation**: Finally, the backend compiles analysis results including tree type, height, traversal orders, and the path to the generated visualization.

## Prerequisites

- [Docker](https://www.docker.com/get-started) (for frontend)
- [Python](https://www.python.org/downloads/) 3.8 or higher (for backend)
- [Git](https://git-scm.com/downloads) (for cloning the repository)
- Python libraries: matplotlib, collections, Flask, flask-cors

## Installation

### Clone the Repository

```bash
git clone https://github.com/elxgy/cabritto-graph
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Navigate to the api directory:
   ```bash
   cd api
   ```

### Frontend Setup

The frontend is containerized using Docker for easy deployment.

1. Build and run docker from root directory:
   ```bash
    docker-compose up -d
   ```

## Usage

### Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend/api
   ```

2. Run the main Python script:
   ```bash
   python main.py
   ```
   
   The backend server will start and listen for requests on port 5000.

2. Access the application in your browser at `http://localhost:5173`

### Using the Application

1. Use the interface to create tree nodes by adding values
3. Click the "view result" button to get information about your tree
4. View traversal results and tree properties in the analysis panel

## API Documentation

The backend provides the following RESTful API endpoints:

### `POST /tree`

Analyzes a tree structure and returns its properties, traversals, and visualization.

#### Request

- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "children": {
      "1": ["2", "3"],
      "2": ["4", "5"],
      "3": [],
      "4": [],
      "5": []
    }
  }
  ```

  Notes:
  - The `children` object represents an adjacency list where each key is a node value
  - Each value is an array of child node values
  - Use `"None"` string to represent null children in binary trees
  - Node values are sent as strings but processed as integers internally

#### Response

- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "type": "Árvore binária",
      "height": "A altura é 2",
      "tree_type": "O tipo é Árvore completa",
      "pre_order": [1, 2, 4, 5, 3],
      "post_order": [4, 5, 2, 3, 1],
      "in_order": [4, 2, 5, 1, 3],
      "image": "/static/images/bin_tree.png"
    }
  }
  ```

  Notes:
  - `type`: Indicates whether it's a binary tree ("Árvore binária") or regular tree ("Árvore regular")
  - `height`: The height of the tree
  - `tree_type`: Classification as full ("Árvore cheia"), complete ("Árvore completa"), or incomplete ("Árvore incompleta")
  - `pre_order`, `post_order`, `in_order`: Arrays containing node values in their respective traversal orders
  - `image`: Path to the generated tree visualization

- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "No tree data provided"
  }
  ```

- **Error Response (500 Internal Server Error)**:
  ```json
  {
    "error": "Error message",
    "traceback": "Detailed traceback info"
  }
  ```

### `GET /static/images/<filename>`

Retrieves the generated tree visualization image.

#### Request

- **URL Parameters**:
  - `filename`: Name of the image file (e.g., `bin_tree.png` or `nary_tree.png`)

#### Response

- **Success Response**: The image file
- **Error Response (500 Internal Server Error)**:
  ```json
  {
    "error": "Error message",
    "traceback": "Detailed traceback info"
  }
  ```

#### Implementation Notes

- Remember to delete images and containers after using it or it will waste space on your machine

## Frontend-dev

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/yuuhLKT">
        <img src="https://github.com/yuuhLKT.png" width="100px;" style="border-radius:50%;" alt=""/>
        <br />
        <sub><b>YuuhLKT</b></sub>
      </a>
    </td>
  </tr>
</table>

