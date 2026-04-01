.PHONY: dev backend frontend

DOTNET = dotnet
BACKEND_PROJECT = backend
FRONTEND_PROJECT = frontend

dev-db:
	docker compose up -d
	
backend:
	$(MAKE) -C $(BACKEND_PROJECT) run

frontend:
	cd $(FRONTEND_PROJECT) && npm run dev
	

