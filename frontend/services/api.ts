import { APITreeData, TreeNode, TreeRequestData } from "../src/types";

export const sendTreeData = async (treeData: APITreeData, rootNode: TreeNode) => {
    try {
        // Build node positions map for reference
        const nodePositions: Record<number, TreeNode> = {};
        const processTree = (node: TreeNode) => {
            nodePositions[node.number] = node;
            node.children.forEach(processTree);
        };

        processTree(rootNode);

        // Initialize request data
        const requestData: TreeRequestData = {
            root: rootNode.number,
            children: {}
        };

        // Process each node and its children
        Object.entries(treeData).forEach(([key, value]) => {
            const numericKey = Number(key);
            const node = nodePositions[numericKey];

            // Initialize empty array if no children
            if (!value || (Array.isArray(value) && value.length === 0)) {
                requestData.children[numericKey] = [];
                return;
            }

            // Get all children for this node
            const children = node.children.map(child => child.number);
            requestData.children[numericKey] = children;
        });

        console.log('Sending formatted data to API:', requestData);

        const response = await fetch('http://localhost:5000/tree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending tree data:', error);
        throw error;
    }
};