FROM node:16
COPY package.json package.json
RUN npm install
COPY src src/
ARG mode=start
ENV mode=$mode
CMD npm run $mode