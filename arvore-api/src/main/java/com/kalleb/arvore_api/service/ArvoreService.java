package com.kalleb.arvore_api.service;

import com.kalleb.arvore_api.model.Arvore;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import java.util.LinkedList;
import java.util.Queue;

@Service // Marca esta classe como um serviço gerenciado pelo Spring
public class ArvoreService {

    private Arvore root;

    // @PostConstruct faz este método rodar uma vez após a inicialização do serviço
    @PostConstruct
    private void init() {
        //cria uma árvore de exemplo
    this.root = new Arvore(10);
    Arvore n1 = new Arvore(20);
    Arvore n2 = new Arvore(30);
    Arvore n3 = new Arvore(40);
    Arvore n4 = new Arvore(50);
    Arvore n5 = new Arvore(60);

    this.root.addChild(n1);
    this.root.addChild(n2);
    n1.addChild(n3);
    n1.addChild(n4);
    n2.addChild(n5);
    }


    public void inicializarArvore(int valorRaiz) {
        this.root = new Arvore(valorRaiz);
    }

    public Arvore getArvore() {
        return this.root;
    }

    public Arvore consultarNo(int valor) {
        return findNode(valor);
    }

    public boolean inserirNo(int valorPai, int valorNovo) {
        Arvore pai = findNode(valorPai);
        if (pai != null) {
            pai.addChild(new Arvore(valorNovo));
            return true;
        }
        // Pai não existe, retorna false para informar ao front
        return false;
    }

    // Exclusão total: remove nó e todos os descendentes
    public boolean excluirNoTotal(int valor) {
        if (root == null) return false;
        if (root.getValue() == valor) {
            root = null;
            return true;
        }
        return excluirRecursivo(root, valor);
    }

    private boolean excluirRecursivo(Arvore atual, int valor) {
        if (atual == null || atual.getChildren() == null) return false;
        for (int i = 0; i < atual.getChildren().size(); i++) {
            Arvore filho = atual.getChildren().get(i);
            if (filho.getValue() == valor) {
                atual.getChildren().remove(i);
                return true;
            } else {
                if (excluirRecursivo(filho, valor)) return true;
            }
        }
        return false;
    }

    // Exclusão promovendo primogênito: filhos do nó excluído vão para o pai, primogênito é promovido
    public boolean excluirNoPromoverPrimogenito(int valor) {
        if (root == null) return false;
        if (root.getValue() == valor) {
            if (root.getChildren().isEmpty()) {
                root = null;
            } else {
                Arvore primogenito = root.getChildren().get(0);
                root.getChildren().remove(0);
                primogenito.getChildren().addAll(root.getChildren());
                root = primogenito;
            }
            return true;
        }
        return promoverRecursivo(root, valor);
    }

    private boolean promoverRecursivo(Arvore atual, int valor) {
        if (atual == null || atual.getChildren() == null) return false;
        for (int i = 0; i < atual.getChildren().size(); i++) {
            Arvore filho = atual.getChildren().get(i);
            if (filho.getValue() == valor) {
                if (filho.getChildren().isEmpty()) {
                    atual.getChildren().remove(i);
                } else {
                    Arvore primogenito = filho.getChildren().get(0);
                    filho.getChildren().remove(0);
                    primogenito.getChildren().addAll(filho.getChildren());
                    atual.getChildren().set(i, primogenito);
                }
                return true;
            } else {
                if (promoverRecursivo(filho, valor)) return true;
            }
        }
        return false;
    }

    public Arvore findNode(int value) {
        if (root == null) {
            return null;
        }
        Queue<Arvore> queue = new LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            Arvore current = queue.poll();
            if (current.getValue() == value) {
                return current;
            }
            queue.addAll(current.getChildren());
        }
        return null; // Não encontrado
    }
}