# Estágio 1: Build da aplicação Node
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx
FROM nginx:alpine
# Remove a configuração default do Nginx e adiciona uma customizada para SPAs
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos gerados pelo Vite (pasta dist) para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]