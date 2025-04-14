# Tiny BMI API

API for calculating Body Mass Index (BMI) By Thirawat Sinlapasomsak

## API Endpoint

```
https://tiny-bmi-api.vercel.app/api
```

## การติดตั้ง Dependencies

หากต้องการใช้งาน API นี้ในโปรเจคของคุณ ไม่จำเป็นต้องติดตั้ง dependencies ใดๆ เนื่องจากเป็น API ที่ให้บริการบนเซิร์ฟเวอร์

หากต้องการรันโปรเจคนี้บนเครื่องเซิร์ฟเวอร์ของคุณเอง ให้ติดตั้ง dependencies ต่อไปนี้:

```bash
npm install express cors
```

## การใช้งาน API

API นี้รับค่าน้ำหนัก (weight) และส่วนสูง (height) แล้วคำนวณค่า BMI

### Parameters

| พารามิเตอร์ | คำอธิบาย | หน่วย | ตัวอย่าง |
|-----------|---------|------|--------|
| weight    | น้ำหนัก  | กิโลกรัม | 70 |
| height    | ส่วนสูง  | เซนติเมตร | 170 |

### ตัวอย่าง Request ด้วย cURL

```bash
curl "https://tiny-bmi-api.vercel.app/api?weight=70&height=170"
```

### ตัวอย่าง Response

```json
{
  "weight": 70,
  "height": 170,
  "bmi": 24.22,
  "category": "Normal weight",
  "message": "คุณมีน้ำหนักปกติ",
  "success": true
}
```

### ประเภทของ BMI Categories

| BMI Range | Category | ข้อความ |
|-----------|----------|--------|
| < 18.5 | Underweight | คุณมีน้ำหนักน้อยเกินไป |
| 18.5 - 24.9 | Normal weight | คุณมีน้ำหนักปกติ |
| 25.0 - 29.9 | Overweight | คุณมีน้ำหนักเกิน |
| >= 30.0 | Obesity | คุณอยู่ในเกณฑ์อ้วน |

## ตัวอย่างโค้ด

### การใช้งานกับ JavaScript (Browser)

```javascript
// ตัวอย่างการเรียกใช้ API ด้วย fetch
async function calculateBMI(weight, height) {
  try {
    const response = await fetch(`https://tiny-bmi-api.vercel.app/api?weight=${weight}&height=${height}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  }
}

// ตัวอย่างการใช้งาน
calculateBMI(70, 170).then(result => {
  console.log(`BMI: ${result.bmi}, Category: ${result.category}`);
});
```

### การใช้งานกับ Node.js/Express

```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api', (req, res) => {
  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);
  
  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    return res.status(400).json({
      success: false,
      message: 'โปรดระบุน้ำหนักและส่วนสูงให้ถูกต้อง'
    });
  }
  
  // คำนวณ BMI (น้ำหนักเป็นกิโลกรัม ส่วนสูงเป็นเซนติเมตร)
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBMI = Math.round(bmi * 100) / 100;
  
  let category, message;
  
  if (bmi < 18.5) {
    category = 'Underweight';
    message = 'คุณมีน้ำหนักน้อยเกินไป';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
    message = 'คุณมีน้ำหนักปกติ';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    message = 'คุณมีน้ำหนักเกิน';
  } else {
    category = 'Obesity';
    message = 'คุณอยู่ในเกณฑ์อ้วน';
  }
  
  res.json({
    weight,
    height,
    bmi: roundedBMI,
    category,
    message,
    success: true
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
```

### การใช้งานกับ Python (Requests)

```python
import requests

def calculate_bmi(weight, height):
    url = f"https://tiny-bmi-api.vercel.app/api?weight={weight}&height={height}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"success": False, "message": "เกิดข้อผิดพลาดในการเรียก API"}

# ตัวอย่างการใช้งาน
result = calculate_bmi(70, 170)
print(f"BMI: {result['bmi']}, Category: {result['category']}, Message: {result['message']}")
```

## การติดตั้งและใช้งานในโปรเจคของคุณเอง

1. โคลนโปรเจค
```bash
git clone https://github.com/yourusername/tiny-bmi-api.git
cd tiny-bmi-api
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. เริ่มเซิร์ฟเวอร์
```bash
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
