# Multi-stage Dockerfile for arvore-api
# Build stage: use Maven with Java to produce the jar
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only what we need to leverage build cache where possible
COPY pom.xml ./
COPY mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw

# Copy the rest of the source and package
COPY src ./src
RUN ./mvnw -B -e -DskipTests package

# Run stage: minimal JRE image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from build stage. Assumes single artifact in target/
COPY --from=build /workspace/target/*.jar /app/app.jar

ENV JAVA_HOME=/opt/java/openjdk
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
