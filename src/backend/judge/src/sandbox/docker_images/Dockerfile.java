FROM eclipse-temurin:21-jdk

# Code submitted by users must never run as root.
RUN useradd --create-home --uid 1000 --shell /usr/sbin/nologin runner

WORKDIR /workspace
USER runner

# Compilation and execution commands are supplied by the Judge service.
# Example:
#   javac /workspace/Main.java
#   java -cp /workspace Main
