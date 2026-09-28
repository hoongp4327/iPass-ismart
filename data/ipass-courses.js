/* =========================================================
   DỮ LIỆU KHOÁ HỌC iPASS — dùng cho section 04 "Lộ trình học tập"

   Toàn bộ nội dung 7 khoá (lớp 3–9) nằm ở đây, markup trong
   index.html chỉ là khung rỗng — js/section4.js đọc file này rồi
   dựng ra. Sửa nội dung khoá học thì sửa ở ĐÂY, không sửa HTML.

   Dự án không có build step nên file gán thẳng vào window thay vì
   export module (xem CLAUDE.md).

   Trường "icon" của chủ đề đang để emoji làm tạm; khi có bộ icon
   ảnh thì thay chuỗi emoji bằng đường dẫn ảnh và chỉnh chỗ dựng
   icon trong js/section4.js.
   ========================================================= */

window.IPASS_COURSES = {

  /* dùng chung cho mọi khoá */
  common: {
    /* tên khoá = "iPASS {n}" + hậu tố này */
    titleSuffix: ' – Tiếng Anh nâng điểm số',
    tagline: 'Bám sát chương trình học – vững kiến thức – tự tin tiến bộ',
    cta: 'Đăng ký đánh giá đầu vào miễn phí',

    /* nhãn 3 khối nội dung — mỗi khối một màu pill như bộ flyer */
    blocks: {
      topics:   { label: 'Con sẽ học gì?',      tone: 'topics'   },
      benefits: { label: 'Con nhận được gì?',   tone: 'benefits' },
      fit:      { label: 'Phù hợp với',         tone: 'fit'      }
    },

    /* 4 lợi ích luôn theo đúng thứ tự này, màu icon cố định như flyer:
       xanh lá (từ vựng) · cam (nghe–nói) · tím (ngữ pháp) · hồng đỏ (kết quả) */
    benefitTones: ['green', 'orange', 'purple', 'pink']
  },

  levels: [
    {
      id: 'tieu-hoc',
      name: 'Tiểu học',
      grades: 'Lớp 3–5',
      target: 'A1+',
      courses: [
        {
          grade: 3,
          banner: { desktop: 'assets/courses/ipass-3-banner.webp', desktopSmall: 'assets/courses/ipass-3-banner-1000.webp', mobile: 'assets/courses/ipass-3-banner-mobile.webp', mobileSmall: 'assets/courses/ipass-3-banner-mobile-800.webp', alt: 'Học sinh iPASS 3 tự tin với sách và ba lô trong khuôn viên trường' },
          title: 'iPASS 3',
          slogan: 'Học vui, hiểu chắc – giúp con dùng tiếng Anh tự tin hơn mỗi ngày',
          topics: [
            { icon: '👫', text: 'Bản thân & bạn bè' },
            { icon: '🏠', text: 'Gia đình & ngôi nhà' },
            { icon: '🎒', text: 'Trường học & đồ dùng học tập' },
            { icon: '⚽', text: 'Sở thích & hoạt động vui chơi' },
            { icon: '👮', text: 'Nghề nghiệp quen thuộc' },
            { icon: '🐘', text: 'Động vật & thế giới xung quanh' }
          ],
          benefits: [
            'Mở rộng từ vựng và cấu trúc theo chủ đề gần gũi',
            'Phản xạ nghe – nói tốt hơn qua hoạt động tương tác',
            'Củng cố ngữ pháp, đọc hiểu và dạng bài thường gặp',
            'Tạo nền tảng tốt để cải thiện điểm số và học chắc hơn'
          ],
          fit: 'Học sinh lớp 3 cần củng cố nền tảng và phát triển khả năng sử dụng tiếng Anh bám sát chương trình trên lớp.'
        },
        {
          grade: 4,
          banner: { desktop: 'assets/courses/ipass-4-banner.webp', desktopSmall: 'assets/courses/ipass-4-banner-1000.webp', mobile: 'assets/courses/ipass-4-banner-mobile.webp', mobileSmall: 'assets/courses/ipass-4-banner-mobile-800.webp', alt: 'Học sinh iPASS 4 tự tin với sách và ba lô trong khuôn viên trường' },
          title: 'iPASS 4',
          slogan: 'Tăng tốc vừa đủ – để con hiểu bài, dùng được và tiến bộ bền vững',
          topics: [
            { icon: '👫', text: 'Bạn bè & bản thân' },
            { icon: '⏰', text: 'Thời gian & sinh hoạt hằng ngày' },
            { icon: '📚', text: 'Trường học & môn học' },
            { icon: '👨‍👩‍👧‍👦', text: 'Gia đình & cuộc sống cuối tuần' },
            { icon: '🏙️', text: 'Thành phố & mua sắm' },
            { icon: '🦒', text: 'Thời tiết, kỳ nghỉ & thế giới động vật' }
          ],
          benefits: [
            'Học chắc từ vựng và mẫu câu bám sát nội dung trên lớp',
            'Nghe – nói linh hoạt hơn trong các tình huống quen thuộc',
            'Củng cố ngữ pháp, đọc hiểu và bài tập có chữa',
            'Tăng sự tự tin để học tốt hơn và nâng điểm số'
          ],
          fit: 'Học sinh lớp 4 cần củng cố kiến thức, phát triển 4 kỹ năng và theo kịp chương trình tiếng Anh ở trường.'
        },
        {
          grade: 5,
          banner: { desktop: 'assets/courses/ipass-5-banner.webp', desktopSmall: 'assets/courses/ipass-5-banner-1000.webp', mobile: 'assets/courses/ipass-5-banner-mobile.webp', mobileSmall: 'assets/courses/ipass-5-banner-mobile-800.webp', alt: 'Học sinh iPASS 5 tự tin với sách và ba lô trong khuôn viên trường' },
          title: 'iPASS 5',
          slogan: 'Sẵn sàng bứt phá – giúp con vững tiếng Anh và tự tin bước tiếp',
          topics: [
            { icon: '🌏', text: 'Bản thân & kết nối bạn bè quốc tế' },
            { icon: '🏠', text: 'Gia đình & ngôi nhà' },
            { icon: '🏫', text: 'Trường học & hoạt động học tập' },
            { icon: '🎨', text: 'Sở thích & hoạt động ngoài trời' },
            { icon: '❤️', text: 'Sức khỏe & lối sống' },
            { icon: '✈️', text: 'Lễ hội, du lịch & định hướng tương lai' }
          ],
          benefits: [
            'Mở rộng vốn từ và cấu trúc ở mức học cao hơn',
            'Nghe – nói tự tin hơn trong nhiều chủ đề thực tế',
            'Củng cố ngữ pháp, đọc hiểu và kỹ năng làm bài',
            'Tạo đà để cải thiện điểm số và chuẩn bị tốt cho bậc học tiếp theo'
          ],
          fit: 'Học sinh lớp 5 cần học chắc tiếng Anh trước khi chuyển tiếp lên THCS.'
        }
      ]
    },
    {
      id: 'thcs',
      name: 'Trung học cơ sở',
      grades: 'Lớp 6–9',
      target: 'A2+',
      courses: [
        {
          grade: 6,
          banner: { desktop: 'assets/courses/ipass-6-banner.webp', desktopSmall: 'assets/courses/ipass-6-banner-1000.webp', mobile: 'assets/courses/ipass-6-banner-mobile.webp', mobileSmall: 'assets/courses/ipass-6-banner-mobile-800.webp', alt: 'Học sinh iPASS 6 tự tin với sách và ba lô trong khuôn viên trường' },
          title: 'iPASS 6',
          slogan: 'Khởi động THCS vững vàng – để con học chắc, hiểu sâu và tự tin hơn',
          topics: [
            { icon: '🧑‍🎓', text: 'Trường học & bạn bè' },
            { icon: '🏘️', text: 'Nhà ở & khu phố' },
            { icon: '🏮', text: 'Lễ hội & văn hóa Việt Nam' },
            { icon: '🏀', text: 'Thể thao & giải trí' },
            { icon: '🗼', text: 'Thành phố & thế giới' },
            { icon: '🌳', text: 'Thiên nhiên, môi trường & công nghệ' }
          ],
          benefits: [
            'Củng cố từ vựng và cấu trúc bám sát chương trình THCS',
            'Nghe – nói tự tin hơn qua các chủ đề thực tế',
            'Học chắc ngữ pháp, đọc hiểu và dạng bài kiểm tra có chữa',
            'Nâng kết quả học tập và tạo nền tảng cho các lớp cao hơn'
          ],
          fit: 'Học sinh lớp 6 cần làm quen nhịp học THCS và nâng dần năng lực tiếng Anh trên lớp.'
        },
        {
          grade: 7,
          banner: { desktop: 'assets/courses/ipass-7-banner.webp', desktopSmall: 'assets/courses/ipass-7-banner-1000.webp', mobile: 'assets/courses/ipass-7-banner-mobile.webp', mobileSmall: 'assets/courses/ipass-7-banner-mobile-800.webp', alt: 'Học sinh iPASS 7 tự tin với sách và ba lô trong khuôn viên trường' },
          title: 'iPASS 7',
          slogan: 'Bứt phá đúng lúc – để con vững kiến thức và tiến bộ rõ ràng qua từng bài học',
          topics: [
            { icon: '🎮', text: 'Sở thích & phong cách sống' },
            { icon: '🍎', text: 'Sức khỏe & ẩm thực' },
            { icon: '🤝', text: 'Cộng đồng & hoạt động xã hội' },
            { icon: '🎬', text: 'Âm nhạc, nghệ thuật & điện ảnh' },
            { icon: '🧳', text: 'Giao thông & du lịch' },
            { icon: '🌍', text: 'Văn hóa thế giới, năng lượng xanh & các quốc gia nói tiếng Anh' }
          ],
          benefits: [
            'Mở rộng vốn từ và ý tưởng theo các chủ đề tuổi teen',
            'Tự tin hơn với nghe – nói – đọc – viết bám sát chương trình',
            'Củng cố ngữ pháp, đọc hiểu và dạng bài đánh giá có chữa',
            'Cải thiện kết quả học tập và chuẩn bị tốt cho các lớp trên'
          ],
          fit: 'Học sinh lớp 7 cần học chắc kiến thức, tăng phản xạ tiếng Anh và nâng dần kết quả trên lớp.'
        },
        {
          grade: 8,
          banner: { desktop: 'assets/courses/ipass-8-banner.webp', desktopSmall: 'assets/courses/ipass-8-banner-1000.webp', mobile: 'assets/courses/ipass-8-banner-mobile.webp', mobileSmall: 'assets/courses/ipass-8-banner-mobile-800.webp', alt: 'Học sinh iPASS 8 tự tin với sách và ba lô trong khuôn viên trường' },
          title: 'iPASS 8',
          slogan: 'Vững kiến thức hôm nay – sẵn sàng bứt phá ở chặng học quan trọng phía trước',
          topics: [
            { icon: '🎧', text: 'Đời sống tuổi teen & giải trí' },
            { icon: '🌾', text: 'Cuộc sống nông thôn & phong cách sống' },
            { icon: '🇻🇳', text: 'Văn hóa, dân tộc & truyền thống Việt Nam' },
            { icon: '🛍️', text: 'Mua sắm & đời sống hiện đại' },
            { icon: '🌦️', text: 'Môi trường & thiên tai' },
            { icon: '🤖', text: 'Giao tiếp tương lai, khoa học & công nghệ' }
          ],
          benefits: [
            'Mở rộng vốn từ và kiến thức theo chủ đề gần với lứa tuổi',
            'Tăng tự tin giao tiếp và diễn đạt ý tưởng bằng tiếng Anh',
            'Củng cố ngữ pháp, đọc hiểu và kỹ năng làm bài có chữa',
            'Nâng kết quả học tập và tạo nền vững chắc cho lớp 9'
          ],
          fit: 'Học sinh lớp 8 cần học chắc tiếng Anh, nâng điểm số và chuẩn bị nền tảng tốt cho năm học then chốt tiếp theo.'
        },
        {
          grade: 9,
          banner: { desktop: 'assets/courses/ipass-9-banner.webp', desktopSmall: 'assets/courses/ipass-9-banner-1000.webp', mobile: 'assets/courses/ipass-9-banner-mobile.webp', mobileSmall: 'assets/courses/ipass-9-banner-mobile-800.webp', alt: 'Học sinh iPASS 9 tự tin với sách và ba lô trong khuôn viên trường' },
          title: 'iPASS 9',
          slogan: 'Vững vàng chặng cuối – để con tự tin bứt phá và sẵn sàng vào lớp 10',
          topics: [
            { icon: '🏙️', text: 'Cộng đồng & cuộc sống đô thị' },
            { icon: '💪', text: 'Sức khỏe tuổi teen & phát triển bản thân' },
            { icon: '🇻🇳', text: 'Văn hóa & lối sống Việt Nam' },
            { icon: '🌏', text: 'Thiên nhiên, du lịch & thế giới' },
            { icon: '💬', text: 'Tiếng Anh toàn cầu' },
            { icon: '💻', text: 'Công nghệ số & định hướng nghề nghiệp' }
          ],
          benefits: [
            'Mở rộng từ vựng và cấu trúc bám sát chương trình lớp 9',
            'Tăng tự tin nghe – nói – đọc – viết trong các chủ đề thực tế',
            'Củng cố ngữ pháp, đọc hiểu và kỹ năng làm bài có chữa',
            'Tạo nền tảng tốt cho ôn tập, thi chuyển cấp và các bậc học tiếp theo'
          ],
          fit: 'Học sinh lớp 9 cần củng cố chắc kiến thức tiếng Anh, nâng kết quả học tập và chuẩn bị tốt cho giai đoạn chuyển cấp quan trọng.'
        }
      ]
    }
  ]
};
