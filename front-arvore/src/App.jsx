

import { useState, useEffect } from 'react';
import './arvore.css';

// Componente recursivo para exibir cada nó AVL com informações
function AVLTreeNode({ node }) {
  if (!node) return null;
  return (
    <li className="px-2">
      <div className="flex flex-col items-center">
        <div className="bg-sky-100 border-2 border-sky-400 rounded-full w-16 h-16 flex flex-col items-center justify-center font-bold text-sky-800 text-sm">
          <span>Valor: {node.value}</span>
          <span className="text-xs font-normal text-sky-700">Altura: {node.height}</span>
          <span className="text-xs font-normal text-sky-700">FB: {node.balanceFactor}</span>
          <span className="text-xs font-semibold text-emerald-700">{node.rotation !== 'OK' ? `Rotação: ${node.rotation}` : ''}</span>
        </div>
      </div>
      {node.left || node.right ? (
        <ul className="pt-6 flex">
          {node.left && <AVLTreeNode node={node.left} />}
          {node.right && <AVLTreeNode node={node.right} />}
        </ul>
      ) : null}
    </li>
  );
}

function App() {
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novoValor, setNovoValor] = useState("");
  const [inserindo, setInserindo] = useState(false);

  // Buscar árvore AVL do backend
  const fetchAVLTree = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/avl/tree-info')
      .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar árvore AVL');
        return response.json();
      })
      .then(data => {
        setTreeData(data);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError('Não foi possível conectar à API. Certifique-se que o servidor está rodando em http://localhost:8080.');
        setTreeData(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAVLTree();
  }, []);

  // Inserir nó AVL
  const handleInserirNo = (e) => {
    e.preventDefault();
    if (!novoValor) return;
    setInserindo(true);
    fetch(`http://localhost:8080/api/avl/inserir?valor=${novoValor}`, { method: 'POST' })
      .then(() => {
        setNovoValor("");
        setInserindo(false);
        fetchAVLTree();
      })
      .catch(() => {
        setError('Erro ao inserir nó.');
        setInserindo(false);
      });
  };



  return (
    <main className="bg-gradient-to-br from-slate-100 to-blue-50 min-h-screen flex flex-col items-center justify-center p-2">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-700 mb-4 tracking-tight drop-shadow">Visualizador de Árvore AVL</h1>
      <div className="w-full max-w-3xl flex flex-col items-center justify-center">
        {loading && (
          <div className="text-slate-500 text-center mt-8">Carregando árvore AVL...</div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center gap-2 p-4 rounded-md mb-2 text-sm font-bold bg-red-200 text-red-700 border border-red-400 max-w-xl">
            <span>❌ {error}</span>
            <button onClick={fetchAVLTree} className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition">Tentar novamente</button>
          </div>
        )}
        {!loading && !error && !treeData && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <img src="https://cdn-icons-png.flaticon.com/512/427/427735.png" alt="Árvore vazia" className="w-24 h-24 opacity-60" />
            <div className="text-slate-600 text-center text-lg font-semibold">A árvore AVL está vazia.<br/>Insira o primeiro nó para começar!</div>
            <form onSubmit={handleInserirNo} className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Valor do nó"
                value={novoValor}
                onChange={e => setNovoValor(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
                disabled={inserindo}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition"
                disabled={inserindo}
              >{inserindo ? 'Inserindo...' : 'Inserir nó'}</button>
            </form>
          </div>
        )}
        {treeData && !loading && (
          <div className="tree bg-white p-4 rounded-xl shadow-lg border border-slate-200 w-full max-w-2xl flex justify-center items-start mx-auto">
            <ul className="flex justify-center">
              <AVLTreeNode node={treeData} />
            </ul>
            <form onSubmit={handleInserirNo} className="flex gap-2 items-center mt-6 justify-center">
              <input
                type="number"
                placeholder="Valor do novo nó"
                value={novoValor}
                onChange={e => setNovoValor(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
                disabled={inserindo}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition"
                disabled={inserindo}
              >{inserindo ? 'Inserindo...' : 'Inserir nó'}</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;