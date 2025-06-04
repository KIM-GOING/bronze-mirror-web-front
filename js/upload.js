const fileInput = document.getElementById("file-input");
const filenameField = document.getElementById("filename");
const inputImage = document.getElementById("input-image");
const outputImage = document.getElementById("output-image");

// 업로드 → 왼쪽에만 표시
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    filenameField.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      inputImage.src = e.target.result;
      outputImage.src = ""; // 오른쪽 초기화
    };
    reader.readAsDataURL(file);
  }
});

// 이미지 생성 버튼 → 오른쪽에 표시 (더미 기능)
document.querySelector(".generate-button").addEventListener("click", () => {
  if (!inputImage.src) {
    alert("이미지를 먼저 첨부해주세요.");
    return;
  }

  // 나중에 AI API 연동 시 여기에 fetch 넣기
  outputImage.src = inputImage.src;
});
