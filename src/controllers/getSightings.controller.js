
async function GetUserSightings() {
	const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting`, {
			headers: {
				'x-access-token': sessionStorage.getItem('token'),
			},
		})
    return req.json()        
}   
async function GetAllSightings() {
	const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting`, {
			
		})
    return req.json()        
} 
async function GetAllPublicSightings() {
	const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting`, {
		headers: {
			'visibility': 'everyone',
		},
		})
		return req.json()
}
async function GetNumberOfSightings(number) {
	const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting`, {
		headers: {
			'number-required': number,
		},
		})
    return req.json()        
} 
async function GetNumberOfPublicSightings() {
	const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting/recent`, {
		})
    return req.json()        
} 

async function GetSightingById(id) {
	const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting/`, {
		headers: {
		'get-by': id,
	}},
	{ method: "GET" })
return req.json()
}

async function DeleteSightingById(id) {
	const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting/`, {
		headers: {
		'delete-by': id,
	}},
	{ method: "DELETE" })
return req.json()
}

export {GetUserSightings, GetAllSightings, GetNumberOfSightings, GetNumberOfPublicSightings, GetAllPublicSightings, GetSightingById, DeleteSightingById};
