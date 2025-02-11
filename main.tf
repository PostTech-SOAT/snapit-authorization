module "lambda" {
  source = "./modules/lambda"

  application               = var.application
  lambda_config             = var.lambda_config
  lambda_execution_role_arn = data.aws_iam_role.lambda_exec_role.arn

  cognito_user_pool_id        = data.aws_cognito_user_pools.this.ids[0]
  cognito_user_pool_client_id = data.aws_cognito_user_pool_clients.this.client_ids[0]
}
