module "lambda" {
  source = "./modules/lambda"

  application               = var.application
  lambda_config             = var.lambda_config
  lambda_execution_role_arn = data.aws_iam_role.lambda_exec_role.arn
}
