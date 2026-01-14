$TTL 86400
@ IN SOA dns.gei761.com. admin.gei761.com. (
             2026011301 ; Serial
             3600       ; Refresh
             1800       ; Retry
             604800     ; Expire
             86400)      ; Negative TTL - Prevents denial of service attack

@ IN NS dns.gei761.com.
dns         IN A 172.25.0.2
serveur-app IN A 172.25.0.3

; Mail server resolver, which points to its A entry
@ IN  MX  10  serveur-app.wagei761.com.

$INCLUDE Kgei761.com.+008+06124.key
$INCLUDE Kgei761.com.+008+25252.key
