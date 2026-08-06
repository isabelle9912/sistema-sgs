# Estágio 1: Build 
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
# Otimização de cache do Docker para dependências
COPY pom.xml .
RUN mvn dependency:go-offline
# Copia o código e compila
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Run (Apenas a JRE)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Boas práticas: criar usuário sem privilégios de root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copia apenas o JAR gerado no passo anterior
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]