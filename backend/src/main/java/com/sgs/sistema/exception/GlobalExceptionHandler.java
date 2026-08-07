package com.sgs.sistema.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

@RestControllerAdvice // Anotação que indica que esta classe é um "Controller Advice" global para tratamento de exceções
public class GlobalExceptionHandler {

    // 1. Trata a regra de transição de status (Erro 422)
    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroPadrao> handleRegraNegocio(RegraNegocioException ex) {
        ErroPadrao erro = new ErroPadrao(
                LocalDateTime.now(),
                HttpStatus.UNPROCESSABLE_CONTENT.value(),
                "Erro de Regra de Negócio",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(erro);
    }

    // 2. Trata campos obrigatórios faltando do @Valid (Erro 400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroPadrao> handleValidacao(MethodArgumentNotValidException ex) {
        List<String> erros = ex.getBindingResult().getFieldErrors().stream()
                .map(erroCampo -> erroCampo.getField() + ": " + erroCampo.getDefaultMessage())
                .toList();

        ErroPadrao erro = new ErroPadrao(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Erro de Validação",
                String.join(" | ", erros)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    // 3. Trata JSON mal formatado ou valores de Enum inválidos (Erro 400)
    // Ex: O usuário enviou o status "BATATA", o Jackson não consegue converter e lança esse erro
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroPadrao> handleMensagemIncompreensivel(HttpMessageNotReadableException ex) {
        ErroPadrao erro = new ErroPadrao(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Requisição Mal Formatada",
                "O corpo da requisição contém dados inválidos ou um formato JSON incorreto."
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    // 4. Trata erros de restrição do Banco de Dados (Erro 409)
    // Ex: Tentar salvar um solicitante com um CPF/CNPJ que já existe (Unique Constraint)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroPadrao> handleViolacaoDeDados(DataIntegrityViolationException ex) {
        ErroPadrao erro = new ErroPadrao(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Conflito de Dados",
                "A operação viola uma restrição do banco de dados (ex: registro duplicado ou em uso)."
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    // 5. Trata buscas por IDs que não existem no banco (Erro 404)
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroPadrao> handleRecursoNaoEncontrado(RecursoNaoEncontradoException ex) {
        ErroPadrao erro = new ErroPadrao(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(), // 404 - Not Found
                "Recurso Não Encontrado",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    // 6. O "Pega-Tudo": Trata erros genéricos e inesperados (Erro 500)
    // Se der qualquer erro no código que não está previsto (como NullPointer), cai aqui!
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroPadrao> handleErrosGenericos(Exception ex) {

        ErroPadrao erro = new ErroPadrao(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro Interno do Servidor",
                "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde." // Esconde o erro real do usuário
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }

   

    // Record interno para formatar o JSON de resposta
    public record ErroPadrao(
            LocalDateTime timestamp,
            Integer status,
            String erro,
            String mensagem
    ) {}
}