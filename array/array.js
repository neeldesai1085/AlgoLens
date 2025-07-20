class DynamicArrayVisualizer {
	constructor() {
		this.array = [];
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
		this.arrayContainer = document.getElementById('arrayContainer');
		this.arraySize = document.getElementById('arraySize');
		this.arrayCapacity = document.getElementById('arrayCapacity');
		this.lastOperation = document.getElementById('lastOperation');
		this.explanationText = document.getElementById('explanationText');
		this.codeDisplay = document.getElementById('codeDisplay');
		this.operationCountEl = document.getElementById('operationCount');
		this.comparisonCountEl = document.getElementById('comparisonCount');
		this.timeComplexityEl = document.getElementById('timeComplexity');
		this.speedSlider = document.getElementById('speedSlider');
		this.statsContainer = document.querySelector('.stats-display');
	}

	setupEventListeners() {
		this.speedSlider.addEventListener('input', (e) => {
			this.animationSpeed = 1100 - (parseInt(e.target.value) * 100);
			this.highlightShort = this.animationSpeed * 1.0;
			this.highlightMedium = this.animationSpeed * 1.5;
			this.highlightLong = this.animationSpeed * 2.0;
		});
		document.getElementById('insertValue').addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.insertElement();
		});
		document.getElementById('deleteValue').addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.deleteElement();
		});
		document.getElementById('searchValue').addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.searchElement();
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
		if (this.scrolling) return;
		this.scrolling = true;
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
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
		this.arrayContainer.scrollIntoView({
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
				line.classList.add('highlight-line');
				await this.delay(lineDelay);
				line.classList.remove('highlight-line');
			}
		}
	}

	async insertElement() {
		const input = document.getElementById('insertValue');
		const value = parseInt(input.value);
		if (isNaN(value) || value < 1 || value > 99) {
			this.showError('Please enter a valid number between 1 and 99');
			return;
		}
		if (this.isAnimating) {
			this.showError('Animation in progress. Please wait.');
			return;
		}
		input.value = '';
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animateInsert(value);
		}
		catch (error) {
			this.showError('Error during insertion: ' + error.message);
		}
		finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

	async animateInsert(value) {
		await this.highlightCodeLines(13, 13, `Checking array capacity. Size: ${this.array.length}/${this.capacity}`, this.highlightShort);
		let timeComplexity = 'O(1)';
		if (this.array.length >= this.capacity) {
			await this.highlightCodeLines(14, 14, 'Resizing array...', this.highlightShort);
			await this.animateResize();
			timeComplexity = `O(${this.array.length}) + O(1)`;
		}
		await this.highlightCodeLines(16, 17, `Inserting ${value} at index ${this.array.length}`, this.highlightMedium);
		if (this.array.length === 0) {
			this.arrayContainer.innerHTML = '';
		}
		await this.scrollToVisualization();
		const element = this.createArrayElement(value, this.array.length);
		element.style.opacity = '0';
		element.style.transform = 'scale(0.5)';
		this.arrayContainer.appendChild(element);
		await this.delay(100);
		await this.scrollToElement(element);
		element.style.transition = 'all 0.3s ease';
		element.style.opacity = '1';
		element.style.transform = 'scale(1)';
		this.array.push(value);
		await this.delay(this.animationSpeed);
		this.lastOperation.textContent = `Inserted ${value}`;
		this.timeComplexityEl.textContent = timeComplexity;
		this.updateDisplay();
	}

	async animateResize() {
		await this.highlightCodeLines(40, 45, `Resizing from ${this.capacity} to ${this.capacity * 2}`, this.highlightLong);
		await this.scrollToVisualization();
		this.arrayContainer.style.transition = 'all 0.3s ease';
		this.arrayContainer.style.transform = 'scale(1.05)';
		this.arrayContainer.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
		await this.delay(300);
		this.capacity *= 2;
		this.arrayContainer.style.transform = 'scale(1)';
		this.arrayContainer.style.boxShadow = 'none';
		this.updateDisplay();
	}

	async deleteElement() {
		const input = document.getElementById('deleteValue');
		const value = parseInt(input.value);
		if (isNaN(value)) {
			this.showError('Please enter a valid number');
			return;
		}
		if (this.isAnimating) {
			this.showError('Animation in progress. Please wait.');
			return;
		}
		if (this.array.length === 0) {
			this.showError('Array is empty');
			return;
		}
		input.value = '';
		this.isAnimating = true;
		this.operationCount++;
		try {
			const found = await this.animateDelete(value);
			if (!found) {
				this.showError(`${value} not found`);
			}
		}
		catch (error) {
			this.showError('Error during deletion: ' + error.message);
		}
		finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

	async animateDelete(value) {
		await this.highlightCodeLines(21, 21, `Searching for ${value}`, this.highlightShort);
		let foundIndex = -1;
		for (let i = 0; i < this.array.length; i++) {
			await this.highlightCodeLines(31, 32, `Checking index ${i}: ${this.array[i]}`, this.highlightMedium);
			await this.scrollToVisualization();
			const element = this.arrayContainer.children[i];
			await this.delay(100);
			await this.scrollToElement(element);
			element.classList.add('comparing');
			this.comparisonCount++;
			await this.delay(this.animationSpeed / 2);
			if (this.array[i] === value) {
				await this.highlightCodeLines(33, 33, `Found at index ${i}`, this.highlightShort);
				await this.scrollToVisualization();
				foundIndex = i;
				element.classList.remove('comparing');
				element.classList.add('selected');
				await this.delay(this.animationSpeed);
				break;
			}
			else {
				element.classList.remove('comparing');
			}
		}
		if (foundIndex === -1) {
			await this.highlightCodeLines(36, 36, `${value} not found`, this.highlightShort);
			await this.scrollToVisualization();
			await this.delay(this.animationSpeed);
			this.lastOperation.textContent = `${value} not found`;
			this.timeComplexityEl.textContent = 'O(n)';
			return false;
		}
		await this.highlightCodeLines(25, 25, `Removing element at ${foundIndex}`, this.highlightShort);
		await this.scrollToVisualization();
		await this.animateShiftLeft(foundIndex);
		this.array.splice(foundIndex, 1);
		await this.delay(this.animationSpeed);
		this.lastOperation.textContent = `Deleted ${value}`;
		this.timeComplexityEl.textContent = 'O(n)';
		this.updateDisplay();
		return true;
	}

	async animateShiftLeft(index) {
		const elements = Array.from(this.arrayContainer.children);
		const target = elements[index];
		await this.scrollToVisualization();
		target.style.transition = 'all 0.3s ease';
		target.style.opacity = '0';
		target.style.transform = 'scale(0.5) translateY(20px)';
		await this.delay(this.animationSpeed / 2);
		for (let i = index + 1; i < elements.length; i++) {
			const element = elements[i];
			element.style.transition = 'transform 0.3s ease';
			element.style.transform = 'translateX(-48px)';
			const indexEl = element.querySelector('.element-index');
			if (indexEl) {
				indexEl.textContent = i - 1;
			}
			await this.delay(this.animationSpeed / 2);
		}
		target.remove();
		for (let i = index; i < elements.length - 1; i++) {
			const element = elements[i + 1];
			element.style.transform = 'translateX(0)';
		}
		await this.delay(this.animationSpeed / 2);
	}
	
	async searchElement() {
		const input = document.getElementById('searchValue');
		const value = parseInt(input.value);
		if (isNaN(value)) {
			this.showError('Please enter a valid number');
			return;
		}
		if (this.isAnimating) {
			this.showError('Animation in progress. Please wait.');
			return;
		}
		if (this.array.length === 0) {
			this.showError('Array is empty');
			return;
		}
		input.value = '';
		this.isAnimating = true;
		this.operationCount++;
		try {
			const index = await this.animateSearch(value);
			if (index === -1) {
				this.showError(`${value} not found`);
			}
			else {
				this.lastOperation.textContent = `Found at index ${index}`;
			}
		}
		catch (error) {
			this.showError('Search error: ' + error.message);
		}
		finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

	async animateSearch(value) {
		await this.highlightCodeLines(30, 30, `Searching for ${value}`, this.highlightShort);
		for (let i = 0; i < this.array.length; i++) {
			await this.highlightCodeLines(31, 32, `Index ${i}: ${this.array[i]}`, this.highlightMedium);
			await this.scrollToVisualization();
			const element = this.arrayContainer.children[i];
			await this.delay(100);
			await this.scrollToElement(element);
			element.classList.add('comparing');
			this.comparisonCount++;
			await this.delay(this.animationSpeed / 2);
			if (this.array[i] === value) {
				await this.highlightCodeLines(33, 33, `Found at ${i}`, this.highlightShort);
				await this.scrollToVisualization();
				element.classList.remove('comparing');
				element.classList.add('selected');
				await this.delay(this.animationSpeed);
				element.classList.remove('selected');
				this.timeComplexityEl.textContent = `O(${i + 1})`;
				return i;
			}
			else {
				element.classList.remove('comparing');
			}
		}
		await this.highlightCodeLines(36, 36, `${value} not found`, this.highlightShort);
		this.timeComplexityEl.textContent = 'O(n)';
		return -1;
	}

	createArrayElement(value, index) {
		const element = document.createElement('div');
		element.className = 'array-element';
		element.innerHTML = `<div class="element-value">${value}</div><div class="element-index">${index}</div>`;
		return element;
	}

	updateDisplay() {
		this.arraySize.textContent = this.array.length;
		this.arrayCapacity.textContent = this.capacity;
		this.arrayContainer.innerHTML = '';
		if (this.array.length === 0) {
			const emptyState = document.createElement('div');
			emptyState.className = 'empty-state';
			emptyState.innerHTML = '<p>Array is empty. Add elements to get started!</p>';
			this.arrayContainer.appendChild(emptyState);
		}
		else {
			this.array.forEach((value, index) => {
				const element = this.createArrayElement(value, index);
				this.arrayContainer.appendChild(element);
			});
		}
	}

	updateStats() {
		this.operationCountEl.textContent = this.operationCount;
		this.comparisonCountEl.textContent = this.comparisonCount;
	}

	async clearArray() {
		if (this.isAnimating) {
			this.showError('Animation in progress. Please wait.');
			return;
		}
		this.array = [];
		this.capacity = 5;
		this.operationCount = 0;
		this.comparisonCount = 0;
		this.lastOperation.textContent = 'Cleared';
		this.timeComplexityEl.textContent = 'O(n)';
		this.explanationText.textContent = 'Array cleared. Ready for new operations.';
		this.updateDisplay();
		await this.scrollToVisualization();
		this.updateStats();
		await this.delay(500);

	}

	async loadPreset(type) {
		if (this.isAnimating) {
			this.showError('Animation in progress. Please wait.');
			return;
		}
		this.clearArray();
		switch (type) {
			case 'sorted':
				this.array = [10, 20, 30, 40, 50];
				this.lastOperation.textContent = 'Loaded Sorted Array';
				this.explanationText.textContent = 'Loaded sorted array in ascending order.';
				break;
			case 'reverse':
				this.array = [50, 40, 30, 20, 10];
				this.lastOperation.textContent = 'Loaded Reverse Array';
				this.explanationText.textContent = 'Loaded array in descending order.';
				break;
			case 'random':
				if (this.isAnimating) {
					this.showError('Animation in progress. Please wait.');
					return;
				}
				this.clearArray();
				const size = Math.floor(Math.random() * 5) + 5;
				const newCapacity = size > this.capacity ? this.capacity * 2 : this.capacity;
				this.capacity = newCapacity;
				for (let i = 0; i < size; i++) {
					const value = Math.floor(Math.random() * 99) + 1;
					this.array.push(value);
				}
				this.lastOperation.textContent = 'Generated Random Array';
				this.explanationText.textContent = `Generated random array with ${size} elements.`;
				this.updateDisplay();
				await this.scrollToVisualization();
				return;
		}
		this.updateDisplay();
		await this.scrollToVisualization();
	}

	showError(message) {
		const errorEl = document.createElement('div');
		errorEl.className = 'error-notification';
		errorEl.textContent = message;
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
			errorEl.style.animation = 'slideOut 0.3s ease forwards';
			setTimeout(() => errorEl.remove(), 300);
		}, 3000);
	}

	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

function insertElement() {
	window.arrayVisualizer.insertElement();
}

function deleteElement() {
	window.arrayVisualizer.deleteElement();
}

function searchElement() {
	window.arrayVisualizer.searchElement();
}

function clearArray() {
	window.arrayVisualizer.clearArray();
}

function generateRandom() {
	window.arrayVisualizer.generateRandom();
}

function loadPreset(type) {
	window.arrayVisualizer.loadPreset(type);
}

document.addEventListener('DOMContentLoaded', () => {
	window.arrayVisualizer = new DynamicArrayVisualizer();
});