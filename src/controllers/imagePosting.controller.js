async function PostImage(data) {
  const req = await fetch("https://api.cloudinary.com/v1_1/uos-s201085/upload", { method: "POST", body: data });
  return req.json();
}
export { PostImage };
