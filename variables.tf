variable "application" {
  type = string
}
variable "aws_region" {
  type = string
}
variable "lambda_config" {
  type = list(object({
    function_name  = string
    directory_name = string
    zip_file_name  = string
    handler        = string
    runtime        = string
    timeout        = number
  }))
}
