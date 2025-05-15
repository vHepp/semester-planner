export async function GET() {
	console.log("In route.js")

	const res = await fetch("http://localhost:5000/semester_planner");

	const data = await res.json()
	// console.log(data)

	return Response.json(data)

}