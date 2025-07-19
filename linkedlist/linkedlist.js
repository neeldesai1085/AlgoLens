class listVisualizer {
	constructor() {
		this.linkedlist = [];
		this.animationSpeed = 1000;
		this.isAnimating = false;
		this.operationCount = 0;
		this.traversalCount = 0;
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
		this.linkedlistContainer = document.getElementById('listContainer');
		this.linkedlistSize = document.getElementById('listSize');
		this.linkedlistHead = document.getElementById('listHead');
		this.lastOperation = document.getElementById('lastOperation');
		this.explanationText = document.getElementById('explanationText');
		this.codeDisplay = document.getElementById('codeDisplay');
		this.operationCountEl = document.getElementById('operationCount');
		this.traversalCountEl = document.getElementById('traversalCount');
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

        document.getElementById('insertHeadValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.insertAtHead();
        });

        document.getElementById('insertTailValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.insertAtTail();
        });

        document.getElementById('insertIndexValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.insertAtIndex();
        });

        document.getElementById('insertIndex').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.insertAtIndex();
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
		await this.delay(50);
		this.scrolling = false;
	}

	async scrollToVisualization() {
		if (this.scrolling) return;
		this.scrolling = true;
		this.linkedlistContainer.scrollIntoView({
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

	async insertAtHead() {
		const input = document.getElementById('insertHeadValue');
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
			await this.animateInsertAtHead(value);
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

	async animateInsertAtHead(value) {
		await this.highlightCodeLines(14, 17, `Inserting ${value} at head of linked list`, this.highlightLong * 1.5);
        if (this.linkedlist.length === 0) {
			this.linkedlistContainer.innerHTML = '';
		}
		await this.scrollToVisualization();
		const element = this.createListElement(value, 0);
		element.style.opacity = '0';
		element.style.transform = 'scale(0.5)';
		this.linkedlistContainer.insertBefore(element, this.linkedlistContainer.firstChild);
		await this.delay(100);
        this.scrollToElement(element);
		element.style.transition = 'all 0.3s ease';
		element.style.opacity = '1';
		element.style.transform = 'scale(1)';
		this.linkedlist.unshift(value);
		await this.delay(this.animationSpeed);
		this.lastOperation.textContent = `Inserted ${value} at head`;
		this.timeComplexityEl.textContent = 'O(1)';
		this.updateDisplay();
	}

	async insertAtTail() {
		const input = document.getElementById('insertTailValue');
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
			await this.animateInsertAtTail(value);
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

	async animateInsertAtTail(value) {
        await this.highlightCodeLines(20, 20, `Starting insertion of ${value} at tail`, this.highlightShort);
        await this.highlightCodeLines(22, 22, `Checking whether the list is empty or not`, this.highlightShort);
        if (this.linkedlist.length === 0) {
            await this.highlightCodeLines(23, 23, `List is empty. Inserting ${value} as head`, this.highlightShort);
            await this.animateInsertAtHead(value);
            return;
        }
		await this.highlightCodeLines(26, 26, `Declare a new pointer for traversing the list`, this.highlightShort);
        const elements = this.linkedlistContainer.children;
        for (let i = 0; i < elements.length; i++) {
            await this.highlightCodeLines(27, 28, `Traversing the list to find tail`, this.highlightMedium);
            await this.scrollToVisualization();
			await this.delay(100);
            await this.scrollToElement(elements[i]);    
            elements[i].classList.add('comparing');
            this.traversalCount++;
            await this.delay(this.animationSpeed / 2);
            elements[i].classList.remove('comparing');
        }
        await this.highlightCodeLines(30, 31, `Inserting ${value} at tail`, this.highlightMedium);
        await this.scrollToVisualization();
        const newIndex = this.linkedlist.length;
        const newElement = this.createListElement(value, newIndex);
        newElement.style.opacity = '0';
        newElement.style.transform = 'scale(0.5)';
        this.linkedlistContainer.appendChild(newElement);
        await this.delay(100);
        this.scrollToElement(newElement);
        newElement.style.transition = 'all 0.4s ease';
        newElement.style.opacity = '1';
        newElement.style.transform = 'scale(1)';
        this.linkedlist.push(value);
        await this.delay(this.animationSpeed);
        this.lastOperation.textContent = `Inserted ${value} at tail`;
        this.timeComplexityEl.textContent = 'O(n)';
        this.updateDisplay();
    }

	async insertAtIndex() {
		const valueInput = document.getElementById('insertIndexValue');
		const indexInput = document.getElementById('insertIndex');
		const value = parseInt(valueInput.value);
		const index = parseInt(indexInput.value);
		
		if (isNaN(value) || value < 1 || value > 99) {
			this.showError('Please enter a valid value between 1 and 99');
			return;
		}
		if (isNaN(index) || index < 0 || index > this.linkedlist.length) {
			this.showError(`Please enter a valid index between 0 and ${this.linkedlist.length}`);
			return;
		}
		if (this.isAnimating) {
			this.showError('Animation in progress. Please wait.');
			return;
		}
		valueInput.value = '';
		indexInput.value = '';
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animateInsertAtIndex(index, value);
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

	async animateInsertAtIndex(index, value) {
        await this.highlightCodeLines(34, 34, `Inserting ${value} at index ${index}`, this.highlightShort);
        await this.highlightCodeLines(38, 38, `Checking if index is 0 to insert at head`, this.highlightShort);
        if (index === 0) {
            await this.highlightCodeLines(39, 39, `Index is 0, using insertAtHead`, this.highlightMedium);
            await this.animateInsertAtHead(value);
            return;
        }
        const elements = this.linkedlistContainer.children;
        for (let i = 0; i < index && i < elements.length; i++) {
            await this.highlightCodeLines(44, 45, `Traversing linked list to reach index ${index}`, this.highlightShort);
            await this.scrollToVisualization();
			await this.delay(100);
            await this.scrollToElement(elements[i]);
            elements[i].classList.add('comparing');
            this.traversalCount++;
            await this.delay(this.animationSpeed / 2);
            elements[i].classList.remove('comparing');
        }
        await this.highlightCodeLines(47, 49, `Creating and inserting node into visualization`, this.highlightLong);
        await this.scrollToVisualization();
        const newNode = this.createListElement(value, index);
        newNode.style.opacity = '0';
        newNode.style.transform = 'scale(0.5)';
        this.scrollToElement(newNode);
        await this.delay(100);
		this.linkedlist.splice(index, 0, value);
		await this.delay(this.animationSpeed);
        this.updateDisplay();
        await this.delay(100);
        const updatedElement = this.linkedlistContainer.children[index];
		await this.delay(100);
        this.scrollToElement(updatedElement);
		await this.delay(100);
		updatedElement.classList.add('selected');
		await this.delay(this.animationSpeed);
		updatedElement.classList.remove('selected');
        updatedElement.style.transition = 'all 0.3s ease';
        updatedElement.style.opacity = '1';
        updatedElement.style.transform = 'scale(1)';
        await this.delay(this.animationSpeed);
        this.lastOperation.textContent = `Inserted ${value} at index ${index}`;
        this.timeComplexityEl.textContent = `O(${index} + 1)`;
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
		if (this.linkedlist.length === 0) {
			this.showError('Linked list is empty');
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
		await this.highlightCodeLines(52, 52, `Beginning search and deletion of ${value}`, this.highlightShort);
		let foundIndex = -1;
		const elements = this.linkedlistContainer.children;
        await this.highlightCodeLines(56, 56, `Checking whether the head node is ${value}`, this.highlightShort);
        await this.scrollToVisualization();
		await this.delay(100);
        await this.scrollToElement(elements[0]);
        elements[0].classList.add('comparing');
        this.traversalCount++;
        await this.delay(this.animationSpeed / 2);
        if (this.linkedlist[0] === value) {
            await this.highlightCodeLines(57, 59, `The target element is present at the head node, removing it`, this.highlightLong);
            await this.scrollToVisualization();
            await this.delay(this.animationSpeed / 2);
            elements[0].classList.remove('comparing');
            elements[0].classList.add('selected');
            foundIndex = 0;
        }
		else {
			await this.delay(this.animationSpeed / 2);
			elements[0].classList.remove('comparing');
		}
		for (let i = 1; i < this.linkedlist.length && foundIndex === -1; i++) {
			await this.highlightCodeLines(62, 63, `Traversing the linked list to find ${value}`, this.highlightMedium);
            await this.scrollToVisualization();
			await this.delay(100);
            await this.scrollToElement(elements[i]);
            elements[i].classList.add('comparing');
            this.traversalCount++;
            await this.delay(this.animationSpeed / 2);
            if (this.linkedlist[i] === value) {
                foundIndex = i;
                elements[i].classList.remove('comparing');
                elements[i].classList.add('selected');
                await this.highlightCodeLines(64, 66, `Element ${value} found at index ${foundIndex}, proceeding to delete`, this.highlightMedium);
                break;
            }
            else {
                elements[i].classList.remove('comparing');
            }
		}
		if (foundIndex === -1) {
			await this.highlightCodeLines(70, 70, `Element ${value} not found in the linked list`, this.highlightMedium);
            await this.scrollToVisualization();
            this.lastOperation.textContent = `${value} not found`;
			this.timeComplexityEl.textContent = 'O(n)';
			return false;
		}
		const target = elements[foundIndex];
        await this.scrollToVisualization();
		await this.delay(100);
        await this.scrollToElement(target);
		target.style.transition = 'all 0.3s ease';
		target.style.opacity = '0';
		target.style.transform = 'scale(0.5) translateY(20px)';
		this.linkedlist.splice(foundIndex, 1);
		await this.delay(this.animationSpeed);
		this.lastOperation.textContent = `Deleted ${value}`;
		this.timeComplexityEl.textContent = `O(${foundIndex + 1})`;
		this.updateDisplay();
		return true;
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
		if (this.linkedlist.length === 0) {
			this.showError('Linked list is empty');
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
		await this.highlightCodeLines(73, 73, `Searching for ${value}`, this.highlightShort);
		for (let i = 0; i < this.linkedlist.length; i++) {
			await this.highlightCodeLines(76, 77, `Index ${i}: ${this.linkedlist[i]}`, this.highlightMedium);
			await this.scrollToVisualization();
			const element = this.linkedlistContainer.children[i];
			await this.delay(100);
			await this.scrollToElement(element);
			element.classList.add('comparing');
			this.traversalCount++;
			await this.delay(this.animationSpeed / 2);
			if (this.linkedlist[i] === value) {
				await this.highlightCodeLines(78, 78, `Found at ${i}`, this.highlightShort);
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
		await this.highlightCodeLines(83, 83, `${value} not found`, this.highlightShort);
		this.timeComplexityEl.textContent = 'O(n)';
		return -1;
	}

	createListElement(value, index) {
		const element = document.createElement('div');
		element.className = 'list-node';
		element.innerHTML = `<div class="node-data">${value}</div>`;
		if (index === this.linkedlist.length - 1) {
			element.innerHTML = `<div class="node-data">${value}</div>`;
		}
		return element;
	}

	updateDisplay() {
		this.linkedlistSize.textContent = this.linkedlist.length;
		this.linkedlistHead.textContent = this.linkedlist.length > 0 ? this.linkedlist[0] : 'null';
		this.linkedlistContainer.innerHTML = '';
		if (this.linkedlist.length === 0) {
			const emptyState = document.createElement('div');
			emptyState.className = 'empty-state';
			emptyState.innerHTML = '<p>Linked list is empty. Add nodes to get started!</p>';
			this.linkedlistContainer.appendChild(emptyState);
		}
		else {
			this.linkedlist.forEach((value, index) => {
				const element = this.createListElement(value, index);
				this.linkedlistContainer.appendChild(element);
			});
		}
	}

	updateStats() {
		this.operationCountEl.textContent = this.operationCount;
		this.traversalCountEl.textContent = this.traversalCount;
	}

	async clearLinkedList() {
		if (this.isAnimating) {
			this.showError('Animation in progress. Please wait.');
			return;
		}
		this.linkedlist = [];
		this.operationCount = 0;
		this.traversalCount = 0;
		this.lastOperation.textContent = 'Cleared';
		this.timeComplexityEl.textContent = 'O(1)';
		this.explanationText.textContent = 'Linked list cleared. Ready for new operations.';
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
		this.clearLinkedList();
		switch (type) {
			case 'sequential':
				this.linkedlist = [10, 20, 30, 40, 50];
				this.lastOperation.textContent = 'Loaded Sequential List';
				this.explanationText.textContent = 'Loaded sequential linked list.';
				break;
			case 'reverse':
				this.linkedlist = [50, 40, 30, 20, 10];
				this.lastOperation.textContent = 'Loaded Reverse List';
				this.explanationText.textContent = 'Loaded reverse sequential linked list.';
				break;
			case 'random':
				if (this.isAnimating) {
                    this.showError('Animation in progress. Please wait.');
                    return;
                }
                this.clearLinkedList();
                const size = Math.floor(Math.random() * 5) + 5;
                for (let i = 0; i < size; i++) {
                    const value = Math.floor(Math.random() * 99) + 1;
                    this.linkedlist.push(value);
                }
                this.lastOperation.textContent = 'Generated Random List';
                this.explanationText.textContent = `Generated random linked list with ${size} nodes.`;
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

function insertAtHead() {
	window.listVisualizer.insertAtHead();
}

function insertAtTail() {
	window.listVisualizer.insertAtTail();
}

function insertAtIndex() {
	window.listVisualizer.insertAtIndex();
}

function deleteElement() {
	window.listVisualizer.deleteElement();
}

function searchElement() {
	window.listVisualizer.searchElement();
}

function clearLinkedList() {
	window.listVisualizer.clearLinkedList();
}

function generateRandom() {
	window.listVisualizer.generateRandom();
}

function loadPreset(type) {
	window.listVisualizer.loadPreset(type);
}

document.addEventListener('DOMContentLoaded', () => {
	window.listVisualizer = new listVisualizer();
});