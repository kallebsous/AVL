


import { useState, useEffect } from 'react';
import './arvore.css';

// Componente recursivo para exibir cada nó AVL com informações
function AVLTreeNode({ node }) {
  if (!node) return null;
  // Feedback visual: cor de fundo e borda mudam se desbalanceado
  const isDesbalanceado = Math.abs(node.balanceFactor) > 1;
  const nodeBg = isDesbalanceado ? 'bg-red-100 border-red-400' : 'bg-sky-100 border-sky-400';
  const nodeText = isDesbalanceado ? 'text-red-800' : 'text-sky-800';
  const fbText = isDesbalanceado ? 'text-red-700 font-bold animate-pulse' : 'text-sky-700';
  return (
    <li className="px-2">
      <div className="flex flex-col items-center">
        <div className={`transition-all duration-300 border-2 rounded-full w-20 h-20 flex flex-col items-center justify-center font-bold text-sm shadow-md ${nodeBg} ${nodeText} ${isDesbalanceado ? 'scale-110 ring-2 ring-red-300' : ''}`}>
          <span className="text-base font-bold">{node.value}</span>
          <span className="text-xs font-normal text-slate-600">Altura: {node.height}</span>
          <span className={`text-xs font-normal ${fbText}`}>FB: {node.balanceFactor}</span>
          {isDesbalanceado && <span className="text-xs font-bold text-red-600 animate-bounce">Desbalanceado!</span>}
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

// Componente recursivo para exibir cada nó AVL com informações

function App() {
  // Normalize API base URL (remove trailing slash) and allow VITE_API_URL override
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
  // Resetar árvore e histórico
  const handleResetar = () => {
    fetch(`${API_URL}/api/avl/resetar`, { method: 'POST' })
      .then(() => {
        fetchAVLTree();
        fetchHistorico();
        setShowHistorico(false);
      });
  };
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novoValor, setNovoValor] = useState("");
  const [inserindo, setInserindo] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [showHistorico, setShowHistorico] = useState(false);

  // Buscar histórico de rotações
  const fetchHistorico = () => {
    fetch(`${API_URL}/api/avl/historico-rotacoes`)
      .then(res => res.json())
      .then(data => setHistorico(data || []));
  };

  // Balancear árvore manualmente
  const handleBalancear = () => {
    fetch(`${API_URL}/api/avl/balancear`, { method: 'POST' })
      .then(() => {
        fetchAVLTree();
        fetchHistorico();
        setShowHistorico(true);
      });
  };

  // Buscar árvore AVL do backend
  const fetchAVLTree = () => {
    setLoading(true);
    fetch(`${API_URL}/api/avl/tree-info`)
      .then(response => {
        if (!response.ok) {
          // Só mostra erro se realmente não conseguir conectar (ex: servidor fora do ar)
          throw new Error('Erro ao buscar árvore AVL');
        }
        return response.json();
      })
      .then(data => {
        setTreeData(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        // Só mostra erro se realmente não conseguir conectar (ex: servidor fora do ar)
        setTreeData(undefined);
        setLoading(false);
        // Só mostra erro se não for erro de árvore vazia (data === null)
        if (err.message === 'Failed to fetch' || err.message === 'NetworkError when attempting to fetch resource.') {
          setError('Não foi possível conectar à API. Certifique-se que o servidor está rodando em http://localhost:8080.');
        } else {
          setError(null);
        }
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
    fetch(`${API_URL}/api/avl/inserir?valor=${novoValor}`, { method: 'POST' })
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
        {/* Só mostra erro se realmente não conseguir conectar (treeData undefined E error) */}
        {/* Mostra erro só se realmente não conseguir conectar (treeData undefined E error) */}
        {/* Mostra erro só se realmente não conseguir conectar (treeData undefined E error) */}
        {/* Mostra erro só se realmente não conseguir conectar (treeData undefined E error) */}
        {error && !loading && treeData === undefined && (
          <div className="flex flex-col items-center gap-2 p-4 rounded-md mb-2 text-sm font-bold bg-red-200 text-red-700 border border-red-400 max-w-xl">
            <span>❌ {error}</span>
            <button onClick={fetchAVLTree} className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition">Tentar novamente</button>
          </div>
        )}
        {/* Mostra formulário de inserção se árvore está vazia, mesmo se houve erro antes. Só esconde se treeData for undefined (erro real de conexão) */}
  {!loading && (treeData === null || treeData === undefined) && !error && (
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
  {(treeData !== null && treeData !== undefined) && !loading && (
          <div className="tree bg-white p-4 rounded-xl shadow-lg border border-slate-200 w-full max-w-2xl flex flex-col justify-center items-start mx-auto">
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
            <div className="flex gap-3 mt-4 self-center">
              <button
                onClick={handleBalancear}
                className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-700 transition"
              >Balancear árvore</button>
              <button
                onClick={handleResetar}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600 transition"
              >Resetar árvore</button>
            </div>
            {showHistorico && (
              <div className="mt-6 w-full">
                <h2 className="text-base font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span>Histórico de rotações</span>
                  <span className="text-xs font-normal text-slate-500">(LL: esq-esq, RR: dir-dir, LR: esq-dir, RL: dir-esq)</span>
                </h2>
                {historico.length === 0 ? (
                  <div className="text-slate-500 text-sm">Nenhuma rotação realizada.</div>
                ) : (
                  <ul className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-inner space-y-1">
                    {historico.map((item, idx) => (
                      <li key={idx} className="text-slate-700 text-sm flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;