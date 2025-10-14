# Projeto Árvore N-ária

## Visão geral
Esse projeto é uma aplicação para visualizar e manipular uma árvore n-ária, feita para facilitar o entendimento e testes de operações em estruturas de dados. Ele é dividido em duas partes: o back-end (Java Spring Boot) e o front-end (React).

---

## Back-end (Java Spring Boot)

Aqui é onde a mágica acontece! O back-end é responsável por guardar e manipular a árvore n-ária. Ele expõe uma API REST que permite:

- **Inicializar a árvore** (com valor personalizado ou padrão)
- **Consultar um nó** (ver se existe e mostrar o caminho até ele)
- **Inserir um nó** (em qualquer nó-pai existente)
- **Excluir um nó** (removendo ele e todos os filhos)
- **Excluir promovendo o primogênito** (o filho mais à esquerda vira o novo nó no lugar do excluído)
- **Resetar a árvore** (zera tudo)

Se você tentar inserir em um pai que não existe, o sistema te avisa e não faz nada. Tudo é feito via endpoints HTTP, então dá pra testar com o front ou com ferramentas tipo Postman.

---

## Front-end (React)

O front é bem direto: uma tela para visualizar a árvore e vários formulários para testar as operações. Você pode:

- Inicializar, resetar ou usar uma árvore padrão
- Consultar qualquer nó e ver o caminho até ele
- Inserir novos nós
- Excluir nós (total ou promovendo o primogênito)
- Ver o histórico das operações logo abaixo da árvore

Tudo é feito de forma visual, com feedback claro (erros, sucesso, histórico). O layout é responsivo e pensado pra não precisar ficar rolando a tela toda hora.

---

## Como rodar

1. **Back-end:**
   - Entre na pasta `arvore-api` e rode `./mvnw spring-boot:run` (precisa do Java instalado)
   - A API vai subir em `http://localhost:8080`

2. **Front-end:**
   - Entre na pasta `front-arvore` e rode `npm install` e depois `npm run dev`
   - Acesse `http://localhost:5173` no navegador

Pronto! Só usar e se divertir testando as operações na árvore.

---

## Dúvidas ou sugestões?
Pode perguntar ou sugerir melhorias! O projeto é pra aprender e brincar com árvores n-árias de um jeito fácil e visual.
