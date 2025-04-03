FROM python:3.10-slim

RUN apt-get update && apt-get install -y git build-essential gcc g++ libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev wget ffmpeg && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

WORKDIR /app

RUN pip3 install --no-cache-dir opencv-python
RUN pip3 install --no-cache-dir openmim
RUN pip3 install --no-cache-dir mmengine
RUN pip3 install --no-cache-dir -U mmcv==2.1.0
RUN pip3 install --no-cache-dir mmdet
RUN pip3 install --no-cache-dir mmpose

RUN mkdir -p /app/input /app/output

RUN mkdir -p /root/.cache/torch/hub/checkpoints/ && cd /root/.cache/torch/hub/checkpoints/ && wget -q https://download.openmmlab.com/mmpose/v1/projects/rtmposev1/rtmpose-m_simcc-ap10k_pt-aic-coco_210e-256x256-7a041aa1_20230206.pth
RUN mkdir -p /root/.cache/torch/hub/checkpoints/ && cd /root/.cache/torch/hub/checkpoints/ && wget -q https://download.openmmlab.com/mmdetection/v3.0/rtmdet/rtmdet_m_8xb32-300e_coco/rtmdet_m_8xb32-300e_coco_20220719_112220-229f527c.pth

RUN git clone -b main --depth 1 https://github.com/open-mmlab/mmpose.git /app/mmpose

CMD ["/bin/bash"]
