// Linked list 'Class'

function node(data) {
  this.data = data;
  this.next = null;
  this.prev = null;
}

function linkedList() {
  this.head = new node(0);
  this.current = this.head;
}

linkedList.prototype.add = function() {
  var newNode = new node(0);
  newNode.next = this.current.next;
  newNode.prev = this.current;
  if (this.current.next != null) {
    this.current.next.prev = newNode;
  }
  this.current.next = newNode;
  this.current = this.current.next;
}

linkedList.prototype.remove = function() {
  var curr = this.current;
  if (curr.prev != null) {
    if (curr.next == null) {
      this.current = curr.prev;
      this.current.next = null;
    } else {
      // Might need to check this
      curr.next.prev = curr.prev;
      curr.prev.next = curr.next;
      this.current = curr.prev;
    }
  }
}

linkedList.prototype.decreaseCurrent = function(count) {
  while ((count--) != 0) {
    this.current = this.current.prev;
  }
}

linkedList.prototype.increaseCurrent = function(count) {
  while ((count--) != 0) {
    this.current = this.current.next;
  }
}
