'use client'

import React, { useEffect, useState } from "react";

const Page = () => {

	const [state, setState] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('http://localhost:3000/api/todoItem') //, { method: "GET" })
				const data = await res.json()
				// console.log(data)
				setState(data)
				setLoading(false)

				console.log("fetched todos")
			}
			catch (error) {
				setError(error)
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (loading) {
		return <div>Loading...</div>
	}
	if (error) {
		return <div>Error: {error.message}</div>
	}

	return (
		<div>
			<h1>Todo Item</h1>
			<ul>
				{state.map((task) => (
					<li key={task.id}> {task.id} {task.title} </li>
				))}
			</ul>
		</div>
	);
}

export default Page;