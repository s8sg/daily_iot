#!/bin/bash
echo "Buulding Skill"
faas-cli build -f stack.yml
echo "Deploying Skill"
faas-cli deploy -f stack.yml
