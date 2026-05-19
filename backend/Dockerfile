# ── Stage 1: Build / Dev ─────────────────────────────────────────────────────
# Layout inside the container:
#   /workspace/                   ← WORKDIR
#   /workspace/Directory.Build.props
#   /workspace/Directory.Packages.props
#   /workspace/src/               ← source code (bind-mounted in dev)
#
# Keeping props one level above src/ means the dev bind mount
# (./backend/src:/workspace/src) cannot overwrite them.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

ARG BUILD_CONFIGURATION=Release
WORKDIR /workspace

# Copy central build props first (layer cache: only invalidates when props change)
COPY ["Directory.Build.props", "Directory.Build.props"]
COPY ["Directory.Packages.props", "Directory.Packages.props"]

# Copy project files individually for optimal restore caching
COPY ["src/HousingApp.Domain/HousingApp.Domain.csproj", "src/HousingApp.Domain/"]
COPY ["src/HousingApp.Application/HousingApp.Application.csproj", "src/HousingApp.Application/"]
COPY ["src/HousingApp.Infrastructure/HousingApp.Infrastructure.csproj", "src/HousingApp.Infrastructure/"]
COPY ["src/HousingApp.Api/HousingApp.Api.csproj", "src/HousingApp.Api/"]

RUN dotnet restore "src/HousingApp.Api/HousingApp.Api.csproj"

# Copy full source after restore so code changes don't break restore cache
COPY src ./src

RUN dotnet publish "src/HousingApp.Api/HousingApp.Api.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    --no-restore

# Default command for the dev stage (target: build in docker-compose.override.yml).
# The bind mount overlays /workspace/src with live code — props files are safe.
CMD ["dotnet", "run", "--project", "src/HousingApp.Api/HousingApp.Api.csproj", "--no-launch-profile"]

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app

# RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
# USER appuser

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "HousingApp.Api.dll"]
