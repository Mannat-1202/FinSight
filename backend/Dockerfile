FROM maven:3.9.9-eclipse-temurin-21-alpine

WORKDIR /app

# Copy pom first to cache dependency layer
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

# Copy source and build
COPY src/ src/
RUN mvn clean package -DskipTests -B -q

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
