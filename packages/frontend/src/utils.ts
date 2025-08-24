import { ITerminalAddon, Terminal } from "@xterm/xterm"

export const createAddon = (instance: string | (new (...args: any[]) => any), actions: Partial<ITerminalAddon> = {}): ITerminalAddon & { message?: string } => {

	const { activate = (term: Terminal) => {}, dispose = () => {} } = actions;

	if(typeof instance === 'string') return new class {
			id = instance;
			activate = activate.bind(this)
			dispose  = dispose.bind(this)
		}

	const name = String(instance);

	return new class extends instance {
		id = name
		constructor(...args: any[]) {
			super(...args)
		}
		activate(term: Terminal) {
			super.activate(term);
			activate(term);
		}

		dispose() {
			super.dispose();
			dispose();
		}
	}
}