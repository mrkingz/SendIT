const checkAuth = async () => {
	let user;
	const token = localStorage.getItem('token');
	if (token) {
		user = await fetch(new Request('/api/v1/auth/verifyAuth', {
			method: 'POST',
			body: JSON.stringify({ token }),
			headers: new Headers({
				Accept: 'application/json',
				'Content-Type': 'application/json',
			})
		}))
		.then(res => res.json())
		.then((res) => {
			if (res.data.user) {
				const { firstname, lastname, isadmin } = res.data.user;
				document.getElementById('name').innerHTML = `${firstname} ${lastname}`;
				document.getElementById('role').innerHTML = isadmin ? `(Administrator)` : '';
				return res.data.user;
			}
		});
	}
	if (!user) {
		window.location.href = '/signin';
	}

	return user;
};

const authUser = checkAuth();