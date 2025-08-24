import { ServerWebSocket } from "bun";
import { spawn } from "./spawn";

let start_interval: ReturnType<typeof setInterval>;
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export const loadingShell = async (ws: ServerWebSocket<any>, shell: ReturnType<typeof spawn>) => {
	return new Promise<ReturnType<typeof setInterval>>(resolve => {
		const createEncText = (text: string) => new TextEncoder().encode(text);
		const send = (text: string) => ws.send(createEncText(text));
	
		let timeout = setTimeout(() => {
			clearTimeout(timeout);
			let dots = '...';
			let i = 0;
			
			send('\x1b[2K');
			send('\rConnection success ✅');
			timeout = setTimeout(() => {
				clearTimeout(timeout);
				send('\x1b[2K');
				start_interval = setInterval(() => {
					resolve(start_interval)
					send('\b');
					// send(`\rLoading ${dots}`);
					// dots.length >= 3 ? dots = '' : dots += '.';
					send(`\rLoading ${frames[i]}`);
					dots.length >= 3 ? dots = '' : dots += '.';
					frames[i + 1] ? i += 1 : i = 0;
				}, 80);
			}, 1000)
		}, 1000);
	})
}