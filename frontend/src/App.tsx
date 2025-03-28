import { Eye, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendTreeData } from '../services/api';
import { TreeNode as TreeNodeComponent } from './components/TreeNode';
import { APITreeData, TreeNode } from './types';

const App = () => {
  const navigate = useNavigate();
  const [showTxtModal, setShowTxtModal] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Raiz inicial (0)
  const [tree, setTree] = useState<TreeNode>({
    id: 'root',
    number: 0,
    children: [],
    position: 'right',
    placement: 'vertical'
  });

  /**
   * Localiza o nó de ID específico e também retorna seu pai (se houver).
   * Retorna [foundNode, parentNode] ou [null, null] se não encontrar.
   */
  const findNodeAndParent = (
    currentNode: TreeNode,
    nodeId: string,
    parentNode: TreeNode | null = null
  ): [TreeNode | null, TreeNode | null] => {
    if (currentNode.id === nodeId) {
      return [currentNode, parentNode];
    }
    for (const child of currentNode.children) {
      const [found, foundParent] = findNodeAndParent(child, nodeId, currentNode);
      if (found) {
        return [found, foundParent];
      }
    }
    return [null, null];
  };

  /**
   * Adiciona um novo filho ao nó (parentId).
   * Permite duplicatas em outras partes da árvore, mas:
   * - Não pode ser igual ao número da raiz.
   * - Não pode ser igual ao número do pai.
   * - Não pode ser igual ao de algum irmão.
   */
  const handleAddChild = (
    parentId: string,
    number: number,
    position: 'left' | 'right',
    placement: 'horizontal' | 'vertical'
  ) => {
    setTree(prevTree => {
      // Se o número for igual ao da raiz
      if (number === prevTree.number) {
        alert('O número do filho não pode ser igual ao número da raiz');
        return prevTree;
      }

      // Função recursiva para inserir o novo nó no local correto
      const addChildToNode = (node: TreeNode): TreeNode => {
        if (node.id === parentId) {
          // Se for igual ao número do pai
          if (number === node.number) {
            alert('O número do filho não pode ser igual ao número do pai');
            return node;
          }

          // Se algum irmão tiver o mesmo número
          if (node.children.some(child => child.number === number)) {
            alert('Não é possível adicionar dois filhos com o mesmo número ao mesmo pai');
            return node;
          }

          // Tudo certo: cria o novo filho
          const newNode: TreeNode = {
            id: Math.random().toString(36).substr(2, 9),
            number,
            position,
            placement,
            children: []
          };

          return {
            ...node,
            children: [...node.children, newNode]
          };
        }

        // Continua descendo na árvore
        return {
          ...node,
          children: node.children.map(addChildToNode)
        };
      };

      return addChildToNode(prevTree);
    });
  };

  /**
   * Edita o número de um nó existente.
   * Permite duplicatas em outras partes da árvore, mas:
   * - Não pode ser igual ao número da raiz.
   * - Não pode ser igual ao número do pai.
   * - Não pode ser igual ao de algum irmão.
   */
  const handleNodeNumberChange = (nodeId: string, newNumber: number) => {
    setTree(prevTree => {
      // Se for igual à raiz
      if (newNumber === prevTree.number) {
        alert('O número do nó não pode ser igual ao número da raiz');
        return prevTree;
      }

      // Localiza o nó que vamos editar e seu pai
      const [foundNode, parentNode] = findNodeAndParent(prevTree, nodeId);
      if (!foundNode) {
        console.warn('Nó não encontrado');
        return prevTree;
      }

      // Se for igual ao número do pai
      if (parentNode && parentNode.number === newNumber) {
        alert('O número do nó não pode ser igual ao número do pai');
        return prevTree;
      }

      // Se algum irmão tiver o mesmo número
      if (
        parentNode &&
        parentNode.children.some(
          child => child.id !== nodeId && child.number === newNumber
        )
      ) {
        alert('Não pode ser igual ao número de um irmão');
        return prevTree;
      }

      // Recursivamente atualiza o número do nó
      const updateTree = (node: TreeNode): TreeNode => {
        if (node.id === nodeId) {
          return {
            ...node,
            number: newNumber
          };
        }
        return {
          ...node,
          children: node.children.map(updateTree)
        };
      };

      return updateTree(prevTree);
    });
  };

  /**
   * Lê arquivo .txt selecionado e armazena seu conteúdo.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result as string);
      };
      reader.readAsText(selectedFile);
    }
  };

  /**
   * Envia o conteúdo do arquivo para a API.
   */
  const handleFileSend = async () => {
    if (!fileContent) {
      alert('Nenhum arquivo selecionado.');
      return;
    }
    try {
      const parsedData = JSON.parse(fileContent);
      const rootKey = Number(Object.keys(parsedData)[0]);
      const response = await sendTreeData(parsedData, { number: rootKey } as TreeNode);
      navigate('/result', {
        state: {
          treeData: parsedData,
          apiResponse: response,
          apiFormat: parsedData
        }
      });
      setShowTxtModal(false);
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
    }
  };

  /**
   * Converte a árvore local para o formato esperado pela API e navega para a página de resultado.
   * Usamos uma chave composta (number-id) para evitar colisões quando houver números repetidos.
   */
  const handleResultPage = async () => {
    try {
      const apiData: APITreeData = {};

      const convertToApiFormat = (node: TreeNode) => {
        // Usa uma chave composta para evitar conflitos
        const key = `${node.number}-${node.id}`;
        if (!apiData[key]) {
          apiData[key] = [];
        }

        // Ordena os filhos para manter a ordem left/right
        const sortedChildren = [...node.children].sort((a, b) => {
          if (a.position === 'left' && b.position === 'right') return -1;
          if (a.position === 'right' && b.position === 'left') return 1;
          return 0;
        });

        // Se o primeiro filho for 'right', insere "None" na posição left
        if (sortedChildren.length > 0 && sortedChildren[0].position === 'right') {
          apiData[key].push('None');
        }

        // Adiciona os números dos filhos
        sortedChildren.forEach(child => {
          apiData[key].push(child.number);
        });

        // Processa recursivamente cada filho
        sortedChildren.forEach(convertToApiFormat);
      };

      convertToApiFormat(tree);

      const response = await sendTreeData(apiData, tree);
      navigate('/result', {
        state: {
          treeData: tree,
          apiResponse: response,
          apiFormat: apiData
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Share2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Construtor de Árvores</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResultPage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Veja o resultado
            </button>
            <button
              onClick={() => setShowTxtModal(true)}
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-200"
            >
              Enviar TXT
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 min-h-[600px] flex items-start justify-center">
          <TreeNodeComponent
            node={tree}
            onAddChild={handleAddChild}
            onNumberChange={handleNodeNumberChange}
            isRoot={true}
          />
        </div>
      </div>

      {showTxtModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-95 hover:scale-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              📄 Enviar Arquivo TXT
            </h2>

            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all p-4">
              {file ? (
                <div className="flex flex-col items-center">
                  <p className="text-gray-700 font-medium text-center truncate max-w-full">
                    {file.name.replace(/(\.txt)+$/i, '.txt')}
                  </p>
                  <button
                    onClick={() => {
                      setFile(null);
                      setFileContent(null);
                    }}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <label className="w-full text-center cursor-pointer">
                  <span className="text-gray-500">Clique ou arraste um arquivo</span>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleFileSend}
                disabled={!fileContent}
                className={`w-full px-4 py-2 font-semibold rounded-lg transition-all ${
                  fileContent
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                📤 Enviar
              </button>
              <button
                onClick={() => setShowTxtModal(false)}
                className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
