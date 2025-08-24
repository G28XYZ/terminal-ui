import app_front from '@app/frontend/index.html';

export default {
	port: 3001,
	routes: {
		'/': app_front
	},
	fetch() {
		return app_front
	}
}

console.log('start api http://localhost:3001');

await import('./webterm');