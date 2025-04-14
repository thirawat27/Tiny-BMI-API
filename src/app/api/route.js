// app/api/bmi/route.js
export async function GET(request) {
  // แยก query parameters จาก URL
  const { searchParams } = new URL(request.url);
  const weight = searchParams.get('weight');
  const height = searchParams.get('height');

  // ตรวจสอบว่ามีการส่ง weight และ height เข้ามาหรือไม่
  if (!weight || !height) {
    return new Response(
      JSON.stringify({
        error: "Missing query parameter: weight and height are required.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // แปลงค่าเป็นตัวเลข
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);

  // ตรวจสอบว่าค่าที่รับมาถูกต้องหรือไม่
  if (isNaN(weightNum) || isNaN(heightNum)) {
    return new Response(
      JSON.stringify({
        error: "Invalid query parameter: weight and height must be numbers.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // แปลงส่วนสูงเป็นเมตร (1 m = 100 cm) และคำนวณ BMI
  const heightInMeters = heightNum / 100;
  const bmi = weightNum / (heightInMeters ** 2);

  // ฟังก์ชันสำหรับหาระดับและคำอธิบายของ BMI
  function getBMICategory(bmiValue) {
    if (bmiValue < 18.5) {
      return {
        level: "น้ำหนักน้อย",
        description: "ค่าดัชนีมวลกายต่ำกว่าเกณฑ์มาตรฐาน ซึ่งอาจเกิดจากการรับประทานอาหารไม่เพียงพอหรือปัญหาสุขภาพบางอย่าง",
      };
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      return {
        level: "น้ำหนักปกติ",
        description: "ค่าดัชนีมวลกายอยู่ในเกณฑ์ที่เหมาะสม ชี้ให้เห็นว่ามีน้ำหนักที่สมดุลและสุขภาพที่ดี",
      };
    } else if (bmiValue >= 25 && bmiValue < 30) {
      return {
        level: "น้ำหนักน้ำหนักเกิน",
        description: "ค่าดัชนีมวลกายสูงกว่าเกณฑ์ปกติ อาจมีความเสี่ยงต่อโรคที่เกี่ยวกับน้ำหนักเกิน",
      };
    } else {
      return {
        level: "อ้วน หรือ น้ำหนักเกินมากไป",
        description: "ค่าดัชนีมวลกายสูงมาก ซึ่งเสี่ยงต่อโรคหัวใจ เบาหวาน และปัญหาสุขภาพอื่นๆ",
      };
    }
  }

  // หาระดับ BMI และคำอธิบาย
  const bmiCategory = getBMICategory(bmi);

  // ส่งกลับค่า BMI, ระดับ และคำอธิบายในรูปแบบ JSON
  return new Response(
    JSON.stringify({
      bmi: bmi,
      level: bmiCategory.level,
      description: bmiCategory.description,
      message: `ค่าดัชนีมวลกายของคุณคือ ${bmi.toFixed(2)} (${bmiCategory.level})`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
