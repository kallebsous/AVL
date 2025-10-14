package com.kalleb.arvore_api.controller;

import com.kalleb.arvore_api.service.AVLService;
import com.kalleb.arvore_api.service.AVLService.NodeInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avl")
public class AVLController {
    @Autowired
    private AVLService avlService;

    @PostMapping("/inserir")
    public String inserir(@RequestParam int valor) {
        avlService.insert(valor);
        return "Nó inserido: " + valor;
    }

    @GetMapping("/info")
    public String info() {
        return avlService.getBalanceInfo();
    }

    @GetMapping("/tree-info")
    public NodeInfo getTreeInfo() {
        return avlService.getTreeInfo();
    }
}
