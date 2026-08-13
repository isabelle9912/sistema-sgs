package com.sgs.sistema;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("Desabilitado pois tenta conectar ao banco de dados e falha no ambiente de CI sem o container")
@SpringBootTest
class SistemaApplicationTests {

	@Test
	void contextLoads() {
	}

}
