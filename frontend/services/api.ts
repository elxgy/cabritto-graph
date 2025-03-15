import { TreeNode } from "../src/types";

export const sendTreeData = async (treeData: TreeNode) => {
    const convertToAdjacencyList = (root: TreeNode) => {
        const adjacencyList: Record<string, number[]> = {};

        const traverse = (node: TreeNode) => {
            adjacencyList[node.number] = node.children.map(child => child.number);
            node.children.forEach(traverse);
        };

        traverse(root);

        const formattedList: Record<string, number[]> = {};
        Object.entries(adjacencyList).forEach(([key, value]) => {
            formattedList[key] = value;
        });

        return formattedList;
    };

    try {
        const formattedData = convertToAdjacencyList(treeData);
        console.log('Sending formatted data to API:', formattedData);

        const response = await fetch('http://localhost:5000/tree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('API Response:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error sending tree data:', error);
        throw error;
    }
};