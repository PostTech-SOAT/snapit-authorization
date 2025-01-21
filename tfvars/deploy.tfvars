##############################################################################
#                      GENERAL                                               #
##############################################################################
application = "snapit"
aws_region  = "us-east-1"

##############################################################################
#                      LAMBDA                                                #
##############################################################################
lambda_config = [
  {
    function_name  = "ValidarTokenAuthorizer"
    directory_name = "get_function"
    zip_file_name  = "authorizer.zip"
    handler        = "authorizer.handler"
    runtime        = "nodejs20.x"
    timeout        = 30
    is_authorizer  = false
  }
]
