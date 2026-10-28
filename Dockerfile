# Multi-stage Dockerfile for CollegeSync Fee Management System (FMS)

# Stage 1: Build JAR using Maven & Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy pom.xml and source code
COPY fms-java-backend/pom.xml .
COPY fms-java-backend/src ./src

# Package application into executable JAR (skipping unit tests for fast build)
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy built JAR from builder stage
COPY --from=builder /build/target/fms-backend-*.jar app.jar

# Cloud providers (Render, Railway, Heroku) inject PORT dynamically
ENV PORT=8080
EXPOSE 8080

# Execute with dynamic port expansion
CMD ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
