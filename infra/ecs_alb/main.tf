variable "service_name" {}
variable "vpc_id" {}
variable "subnet_ids" {
  type = "list"
}
variable "health_check_path" {}


resource "aws_security_group" "this" {
  name = "${var.service_name}-alb-sg"
  vpc_id = "${var.vpc_id}"

  ingress {
    protocol = "tcp"
    from_port = 80
    to_port = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_alb" "this" {
  name            = "${var.service_name}-alb"
  subnets         = ["${var.subnet_ids}"]
  security_groups = ["${aws_security_group.this.id}"]
}

resource "aws_alb_target_group" "this" {
  name        = "${var.service_name}-alb-tg"
  vpc_id      = "${var.vpc_id}"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"

  health_check {
    path = "${var.health_check_path}"
    matcher = "200,400,401"
  }
}

resource "aws_alb_listener" "this" {
  load_balancer_arn = "${aws_alb.this.id}"
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.this.id}"
    type             = "forward"
  }
}


output "domain" {
  value = "${aws_alb.this.dns_name}"
}
output "security_group_id" {
  value = "${aws_security_group.this.id}"
}
output "target_group_arn" {
  value = "${aws_alb_target_group.this.arn}"
}
