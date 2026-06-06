The express() function is the top-level function exported by the Express module. It creates an Express application instance (conventionally named app).

Express.js
+1
The properties and methods associated with Express are broken down below into two sections: the built-in properties/methods attached directly to the main express object, and the properties/methods available on the generated app instance.

Express.js
+3

1. Built-In Methods of the express Object
   These methods are accessed directly from the imported module (e.g., express.json()). They are primarily used to handle built-in middleware and sub-routing:

Express.js
+3
express.json(): Parses incoming requests containing JSON payloads.
express.raw(): Parses incoming requests as a raw Buffer payload.
express.text(): Parses incoming requests as plain text strings.
express.urlencoded(): Parses incoming requests with URL-encoded payloads (like HTML form submissions).
express.static(): Serves static files and assets like HTML, images, and CSS.
express.Router(): Creates an isolated, mini-instance of an Express router to modularize your code.

Express.js
+4 2. Properties of the Application Instance (app)
When you initialize your server using const app = express();, the resulting app object contains configuration and state properties:

Express.js
+3
app.locals: An object storing local variables that persist across the entire lifespan of the application.
app.mountpath: A string or pattern containing the path pattern(s) on which a sub-app was mounted. 3. Methods of the Application Instance (app)
The app instance contains methods for setting up configurations, routing HTTP traffic, and spinning up your server.

Express.js
+2
Routing & HTTP Methods
These register route handlers for targeted HTTP request verbs:

W3Schools
+2
app.get(path, callback): Handles HTTP GET requests.
app.post(path, callback): Handles HTTP POST requests.
app.put(path, callback): Handles HTTP PUT requests.
app.delete(path, callback): Handles HTTP DELETE requests.
app.patch(path, callback): Handles HTTP PATCH requests.
app.options(path, callback): Handles HTTP OPTIONS requests.
app.head(path, callback): Handles HTTP HEAD requests.
app.all(path, callback): Handles all HTTP methods for a specified route.

W3Schools
+4
Configuration & Settings
These manage custom environment variables, template setups, and engine toggles:

Express.js
+1
app.set(name, value): Assigns a setting name to a specific value.
app.get(name): Retrieves the value of a configuration setting name.
app.enable(name): Sets the boolean configuration setting name to true.
app.disable(name): Sets the boolean configuration setting name to false.
app.enabled(name): Returns true if the configuration setting name is enabled.
app.disabled(name): Returns true if the configuration setting name is disabled.
app.engine(ext, callback): Registers a custom template engine for rendering views.

Express.js
+4
Middleware & Pipeline Management
These control the request-response lifecycle flow:

Express.js
+1
app.use([path], middleware): Mounts specified middleware functions globally or to specific paths.
app.param(name, callback): Triggers special logic when specific routing parameters match a request.
app.route(path): Returns an instance of a single route, useful for chaining multi-verb handlers to avoid duplicate path code.

Express.js
+4
Lifecycle & Rendering
These handle server activation and string HTML compilation:

Express.js
app.listen(port, [callback]): Binds and listens for connections on a specified port.
app.render(view, [locals], callback): Renders a view template into an HTML string.
app.path(): Returns the absolute canonical path of the application as a string.

Express.js
+4
For an exhaustive technical breakdown of specific parameter configurations across Express releases, you can check the Express.js API Documentation.
