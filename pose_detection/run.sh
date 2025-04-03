#!/bin/bash

if [ "$1" == "" ]; then
    echo "Usage: ./direct_run.sh /path/to/animal_image.jpg"
    exit 1
fi

mkdir -p input output
cp "$1" input/

docker build --platform linux/arm64 -t mmpose-animal-m2 .

docker run --rm --platform linux/arm64 \
    -v "$(pwd)/input:/app/input" \
    -v "$(pwd)/output:/app/output" \
    -v "$(pwd)/animal_pose.py:/app/animal_pose.py" \
    mmpose-animal-m2 python3 /app/animal_pose.py
