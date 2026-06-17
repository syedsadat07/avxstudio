#!/bin/bash
cd /home/z/my-project
while true; do
  # Kill any stale instances
  pkill -9 -f "next-server" 2>/dev/null
  pkill -9 -f "next dev" 2>/dev/null
  pkill -9 -f "bun run dev" 2>/dev/null
  sleep 2
  echo "[$(date +%H:%M:%S)] Launching dev server..."
  bun run dev > /home/z/my-project/dev.log 2>&1 &
  sleep 3
  # Wait for readiness
  for i in $(seq 1 40); do
    code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null)
    if [ "$code" = "200" ]; then
      echo "[$(date +%H:%M:%S)] Server ready"
      break
    fi
    sleep 1
  done
  # Monitor health — poll every 3s, restart if unhealthy
  while true; do
    sleep 3
    code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null)
    if [ "$code" != "200" ]; then
      echo "[$(date +%H:%M:%S)] Unhealthy (HTTP $code), restarting..."
      break
    fi
  done
done
