# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and compile the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Run the Application
# ==========================================
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy ONLY the compiled JAR from the 'build' stage above
COPY --from=build /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]