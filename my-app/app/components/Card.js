import React, { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import invariant from "tiny-invariant";

const DropIndicator = ({ edge, gap }) => {
	const edgeClassMap = {
		top: "edge-top",
		bottom: "edge-bottom",
	};

	const edgeClass = edgeClassMap[edge];

	const style = {
		"--gap": gap,
	};

	return <div className={`drop-indicator ${edgeClass}`} style={style}></div>;
};

const Card = (props) => {

	const cardRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isDraggedOver, setIsDraggedOver] = useState(false)
	const [closestEdge, setClosestEdge] = useState(null);

	useEffect(() => {

		const card_element = cardRef.current
		invariant(card_element)

		return combine(
			draggable({
				element: card_element,
				getInitialData: () => ({ type: "card", cardId: props.id }),
				onDragStart() {
					setIsDragging(true)
				},
				onDrop() {
					setIsDragging(false)
				},
			}),
			dropTargetForElements({
				element: card_element,
				getData: ({ input, element }) => {
					const data = { type: "card", cardId: props.id };

					return attachClosestEdge(data, {
						input,
						element,
						allowedEdges: ['top', 'bottom']
					})
				},
				getIsSticky: () => false,
				onDragEnter: (args) => {
					if (args.source.data.cardId !== props.id) {
						console.log("onDragEnter", args)
						setIsDraggedOver(true)
						setClosestEdge(extractClosestEdge(args.self.data));
					}
				},
				onDragLeave: () => {
					setIsDraggedOver(false)
					setClosestEdge(null);
				},
				onDrag: (args) => {
					// Only update the closest edge if the card being dragged is not the same as the card
					if (args.source.data.cardId !== props.id) {
						setClosestEdge(extractClosestEdge(args.self.data));
					}
				},
				onDrop: () => {
					setIsDraggedOver(false)
					setClosestEdge(null);
				},
			})
		)

	}, [props.id])

	return <div className={`card ${isDragging ? "dragging" : ""}`} ref={cardRef}
		style={{
			backgroundColor: isDraggedOver ? "rgb(71, 164, 230)" : "white",
		}}>
		{props.children}
		{closestEdge && <DropIndicator edge={closestEdge} gap="2px" />}
	</div>
}

export default Card