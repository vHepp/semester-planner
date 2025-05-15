'use client'



import Link from 'next/link'
// import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function MyNavbar() {
	return (
		<Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark" >
			<Container>
				<Nav className="me-auto">
					<Nav.Link href="/">Home</Nav.Link>
					<Nav.Link href="/courses">Courses</Nav.Link>
					<Nav.Link href="/about">About</Nav.Link>
					<Nav.Link href="/todos">Todo</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	)
}