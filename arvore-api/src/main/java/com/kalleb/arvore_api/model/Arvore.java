package com.kalleb.arvore_api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data // Gera getters, setters, toString, equals, hashCode
@NoArgsConstructor //construtor sem argumento
public class Arvore {

    private int value;
    private List<Arvore> children = new ArrayList<>();

    public Arvore(int value) {
        this.value = value;
    }

    public void addChild(Arvore child) {
        this.children.add(child);
    }
}