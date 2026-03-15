export interface AuthHandler {
	handler(request: Request): Response | Promise<Response>;
}
