// 회원정보 수정 버튼
document.getElementById("editBtn").addEventListener("click", () => {
  alert("🛠 회원정보 수정 모달이 열립니다. (모달 UI는 추후 구현)");
});

// 회원 탈퇴 버튼
document.getElementById("deleteBtn").addEventListener("click", () => {
  const confirmDelete = confirm("정말 탈퇴하시겠습니까?");
  if (confirmDelete) {
    alert("회원 탈퇴가 완료되었습니다.");
    // → 실제 로직은 서버 연동 후 추가
  }
});

// 이미지 카드 삭제
document.querySelectorAll(".delete-card-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    card.remove();
    alert("🗑 이미지가 삭제되었습니다.");
  });
});
