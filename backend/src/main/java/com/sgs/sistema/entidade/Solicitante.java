package com.sgs.sistema.entidade;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "solicitante")
@Getter
@Setter
@NoArgsConstructor
public class Solicitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(nullable = false, length = 150)
    private String nome;

    @NotBlank(message = "O CPF/CNPJ é obrigatório")
    @Size(min = 11, max = 14, message = "O documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos")
    @Column(name = "cpf_cnpj", nullable = false, unique = true, length = 14)
    private String cpfCnpj;

    // Método utilitário para garantir que só os números sejam atribuídos
    public void setCpfCnpj(String cpfCnpj) {
        if (cpfCnpj != null) {
            this.cpfCnpj = cpfCnpj.replaceAll("[^0-9]", "");
        }
    }
}