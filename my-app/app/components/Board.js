
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";

import Column from "./Column"

const Board = (props) => {

	const [state, setState] = useState(null);
	const [columnsData, setColumnsData] = useState(null);

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('http://localhost:3000/api/courses') //, { method: "GET" })
				const data = await res.json()
				// console.log(data)
				setState(data)
				setColumnsData(data['semesters'])
				setLoading(false)

				// console.log("fetched courses")
			}
			catch (error) {
				setError(error)
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const moveCard = useCallback(
		({
			movedCardIndexInSourceColumn,
			sourceColumnId,
			destinationColumnId,
			movedCardIndexInDestinationColumn,
		}) => {
			// Get data of the source column
			const sourceColumnData = columnsData[sourceColumnId];

			// Get data of the destination column
			const destinationColumnData = columnsData[destinationColumnId];

			console.log("movedCardIndexInSourceColumn", movedCardIndexInSourceColumn)

			// Identify the card to move
			const cardToMove = sourceColumnData.courses[movedCardIndexInSourceColumn];
			console.log("cardToMove", cardToMove)

			// Remove the moved card from the source column
			const newSourceColumnData = {
				...sourceColumnData,
				courses: sourceColumnData.courses.filter(
					(card) => card.id !== cardToMove.id
				),
			};

			// Create a copy of the destination column's cards array
			const newDestinationCards = Array.from(destinationColumnData.courses);

			// Determine the new index in the destination column
			const newIndexInDestination = movedCardIndexInDestinationColumn ?? 0;

			// Insert the moved card into the new index in the destination column
			newDestinationCards.splice(newIndexInDestination, 0, cardToMove);

			// Create new destination column data with the moved card
			const newFinishColumnData = {
				...destinationColumnData,
				courses: newDestinationCards,
			};

			// Update the state with the new columns data
			setColumnsData({
				...columnsData,
				[sourceColumnId]: newSourceColumnData,
				[destinationColumnId]: newFinishColumnData,
			});
		},
		[columnsData]
	);

	const reorderCard = useCallback(
		({ columnId, startIndex, finishIndex }) => {

			console.log({ columnId, startIndex, finishIndex })
			// Get the source column data
			const sourceColumnData = columnsData[columnId];

			// Call the reorder function to get a new array
			// of cards with the moved card's new position
			const updatedItems = reorder({
				list: sourceColumnData.courses,
				startIndex,
				finishIndex,
			});

			// Create a new object for the source column 
			// with the updated list of cards
			const updatedSourceColumn = {
				...sourceColumnData,
				courses: updatedItems,
			};



			// Update columns state
			setColumnsData({
				...columnsData,
				[columnId]: updatedSourceColumn,
			});
		},
		[columnsData]
	);

	const handleDrop = useCallback(({ source, location }) => {
		// Early return if there are no drop targets in the current location
		const destination = location.current.dropTargets.length;
		if (!destination) {
			return;
		}
		// Check if the source of the drag is a card to handle card-specific logic
		if (source.data.type === "card") {
			// Retrieve the ID of the card being dragged
			const draggedCardId = source.data.cardId;
			console.log("draggedCardId", draggedCardId)

			// Get the source column from the initial drop targets
			const [, sourceColumnRecord] = location.initial.dropTargets;


			// Retrieve the ID of the source column
			const sourceColumnId = sourceColumnRecord.data.columnId;
			console.log("sourceColumnId", sourceColumnId)

			// Get the data of the source column
			const sourceColumnData = columnsData[sourceColumnId];
			console.log("sourceColumnData", sourceColumnData)

			// Get the index of the card being dragged in the source column
			const draggedCardIndex = sourceColumnData.courses.findIndex(
				(card) => card.id === draggedCardId
			);
			console.log("draggedCardIndex", draggedCardIndex)

			if (location.current.dropTargets.length === 1) {
				console.log(
					"dropTargets1",
					location.current.dropTargets,
					location.current.dropTargets.length
				);

				// Get the destination column from the current drop targets
				const [destinationColumnRecord] = location.current.dropTargets;

				// Retrieve the ID of the destination column
				const destinationColumnId = destinationColumnRecord.data.columnId;
				console.log("destinationColumnId", destinationColumnId)

				// check if the source and destination columns are the same
				if (sourceColumnId === destinationColumnId) {
					// Calculate the destination index for the dragged card within the same column
					const destinationIndex = getReorderDestinationIndex({
						startIndex: draggedCardIndex,
						indexOfTarget: sourceColumnData.courses.length - 1,
						closestEdgeOfTarget: null,
						axis: "vertical",
					});

					console.log("draggedCardIndex", draggedCardIndex)
					console.log("destinationIndex", destinationIndex)

					// will implement this function
					reorderCard({
						columnId: sourceColumnData.id,
						startIndex: draggedCardIndex,
						finishIndex: destinationIndex,
					});
					return;
				}

				moveCard({
					movedCardIndexInSourceColumn: draggedCardIndex,
					sourceColumnId,
					destinationColumnId,
				});
				return;


			}

			// Check if the current location has exactly two drop targets
			if (location.current.dropTargets.length === 2) {
				// Destructure and extract the destination card and column data from the drop targets
				const [destinationCardRecord, destinationColumnRecord] =
					location.current.dropTargets;

				// Extract the destination column ID from the destination column data
				const destinationColumnId = destinationColumnRecord.data.columnId;

				// Retrieve the destination column data using the destination column ID
				const destinationColumn = columnsData[destinationColumnId];

				// Find the index of the target card within the destination column's cards
				const indexOfTarget = destinationColumn.courses.findIndex(
					(card) => card.id === destinationCardRecord.data.cardId
				);

				// Determine the closest edge of the target card: top or bottom
				const closestEdgeOfTarget = extractClosestEdge(
					destinationCardRecord.data
				);

				console.log(closestEdgeOfTarget);

				// Check if the source and destination columns are the same
				if (sourceColumnId === destinationColumnId) {
					// Calculate the destination index for the card to be reordered within the same column
					const destinationIndex = getReorderDestinationIndex({
						startIndex: draggedCardIndex,
						indexOfTarget,
						closestEdgeOfTarget,
						axis: "vertical",
					});

					// Perform the card reordering within the same column
					reorderCard({
						columnId: sourceColumnId,
						startIndex: draggedCardIndex,
						finishIndex: destinationIndex,
					});

					return;
				}

				const destinationIndex =
					closestEdgeOfTarget === "bottom"
						? indexOfTarget + 1
						: indexOfTarget;

				moveCard({
					movedCardIndexInSourceColumn: draggedCardIndex,
					sourceColumnId,
					destinationColumnId,
					movedCardIndexInDestinationColumn: destinationIndex,
				});
			}
		}
	}, [columnsData, reorderCard, moveCard]);

	useEffect(() => {
		return monitorForElements({
			onDrop: handleDrop,
		});
	}, [handleDrop]);

	if (loading) {
		return <div>Loading...</div>
	}
	if (error) {
		return <div>Error: {error.message}</div>
	}

	return (
		<div className="board">
			{/* <pre>{JSON.stringify(state, null, 4)}</pre> */}
			{/* <h1>Courses</h1>
			{state["courses"]
				?
				// <Column key={0} id="course-list" columnData={state["courses"]} />
				// <pre key={0}>{JSON.stringify(state["courses"], null, 4)}</pre>
				<div className="courselist-container">
					{state['courses'].map((c) => (
						<pre key={c['id']}>{c["title"]}</pre>
					))}
				</div>
				: <div> No course list data </div>
			}
			<h1>Semesters</h1> */}

			{columnsData
				?
				Object.keys(columnsData).map((columnKey) => (
					<Column key={columnKey} {...columnsData[columnKey]} />
					// <pre key={item['id']}>{JSON.stringify(item, null, 4)}</pre>
					// <div key={columnId}>{columnId}: {columnsData[columnId]["courses"].length}</div>
				))
				: <div>None </div>
			}

		</div>
	)
}

export default Board