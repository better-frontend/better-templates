export default function render (template) {
	//Accepts a string with the following format:
	//Starts with a tagname (\w+)
	//followed by 1 or 0 #id (#\w+)
	//followed by 0 or more .class (\.\w+)
	//followed by 1 or 0 [...]
	//	where ... = 1 or more attribute(=value)?
	//	where every match is separated by a comma and 0 or more spaces
	//followed by 1 or 0 "content"
	// followed by 1 or more > ...
	//	where ... = the entire pattern as described above.

	function createElement (partial) {
		const {
			tagname = "div",
			id,
			classlist,
			attributes,
			content
		} = partial
			.trim()
			.match(/^(?<tagname>\w+)(?<id>#\w+)?(?<classlist>\.\w+(?:\.\w+)*)*(?<attributes>\[(?:\w+(?:\s*=\s*.+)?)+(?:,\s*\w+(?:\s*=\s*\w+)?)*\])?\s*(?<content>"[^"]*")?/).groups;
		const element = document.createElement(tagname);

		if (id) element.id = id.substring(1);
		if (classlist) element.classList.add(...classlist.split(/\./).filter(token => token !== ""));
		if (attributes) attributes
			.slice(1, -1)
			.split(/,\s*/)
			.forEach(attribute => {
				const [key, value] = attribute.split(/=/);
				element.setAttribute(key, value || "");
			});
		if (content) element.innerText = content.slice(1, -1);

		return element;
	}

	const elements = template
		.split(/\s*>\s*/)
		.map(partial => createElement(partial));

	elements
		.reduce((parent, element) => {
			parent.appendChild(element);
			return element;
		});

	return elements[0];
}