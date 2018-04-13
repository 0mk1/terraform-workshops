terraform {
  required_version = "~> 0.10"

  backend "s3" {
    region = "us-east-1"
    bucket = "terraform-gifz"
    key = "terraform.tfstate"
    encrypt = true
  }
}

variable "region" {
  default = "us-east-1"
}

variable "app_name" {
  default = "gifz"
}

variable "your_email" {
  default = "TYPE your email"
}

provider "aws" {
  region = "${var.region}"
}

module "frontend" {
  source = "./frontend"
  app_name = "${var.app_name}"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "1.29.0"
  name = "${var.app_name}-vpc"
  cidr = "10.0.0.0/16"
  azs = ["${var.region}a", "${var.region}b"]
  public_subnets = ["10.0.11.0/24", "10.0.12.0/24"]
  private_subnets = []
  database_subnets = ["10.0.21.0/24", "10.0.22.0/24"]
  elasticache_subnets = ["10.0.31.0/24", "10.0.32.0/24"]
  create_database_subnet_group = false
  enable_nat_gateway = false
  enable_vpn_gateway = false
  enable_s3_endpoint = false
}

module "database" {
  source = "./database"
  app_name = "${var.app_name}"
  vpc_id = "${module.vpc.vpc_id}"
  subnet_ids = "${module.vpc.database_subnets}"
  username = "postgres"
  password = "postgres"
  az = "${var.region}a"
  ingress_allow_security_groups = [
    "${aws_security_group.django.id}",
    "${aws_security_group.celery.id}",
  ]
}

module "redis" {
  source = "./redis"
  app_name = "${var.app_name}"
  vpc_id = "${module.vpc.vpc_id}"
  subnet_ids = "${module.vpc.elasticache_subnets}"
  ingress_allow_security_groups = [
    "${aws_security_group.django.id}",
    "${aws_security_group.celery.id}"
  ]
}

module "cdn" {
  source = "./cdn"
  app_name = "${var.app_name}"
}

module "mail" {
  source = "./mail"
  app_name = "${var.app_name}"
  region = "${var.region}"
}

module "registry" {
  source = "./registry"
  name = "${var.app_name}-api"
}

resource "aws_ecs_cluster" "gifz" {
  name = "${var.app_name}"
}

module "ecs_task_role" {
  source = "./ecs_task_role"
  app_name = "${var.app_name}"
  s3_bucket_name = "${module.cdn.bucket_name}"
}

module "django_task_definition" {
  source = "./ecs_task_definition"
  name = "${var.app_name}-django"
  app_port = 8000
  command = "[\"uwsgi\", \"--ini=./uwsgi.ini\"]"
  region = "${var.region}"
  app_domain = "${module.frontend.domain}"
  execution_role_arn = "${module.ecs_task_role.arn}"
  db_endpoint = "${module.database.url}"
  redis_endpoint = "${module.redis.url}"
  image_url = "${module.registry.url}"
  mail_servername = "${module.mail.smtp_server_name}"
  mail_username = "${module.mail.smtp_username}"
  mail_password = "${module.mail.smtp_password}"
  cdn_endpoint = "${module.cdn.endpoint}"
  s3_bucket_name = "${module.cdn.bucket_name}"
  allowed_hosts = "${module.ecs_alb.domain}"
  default_from_email = "${var.your_email}"
}

resource "aws_security_group" "django" {
  name = "${var.app_name}-django-sg"
  vpc_id = "${module.vpc.vpc_id}"

  ingress {
    protocol = "TCP"
    from_port = 8000
    to_port = 8000
    security_groups = ["${module.ecs_alb.security_group_id}"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "django" {
  name = "${var.app_name}-django"
  cluster = "${aws_ecs_cluster.gifz.id}"
  launch_type = "FARGATE"
  task_definition = "${module.django_task_definition.arn}"
  desired_count = 1

  network_configuration {
    security_groups = ["${aws_security_group.django.id}"]
    subnets = ["${module.vpc.public_subnets}"]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = "${module.ecs_alb.target_group_arn}"
    container_name = "${var.app_name}-django"
    container_port = 8000
  }
}

module "celery_task_definition" {
  source = "./ecs_task_definition"
  name = "${var.app_name}-celery"
  app_port = 8000
  command = "[\"celery\"]"
  region = "${var.region}"
  app_domain = "${module.frontend.domain}"
  execution_role_arn = "${module.ecs_task_role.arn}"
  db_endpoint = "${module.database.url}"
  redis_endpoint = "${module.redis.url}"
  image_url = "${module.registry.url}"
  mail_servername = "${module.mail.smtp_server_name}"
  mail_username = "${module.mail.smtp_username}"
  mail_password = "${module.mail.smtp_password}"
  cdn_endpoint = "${module.cdn.endpoint}"
  s3_bucket_name = "${module.cdn.bucket_name}"
  default_from_email = "${var.your_email}"
}

resource "aws_security_group" "celery" {
  name = "${var.app_name}-celery-sg"
  vpc_id = "${module.vpc.vpc_id}"

  ingress {
    protocol = "TCP"
    from_port = 8000
    to_port = 8000
    security_groups = []
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "celery" {
  name = "${var.app_name}-celery"
  cluster = "${aws_ecs_cluster.gifz.id}"
  launch_type = "FARGATE"
  task_definition = "${module.celery_task_definition.arn}"
  desired_count = 1

  network_configuration {
    security_groups = ["${aws_security_group.django.id}"]
    subnets = ["${module.vpc.public_subnets}"]
    assign_public_ip = true
  }
}

module "ecs_alb" {
  source = "./ecs_alb"
  service_name = "${var.app_name}-django"
  vpc_id = "${module.vpc.vpc_id}"
  subnet_ids = "${module.vpc.public_subnets}"
  health_check_path = "/v1/"
}


output "frontend_domain" {
  value = "${module.frontend.domain}"
}
output "backend_domain" {
  value = "${module.ecs_alb.domain}"
}
