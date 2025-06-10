import { bindLogoutButton } from "./global.js";

// 닉네임 연동
const nickname = localStorage.getItem('nickname');
const nicknameElement = document.getElementById('nickname');
nicknameElement.textContent = `${nickname}님, 반가워요!`;

// 내 컬렉션 띄우기
document.addEventListener("DOMContentLoaded", () => {
  bindLogoutButton();

  const token = localStorage.getItem("accessToken");
  const container = document.getElementById("my-collection");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
    return;
  }

  fetch("http://localhost:8080/api/image/myImage", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(result => {
      if (!result.success) {
        alert("이미지 조회 실패: " + result.message);
        return;
      }

      const { images } = result.data;

      images.forEach(image => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${image.imageUrl}" alt="내 이미지">
          <div class="card-info">
            <div class="avatar"></div>
            <div class="meta">
              <strong>${localStorage.getItem("nickname")}</strong>
              <span>${new Date(image.date).toLocaleString('ko-KR')}</span>
            </div>
            <button class="delete-btn" data-id=${image.id}>삭제</button>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("API 호출 실패:", err);
      alert("서버 연결 실패");
    });
});

// 회원 탈퇴 버튼
document.getElementById("deleteBtn").addEventListener("click", async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  const confirmed = confirm('정말로 탈퇴하시겠습니까?');
  if (!confirmed) return;

  try {
    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert('탈퇴가 완료되었습니다.');
      localStorage.clear(); // 토큰 및 유저 정보 제거
      window.location.href = 'index.html';
    } else {
      alert('탈퇴에 실패했습니다: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('서버 오류로 탈퇴에 실패했습니다.');
  }
});

// 이미지 카드 삭제
document.getElementById("my-collection").addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const card = e.target.closest(".card");
    const imageId = e.target.dataset.id;
    const token = localStorage.getItem("accessToken");

    const confirmDelete = confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/posts/${imageId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (res.ok && result.success) {
        card.remove();
        alert("🗑 이미지가 삭제되었습니다.");
      } else {
        alert("삭제 실패: " + result.message);
      }
    } catch (err) {
      console.error("삭제 요청 중 오류 발생", err);
      alert("서버 오류로 삭제에 실패했습니다.");
    }
  }
});