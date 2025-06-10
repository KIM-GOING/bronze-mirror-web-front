import { bindLogoutButton } from "./global.js";

const fileInput = document.getElementById("file-input");
const filenameField = document.getElementById("filename");
const inputImage = document.getElementById("input-image");
const outputImage = document.getElementById("output-image");
const generateButton = document.querySelector(".generate-button");

let uploadedImageUrl = ""; // 서버에 저장된 이미지 URL

document.addEventListener("DOMContentLoaded", () => {
  bindLogoutButton();
});

// 1. 업로드 → 왼쪽 프리뷰 & 서버 업로드드
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;
  
  // 로컬 저장소 열어서 사진 업로드
  filenameField.value = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    inputImage.src = e.target.result;
    outputImage.src = "";
  };
  reader.readAsDataURL(file);

  // 사진 업로드 api에 올리기 위한 이미지 포맷맷
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("accessToken");

  // 사진 업로드 api 연동
  try {
    const res = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const result = await res.json();

    if (res.ok && result.success) {
      uploadedImageUrl = result.data[0]; // 여러 개 중 첫 번째 이미지 사용
      console.log("업로드된 이미지 URL:", uploadedImageUrl);
    } else {
      alert("이미지 업로드 실패");
    }
  } catch (err) {
    console.error("업로드 중 오류", err);
    alert("이미지 업로드에 실패했습니다.");
  }
});

// 2. 이미지 생성 버튼 → 오른쪽에 결과 표시 + 서버에서는 이미 생성된 이미지 db에 저장 완료
generateButton.addEventListener("click", async () => {

  // 이미지 업로드 안했을 경우우
  if (!uploadedImageUrl) {
    alert("이미지를 먼저 첨부해주세요.");
    return;
  }

  const token = localStorage.getItem("accessToken");

  try {
    const res = await fetch("http://localhost:8080/api/predict", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imageUrl: uploadedImageUrl,
        prompt: "A front-facing portrait of a beautiful anime girl with soft brown straight hair and big round eyes",
        seed: 24473
      })
    });

    const result = await res.json();

    if (res.ok && result.success) {
      outputImage.src = result.data.savedImageUrl;
      console.log("생성된 이미지 URL:", result.data.savedImageUrl);
    } else {
      alert("이미지 생성 실패: " + result.message);
    }
  } catch (err) {
    console.error("이미지 생성 오류", err);
    alert("이미지 생성 중 문제가 발생했습니다.");
  }
});
