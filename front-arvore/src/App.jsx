
import { useState, useEffect } from 'react';
import './arvore.css'; // Importamos nosso CSS para as linhas pq css puro é mais fácil

// aqui o component pra renderizar cada nó da árvore
function TreeNode({ node }) {
  return (
    <li className="px-2">
      <div className="flex flex-col items-center">
        <div className="bg-sky-100 border-2 border-sky-400 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sky-800">
          {node.value}
        </div>
      </div>

      {/* Renderiza os filhos recursivamente */}
      {node.children && node.children.length > 0 && (
        <ul className="pt-6">
          {node.children.map((child) => (
            <TreeNode key={child.value} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

// Componente principal da aplicação
function App() {
  // Estado para guardar o último valor excluído/promovido
  const [ultimoExcluido, setUltimoExcluido] = useState("");
  const [caminhoExcluido, setCaminhoExcluido] = useState("");
  const [ultimoPromovido, setUltimoPromovido] = useState("");
  const [caminhoPromovido, setCaminhoPromovido] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [valorRaiz, setValorRaiz] = useState("");
  const [consultaValor, setConsultaValor] = useState("");
  const [consultaNo, setConsultaNo] = useState(null);
  const [consultaCaminho, setConsultaCaminho] = useState("");
  const [valorPai, setValorPai] = useState("");
  const [valorNovo, setValorNovo] = useState("");
  const [excluirValor, setExcluirValor] = useState("");
  const [excluirPromoverValor, setExcluirPromoverValor] = useState("");


  // Função para extrair todos os valores de nós existentes na árvore
  function listarValoresNos(node) {
    if (!node) return [];
    let valores = [node.value];
    for (let filho of node.children || []) {
      valores = valores.concat(listarValoresNos(filho));
    }
    return valores;
  }

  // Atualiza árvore
  const fetchTree = () => {
    fetch('http://localhost:8080/api/arvore')
      .then(response => response.json())
      .then(data => setTreeData(data))
      .catch(() => setError("Não foi possível conectar à API."));
  };

  useEffect(() => {
    fetchTree();
  }, []);

  // Inicializar árvore
  const handleInicializar = (e) => {
    e.preventDefault();
    if (!valorRaiz) {
      setError("Informe o valor da raiz.");
      return;
    }
    fetch(`http://localhost:8080/api/arvore/inicializar?valorRaiz=${valorRaiz}`, { method: 'POST' })
      .then(() => { setError(null); setSuccess("Árvore inicializada!"); fetchTree(); })
      .catch(() => setError("Erro ao inicializar árvore."));
  };

  // Inicializar árvore padrão
  const handleInicializarPadrao = () => {
    fetch(`http://localhost:8080/api/arvore/inicializar?valorRaiz=10`, { method: 'POST' })
      .then(() => {
        setError(null);
        setSuccess("Árvore padrão inicializada!");
        fetchTree();
      })
      .catch(() => setError("Erro ao inicializar árvore padrão."));
  };

  // Resetar árvore
  const handleResetar = () => {
    fetch(`http://localhost:8080/api/arvore/inicializar?valorRaiz=`, { method: 'POST' })
      .then(() => {
        setError(null);
        setSuccess("Árvore resetada!");
        fetchTree();
      })
      .catch(() => setError("Erro ao resetar árvore."));
  };

  // Função para gerar caminho descritivo
  function gerarCaminho(node, valor, caminho = "") {
    if (!node) return "";
    if (node.value === parseInt(valor)) {
      if (!node.children || node.children.length === 0) {
        return caminho + node.value + "()";
      } else {
        return caminho + node.value;
      }
    }
    for (let filho of node.children || []) {
      const sub = gerarCaminho(filho, valor, caminho + node.value + "(");
      if (sub) return sub + ")";
    }
    return "";
  }

  // Consultar nó
  const handleConsultarNo = (e) => {
    e.preventDefault();
    if (!consultaValor) {
      setError("Informe o valor do nó para consulta.");
      return;
    }
    fetch(`http://localhost:8080/api/arvore/no/${consultaValor}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Nó não encontrado');
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.value) {
          setConsultaNo(null);
          setConsultaCaminho("");
          setError("Nó não encontrado.");
          setSuccess(null);
        } else {
          setConsultaNo(data);
          setConsultaCaminho(gerarCaminho(treeData, consultaValor));
          setSuccess("Consulta realizada!");
          setError(null);
        }
      })
      .catch(() => {
        setConsultaNo(null);
        setConsultaCaminho("");
        setError("Nó não encontrado.");
        setSuccess(null);
      });
  };

  // Inserir nó
  const handleInserirNo = (e) => {
    e.preventDefault();
    if (!valorPai || !valorNovo) {
      setError("Informe o valor do pai e do novo nó.");
      return;
    }
    fetch(`http://localhost:8080/api/arvore/inserir?valorPai=${valorPai}&valorNovo=${valorNovo}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Pai não encontrado');
        }
        setError(null);
        setSuccess("Nó inserido!");
        fetchTree();
      })
      .catch((err) => {
        if (err.message === 'Pai não encontrado') {
          setError("O valor do pai informado não existe na árvore.");
        } else {
          setError("Erro ao inserir nó.");
        }
      });
  };

  // Excluir nó (total)
  const handleExcluirNo = (e) => {
    e.preventDefault();
    if (!excluirValor) {
      setError("Informe o valor do nó para excluir.");
      return;
    }
    // Salva o valor e caminho antes de excluir
    setUltimoExcluido(excluirValor);
    setCaminhoExcluido(gerarCaminho(treeData, excluirValor));
    fetch(`http://localhost:8080/api/arvore/excluir/${excluirValor}`, { method: 'DELETE' })
      .then(() => { setError(null); setSuccess("Nó excluído!"); fetchTree(); })
      .catch(() => setError("Erro ao excluir nó."));
  };

  // Excluir nó (promover primogênito)
  const handleExcluirPromover = (e) => {
    e.preventDefault();
    if (!excluirPromoverValor) {
      setError("Informe o valor do nó para promover.");
      return;
    }
    // Salva o valor e caminho antes de promover
    setUltimoPromovido(excluirPromoverValor);
    setCaminhoPromovido(gerarCaminho(treeData, excluirPromoverValor));
    fetch(`http://localhost:8080/api/arvore/excluir-promover/${excluirPromoverValor}`, { method: 'DELETE' })
      .then(() => { setError(null); setSuccess("Nó excluído/promovido!"); fetchTree(); })
      .catch(() => setError("Erro ao excluir/promover nó."));
  };

  return (
    <main className="bg-gradient-to-br from-slate-100 to-blue-50 min-h-screen flex flex-col items-center justify-center p-2">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-700 mb-2 tracking-tight drop-shadow">Visualizador de Árvore N-ária</h1>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-2 md:gap-6 items-start justify-center">
        <div className="w-full md:w-2/5 flex flex-col gap-2">
          {/* Mensagens de resultado/erro mais evidentes */}
          {(error || success) && (
            <div className={`flex items-center gap-2 p-2 rounded-md mb-1 text-sm font-bold ${error ? 'bg-red-200 text-red-700 border border-red-400' : 'bg-green-200 text-green-700 border border-green-400'}`}>
              {error ? <span>❌</span> : <span>✅</span>}
              {error || success}
            </div>
          )}
          <form onSubmit={handleConsultarNo} className="flex flex-col gap-1 bg-green-50 p-2 rounded shadow-sm border border-green-100">
            <label className="text-xs text-slate-600">Valor do nó para consulta</label>
            <input type="number" placeholder="Valor do nó" value={consultaValor} onChange={e => setConsultaValor(e.target.value)} className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-300" required />
            <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-600 transition">Consultar nó</button>
          </form>
          <form onSubmit={handleInserirNo} className="flex flex-col gap-1 bg-purple-50 p-2 rounded shadow-sm border border-purple-100">
            <label className="text-xs text-slate-600">Inserir nó</label>
            <div className="flex gap-1">
              <input type="number" placeholder="Valor do pai" value={valorPai} onChange={e => setValorPai(e.target.value)} className="border rounded px-2 py-1 text-xs w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-300" required />
              <input type="number" placeholder="Valor do novo nó" value={valorNovo} onChange={e => setValorNovo(e.target.value)} className="border rounded px-2 py-1 text-xs w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-300" required />
            </div>
            <button type="submit" className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-purple-600 transition">Inserir nó</button>
          </form>
          <form onSubmit={handleExcluirNo} className="flex flex-col gap-1 bg-red-50 p-2 rounded shadow-sm border border-red-100">
            <label className="text-xs text-slate-600">Excluir nó (total)</label>
            <select value={excluirValor} onChange={e => setExcluirValor(e.target.value)} className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-300" required>
              <option value="">Selecione o nó</option>
              {listarValoresNos(treeData).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <button type="submit" className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition">Excluir nó</button>
          </form>
          <form onSubmit={handleExcluirPromover} className="flex flex-col gap-1 bg-orange-50 p-2 rounded shadow-sm border border-orange-100">
            <label className="text-xs text-slate-600">Excluir nó (promover primogênito)</label>
            <select value={excluirPromoverValor} onChange={e => setExcluirPromoverValor(e.target.value)} className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300" required>
              <option value="">Selecione o nó</option>
              {listarValoresNos(treeData).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <button type="submit" className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-orange-600 transition">Excluir/promover</button>
          </form>
          <form onSubmit={handleInicializar} className="flex flex-col gap-1 bg-blue-50 p-2 rounded shadow-sm border border-blue-100">
            <label className="text-xs text-slate-600">Valor da raiz</label>
            <input type="number" placeholder="Valor da raiz" value={valorRaiz} onChange={e => setValorRaiz(e.target.value)} className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300" required />
            <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-600 transition">Inicializar árvore personalizada</button>
          </form>
          <button onClick={handleInicializarPadrao} className="bg-blue-700 text-white px-2 py-1 rounded shadow-sm text-xs font-medium hover:bg-blue-800 transition">Inicializar árvore padrão</button>
          <button onClick={handleResetar} className="bg-gray-500 text-white px-2 py-1 rounded shadow-sm text-xs font-medium hover:bg-gray-600 transition">Resetar árvore</button>
          {/* Mensagem de consulta */}
          {consultaNo && (
            <div className="p-2 border rounded bg-green-100 shadow-sm text-xs text-center">
              <strong className="text-green-700">Nó encontrado:</strong> Valor: {consultaNo.value}, Filhos: {consultaNo.children?.length}
              {consultaCaminho && (
                <div className="mt-1 text-xs text-slate-700"><strong>Caminho:</strong> {consultaCaminho}</div>
              )}
            </div>
          )}
        </div>
          {treeData && (
            <div className="w-full md:w-3/5 flex flex-col justify-center items-start">
              <div className="tree bg-white p-2 md:p-4 rounded-xl shadow-lg border border-slate-200 w-full max-w-2xl flex justify-center items-start mx-auto">
                <ul className="flex justify-center">
                  <TreeNode node={treeData} />
                </ul>
              </div>
              {/* Histórico/caminho da consulta abaixo da árvore */}
              {consultaCaminho && (
                <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 shadow text-center w-full max-w-2xl mx-auto">
                  <strong>Caminho consultado:</strong> {consultaCaminho}
                </div>
              )}
              {ultimoExcluido && caminhoExcluido && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 shadow text-center w-full max-w-2xl mx-auto">
                  <strong>Caminho do nó excluído:</strong> {caminhoExcluido}
                </div>
              )}
              {ultimoPromovido && caminhoPromovido && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700 shadow text-center w-full max-w-2xl mx-auto">
                  <strong>Caminho do nó promovido:</strong> {caminhoPromovido}
                </div>
              )}
            </div>
          )}
      </div>
    </main>
  );
}

export default App;