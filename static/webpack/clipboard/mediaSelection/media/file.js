import React from 'react';
import FileIcon, { defaultStyles } from 'react-file-icon';

export default function File(props) {
	const {file} = props;
	let ext = (file || "").split(".").pop() || "";
	ext = ext.toLowerCase();
	let iconStyle = defaultStyles[ext];
	return (
		<div className="media-icon-container" onClick={props.onClick}>
			<FileIcon {...iconStyle} extension={ext}/>
			<div className={props.infoClassName}>{props.name}</div>
			<div className={props.infoClassName}>{props.sender}</div>
		</div>
	);
}

export const FILE = "file";