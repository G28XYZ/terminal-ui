import os from 'os';
import path from 'path';
import { spawn } from "./spawn";
import { loadingShell } from "./loading_shell";

import { WS_TERM_PORT } from '@app/constants';

export const walkBack = (count: number) => Array.from({ length: count }, () => '..');

const rootDir = path.join(__dirname, ...walkBack(4))

const shellType = os.platform() === 'win32' ? 'powershell.exe' : 'bash';


const server = Bun.serve<{ bash: ReturnType<typeof spawn> }, {}>({
	port: WS_TERM_PORT,
	fetch(req, serv) {
		const success = serv.upgrade(req, {
			data: { createdAt: Date.now() },
		});
	},
	websocket: {
		async open(ws) {
			const bash = spawn(shellType, [], {
				env : process.env,
				cwd : rootDir,
				cols: 80,
				rows: 30
			})

			ws.data = { bash };

			const start_interval = await loadingShell(ws, bash);

			bash.onData((data) => {
				clearInterval(start_interval);
				ws.send(data);
			});

		},

		message(ws, message) {
			const { bash } = ws.data;
			if (bash && typeof message === 'string') {
				const enc = new TextEncoder();
				// ws.send(enc.encode(String(message)))
				bash.write(message);
			}
		},

		close(ws) {
			const { bash } = ws.data;
			if (bash) bash.kill();
		},
	},
})

console.log(`Web term server running at wss://localhost:${server.port}`);