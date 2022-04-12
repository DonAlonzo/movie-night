FROM node:14
COPY package.json package.json
RUN npm install
COPY craco.config.js craco.config.js
COPY public/ public/
COPY src/ src/
ARG mode=start
RUN if [ "$mode" != "watch" ]; then npm run build; fi
ENV mode=$mode
CMD npm run $mode
