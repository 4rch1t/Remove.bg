const removeBtn = document.getElementById("removeBtn");
const fileInput = document.getElementById("fileInput");
const resultImage = document.getElementById("resultImage");
const downloadLink = document.getElementById("downloadLink");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const eraseBrush = document.getElementById("eraseBrush");
const restoreBrush = document.getElementById("restoreBrush");
const brushSize = document.getElementById("brushSize");

let isDrawing = false;
let brushMode = "erase";

removeBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an image first.");
    return;
  }

  removeBtn.textContent = "Processing...";
  removeBtn.disabled = true;

  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");
  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "ur api key here", 
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to remove background.");

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    resultImage.src = imageUrl;
    downloadLink.href = imageUrl;
    downloadLink.classList.remove("hidden");

    resultImage.onload = () => {
      canvas.width = resultImage.width;
      canvas.height = resultImage.height;
      ctx.drawImage(resultImage, 0, 0);
    };
  } catch (error) {
    alert("An error occurred. Please try again.");
  } finally {
    removeBtn.textContent = "Remove Background";
    removeBtn.disabled = false;
  }
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);

eraseBrush.addEventListener("click", () => (brushMode = "erase"));
restoreBrush.addEventListener("click", () => (brushMode = "restore"));

function startDrawing(e) {
  isDrawing = true;
  ctx.globalCompositeOperation = brushMode === "erase" ? "destination-out" : "source-over";
  draw(e);
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.beginPath();
  ctx.arc(x, y, brushSize.value / 2, 0, Math.PI * 2);
  ctx.fillStyle = brushMode === "erase" ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)";
  ctx.fill();
}

function stopDrawing() {
  isDrawing = false;
}
