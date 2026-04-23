# 3D Vision, Geometry & Pose

## Tổng quan

Với robotics, perception thường phải được grounding trong không gian 3D.

Điều đó có nghĩa computer vision không chỉ là recognition mà còn là khôi phục:

- geometry
- depth
- relative pose
- object pose
- occupancy của môi trường

Chủ đề này nằm ở ranh giới giữa CV, robotics, và estimation.

---

## Camera model

Các khái niệm quan trọng:

- pinhole projection
- focal length
- principal point
- distortion parameters
- intrinsics vs extrinsics

Nếu các giá trị này sai, mọi thứ downstream đều bị ảnh hưởng:

- depth
- triangulation
- pose estimation
- robot-frame alignment

Đó là lý do calibration không phải chuyện tùy chọn trong robotics nghiêm túc.

---

## Depth và multi-view geometry

Các nguồn depth thường gặp:

- stereo camera
- RGB-D camera
- lidar
- monocular depth estimation

Các khái niệm hữu ích:

- epipolar geometry
- disparity
- triangulation
- scale ambiguity trong monocular setup

Không phải mọi nguồn depth đều đáng tin như nhau. Trong thực tế, từng sensor có failure mode riêng:

- RGB-D gặp khó với vật phản chiếu hoặc quá xa
- stereo gặp khó ở vùng ít texture
- monocular depth phụ thuộc mạnh vào learned prior

---

## Point cloud và spatial representation

Khi dữ liệu đã lên 3D, các representation thường dùng gồm:

- point clouds
- voxel grids
- signed distance fields
- occupancy maps
- learned latent 3D features

Chúng hữu ích cho:

- obstacle reasoning
- scene reconstruction
- collision checking
- manipulation planning

Lựa chọn representation luôn là tradeoff giữa memory, fidelity, và compute.

---

## Pose estimation

Pose estimation cố gắng khôi phục:

- camera pose
- object pose
- pose của thực thể quan trọng tương đối với robot

Các công cụ thường gặp:

- keypoint detection
- PnP
- ICP cho alignment
- marker-based estimation
- learned pose estimator

Trong robotics, 6DoF pose estimation thường là chiếc cầu từ recognition sang action:

- grasp planning
- insertion task
- bin picking
- visual servoing

---

## Occupancy, mapping và ranh giới với SLAM

Computer vision có liên hệ với mapping, nhưng không thay thế SLAM hay state estimation.

CV đóng góp:

- depth cues
- landmarks
- semantic understanding
- object-level prior

Localization và SLAM bổ sung:

- state estimation theo thời gian
- xử lý uncertainty
- tính nhất quán của map
- pose graph hoặc filtering logic

Hãy dùng topic CV này cho phía visual và geometric. Dùng topic robotics perception/localization cho estimation stack rộng hơn.

---

## Failure modes về geometry

Các nguyên nhân lỗi thường gặp:

- intrinsics hoặc extrinsics sai
- sensor đồng bộ kém
- rolling shutter distortion
- occlusion một phần
- correspondence mơ hồ
- depth nhiễu ở vùng biên hoặc vật phản chiếu

Đó là lý do "detector tìm thấy object" không đồng nghĩa với "robot biết object ở đâu".

---

## Câu hỏi Phỏng vấn

### 1) Vì sao calibration quan trọng trong 3D vision?

Vì projection geometry phụ thuộc trực tiếp vào camera parameters. Sai số calibration nhỏ có thể tạo sai số lớn downstream cho depth, pose, và alignment với robot.

### 2) Khác nhau giữa detection và 6DoF pose là gì?

Detection localize object trong image space. 6DoF pose estimation khôi phục vị trí và hướng của nó trong không gian 3D, thứ mà manipulation thường cần.

### 3) Vì sao monocular depth có giới hạn trong robotics?

Vì scale bị mơ hồ và prediction phụ thuộc vào learned prior. Không có thêm cue, monocular depth có thể nhìn hợp lý nhưng lại không đáng tin về mặt vật lý.
