#!/bin/bash
echo "Getting Template"
faas-cli template pull https://github.com/alexellis/node8-express-template
echo "Buulding Skill"
faas-cli build -f stack.yml
echo "Deploying Skill"
faas-cli deploy -f stack.yml
