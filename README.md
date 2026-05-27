# Pedidos Veloz - Plataforma de Microsserviços

Projeto final da disciplina **Cloud DevOps** - Entrega Contínua com Microsserviços.

## 🎯 Contexto
Modernização da aplicação da Loja Veloz, resolvendo problemas de deploy, escalabilidade e observabilidade.

## 🏗️ Arquitetura

- **API Gateway** (Node.js) - Porta 3000
- **Serviço de Pedidos** (com PostgreSQL)
- **Serviço de Pagamentos**
- **Serviço de Estoque**
- **Banco de Dados**: PostgreSQL

## 🚀 Como Rodar

### Docker Compose (Local)
```bash
docker compose up --build -d

