document.addEventListener("DOMContentLoaded", function() {
    const inputContainer = document.getElementById("input-container");
    const clearBtn = document.getElementById("clearBtn");
    const submitBtn = document.getElementById("submitBtn");

    // 動態生成 1 到 10 的輸入框
    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.className = "input-row";

        const label = document.createElement("label");
        label.textContent = i + ".";
        
        const input = document.createElement("input");
        input.type = "text";
        input.className = "tracking-input";
        input.maxLength = 12;

        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        row.appendChild(label);
        row.appendChild(input);
        inputContainer.appendChild(row);
    }

    // 「清除重填」按鈕功能
    clearBtn.addEventListener("click", function() {
        const inputs = document.querySelectorAll(".tracking-input");
        inputs.forEach(input => {
            input.value = "";
        });
    });

    // 「確認送出」按鈕功能
    submitBtn.addEventListener("click", function() {
        const inputs = document.querySelectorAll(".tracking-input");
        let trackingNumbers = [];
        
        inputs.forEach(input => {
            if (input.value.trim() !== "") {
                trackingNumbers.push(input.value.trim());
            }
        });

        if (trackingNumbers.length === 0) {
            alert("請至少輸入一筆包裹查詢號碼！");
        } else {
            alert("送出的包裹號碼有：\n" + trackingNumbers.join("\n"));
        }
    });
});