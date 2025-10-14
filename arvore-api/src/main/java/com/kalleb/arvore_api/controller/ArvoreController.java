package com.kalleb.arvore_api.controller;
import com.kalleb.arvore_api.model.Arvore;
import com.kalleb.arvore_api.service.ArvoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // aqui nos tratamos requisições api REST
@RequestMapping("/api/arvore") // Todas as rotas aqui começarão com /api/arvore
@CrossOrigin(origins = "*") // Permite requisições de qualquer origem (útil para desenvolvimento)
public class ArvoreController {

    @Autowired // Injeta a instância do ArvoreService automaticamente
    private ArvoreService arvoreService;

    // GET /api/arvore
    @GetMapping
    public ResponseEntity<Arvore> getArvoreCompleta() {
        Arvore arvore = arvoreService.getArvore();
        if (arvore != null) {
            return ResponseEntity.ok(arvore);
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/arvore/inicializar?valorRaiz=10
    @PostMapping("/inicializar")
    public ResponseEntity<Void> inicializarArvore(@RequestParam int valorRaiz) {
        arvoreService.inicializarArvore(valorRaiz);
        return ResponseEntity.ok().build();
    }

    // GET /api/arvore/no/{valor}
    @GetMapping("/no/{valor}")
    public ResponseEntity<Arvore> consultarNo(@PathVariable int valor) {
        Arvore no = arvoreService.consultarNo(valor);
        if (no != null) {
            return ResponseEntity.ok(no);
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/arvore/inserir?valorPai=10&valorNovo=99
    @PostMapping("/inserir")
    public ResponseEntity<Void> inserirNo(@RequestParam int valorPai, @RequestParam int valorNovo) {
        boolean sucesso = arvoreService.inserirNo(valorPai, valorNovo);
        if (sucesso) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    // DELETE /api/arvore/excluir/{valor}
    @DeleteMapping("/excluir/{valor}")
    public ResponseEntity<Void> excluirNoTotal(@PathVariable int valor) {
        boolean sucesso = arvoreService.excluirNoTotal(valor);
        if (sucesso) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE /api/arvore/excluir-promover/{valor}
    @DeleteMapping("/excluir-promover/{valor}")
    public ResponseEntity<Void> excluirNoPromoverPrimogenito(@PathVariable int valor) {
        boolean sucesso = arvoreService.excluirNoPromoverPrimogenito(valor);
        if (sucesso) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}