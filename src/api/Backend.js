const BASE_URL = "http://localhost:5000";

// 🔐 LOGIN (Wallet)
export async function loginUser(wallet){
  const res = await fetch(`${BASE_URL}/login`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({ wallet })
  });

  return await res.json();
}

// 📷 UPLOAD IMAGE
export async function uploadImage(file){
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`,{
    method:"POST",
    body: formData
  });

  return await res.json();
}

// 👤 UPDATE PROFILE
export async function updateProfile(data){
  const res = await fetch(`${BASE_URL}/profile`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}