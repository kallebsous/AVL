package com.kalleb.arvore_api.model;

public class AVLNode {
    private int value;
    private int height;
    private AVLNode left;
    private AVLNode right;

    public AVLNode(int value) {
        this.value = value;
        this.height = 0;
    }

    public int getValue() { return value; }
    public void setValue(int value) { this.value = value; }

    public int getHeight() { return height; }
    public void setHeight(int height) { this.height = height; }

    public AVLNode getLeft() { return left; }
    public void setLeft(AVLNode left) { this.left = left; }

    public AVLNode getRight() { return right; }
    public void setRight(AVLNode right) { this.right = right; }

    public int getBalanceFactor() {
        int leftHeight = (left != null) ? left.height : 0;
        int rightHeight = (right != null) ? right.height : 0;
        return leftHeight - rightHeight;
    }
}
