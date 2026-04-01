FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Directory.Build.props", "Directory.Build.props"]
COPY ["src/Directory.Packages.props", "Directory.Packages.props"]

COPY ["src/HousingApp.Domain/HousingApp.Domain.csproj", "HousingApp.Domain/"]
COPY ["src/HousingApp.Application/HousingApp.Application.csproj", "HousingApp.Application/"]
COPY ["src/HousingApp.Infrastructure/HousingApp.Infrastructure.csproj", "HousingApp.Infrastructure/"]
COPY ["src/HousingApp.Api/HousingApp.Api.csproj", "HousingApp.Api/"]

RUN dotnet restore "HousingApp.Api/HousingApp.Api.csproj"

COPY src .

RUN dotnet publish "HousingApp.Api/HousingApp.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HousingApp.Api.dll"]
 