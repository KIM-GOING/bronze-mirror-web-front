document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  
  // JWT 토큰 가져오기
  const token = localStorage.getItem("accessToken"); // 필요에 따라 수정

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/post", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
      },
    });

    const result = await response.json();

    if (result.success) {
      result.data.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${item.imageUrl}" alt="게시글 이미지">
          <div class="card-info">
            <div class="avatar"></div>
            <div class="meta">
              <strong>${item.nickname}</strong>
              <span>${new Date(item.createdAt).toLocaleString('ko-KR')}</span>
            </div>
          </div>
        `;
        gallery.appendChild(card);
      });
    } else {
      alert("이미지 불러오기 실패: " + result.message);
    }
  } catch (err) {
    console.error("API 호출 오류:", err);
    alert("서버 연결에 실패했습니다.");
  }
  
});
