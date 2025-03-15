
# copy the certificates to right path:
cp ../client-cert.pem ./nginx/
cp ../client-key.pem ./nginx/
cp ../.env ./

# Run the container
docker build -t front ./
docker run -dit --name front --network host front