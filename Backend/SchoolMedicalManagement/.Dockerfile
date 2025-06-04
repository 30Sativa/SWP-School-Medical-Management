# ========== BUILD STAGE ==========
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution and restore
COPY *.sln .
COPY School-Medical-Management.API/*.csproj ./School-Medical-Management.API/
COPY SchoolMedicalManagement.Models/*.csproj ./SchoolMedicalManagement.Models/
COPY SchoolMedicalManagement.Repository/*.csproj ./SchoolMedicalManagement.Repository/
COPY SchoolMedicalManagement.Service/*.csproj ./SchoolMedicalManagement.Service/

RUN dotnet restore

# Copy all source code
COPY . .

WORKDIR /app/School-Medical-Management.API
RUN dotnet publish -c Release -o out

# ========== RUNTIME STAGE ==========
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/School-Medical-Management.API/out .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "School-Medical-Management.API.dll"]
