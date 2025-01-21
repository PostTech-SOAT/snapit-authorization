remote_state {
    backend = "s3"
    generate = {
        path      = "backend.tf"
        if_exists = "overwrite"
    }
    config = {
        bucket         = "snapit-tfstate"
        key            = "lambdas/authorization/snapit-authorization.tfstate"
        region         = "us-east-1"
    }
}

terraform {
  source = "../"

  extra_arguments "conditional_vars" {
    commands = [
      "apply",
      "plan",
      "destroy",
      "import",
      "push",
      "refresh",
      "import"
    ]

    required_var_files = [
      "./tfvars/deploy.tfvars"
    ]
  }
}