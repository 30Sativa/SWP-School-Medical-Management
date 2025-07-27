# ========== BUILD STAGE ==========
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution and restore
COPY *.sln .
COPY School-Medical-Management.API/SchoolMedicalManagement.API.csproj ./School-Medical-Management.API/
COPY SchoolMedicalManagement.Models/SchoolMedicalManagement.Models.csproj ./SchoolMedicalManagement.Models/
COPY SchoolMedicalManagement.Repository/SchoolMedicalManagement.Repository.csproj ./SchoolMedicalManagement.Repository/
COPY SchoolMedicalManagement.Service/SchoolMedicalManagement.Service.csproj ./SchoolMedicalManagement.Service/

RUN dotnet restore

# Copy all source code
COPY . .

WORKDIR /app/School-Medical-Management.API
RUN dotnet publish -c Release -o out /p:TreatWarningsAsErrors=false /warnaserror:none

# ========== RUNTIME STAGE ==========
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/School-Medical-Management.API/out .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "SchoolMedicalManagement.API.dll"]
