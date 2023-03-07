import { Machines } from "../components/Machines/Machines";
import { MachineTypes } from "../components/MachineTypes/MachineTypes";
import { Record } from "../components/Record/Record";
import { Maintenances } from "../components/Maintenances/Maintenances";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export const FirstApp = () => {
    return (
        <>
            
            <div>
                <Navbar variant="dark" bg="dark" expand="lg">
                    <Container fluid>
                        <Navbar.Brand href="#home">
                            Machine Managment System
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbar-dark-example" />
                        <Navbar.Collapse id="navbar-dark-example">
                            <Nav>
                                <NavDropdown
                                    id="nav-dropdown-dark-example"
                                    title="Options"
                                    menuVariant="light"
                                >
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">
                                        Log Out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            <Machines />
            <MachineTypes />
            <Record />
            <Maintenances />
        </>
    );
};
