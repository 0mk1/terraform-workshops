variable "app_name" {}
variable "vpc_id" {}
variable "az" {}
variable "username" {}
variable "password" {}
variable "subnet_ids" {
  type = "list"
}
variable "ingress_allow_security_groups" {
  type = "list"
}


resource "aws_security_group" "this" {
  name        = "${var.app_name}-db-sg"
  vpc_id      = "${var.vpc_id}"

  ingress {
    from_port       = "5432"
    to_port         = "5432"
    protocol        = "TCP"
    security_groups = ["${var.ingress_allow_security_groups}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "1.15.0"
  identifier = "${var.app_name}"
  name = "${var.app_name}"
  engine = "postgres"
  engine_version = "9.6.6"
  family = "postgres9.6"
  parameters = []
  instance_class = "db.t2.micro"
  storage_type = "gp2"
  allocated_storage = 20
  storage_encrypted = false
  username = "${var.username}"
  password = "${var.password}"
  port = "5432"
  vpc_security_group_ids = ["${aws_security_group.this.id}"]
  availability_zone = "${var.az}"
  subnet_ids = ["${var.subnet_ids}"]
  multi_az = false
  publicly_accessible = false
  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window = "03:00-06:00"
  backup_retention_period = 0  # No backups
  skip_final_snapshot = true
  final_snapshot_identifier = "${var.app_name}"
  auto_minor_version_upgrade = true
  apply_immediately = true
}


output "url" {
  value = "postgres://${module.rds.this_db_instance_username}:${module.rds.this_db_instance_password}@${module.rds.this_db_instance_endpoint}/${module.rds.this_db_instance_name}"
}
