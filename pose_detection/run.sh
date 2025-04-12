#!/bin/bash

mkdir -p input output

if [ "$1" != "" ]; then
    cp "$1" input/
fi

docker build --platform linux/arm64 -t mmpose-animal-m2 .

docker run --rm --platform linux/arm64 \
    -v "$(pwd)/input:/app/input" \
    -v "$(pwd)/output:/app/output" \
    -v "$(pwd)/animal_pose.py:/app/animal_pose.py" \
    mmpose-animal-m2 python3 /app/animal_pose.py
