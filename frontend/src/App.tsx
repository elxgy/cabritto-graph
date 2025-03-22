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

  const [tree, setTree] = useState<TreeNode>({
    id: 'root',
    number: 0,
    children: [],
    position: 'right',
    placement: 'vertical'
  });

  const handleAddChild = (
    parentId: string,
    number: number,
    position: 'left' | 'right',
    placement: 'horizontal' | 'vertical'
  ) => {
    setTree(prevTree => {
      if (number === prevTree.number) {
        alert('O número do filho não pode ser igual ao número da raiz');
        return prevTree;
      }

      const addChildToNode = (node: TreeNode): TreeNode => {
        if (node.id === parentId) {
          if (number === node.number) {
            alert('O número do filho não pode ser igual ao número do pai');
            return node;
          }
          if (node.children.some(child => child.number === number)) {
            alert('Não é possível adicionar dois filhos iguais ao mesmo pai');
            return node;
          }

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

        return {
          ...node,
          children: node.children.map(addChildToNode)
        };
      };

      return addChildToNode(prevTree);
    });
  };

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

  const handleFileSend = async () => {
    if (!fileContent) {
      alert("Nenhum arquivo selecionado.");
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
      console.error("Erro ao enviar arquivo:", error);
    }
  };

  const handleResultPage = async () => {
    try {
      const apiData: APITreeData = {};

      const convertToApiFormat = (node: TreeNode) => {
        if (!apiData[node.number]) {
          apiData[node.number] = [];
        }

        const sortedChildren = [...node.children].sort((a, b) => {
          if (a.position === 'left' && b.position === 'right') return -1;
          if (a.position === 'right' && b.position === 'left') return 1;
          return 0;
        });

        if (sortedChildren.length > 0 && sortedChildren[0].position === 'right') {
          apiData[node.number].push("None");
        }

        sortedChildren.forEach(child => {
          apiData[node.number].push(child.number);
        });

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

  const handleNodeNumberChange = (nodeId: string, newNumber: number) => {
    setTree(prevTree => {
      const updateTree = (node: TreeNode): TreeNode => {
        const hasNumberConflict = node.children.some(child => child.number === newNumber);
        if (hasNumberConflict) {
          alert('A node with this number already exists!');
          return prevTree;
        }

        if (node.id === nodeId) {
          return {
            ...node,
            number: newNumber,
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
                    {file.name.replace(/(\.txt)+$/i, ".txt")}
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
                className={`w-full px-4 py-2 font-semibold rounded-lg transition-all ${fileContent ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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