.PHONY: start-db start-backend
start-db:
	cd ./backend && docker compose up -d
start-backend:
	cd ./backend && npm run dev
stop-db:
	cd ./backend && docker compose down
start-frontend:
	cd ./frontend && http-server --cors

run-backend: start-db start-backend
