package com.kalleb.arvore_api.service;

import com.kalleb.arvore_api.model.AVLNode;
import org.springframework.stereotype.Service;

@Service
public class AVLService {
    private AVLNode root;

    // Classe auxiliar para resposta detalhada
    public static class NodeInfo {
        public int value;
        public int height;
        public int balanceFactor;
        public String rotation;
        public NodeInfo left;
        public NodeInfo right;
        public NodeInfo(int value, int height, int balanceFactor, String rotation) {
            this.value = value;
            this.height = height;
            this.balanceFactor = balanceFactor;
            this.rotation = rotation;
        }
    }

    // Retorna a árvore inteira com info de cada nó (valor, altura, fator, rotação sugerida)
    public NodeInfo getTreeInfo() {
        return buildNodeInfo(root);
    }

    private NodeInfo buildNodeInfo(AVLNode node) {
        if (node == null) return null;
        int bf = node.getBalanceFactor();
        String rotation = suggestRotation(node);
        NodeInfo info = new NodeInfo(node.getValue(), node.getHeight(), bf, rotation);
        info.left = buildNodeInfo(node.getLeft());
        info.right = buildNodeInfo(node.getRight());
        return info;
    }

    // Sugere rotação para o nó atual
    public String suggestRotation(AVLNode node) {
        if (node == null) return "";
        int bf = node.getBalanceFactor();
        if (bf > 1) {
            if (node.getRight() != null && node.getRight().getBalanceFactor() < 0) {
                return "RL";
            }
            return "RR";
        }
        if (bf < -1) {
            if (node.getLeft() != null && node.getLeft().getBalanceFactor() > 0) {
                return "LR";
            }
            return "LL";
        }
        return "OK";
    }

    public AVLNode getRoot() {
        return root;
    }

    public void insert(int value) {
        root = insertRec(root, value);
    }

    private AVLNode insertRec(AVLNode node, int value) {
        if (node == null) return new AVLNode(value);
        if (value < node.getValue()) {
            node.setLeft(insertRec(node.getLeft(), value));
        } else if (value > node.getValue()) {
            node.setRight(insertRec(node.getRight(), value));
        } else {
            return node; // Duplicados não são inseridos
        }
        updateHeight(node);
        return balance(node);
    }

    private void updateHeight(AVLNode node) {
        int leftHeight = (node.getLeft() != null) ? node.getLeft().getHeight() : 0;
        int rightHeight = (node.getRight() != null) ? node.getRight().getHeight() : 0;
        node.setHeight(1 + Math.max(leftHeight, rightHeight));
    }

    private AVLNode balance(AVLNode node) {
        int balance = node.getBalanceFactor();
        // Rotação à esquerda
        if (balance > 1) {
            if (node.getRight() != null && node.getRight().getBalanceFactor() < 0) {
                node.setRight(rotateRight(node.getRight())); // RL
            }
            return rotateLeft(node); // RR
        }
        // Rotação à direita
        if (balance < -1) {
            if (node.getLeft() != null && node.getLeft().getBalanceFactor() > 0) {
                node.setLeft(rotateLeft(node.getLeft())); // LR
            }
            return rotateRight(node); // LL
        }
        return node;
    }

    private AVLNode rotateLeft(AVLNode y) {
        AVLNode x = y.getRight();
        AVLNode T2 = x.getLeft();
        x.setLeft(y);
        y.setRight(T2);
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    private AVLNode rotateRight(AVLNode y) {
        AVLNode x = y.getLeft();
        AVLNode T2 = x.getRight();
        x.setRight(y);
        y.setLeft(T2);
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    // Métodos utilitários para consulta
    public String getBalanceInfo() {
        StringBuilder sb = new StringBuilder();
        buildBalanceInfo(root, sb, "");
        return sb.toString();
    }

    private void buildBalanceInfo(AVLNode node, StringBuilder sb, String prefix) {
        if (node == null) return;
        sb.append(prefix)
          .append("Valor: ").append(node.getValue())
          .append(", Altura: ").append(node.getHeight())
          .append(", Fator: ").append(node.getBalanceFactor())
          .append("\n");
        buildBalanceInfo(node.getLeft(), sb, prefix + "  L-");
        buildBalanceInfo(node.getRight(), sb, prefix + "  R-");
    }
}
