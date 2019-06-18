class IndentStack {
	constructor () {
		this.stack = [0];
	}

	last () {
		return this.stack[this.stack.length - 1];
	}

	push (values) {
		this.stack.push(values);
	}

	pop () {
		if (this.stack.length === 1) throw new Error("Do not pop the base indent level.");
		return this.stack.pop();
	}

	contains (value) {
		return this.stack.includes(value);
	}

	clear (foreach = () => {}) {
		while (this.stack.length > 1) {
			foreach(this.pop());
		}
	}
}

function parseTemplateLiteral (string = "", placeholders = []) {
	return Array()
		.concat(string)
		.map((chunk, i) => {
			return (placeholders[i] !== undefined)
				? chunk + placeholders[i]
				: chunk
		})
		.join("")
		.trim();
}

function render (input, placeholders) {
	const string = (input instanceof Array)
		? parseTemplateLiteral(input, placeholders)
		: input;

	const indentStack = new IndentStack();
	const lines = string.trim().split(/\n/);
	const indentation = lines.map((line, lineNumber) => {
		const currIndent = line.match(/^\s*/)[0].length;
		if (currIndent > indentStack.last()) {
			indentStack.push(currIndent);
			return ["INDENT", line.trim()];
		} else if (currIndent < indentStack.last()) {
			if (!indentStack.contains(currIndent)) throw new Error(`Inconsistent indent at line ${lineNumber + 1}`);
			while (currIndent < indentStack.last()) {
				indentStack.pop();
				return ["DEDENT", line.trim()];
			}
		}
		return line.trim();
	}).flat();
	indentStack.clear(() => indentation.push("DEDENT"));

	const structure = indentation.map(partial => {
		if (["INDENT", "DEDENT"].includes(partial)) return partial;

		const {
			tagname,
			id,
			classlist,
			attributes,
			content
		} = (partial
			.trim()
			.match(/^(?<tagname>\w+)(?<id>#\w+)?(?<classlist>\.\w+(?:\.\w+)*)*(?<attributes>\[(?:\w+(?:\s*=\s*.+)?)+(?:,\s*\w+(?:\s*=\s*\w+)?)*\])?\s*(?<content>"[^"]*")?/)||{groups:{}}).groups;
		
		if (tagname === undefined) return {content: partial.slice(1, - 1)};
		
		const element = { tagname };
		if (id) element.id = id.substring(1);
		if (classlist) element.classlist = classlist
			.split(/\./)
			.slice(1);
		if (attributes) element.attributes = [...attributes
			.slice(1, -1)
			.split(/,\s*/)
			.map(attribute => {
				const [key, value] = attribute.split(/=/);
				return [key, value || ""]})];
		if (content) element.content = content.slice(1, -1);

		return element;
	});

	const tree = {type: "document"};
	let i = 0;
	let root = tree;
	while (i < structure.length) {
		const current = structure[i];
		const next = structure[i + 1];
		if (["INDENT", "DEDENT"].includes(current)) {
			i += 1;
			continue;
		}

		i += 1;
	}

	return structure;
}

function html (input, placeholders) {
	//
}