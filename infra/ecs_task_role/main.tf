variable "app_name" {}
variable "s3_bucket_name" {}


resource "aws_iam_role" "this" {
  name = "${var.app_name}ECSTaskRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "ecs_task_assume" {
  name = "${var.app_name}ECSTaskRolePolicy"
  role = "${aws_iam_role.this.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
              "arn:aws:s3:::${var.s3_bucket_name}",
              "arn:aws:s3:::${var.s3_bucket_name}/*"
            ]
        }
    ]
}
EOF
}


output "arn" {
  value = "${aws_iam_role.this.arn}"
}
