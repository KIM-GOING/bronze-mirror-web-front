export async function logout() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/index.html';
    return;
  }

  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('로그아웃 성공');
      window.location.href = '/index.html';
    } else {
      console.warn('서버 응답 이상:', result.message);
    }
  } catch (e) {
    console.error('로그아웃 요청 실패:', e);
  } finally {
    localStorage.clear();
    window.location.href = '/index.html';
  }
}

// 로그아웃 버튼 이벤트 연결 함수도 내보내기
export function bindLogoutButton(buttonId = 'logoutBtn') {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener('click', logout);
  }
}
