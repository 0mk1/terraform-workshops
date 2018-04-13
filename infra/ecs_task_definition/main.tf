variable "name" {}
variable "command" {}
variable "app_port" {}
variable "region" {}
variable "app_domain" {}
variable "db_endpoint" {}
variable "redis_endpoint" {}
variable "image_url" {}
variable "image_version" {
  default = "latest"
}
variable "mail_servername" {}
variable "mail_username" {}
variable "mail_password" {}
variable "s3_bucket_name" {}
variable "cdn_endpoint" {}
variable "default_from_email" {}
variable "execution_role_arn" {}
variable "allowed_hosts" {
  default = ""
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${var.name}"
  retention_in_days = 1
}

data "template_file" "this" {
  template = "${file("${path.module}/task_definition.json")}"

  vars {
    name = "${var.name}"
    command = "${var.command}"
    region = "${var.region}"
    app_domain = "${var.app_domain}"
    db_endpoint = "${var.db_endpoint}"
    redis_endpoint = "${var.redis_endpoint}"
    image_url = "${var.image_url}"
    image_version = "${var.image_version}"
    app_port = "${var.app_port}"
    allowed_hosts = "${var.allowed_hosts}"
    mail_servername = "${var.mail_servername}"
    mail_username = "${var.mail_username}"
    mail_password = "${var.mail_password}"
    s3_bucket_name = "${var.s3_bucket_name}"
    cdn_endpoint = "${var.cdn_endpoint}"
    default_from_email = "${var.default_from_email}"
  }
}

resource "aws_ecs_task_definition" "this" {
  family = "${var.name}"
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu = "512"
  memory = "1024"
  execution_role_arn = "${var.execution_role_arn}"
  task_role_arn = "${var.execution_role_arn}"
  container_definitions = "${data.template_file.this.rendered}"
}


output "arn" {
  value = "${aws_ecs_task_definition.this.arn}"
}
