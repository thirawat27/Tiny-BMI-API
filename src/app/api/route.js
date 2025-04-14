// app/api/bmi/route.js

/**
 * BMI API - คำนวณดัชนีมวลกาย (BMI) และให้คำแนะนำเกี่ยวกับสุขภาพ
 * 
 * วิธีใช้: GET /api/bmi?weight=<น้ำหนักเป็นกิโลกรัม>&height=<ส่วนสูงเป็นเซนติเมตร>
 * หรือ: GET /api/bmi?weight=<น้ำหนักเป็นกิโลกรัม>&height=<ส่วนสูงเป็นเมตร>&unit=m
 */
export async function GET(request) {
  // แยก query parameters จาก URL
  const { searchParams } = new URL(request.url);
  const weight = searchParams.get('weight');
  const height = searchParams.get('height');
  const unit = searchParams.get('unit') || 'cm'; // ค่าเริ่มต้นเป็น cm ถ้าไม่ระบุ

  // ตรวจสอบว่ามีการส่ง weight และ height เข้ามาหรือไม่
  if (!weight || !height) {
    return createErrorResponse(
      "Missing parameters", 
      "ต้องระบุทั้งน้ำหนัก (weight) และส่วนสูง (height)", 
      400
    );
  }

  // แปลงค่าเป็นตัวเลข
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);

  // ตรวจสอบว่าค่าที่รับมาถูกต้องหรือไม่
  if (isNaN(weightNum) || isNaN(heightNum)) {
    return createErrorResponse(
      "Invalid values", 
      "น้ำหนักและส่วนสูงต้องเป็นตัวเลขเท่านั้น", 
      400
    );
  }

  // ตรวจสอบว่าค่าไม่ติดลบ
  if (weightNum <= 0 || heightNum <= 0) {
    return createErrorResponse(
      "Invalid values", 
      "น้ำหนักและส่วนสูงต้องมีค่ามากกว่า 0", 
      400
    );
  }

  // แปลงส่วนสูงเป็นเมตรตามหน่วยที่ระบุ
  let heightInMeters;
  if (unit.toLowerCase() === 'm') {
    heightInMeters = heightNum;
  } else {
    heightInMeters = heightNum / 100; // แปลงจาก cm เป็น m
  }

  // ตรวจสอบความสมเหตุสมผลของค่า
  if (weightNum > 500) {
    return createErrorResponse(
      "Value out of range", 
      "น้ำหนักดูเหมือนจะสูงเกินไป (ไม่ควรเกิน 500 กก.)", 
      400
    );
  }
  
  if (heightInMeters > 3) {
    return createErrorResponse(
      "Value out of range", 
      "ส่วนสูงดูเหมือนจะสูงเกินไป (ไม่ควรเกิน 3 เมตร)", 
      400
    );
  }

  // คำนวณ BMI
  const bmi = weightNum / (heightInMeters ** 2);
  const bmiRounded = parseFloat(bmi.toFixed(2)); // ปัดเศษให้เหลือทศนิยม 2 ตำแหน่ง

  // รับข้อมูลระดับ BMI
  const bmiCategory = getBMICategory(bmiRounded);
  
  // รับคำแนะนำสุขภาพ
  const healthTips = getHealthTips(bmiRounded);

  // ส่งกลับข้อมูลในรูปแบบ JSON
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        weight: weightNum,
        height: heightInMeters,
        bmi: bmiRounded,
        category: {
          level: bmiCategory.level,
          description: bmiCategory.description
        },
        healthTips: healthTips,
        message: `ค่าดัชนีมวลกายของคุณคือ ${bmiRounded} (${bmiCategory.level})`
      }
    }),
    {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "max-age=3600" // เก็บแคชไว้ 1 ชั่วโมง
      }
    }
  );
}

/**
 * ฟังก์ชันสร้าง Response แจ้งข้อผิดพลาด
 */
function createErrorResponse(title, detail, status = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        title: title,
        detail: detail
      }
    }),
    {
      status: status,
      headers: { "Content-Type": "application/json" }
    }
  );
}

/**
 * ฟังก์ชันสำหรับหาระดับและคำอธิบายของ BMI
 */
function getBMICategory(bmiValue) {
  if (bmiValue < 18.5) {
    return {
      level: "น้ำหนักน้อย/ผอม",
      description: "ค่าดัชนีมวลกายต่ำกว่าเกณฑ์มาตรฐาน ซึ่งอาจเกิดจากการรับประทานอาหารไม่เพียงพอหรือปัญหาสุขภาพบางอย่าง"
    };
  } else if (bmiValue >= 18.5 && bmiValue < 23) {
    return {
      level: "น้ำหนักปกติ/สมส่วน",
      description: "ค่าดัชนีมวลกายอยู่ในเกณฑ์ที่เหมาะสม ชี้ให้เห็นว่ามีน้ำหนักที่สมดุลและสุขภาพที่ดี"
    };
  } else if (bmiValue >= 23 && bmiValue < 25) {
    return {
      level: "ท้วม/น้ำหนักเกิน",
      description: "ค่าดัชนีมวลกายเริ่มสูงกว่าเกณฑ์ปกติ ควรระวังและควบคุมน้ำหนัก"
    };
  } else if (bmiValue >= 25 && bmiValue < 30) {
    return {
      level: "อ้วน",
      description: "ค่าดัชนีมวลกายสูงกว่าเกณฑ์ปกติ มีความเสี่ยงต่อโรคที่เกี่ยวกับน้ำหนักเกิน เช่น เบาหวาน ความดันโลหิตสูง"
    };
  } else {
    return {
      level: "อ้วนมาก",
      description: "ค่าดัชนีมวลกายสูงมาก ซึ่งเสี่ยงต่อโรคหัวใจ เบาหวาน ความดันโลหิตสูง และปัญหาสุขภาพอื่นๆ ควรปรึกษาแพทย์"
    };
  }
}

/**
 * ฟังก์ชันสำหรับให้คำแนะนำด้านสุขภาพตามค่า BMI
 */
function getHealthTips(bmiValue) {
  if (bmiValue < 18.5) {
    return [
      "ควรรับประทานอาหารที่มีคุณค่าทางโภชนาการสูงและมีแคลอรี่เพียงพอ",
      "เน้นอาหารที่มีโปรตีนคุณภาพดี เช่น เนื้อสัตว์ไม่มีไขมัน ไข่ ถั่ว",
      "ออกกำลังกายแบบเสริมสร้างกล้ามเนื้อเพื่อเพิ่มมวลกล้ามเนื้อ",
      "หากน้ำหนักน้อยมากๆ ควรปรึกษาแพทย์เพื่อหาสาเหตุและแนวทางรักษา"
    ];
  } else if (bmiValue >= 18.5 && bmiValue < 23) {
    return [
      "รักษาสมดุลของการรับประทานอาหารและการออกกำลังกาย",
      "ควรออกกำลังกายสม่ำเสมอ อย่างน้อย 150 นาทีต่อสัปดาห์",
      "รับประทานอาหารที่มีประโยชน์ครบ 5 หมู่ในปริมาณที่เหมาะสม",
      "ดื่มน้ำให้เพียงพอ ประมาณ 8 แก้วต่อวัน"
    ];
  } else if (bmiValue >= 23 && bmiValue < 30) {
    return [
      "ควรควบคุมปริมาณแคลอรี่ที่ได้รับและเพิ่มการออกกำลังกาย",
      "ลดอาหารที่มีไขมันและน้ำตาลสูง",
      "ออกกำลังกายแบบแอโรบิกสม่ำเสมอ อย่างน้อย 30 นาทีต่อวัน 5 วันต่อสัปดาห์",
      "ปรึกษาผู้เชี่ยวชาญด้านโภชนาการเพื่อวางแผนอาหารที่เหมาะสม"
    ];
  } else {
    return [
      "ควรปรึกษาแพทย์เพื่อรับคำแนะนำและวางแผนลดน้ำหนักอย่างปลอดภัย",
      "เริ่มออกกำลังกายเบาๆ เช่น เดิน ว่ายน้ำ ภายใต้การดูแลของผู้เชี่ยวชาญ",
      "ควบคุมอาหาร ลดปริมาณแคลอรี่ โดยเฉพาะอาหารที่มีไขมันและน้ำตาลสูง",
      "ตรวจสุขภาพเป็นประจำเพื่อเฝ้าระวังโรคที่เกี่ยวข้องกับภาวะน้ำหนักเกิน"
    ];
  }
}

// สำหรับการใช้ผ่านเมธอด POST (ถ้าต้องการในอนาคต)
export async function POST(request) {
  try {
    const body = await request.json();
    const { weight, height, unit = 'cm' } = body;
    
    // ใช้ URL และ searchParams เพื่อให้สามารถใช้โค้ดเดิม
    const url = new URL(request.url);
    url.searchParams.set('weight', weight);
    url.searchParams.set('height', height);
    url.searchParams.set('unit', unit);
    
    // เรียกใช้ฟังก์ชั่น GET กับ URL ที่สร้างขึ้น
    const modifiedRequest = {
      ...request,
      url: url.toString()
    };
    
    return GET(modifiedRequest);
  } catch (error) {
    return createErrorResponse(
      "Invalid request",
      "ไม่สามารถแปลงข้อมูล JSON ได้ โปรดตรวจสอบรูปแบบการส่งข้อมูล",
      400
    );
  }
}