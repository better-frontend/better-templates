"use strict";
"hide implementation";

function render (...args) {
	if (argumentWasTemplateLiteral(args[0]))
		return renderTemplateLiteral(args[0], args.slice(1));
	else
		return renderString(args[0], args[1]);
}

function html (...args) {
	return render(...args).outerHTML;
}

function argumentWasTemplateLiteral (arg) {
	return ((typeof arg[0] === "string") && arg.raw !== undefined);
}

function renderTemplateLiteral (partials, placeholders) {
	const partial = partials
		.map((partial, i) => partial + (placeholders[i] || ""))
		.join("");
	return renderString(partial);
}

function lex (input) {
	const lines = input
		.trim()
		.split(/\r?\n|\r|\f/) //Don't split on newline if inside quotes
		.filter(Boolean);
	const tokens = lines
		//De regel hieronder moet ook losse textNodes herkennen
		.map(line => line.match(/^(?<indentation>\s*)(?<tagname>\w+)(?<id>#?\w*)(?<classlist>(?:\.\w+(?:\.\w+)*)*)(?<attributes>(?:\[(?:\w+(?:\s*=\s*.+)?)+(?:,\s*\w+(?:\s*=\s*\w+)?)*\])*)\s*(?<content>(?:(?:"[^"]*")|(?:'[^']*')|(?:`[^`]*`))*)/).groups)
		.map(line => {
			if (line.text)
				return (console.log(line),Object.assign(line, {
					indentation: line.indentation.length,
					text: line.text.slice(1, -1)
				}));
			else return Object.assign(line, {
				indentation: line.indentation.length,
				id: line.id.substring(1),
				classlist: line.classlist
					.substring(1)
					.split(".")
					.filter(classname => classname !== ""),
				attributes: line.attributes
					.slice(1, -1)
					.split(/,\s*/)
					.map(attribute => attribute
						.split(/\s*=\s*(\S+)/)
						.slice(0, 2))
					.filter(attribute => attribute.every(Boolean)),
				content: line.content.slice(1, -1)
			});
		});
	return tokens;
}

function createElementFromToken (token) {
	if (token.text)
		return document.createTextNode(token.text);

	const node = document.createElement(token.tagname);
	if (token.id)
		node.id = token.id;
	if (token.classlist.length)
		node.className = token.classlist.join(" ");
	if (token.attributes.length)
		token.attributes.forEach(([attribute, value]) => node.setAttribute(attribute, value || "true"));
	if (token.content)
		node.textContent = token.content;

	return node;
}

class IndentStack {
	constructor (defaultLevel) {
		this.stack = [defaultLevel];
	}

	last () {
		return this.stack[this.stack.length - 1];
	}

	includes (val) {
		return this.stack.includes(val);
	}

	push (val) {
		this.stack.push(val);
		return this;
	}

	popTo (val) {
		if (!this.includes(val))
			throw new Error(`Irregular indentation (${val}).`);

		while (this.last() !== val)
			this.stack.pop();

		return this;
	}
}

class ParentStack {
	constructor (defaultParent) {
		this.stack = [defaultParent];
	}

	push (val) {
		this.stack.push(val);
		return this;
	}

	pop (count = 1) {
		while (count--)
			this.stack.pop();

		return this;
	}

	last () {
		return this.stack[this.stack.length - 1];
	}
}

function parse (tokens) {
	const rootToken = tokens.splice(0, 1)[0];
	const rootNode = createElementFromToken(rootToken);

	if (!tokens.every(token => token.indentation > 0))
		throw new Error("Only one root node is allowed.");

	if (rootToken.indentation > 0)
		throw new Error(`Expected file to start at indentation level 0, not ${rootToken.indentation}.`);

	const indentStack = new IndentStack(0);
	const parentStack = new ParentStack(rootNode);
	for (const token of tokens) {
		const node = createElementFromToken(token);
		if (token.indentation === indentStack.last()) {
			parentStack
				.pop()
				.last()
				.append(node);
			parentStack.push(node);
		} else if (token.indentation > indentStack.last()) {
			indentStack.push(token.indentation);
			parentStack
				.last()
				.append(node);
			parentStack.push(node);
		} else if (token.indentation < indentStack.last()) {
			indentStack.popTo(token.indentation);
			parentStack
				.pop(2)
				.last()
				.append(node);
			parentStack.push(node);
		}
	};

	return rootNode;
}

function renderString (string) {
	const lexed = lex(string);
	const parsed = parse(lexed);
	return parsed;
}

// Exporting like this should work in Node and browser environments.

try {
	export { render, html };
} catch {
	module.exports = { render, html };
}