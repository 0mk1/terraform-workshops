variable "app_name" {}
variable "region" {}


resource "aws_iam_user" "this" {
  name = "${var.app_name}-send-email-user"
}

resource "aws_iam_access_key" "this" {
  user    = "${aws_iam_user.this.name}"
}

resource "aws_iam_user_policy" "this" {
  name = "SendRawEmailPolicy"
  user = "${aws_iam_user.this.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action":"ses:SendRawEmail",
      "Effect":"Allow",
      "Resource":"*"
    }
  ]
}
EOF
}


output "smtp_server_name" {
  value = "email-smtp.${var.region}.amazonaws.com"
}
output "smtp_username" {
  value = "${aws_iam_access_key.this.id}"
}
output "smtp_password" {
  value = "${aws_iam_access_key.this.ses_smtp_password}"
}
