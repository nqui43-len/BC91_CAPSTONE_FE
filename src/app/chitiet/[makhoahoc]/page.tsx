import React from 'react';

// Bất cứ ai vào link /chitiet/cai-gi-do đều sẽ thấy component này
export default function CourseDetail() {
  return (
    <div className="container mt-5 py-5 text-center" style={{ minHeight: '60vh' }}>
      <h1>Alo Alo! Đây là trang chi tiết khóa học.</h1>
      <p>Lát nữa mình sẽ gọi API lấy thông tin khóa học đổ vào đây nhé.</p>
    </div>
  );
}