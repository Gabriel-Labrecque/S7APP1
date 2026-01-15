# Validation

## 1. Certificats

```bash
# Affiche CA
openssl x509 -in cert/ca.crt -text -noout

# Affiche certificat serveur
openssl x509 -in cert/server.crt -text -noout

# Affiche certificat client
openssl x509 -in cert/client.crt -text -noout

# Vérifie que CA a signé les certificats (chaîne de confiance)
openssl verify -CAfile cert/ca.crt cert/server.crt cert/client.crt
```

## 2. mTLS

```bash
# Démarre les 3 conteneurs (DNS, serveur, client)
docker-compose up -d

# Exécute le client qui envoie certificat + credentials
docker exec node_client node /app/client.js

# Affiche logs serveur (CN certificat, cipher, TLS version)
docker logs node_server
```

## 3. Authentification Utilisateur

```bash

# Affiche les mots de passe hachés (PBKDF2 + salt)
cat src/serveur/users.json
```

## 4. Sécurité Réseau

```bash
# Capture tout le trafic sur port 443 dans un fichier
sudo tcpdump -i any port 443 -w capture.pcap

# Fait une requête pendant la capture
docker exec node_client node /app/client.js
# Ctrl+C pour arrêter

# Ouvrir Wireshark pour analyse visuelle
wireshark capture.pcap

# Filtres: ssl.handshake.ciphersuite, ssl.handshake.certificate

# Affiche ce qui a été capturé (devrait être vide = chiffré)
strings capture.pcap
```

## 5. DNSSEC

```bash
# Liste les 4 fichiers de clés DNSSEC (2 publiques, 2 privées)
ls dns/*.key dns/*.private

# Vérifie que la zone est signée
ls dns/db.gei761.com.signed

# Interroge DNS pour serveur-app avec validation DNSSEC (retourne IP + signature)
dig @localhost -p 5454 serveur-app.gei761.com +dnssec

# Interroge DNS pour voir les clés publiques (ZSK flag 256, KSK flag 257)
dig @localhost -p 5454 gei761.com DNSKEY +dnssec

# Compte le nombre de signatures dans la zone (chaque record signé)
grep -c RRSIG dns/db.gei761.com.signed
```

