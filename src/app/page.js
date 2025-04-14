// app/page.js
import { redirect } from 'next/navigation';

export default function HomePage() {
  // เมื่อ component ถูกเรนเดอร์ จะทำการ redirect ไปยัง /api
  redirect('/api');
  return null; // ไม่ต้องแสดงผลอะไรเพิ่มเติม
}