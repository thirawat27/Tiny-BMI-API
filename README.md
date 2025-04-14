# Tiny BMI API

ระบบ API สำหรับคำนวณค่าดัชนีมวลกาย (BMI) พัฒนาโดย Thirawat Sinlapasomsak

## 📚 สารบัญ
- [API Endpoint](#api-endpoint)
- [คุณสมบัติหลัก](#คุณสมบัติหลัก)
- [การใช้งาน API](#การใช้งาน-api)
- [BMI Categories](#bmi-categories)
- [ตัวอย่างการใช้งาน](#ตัวอย่างการใช้งาน)
- [การติดตั้งบนเซิร์ฟเวอร์ของคุณ](#การติดตั้งบนเซิร์ฟเวอร์ของคุณ)
- [ใบอนุญาต](#ใบอนุญาต-mit-license)

## API Endpoint

```
https://tiny-bmi-api.vercel.app/api
```

## คุณสมบัติหลัก

- 🔄 รองรับทั้ง GET และ POST requests
- 📊 คำนวณค่า BMI พร้อมระบุหมวดหมู่น้ำหนัก
- 💬 ให้คำแนะนำสุขภาพตามค่า BMI
- 🛡️ มีการตรวจสอบข้อมูลนำเข้าอย่างละเอียด
- 🌐 รองรับการเรียกใช้งานจาก Cross-Origin (CORS)

## การใช้งาน API

API นี้รับค่าน้ำหนักและส่วนสูง แล้วคำนวณค่า BMI พร้อมให้คำแนะนำที่เกี่ยวข้อง

### Parameters

| พารามิเตอร์ | คำอธิบาย | หน่วย | ตัวอย่าง | จำเป็น |
|-----------|---------|------|--------|-------|
| weight    | น้ำหนัก  | กิโลกรัม | 70 | ✅ |
| height    | ส่วนสูง  | เซนติเมตร (เริ่มต้น) หรือเมตร | 170 | ✅ |
| unit      | หน่วยของส่วนสูง | 'cm' หรือ 'm' | cm | ❌ |

### การเรียกใช้งานแบบ GET

```bash
curl "https://tiny-bmi-api.vercel.app/api?weight=70&height=170"
```

### การเรียกใช้งานแบบ POST

```bash
curl -X POST "https://tiny-bmi-api.vercel.app/api" \
     -H "Content-Type: application/json" \
     -d '{"weight": 70, "height": 170, "unit": "cm"}'
```

### ตัวอย่าง Response

```json
{
  "success": true,
  "data": {
    "weight": 70,
    "height": 1.7,
    "bmi": 24.22,
    "category": {
      "level": "น้ำหนักปกติ/สมส่วน",
      "description": "ค่าดัชนีมวลกายอยู่ในเกณฑ์ที่เหมาะสม ชี้ให้เห็นว่ามีน้ำหนักที่สมดุลและสุขภาพที่ดี"
    },
    "healthTips": [
      "รักษาสมดุลของการรับประทานอาหารและการออกกำลังกาย",
      "ควรออกกำลังกายสม่ำเสมอ อย่างน้อย 150 นาทีต่อสัปดาห์",
      "รับประทานอาหารที่มีประโยชน์ครบ 5 หมู่ในปริมาณที่เหมาะสม",
      "ดื่มน้ำให้เพียงพอ ประมาณ 8 แก้วต่อวัน"
    ],
    "message": "ค่าดัชนีมวลกายของคุณคือ 24.22 (น้ำหนักปกติ/สมส่วน)"
  }
}
```

### กรณีเกิดข้อผิดพลาด

```json
{
  "success": false,
  "error": {
    "title": "Missing parameters",
    "detail": "ต้องระบุทั้งน้ำหนัก (weight) และส่วนสูง (height)"
  }
}
```

## BMI Categories

| BMI Range | Category | คำอธิบาย |
|-----------|----------|---------|
| < 18.5 | น้ำหนักน้อย/ผอม | ค่าดัชนีมวลกายต่ำกว่าเกณฑ์มาตรฐาน |
| 18.5 - 22.9 | น้ำหนักปกติ/สมส่วน | ค่าดัชนีมวลกายอยู่ในเกณฑ์ที่เหมาะสม |
| 23.0 - 24.9 | ท้วม/น้ำหนักเกิน | ค่าดัชนีมวลกายเริ่มสูงกว่าเกณฑ์ปกติ |
| 25.0 - 29.9 | อ้วน | ค่าดัชนีมวลกายสูงกว่าเกณฑ์ปกติ |
| >= 30.0 | อ้วนมาก | ค่าดัชนีมวลกายสูงมาก |

## ตัวอย่างการใช้งาน

### JavaScript (Browser)

```javascript
// โค้ดสำหรับเรียกใช้ API ด้วย fetch
async function calculateBMI(weight, height, unit = 'cm') {
  try {
    const response = await fetch(
      `https://tiny-bmi-api.vercel.app/api?weight=${weight}&height=${height}&unit=${unit}`
    );
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error?.detail || 'เกิดข้อผิดพลาดในการเรียกใช้ API');
    }
    
    return result.data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error.message);
    throw error;
  }
}

// ตัวอย่างการใช้งาน
calculateBMI(70, 170)
  .then(data => {
    console.log(`BMI: ${data.bmi}`);
    console.log(`ระดับ: ${data.category.level}`);
    console.log(`คำแนะนำ: ${data.healthTips[0]}`);
  })
  .catch(error => {
    console.error(error);
  });
```

### React Component

```jsx
import React, { useState } from 'react';

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateBMI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://tiny-bmi-api.vercel.app/api?weight=${weight}&height=${height}`
      );
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.detail || 'เกิดข้อผิดพลาดในการคำนวณ');
      }
      
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bmi-calculator">
      <h2>เครื่องคำนวณค่าดัชนีมวลกาย (BMI)</h2>
      
      <form onSubmit={calculateBMI}>
        <div>
          <label htmlFor="weight">น้ำหนัก (กิโลกรัม):</label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="height">ส่วนสูง (เซนติเมตร):</label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'กำลังคำนวณ...' : 'คำนวณ BMI'}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="result">
          <h3>ผลการคำนวณ</h3>
          <p>ค่า BMI: <strong>{result.bmi}</strong></p>
          <p>ระดับ: <strong>{result.category.level}</strong></p>
          <p>{result.category.description}</p>
          
          <h4>คำแนะนำสุขภาพ:</h4>
          <ul>
            {result.healthTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BMICalculator;
```

### Node.js/Express

```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// มิดเดิลแวร์
app.use(cors());
app.use(express.json());

// เส้นทาง API หลัก
app.get('/api', handleBMIRequest);
app.post('/api', handleBMIRequest);

function handleBMIRequest(req, res) {
  // รับค่าจาก query params (GET) หรือ request body (POST)
  const params = req.method === 'GET' ? req.query : req.body;
  const weight = parseFloat(params.weight);
  const height = parseFloat(params.height);
  const unit = (params.unit || 'cm').toLowerCase();
  
  // ตรวจสอบความถูกต้องของข้อมูล
  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        title: "Invalid values",
        detail: "น้ำหนักและส่วนสูงต้องเป็นตัวเลขมากกว่า 0"
      }
    });
  }
  
  // แปลงส่วนสูงเป็นเมตร
  const heightInMeters = unit === 'm' ? height : height / 100;
  
  // คำนวณ BMI
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBMI = parseFloat(bmi.toFixed(2));
  
  // หาหมวดหมู่ BMI
  const category = getBMICategory(roundedBMI);
  
  // คำแนะนำสุขภาพ
  const healthTips = getHealthTips(roundedBMI);
  
  // ส่งผลลัพธ์
  res.json({
    success: true,
    data: {
      weight,
      height: heightInMeters,
      bmi: roundedBMI,
      category,
      healthTips,
      message: `ค่าดัชนีมวลกายของคุณคือ ${roundedBMI} (${category.level})`
    }
  });
}

function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      level: "น้ำหนักน้อย/ผอม",
      description: "ค่าดัชนีมวลกายต่ำกว่าเกณฑ์มาตรฐาน"
    };
  } else if (bmi >= 18.5 && bmi < 23) {
    return {
      level: "น้ำหนักปกติ/สมส่วน",
      description: "ค่าดัชนีมวลกายอยู่ในเกณฑ์ที่เหมาะสม"
    };
  } else if (bmi >= 23 && bmi < 25) {
    return {
      level: "ท้วม/น้ำหนักเกิน",
      description: "ค่าดัชนีมวลกายเริ่มสูงกว่าเกณฑ์ปกติ"
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      level: "อ้วน",
      description: "ค่าดัชนีมวลกายสูงกว่าเกณฑ์ปกติ"
    };
  } else {
    return {
      level: "อ้วนมาก",
      description: "ค่าดัชนีมวลกายสูงมาก"
    };
  }
}

function getHealthTips(bmi) {
  // รายละเอียดคำแนะนำตามเกณฑ์ BMI
  // (โค้ดส่วนนี้เหมือนกับในไฟล์ API ต้นฉบับ)
  // ...
  
  return ["รักษาสมดุลด้านโภชนาการและการออกกำลังกาย"];
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
```

### Python (Requests)

```python
import requests

def calculate_bmi(weight, height, unit='cm'):
    """
    คำนวณค่า BMI โดยใช้ Tiny BMI API
    
    Parameters:
    weight (float): น้ำหนักในหน่วยกิโลกรัม
    height (float): ส่วนสูงในหน่วยเซนติเมตรหรือเมตร (ขึ้นอยู่กับพารามิเตอร์ unit)
    unit (str): หน่วยของส่วนสูง ('cm' หรือ 'm')
    
    Returns:
    dict: ข้อมูล BMI และรายละเอียดที่เกี่ยวข้อง
    """
    url = "https://tiny-bmi-api.vercel.app/api"
    params = {
        "weight": weight,
        "height": height,
        "unit": unit
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # ตรวจสอบข้อผิดพลาด HTTP
        result = response.json()
        
        if not result.get("success"):
            error_detail = result.get("error", {}).get("detail", "เกิดข้อผิดพลาดที่ไม่ระบุ")
            raise Exception(f"API Error: {error_detail}")
            
        return result.get("data")
        
    except requests.exceptions.RequestException as e:
        print(f"เกิดข้อผิดพลาดในการเชื่อมต่อ: {e}")
        return None
    except Exception as e:
        print(f"เกิดข้อผิดพลาด: {e}")
        return None

# ตัวอย่างการใช้งาน
if __name__ == "__main__":
    result = calculate_bmi(70, 170)
    if result:
        print(f"BMI: {result['bmi']}")
        print(f"ระดับ: {result['category']['level']}")
        print(f"คำอธิบาย: {result['category']['description']}")
        print("\nคำแนะนำสุขภาพ:")
        for tip in result['healthTips']:
            print(f"- {tip}")
```

## การติดตั้งบนเซิร์ฟเวอร์ของคุณ

หากต้องการติดตั้ง API นี้บนเซิร์ฟเวอร์ของคุณเอง ให้ทำตามขั้นตอนต่อไปนี้:

1. โคลนโปรเจค
```bash
git clone https://github.com/yourusername/tiny-bmi-api.git
cd tiny-bmi-api
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. เริ่มเซิร์ฟเวอร์ในโหมดพัฒนา
```bash
npm run dev
```

หรือในโหมดการผลิต:
```bash
npm run build
npm start
```

4. เซิร์ฟเวอร์จะทำงานที่ `http://localhost:3000`

## ใบอนุญาต (MIT License)

```
MIT License

Copyright (c) 2025 Tiny BMI API

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
