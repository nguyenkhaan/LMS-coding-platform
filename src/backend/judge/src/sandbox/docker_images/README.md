# Judge sandbox images

Build the images from this directory:

```bash
docker build -f ./src/sandbox/docker_images/Dockerfile.python -t judge-python:latest .
docker build -f ./src/sandbox/docker_images/Dockerfile.cpp -t judge-cpp:latest .
docker build -f ./src/sandbox/docker_images/Dockerfile.java -t judge-java:latest .
```

The images intentionally do not define an entrypoint. The Judge service supplies
the compile/run command for each submission.

Runtime isolation must also be applied when starting a container:

```bash
docker run --rm \
  --network none \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --memory=128m \
  --cpus=0.5 \
  --pids-limit=64 \
  --cap-drop=ALL \
  --security-opt=no-new-privileges \
  --user 1000:1000 \
  judge-python:latest \
  python /workspace/main.py
```

The container should receive only the submission workspace. Never mount the
host Docker socket or sensitive host directories into a submission container.
