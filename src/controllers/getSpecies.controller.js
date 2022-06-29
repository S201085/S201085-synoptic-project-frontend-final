async function GetAllSpecies() {
  const req = await fetch(`${process.env.REACT_APP_API_URL}/species`, {});
  return req.json();
}
export { GetAllSpecies };
