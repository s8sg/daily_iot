
# Install docker
#echo "Installing Docker"
#curl -sSL https://get.docker.com | sh

# Add current user to docker group
#sudo usermod $USER -aG docker

# Init swarm cluster
echo "Initializing swarm master node"
docker swarm init
docker node ls

# install git
sudo apt-get install -y git

# Clone the faas repo
echo "Initializing code repo"
mkdir code
cd code

# Get openfaas
echo "Get openfaas"
git clone https://github.com/alexellis/faas/
cd faas
./deploy_stack.armhf.sh
