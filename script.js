// --- 1. เตรียมตัวแปรสำหรับกราฟ ---
let chart;

function createChart() {
    const ctx = document.getElementById("healthChart");
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Hydration (%)",
                    data: [],
                    borderColor: "#22c55e",
                    tension: 0.3, // เพิ่มความโค้งให้เส้นกราฟดูสวยขึ้น
                    fill: false
                },
                {
                    label: "Glucose (mg/dL)",
                    data: [],
                    borderColor: "#38bdf8",
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// สร้างกราฟทันทีที่โหลดหน้าเว็บ
createChart();

// --- 2. ระบบเสียงพากย์และเสียงแจ้งเตือน ---

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH'; // เสียงพากย์ภาษาไทย
    utterance.pitch = 1.1;    // ปรับให้น่าฟัง
    utterance.rate = 1.0; 
    window.speechSynthesis.speak(utterance);
}

function playBeep(frequency = 880, duration = 0.1) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
}

// --- 3. ฟังก์ชันหลักเมื่อกดปุ่มอ่านค่า ---

function testData() {
    // เสียงคลิกเริ่มต้น
    playBeep(880, 0.1);
    speak("กำลังเริ่มวิเคราะห์เหงื่อครับ");

    // จำลองการประมวลผล 1.5 วินาที
    setTimeout(() => {
        // คำนวณค่าตัวเลข
        let glucose = Math.floor(Math.random() * 40) + 80;
        let lactate = (Math.random() * 3).toFixed(2);
        let sodium = Math.floor(Math.random() * 40) + 100;
        let ph = (Math.random() * 1 + 6).toFixed(2);
        let hydration = Math.floor(Math.random() * 30) + 60;

        // อัปเดตตัวเลขบนหน้าจอ
        document.getElementById("glucose").innerText = glucose;
        document.getElementById("lactate").innerText = lactate;
        document.getElementById("sodium").innerText = sodium;
        document.getElementById("ph").innerText = ph;
        document.getElementById("hydration").innerText = hydration;

        // อัปเดตข้อมูลลงกราฟ
        let time = new Date().toLocaleTimeString();
        chart.data.labels.push(time);
        chart.data.datasets[0].data.push(hydration);
        chart.data.datasets[1].data.push(glucose);

        // ถ้าข้อมูลเยอะเกินไป ให้เลื่อนกราฟ (แสดงแค่ 7 จุดล่าสุด)
        if (chart.data.labels.length > 7) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
        }

        chart.update();

        // เสียงจบและสรุปผล
        playBeep(1200, 0.15);
        
        // เงื่อนไขการพูดเตือน (AI พากย์ตามจริง)
        if (hydration < 70) {
            speak('วิเคราะห์เสร็จแล้วครับ คุณเริ่มมีภาวะขาดน้ำ ระดับน้ำอยู่ที่'+ hydration);
            speak(' เปอร์เซ็นต์โปรดดื่มน้ำทันทีครับ ');
        } else if (glucose > 110)
            {
            speak('วิเคราะห์เสร็จแล้วครับ ระดับน้ำตาลในเหงื่อค่อนข้างสูง  อยู่ที่ '+ glucose);
            speak(' มิลลิกรัมต่อเดซิลิตรครับ ');
        } else {
            speak('วิเคราะห์เสร็จเรียบร้อย สภาวะร่างกายของคุณปกติดีครับ');
        }

    }, 1500);
}
