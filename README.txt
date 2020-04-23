#start/stop ven
source .env/bin/activate
source .env/bin/deactivate

#requirments.txt 
pip install -r requirements.txt

#hyunkai.ini execute
systemctl start[restart/status] hyunkai
or
# cd /var/www/hyunkai
# /var/www/hyunkai/.env/bin/uwsgi --ini hyunkai.ini

#IP deny command
iptables -A INPUT -s xxx.xxx.xxx.xxx -j DROP

