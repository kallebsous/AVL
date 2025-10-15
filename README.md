
# Projeto Árvore AVL

## Visão geral

Esse projeto é uma aplicação para visualizar e manipular uma árvore AVL (auto-balanceada), feita para facilitar o entendimento de balanceamento, altura, fator de balanceamento e rotações (LL, RR, LR, RL) em estruturas de dados. Ele é dividido em duas partes: o back-end (Java Spring Boot) e o front-end (React).

---


## Back-end (Java Spring Boot)

O back-end é responsável por guardar e manipular a árvore AVL. Ele expõe uma API REST que permite:

- **Inserir um nó** (balanceamento automático)
- **Visualizar a árvore** (com valor, altura, fator de balanceamento e sugestão de rotação para cada nó)

Tudo é feito via endpoints HTTP, então dá pra testar com o front ou com ferramentas tipo Postman.

---


## Front-end (React)

O front-end permite:

- Visualizar a árvore AVL em tempo real
- Ver valor, altura, fator de balanceamento e sugestão de rotação ao lado de cada nó
- Inserir novos nós facilmente pelo formulário

Tudo é feito de forma visual, com feedback claro (erros, sucesso, loading). O layout é responsivo e pensado para facilitar o aprendizado.

---


## Como rodar o projeto

### Pré-requisitos
- **Java 17 ou superior** instalado (para o back-end)
- **Node.js** e **npm** instalados (para o front-end)

---

### 1. Rodando o Back-end (Java Spring Boot)

Abra um terminal e execute:

```sh
cd arvore-api
mvnw.cmd spring-boot:run
```

Se preferir, pode usar o Maven global (se tiver instalado):

```sh
mvn spring-boot:run
```

A API ficará disponível em: http://localhost:8080

---

### 2. Rodando o Front-end (React)

Abra outro terminal e execute:

```sh
cd front-arvore
npm install
npm run dev
```

O front-end estará em: http://localhost:5173 (ou outra porta, veja o terminal)

---

Pronto! Basta acessar o front-end, inserir valores e visualizar o balanceamento AVL em tempo real.

---


---

## Dúvidas ou sugestões?
Pode perguntar ou sugerir melhorias! O projeto é para aprender e brincar com árvores AVL de um jeito fácil e visual.
