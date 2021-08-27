1. Giải nén thư mục tool trên VPS - Ubuntu >20.04
2. `cd` vào thư mục tool
3. Chạy `bash install.sh`
4. Cài MongoDB - `https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/`
5. Cài domain tool trong file `.env`
6. Sau khi cài xong chạy `bash init.sh` để start tool
7. Chạy `node push.js`. Đợi 5s rồi `Ctrl-C`
8. Bắt đầu upload

API:

/api/drive/{action}/{file_id}
- create: tạo file
- get: get thông tin file
- retry: retry nếu file lỗi
- delete: xoá file

/api/stat/{action}
- videos: số video đã xong, đang xử lí, đã hoàn thành
- done: list video đã hoàn thành (max 100 vid mới nhất)
- errors: toàn bộ video lỗi
- processing: toàn bộ video đang xử lí