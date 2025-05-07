#Stage 1
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder

WORKDIR /app

COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

#Stage 2
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

COPY --from=builder /app/out .

EXPOSE 5000

ENTRYPOINT ["dotnet", "ToDo.dll"]