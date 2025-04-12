import argparse
import subprocess
import re
import json
import numpy as np
import cv2

def main():

    parser = argparse.ArgumentParser(description="Check if prc1 and prc2 are passed")
    parser.add_argument("--read", action="store_true", help="Read poses coordinates and store it into coordinates.out")
    parser.add_argument("--view", action="store_true", help="Render coordinates from coordinates.out using cv2")

    args = parser.parse_args()
    if args.read:
        analyze_video()
    if args.view:
        coordinates = render_coordinates()
        draw_poses(coordinates)


def analyze_video():
    process = subprocess.Popen(["./run.sh"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    with open("coordinates.out", "w") as file:
        for line in process.stdout:
            match = re.search(r"<start>(.*?)<end>", line)
            if match:
                file.write(match.group(1) + "\n")

def render_coordinates():
    with open("coordinates.out", "r") as file:
        lines = file.readlines()
    coordinates = [np.array(json.loads(line)) for line in lines if line.strip()]
    
    return coordinates

def draw_poses(coordinates):
    pose_names = [
        "Left Eye", "Right Eye", "Nose", "Neck", "Root of Tail",
        "Left Shoulder", "Left Elbow", "Left Front Paw", "Right Shoulder",
        "Right Elbow", "Right Front Paw", "Left Hip", "Left Knee",
        "Left Back Paw", "Right Hip", "Right Knee", "Right Back Paw"
    ]
    connections = [
        (0, 2),   # Left Eye - Nose
        (1, 2),   # Right Eye - Nose
        (2, 3),   # Nose - Neck
        (3, 5),   # Neck - Left Shoulder
        (5, 6),   # Left Shoulder - Left Elbow
        (6, 7),   # Left Elbow - Left Front Paw
        (3, 8),   # Neck - Right Shoulder
        (8, 9),   # Right Shoulder - Right Elbow
        (9, 10),  # Right Elbow - Right Front Paw
        (3, 4),   # Neck - Root of Tail
        (5, 11),  # Left Shoulder - Left Hip
        (11, 12), # Left Hip - Left Knee
        (12, 13), # Left Knee - Left Back Paw
        (8, 14),  # Right Shoulder - Right Hip
        (14, 15), # Right Hip - Right Knee
        (15, 16)  # Right Knee - Right Back Paw
    ]
    canvas_height = 600
    canvas_width = 600
    
    # Calculate min and max values across all keypoints in all coordinates
    all_keypoints = np.vstack(coordinates)
    min_x, min_y = np.min(all_keypoints, axis=0)
    max_x, max_y = np.max(all_keypoints, axis=0)
    
    # Calculate scaling factor, use the smaller scale to fit everything
    scale_x = canvas_width / (max_x - min_x)
    scale_y = canvas_height / (max_y - min_y)
    scale = min(scale_x, scale_y)
    
    for keypoints in coordinates:
        # Create a blank canvas
        canvas = np.zeros((canvas_height, canvas_width, 3), dtype=np.uint8)
        # Shift and scale keypoints
        scaled_keypoints = (keypoints - np.array([min_x, min_y])) * scale
        
        # Draw lines connecting keypoints based on the connections list
        for connection in connections:
            start_idx, end_idx = connection
            start_point = tuple(map(int, scaled_keypoints[start_idx]))
            end_point = tuple(map(int, scaled_keypoints[end_idx]))
            cv2.line(canvas, start_point, end_point, color=(255, 0, 0), thickness=2)
        
        # Draw keypoints as circles
        for i, point in enumerate(scaled_keypoints):
            x, y = int(point[0]), int(point[1])
            cv2.circle(canvas, (x, y), radius=5, color=(0, 255, 0), thickness=-1)
            cv2.putText(canvas, str(i) + ":" + pose_names[i], (x + 5, y - 5), cv2.FONT_HERSHEY_SIMPLEX,
                      fontScale=0.4, color=(255, 255, 255), thickness=1)
    
        # Display the canvas in a popup window
        cv2.imshow("Pose Visualization", canvas)
        cv2.waitKey(100)


if __name__ == '__main__':
    main()
