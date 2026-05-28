
# Pedidos Veloz — Plataforma de Microsserviços

Projeto final da disciplina **Cloud DevOps** - Entrega Contínua com Microsserviços.

## 🎯 Contexto
Modernização da aplicação da Loja Veloz, resolvendo problemas de deploy, escalabilidade e observabilidade.


---

## Arquitetura

| Serviço | Porta | Função |
|---|---|---|
| api-gateway | 3000 | Roteamento de requisições |
| pedidos | 3001 | Criar e listar pedidos (PostgreSQL) |
| pagamentos | 3002 | Processar pagamentos |
| estoque | 3003 | Reservar itens do estoque |
| postgres | 5432 | Banco de dados |

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- Para Kubernetes: ativar em Docker Desktop → Settings → Kubernetes → Enable

---

## Rodar localmente com Docker Compose

```bash
# 1. Clonar o projeto
git clone https://github.com/SEU_USUARIO/pedidos-veloz.git
cd pedidos-veloz

# 2. Subir tudo com um único comando
docker compose up --build

# 3. Testar
curl http://localhost:3000/
```

### Exemplos de uso

```bash
# Ver rotas disponíveis
curl http://localhost:3000/

# Criar um pedido
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"produto": "camiseta", "quantidade": 2}'

# Listar pedidos
curl http://localhost:3000/api/pedidos

# Consultar estoque
curl http://localhost:3000/api/estoque/camiseta

# Processar pagamento
curl -X POST http://localhost:3000/api/pagamentos \
  -H "Content-Type: application/json" \
  -d '{"pedidoId": "1", "valor": 59.90}'
```

---

## Rodar no Kubernetes (Docker Desktop)

```bash
# 1. Build das imagens locais
docker build -t pedidos-veloz-api-gateway:latest ./services/api-gateway
docker build -t pedidos-veloz-pedidos:latest ./services/pedidos
docker build -t pedidos-veloz-pagamentos:latest ./services/pagamentos
docker build -t pedidos-veloz-estoque:latest ./services/estoque

# 2. Aplicar os manifests
kubectl apply -f k8s/deployment.yaml

# 3. Aguardar os pods subirem
kubectl get pods -n pedidos-veloz --watch

# 4. Testar (porta 30000 no Kubernetes)
curl http://localhost:30000/
```

### Comandos úteis

```bash
# Ver status dos pods
kubectl get pods -n pedidos-veloz

# Ver logs de um serviço
kubectl logs -l app=pedidos -n pedidos-veloz

# Ver escalabilidade automática
kubectl get hpa -n pedidos-veloz

# Remover tudo
kubectl delete -f k8s/deployment.yaml
```

---

## Infraestrutura como Código (Terraform)

Esqueleto para provisionar o cluster no Google Cloud (GKE):

```bash
cd terraform/
terraform init
terraform plan -var="project_id=SEU_PROJETO_GCP"
terraform apply -var="project_id=SEU_PROJETO_GCP"
```

---

## Estrutura do Projeto

---

## Decisões técnicas

| Decisão | Justificativa |
|---|---|
| RollingUpdate | Zero downtime durante deploy — nenhum pod é derrubado sem substituto pronto |
| HPA por CPU 70% | Escala automaticamente em picos sem intervenção manual |
| Secret separado do ConfigMap | Senha nunca fica exposta em texto simples no cluster |
| securityContext runAsNonRoot | Container nunca roda como root — reduz superfície de ataque |
| Multi-stage Dockerfile | Imagem de produção sem dependências de desenvolvimento |

