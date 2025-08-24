import React, { FC, useEffect, CSSProperties, useState } from 'react';
import { useXTerm } from 'react-xtermjs';
import { ITerminalInitOnlyOptions, ITerminalOptions, Terminal as Term } from '@xterm/xterm';
import jsxRuntime from 'react/jsx-runtime';

import { WebLinksAddon } from '@xterm/addon-web-links';
import { AttachAddon } from '@xterm/addon-attach';
import { FitAddon } from '@xterm/addon-fit';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { SearchAddon } from '@xterm/addon-search';
import { WS_TERM_URL } from '@app/constants';

import { TermAddons, useStartTerm } from './useStartTerm';
import { createAddon } from './utils';

import './style.css';

const addons: TermAddons = [
	new WebLinksAddon(),
	new SearchAddon(),
	new FitAddon(),
	(params) => new AttachAddon(params.ws),
	createAddon(Unicode11Addon, { activate: (term) => { term.unicode.activeVersion = '11' } }),
	createAddon('startTermAddon', {
		activate(term) {
			const startingMessage = this.message;
			term.write(new TextEncoder().encode(startingMessage));
		}
	}),
]

const options: ITerminalOptions & ITerminalInitOnlyOptions = {
			cursorBlink      : true,
			allowProposedApi : true,
			fontFamily       : 'FiraCodeNerdFont Mono',
			fontSize         : 14,
			cursorStyle      : 'underline',
			allowTransparency: true,
			theme            : { background: 'rgb(12, 16, 23, 0.8)' },
		}

const style: CSSProperties = {
			// width               : 'max-content',
			// height              : 'max-content',
			fontVariantLigatures: 'contextual',
			borderRadius        : 5,
			borderWidth         : 5,
			borderStyle         : 'solid',
			borderColor         : options.theme.background,
			backgroundColor     : options.theme.background,
			overflow            : 'auto',
			fontFamily          : 'FiraCodeNerdFont Mono',
		}

const TermChild: FC<{ terminal: Term; }> = ({ terminal }) => {
	const [term, setTerm] = useState<Term>();

	useEffect(() => {
		setTerm(terminal);
		return () => setTerm(null);
	}, []);

	return null;
}

export const Terminal = () => {
	const { addons: _addons, terminalRef, terminal } = useStartTerm({ wsUrl: WS_TERM_URL, addons });
	
	const { ref } = useXTerm({ addons: _addons, options });

	return jsxRuntime.jsx(
		"div",
		{
			className: 'terminal',
			ref: ref,
			style: { ...style },
			children: terminal && <TermChild terminal={terminal} />
		}
	);
}
