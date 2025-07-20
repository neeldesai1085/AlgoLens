class DynamicDequeVisualizer {
	constructor() {
		this.deque = [];
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
		this.dequeContainer = document.getElementById('dequeContainer');
		this.dequeSize = document.getElementById('dequeSize');
		this.dequeCapacity = document.getElementById('dequeCapacity');
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
		document.getElementById('addFrontValue').addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.addFrontElement();
		});
		document.getElementById('addRearValue').addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.addRearElement();
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
		this.dequeContainer.scrollIntoView({
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

	async addFrontElement() {
		const input = document.getElementById('addFrontValue');
		const value = parseInt(input.value);
		if (isNaN(value) || value < 1 || value > 99) {
            return this.showError('Enter a number between 1-99.');
        }
		if (this.isAnimating) {
            return this.showError('Animation in progress.');
        }
        input.value = '';
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animateAddFront(value);
		}
        catch (error) {
			this.showError('Error while adding front element: ' + error.message);
		}
        finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}
    
    async animateAddFront(value) {
        await this.highlightCodeLines(41, 41, `Checking deque size. Size: ${this.deque.length}/${this.capacity}`, this.highlightShort);
        let timeComplexity = 'O(1)';
        if (this.deque.length >= this.capacity) {
            await this.highlightCodeLines(42, 42, `Deque is full. Resizing needed.`, this.highlightShort);
            await this.animateResize();
            timeComplexity = 'O(n)';
        }
        else {
            await this.highlightCodeLines(44, 44, `Checking if deque is empty or not.`, this.highlightShort);
        }
        if (this.deque.length === 0) {
            await this.highlightCodeLines(45, 46, `Deque is empty. Changing the front and rear pointers accordingly.`, this.highlightMedium);
        }
        else {
            await this.highlightCodeLines(48, 48, `Updating the front pointer to ${this.front - 1}`, this.highlightShort);
        }
		await this.highlightCodeLines(50, 51, `Adding ${value} to the front of the deque.`, this.highlightMedium);
        if (this.deque.length === 0) {
			this.dequeContainer.innerHTML = '';
        }
		await this.scrollToVisualization();
		const element = this.createDequeElement(value);
		element.style.opacity = '0';
		element.style.transform = 'scale(0.5)';
		this.dequeContainer.insertBefore(element, this.dequeContainer.firstChild);
        await this.delay(100);
        await this.scrollToElement(element);
		element.style.transition = 'all 0.3s ease';
		element.style.opacity = '1';
		element.style.transform = 'scale(1)';
        this.deque.unshift(value);
		await this.delay(this.animationSpeed);
		this.lastOperation.textContent = `Added ${value} to Front`;
		this.timeComplexityEl.textContent = timeComplexity;
		this.updateDisplay();
	}

    async animateResize() {
		await this.highlightCodeLines(25, 37, `Resizing from ${this.capacity} to ${this.capacity * 2}`, this.highlightLong);
		await this.scrollToVisualization();
		this.dequeContainer.style.transition = 'all 0.3s ease';
		this.dequeContainer.style.transform = 'scale(1.05)';
		this.dequeContainer.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
		await this.delay(300);
		this.capacity *= 2;
		this.dequeContainer.style.transform = 'scale(1)';
		this.dequeContainer.style.boxShadow = 'none';
		this.updateDisplay();
	}

    async addRearElement() {
		const input = document.getElementById('addRearValue');
		const value = parseInt(input.value);
		if (isNaN(value) || value < 1 || value > 99) {
            return this.showError('Enter a number between 1-99.');
		}
		if (this.isAnimating) {
            return this.showError('Animation in progress.');
        }
        input.value = '';
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animateAddRear(value);
		}
        catch (error) {
			this.showError('Error while adding rear element: ' + error.message);
		}
        finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

    async animateAddRear(value) {
        await this.highlightCodeLines(55, 55, `Checking deque size. Size: ${this.deque.length}/${this.capacity}`, this.highlightShort);
        let timeComplexity = 'O(1)';
        if (this.deque.length >= this.capacity) {
            await this.highlightCodeLines(56, 56, `Deque is full. Resizing needed.`, this.highlightShort);
            await this.animateResize();
            timeComplexity = 'O(n)';
        } else {
            await this.highlightCodeLines(58, 58, `Checking if deque is empty or not.`, this.highlightShort);
        }
        if (this.deque.length === 0) {
            await this.highlightCodeLines(59, 60, `Deque is empty. Changing the front and rear pointers accordingly.`, this.highlightMedium);
        } else {
            await this.highlightCodeLines(62, 62, `Updating the rear pointer.`, this.highlightShort);
        }
        await this.highlightCodeLines(64, 65, `Adding ${value} to the rear of the deque.`, this.highlightMedium);
        if (this.deque.length === 0) {
			this.dequeContainer.innerHTML = '';
        }
		await this.scrollToVisualization();
		const element = this.createDequeElement(value);
        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        this.dequeContainer.appendChild(element);
        await this.delay(100);
        await this.scrollToElement(element);
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
        this.deque.push(value);
        await this.delay(this.animationSpeed);
        this.lastOperation.textContent = `Added ${value} to Rear`;
        this.timeComplexityEl.textContent = timeComplexity;
        this.updateDisplay();
    }

	async removeFrontElement() {
		if (this.isAnimating) {
            return this.showError('Animation in progress.');
		}
		if (this.deque.length === 0) {
            return this.showError('Deque is empty.');
        }
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animateRemoveFront();
		}
        catch (error) {
			this.showError('Error while removing front element: ' + error.message);
		}
        finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

    async animateRemoveFront() {
        await this.highlightCodeLines(72, 74, `Removing element from the front.`, this.highlightLong);
        await this.scrollToVisualization();
        const element = this.dequeContainer.firstChild;
		await this.delay(100);
        await this.scrollToElement(element);
        element.classList.add('selected');
		await this.delay(this.animationSpeed / 2);
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-40px)';
        await this.delay(this.animationSpeed / 2);
        await this.highlightCodeLines(75, 75, `Checking if deque becomes empty or not.`, this.highlightShort);
        if (this.deque.length === 1) {
            await this.highlightCodeLines(76, 77, `Deque is now empty. Resetting front and rear pointers.`, this.highlightMedium);
        }
        else {
            await this.highlightCodeLines(79, 79, `Updating the front pointer.`, this.highlightShort);
        }
        const removedValue = this.deque.shift();
        element.remove();
        await this.highlightCodeLines(81, 81, `Returning the removed element.`, this.highlightShort);
        this.lastOperation.textContent = `Removed ${removedValue}`;
        this.timeComplexityEl.textContent = 'O(1)';
        this.updateDisplay();
    }
    
	async removeRearElement() {
		if (this.isAnimating) {
            return this.showError('Animation in progress.');
        }
		if (this.deque.length === 0) {
            return this.showError('Deque is empty.');
        }
		this.isAnimating = true;
		this.operationCount++;
		try {
			await this.animateRemoveRear();
		} 
        catch (error) {
			this.showError('Error while removing rear element: ' + error.message);
		} 
        finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
	}

    async animateRemoveRear() {
        await this.highlightCodeLines(88, 90, `Removing element from the rear.`, this.highlightMedium);
        await this.scrollToVisualization();
        const element = this.dequeContainer.lastChild;
		await this.delay(100);
        await this.scrollToElement(element);
        element.classList.add('selected');
        await this.delay(this.animationSpeed / 2);
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-40px)';
        await this.delay(this.animationSpeed / 2);
        await this.highlightCodeLines(91, 91, `Checking if deque becomes empty or not.`, this.highlightShort);
        if (this.deque.length === 1) {
            await this.highlightCodeLines(92, 93, `Deque is now empty. Resetting front and rear pointers.`, this.highlightMedium);
        } else {
            await this.highlightCodeLines(95, 95, `Updating the rear pointer.`, this.highlightShort);
        }
        const removedValue = this.deque.pop();
        element.remove();
        await this.highlightCodeLines(97, 97, `Returning the removed element.`, this.highlightShort);
        this.lastOperation.textContent = `Removed ${removedValue}`;
        this.timeComplexityEl.textContent = 'O(1)';
        this.updateDisplay();
    }

    async peekFrontElement() {
        if (this.isAnimating) {
            return this.showError('Animation in progress.');
        }
		if (this.deque.length === 0) {
            return this.showError('Deque is empty.');
        }
		this.isAnimating = true;
		this.operationCount++;
        try {
			await this.animatePeekFront();
		}
        catch (error) {
			this.showError('Error while peeking front element: ' + error.message);
		}
        finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
    }

    async animatePeekFront() {
        await this.highlightCodeLines(104, 104, `Peeking at the front element.`, this.highlightShort);
        await this.scrollToVisualization();
        const element = this.dequeContainer.firstChild;
		await this.delay(100);
        await this.scrollToElement(element);
        element.classList.add('comparing');
        this.comparisonCount++;
        await this.delay(this.animationSpeed / 2);
        element.classList.remove('comparing');
        this.lastOperation.textContent = `Peeked ${this.deque[0]}`;
		this.timeComplexityEl.textContent = 'O(1)';
    }

    async peekRearElement() {
        if (this.isAnimating) {
            return this.showError('Animation in progress.');
        }
		if (this.deque.length === 0) {
            return this.showError('Deque is empty.');
        }
		this.isAnimating = true;
		this.operationCount++;
        try {
			await this.animatePeekRear();
		}
        catch (error) {
			this.showError('Error while peeking rear element: ' + error.message);
		}
        finally {
			this.isAnimating = false;
			this.updateStats();
			await this.delay(500);
			await this.scrollToStats();
		}
    }

    async animatePeekRear() {
        await this.highlightCodeLines(111, 111, `Peeking at the rear element.`, this.highlightShort);
        await this.scrollToVisualization();
        const element = this.dequeContainer.lastChild;
		await this.delay(100);
        await this.scrollToElement(element);
        element.classList.add('comparing');
        this.comparisonCount++;
        await this.delay(this.animationSpeed / 2);
        element.classList.remove('comparing');
        this.lastOperation.textContent = `Peeked ${this.deque[this.deque.length-1]}`;
		this.timeComplexityEl.textContent = 'O(1)';
    }

	createDequeElement(value) {
		const element = document.createElement('div');
		element.className = 'queue-element';
		element.innerHTML = `<div class="element-value">${value}</div>`;
		return element;
	}

	updateDisplay() {
        this.dequeSize.textContent = this.deque.length;
        this.dequeCapacity.textContent = this.capacity;
        this.dequeContainer.innerHTML = '';
        if (this.deque.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>Deque is empty. Add elements to get started!</p>';
            this.dequeContainer.appendChild(emptyState);
        } 
		else {
            this.deque.forEach((value) => {
                const element = this.createDequeElement(value);
                this.dequeContainer.appendChild(element);
            });
        }
    }

	updateStats() {
		this.operationCountEl.textContent = this.operationCount;
		this.comparisonCountEl.textContent = this.comparisonCount;
	}

	async clearDeque() {
		if (this.isAnimating) {
            return this.showError('Animation in progress.');
        }
		this.deque = [];
		this.capacity = 5;
		this.operationCount = 0;
		this.comparisonCount = 0;
		this.lastOperation.textContent = 'Cleared';
		this.timeComplexityEl.textContent = 'O(1)';
		this.explanationText.textContent = 'Deque cleared. Ready for new operations.';
		this.updateDisplay();
		await this.scrollToVisualization();
		this.updateStats();
		await this.delay(500);
	}

    async loadPreset(type) {
		if (this.isAnimating) {
            return this.showError('Animation in progress.');
        }
        this.clearDeque();
		switch (type) {
			case 'random':
				const size = Math.floor(Math.random() * 5) + 5;
                const newCapacity = this.capacity < size ? this.capacity * 2 : this.capacity;
                this.capacity = newCapacity;
				for (let i = 0; i < size; i++) {
					this.deque.push(Math.floor(Math.random() * 99) + 1);
				}
				this.lastOperation.textContent = 'Loaded Random Deque';
                this.explanationText.textContent = `Generated a random deque with ${size} elements.`;
				break;
			case 'full':
				for (let i = 0; i < this.capacity; i++) {
					this.deque.push(Math.floor(Math.random() * 99) + 1);
				}
				this.lastOperation.textContent = 'Loaded Full Deque';
                this.explanationText.textContent = `Generated a full deque with ${this.capacity} elements.`;
				break;
		}
		this.updateDisplay();
        this.updateStats();
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

function addFrontElement() { 
    window.dequeVisualizer.addFrontElement(); 
}
function addRearElement() { 
    window.dequeVisualizer.addRearElement(); 
}
function removeFrontElement() { 
    window.dequeVisualizer.removeFrontElement(); 
}
function removeRearElement() { 
    window.dequeVisualizer.removeRearElement();
}
function peekFrontElement() { 
    window.dequeVisualizer.peekFrontElement(); 
}
function peekRearElement() { 
    window.dequeVisualizer.peekRearElement(); 
}
function clearDeque() { 
    window.dequeVisualizer.clearDeque(); 
}
function loadPreset(type) { 
    window.dequeVisualizer.loadPreset(type); 
}

document.addEventListener('DOMContentLoaded', () => {
	window.dequeVisualizer = new DynamicDequeVisualizer();
});