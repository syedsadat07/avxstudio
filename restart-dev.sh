#!/bin/bash
# Called by cron to ensure dev server is running
cd /home/z/my-project
code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null)
if [ "$code" = "200" ]; then
  echo "[$(date)] Server already running" >> /home/z/my-project/cron-restart.log
  exit 0
fi
echo "[$(date)] Server down (HTTP $code), restarting..." >> /home/z/my-project/cron-restart.log
pkill -9 -f "next" 2>/dev/null
pkill -9 -f "bun run dev" 2>/dev/null
sleep 2
# Start with setsid to detach from this cron shell
setsid bash -c 'cd /home/z/my-project && bun run dev' </dev/null >/home/z/my-project/dev.log 2>&1 &
disown
# Wait briefly for readiness
for i in $(seq 1 20); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ 2>/dev/null)" = "200" ] && { echo "[$(date)] Restarted OK" >> /home/z/my-project/cron-restart.log; exit 0; }
  sleep 1
done
echo "[$(date)] Restart failed" >> /home/z/my-project/cron-restart.log
