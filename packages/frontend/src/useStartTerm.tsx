import { ITerminalAddon, ITerminalInitOnlyOptions, ITerminalOptions, Terminal } from "@xterm/xterm";
import { useEffect, useMemo, useRef, useState } from "react";
import { createAddon } from "./utils";

export interface IUseStartTerm {
	wsUrl   : string;
	addons ?: TermAddons;
	options?: ITerminalOptions & ITerminalInitOnlyOptions;
}

export interface IAddonInitParams {
	ws      ?: WebSocket;
	terminal?: Terminal;
	message ?: string;
}


export type TermAddons = Array<(ITerminalAddon & { id?: string; message?: string }) | ((params?: IAddonInitParams) => ITerminalAddon & { id?: string; message?: string })>;

export const useStartTerm = ({ wsUrl, addons=[], options={} }: IUseStartTerm) => {
	const ref     = useRef<HTMLElement>(null);
	const termRef = useRef<Terminal>(null);

	const setTermAddon = createAddon('setTermAddon', { activate: (term) => { termRef.current = term } });

	const [_addons, setAddons] = useState([]);
	const [ws, setWs] = useState<WebSocket>();

	useEffect(() => {
		!ws && setWs(new WebSocket(wsUrl));
	}, []);

	useEffect(() => {
		if(ws) {
			setAddons(prev => addons.map(item => typeof item === 'function' ? item({ ws, terminal: termRef.current }) : item).concat(setTermAddon));
		}
	}, [ws]);

	useEffect(() => {
		if(termRef.current) {
			ref.current = termRef.current?.element;
		}
	}, [termRef.current])

	return useMemo(() => ({
		addons     : _addons,
		w_socket   : ws,
		terminal   : termRef.current,
		terminalRef: ref
	}), [_addons, ws, termRef.current, ref.current])
}