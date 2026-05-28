# =============================================================
# Terraform — Infraestrutura como Código
# Pedidos Veloz — Cluster Kubernetes no GKE (Google Cloud)
#
# Justificativa: GKE gerenciado elimina o overhead de operar
# o control plane (etcd, API server, scheduler) manualmente.
# O Cluster Autoscaler sobe e desce nós automaticamente
# conforme a demanda, essencial para os picos promocionais
# da Loja Veloz.
#
# Como usar:
#   terraform init
#   terraform plan -var="project_id=SEU_PROJETO"
#   terraform apply -var="project_id=SEU_PROJETO"
# =============================================================

terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

# ── Variáveis ────────────────────────────────────────────────

variable "project_id" {
  description = "ID do projeto no Google Cloud"
  type        = string
}

variable "region" {
  description = "Região onde o cluster será criado"
  type        = string
  default     = "us-east1"
}

variable "min_nodes" {
  description = "Número mínimo de nós (Cluster Autoscaler)"
  type        = number
  default     = 1
}

variable "max_nodes" {
  description = "Número máximo de nós em pico de tráfego"
  type        = number
  default     = 5
}

# ── Provider ─────────────────────────────────────────────────

provider "google" {
  project = var.project_id
  region  = var.region
}

# ── Cluster GKE ──────────────────────────────────────────────

resource "google_container_cluster" "cluster" {
  name     = "pedidos-veloz-cluster"
  location = var.region

  # Remove o node pool padrão para usar o gerenciado abaixo
  remove_default_node_pool = true
  initial_node_count       = 1

  # Habilita Network Policy (necessário para NetworkPolicy K8s)
  network_policy {
    enabled = true
  }
}

# ── Node Pool — máquinas do cluster ──────────────────────────

resource "google_container_node_pool" "nodes" {
  name     = "pedidos-veloz-nodes"
  location = var.region
  cluster  = google_container_cluster.cluster.name

  # Cluster Autoscaler — sobe nós quando os pods não cabem
  # e desce quando ficam ociosos (economia de custo)
  autoscaling {
    min_node_count = var.min_nodes
    max_node_count = var.max_nodes
  }

  # Auto-repair: substitui nós com problema automaticamente
  # Auto-upgrade: mantém a versão do Kubernetes atualizada
  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    machine_type = "e2-medium"  # 2 vCPU, 4GB RAM por nó
    disk_size_gb = 30

    # Metadados de segurança
    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

# ── Outputs ───────────────────────────────────────────────────

output "cluster_name" {
  description = "Nome do cluster criado"
  value       = google_container_cluster.cluster.name
}

output "comando_kubectl" {
  description = "Comando para configurar o kubectl após criar o cluster"
  value       = "gcloud container clusters get-credentials pedidos-veloz-cluster --region ${var.region} --project ${var.project_id}"
}