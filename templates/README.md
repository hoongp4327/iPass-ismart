# Template chương trình iPASS 3–9

Template dựa trên trang iLEAD 1 do người dùng cung cấp. Giữ bố cục, kiểu chữ, thẻ chủ đề, lợi ích, đối tượng và CTA; nội dung lấy từ dữ liệu iPASS hiện có.

- `templates/course.html`: bố cục chung.
- `css/course-template.css`: giao diện và responsive.
- `data/ipass-courses.js`: nội dung riêng từng lớp.
- `scripts/build-courses.mjs`: sinh 7 trang HTML tĩnh, đọc được cả khi tắt JavaScript.

Sau khi chỉnh template hoặc dữ liệu, chạy từ thư mục dự án:

```sh
node scripts/build-courses.mjs
```

Xem tại `http://localhost:4173/chuong-trinh/ipass-3/` (thay 3 bằng 4–9).

## Banner để thay sau

Đã tạo và gắn 7 banner ngang từ flyer tương ứng tại `assets/courses/ipass-3-banner.png` đến `ipass-9-banner.png`. Ảnh thực tế 1672 × 941 px (gần 16:9); mobile dùng crop 4:3 từ cùng ảnh, tập trung về bên phải. Kích thước dưới đây là khuyến nghị cho lần xuất ảnh lớn hơn sau này.

| Phiên bản | Kích thước đề xuất | Tỉ lệ |
| --- | --- | --- |
| Desktop | 1920 × 1080 px | 16:9 |
| Mobile riêng, khuyến nghị | 1200 × 900 px | 4:3 |

Ảnh nguồn của iLEAD là 1672 × 941 px, gần 16:9. Template dùng ảnh desktop neo bên phải, cao theo hero khoảng 440–560 px; mép trái chuyển mờ vào nền. Ở mobile ≤600 px, ảnh hiển thị 4:3 phía trên nội dung; tablet hiển thị 16:10.

Thiết kế ảnh desktop với nhân vật/chủ thể chính ở nửa phải, bên trái thoáng và sáng. Chừa lề an toàn quanh mặt và chi tiết quan trọng. Không đưa tiêu đề, slogan hoặc nút bấm vào ảnh vì chúng là HTML riêng. Ảnh mobile nên bố cục lại chủ thể vào giữa. Nếu dùng một ảnh cho cả hai, mobile sẽ crop thiên về bên phải (`object-position: 80% 30%`).

Ưu tiên WebP, khoảng 200–400 KB cho desktop và dưới 250 KB cho mobile nếu chất lượng cho phép.

Khi có ảnh, đặt trong `assets/courses/`, thêm trường `banner` vào đúng khóa học trong `data/ipass-courses.js`:

```js
banner: {
  desktop: 'assets/courses/ipass-3-desktop.webp',
  mobile: 'assets/courses/ipass-3-mobile.webp',
  alt: 'Mô tả hình ảnh banner iPASS 3'
},
```

Chạy lại lệnh sinh trang. Khi chưa có `banner.desktop`, trang tự dùng banner mẫu. Trường `mobile` không bắt buộc.

Chỉ chạy local để duyệt; chỉ deploy GitHub khi người dùng yêu cầu rõ ràng.


## Banner đã tối ưu

Trang hiện dùng các bản WebP responsive trong `assets/courses/`, không tải PNG gốc. Desktop: 1000px hoặc 1672px chiều rộng; mobile: 800px hoặc 1200px chiều rộng, crop 4:3. Dữ liệu banner có thêm `desktopSmall` và `mobileSmall` để trình duyệt tự chọn theo mật độ điểm ảnh. PNG được giữ làm nguồn chỉnh sửa. Xem `assets/courses/README.md` để biết dung lượng và cách tạo lại.
