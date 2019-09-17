# Install Docker
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y docker-ce docker-ce-cli containerd.io

# You don't technically need this, it just tests the installation.
sudo docker run hello-world

# Install Node.js and NPM
# Technically we shouldn't need this with Docker installed. We can just make
# build images with Node in the image to run our apps.
# curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
# sudo apt-get install -y nodejs

# Install (and run) Faktory
sudo docker pull contribsys/faktory
sudo docker run --rm -v faktory-data:/var/lib/faktory -e "FAKTORY_PASSWORD=some_password" -p 127.0.0.1:7419:7419 -p 7420:7420 contribsys/faktory:latest /faktory -b :7419 -w :7420 -e production &
