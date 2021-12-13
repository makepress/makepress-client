import React, { useEffect, useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";

interface Props {
    name: string,
    update_callback: (name: string) => Promise<State>,
    start_callback: (name: string) => void,
    stop_callback: (name: string) => void
}

type Status = "starting" | "running" | "failing" | "offline" | "unknown"; 

interface State {
    wordpress_status: Status
    database_status: Status
}

export default function InstanceBox2(props: Props) {
    const [state, setState] = useState<State>({
        wordpress_status: "unknown",
        database_status: "unknown"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            props.update_callback(props.name)
                .then(s => setState(s));
        }, 5000);
        return () => clearInterval(interval);
    }, [state]);

    let wordpress_badge = <Badge bg="secondary">Unknown</Badge>;
    let database_badge = <Badge bg="secondary">Unknown</Badge>;
    switch(state.wordpress_status) {
        case "starting":
            wordpress_badge = <Badge bg="sarning">Starting</Badge>;
            break;
        case "running":
            wordpress_badge = <Badge bg="success">Running</Badge>;
            break;
        case "failing":
            wordpress_badge = <Badge bg="danger">Failing</Badge>;
            break;
        case "offline":
            wordpress_badge = <Badge bg="info">Offline</Badge>;
            break;
    }
    switch(state.database_status) {
        case "starting":
            database_badge = <Badge bg="sarning">Starting</Badge>;
            break;
        case "running":
            database_badge = <Badge bg="success">Running</Badge>;
            break;
        case "failing":
            database_badge = <Badge bg="danger">Failing</Badge>;
            break;
        case "offline":
            database_badge = <Badge bg="info">Offline</Badge>;
            break;
    }
    return <Card>
        <Card.Body>
            <Card.Title>{props.name}</Card.Title>
            <Card.Text>Wordpress Status: {wordpress_badge}</Card.Text>
            <Card.Text>Database Status: {database_badge}</Card.Text>
            <Button variant="success" onClick={() => props.start_callback(props.name)}>Start</Button>
            <Button variant="danger" onClick={() => props.stop_callback(props.name)}>Stop</Button>
        </Card.Body>
    </Card>
}