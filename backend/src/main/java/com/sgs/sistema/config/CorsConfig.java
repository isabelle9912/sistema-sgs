package com.sgs.sistema.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Indica que está classe é uma classe de configuração do Spring
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todos os endpoints
                .allowedOrigins("*") // Permite requisições de qualquer origem
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS") // Permite métodos HTTP 
                .allowedHeaders("*"); // Permite todos os cabeçalhos
    }
    
}
