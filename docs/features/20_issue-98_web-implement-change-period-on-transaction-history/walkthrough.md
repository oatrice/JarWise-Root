# Walkthrough การเปลี่ยนแปลง

## สิ่งที่เปลี่ยนในโค้ด

หน้า `Web/src/pages/TransactionHistory.tsx` ถูกปรับให้ period picker มีสถานะแบบ draft แยกจากค่าที่ใช้งานจริง ทำให้การเลือก `Custom Range` ไม่ล้างรายการทันทีระหว่างที่ผู้ใช้ยังกรอกวันที่ไม่ครบ และการกด `Cancel` จะไม่ทำให้หน้าจอหลุดไปใช้ค่าที่ผู้ใช้ยังไม่ได้ยืนยัน

นอกจากนี้ empty state ถูกทำให้สื่อความหมายมากขึ้นในกรณีที่มีธุรกรรมอยู่แล้วแต่ไม่ตรงช่วงเวลาที่เลือก โดยจะแสดงลักษณะ `No matches found` แทนข้อความเหมือนยังไม่มีข้อมูลเลย

## สิ่งที่เปลี่ยนใน test

มีการเพิ่ม test ครอบ flow ของ `Custom Range` ทั้งก่อนกด apply และตอนกด cancel รวมถึงทำให้ test pagination เดิมเสถียรมากขึ้นด้วยการล็อกเวลาและจัด fixture ให้สอดคล้องกับพฤติกรรมของหน้าประวัติธุรกรรม

## การยืนยันผล

- `npm test -- TransactionHistory.test.tsx TransactionHistoryPeriod.test.tsx`
- `npm run build`
