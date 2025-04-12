import os
import numpy as np
import mmcv
from mmpose.utils import register_all_modules
from mmpose.apis import MMPoseInferencer
import json

input_dir = 'input'
output_dir = 'output'

def main():
    os.makedirs(output_dir, exist_ok=True)

    register_all_modules()
    inferencer = MMPoseInferencer('animal')

    input_files = [f for f in os.listdir(input_dir) 
                  if f.lower().endswith(('.png', '.jpg', '.jpeg', '.mp4'))]
    if not input_files:
        return

    for input_file in input_files:
        input_path = os.path.join(input_dir, input_file)
        if input_path.endswith(".mp4"):
            process_video(input_path, inferencer)
        else:
            process_image(input_path, inferencer)

    
def process_video(input_path, inferencer):
    video = mmcv.VideoReader(input_path)
    
    print(f"Found {len(video)} frames in vodeo")

    for frame_idx, frame in enumerate(video):
        result_generator = inferencer(frame, vis_out_dir=output_dir)
        result = next(result_generator)

        predictions = result["predictions"][0][0]
        keypoints = np.array(predictions["keypoints"])
        keypoint_scores = np.array(predictions["keypoint_scores"])
        print(f"<start>{json.dumps(keypoints.tolist())}<end>")

def process_image(input_path, inferencer):
    result_generator = inferencer(input_path, vis_out_dir=output_dir)
    result = next(result_generator)
    
    predictions = result["predictions"][0][0]
    keypoints = np.array(predictions["keypoints"])
    keypoint_scores = np.array(predictions["keypoint_scores"])


if __name__ == '__main__':
    main()
