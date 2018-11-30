const checkAuth = async () => {
    let user;
    const token = localStorage.getItem('token');
    if (token) {
        user = await fetch(`/api/v1/auth/${token}/verify`)
        .then(res => res.json())
        .then((res) => {
            return res.data.user;
        });
    }
    
    if (!user) {
      window.location.href = '/signin';
    }
};
  
checkAuth();