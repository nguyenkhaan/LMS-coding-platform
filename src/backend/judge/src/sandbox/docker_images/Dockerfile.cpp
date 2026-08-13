FROM gcc:14-bookworm

# Code submitted by users must never run as root.
RUN useradd --create-home --uid 1000 --shell /usr/sbin/nologin runner

WORKDIR /workspace
USER runner

# Compilation and execution commands are supplied by the Judge service.
# Example compile command:
#   g++ -std=c++17 -O2 -pipe /workspace/main.cpp -o /tmp/program
