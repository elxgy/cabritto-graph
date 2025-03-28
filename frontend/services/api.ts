import { APITreeData, TreeNode, TreeRequestData } from "../src/types";

export const sendTreeData = async (treeData: APITreeData, rootNode: TreeNode) => {
    try {
        const requestData: TreeRequestData = {
            root: rootNode.number,
            children: {}
        };

        Object.entries(treeData).forEach(([key, value]) => {
            const parts = key.split('-');
            let numericKey = Number(parts[0]);
            if (isNaN(numericKey)) {
                console.warn(`Chave ${key} não possui número válido. Usando 0 como fallback.`);
                numericKey = 0;
            }
            requestData.children[numericKey] = value;
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
        alert('Erro ao enviar dados da árvore. Verifique o console para mais informações.');
        throw error;
    }
};