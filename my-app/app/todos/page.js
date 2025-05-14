async function fetchData() {

	const res = await fetch('http://localhost:3000/api/todoItem', { method: "GET" })

	const data = res.json()

	console.log(data)

	return data
}

const Page = async () => {

	const tasks = await fetchData()

	return (
		<div>
			<h1>Todo Item</h1>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}> {task.id} {task.title} </li>
				))}
			</ul>
		</div>
	);
}

export default Page;