class StackVisualizer {
  constructor() {
		this.stack = [];
		this.capacity = 5;
		this.animationSpeed = 1000;
		this.isAnimating = false;
		this.operationCount = 0;
		this.comparisonCount = 0;
		this.scrolling = false;
		this.highlightShort = this.animationSpeed * 1.0;
		this.highlightMedium = this.animationSpeed * 1.5;
		this.highlightLong = this.animationSpeed * 2.0;
		this.initializeElements();
		this.setupEventListeners();
		this.updateDisplay();
		this.initializeCodeHighlighting();
	}

	initializeElements() {
		this.stackContainer = document.getElementById("stackContainer");
		this.stackSize = document.getElementById("stackSize");
		this.stackCapacity = document.getElementById("stackCapacity");
		this.lastOperation = document.getElementById("lastOperation");
		this.explanationText = document.getElementById("explanationText");
		this.codeDisplay = document.getElementById("codeDisplay");
		this.operationCountEl = document.getElementById("operationCount");
		this.comparisonCountEl = document.getElementById("comparisonCount");
		this.timeComplexityEl = document.getElementById("timeComplexity");
		this.speedSlider = document.getElementById("speedSlider");
		this.statsContainer = document.querySelector(".stats-display");
	}

	setupEventListeners() {
		this.speedSlider.addEventListener("input", (e) => {
			this.animationSpeed = 1100 - parseInt(e.target.value) * 100;
			this.highlightShort = this.animationSpeed * 1.0;
			this.highlightMedium = this.animationSpeed * 1.5;
			this.highlightLong = this.animationSpeed * 2.0;
		});

		document.getElementById("pushValue").addEventListener("keypress", (e) => {
			if (e.key === "Enter") this.pushElement();
		});

	}

	initializeCodeHighlighting() {
		const codeLines = this.codeDisplay.innerHTML.split('\n');
		let highlightedCode = '';
		codeLines.forEach((line, index) => {
			highlightedCode += line.trim() ? `<span class="code-line" data-line="${index + 1}">${line}</span>\n` : '\n';
		});
		this.codeDisplay.innerHTML = highlightedCode;
	}

	async scrollToElement(element) {
		if (this.scrolling || !element) return;
		this.scrolling = true;
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});
		await this.delay(500);
		this.scrolling = false;
	}

	async scrollToStats() {
		if (this.scrolling) return;
		this.scrolling = true;
		this.statsContainer.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
		await this.delay(500);
		this.scrolling = false;
	}

	async scrollToLine(lineNumber) {
		if (this.scrolling) return;
		this.scrolling = true;
		const line = this.codeDisplay.querySelector(`[data-line="${lineNumber}"]`);
		if (line) {
			line.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
		await this.delay(500);
		this.scrolling = false;
	}

	async scrollToVisualization() {
		if (this.scrolling) return;
		this.scrolling = true;
		this.stackContainer.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
		await this.delay(500);
		this.scrolling = false;
	}

	async highlightCodeLines(startLine, endLine, explanation, duration) {
		this.explanationText.textContent = explanation;
		const totalLines = endLine - startLine + 1;
		if (totalLines <= 0) return;
		const lineDelay = duration / totalLines;
		for (let i = startLine; i <= endLine; i++) {
			await this.scrollToLine(i);
			const line = this.codeDisplay.querySelector(`[data-line="${i}"]`);
			if (line) {
				line.classList.add("highlight-line");
				await this.delay(lineDelay);
				line.classList.remove("highlight-line");
			}
		}
	}

	async pushElement() {
		const input = document.getElementById("pushValue");
		const value = parseInt(input.value);
		if (isNaN(value) || value < 1 || value > 99) {
			return this.showError("Please enter a number between 1-99.");
		}
		if (this.isAnimating) {
			return this.showError("Animation in progress.");
		}
		input.value = "";
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animatePush(value);
		} 
		catch (error) {
			this.showError("Error: " + error.message);
		} 
		finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

  	async animatePush(value) {
		await this.highlightCodeLines(21, 21, `Checking stack capacity. Size: ${this.stack.length}/${this.capacity}`, this.highlightShort);
		let timeComplexity = 'O(1)';
		if (this.stack.length >= this.capacity) {
			await this.highlightCodeLines(22, 22, 'Stack is full. Resizing...', this.highlightShort);
			await this.animateResize();
			timeComplexity = 'O(n)';
		}
		await this.highlightCodeLines(24, 26, `Pushing ${value} onto the stack.`, this.highlightShort);
		if (this.stack.length === 0) {
			this.stackContainer.innerHTML = '';
			this.stackContainer.style.justifyContent = "flex-start";
		}
		await this.scrollToVisualization();
		const element = this.createStackElement(value);
		element.style.opacity = '0';
		element.style.transform = 'scale(0.5)';
		this.stackContainer.appendChild(element);
		await this.delay(100);
		await this.scrollToElement(element);
		element.style.transition = 'all 0.3s ease';
		element.style.opacity = '1';
		element.style.transform = 'scale(1)';
		this.stack.push(value);
		await this.delay(this.animationSpeed);
		this.lastOperation.textContent = `Pushed ${value}`;
		this.timeComplexityEl.textContent = timeComplexity;
		this.updateDisplay();
  	}

  async animateResize() {
		await this.highlightCodeLines(15, 17, `Resizing from ${this.capacity} to ${this.capacity * 2}`, this.highlightLong);
		await this.scrollToVisualization();
		this.stackContainer.style.transition = 'all 0.3s ease';
		this.stackContainer.style.transform = 'scale(1.05)';
		this.stackContainer.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
		await this.delay(300);
		this.capacity *= 2;
		this.stackContainer.style.transform = 'scale(1)';
		this.stackContainer.style.boxShadow = 'none';
		this.updateDisplay();
	}

	async popElement() {
		if (this.isAnimating) {
			return this.showError("Animation in progress.");
		}
		if (this.stack.length === 0) {
			return this.showError("Stack is empty.");
		}
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animatePop();
		}
    	catch (error) {
			this.showError("Error: " + error.message);
		}
    	finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

  	async animatePop() {
		const value = this.stack[this.stack.length - 1];
		await this.highlightCodeLines(33, 37, `Popping ${value} from the stack.`, this.highlightLong);
    	await this.scrollToVisualization();
		const element = this.stackContainer.lastChild;
		await this.delay(100);
		await this.scrollToElement(element);
		element.classList.add("selected");
		await this.delay(this.animationSpeed);
		element.style.transition = "all 0.3s ease";
		element.style.opacity = "0";
		element.style.transform = "translateY(-30px)";
		this.stack.pop();
		element.remove();
		await this.delay(this.animationSpeed);
		this.lastOperation.textContent = `Popped ${value}`;
		this.timeComplexityEl.textContent = 'O(1)';
		this.updateDisplay();
	}

	async peekElement() {
		if (this.isAnimating) {
      		return this.showError("Animation in progress.");
    	}
		if (this.stack.length === 0) {
      		return this.showError("Stack is empty.");
    	}
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animatePeek();
		}
    	catch (error) {
			this.showError("Error: " + error.message);
		}
    	finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

	async animatePeek() {
		await this.highlightCodeLines(44, 44, `Peeking at the top element.`, this.highlightShort);
    	await this.scrollToVisualization();
		const element = this.stackContainer.lastChild;
		await this.delay(100);
		await this.scrollToElement(element);
		this.comparisonCount++;
		element.classList.add("comparing");
		await this.delay(this.animationSpeed / 2);
		element.classList.remove("comparing");
		this.lastOperation.textContent = `Peeked ${this.stack[this.stack.length - 1]}`;
		this.timeComplexityEl.textContent = 'O(1)';
	}

	async clearStack() {
		if (this.isAnimating) {
			return this.showError("Animation in progress.");
		}
		this.stack = [];
		this.capacity = 5;
		this.operationCount = 0;
		this.comparisonCount = 0;
		this.lastOperation.textContent = "Cleared";
		this.timeComplexityEl.textContent = "O(1)";
		this.explanationText.textContent = "Stack cleared. Ready for new operations.";
		this.updateDisplay();
		await this.scrollToVisualization();
		this.updateStats();
		await this.delay(500);
	}

	async loadPreset(type) {
		if (this.isAnimating) return this.showError("Animation in progress.");
		await this.clearStack();
		switch (type) {
			case "sequential":
				this.stack = [10, 20, 30, 40, 50];
				this.lastOperation.textContent = "Loaded Sequential Stack";
				break;
			case "reverse":
				this.stack = [50, 40, 30, 20, 10];
				this.lastOperation.textContent = "Loaded Reverse Stack";
				break;
			case "random":
				const size = Math.floor(Math.random() * 5) + 5;
				const newCapacity = this.capacity < size ? this.capacity * 2 : this.capacity;
				this.capacity = newCapacity;
				for (let i = 0; i < size; i++) {
					this.stack.push(Math.floor(Math.random() * 99) + 1);
				}
				this.lastOperation.textContent = `Loaded Random Stack`;
				break;
		}
		this.updateDisplay();
		this.updateStats();
		await this.scrollToVisualization();
	}

	createStackElement(value) {
		const el = document.createElement("div");
		el.className = "stack-element";
		el.innerHTML = `<div class="element-value">${value}</div>`;
		return el;
	}

	updateDisplay() {
		this.stackSize.textContent = this.stack.length;
		this.stackCapacity.textContent = this.capacity;
		this.stackContainer.innerHTML = "";
		if (this.stack.length === 0) {
			const empty = document.createElement("div");
			empty.className = "empty-state";
			empty.innerHTML = "<p>Stack is empty. Push elements to get started!</p>";
      		this.stackContainer.style.justifyContent = "safe center";
			this.stackContainer.appendChild(empty);
		} 
		else {
			this.stack.forEach((val) => {
				const el = this.createStackElement(val);
				this.stackContainer.appendChild(el);
			});
		}
	}

	updateStats() {
		this.operationCountEl.textContent = this.operationCount;
		this.comparisonCountEl.textContent = this.comparisonCount;
	}

	showError(msg) {
		const errorEl = document.createElement("div");
		errorEl.className = "error-notification";
		errorEl.textContent = msg;
		errorEl.style.cssText = `
			position: fixed;
			top: 100px;
			right: 20px;
			background: linear-gradient(135deg, #ff6b6b, #ee5a52);
			color: white;
			padding: 1rem 1.5rem;
			border-radius: 0.5rem;
			box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
			z-index: 1000;
			animation: slideIn 0.3s ease;
		`;
		document.body.appendChild(errorEl);
		setTimeout(() => {
			errorEl.style.animation = "slideOut 0.3s ease forwards";
			setTimeout(() => errorEl.remove(), 300);
		}, 3000);
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

function pushElement() {
	window.stackVisualizer.pushElement();
}
function popElement() {
	window.stackVisualizer.popElement();
}
function peekElement() {
	window.stackVisualizer.peekElement();
}
function clearStack() {
	window.stackVisualizer.clearStack();
}
function loadPreset(type) {
	window.stackVisualizer.loadPreset(type);
}

document.addEventListener("DOMContentLoaded", () => {
	window.stackVisualizer = new StackVisualizer();
});