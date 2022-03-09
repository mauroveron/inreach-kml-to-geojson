.DEFAULT_GOAL:=help
.PHONY: help deploy sls info logs


AWS_PREFIX=

include .make-env


help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ serverless

deploy: ## Deploy serverless project
	${AWS_PREFIX} sls deploy

sls: ## Wrapper for running sls (handy if you're using aws-vault)
	${AWS_PREFIX} sls ${args}

info: ## Show project info
	${AWS_PREFIX} sls info

logs: ## Show logs for function
	${AWS_PREFIX} sls logs -t -f ${fn}

