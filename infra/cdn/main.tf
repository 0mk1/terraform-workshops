variable "app_name" {}


resource "aws_s3_bucket" "this" {
  bucket = "${var.app_name}-static"
  acl    = "private"
}

data "aws_iam_policy_document" "this" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.this.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.this.iam_arn}"]
    }
  }
  statement {
    actions = ["s3:ListBucket"]
    resources = ["${aws_s3_bucket.this.arn}"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.this.iam_arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "this" {
  bucket = "${aws_s3_bucket.this.id}"
  policy = "${data.aws_iam_policy_document.this.json}"
}

resource "aws_cloudfront_origin_access_identity" "this" {}

resource "aws_cloudfront_distribution" "this" {
  origin {
    domain_name = "${aws_s3_bucket.this.bucket_domain_name}"
    origin_id = "${aws_s3_bucket.this.id}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path}"
    }
  }

  enabled = true
  is_ipv6_enabled = true

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.this.id}"
    compress = true

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    default_ttl = 3600
    max_ttl = 86400
  }

  # Distributes content to US and Europe, 200 is for whole world
  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
        restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}


output "endpoint" {
  value = "${aws_cloudfront_distribution.this.domain_name}"
}
output "bucket_name" {
  value = "${aws_s3_bucket.this.id}"
}
