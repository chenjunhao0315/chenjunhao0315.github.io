class Item{
    constructor(x, y, data, index) {
        this.x = x;
        this.y = y;
        this.data = data;
        this.index = index;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    
    contains(item) {
        return (
            item.x >= this.x - this.w &&
            item.x <= this.x + this.w &&
            item.y >= this.y - this.h &&
            item.y <= this.y + this.h
        );
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(point) {
        let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
        return d <= this.rSquared;
    }

    intersects(range) {
        var xDist = Math.abs(range.x - this.x);
        var yDist = Math.abs(range.y - this.y);

        var r = this.r;

        var w = range.w;
        var h = range.h;

        var edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

        if (xDist > (r + w) || yDist > (r + h))
            return false;

        if (xDist <= w || yDist <= h)
            return true;

        return edges <= this.rSquared;
  }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.item = [];
        this.divided = false;
        this.ne = null;
        this.nw = null;
        this.se = null;
        this.sw = null;
    }
    
    clear() {
        this.item = [];
        this.divided = false;
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
    }
    
    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!range.intersects(this.boundary)) {
            return found;
        }

        for (let p of this.item) {
            if (range.contains(p)) {
                found.push(p);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
      }
    
    query_debug(range, found) {
        if (!found) {
            found = [];
        }

        if (!range.intersects(this.boundary)) {
            print('return');
            return found;
        }

        for (let p of this.item) {
            if (range.contains(p)) {
                print('push here');
                print(this.boundary);
                found.push(p);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
      }
    
    addItem(x, y, item, index) {
        this.insert(new Item(x, y, item, index));
    }
    
    insert(item) {
        if (!this.boundary.contains(item)) {
            //print('hi');
            return false;
        }
        
        if (this.item.length < this.capacity) {
            this.item.push(item);
            return true;
        }
        
        if (!this.divided) {
            this.subdivide();
        }
        
        if (this.northeast.insert(item)) {
            return true;
        } else if (this.northwest.insert(item)) {
            return true;
        } else if (this.southeast.insert(item)) {
            return true;
        } else if (this.southwest.insert(item)) {
            return true;
        }
        
    }
    
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        let ne = new Rectangle(x + w, y - h, w, h);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w, y - h, w, h);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w, y + h, w, h);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w, y + h, w, h);
        this.southwest = new QuadTree(sw, this.capacity);

        this.divided = true;
    }
}