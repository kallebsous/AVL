package com.kalleb.arvore_api.service;

import com.kalleb.arvore_api.model.AVLNode;
import org.springframework.stereotype.Service;

@Service
public class AVLService {
    private AVLNode root;

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
