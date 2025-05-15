import React, { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import invariant from "tiny-invariant";

import Card from './Card';


const Column = (props) => {
	const columnRef = useRef(null)
	const [isDraggedOver, setIsDraggedOver] = useState(false)

	const columnId = props.id
	const title = props.title
	const courses = props.courses

	useEffect(() => {
		const column_element = columnRef.current
		invariant(column_element)

		return dropTargetForElements({
			element: column_element,
			onDragStart: () => setIsDraggedOver(true),
			onDragEnter: () => setIsDraggedOver(true),
			onDragLeave: () => setIsDraggedOver(false),
			onDrop: () => setIsDraggedOver(false),
			getData: () => ({ columnId }),
			getIsSticky: () => true,
		})
	}, [columnId])


	return (
		<div
			className={'column'}
			ref={columnRef} // attach a columnRef to the column div
			style={{
				backgroundColor: isDraggedOver ? "lightblue" : "white",
			}}
		>
			<h2>{title}</h2>
			<h5>columnId: {columnId}</h5>
			<div>
				{courses.map(course => (
					<Card key={course.id} {...course}>{course.title}</Card>
				))}
			</div>
		</div >
	)
}

export default Column