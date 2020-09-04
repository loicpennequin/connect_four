import { v4 as uuid } from 'uuid';

export class Tree {
  constructor(initialPathValues) {
    let initialPath = [];
    initialPathValues.forEach((value, i) => {
      initialPath.push(new TreeNode(value, initialPath[i - 1]));
    });
    // TODO refacto then kill yourself
    initialPath.forEach((node, i) => {
      const nextNode = initialPath[i + 1];
      if (!nextNode) return;
      node.children.push(nextNode);
    });
    const initialTree = new TreePath(initialPath);
    this.paths = [initialTree];
    this.currentPath = initialTree;
  }

  get currentNode() {
    if (!this.currentPath) return null;
    return this.currentPath.currentStep;
  }

  _createPath() {
    let steps = [
      this.currentNode,
      ...(this.currentNode?.ancesters || [])
    ].reverse();

    const path = new TreePath(steps);
    this.paths.push(path);
    this.currentPath = path;
  }

  addNode(value) {
    if (this.currentNode?.hasChildren) {
      this._createPath();
    }
    const newNode = new TreeNode(value, this.currentNode);
    this.currentNode.children.push(newNode);
    this.currentPath.addStep(newNode);
  }

  goToNode(node) {
    if (!this.currentPath.hasNode(node)) {
      this.currentPath = this.paths.find(path => path.hasNode(node));
    }

    this.currentPath.goTo(this.currentPath.steps.indexOf(node));
  }

  next() {
    this.currentPath.next();
  }

  previous() {
    this.currentPath.previous();
  }

  first() {
    this.currentPath.first();
  }

  last() {
    this.currentPath.last();
  }
}

class TreeNode {
  constructor(value, parent) {
    this.uuid = uuid();
    this.children = [];
    this.value = value;
    this.parent = parent;
  }

  get hasChildren() {
    return this.children.length > 0;
  }

  get ancesters() {
    let ancesters = [];
    let currentAncester = this.parent;

    while (currentAncester) {
      ancesters.push(currentAncester);
      currentAncester = currentAncester.parent;
    }

    return ancesters;
  }
}

class TreePath {
  constructor(steps) {
    this.uuid = uuid();
    this.steps = steps;
    this.currentStepIndex = this.steps.length - 1;
  }

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  hasNode(node) {
    return this.steps.includes(node);
  }

  addStep(step) {
    this.steps.push(step);
  }

  next() {
    if (this.currentStepIndex >= this.steps.length - 1) return;
    this.currentStepIndex++;
  }

  previous() {
    if (this.currentStepIndex === 0) return;
    this.currentStepIndex--;
  }

  first() {
    this.currentStepIndex = 0;
  }

  last() {
    this.currentStepIndex = this.steps.length - 1;
  }

  goTo(index) {
    this.currentStepIndex = index;
  }
}
