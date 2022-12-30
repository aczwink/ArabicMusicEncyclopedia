FROM node:18

RUN apt update

WORKDIR /srv/ame-install
ADD installation .
RUN ./install_lilypond.sh
RUN ./install_script_dependencies.sh
WORKDIR ..
RUN rm -rf ame-install

WORKDIR /srv/ame-backend
COPY dist/bundle.js dist/
COPY dist/openapi.json dist/
COPY dist/openapi-structure.json dist/
ADD scripts scripts
COPY package.json ./

ENV SCRIPTDIR=../scripts

WORKDIR dist
CMD [ "node", "bundle.js" ]

EXPOSE 8080