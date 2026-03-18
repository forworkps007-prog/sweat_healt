let isLoginMode = true; // สถานะปัจจุบัน: true = login, false = register

// ฟังก์ชันสลับโหมด Login <-> Register
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById("authTitle");
    const mainBtn = document.getElementById("mainBtn");
    const toggleText = document.getElementById("toggleText");
    const toggleBtn = document.getElementById("toggleBtn");
    const errorMsg = document.getElementById("authError");

    errorMsg.style.display = "none";

    if (isLoginMode) {
        title.innerText = "Sweat Health Login";
        mainBtn.innerText = "เข้าสู่ระบบ";
        toggleText.innerText = "ยังไม่มีบัญชีใช่ไหม?";
        toggleBtn.innerText = "สมัครสมาชิก";
    } else {
        title.innerText = "Sweat Health Register";
        mainBtn.innerText = "สมัครสมาชิก";
        toggleText.innerText = "มีบัญชีอยู่แล้ว?";
        toggleBtn.innerText = "เข้าสู่ระบบ";
    }
}

// ฟังก์ชันจัดการการคลิกปุ่มหลัก
function handleAuth() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("authError");

    if (!user || !pass) {
        errorMsg.innerText = "กรุณากรอกข้อมูลให้ครบ!";
        errorMsg.style.display = "block";
        return;
    }

    if (isLoginMode) {
        // --- ระบบ Login ---
        const savedPass = localStorage.getItem("user_" + user);
        if (savedPass && savedPass === pass) {
            loginSuccess(user);
        } else {
            errorMsg.innerText = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!";
            errorMsg.style.display = "block";
            playBeep(400, 0.3);
        }
    } else {
        // --- ระบบ Register ---
        if (localStorage.getItem("user_" + user)) {
            errorMsg.innerText = "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว!";
            errorMsg.style.display = "block";
        } else {
            localStorage.setItem("user_" + user, pass); // บันทึกข้อมูลลงเครื่อง
            speak("สมัครสมาชิกสำเร็จแล้วครับ กรุณาเข้าสู่ระบบ");
            alert("สมัครสมาชิกสำเร็จ! ลองเข้าสู่ระบบได้เลย");
            toggleAuthMode(); // สลับกลับไปหน้า Login
        }
    }
}

function loginSuccess(name) {
    document.getElementById("loginOverlay").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("loginOverlay").style.display = "none";
    }, 500);
    
    playBeep(1000, 0.2);
    speak("ยินดีต้อนรับคุณ " + name + " เข้าสู่ระบบครับ");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", name);
}

// ตรวจสอบสถานะตอนโหลดหน้าเว็บ
window.addEventListener('load', () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById("loginOverlay").style.display = "none";
    }
});
// ฟังก์ชันเช็คการเข้าสู่ระบบ
function checkLogin() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("loginError");

    // กำหนด Username และ Password (คุณสามารถเปลี่ยนเป็นชื่อคุณได้เลย)
    if (user === "weir" && pass === "1234") {
        // ถ้าถูก ให้ซ่อนหน้า Login
        document.getElementById("loginOverlay").style.display = "none";
        playBeep(1000, 0.2); // ส่งเสียงแจ้งเตือน
        speak("ยินดีต้อนรับคุณศิริชัย เข้าสู่ระบบตรวจสุขภาพครับ");
        
        // บันทึกสถานะว่า Login แล้ว (ถ้า Refresh จะได้ไม่ต้อง Login ใหม่)
        localStorage.setItem("isLoggedIn", "true");
    } else {
        // ถ้าผิด ให้โชว์ข้อความสีแดง
        errorMsg.style.display = "block";
        playBeep(400, 0.3); // เสียงเตือนแบบต่ำ (Error)
        speak("รหัสผ่านไม่ถูกต้อง โปรดลองใหม่ครับ");
    }
}

// ตรวจสอบสถานะตอนโหลดหน้าเว็บ
window.onload = function() {
    if (localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById("loginOverlay").style.display = "none";
    }
}
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
let name = localStorage.getItem("currentUser") || "ผู้ใช้งาน"; 

        chart.update();

        // เสียงจบและสรุปผล
        playBeep(1200, 0.15);
        
        // เงื่อนไขการพูดเตือน (AI พากย์ตามจริง)
        if (hydration < 70) {
            speak('วิเคราะห์เสร็จแล้วครับ คุน'+ name +'เริ่มมีภาวะขาดน้ำ ระดับน้ำอยู่ที่'+ hydration);
            speak(' เปอร์เซ็นต์โปรดดื่มน้ำทันทีครับ ');
        } else if (glucose > 110)
            {
            speak('วิเคราะห์เสร็จแล้วครับ ระดับน้ำตาลในเหงื่อค่อนข้างสูง  อยู่ที่ '+ glucose);
            speak(' มิลลิกรัมต่อเดซิลิตรครับ ');
        } else {
            speak('วิเคราะห์เสร็จเรียบร้อย สภาวะร่างกายของคุณ'+ name +'ปกติดีครับ');
        }

    }, 1500);
}
window.addEventListener('load', () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById("loginOverlay").style.display = "none";
        
        // ดึงชื่อที่เคยเก็บไว้มาแสดงผลด้วย
        const savedName = localStorage.getItem("currentUser");
        if(savedName) {
            document.getElementById("userNameDisplay").innerText = savedName;
        }
    }
});