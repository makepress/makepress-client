import { Ref, useState } from "react";
import { Container } from "react-bootstrap";
import InstanceBox from "./InstanceBox";

interface Props {
    domain: string,
    interval: number,
    instances: string[]
    destroy_callback: (name: string) => void,
}


export default function Instances(props: Props) {
    const names = props.instances;

    return <Container className="instances">{names.map((instanceName) => <InstanceBox
        key={instanceName}
        name={instanceName}
        domain={props.domain}
        update_interval={props.interval}
        update_callback={() => fetch(`http://api.${props.domain}/instance/${instanceName}`)
            .then(response => response.json())}
        start_callback={() => fetch(`http://api.${props.domain}/instance/${instanceName}/start`, {
            method: 'PUT'
        })}
        stop_callback={() => fetch(`http://api.${props.domain}/instance/${instanceName}/stop`, {
            method: 'PUT'
        })}
        destroy_callback={() => {props.destroy_callback(instanceName); fetch(`http://api.${props.domain}/instance/${instanceName}`, {
            method: 'DELETE'
        });}}
    />)}</Container>;
}