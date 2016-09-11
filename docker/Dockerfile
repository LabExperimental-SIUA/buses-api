FROM ubuntu:16.04

RUN \
	echo "v0.1" && \
	apt-get update && \
	apt-get -y dist-upgrade && \
	apt-get install -y build-essential libssl-dev curl git && \
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.7/install.sh | bash && \
	export NVM_DIR="/root/.nvm" && \
	[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
	nvm install v6.2.1 && \
	rm -rf ~/buses-api && \
	git clone --branch master https://github.com/LabExperimental-SIUA/buses-api.git ~/buses-api && \
	cd ~/buses-api && \
	npm install && \
	echo '#!/bin/bash' > server.sh && \
	echo '/root/.nvm/versions/node/v6.2.1/bin/node bootstrap.js' >> server.sh && \
	echo '/root/.nvm/versions/node/v6.2.1/bin/node node_modules/orientjs/bin/orientjs migrate -h $BUSES_ODB_HOST up' >> server.sh && \
	echo '/root/.nvm/versions/node/v6.2.1/bin/node bin/www' >> server.sh && \
	chmod +x server.sh

EXPOSE 80
WORKDIR /root/buses-api

CMD ["./server.sh"]
