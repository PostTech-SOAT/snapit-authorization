data "aws_iam_role" "lambda_exec_role" {
  name = "LabRole"
}

data "aws_cognito_user_pools" "this" {
  name = replace("${var.application}_user_pool", "-", "_")
}

data "aws_cognito_user_pool_clients" "this" {
  user_pool_id = data.aws_cognito_user_pools.this.ids[0]
}
