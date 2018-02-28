FROM node:8-alpine

# Set image metadata
LABEL version="1.0"
LABEL description="This is the containerized TTN Enschede Ingest service. \
More details at https://github.com/TTNEnschede/ttne-data-platform-ingest"

# Create working directory
RUN mkdir -p /usr/src/ttne-ingest
WORKDIR /usr/src/ttne-ingest

# Copy all files in our root to the working directory in the container
COPY . ./

# Run build if necessary with devDependencies then clean them up
RUN npm i --production

# Environment variables
ENV INGEST_DB_URI="mongodb://localhost:27017/ttne_data"
ENV INGEST_SERVICE_PORT=3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
