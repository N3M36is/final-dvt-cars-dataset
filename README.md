# 🚗 Car Sales Dashboard

Interactive Data Visualization Project สำหรับวิเคราะห์ข้อมูลรถยนต์มือสอง โดยพัฒนา Dashboard ด้วย D3.js เพื่อแสดงผลข้อมูลในรูปแบบ Interactive Visualization

---

# 📌 รายละเอียดโครงการ

โครงการนี้ใช้ชุดข้อมูลรถยนต์มือสองจากไฟล์ cars_dataset_cleaned.csv เพื่อนำมาวิเคราะห์และแสดงผลผ่าน Dashboard แบบ Interactive โดยใช้ D3.js ในการสร้างกราฟ และใช้ HTML/CSS ในการออกแบบหน้าเว็บ 【4-c77861】

Dashboard ประกอบด้วยกราฟทั้งหมด 4 กราฟ

1. Price Analysis by Vehicle Brand
2. Mileage and Price Correlation Analysis
3. Fuel Type Distribution Analysis
4. Vehicle Age and Usage Trend Analysis

---

# 📁 โครงสร้างไฟล์

```text
Project/
│
├── d3.html
├── d3.js
├── style.css
├── cars_dataset_cleaned.csv
└── README.md
```

### รายละเอียดไฟล์

| ไฟล์ | รายละเอียด |
|--------|------------|
| d3.html | โครงสร้างหน้า Dashboard |
| d3.js | Logic สำหรับสร้างกราฟ D3.js |
| style.css | การออกแบบหน้าเว็บ |
| cars_dataset_cleaned.csv | ชุดข้อมูลรถยนต์ |
| README.md | คู่มือการใช้งาน |

---

# 🛠 Software Requirements

ติดตั้งโปรแกรมดังต่อไปนี้

- Visual Studio Code
- Live Server Extension
- Web Browser (Google Chrome / Microsoft Edge)

---

# 🚀 วิธีการเปิดใช้งาน

## 1. ดาวน์โหลดไฟล์โปรเจกต์

นำไฟล์ทั้งหมดไว้ในโฟลเดอร์เดียวกัน

```text
d3.html
d3.js
style.css
cars_dataset_cleaned.csv
```

---

## 2. เปิดโปรเจกต์ด้วย VS Code

เปิดโฟลเดอร์โปรเจกต์ผ่าน VS Code

---

## 3. ติดตั้ง Live Server

1. เปิด Extensions
2. ค้นหา

```text
Live Server
```

3. กด Install

---

## 4. เปิดหน้าเว็บ

คลิกขวาที่

```text
d3.html
```

เลือก

```text
Open with Live Server
```

ระบบจะเปิด Dashboard ผ่าน Browser อัตโนมัติ

---

# 📊 กราฟที่ 1

## Price Analysis by Vehicle Brand

### ประเภทกราฟ

Bar Chart

### ตัวแปรที่ใช้

```text
make
listing_price
```

### วัตถุประสงค์

แสดงราคาเฉลี่ยของรถยนต์แต่ละยี่ห้อ เพื่อเปรียบเทียบความแตกต่างของระดับราคาในตลาด

---

# 📈 กราฟที่ 2

## Mileage and Price Correlation Analysis

### ประเภทกราฟ

Scatter Plot

### ตัวแปรที่ใช้

```text
odometer_km
listing_price
```

### วัตถุประสงค์

ศึกษาความสัมพันธ์ระหว่างระยะทางการใช้งานกับราคาขายรถยนต์

---

# 🥧 กราฟที่ 3

## Fuel Type Distribution Analysis

### ประเภทกราฟ

Pie Chart

### ตัวแปรที่ใช้

```text
fuel_type
```

### วัตถุประสงค์

แสดงสัดส่วนประเภทเชื้อเพลิงของรถยนต์ในชุดข้อมูล

---

# 📉 กราฟที่ 4

## Vehicle Age and Usage Trend Analysis

### ประเภทกราฟ

Line Chart

### ตัวแปรที่ใช้

```text
vehicle_year
odometer_km
```

### วัตถุประสงค์

วิเคราะห์แนวโน้มการใช้งานรถยนต์ตามปีผลิต

---

# 🎯 Features

Dashboard รองรับ

✅ Tooltip

✅ Animation

✅ Zoom In / Zoom Out

✅ Pan

✅ Responsive Design

✅ Dynamic CSV Loading

---

# 📂 Dataset

ไฟล์ข้อมูล

```text
cars_dataset_cleaned.csv
```

ประกอบด้วยข้อมูลสำคัญ เช่น

- Make
- Model
- Vehicle Year
- Listing Price
- Odometer
- Fuel Type
- Body Type
- Transmission
- Engine Information



---

# 🎨 Design

หน้า Dashboard ถูกออกแบบด้วย

- Flex Layout
- Card Design
- Responsive Layout
- Shadow Effect
- Hover Interaction

ผ่านไฟล์

```text
style.css
```

【4-c77861】

---

# ⚙️ Technology Stack

- HTML5
- CSS3
- JavaScript
- D3.js v7



---

# 👥 ผู้จัดทำ

Interactive Data Visualization Project

Car Sales Dashboard Analysis

Data Visualization Technology

Business Information Systems

---

# 📄 License

สำหรับการศึกษาและการนำเสนอผลงานทางการศึกษา

# 🤖 Prompt Engineering

ในการออกแบบ Dashboard และเลือกกราฟสำหรับการวิเคราะห์ข้อมูล ได้ใช้แนวคิด Prompt Engineering เพื่อกำหนดเป้าหมายการวิเคราะห์และเลือก Visualization ที่เหมาะสมกับข้อมูลในชุด cars_dataset_cleaned.csv 

---

## Prompt 1: Price Analysis by Vehicle Brand

### Prompt

วิเคราะห์ราคาเฉลี่ยของรถยนต์แต่ละยี่ห้อจากข้อมูล make และ listing_price และแสดงผลในรูปแบบที่สามารถเปรียบเทียบระหว่างแบรนด์ได้อย่างชัดเจน

### Goal

- เปรียบเทียบราคาขายเฉลี่ยของแต่ละยี่ห้อ
- ค้นหาแบรนด์ที่มีราคาสูงและต่ำที่สุด
- แสดงความแตกต่างของตลาดรถยนต์แต่ละยี่ห้อ

### Visualization

Bar Chart

### Variables

```text
make
listing_price
