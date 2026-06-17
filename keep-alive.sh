#!/bin/bash
# Self-restarting dev server keeper
exec 1>>/home/z/my-project/watchdog.log 2>&1
cd /home/z/my-project
while true; do
  pkill -9 -f "next-server" 2>/dev/null
  pkill -9 -f "next dev" 2>/dev/null
  sleep 1
  echo "[$(date +%H:%M:%S)] Starting dev server..."
  bun run dev > /home/z/my-project/dev.log 2>&1 &
  for i in $(seq 1 40); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ 2>/dev/null)" = "200" ] && { echo "[$(date +%H:%M:%S)] Ready"; break; }
    sleep 1
  done
  # Keep checking every 5s; if dead, loop restarts
  while true; do
    sleep 5
    [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ 2>/dev/null)" = "200" ] || { echo "[$(date +%H:%M:%S)] Dead, restarting"; break; }
  done
done
