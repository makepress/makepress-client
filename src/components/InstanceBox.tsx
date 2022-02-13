import React, { useState } from "react";
import { Badge, Button, Card, ProgressBar } from "react-bootstrap";
import useTimeout from "../hooks/useTimeout";

interface Props {
    name: string,
    domain: string,
    update_interval: number,
    update_callback: () => Promise<State>,
    start_callback: () => void,
    stop_callback: () => void,
    destroy_callback: () => void,
}

type Status = "Starting" | "Running" | "Failing" | "Offline" | "Unknown"; 

interface State {
    wordpress_status: Status
    database_status: Status
}

export default function InstanceBox(props: Props) {
    const [state, setState] = useState<State>({
        wordpress_status: "Unknown",
        database_status: "Unknown"
    });
    const [progress, setProgress] = useState<number>(0);

    const timerRef = useTimeout(() => {
        if (progress <= 0) {
            setProgress(props.update_interval);
            props.update_callback().then(s => setState(s))
        } else {
            setProgress(p => p - 100);
        }
    }, 100);

    let wordpress_badge = <Badge bg="info">Unknown</Badge>;
    let database_badge = <Badge bg="info">Unknown</Badge>;
    switch(state.wordpress_status) {
        case "Starting":
            wordpress_badge = <Badge bg="sarning">Starting</Badge>;
            break;
        case "Running":
            wordpress_badge = <Badge bg="success">Running</Badge>;
            break;
        case "Failing":
            wordpress_badge = <Badge bg="danger">Failing</Badge>;
            break;
        case "Offline":
            wordpress_badge = <Badge bg="secondary">Offline</Badge>;
            break;
    }
    switch(state.database_status) {
        case "Starting":
            database_badge = <Badge bg="sarning">Starting</Badge>;
            break;
        case "Running":
            database_badge = <Badge bg="success">Running</Badge>;
            break;
        case "Failing":
            database_badge = <Badge bg="danger">Failing</Badge>;
            break;
        case "Offline":
            database_badge = <Badge bg="secondary">Offline</Badge>;
            break;
    }
    const start_compare: Status[] = ["Starting", "Running", "Unknown"];
    const start_disabled = (start_compare.indexOf(state.database_status) !== -1 && start_compare.indexOf(state.wordpress_status) !== -1);
    const stop_compare: Status[] = ["Unknown", "Offline"];
    const stop_disabled = (stop_compare.indexOf(state.database_status) !== -1 && stop_compare.indexOf(state.wordpress_status) !== -1);
    return <Card className="instance"  bg="dark" text="light">
        <Card.Body>
            <ProgressBar now={((props.update_interval - progress) / props.update_interval) * 100} animated variant="primary"/>
            <Card.Title>{state.wordpress_status === "Running" ? <a target="_blank" rel="noopener noreferrer" href={`http://${props.name}.${props.domain}`}>{props.name}</a> : props.name}</Card.Title>
            <Card.Text>Wordpress Status: {wordpress_badge}</Card.Text>
            <Card.Text>Database Status: {database_badge}</Card.Text>
            <div className="button-row">
                <Button variant="success" onClick={() => props.start_callback()} disabled={start_disabled}>Start</Button>
                <Button variant="danger" onClick={() => props.stop_callback()} disabled={stop_disabled}>Stop</Button>
                <div className="destroy-button"><Button size="sm" variant="danger" onClick={
                    () => {
                        if (timerRef.current !== undefined)
                            clearTimeout(timerRef.current);
                        props.destroy_callback();
                    }
                } disabled={start_disabled}>Destroy</Button></div>
            </div>
        </Card.Body>
    </Card>
}