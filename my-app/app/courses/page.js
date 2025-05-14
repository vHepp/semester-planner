'use client'

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Page = () => {

	console.log("\n~~~~~~~start here~~~~~~~\n")

	const [state, setState] = useState(["bas"]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('http://localhost:3000/api/courses') //, { method: "GET" })
				const data = await res.json()

				console.log(data)

				setState(data)
				setLoading(false)
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
		<div className="wrapper">
			<ol style={{ display: "flex" }}>
				{state.map(element => (
					<li key={element.id}>{element.title}</li>
				))}
			</ol>
		</div >
	);
}

export default Page; 