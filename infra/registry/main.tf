variable name {}

resource "aws_ecr_repository" "this" {
  name = "${var.name}"
}

output "url" {
  value = "${aws_ecr_repository.this.repository_url}"
}
